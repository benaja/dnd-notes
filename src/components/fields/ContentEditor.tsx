import { Content } from "@prisma/client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { trpc } from "~/lib/trpc-client";
const EditorField = dynamic(() => import("~/components/fields/EditorField"), {
  ssr: false,
});

export default function ContentEditor({ content }: { content: Content }) {
  const [value, setValue] = useState(content.value);
  const updateMutation = trpc.content.update.useMutation();

  function onChange(value: string) {
    setValue(value);
    updateMutation.mutate({
      id: content.id,
      value,
    });
  }

  return (
    <div>
      <EditorField value={value} onChange={onChange} />
    </div>
  );
}
