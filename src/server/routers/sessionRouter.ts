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
        include: {
          content: true,
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
          content: {
            create: {
              value: "",
            },
          },
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
        content: z.string(),
        date: z.date(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const session = await prisma.campaignSessions.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          date: input.date,
          content: {
            update: {
              value: input.content,
            },
          },
        },
      });

      return session;
    }),
});
