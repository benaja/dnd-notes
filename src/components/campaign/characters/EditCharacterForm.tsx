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
  const { data: mentions } = trpc.mentions.getMentions.useQuery({
    character,
  });

  function onSubmit(values: CharacterFormValues) {
    updateCharacterMutation.mutate({
      ...values,
      id: character.id,
      campaignId: character.campaignId,
    });
  }

  console.log("edit character");

  if (!fields) return <></>;
  return (
    <>
      <CharacterForm
        onSubmit={onSubmit}
        character={character}
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

      <p>Mentions Campaigns</p>
      {mentions?.campaigns.map((campaign) => (
        <div key={campaign.id}>
          <p>{campaign.title}</p>
        </div>
      ))}

      <p>Mentions Sessions</p>
      {mentions?.sessions.map((sessions) => (
        <div key={sessions.id}>
          <p>{sessions.title}</p>
        </div>
      ))}

      <p>Mentions Characters</p>
      {mentions?.characters.map((characters) => (
        <div key={characters.id}>
          <p>{characters.name}</p>
        </div>
      ))}
    </>
  );
}
