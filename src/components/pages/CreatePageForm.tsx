import { FormProvider, useForm } from "react-hook-form";
import GenericForm from "~/components/fields/GenericForm";
import { Button } from "~/components/ui/button";
import { DialogFooter } from "~/components/ui/dialog";
import { z } from "zod";
import { Fields, PageType } from "~/jsonTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "../fields/FormField";
import TextField from "../fields/TextField";

const fieldsSchema = z.array(
  z.object({
    name: z.string(),
    value: z.any().optional().nullable(),
  }),
);

export const PageSchema = z.object({
  title: z.string().min(1, "Title is required"),
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
