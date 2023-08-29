import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { EditorEvents, nodes } from "../../lexical-editor/Editor";
import exampleTheme from "../../lexical-editor/themes/ExampleTheme";
import { AttachToProps } from "~/lib/hooks/useMentions";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("~/components/lexical-editor/Editor"), {
  ssr: false,
});

export default function EditorInput({
  value,
  minimal,
  attachMentionsTo,
  onChange,
  onEvent,
}: {
  value?: any;
  minimal?: boolean;
  attachMentionsTo?: AttachToProps;
  onChange?: (value: string) => void;
  onEvent?: (event: EditorEvents, payload: any) => void;
}) {
  const editorConfig = {
    theme: exampleTheme,
    namespace: "example",
    editorState: value ? value : undefined,
    onError(error) {
      throw error;
    },
    nodes,
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
      />
    </LexicalComposer>
  );
}
