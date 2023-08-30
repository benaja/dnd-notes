import { z } from "zod";
import { prisma } from "../prisma";
import { protectedProcedure, router } from "../trpc";
import { MentionType } from "~/lib/types";
import { pagePreviewFields } from "~/lib/pages";

const mentionObject = z
  .object({
    id: z.string(),
  })
  .optional()
  .nullable();

export const mentionsRouter = router({
  applyMention: protectedProcedure
    .input(
      z.object({
        sourceId: z.string(),
        targetIds: z.array(z.string()),
        fieldName: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      let mentions = await prisma.mentions.findMany({
        where: {
          sourceId: input.sourceId,
          fieldName: input.fieldName,
        },
      });
      const existingTargetIds = mentions.map((m) => m.targetId);
      const newTargets = input.targetIds.filter(
        (t) => !existingTargetIds.includes(t),
      );
      const targetsToRemove = mentions
        .filter((mention) => !input.targetIds.includes(mention.targetId))
        .map((m) => m.id);
      await prisma.mentions.deleteMany({
        where: {
          id: {
            in: targetsToRemove,
          },
        },
      });
      await prisma.mentions.createMany({
        data: newTargets.map((target) => ({
          sourceId: input.sourceId,
          targetId: target,
          fieldName: input.fieldName,
        })),
      });
      const allMentions = prisma.mentions.findMany({
        where: {
          sourceId: input.sourceId,
          fieldName: input.fieldName,
        },
      });
      return allMentions;
    }),

  getMentions: protectedProcedure
    .input(
      z.object({
        targetId: z.string(),
        fieldName: z.string().optional().nullable(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const mentions = await prisma.mentions.findMany({
        where: {
          targetId: input.targetId,
          fieldName: input.fieldName || undefined,
        },
        include: {
          source: {
            select: pagePreviewFields,
          },
        },
      });

      return mentions.map((m) => m.source);
    }),
});
