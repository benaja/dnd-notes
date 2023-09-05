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
import { pagePreviewFields } from "~/lib/pages";
import {
  isAllowedToAccessCampaign,
  isAllowedToAccessPage,
} from "../auth/guards";

const fieldsSchema = z.array(
  z.object({
    name: z.string(),
    value: z.any().optional().nullable(),
  }),
);
export type FieldInput = z.infer<typeof fieldsSchema>;

function getFields(fields: Fields, input: FieldInput): Fields {
  return fields.map((field) => ({
    ...field,
    value: input.find((f) => f.name === field.name)?.value ?? field.value,
  }));
}

function getPreviewFields(fields: Fields, input: FieldInput): PreviewFields {
  return fields
    .filter((field) => field.showOnPreview)
    .map((field) => ({
      type: field.type,
      name: field.name,
      label: field.label,
      value: input.find((f) => f.name === field.name)?.value ?? field.value,
    }));
}

function getTitle(fields: Fields): string {
  const titleField = fields.find(
    (field) => field.name === "title" && field.type === "text",
  );

  if (!titleField) {
    throw new Error("Title field not found");
  }
  if (typeof titleField.value !== "string") {
    throw new Error("Title field is not a string");
  }
  if (titleField.value.length === 0) {
    throw new Error("Title field is empty");
  }

  return titleField.value;
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
      await isAllowedToAccessCampaign(ctx, input.campaignId);

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
      if (!page) {
        throw new Error("Page not found");
      }
      await isAllowedToAccessCampaign(ctx, page.campaignId);

      page?.type === "item";

      return page;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.nativeEnum(PageType),
        title: z.string().min(1, "Title is required").max(255),
        fields: fieldsSchema,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await isAllowedToAccessPage(ctx, input.id);
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
        id: z.string().or(z.array(z.string())).optional().nullable(),
        campaignId: z.string(),
        type: z.array(z.nativeEnum(PageType)).optional().nullable(),
        title: z.string().optional().nullable(),
        limit: z.number().optional().nullable(),
        fields: z.record(z.any().optional().nullable()).optional().nullable(),
      }),
    )
    .query(async ({ input, ctx }) => {
      await isAllowedToAccessCampaign(ctx, input.campaignId);

      const pages = await prisma.page.findMany({
        where: {
          id: input.id
            ? {
                in: Array.isArray(input.id) ? input.id : [input.id],
              }
            : undefined,
          campaignId: input.campaignId,
          title: input.title
            ? {
                contains: input.title,
              }
            : undefined,
          type: input.type
            ? {
                in: input.type || [],
                not: PageType.CampaignLandingPage,
              }
            : undefined,
          AND: [
            ...Object.keys(input.fields || {})
              .filter((key) => input.fields?.[key])
              .flatMap((key) => [
                {
                  fields: {
                    path: `$[*].name`,
                    array_contains: key,
                  },
                },
                {
                  fields: {
                    path: `$[*].value`,
                    array_contains: input.fields?.[key],
                  },
                },
              ]),
          ],
        },
        select: pagePreviewFields,
        take: input.limit || 100,
        orderBy: {
          createdAt: input.type?.includes(PageType.Session) ? "desc" : "asc",
        },
      });

      return pages;
    }),
});
