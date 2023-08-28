import { Character, Content } from "@prisma/client";

export default function EditCharacterForm({
  character,
}: {
  character: Character & { content: Content };
}) {}
