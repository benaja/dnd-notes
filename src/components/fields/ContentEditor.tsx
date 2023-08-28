import { Character, Content } from "@prisma/client";
import dynamic from "next/dynamic";
import { memo, useState } from "react";
import { trpc } from "~/lib/trpc-client";
import { EditorEvents } from "./lexical-editor/Editor";
import { useDebounce } from "~/lib/hooks";
const EditorField = dynamic(() => import("~/components/fields/EditorField"), {
  ssr: false,
});

const ContentEditor = memo(function ContentEditor({
  content,
}: {
  content: Content;
}) {
  const [value, setValue] = useState(content.value);
  const updateMutation = trpc.content.update.useMutation();

  function onChange(value: string) {
    setValue(value);
    updateContent({
      ...content,
      value,
    });
  }

  function onEvent(event: EditorEvents, payload: any) {
    if (event === EditorEvents.onCharactersChanged) {
      updateMutation.mutate({
        id: content.id,
        characters: payload as Character[],
      });
    }
  }

  const updateContent = useDebounce((value: typeof content) => {
    if (!value) return;
    updateMutation.mutate({
      id: value.id,
      value: value.value,
    });
  });

  return <EditorField value={value} onChange={onChange} onEvent={onEvent} />;
});

export default ContentEditor;
