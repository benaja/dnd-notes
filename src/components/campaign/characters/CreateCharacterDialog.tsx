"use client";

import { FormProvider, useForm } from "react-hook-form";
import TextInput from "~/components/fields/TextInput";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "~/lib/trpc-client";
import { CharacterType } from "../shema";
import { Character } from "@prisma/client";
import { useState } from "react";
import ImageInput from "~/components/fields/ImageInput";

const characterSchema = z.object({
  name: z.string().max(255),
  description: z.string().optional().nullable(),
  avatar: z.string().optional().nullable(),
});
type CharacterFormValues = z.infer<typeof characterSchema>;

export default function CreateCharacterDialog({
  campaignId,
  onCreated,
  type,
}: {
  campaignId: string;
  onCreated?: (character: Character) => void;
  type: CharacterType;
}) {
  const [open, setOpen] = useState(false);
  const createCharacterMutation = trpc.character.create.useMutation({
    onSuccess(data) {
      onCreated?.(data);
      createCharacterMutation.reset();
      setOpen(false);
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
    console.log(values);
    createCharacterMutation.mutate({
      ...values,
      campaignId,
      type,
    });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl hover:bg-gray-200">
          +
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Character</DialogTitle>
        </DialogHeader>
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(submit)}>
            <TextInput name="name" label="Name" />
            <TextInput
              name="description"
              label="Description"
              className="mt-4"
            />
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
      </DialogContent>
    </Dialog>
  );
}
