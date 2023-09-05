import { Page } from "@prisma/client";
import { useContext, useState } from "react";
import CreatePageModal, {
  pageTypeTitle,
} from "~/components/pages/CreatePageModal";
import { Combobox, ComboboxItem } from "~/components/ui/Combobox";
import Icon from "~/components/ui/Icon";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { PageType } from "~/jsonTypes";
import useDialog from "~/lib/hooks/useDialog";
import { trpc } from "~/lib/trpc-client";
import { cn } from "~/lib/utils";
import { CampaignContext } from "~/pages/app/[campaign]";
import CreatePage from "./CreatePage";
import { Separator } from "~/components/ui/separator";
import useMentions, { AttachToProps } from "~/lib/hooks/useMentions";

export type PageInputProps = {
  types: PageType[];
  value?: string | null;
  readOnly?: boolean;
  attachTo?: AttachToProps;
  onChange?: (value: string | ComboboxItem | null) => void;
};

export default function PageInput({
  value,
  types,
  attachTo,
  readOnly,
  onChange,
}: PageInputProps) {
  const utils = trpc.useContext();
  const campaign = useContext(CampaignContext);
  const [items, setItems] = useState<ComboboxItem[]>([]);
  const [dialog, showDialog] = useDialog();
  const { onMentionsChange } = useMentions(attachTo ?? {});

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

  function onUpdate(value: string | ComboboxItem | null) {
    onChange?.(value);

    if (!value) {
      onMentionsChange?.([]);
      return;
    }
    onMentionsChange?.([
      {
        id: typeof value === "object" ? value.value : value,
      },
    ]);
  }

  function onPageCreated(page: Page) {
    onUpdate?.({
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

  function openPageModal(type: PageType) {
    showDialog(`Create ${pageTypeTitle(type)}`, (close) => (
      <CreatePageModal
        type={type}
        onCreated={(page) => {
          onPageCreated?.(page);
          close();
        }}
      />
    ));
  }

  return (
    <>
      {dialog}
      <Combobox
        value={value}
        items={items}
        readOnly={readOnly}
        returnObject
        onChange={onUpdate}
        onSearch={search}
        customCammands={
          <>
            <DropdownMenuGroup>
              <CreatePage selectPage={openPageModal} types={types} />
            </DropdownMenuGroup>

            <Separator />
          </>
        }
      />
    </>
  );
}
