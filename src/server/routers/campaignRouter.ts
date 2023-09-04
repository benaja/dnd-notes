import { z } from "zod";
import { router, protectedProcedure } from "~/server/trpc";
import { prisma } from "~/server/prisma";
import { campaignSchema } from "~/components/campaign/shema";
import { pagePreviewFields } from "~/lib/pages";
import { PageType } from "~/jsonTypes";
import { settingsRouter } from "./settingsRouter";
import { isAllowedToAccessCampaign } from "../auth/guards";

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
      await isAllowedToAccessCampaign(ctx, input);

      const campaign = await prisma.campaign.findUnique({
        where: {
          id: input,
        },
        include: {
          pages: {
            select: pagePreviewFields,
          },
          characters: true,
          sessions: {
            orderBy: {
              date: "desc",
            },
          },
        },
      });

      if (!campaign) {
        throw new Error("Campaign not found");
      }

      const landingPage = await prisma.page.findFirst({
        where: {
          campaignId: input,
          type: PageType.CampaignLandingPage,
        },
      });

      if (!landingPage) {
        throw new Error("Campaign landing page not found");
      }

      return {
        ...campaign,
        landingPage,
      };
    }),

  create: protectedProcedure
    .input(campaignSchema)
    .mutation(async ({ input, ctx }) => {
      const caller = settingsRouter.createCaller(ctx);
      const landingPageFields = await caller.fields(
        PageType.CampaignLandingPage,
      );

      const campaign = await prisma.campaign.create({
        data: {
          ...input,
          pages: {
            create: [
              {
                title: input.title,
                type: PageType.CampaignLandingPage,
                fields: landingPageFields,
              },
            ],
          },
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
    .input(
      campaignSchema.extend({
        id: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await isAllowedToAccessCampaign(ctx, input.id);
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

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      await isAllowedToAccessCampaign(ctx, input);
      await prisma.page.deleteMany({
        where: {
          campaignId: input,
        },
      });

      await prisma.campaign.delete({
        where: {
          id: input,
        },
      });

      return true;
    }),
});
