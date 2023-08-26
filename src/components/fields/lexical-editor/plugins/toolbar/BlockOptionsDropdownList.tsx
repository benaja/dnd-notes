import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
} from "lexical";
import { ButtonHTMLAttributes, useEffect, useRef, useState } from "react";
import { $setBlocksType } from "@lexical/selection";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $createListItemNode, $createListNode } from "@lexical/list";
import { $createCodeNode } from "@lexical/code";
import classNames from "classnames";
import { createPortal } from "react-dom";
import Icon from "~/components/ui/Icon";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "~/components/ui/dropdown-menu";
import DropDown, { DropDownItem } from "./DropDown";

function DropdownItem({
  children,
  className,
  active,
  icon,
  onClick,
  ...props
}: {
  children: React.ReactNode;
  active?: boolean;
  icon?: string;
  onClick?: () => void;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  console.log(active);
  return (
    <DropdownMenuItem
      className={classNames(
        className,
        "mx-2 flex min-w-[200px] shrink-0 cursor-pointer flex-row content-center gap-4 rounded-md border-none p-2 hover:bg-gray-100",
        {
          "font-bold": active,
        },
      )}
      onClick={onClick}
    >
      {icon && <Icon>{icon}</Icon>}
      <span>{children}</span>
    </DropdownMenuItem>
  );
}

const blockTypeToIcon: Record<string, string> = {
  paragraph: "notes",
  h1: "format_h1",
  h2: "format_h2",
  h3: "format_h3",
  ul: "format_list_bulleted",
  ol: "format_list_numbered",
  quote: "format_quote",
  code: "code",
};

export default function BlockOptionsDropdownList({
  editor,
  blockType,
  toolbarRef,
  blockTypeToBlockName,
}: {
  editor: LexicalEditor;
  blockType: string;
  toolbarRef: React.RefObject<HTMLDivElement>;
  blockTypeToBlockName: Record<string, string>;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());

          editor.focus();
        }
      });
    }
    setIsDropdownOpen(false);
  };

  const formatHeading = (heading: "h1" | "h2" | "h3") => {
    if (blockType !== heading) {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(heading));
          const anchor = selection.anchor.getNode();
          console.log("anchor", anchor.getKey());
          const element = editor.getElementByKey(anchor.getKey());
          element?.focus();
          console.log("element", element);
        }
      });
    }
    setIsDropdownOpen(false);
  };

  const formatBulletList = () => {
    if (blockType !== "ul") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createListNode("bullet"));
        }
      });
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
    setIsDropdownOpen(false);
  };

  const formatNumberedList = () => {
    if (blockType !== "ol") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createListNode("number"));
        }
      });
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
    setIsDropdownOpen(false);
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
    setIsDropdownOpen(false);
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
    }
    setIsDropdownOpen(false);
  };

  return (
    <DropdownMenu
      open={isDropdownOpen}
      onOpenChange={(value) => setIsDropdownOpen(value)}
    >
      <DropdownMenuTrigger
        className="flex items-center gap-2"
        aria-label="Formatting Options"
        asChild
      >
        <button disabled>
          <Icon>{blockTypeToIcon[blockType]}</Icon>
          <span className="text">{blockTypeToBlockName[blockType]}</span>
          <Icon>expand_more</Icon>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dropdown  block min-h-[40px] min-w-[100px] rounded bg-white shadow-md">
        <DropdownItem
          onClick={formatParagraph}
          active={blockType === "paragraph"}
          icon="notes"
        >
          Normal
        </DropdownItem>
        <DropdownItem
          active={blockType === "h1"}
          onClick={() => formatHeading("h1")}
          icon="format_h1"
        >
          Heading 1
        </DropdownItem>
        <DropdownItem
          active={blockType === "h2"}
          onClick={() => formatHeading("h2")}
          icon="format_h2"
        >
          Heading 2
        </DropdownItem>
        <DropdownItem
          active={blockType === "h3"}
          onClick={() => formatHeading("h3")}
          icon="format_h3"
        >
          Heading 3
        </DropdownItem>
        <DropdownItem
          active={blockType === "ul"}
          onClick={formatBulletList}
          icon="format_list_bulleted"
        >
          Bullet List
        </DropdownItem>
        <DropdownItem
          active={blockType === "ol"}
          onClick={formatNumberedList}
          icon="format_list_numbered"
        >
          Numbered List
        </DropdownItem>
        <DropdownItem
          active={blockType === "quote"}
          onClick={formatQuote}
          icon="format_quote"
        >
          <span className="icon quote" />
          Quote
          {blockType === "quote" && <span className="active" />}
        </DropdownItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
