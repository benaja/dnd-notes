import { trpc } from "~/lib/trpc-client";
import { Character, Page } from "@prisma/client";
import { CharacterType, PageType } from "~/jsonTypes";
import { useContext } from "react";
import { CampaignContext } from "~/pages/app/[campaign]";
import CreatePageForm, { PageFormValues } from "./CreatePageForm";

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
