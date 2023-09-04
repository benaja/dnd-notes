import { trpc } from "~/lib/trpc-client";
import { Button } from "../ui/button";
import { CampaignContext } from "~/pages/app/[campaign]";
import { useContext } from "react";
import { useRouter } from "next/router";
import useDialog from "~/lib/hooks/useDialog";
import CreatePageModal, { pageTypeTitle } from "./CreatePageModal";
import { PageType } from "~/jsonTypes";

export default function CreatePageButton({ type }: { type: PageType }) {
  const [dialog, showDialog] = useDialog();

  const title = `Create ${pageTypeTitle(type)}`;

  return (
    <div>
      {dialog}
      <Button
        onClick={() => {
          showDialog(title, (onClose) => (
            <CreatePageModal type={type} onCreated={onClose} />
          ));
        }}
      >
        {title}
      </Button>
    </div>
  );
}
