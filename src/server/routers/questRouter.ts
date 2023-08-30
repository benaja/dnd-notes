import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { prisma } from "../prisma";

export const questRouter = router({
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const quest = await prisma.quest.findUnique({
        where: {
          id: input,
        },
      });

      return quest;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        campaignId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const quest = await prisma.quest.create({
        data: {
          title: "New Session",
          campaign: {
            connect: {
              id: input.campaignId,
            },
          },
        },
      });

      return quest;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        fields: z.array(
          z.object({
            name: z.string(),
            value: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const session = await prisma.campaignSessions.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });

      return session;
    }),
});
