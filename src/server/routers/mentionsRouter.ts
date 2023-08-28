import { z } from "zod";
import { prisma } from "../prisma";
import { protectedProcedure, router } from "../trpc";
import { MentionType } from "~/lib/types";

export const mentionsRouter = router({
  applyMention: protectedProcedure
    .input(
      z.object({
        source: z.object({
          id: z.string(),
          type: z.nativeEnum(MentionType),
        }),
        targets: z
          .object({
            id: z.string(),
            type: z.nativeEnum(MentionType),
          })
          .array(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      let mentions = await prisma.mentions.findMany({
        where: {
          sourceId: input.source.id,
          sourceType: input.source.type,
        },
      });
      const existingTargetIds = mentions.map((m) => m.targetId);
      const newTargets = input.targets.filter(
        (t) => !existingTargetIds.includes(t.id),
      );
      const targetsToRemove = mentions
        .filter(
          (mention) =>
            !input.targets.map((t) => t.id).includes(mention.targetId),
        )
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
          sourceId: input.source.id,
          sourceType: input.source.type,
          targetId: target.id,
          targetType: target.type,
        })),
      });
      mentions = await prisma.mentions.findMany({
        where: {
          sourceId: input.source.id,
          sourceType: input.source.type,
        },
      });
      return mentions;
    }),
});
