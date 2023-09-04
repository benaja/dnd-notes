import { trpc } from "~/lib/trpc-client";
import Link from "next/link";
import { Campaign } from "@prisma/client";
import { NextPageWithLayout } from "../_app";
import AppLayout from "~/components/layouts/AppLayout";
import CreateCampaignDialog from "~/components/campaign/CreateCampaignDialog";
import AppContainer from "~/components/ui/AppContainer";
import Icon from "~/components/ui/Icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import useConfirmDialog from "~/lib/hooks/useConfirmDialog";

const Page: NextPageWithLayout = function Dashboard() {
  const { data: campaigns } = trpc.campaign.getAll.useQuery();
  const [confirmDialog, showConfirm] = useConfirmDialog();
  const utils = trpc.useContext();
  const deleteCampaignMutation = trpc.campaign.delete.useMutation({
    onSuccess() {
      utils.campaign.getAll.invalidate();
      deleteCampaignMutation.reset();
    },
  });

  return (
    <AppContainer>
      {confirmDialog}
      <div className="mt-6 flex justify-between">
        <h1 className="text-2xl">Campaigns</h1>
        <CreateCampaignDialog />
      </div>

      {campaigns?.length === 0 && (
        <p className="font-light text-gray-600">
          You don't have any campaigns yet. Create one to get started.
        </p>
      )}
      <div className="mt-4 space-y-2">
        {campaigns?.map((campaign: Campaign) => (
          <Link
            href={`/app/${campaign.id}`}
            key={campaign.id}
            className=" flex justify-between bg-white px-4 py-3 hover:bg-gray-100"
          >
            <h2 className="text-xl">{campaign.title}</h2>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Icon>more_vert</Icon>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    showConfirm(
                      "Do you really want to delete this campaign?",
                      () => deleteCampaignMutation.mutate(campaign.id),
                    );
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Link>
        ))}
      </div>
    </AppContainer>
  );
};

Page.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export default Page;
