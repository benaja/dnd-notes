import { Page } from "@prisma/client";
import { useContext, useState } from "react";
import CreatePageModal from "~/components/pages/CreatePageModal";
import { Combobox, ComboboxItem } from "~/components/ui/Combobox";
import Icon from "~/components/ui/Icon";
import { PageType } from "~/jsonTypes";
import useDialog from "~/lib/hooks/useDialog";
import { trpc } from "~/lib/trpc-client";
import { cn } from "~/lib/utils";
import { CampaignContext } from "~/pages/app/[campaign]";

export type PageInputProps = {
  types?: PageType[];
  value?: string | null;
  onChange?: (value: string | ComboboxItem | null) => void;
};

export default function PageInput({ value, types, onChange }: PageInputProps) {
  const utils = trpc.useContext();
  const campaign = useContext(CampaignContext);
  const [items, setItems] = useState<ComboboxItem[]>([]);
  const [dialog, showDialog] = useDialog();

  async function search(value: string | null) {
    if (!campaign) throw new Error("No campaign provided");

    const pages = await utils.page.filter.fetch({
      title: value,
      campaignId: campaign.id,
      type: types,
      limit: 10,
    });

    setItems(
      pages.map((p) => ({
        label: p.title,
        value: p.id,
      })),
    );
  }

  function onPageCreated(page: Page) {
    onChange?.({
      value: page.id,
      label: page.title,
    });
    setItems((items) => [
      {
        label: page.title,
        value: page.id,
      },
      ...items,
    ]);
  }

  return (
    <>
      {dialog}
      <Combobox
        value={value}
        items={items}
        returnObject
        onChange={onChange}
        onSearch={search}
        customCammands={
          <button
            tabIndex={-1} // prevent focus on button, focus on input instead
            className="flex w-full items-center border-b px-3 py-3"
            onClick={() => {
              showDialog("Create Page", (close) => (
                <CreatePageModal
                  type={PageType.NPC}
                  onCreated={(page) => {
                    onPageCreated(page);
                    close();
                  }}
                />
              ));
            }}
          >
            <Icon className="mr-2 h-4 w-4 shrink-0 text-xl leading-4 opacity-50">
              add
            </Icon>
            <span
              className={cn(
                "text-sm leading-4 text-muted-foreground outline-none",
              )}
            >
              Create new
            </span>
          </button>
        }
      />
    </>
  );
}
