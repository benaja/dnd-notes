import { Character } from "@prisma/client";
import { trpc } from "~/lib/trpc-client";
import CharacterForm, { CharacterFormValues } from "./CharacterForm";
import { CharacterType } from "~/jsonTypes";

export default function EditCharacterForm({
  character,
  onChange,
}: {
  character: Character;
  onChange?: (character: Character) => void;
}) {
  const { data: fields } = trpc.settings.characterFields.useQuery();
  const updateCharacterMutation = trpc.character.update.useMutation({
    onSuccess(data) {
      updateCharacterMutation.reset();
      utils.campaign.getById.invalidate(character.campaignId);
      onChange?.(data);
    },
  });
  const utils = trpc.useContext();

  function onSubmit(values: CharacterFormValues) {
    updateCharacterMutation.mutate({
      ...values,
      id: character.id,
      campaignId: character.campaignId,
    });
  }

  if (!fields) return <></>;
  return (
    <CharacterForm
      onSubmit={onSubmit}
      values={{
        ...character,
        fields: character.fields.reduce((values, field) => {
          return {
            ...values,
            [field.name]: field.value,
          };
        }, {}),
      }}
      fields={fields}
    />
  );
}
