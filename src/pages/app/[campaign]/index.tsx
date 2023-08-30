import { Campaign, Character } from "@prisma/client";
import { useRouter } from "next/router";
import { createContext, useEffect, useMemo, useState } from "react";
import CreatePageButton from "~/components/pages/CreatePageButton";
import ListCharacters from "~/components/campaign/characters/ListCharacters";
import EditableText from "~/components/fields/EditableText";
import AppLayout from "~/components/layouts/AppLayout";
import { trpc } from "~/lib/trpc-client";
import { NextPageWithLayout } from "~/pages/_app";
import { format } from "date-fns";
import useDebounce from "~/lib/hooks/useDebounce";
import { PageType } from "~/jsonTypes";
import EditorInput from "~/components/fields/inputs/EditorInput";
import parseISO from "date-fns/parseISO";
import Link from "next/link";
import QuestList from "~/components/quests/QuestList";

export const CampaignContext = createContext<Campaign | null>(null);

const Page: NextPageWithLayout = function Campaign() {
  const router = useRouter();
  const utils = trpc.useContext();

  const { data: campaign } = trpc.campaign.getById.useQuery(
    router.query.campaign as string,
  );

  return <></>;

  // function onEvent(evnet: EditorEvents, payload: any) {
  //   if (evnet === EditorEvents.onCharactersChanged) {
  //     onCharacterChange(payload as Character[]);
  //   }
  // }

  // const updateMutation = trpc.campaign.update.useMutation();

  // const updateCampaign = useDebounce((value: typeof campaign) => {
  //   if (!value) return;
  //   updateMutation.mutate(value);
  // });
  // const sessions = useMemo(
  //   () => campaign?.pages.filter((p) => p.type === PageType.Session),
  //   [campaign?.pages],
  // );

  // if (!campaign) {
  //   return null;
  // }

  // function editCampaign(key: string, value: any) {
  //   if (!campaign) return;
  //   const newCampaign = {
  //     ...campaign,
  //     [key]: value,
  //   };

  //   utils.campaign.getById.setData(campaign.id, newCampaign);
  //   updateCampaign(newCampaign);
  // }

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
          characters={campaign.pages.filter((c) => c.type === PageType.Player)}
          campaignId={campaign.id}
          type={PageType.Player}
        />

        <p className="mt-4 text-lg font-bold">NPCs</p>
        <ListCharacters
          characters={campaign.pages.filter((c) => c.type === PageType.NPC)}
          campaignId={campaign.id}
          type={PageType.NPC}
        />

        <p className="mt-4 text-lg font-bold">Campaign Notes</p>
        <EditorInput
          value={campaign.notes}
          attachMentionsTo={{
            source: campaign,
            fieldName: "notes",
          }}
          onChange={(value) => editCampaign("notes", value)}
        />

        <div className="mb-4 mt-8 flex items-start justify-between ">
          <p className="text-lg font-bold">Sessions</p>
          <CreatePageButton type={PageType.Session} />
        </div>
        <div>
          {sessions?.length === 0 && (
            <p className="font-light text-gray-500">No sessions created yet</p>
          )}
          {sessions?.map((session) => (
            <p className="mb-2 p-2 hover:bg-gray-100" key={session.id}>
              <Link
                href={`/app/${campaign.id}/pages/${session.id}`}
                className="block"
              >
                <span className="font-bold">{session.title}</span>
                <span className="ml-4 font-light">
                  {format(
                    parseISO(
                      session.previewFields.avatar?.value ||
                        new Date().toISOString(),
                    ),
                    "dd.MM.yyyy",
                  )}
                </span>
              </Link>
            </p>
          ))}
        </div>

        <QuestList
          quests={campaign.pages.filter((p) => p.type === PageType.Quest)}
        />
      </div>
    </CampaignContext.Provider>
  );
};

Page.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export default Page;
