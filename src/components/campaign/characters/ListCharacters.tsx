import { Character } from "@prisma/client";
import dynamic from "next/dynamic";
import { CharacterType } from "../shema";
import Image from "next/image";
import AppImage from "~/components/ui/AppImage";
import useDialog from "~/lib/hooks/useDialog";
import EditCharacterForm from "./EditCharacterForm";
const CreateCharacterForm = dynamic(() => import("./CreateCharacterForm"), {
  ssr: false,
});

export default function ListCharacters({
  characters,
  campaignId,
  type,
}: {
  characters: Character[];
  campaignId: string;
  type: CharacterType;
}) {
  const [dialog, showDialog] = useDialog();

  return (
    <div>
      {dialog}
      <div className="flex flex-wrap gap-4">
        {characters.map((character) => {
          return (
            <button
              key={character.id}
              className="relative flex h-12 w-12  items-center justify-center rounded-full bg-gray-700 p-2 hover:opacity-80"
              onClick={() =>
                showDialog("Edit Character", (onClose) => (
                  <EditCharacterForm character={character} onChange={onClose} />
                ))
              }
            >
              {character.avatar && (
                <AppImage
                  src={character.avatar}
                  className="absolute h-full w-full shrink-0 rounded-full object-cover"
                  alt="avatar image"
                  width={48}
                  height={48}
                />
              )}
              <p className="text-2xl font-bold uppercase leading-[1em] text-white">
                {character.name?.[0]}
              </p>
            </button>
          );
        })}
        <button
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl hover:bg-gray-200"
          onClick={() => {
            console.log("showDialog");
            showDialog("Create Character", (onClose) => (
              <CreateCharacterForm
                campaignId={campaignId}
                type={type}
                onCreated={onClose}
              />
            ));
          }}
        >
          +
        </button>
        {/* <CreateCharacterDialog
          campaignId={campaignId}
          onCreated={onCreated}
          type={type}
        /> */}
      </div>
    </div>
  );
}
