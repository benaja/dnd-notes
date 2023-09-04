import {
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  GridSelection,
  LexicalEditor,
  NodeSelection,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { LowPriority, getSelectedNode } from "../ToolbarPlugin";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { mergeRegister } from "@lexical/utils";
import Icon from "~/components/ui/Icon";
import { $isMentionNode, Mention } from "../../nodes/MentionNode";
import { clamp } from "~/lib/utils";
import { trpc } from "~/lib/trpc-client";
import { Page } from "@prisma/client";
import { getIconForPage } from "~/components/layouts/AppLayout";
import GenericForm from "~/components/fields/GenericForm";
import { Form, useForm } from "react-hook-form";

function positionEditorElement(editor: HTMLElement, rect: DOMRect | null) {
  if (rect === null) {
    editor.style.opacity = "0";
    editor.style.top = "-1000px";
    editor.style.left = "-1000px";
  } else {
    editor.style.opacity = "1";
    editor.style.top = `${rect.top + rect.height + window.scrollY + 10}px`;
    editor.style.left = `${clamp(
      rect.left + window.scrollX - editor.offsetWidth / 2 + rect.width / 2,
      90,
      window.innerWidth - 600,
    )}px`;
  }
}

export default function FloatingMentionViewer({
  editor,
}: {
  editor: LexicalEditor;
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mouseDownRef = useRef(false);
  const [page, setPage] = useState<Page | null>(null);
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState<
    RangeSelection | NodeSelection | GridSelection | null
  >(null);
  const getPageById = trpc.useContext().page.getById;
  const formMethods = useForm();

  async function fetchPage(id: string) {
    const page = await getPageById.fetch(id);
    setPage(page);
  }

  const updateLinkEditor = useCallback(async () => {
    const selection = $getSelection();
    if (!selection) {
      setPage(null);
      return;
    }

    if ($isRangeSelection(selection)) {
      const node = selection.anchor.getNode();
      const parent = node.getParent();
      if ($isMentionNode(parent)) {
        fetchPage(parent.__page.id);
      } else if ($isMentionNode(node)) {
        fetchPage(node.__page.id);
      } else {
        setPage(null);
        return;
      }
    }
    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      // !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect;
      if (nativeSelection.anchorNode === rootElement) {
        let inner: Element = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      if (!mouseDownRef.current) {
        positionEditorElement(editorElem, rect);
      }
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== "link-input") {
      positionEditorElement(editorElem, null);
      setLastSelection(null);
      setEditMode(false);
      setPage(null);
    }

    return true;
  }, [editor]);

  console.log("page", page);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        LowPriority,
      ),
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  // useEffect(() => {
  //   if (linkUrl === "") {
  //     setEditMode(true);
  //   }
  // }, [linkUrl]);

  return (
    <div
      ref={editorRef}
      className="absolute left-32 z-10 max-h-[500px] w-[600px] overflow-y-auto rounded bg-white p-4 shadow"
    >
      {page && (
        <>
          <div className="flex w-full justify-between ">
            <p className="flex items-center text-lg font-medium">
              <Icon className="mr-2">{getIconForPage(page.type)}</Icon>
              {page.title}
            </p>
          </div>
          <GenericForm readonly fields={page.fields} />
        </>
      )}
    </div>
  );
}
