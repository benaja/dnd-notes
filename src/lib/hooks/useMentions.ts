import { Campaign, CampaignSessions, Character } from "@prisma/client";
import { trpc } from "../trpc-client";
import { MentionType } from "../types";

export default function useMentions({
  campaign,
  session,
  character,
}: {
  campaign?: Campaign | null;
  session?: CampaignSessions | null;
  character?: Character | null;
}) {
  const applyMentions = trpc.mentions.applyMention.useMutation();

  function getSource(): {
    id: string;
    type: MentionType;
  } | null {
    if (campaign) {
      return {
        id: campaign.id,
        type: MentionType.campaign,
      };
    }
    if (session) {
      return {
        id: session.id,
        type: MentionType.session,
      };
    }
    if (character) {
      return {
        id: character.id,
        type: MentionType.character,
      };
    }
    return null;
  }

  function onChange(type: MentionType, ids: string[]) {
    const source = getSource();
    if (!source) return;

    applyMentions.mutate({
      source,
      targets: ids.map((id) => ({
        id: id,
        type: MentionType.character,
      })),
    });
  }

  function onCharacterChange(characters: Character[]) { 
    console.log(characters);
    onChange(
      MentionType.character,
      characters.map((c) => c.id),
    );
  }

  return { onCharacterChange };
}
