import { trpc } from "~/lib/trpc-client";
import { Button } from "../ui/button";
import { CampaignContext } from "~/pages/app/[campaign]";
import { useContext } from "react";
import { useRouter } from "next/router";
import useDialog from "~/lib/hooks/useDialog";
import CreatePageModal from "./CreatePageModal";
import { PageType } from "~/jsonTypes";

export default function CreatePageButton({ type }: { type: PageType }) {
  const [dialog, showDialog] = useDialog();

  function getTitle() {
    switch (type) {
      case PageType.Session:
        return "Create Session";
      case PageType.Quest:
        return "Create Quest";
      default:
        return "Create Page";
    }
  }

  return (
    <div>
      {dialog}
      <Button
        onClick={() => {
          showDialog(getTitle(), (onClose) => (
            <CreatePageModal type={type} onCreated={onClose} />
          ));
        }}
      >
        {getTitle()}
      </Button>
    </div>
  );
}
