import { Page } from "@prisma/client";
import { forwardRef } from "react";
import CreatePageModal, {
  pageTypeTitle,
} from "~/components/pages/CreatePageModal";
import Icon from "~/components/ui/Icon";
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "~/components/ui/dropdown-menu";
import { PageType } from "~/jsonTypes";
import useDialog from "~/lib/hooks/useDialog";

const CreateButton = forwardRef(function CreateButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      tabIndex={-1} // prevent focus on button, focus on input instead
      className="flex w-full items-center px-1 py-2"
      onClick={onClick}
    >
      <Icon className="mr-2 h-4 w-4 shrink-0 text-xl leading-4 opacity-50">
        add
      </Icon>
      <span className="text-sm leading-4 text-muted-foreground outline-none">
        {children}
      </span>
    </button>
  );
});

export default function CreatePage({
  types,
  selectPage,
}: {
  types: PageType[];
  selectPage: (type: PageType) => void;
}) {
  if (types.length === 1) {
    return (
      <>
        <DropdownMenuItem>
          <CreateButton onClick={() => selectPage(types[0])}>
            {`Create ${pageTypeTitle(types[0])}`}
          </CreateButton>
        </DropdownMenuItem>
      </>
    );
  } else {
    return (
      <>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <CreateButton>Create new</CreateButton>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-[200px] p-0">
            {types.map((type) => (
              <DropdownMenuItem
                key={type}
                className="px-4 py-2.5"
                onClick={() => selectPage(type)}
              >
                {pageTypeTitle(type)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </>
    );
  }
}
