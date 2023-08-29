import { trpc } from "~/lib/trpc-client";
import { Button } from "../ui/button";
import { CampaignContext } from "~/pages/app/[campaign]";
import { useContext } from "react";
import { useRouter } from "next/router";

export default function CreateSessionButton() {
  const router = useRouter();
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
      <Button onClick={onClick}>Create Session</Button>
    </div>
  );
}
