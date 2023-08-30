import { useRouter } from "next/router";
import AppLayout from "~/components/layouts/AppLayout";
import { trpc } from "~/lib/trpc-client";
import { NextPageWithLayout } from "~/pages/_app";
import EditPageForm from "~/components/pages/EditPageForm";
import { CampaignContext } from "../..";

const Page: NextPageWithLayout = function Page() {
  const router = useRouter();
  // const campaign = null;
  const { data: campaign } = trpc.campaign.getById.useQuery(
    router.query.campaign as string,
  );

  const { data: page } = trpc.page.getById.useQuery(
    router.query.page as string,
  );

  if (!page || !campaign) return <></>;

  console.log("page", page.id);
  return (
    <CampaignContext.Provider value={campaign}>
      <div>
        <EditPageForm page={page} />

        <h2 className="text-xl font-medium">Mentioned at</h2>
        <h3 className="text-lg font-medium">Sessions</h3>
        {/* <div className="space-y-4">
        {mentions?.sessions.map((session) => (
          <Link
            className="flex justify-between rounded-md bg-white p-4 hover:bg-gray-100"
            key={session.id}
            href={`/app/${router.query.campaign}/sessions/${session.id}`}
          >
            <span>{session.title}</span>
            <span>{format(session.date, "dd.mm.yyyy")}</span>
          </Link>
        ))}
      </div> */}
      </div>
    </CampaignContext.Provider>
  );
};

Page.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export default Page;
