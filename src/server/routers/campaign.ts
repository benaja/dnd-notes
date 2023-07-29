import { z } from "zod";
import { campaignSchema } from "~/app/(app)/dashboard/shema";
import { createTRPCRouter, protectedProcedure } from "~/server/trpc";

export const campaignRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const campaign = await ctx.prisma.campaign.findUnique({
        where: {
          id: input,
        },
      });

      return campaign;
    }),

  create: protectedProcedure
    .input(campaignSchema)
    .mutation(async ({ input, ctx }) => {
      const campaign = await ctx.prisma.campaign.create({
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
      const campaign = await ctx.prisma.campaign.update({
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
