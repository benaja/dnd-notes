"use client";

import { useEffect, useState } from "react";
import EditableText from "~/components/fiels/EditableText";
import QuillInput from "~/components/fiels/RichtTextInput";
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
        : null
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
      <div className="my-4">
        <EditableText
          value={campaign.description}
          onInput={(value) => editCampaign("description", value)}
          onBlur={updateCampaign}
        />
      </div>

      <QuillInput />
      {/* <RichtTextInput /> */}
    </div>
  );
}
