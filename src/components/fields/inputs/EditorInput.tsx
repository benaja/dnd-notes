import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { EditorEvents, nodes } from "../../lexical-editor/Editor";
import exampleTheme from "../../lexical-editor/themes/ExampleTheme";
import { AttachToProps } from "~/lib/hooks/useMentions";
import dynamic from "next/dynamic";
import { memo } from "react";
const Editor = dynamic(() => import("~/components/lexical-editor/Editor"), {
  ssr: false,
});

export default memo(
  function EditorInput({
    value,
    minimal,
    attachMentionsTo,
    readOnly,
    onChange,
    onEvent,
  }: {
    value?: string;
    minimal?: boolean;
    attachMentionsTo?: AttachToProps;
    readOnly?: boolean;
    onChange?: (value: string) => void;
    onEvent?: (event: EditorEvents, payload: string) => void;
  }) {
    const editorConfig = {
      theme: exampleTheme,
      namespace: "example",
      editorState: value ? value : undefined,
      onError(error: any) {
        throw error;
      },
      nodes,
      editable: !readOnly,
    };

    return (
      <LexicalComposer initialConfig={editorConfig}>
        <Editor
          onChange={(state) => {
            onChange?.(JSON.stringify(state));
          }}
          onEvent={onEvent}
          minimal={minimal}
          attachMentionsTo={attachMentionsTo}
          readOnly={readOnly}
        />
      </LexicalComposer>
    );
  },
  (prev, next) => {
    if (prev.value !== next.value) return false;
    if (prev.minimal !== next.minimal) return false;
    if (prev.attachMentionsTo?.source?.id !== next.attachMentionsTo?.source?.id)
      return false;

    return true;
  },
);
