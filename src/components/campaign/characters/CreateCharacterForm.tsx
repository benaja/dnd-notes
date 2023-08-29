"use client";

import { FormProvider, useForm } from "react-hook-form";
import TextInput from "~/components/fields/inputs/TextInput";
import { Button } from "~/components/ui/button";
import { DialogFooter } from "~/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "~/lib/trpc-client";
import { CharacterType } from "../shema";
import ImageInput from "~/components/fields/ImageInput";
import { Character } from "@prisma/client";
import GenericForm from "~/components/fields/GenericForm";
import AvatarImageInput from "~/components/fields/AvatarImageInput";
import TextField from "~/components/fields/TextField";
import { FormField, FormFieldType } from "~/server/routers/settingsRouter";

const characterSchema = z.object({
  name: z.string().max(255).min(1, "Character name is required"),
  avatar: z.string().optional().nullable(),
});
type CharacterFormValues = z.infer<typeof characterSchema>;

function getZodType(type: FormFieldType): z.ZodType<any, any, any> {
  switch (type) {
    case "number":
      return z.number();
    case "date":
      return z.date();
    case "boolean":
      return z.boolean();
    default:
      return z.string();
  }
}

function CharacterForm({
  fields,
  campaignId,
  type,
  onCreated,
}: {
  fields: FormField[];
  campaignId: string;
  type: CharacterType;
  onCreated?: (character: Character) => void;
}) {
  const utils = trpc.useContext();
  const createCharacterMutation = trpc.character.create.useMutation({
    onSuccess(data) {
      createCharacterMutation.reset();
      utils.campaign.getById.invalidate(campaignId);
      onCreated?.(data);
      formMethods.reset();
      // formMethods.register()
    },
  });

  let schemaDeclaration: Record<
    string,
    z.ZodType<any, any, any>
  > = fields.reduce((schema, field) => {
    let zod = getZodType(field.type);

    if (!field.required) {
      zod = zod.optional().nullable();
    }

    return {
      ...schema,
      [field.name]: zod,
    };
  }, {});

  let schema = characterSchema.extend({
    fields: z.object(schemaDeclaration),
  });

  const formMethods = useForm({
    defaultValues: {
      name: "",
      type: CharacterType.NPC,
      avatar: "",
      fields: Object.keys(schemaDeclaration).reduce((values, key) => {
        return {
          ...values,
          [key]: null,
        };
      }, {}),
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  async function submit(values: CharacterFormValues) {
    console.log("submit", values);
    createCharacterMutation.mutate({
      ...values,
      campaignId,
      type,
    });
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(submit)}>
        <div className="flex gap-8">
          <TextField name="name" label="Name" className="grow" />
          <AvatarImageInput name="avatar" />
        </div>
        {fields && <GenericForm fields={fields} />}
        <DialogFooter>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}

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

  if (!fields) return <></>;
  return (
    <CharacterForm
      fields={fields}
      campaignId={campaignId}
      type={type}
      onCreated={onCreated}
    />
  );
}
