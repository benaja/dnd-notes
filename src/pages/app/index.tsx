import { trpc } from "~/lib/trpc-client";
import Link from "next/link";
import { Campaign } from "@prisma/client";
import { NextPageWithLayout } from "../_app";
import AppLayout from "~/components/layouts/AppLayout";
import CreateCampaignDialog from "~/components/campaign/CreateCampaignDialog";

const Page: NextPageWithLayout = function Dashboard() {
  const campaigns = trpc.campaign.getAll.useQuery();

  return (
    <div>
      <CreateCampaignDialog />

      <h2 className="text-2xl">Campaigns</h2>
      <div className="mt-2 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
        {campaigns.data?.map((campaign: Campaign) => (
          <Link
            href={`/app/${campaign.id}`}
            key={campaign.id}
            className="bg-white p-4"
          >
            <h2 className="text-xl">{campaign.title}</h2>
            <p>{campaign.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

Page.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export default Page;
