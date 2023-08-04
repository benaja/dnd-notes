import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ListCharacters from "~/components/campaign/characters/ListCharacters";
import EditableText from "~/components/fiels/EditableText";
import AppLayout from "~/components/layouts/AppLayout";
import { trpc } from "~/lib/trpc-client";
import { NextPageWithLayout } from "~/pages/_app";

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

      <ListCharacters
        characters={campaign.characters}
        campaignId={campaign.id}
        onCreated={(character) => {
          editCampaign("characters", [...campaign.characters, character]);
        }}
      />
      {/* <Editor /> */}

      {/* <QuillInput /> */}
      {/* <RichtTextInput /> */}
    </div>
  );
};

Page.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export default Page;
