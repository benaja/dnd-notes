import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $getNodeByKey,
  LexicalEditor,
  RangeSelection,
} from "lexical";
import {
  $isLinkNode,
  TOGGLE_LINK_COMMAND,
  $createLinkNode,
} from "@lexical/link";
import { $isParentElementRTL, $isAtNodeEnd } from "@lexical/selection";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import { $isListNode, ListNode } from "@lexical/list";
import { createPortal } from "react-dom";
import { $isHeadingNode } from "@lexical/rich-text";
import {
  $isCodeNode,
  getDefaultCodeLanguage,
  getCodeLanguages,
} from "@lexical/code";
import Icon from "~/components/ui/Icon";
import BlockOptionsDropdownList from "./toolbar/BlockOptionsDropdownList";
import FloatingLinkEditor from "./toolbar/FloatingLinkEditor";
import { $setBlocksType } from "@lexical/selection";
import { $isMentionNode } from "../nodes/MentionNode";
import FloatingMentionViewer from "./toolbar/FloatingMentionViewer";

export const LowPriority = 1;

const supportedBlockTypes = new Set([
  "paragraph",
  "quote",
  // "code",
  "h1",
  "h2",
  "h3",
  "ul",
  "ol",
  "check",
]);

const blockTypeToBlockName = {
  code: "Code Block",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  ol: "Numbered List",
  ul: "Bulleted List",
  check: "Checkbox List",
  paragraph: "Normal",
  quote: "Quote",
};

const FONT_SIZE_OPTIONS: [string, string][] = [
  ["10px", "10px"],
  ["11px", "11px"],
  ["12px", "12px"],
  ["13px", "13px"],
  ["14px", "14px"],
  ["15px", "15px"],
  ["16px", "16px"],
  ["17px", "17px"],
  ["18px", "18px"],
  ["19px", "19px"],
  ["20px", "20px"],
];

function Divider() {
  return <div className="divider" />;
}

function Select({
  onChange,
  className,
  options,
  value,
}: {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  options: string[];
  value: string;
}) {
  return (
    <select className={className} onChange={onChange} value={value}>
      <option hidden={true} value="" />
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export function getSelectedNode(selection: RangeSelection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

export default function ToolbarPlugin({ minimal }: { minimal?: boolean }) {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>("paragraph");
  const [selectedElementKey, setSelectedElementKey] = useState<string | null>(null);
  const [codeLanguage, setCodeLanguage] = useState("");
  const [isRTL, setIsRTL] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isMention, setIsMention] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    console.log("selection", selection);
    const anchorNode = selection.anchor.getNode();
    const element =
      anchorNode.getKey() === "root"
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow();
    const elementKey = element.getKey();
    const elementDOM = editor.getElementByKey(elementKey);
    if (elementDOM !== null) {
      setSelectedElementKey(elementKey);
      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType(anchorNode, ListNode);
        const type = parentList ? parentList.getTag() : element.getTag();
        setBlockType(type);
      } else {
        const type = $isHeadingNode(element)
          ? element.getTag()
          : element.getType();
        setBlockType(type as keyof typeof blockTypeToBlockName);
        if ($isCodeNode(element)) {
          setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
        }
      }
    }
    // Update text format
    setIsBold(selection.hasFormat("bold"));
    setIsItalic(selection.hasFormat("italic"));
    setIsUnderline(selection.hasFormat("underline"));
    setIsStrikethrough(selection.hasFormat("strikethrough"));
    setIsCode(selection.hasFormat("code"));
    setIsRTL($isParentElementRTL(selection));

    // Update links
    const node = getSelectedNode(selection);
    const parent = node.getParent();
    if ($isLinkNode(parent) || $isLinkNode(node)) {
      setIsLink(true);
    } else {
      setIsLink(false);
    }
    console.log(
      "isMentionNode",
      $isMentionNode(parent) || $isMentionNode(node),
    );

    if ($isMentionNode(parent) || $isMentionNode(node)) {
      setIsMention(true);
    } else {
      setIsMention(false);
    }
  }, [editor]);

  console.log("isMention", isMention);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, updateToolbar]);

  const codeLanguges = useMemo(() => getCodeLanguages(), []);
  const onCodeLanguageSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      editor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(e.target.value);
          }
        }
      });
    },
    [editor, selectedElementKey],
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  return (
    <div
      className="toolbar sticky top-20 z-50 mb-px flex rounded-t-md bg-white p-1 align-middle"
      ref={toolbarRef}
    >
      {!minimal && (
        <>
          <button
            disabled={!canUndo}
            onClick={() => {
              editor.dispatchCommand(UNDO_COMMAND, undefined);
            }}
            className="toolbar-item spaced"
            aria-label="Undo"
          >
            <Icon>undo</Icon>
          </button>
          <button
            disabled={!canRedo}
            onClick={() => {
              editor.dispatchCommand(REDO_COMMAND, undefined);
            }}
            className="toolbar-item"
            aria-label="Redo"
          >
            <Icon>redo</Icon>
          </button>
          <Divider />
        </>
      )}
      {supportedBlockTypes.has(blockType) && (
        <>
          <BlockOptionsDropdownList
            editor={editor}
            blockType={blockType}
            toolbarRef={toolbarRef}
            blockTypeToBlockName={blockTypeToBlockName}
          />

          <Divider />
        </>
      )}
      {blockType === "code" ? (
        <>
          <Select
            className="toolbar-item code-language"
            onChange={onCodeLanguageSelect}
            options={codeLanguges}
            value={codeLanguage}
          />
          <Icon>expand_more</Icon>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
            className={"toolbar-item spaced " + (isBold ? "active" : "")}
            aria-label="Format Bold"
          >
            <Icon>format_bold</Icon>
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            }}
            className={"toolbar-item spaced " + (isItalic ? "active" : "")}
            aria-label="Format Italics"
          >
            <Icon>format_italic</Icon>
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
            }}
            className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
            aria-label="Format Underline"
          >
            <Icon>format_underlined</Icon>
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
            }}
            className={
              "toolbar-item spaced " + (isStrikethrough ? "active" : "")
            }
            aria-label="Format Strikethrough"
          >
            <Icon>strikethrough_s</Icon>
          </button>
          {/* <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
            }}
            className={"toolbar-item spaced " + (isCode ? "active" : "")}
            aria-label="Insert Code"
          >
            <Icon>code</Icon>
          </button> */}
          <button
            onClick={insertLink}
            className={"toolbar-item spaced " + (isLink ? "active" : "")}
            aria-label="Insert Link"
          >
            <Icon>Link</Icon>
          </button>
          {isLink &&
            createPortal(<FloatingLinkEditor editor={editor} />, document.body)}

          {isMention &&
            createPortal(
              <FloatingMentionViewer editor={editor} />,
              document.body,
            )}

          {!minimal && (
            <>
              <Divider />
              <button
                onClick={() => {
                  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
                }}
                className="toolbar-item spaced"
                aria-label="Left Align"
              >
                <Icon>format_align_left</Icon>
              </button>
              <button
                onClick={() => {
                  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
                }}
                className="toolbar-item spaced"
                aria-label="Center Align"
              >
                <Icon>format_align_center</Icon>
              </button>
              <button
                onClick={() => {
                  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
                }}
                className="toolbar-item spaced"
                aria-label="Right Align"
              >
                <Icon>format_align_right</Icon>
              </button>
              <button
                onClick={() => {
                  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
                }}
                className="toolbar-item"
                aria-label="Justify Align"
              >
                <Icon>format_align_justify</Icon>
              </button>{" "}
            </>
          )}
        </>
      )}
    </div>
  );
}
