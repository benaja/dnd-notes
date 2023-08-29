import { zodResolver } from "@hookform/resolvers/zod";
import { Character } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import EditCharacterForm from "~/components/campaign/characters/EditCharacterForm";
import { characterSchema } from "~/components/campaign/shema";
import EditableText from "~/components/fields/EditableText";
import GenericForm from "~/components/fields/GenericForm";
import AvatarImageInput from "~/components/fields/inputs/AvatarImageInput";
import AppLayout from "~/components/layouts/AppLayout";
import useDebounce from "~/lib/hooks/useDebounce";
import { trpc } from "~/lib/trpc-client";
import { NextPageWithLayout } from "~/pages/_app";
import { format } from "date-fns";

const Page: NextPageWithLayout = function Character() {
  const router = useRouter();
  const utils = trpc.useContext();
  const updateMutation = trpc.character.update.useMutation();

  const { data: character } = trpc.character.getById.useQuery(
    router.query.character as string,
  );
  const { data: fields } = trpc.settings.characterFields.useQuery();

  const { data: mentions } = trpc.mentions.getMentions.useQuery({
    character,
  });

  const updateCharacter = useDebounce((value: typeof character) => {
    if (!value) return;
    updateMutation.mutate(value);
  });

  function editCharacter(key: keyof Character, value: any) {
    if (!character) return;
    console.log("editCharacter", key, value);
    const newCharacter = {
      ...character,
      [key]: value,
    };

    utils.character.getById.setData(character.id, newCharacter);
    updateCharacter(newCharacter);
  }

  if (!character) return <></>;
  return (
    <div>
      <EditCharacterForm character={character} />

      <h2 className="text-xl font-medium">Mentioned at</h2>
      <h3 className="text-lg font-medium">Sessions</h3>
      <div className="space-y-4">
        {mentions?.sessions.map((session) => (
          <Link
            className="flex justify-between rounded-md bg-white p-4 hover:bg-gray-100"
            key={session.id}
            href={`/app/${router.query.campaign}/sessions/${session.id}`}
          >
            <span>{session.title}</span>
            <span>{format(session.date, "dd.mm.yyyy")}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

Page.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export default Page;
