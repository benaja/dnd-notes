import { LexicalComposer } from "@lexical/react/LexicalComposer";
import Editor, { EditorEvents, nodes } from "../../lexical-editor/Editor";
import exampleTheme from "../../lexical-editor/themes/ExampleTheme";

export default function EditorInput({
  value,
  minimal,
  onChange,
  onEvent,
}: {
  value?: any;
  minimal?: boolean;
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
      />
    </LexicalComposer>
  );
}
