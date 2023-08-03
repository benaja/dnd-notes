import { trpc } from "~/lib/trpc-client";
import Link from "next/link";
import { useSession } from "next-auth/react";
// import CreateCampaignDialog from "~/app1/(app)/dashboard/CreateCampaignDialog";
// const CreateCampaignDialog = dynamic(() => import("./CreateCampaignDialog"), {
//   ssr: false,
// });

export default function Dashboard(props) {
  const session = useSession();

  const campaigns = trpc.campaign.getAll.useQuery();

  return (
    <div>
      {/* <CreateCampaignDialog /> */}

      <h2 className="mt-10 text-2xl">Campaigns</h2>
      <div className="mt-2 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
        {campaigns.data?.map((campaign) => (
          <Link
            href={`/campaigns/${campaign.id}`}
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
}
