import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import {
  Fields,
  PageType,
  PreviewField,
  PreviewFields,
  QuestStatus,
} from "~/jsonTypes";
import { prisma } from "../prisma";
import { settingsRouter } from "./settingsRouter";

const fieldsSchema = z.record(
  z.object({
    value: z.any().optional().nullable(),
  }),
);
export type FieldInput = z.infer<typeof fieldsSchema>;

function getFields(fields: Fields, input: FieldInput): Fields {
  return Object.keys(fields).reduce(
    (obj, key) => ({
      ...obj,
      [key]: {
        value: input[key]?.value ?? fields[key].value,
        type: fields[key].type,
        label: fields[key].label,
        width: fields[key].width,
        options: fields[key].options,
        position: fields[key].position,
        showOnPreview: fields[key].showOnPreview,
        showOnCreate: fields[key].showOnCreate,
      },
    }),
    {},
  );
}

function getPreviewFields(fields: Fields, input: any): PreviewFields {
  return Object.keys(fields).reduce((obj, key) => {
    {
      if (!fields[key].showOnPreview) return obj;

      return {
        ...obj,
        [key]: {
          value: input[key]?.value ?? fields[key].value,
          type: fields[key].type,
          label: fields[key].label,
        },
      };
    }
  }, {});
}

export const pageRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required").max(255),
        type: z.nativeEnum(PageType),
        campaignId: z.string(),
        fields: fieldsSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const caller = settingsRouter.createCaller(ctx);
      const fields = await caller.fields(input.type);
      const fieldValues = getFields(fields, input.fields);
      const page = await prisma.page.create({
        data: {
          title: input.title,
          type: input.type,
          fields: fieldValues,
          previewFields: getPreviewFields(fields, input.fields),
          campaign: {
            connect: {
              id: input.campaignId,
            },
          },
        },
      });

      return page;
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const page = await prisma.page.findUnique({
        where: {
          id: input,
        },
      });

      page?.type === "item";

      return page;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1, "Title is required").max(255),
        type: z.nativeEnum(PageType),
        fields: fieldsSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const caller = settingsRouter.createCaller(ctx);
      const fields = await caller.fields(input.type);
      const fieldValues = getFields(fields, input.fields);
      const page = await prisma.page.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          fields: fieldValues,
          previewFields: getPreviewFields(fields, input.fields),
        },
      });

      return page;
    }),

  filter: protectedProcedure
    .input(
      z.object({
        campaignId: z.string(),
        type: z.array(z.nativeEnum(PageType)).optional().nullable(),
        fields: z.record(
          z.object({
            value: z.any().optional().nullable(),
          }),
        ),
      }),
    )
    .query(async ({ input, ctx }) => {
      const pages = await prisma.page.findMany({
        where: {
          campaignId: input.campaignId,
          type: {
            in: input.type || [],
          },
          AND: [
            ...Object.keys(input.fields).map((key) => ({
              fields: {
                path: `$.${key}.value`,
                equals: input.fields[key].value,
              },
            })),
          ],
        },
      });

      return pages;
    }),
});
