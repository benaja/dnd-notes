import { z } from "zod";
import { prisma } from "../prisma";
import { protectedProcedure, router } from "../trpc";
import { MentionType } from "~/lib/types";

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

  getMentions: protectedProcedure
    .input(
      z.object({
        campaign: mentionObject,
        session: mentionObject,
        character: mentionObject,
      }),
    )
    .query(async ({ input, ctx }) => {
      let mentionType: MentionType | null = null;
      let mentionId: string | null = null;

      if (input.campaign) {
        mentionType = MentionType.campaign;
        mentionId = input.campaign.id;
      } else if (input.session) {
        mentionType = MentionType.session;
        mentionId = input.session.id;
      } else if (input.character) {
        mentionType = MentionType.character;
        mentionId = input.character.id;
      }

      if (!mentionType || !mentionId)
        return {
          campaigns: [],
          sessions: [],
          characters: [],
        };

      const mentions = await prisma.mentions.findMany({
        where: {
          targetId: mentionId,
          targetType: mentionType,
        },
      });

      const campaigns = await prisma.campaign.findMany({
        where: {
          id: {
            in: mentions
              .filter((m) => m.sourceType === MentionType.campaign)
              .map((m) => m.sourceId),
          },
        },
      });
      const sessions = await prisma.campaignSessions.findMany({
        where: {
          id: {
            in: mentions
              .filter((m) => m.sourceType === MentionType.session)
              .map((m) => m.sourceId),
          },
        },
      });
      const characters = await prisma.character.findMany({
        where: {
          id: {
            in: mentions
              .filter((m) => m.sourceType === MentionType.character)
              .map((m) => m.sourceId),
          },
        },
      });

      return {
        campaigns,
        sessions,
        characters,
      };
    }),
});
