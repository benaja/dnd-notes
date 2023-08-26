import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ListCharacters from "~/components/campaign/characters/ListCharacters";
import { CharacterType } from "~/components/campaign/shema";
import EditableText from "~/components/fields/EditableText";
import AppLayout from "~/components/layouts/AppLayout";
import { trpc } from "~/lib/trpc-client";
import { NextPageWithLayout } from "~/pages/_app";
const Editor = dynamic(
  () => import("~/components/fields/lexical-editor/Editor"),
  {
    ssr: false,
  },
);

const Page: NextPageWithLayout = function Campaign() {
  const router = useRouter();

  const { data } = trpc.campaign.getById.useQuery(
    router.query.campaign as string,
  );
  const [campaign, setCampaign] = useState(data);
  const updateMutation = trpc.campaign.update.useMutation();

  useEffect(() => {
    if (!data) return;

    setCampaign(data);
  }, [data]);

  if (!campaign || !data) {
    return null;
  }

  function editCampaign(key: string, value: any) {
    setCampaign((prev) =>
      prev
        ? {
            ...prev,
            [key]: value,
          }
        : null,
    );
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

      <p className="text-lg font-bold">NPCs</p>
      <ListCharacters
        characters={campaign.characters.filter(
          (c) => c.type === CharacterType.NPC,
        )}
        campaignId={campaign.id}
        type={CharacterType.NPC}
        onCreated={(character) => {
          editCampaign("characters", [...campaign.characters, character]);
        }}
      />
      <Editor />

      {/* <QuillInput /> */}
      {/* <RichtTextInput /> */}
    </div>
  );
};

Page.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export default Page;
