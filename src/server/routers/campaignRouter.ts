import { z } from "zod";
import { router, protectedProcedure } from "~/server/trpc";
import { prisma } from "~/server/prisma";
import { campaignSchema } from "~/components/campaign/shema";

export const campaignRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const campaigns = await prisma.campaign.findMany({
      where: {
        users: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
    });

    return campaigns;
  }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const campaign = await prisma.campaign.findUnique({
        where: {
          id: input,
        },
        include: {
          characters: true,
          sessions: {
            orderBy: {
              date: "desc",
            },
          },
        },
      });

      return campaign;
    }),

  create: protectedProcedure
    .input(campaignSchema)
    .mutation(async ({ input, ctx }) => {
      const campaign = await prisma.campaign.create({
        data: {
          ...input,
          users: {
            create: [
              {
                role: "OWNER",
                user: {
                  connect: {
                    id: ctx.session.user.id,
                  },
                },
              },
            ],
          },
        },
      });

      return campaign;
    }),

  update: protectedProcedure
    .input(campaignSchema)
    .mutation(async ({ input, ctx }) => {
      const campaign = await prisma.campaign.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });

      return campaign;
    }),
});
