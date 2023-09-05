import { Page } from "@prisma/client";
import AppImage from "~/components/ui/AppImage";
import useDialog from "~/lib/hooks/useDialog";
import { PageType } from "~/jsonTypes";
import Link from "next/link";
import CreatePageModal from "~/components/pages/CreatePageModal";

export type PreviewPage = Omit<
  Page,
  "fields" | "createdAt" | "updatedAt" | "campaignId"
>;

export default function ListCharacters({
  characters,
  campaignId,
  type,
}: {
  characters: PreviewPage[];
  campaignId: string;
  type: PageType;
}) {
  const [dialog, showDialog] = useDialog();

  function getAvatar(page: PreviewPage) {
    return page.previewFields.filter((f) => f.name === "avatar")[0]?.value;
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
            showDialog(
              type === PageType.NPC ? "Create NPC" : "Create Player",
              (onClose) => <CreatePageModal type={type} onCreated={onClose} />,
            );
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
