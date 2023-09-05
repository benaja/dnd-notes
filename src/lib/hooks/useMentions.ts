import { Campaign, CampaignSessions, Character, Page } from "@prisma/client";
import { trpc } from "../trpc-client";
import { MentionType } from "../types";
import { PagePreview } from "../pages";
import { useCallback } from "react";

export type AttachToProps = {
  source?: {
    id: string;
  };
  fieldName?: string;
};

export default function useMentions({ source, fieldName }: AttachToProps) {
  const applyMentions = trpc.mentions.applyMention.useMutation().mutate;

  const onChange = useCallback(
    (ids: string[]) => {
      if (!source || !fieldName) return;

      applyMentions({
        sourceId: source.id,
        targetIds: ids,
        fieldName,
      });
    },
    [source, fieldName, applyMentions],
  );

  const onMentionsChange = useCallback(
    (pages: { id: string }[]) => {
      onChange(pages.map((c) => c.id));
    },
    [onChange],
  );

  return { onMentionsChange };
}
