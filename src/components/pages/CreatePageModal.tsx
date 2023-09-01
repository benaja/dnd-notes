import { trpc } from "~/lib/trpc-client";
import { Page } from "@prisma/client";
import { PageType } from "~/jsonTypes";
import { useContext } from "react";
import { CampaignContext } from "~/pages/app/[campaign]";
import CreatePageForm, { PageFormValues } from "./CreatePageForm";

function getDialogTitleByType(type: PageType) {
  switch (type) {
    case PageType.Session:
      return "Create session";
    case PageType.Quest:
      return "Create quest";
    case PageType.NPC:
      return "Create NPC";
    case PageType.Player:
      return "Create player";
    case PageType.Location:
      return "Create location";
    case PageType.Item:
      return "Create item";
    default:
      return "Create page";
  }
}

export default function CreatePageModal({
  type,
  onCreated,
}: {
  type: PageType;
  onCreated?: (page: Page) => void;
}) {
  const utils = trpc.useContext();
  const campaign = useContext(CampaignContext);
  const fields = trpc.settings.fields.useQuery(type).data;
  const createPageMutation = trpc.page.create.useMutation({
    onSuccess(data) {
      createPageMutation.reset();
      utils.campaign.getById.invalidate(campaign?.id);
      onCreated?.(data);
    },
  });

  async function onSubmit(values: PageFormValues) {
    if (!campaign) return;

    const page = await createPageMutation.mutateAsync({
      ...values,
      campaignId: campaign?.id,
      type,
    });
  }

  if (!fields) return <></>;
  return <CreatePageForm type={type} fields={fields} onSubmit={onSubmit} />;
}
