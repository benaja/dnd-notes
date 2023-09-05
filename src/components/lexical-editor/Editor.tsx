import ExampleTheme from "./themes/ExampleTheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import LexicalClickableLinkPlugin from "@lexical/react/LexicalClickableLinkPlugin";

import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
// import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import MentionsPlugin from "./plugins/MentionsPlugin";
import { MentionNode } from "./nodes/MentionNode";
import FloatingLinkEditorPlugin from "./plugins/FloatingLinkEditorPlugin";
import { useEffect, useState } from "react";
import { CAN_USE_DOM } from "./utils/canUseDOM";
import { mergeRegister } from "@lexical/utils";
import LinkPlugin from "./plugins/LinkPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $nodesOfType, NodeKey } from "lexical";
import ComponentPickerPlugin from "./plugins/ComponentPickerPlugin";
import { AttachToProps } from "~/lib/hooks/useMentions";

function Placeholder() {
  return (
    <div className="pointer-events-none absolute left-3 top-4 inline-block select-none overflow-hidden text-ellipsis text-gray-500">
      Enter some text...
    </div>
  );
}

export enum EditorEvents {
  onCharactersChanged = "onCharactersChanged",
}

export const nodes = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  CodeHighlightNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  AutoLinkNode,
  LinkNode,
  MentionNode,
];

export default function Editor({
  minimal,
  attachMentionsTo,
  readOnly,
  onChange,
  onEvent,
}: {
  minimal?: boolean;
  attachMentionsTo?: AttachToProps;
  readOnly?: boolean;
  onChange: (state: any) => void;
  onEvent?: (event: EditorEvents, payload: any) => void;
}) {
  const [editor] = useLexicalComposerContext();
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia("(max-width: 1025px)").matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener("resize", updateViewPortWidth);

    return () => {
      window.removeEventListener("resize", updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  return (
    // <LexicalComposer initialConfig={editorConfig}>
    <div className="editor-container relative text-black ">
      <LinkPlugin />

      {!readOnly && <ToolbarPlugin minimal={minimal} />}
      <div className="editor-inner">
        <HistoryPlugin />
        {/* <TreeViewPlugin /> */}
        <AutoFocusPlugin />
        {/* <CodeHighlightPlugin /> */}
        <ListPlugin />
        <AutoLinkPlugin />
        <ListMaxIndentLevelPlugin maxDepth={7} />
        {/* <MarkdownShortcutPlugin transformers={TRANSFORMERS} /> */}
        <MentionsPlugin attachTo={attachMentionsTo} />
        <OnChangePlugin onChange={onChange} />
        <ComponentPickerPlugin />
        {/* <LexicalClickableLinkPlugin /> */}

        {floatingAnchorElem && !isSmallWidthViewport && (
          <>
            {/* <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} /> */}
          </>
        )}

        <RichTextPlugin
          contentEditable={
            <div className="editor-scroller">
              <div className="editor" ref={onRef}>
                <ContentEditable className="editor-input" />
              </div>
            </div>
          }
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
    </div>
    // </LexicalComposer>
  );
}
