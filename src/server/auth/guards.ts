import { Context } from "../context";
import { prisma } from "../prisma";

export const isAllowedToAccessCampaign = async (
  ctx: Context,
  campaignId: string | undefined,
) => {
  if (!ctx.session?.user) {
    throw new Error("Not logged in");
  }
  if (!campaignId) {
    throw new Error("Campaign ID is missing");
  }

  const campaign = await prisma.campaign.findUnique({
    where: {
      id: campaignId,
      users: {
        some: {
          userId: ctx.session.user.id,
        },
      },
    },
    include: {
      users: {
        where: {
          userId: ctx.session.user.id,
        },
      },
    },
  });

  if (!campaign) {
    throw new Error("Campaign not found");
  }

  return true;
};

export const isAllowedToAccessPage = async (ctx: Context, pageId: string) => {
  const page = await prisma.page.findUnique({
    where: {
      id: pageId,
    },
  });

  if (!page) {
    throw new Error("Page not found");
  }

  return isAllowedToAccessCampaign(ctx, page.campaignId);
};
