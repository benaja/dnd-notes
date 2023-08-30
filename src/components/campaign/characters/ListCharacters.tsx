import { Character, Page } from "@prisma/client";
import dynamic from "next/dynamic";
import AppImage from "~/components/ui/AppImage";
import useDialog from "~/lib/hooks/useDialog";
import { CharacterType, PageType } from "~/jsonTypes";
import Link from "next/link";
import CreatePageModal from "~/components/pages/CreatePageModal";
import { useMemo } from "react";
const CreateCharacterForm = dynamic(() => import("./CreateCharacterForm"), {
  ssr: false,
});

export default function ListCharacters({
  characters,
  campaignId,
  type,
}: {
  characters: Page[];
  campaignId: string;
  type: PageType;
}) {
  const [dialog, showDialog] = useDialog();

  function getAvatar(page: Page) {
    return page.previewFields?.find((field) => field.type === "avatar")?.value;
  }

  return (
    <div>
      {dialog}
      <div className="flex flex-wrap gap-4">
        {characters.map((character) => {
          return (
            <Link
              href={`/app/${campaignId}/pages/${character.id}`}
              key={character.id}
              className="relative flex h-12 w-12  items-center justify-center rounded-full bg-gray-700 p-2 hover:opacity-80"
            >
              {getAvatar(character) && (
                <AppImage
                  src={getAvatar(character)}
                  className="absolute h-full w-full shrink-0 rounded-full object-cover"
                  alt="avatar image"
                  width={48}
                  height={48}
                />
              )}
              <p className="text-2xl font-bold uppercase leading-[1em] text-white">
                {character.title?.[0]}
              </p>
            </Link>
          );
        })}
        <button
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl hover:bg-gray-200"
          onClick={() => {
            console.log("showDialog");
            showDialog("Create Character", (onClose) => (
              <CreatePageModal type={type} onCreated={onClose} />
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
