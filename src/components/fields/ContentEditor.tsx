import { Character, Content } from "@prisma/client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { trpc } from "~/lib/trpc-client";
import { EditorEvents } from "./lexical-editor/Editor";
const EditorField = dynamic(() => import("~/components/fields/EditorField"), {
  ssr: false,
});

export default function ContentEditor({ content }: { content: Content }) {
  const [value, setValue] = useState(content.value);
  const updateMutation = trpc.content.update.useMutation();

  function onChange(value: string) {
    setValue(value);
    console;
    updateMutation.mutate({
      id: content.id,
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

  return (
    <div>
      <EditorField value={value} onChange={onChange} onEvent={onEvent} />
    </div>
  );
}
