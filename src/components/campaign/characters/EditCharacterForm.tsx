import { Character } from "@prisma/client";
import { trpc } from "~/lib/trpc-client";
import CharacterForm, { CharacterFormValues } from "./CharacterForm";
import { CharacterType } from "~/jsonTypes";
import EditableText from "~/components/fields/EditableText";
import AvatarImageInput from "~/components/fields/inputs/AvatarImageInput";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { characterSchema } from "../shema";
import GenericForm from "~/components/fields/GenericForm";
import FormField from "~/components/fields/FormField";
import TextField from "~/components/fields/TextField";
import { useEffect } from "react";
import useDebounce from "~/lib/hooks/useDebounce";

export default function EditCharacterForm({
  character,
  onChange,
}: {
  character: Character;
  onChange?: (character: CharacterFormValues) => void;
}) {
  const { data: fields } = trpc.settings.characterFields.useQuery();
  const updateCharacterMutation = trpc.character.update.useMutation({
    onSuccess(data) {
      updateCharacterMutation.reset();
      onChange?.(data);
    },
  });

  const formMethods = useForm({
    defaultValues: {
      ...character,
    },
    resolver: zodResolver(characterSchema),
    mode: "onBlur",
  });

  const onSubmit = useDebounce(
    (character: Character, values: CharacterFormValues) => {
      updateCharacterMutation.mutate({
        ...values,
        id: character.id,
        campaignId: character.campaignId,
      });
    },
  );

  useEffect(() => {
    const subscription = formMethods.watch((value) => {
      formMethods.handleSubmit((values: CharacterFormValues) =>
        onSubmit(character, values),
      )();
    });
    return () => subscription.unsubscribe();
  }, [formMethods, onChange, character, onSubmit]);

  if (!fields) return <></>;
  return (
    <>
      <FormProvider {...formMethods}>
        <div className="flex items-center gap-8">
          <FormField
            name="name"
            render={(props) => (
              <EditableText {...props} className="grow text-3xl">
                {({ value, ...props }) => {
                  return <h1 {...props}>{value}</h1>;
                }}
              </EditableText>
            )}
          />

          <FormField
            name="avatar"
            render={(props) => <AvatarImageInput {...props} />}
          />
        </div>

        {fields && <GenericForm fields={fields} />}
      </FormProvider>
      {/* <p>Mentions Campaigns</p>
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
      ))} */}
    </>
  );
}
