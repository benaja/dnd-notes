import { LexicalComposer } from "@lexical/react/LexicalComposer";
import Editor, { nodes } from "./lexical-editor/Editor";
import exampleTheme from "./themes/ExampleTheme";

export default function EditorField({
  value,
  onChange,
}: {
  value?: any;
  onChange?: (value: string) => void;
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
      />
    </LexicalComposer>
  );
}
