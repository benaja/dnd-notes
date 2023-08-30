import { FormProvider, useForm } from "react-hook-form";
import AvatarImageInput from "~/components/fields/inputs/AvatarImageInput";
import GenericForm from "~/components/fields/GenericForm";
import TextField from "~/components/fields/TextField";
import { Button } from "~/components/ui/button";
import { DialogFooter } from "~/components/ui/dialog";
import { z } from "zod";
import { CharacterType, FormFieldType, PageType } from "~/jsonTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Character } from "@prisma/client";
import AvatarImageField from "~/components/fields/AvatarImageField";
import FormField from "~/components/fields/FormField";

export const PageSchema = z.object({
  title: z.string().max(255).min(1, "Page title is required"),
  fields: z.array(
    z.object({
      name: z.string(),
      value: z.any(),
    }),
  ),
});

export type PageFormValues = z.infer<typeof PageSchema>;

export default function CreatePageForm({
  fields,
  type,
  onSubmit,
}: {
  fields: PrismaJson.FormField[];
  type: PageType;
  onSubmit?: (values: PageFormValues) => void;
}) {
  const formMethods = useForm({
    defaultValues: {
      title: "",
      fields: fields.map((field) => ({
        name: field.name,
        value: field.value,
      })),
    },
    resolver: zodResolver(PageSchema),
    mode: "onBlur",
  });

  function getTitle() {
    console.log("type", type);
    switch (type) {
      case PageType.Player:
      case PageType.NPC:
        return "Name";
      default:
        return "Title";
    }
  }

  return (
    <FormProvider {...formMethods}>
      {JSON.stringify(formMethods.formState.errors)}
      <form
        onSubmit={formMethods.handleSubmit((values) => {
          console.log("submit page", values);
          onSubmit?.(values);
        })}
      >
        <div className="my-6 flex gap-8">
          <FormField
            name="title"
            render={(props) => (
              <TextField {...props} label={getTitle()} className="grow" />
            )}
          ></FormField>
        </div>
        {fields && (
          <GenericForm
            fields={fields.filter((field) => field.showOnCreate)}
            // attachMentionsTo={{
            //   character,
            // }}
          />
        )}
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}
