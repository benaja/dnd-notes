import { FormProvider, useForm } from "react-hook-form";
import AvatarImageInput from "~/components/fields/inputs/AvatarImageInput";
import GenericForm from "~/components/fields/GenericForm";
import TextField from "~/components/fields/TextField";
import { Button } from "~/components/ui/button";
import { DialogFooter } from "~/components/ui/dialog";
import { z } from "zod";
import { Fields, FormFieldType, PageType } from "~/jsonTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Character } from "@prisma/client";
import AvatarImageField from "~/components/fields/AvatarImageField";
import FormField from "~/components/fields/FormField";

const fieldsSchema = z.record(
  z.object({
    value: z.any().optional().nullable(),
  }),
);

export const PageSchema = z.object({
  title: z.string().max(255).min(1, "Page title is required"),
  fields: fieldsSchema,
});

export type PageFormValues = z.infer<typeof PageSchema>;

export default function CreatePageForm({
  fields,
  type,
  onSubmit,
}: {
  fields: Fields;
  type: PageType;
  onSubmit?: (values: PageFormValues) => void;
}) {
  const formMethods = useForm({
    defaultValues: {
      title: "",
      fields,
    },
    resolver: zodResolver(PageSchema),
    mode: "onBlur",
  });

  function getTitle() {
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
            fields={Object.keys(fields)
              .filter((key) => fields[key].showOnCreate)
              .reduce(
                (obj, key) => ({
                  ...obj,
                  [key]: fields[key],
                }),
                {},
              )}
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
