import { FormProvider, useForm } from "react-hook-form";
import AvatarImageInput from "~/components/fields/inputs/AvatarImageInput";
import GenericForm from "~/components/fields/GenericForm";
import TextField from "~/components/fields/TextField";
import { Button } from "~/components/ui/button";
import { DialogFooter } from "~/components/ui/dialog";
import { characterSchema } from "../shema";
import { z } from "zod";
import { Fields, FormFieldType, PageType } from "~/jsonTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Character } from "@prisma/client";
import AvatarImageField from "~/components/fields/AvatarImageField";
import FormField from "~/components/fields/FormField";

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

const schema = characterSchema.omit({
  id: true,
  campaignId: true,
});

export type CharacterFormValues = z.infer<typeof schema>;

export default function CharacterForm({
  character,
  values,
  fields,
  onSubmit,
  onChange,
}: {
  character?: Character;
  values?: CharacterFormValues;
  fields: Fields;
  onSubmit?: (values: CharacterFormValues) => void;
  onChange?: (values: CharacterFormValues) => void;
}) {
  // let schemaDeclaration: Record<
  //   string,
  //   z.ZodType<any, any, any>
  // > = fields.reduce((schema, field) => {
  //   let zod = getZodType(field.type);

  //   if (!field.required) {
  //     zod = zod.optional().nullable();
  //   }

  //   return {
  //     ...schema,
  //     [field.name]: zod,
  //   };
  // }, {});

  const formMethods = useForm({
    defaultValues: values || {
      name: "",
      type: PageType.NPC,
      avatar: "",
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  function afterSubmit(character: Character) {
    formMethods.reset();
    formMethods.clearErrors();
    // formMethods.unregister();
    // formMethods.register();
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
            name="name"
            render={(props) => (
              <TextField {...props} label="Name" className="grow" />
            )}
          ></FormField>
          <FormField
            name="avatar"
            render={(props) => <AvatarImageInput {...props} />}
          />
        </div>
        {/* {fields && (
          <GenericForm
            fields={fields}
            attachMentionsTo={{
              character,
            }}
          />
        )} */}
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}
