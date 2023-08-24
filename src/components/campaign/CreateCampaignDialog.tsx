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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { z } from "zod";
import { trpc } from "~/lib/trpc-client";
import { campaignSchema } from "./shema";
import { useRouter } from "next/navigation";
type CampaignFormValues = z.infer<typeof campaignSchema>;

export default function CreateCampaignDialog() {
  const createCampaignMutation = trpc.campaign.create.useMutation();
  const router = useRouter();

  const formMethods = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    resolver: zodResolver(campaignSchema),
    mode: "onBlur",
  });

  if (createCampaignMutation.status === "success") {
    createCampaignMutation.reset();
    router.refresh();
  }

  async function submit(values: CampaignFormValues) {
    createCampaignMutation.mutate(values);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Campaign</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Campaign</DialogTitle>
          <DialogDescription>
            Give your campaign a name and a description.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(submit)}>
            <TextInput name="title" label="Title" />
            <TextInput
              name="description"
              label="Description"
              className="mt-4"
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
