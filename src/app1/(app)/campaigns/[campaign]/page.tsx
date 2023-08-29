"use client";

import { useCallback, useEffect, useState } from "react";
import ListCharacters from "~/components/campaign/characters/ListCharacters";
import { CharacterType } from "~/components/campaign/shema";
import EditableText from "~/components/fields/EditableText";
import Editor from "~/components/lexical-editor/Editor";
import QuillInput from "~/components/fields/RichtTextInput";
import { trpc } from "~/lib/trpc-client";

export default function Campaign({
  params,
}: {
  params: {
    campaign: string;
  };
}) {
  const { data } = trpc.campaign.getById.useQuery(params.campaign);
  const [campaign, setCampaign] = useState(data);
  const updateMutation = trpc.campaign.update.useMutation();

  useEffect(() => {
    if (!data) return;

    setCampaign(data);
  }, [data]);

  const editCampaign = useCallback((key: string, value: any) => {
    setCampaign((prev) =>
      prev
        ? {
            ...prev,
            [key]: value,
          }
        : null,
    );
  }, []);

  if (!campaign || !data) {
    return null;
  }

  function updateCampaign() {
    if (!campaign) return;
    updateMutation.mutate(campaign);
  }

  return (
    <div>
      <EditableText
        value={campaign.title}
        className="text-3xl"
        onInput={(value) => editCampaign("title", value)}
        onBlur={updateCampaign}
      >
        {({ value, ...props }) => {
          return <h1 {...props}>{value}</h1>;
        }}
      </EditableText>
      <EditableText
        className="my-4"
        value={campaign.description}
        onInput={(value) => editCampaign("description", value)}
        onBlur={updateCampaign}
      />

      <p className="text-lg font-bold">Players</p>
      <ListCharacters
        characters={campaign.characters.filter(
          (c) => c.type === CharacterType.Player,
        )}
        campaignId={campaign.id}
        type={CharacterType.Player}
        onCreated={(character) => {
          editCampaign("characters", [...campaign.characters, character]);
        }}
      />
      {/* <Editor /> */}

      {/* <QuillInput /> */}
      {/* <RichtTextInput /> */}
    </div>
  );
}
