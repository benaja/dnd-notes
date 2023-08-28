import { Campaign } from "@prisma/client";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";
import CreateSessionButton from "~/components/campaign/CreateSessionButton";
import ListCharacters from "~/components/campaign/characters/ListCharacters";
import { CharacterType } from "~/components/campaign/shema";
import ContentEditor from "~/components/fields/ContentEditor";
import EditableText from "~/components/fields/EditableText";
import AppLayout from "~/components/layouts/AppLayout";
import { Button } from "~/components/ui/button";
import { trpc } from "~/lib/trpc-client";
import { NextPageWithLayout } from "~/pages/_app";
import { format } from "date-fns";
import AppLink from "~/components/ui/AppLink";
const EditorField = dynamic(() => import("~/components/fields/EditorField"), {
  ssr: false,
});

export const CampaignContext = createContext<Campaign | null>(null);

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
    <CampaignContext.Provider value={campaign}>
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

        <p className="mt-4 text-lg font-bold">Players</p>
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

        <p className="mt-4 text-lg font-bold">NPCs</p>
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

        <p className="mt-4 text-lg font-bold">Campaign Notes</p>
        {campaign.description && (
          <ContentEditor content={campaign.description} />
        )}

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
