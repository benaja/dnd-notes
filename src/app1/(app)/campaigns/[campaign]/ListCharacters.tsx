import { Character } from "@prisma/client";
import CreateCharacterDialog from "./CreateCharacterDialog";

export default function ListCharacters({
  characters,
  campaignId,
  onCreated,
}: {
  characters: Character[];
  campaignId: string;
  onCreated?: (character: Character) => void;
}) {
  return (
    <div>
      {characters.map((character) => {
        return (
          <div key={character.id}>
            <h3>{character.name}</h3>
            <p>{character.description}</p>
          </div>
        );
      })}
      <CreateCharacterDialog campaignId={campaignId} onCreated={onCreated} />
    </div>
  );
}
