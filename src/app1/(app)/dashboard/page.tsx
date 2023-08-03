import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import User from "../../user";
import { FetchButton, LoginButton, LogoutButton } from "../../auth";
import { trpc } from "~/lib/trpc-client";
import dynamic from "next/dynamic";
import prisma from "~/server/prisma";
import Link from "next/link";
const CreateCampaignDialog = dynamic(() => import("./CreateCampaignDialog"), {
  ssr: false,
});

export default async function Home() {
  const session = await getServerSession(authOptions);

  const campaigns = await prisma.campaign.findMany();

  return (
    <div>
      <h1 className="text-3xl"> Hey {session?.user?.name ?? "there"}!</h1>

      <CreateCampaignDialog />

      <h2 className="mt-10 text-2xl">Campaigns</h2>
      <div className="mt-2 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
        {campaigns.map((campaign) => (
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
