import { trpc } from "~/lib/trpc-client";
import { Button } from "../ui/button";
import { CampaignContext } from "~/pages/app/[campaign]";
import { useContext } from "react";
import { useRouter } from "next/router";
import useDialog from "~/lib/hooks/useDialog";
import CreatePageModal from "../pages/CreatePageModal";
import { PageType } from "~/jsonTypes";

export default function CreateSessionButton() {
  const router = useRouter();
  const [dialog, showDialog] = useDialog();
  const createSession = trpc.session.create.useMutation({
    onSuccess(data) {
      router.push(`/app/${data.campaignId}/sessions/${data.id}`);
    },
  });
  const campaign = useContext(CampaignContext);

  function onClick() {
    if (!campaign) return;

    createSession.mutate({
      campaignId: campaign.id,
    });
  }

  return (
    <div>
      {dialog}
      <Button
        onClick={() => {
          showDialog("Create Session", (onClose) => (
            <CreatePageModal type={PageType.Session} onCreated={onClose} />
          ));
        }}
      >
        Create Session
      </Button>
    </div>
  );
}
