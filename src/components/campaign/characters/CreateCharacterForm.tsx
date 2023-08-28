"use client";

import { FormProvider, useForm } from "react-hook-form";
import TextInput from "~/components/fields/TextInput";
import { Button } from "~/components/ui/button";
import { DialogFooter } from "~/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "~/lib/trpc-client";
import { CharacterType } from "../shema";
import ImageInput from "~/components/fields/ImageInput";
import { Character } from "@prisma/client";

const characterSchema = z.object({
  name: z.string().max(255),
  description: z.string().optional().nullable(),
  avatar: z.string().optional().nullable(),
});
type CharacterFormValues = z.infer<typeof characterSchema>;

export default function CreateCharacterForm({
  campaignId,
  type,
  onCreated,
}: {
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
    },
  });

  const formMethods = useForm({
    defaultValues: {
      name: "",
      description: "",
      type: CharacterType.NPC,
      avatar: "",
    },
    resolver: zodResolver(characterSchema),
    mode: "onBlur",
  });

  async function submit(values: CharacterFormValues) {
    createCharacterMutation.mutate({
      ...values,
      campaignId,
      type,
    });
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(submit)}>
        <TextInput name="name" label="Name" />
        <TextInput name="description" label="Description" className="mt-4" />
        {/* <RadioGroupInput
              name="type"
              items={[
                {
                  label: "NPC",
                  value: CharacterType.NPC,
                },
                {
                  label: "Player",
                  value: CharacterType.Player,
                },
              ]}
            /> */}
        <ImageInput name="avatar" label="Avatar" />
        <DialogFooter>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}