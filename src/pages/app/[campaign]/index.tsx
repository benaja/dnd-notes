import { Campaign, Character } from "@prisma/client";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";
import CreateSessionButton from "~/components/campaign/CreateSessionButton";
import ListCharacters from "~/components/campaign/characters/ListCharacters";
import EditableText from "~/components/fields/EditableText";
import AppLayout from "~/components/layouts/AppLayout";
import { Button } from "~/components/ui/button";
import { trpc } from "~/lib/trpc-client";
import { NextPageWithLayout } from "~/pages/_app";
import { format } from "date-fns";
import AppLink from "~/components/ui/AppLink";
import useDebounce from "~/lib/hooks/useDebounce";
import useMentions from "~/lib/hooks/useMentions";
import { EditorEvents } from "~/components/lexical-editor/Editor";
import { CharacterType } from "~/jsonTypes";
const EditorField = dynamic(
  () => import("~/components/fields/inputs/EditorInput"),
  {
    ssr: false,
  },
);

export const CampaignContext = createContext<Campaign | null>(null);

const Page: NextPageWithLayout = function Campaign() {
  const router = useRouter();
  const utils = trpc.useContext();

  const { data: campaign } = trpc.campaign.getById.useQuery(
    router.query.campaign as string,
  );
  const { onCharacterChange } = useMentions({
    campaign: campaign,
  });

  function onEvent(evnet: EditorEvents, payload: any) {
    if (evnet === EditorEvents.onCharactersChanged) {
      onCharacterChange(payload as Character[]);
    }
  }

  const updateMutation = trpc.campaign.update.useMutation();

  const updateCampaign = useDebounce((value: typeof campaign) => {
    if (!value) return;
    updateMutation.mutate(value);
  });

  if (!campaign) {
    return null;
  }

  function editCampaign(key: string, value: any) {
    if (!campaign) return;
    const newCampaign = {
      ...campaign,
      [key]: value,
    };

    utils.campaign.getById.setData(campaign.id, newCampaign);
    updateCampaign(newCampaign);
  }

  return (
    <CampaignContext.Provider value={campaign}>
      <div>
        <EditableText
          value={campaign.title}
          className="text-3xl"
          onInput={(value) => editCampaign("title", value)}
        >
          {({ value, ...props }) => {
            return <h1 {...props}>{value}</h1>;
          }}
        </EditableText>

        <p className="mt-4 text-lg font-bold">Players</p>
        <ListCharacters
          characters={campaign.characters.filter(
            (c) => c.type === CharacterType.Player,
          )}
          campaignId={campaign.id}
          type={CharacterType.Player}
          // onCreated={(character) => {
          //   editCampaign("characters", [...campaign.characters, character]);
          // }}
        />

        <p className="mt-4 text-lg font-bold">NPCs</p>
        <ListCharacters
          characters={campaign.characters.filter(
            (c) => c.type === CharacterType.NPC,
          )}
          campaignId={campaign.id}
          type={CharacterType.NPC}
          // onCreated={(character) => {
          //   editCampaign("characters", [...campaign.characters, character]);
          // }}
        />

        <p className="mt-4 text-lg font-bold">Campaign Notes</p>
        <EditorField
          value={campaign.notes}
          onChange={(value) => editCampaign("notes", value)}
          onEvent={onEvent}
        />

        <div className="mt-8 flex items-start justify-between">
          <p className="text-lg font-bold">Sessions</p>
          <CreateSessionButton />
        </div>
        <div>
          {campaign.sessions.map((session) => (
            <AppLink
              href={`/app/${campaign.id}/session/${session.id}`}
              key={session.id}
              className="block"
            >
              {session.title}
              {format(session.date, "PPP")}
            </AppLink>
          ))}
        </div>
      </div>
    </CampaignContext.Provider>
  );
};

Page.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export default Page;
