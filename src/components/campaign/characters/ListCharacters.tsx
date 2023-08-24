import { Character } from "@prisma/client";
import dynamic from "next/dynamic";
import { CharacterType } from "../shema";
import Image from "next/image";
import AppImage from "~/components/ui/AppImage";
const CreateCharacterDialog = dynamic(() => import("./CreateCharacterDialog"), {
  ssr: false,
});

export default function ListCharacters({
  characters,
  campaignId,
  onCreated,
  type,
}: {
  characters: Character[];
  campaignId: string;
  onCreated?: (character: Character) => void;
  type: CharacterType;
}) {
  return (
    <div>
      <div className="flex gap-4">
        {characters.map((character) => {
          return (
            <div
              key={character.id}
              className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gray-700 p-2"
            >
              {character.avatar && (
                <AppImage
                  src={character.avatar}
                  className="absolute h-full w-full rounded-full object-cover"
                  alt="avatar image"
                  width={48}
                  height={48}
                />
              )}
              <p className="text-2xl font-bold uppercase leading-[1em] text-white">
                {character.name?.[0]}
              </p>
            </div>
          );
        })}
        <CreateCharacterDialog
          campaignId={campaignId}
          onCreated={onCreated}
          type={type}
        />
      </div>
    </div>
  );
}
