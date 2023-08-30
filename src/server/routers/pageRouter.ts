import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { PageType } from "~/jsonTypes";
import { prisma } from "../prisma";
import { settingsRouter } from "./settingsRouter";

const fieldsSchema = z.array(
  z.object({
    name: z.string(),
    value: z.any().optional().nullable(),
  }),
);

type FieldInput = z.infer<typeof fieldsSchema>;

function getFields(
  fields: PrismaJson.FormField[],
  input: FieldInput,
): PrismaJson.FormField[] {
  return fields.map((field) => ({
    name: field.name,
    value: input.find((f) => f.name === field.name)?.value,
    type: field.type,
    label: field.label,
    width: field.width,
    options: field.options,
    showOnPreview: field.showOnPreview,
    showOnCreate: field.showOnCreate,
  }));
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
          previewFields: fieldValues.filter((f) => f.showOnPreview),
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
        // include: {
        //   fields: true,
        // },
      });

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
          previewFields: fieldValues.filter((f) => f.showOnPreview),
        },
      });

      return page;
    }),

  filter: protectedProcedure
    .input(
      z.object({
        campaignId: z.string(),
        type: z.array(z.nativeEnum(PageType)).optional().nullable(),
        fields: z
          .array(
            z.object({
              name: z.string(),
              value: z.any().optional().nullable(),
            }),
          )
          .optional()
          .nullable(),
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
            {
              fields: {
                path: "$[*].name",
                array_contains: "status",
              },
            },
            {
              fields: {
                path: "$[*].value",
                array_contains: "completed",
              },
            },
          ],
        },
      });

      return pages;
    }),
});
