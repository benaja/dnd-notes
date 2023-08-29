import { trpc } from "~/lib/trpc-client";
import { Character } from "@prisma/client";
import CharacterForm, { CharacterFormValues } from "./CharacterForm";
import { CharacterType } from "~/jsonTypes";

export default function CreateCharacterForm({
  campaignId,
  type,
  onCreated,
}: {
  campaignId: string;
  type: CharacterType;
  onCreated?: (character: Character) => void;
}) {
  const { data: fields } = trpc.settings.characterFields.useQuery();

  const utils = trpc.useContext();
  const createCharacterMutation = trpc.character.create.useMutation({
    onSuccess(data) {
      createCharacterMutation.reset();
      utils.campaign.getById.invalidate(campaignId);
      onCreated?.(data);
    },
  });

  async function onSubmit(values: CharacterFormValues) {
    const character = await createCharacterMutation.mutateAsync({
      ...values,
      campaignId,
      type,
    });
  }

  if (!fields) return <></>;
  return <CharacterForm fields={fields} onSubmit={onSubmit} />;
}
