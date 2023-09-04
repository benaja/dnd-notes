import { FormProvider, useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { DialogFooter } from "~/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "~/lib/trpc-client";
import { campaignSchema } from "./shema";
import { useRouter } from "next/navigation";
import useDialog from "~/lib/hooks/useDialog";
import TextField from "../fields/TextField";
import FormField from "../fields/FormField";
type CampaignFormValues = z.infer<typeof campaignSchema>;

function CreateCampaignForm() {
  const createCampaignMutation = trpc.campaign.create.useMutation({
    onSuccess(data) {
      createCampaignMutation.reset();
      router.push(`/app/${data.id}`);
    },
  });
  const router = useRouter();

  const formMethods = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    resolver: zodResolver(campaignSchema),
    mode: "onBlur",
  });

  async function submit(values: CampaignFormValues) {
    createCampaignMutation.mutate(values);
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(submit)}>
        <FormField
          name="title"
          render={(props) => <TextField {...props} label="Title" />}
        />
        <DialogFooter>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}

export default function CreateCampaignDialog() {
  const [dialog, showDialog] = useDialog();

  return (
    <>
      {dialog}

      <Button
        onClick={() =>
          showDialog("Create Campaign", () => <CreateCampaignForm />)
        }
      >
        Create Campaign
      </Button>
    </>
  );
}
