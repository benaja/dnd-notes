import { z } from "zod";
import { campaignSchema } from "~/app/(app)/dashboard/shema";
import { createTRPCRouter, protectedProcedure } from "~/server/trpc";

export const campaignRouter = createTRPCRouter({
  createCampaign: protectedProcedure
    .input(campaignSchema)
    .mutation(async ({ input, ctx }) => {
      console.log("session", ctx.session.user.id as string);
      const campaign = await ctx.prisma.campaign.create({
        data: {
          ...input,
          users: {
            create: [
              {
                role: "OWNER",
                user: {
                  connect: {
                    id: ctx.session.user.id as string,
                  },
                },
              },
            ],
          },
        },
      });

      return campaign;
    }),
});
