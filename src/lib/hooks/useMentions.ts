import { Campaign, CampaignSessions, Character, Page } from "@prisma/client";
import { trpc } from "../trpc-client";
import { MentionType } from "../types";
import { PagePreview } from "../pages";

export type AttachToProps = {
  source?: {
    id: string;
  };
  fieldName?: string;
};

export default function useMentions({ source, fieldName }: AttachToProps) {
  const applyMentions = trpc.mentions.applyMention.useMutation();

  function onChange(ids: string[]) {
    if (!source || !fieldName) return;

    applyMentions.mutate({
      sourceId: source.id,
      targetIds: ids,
      fieldName,
    });
  }

  function onMentionsChange(pages: PagePreview[]) {
    console.log(pages);
    onChange(pages.map((c) => c.id));
  }

  return { onMentionsChange };
}
