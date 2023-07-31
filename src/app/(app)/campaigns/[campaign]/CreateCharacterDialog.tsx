"use client";

import { FormProvider, useForm } from "react-hook-form";
import TextInput from "~/components/fiels/TextInput";
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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { z } from "zod";
import { trpc } from "~/lib/trpc-client";
import { useRouter } from "next/navigation";
import { characterSchema, CharacterType } from "../../dashboard/shema";
import RadioGroupInput from "~/components/fiels/RadioGroupInput";
import { Character } from "@prisma/client";
import { useState } from "react";
const schema = characterSchema.pick({
  name: true,
  description: true,
  type: true,
});
type CharacterFormValues = z.infer<typeof schema>;

export default function CreateCharacterDialog({
  campaignId,
  onCreated,
}: {
  campaignId: string;
  onCreated?: (character: Character) => void;
}) {
  const [open, setOpen] = useState(false);
  const createCharacterMutation = trpc.character.create.useMutation();
  const router = useRouter();

  const formMethods = useForm({
    defaultValues: {
      name: "",
      description: "",
      type: CharacterType.NPC,
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  if (createCharacterMutation.status === "success") {
    onCreated?.(createCharacterMutation.data);
    createCharacterMutation.reset();
    setOpen(false);
    formMethods.reset();
  }

  async function submit(values: CharacterFormValues) {
    createCharacterMutation.mutate({
      ...values,
      campaignId,
    });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Character</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Character</DialogTitle>
          {/* <DialogDescription>
            Give your campaign a name and a description.
          </DialogDescription> */}
        </DialogHeader>
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(submit)}>
            <TextInput name="name" label="Name" />
            <TextInput
              name="description"
              label="Description"
              className="mt-4"
            />
            <RadioGroupInput
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
            />
            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
