import { useContext, useState } from "react";
import { Combobox, ComboboxItem } from "~/components/ui/Combobox";
import { trpc } from "~/lib/trpc-client";
import { CampaignContext } from "~/pages/app/[campaign]";

export type PageInputProps = {
  value?: string | null;
  onChange?: (value: string | ComboboxItem | null) => void;
};

export default function PageInput({ value, onChange }: PageInputProps) {
  const utils = trpc.useContext();
  const campaign = useContext(CampaignContext);
  const [items, setItems] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  async function search(value: string | null) {
    if (!campaign) throw new Error("No campaign provided");

    const pages = await utils.page.filter.fetch({
      title: value,
      campaignId: campaign.id,
    });

    setItems(
      pages.map((p) => ({
        label: p.title,
        value: p.id,
      })),
    );
  }

  return (
    <Combobox
      value={value}
      items={items}
      returnObject
      onChange={onChange}
      onSearch={search}
    />
  );
}
