import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { prisma } from "../prisma";

export const sessionRouter = router({
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const session = await prisma.campaignSessions.findUnique({
        where: {
          id: input,
        },
      });

      return session;
    }),

  create: protectedProcedure
    .input(
      z.object({
        campaignId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const session = await prisma.campaignSessions.create({
        data: {
          date: new Date(),
          title: "New Session",
          campaign: {
            connect: {
              id: input.campaignId,
            },
          },
        },
      });

      return session;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        notes: z.string().optional().nullable(),
        date: z.date(),
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
