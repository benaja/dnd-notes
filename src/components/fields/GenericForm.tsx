import SelectField from "./SelectField";
import EditorField from "./EditorField";
import TextField from "./TextField";
import { AttachToProps } from "~/lib/hooks/useMentions";
import FormField, { FormFieldRenderProps } from "./FormField";
import { FormFieldType } from "~/jsonTypes";
import AvatarImageField from "./AvatarImageField";
import AvatarImageInput from "./inputs/AvatarImageInput";

export default function GenericForm({
  fields,
  attachMentionsTo,
}: {
  fields: PrismaJson.FormField[];
  attachMentionsTo?: AttachToProps;
}) {
  return (
    <div className="-mx-4 flex flex-wrap">
      {fields.map((field, index) => {
        const style = {
          width: field.width * 100 + "%",
        };

        let render: (props: FormFieldRenderProps) => React.ReactNode;
        let fieldName = `fields.${index}.value`;

        if (field.type === "string") {
          render = (props) => <TextField label={field.label} {...props} />;
        } else if (field.type === "number") {
          render = (props) => (
            <TextField label={field.label} type="number" {...props} />
          );
        } else if (field.type === "select") {
          render = (props) => (
            <SelectField
              name={fieldName}
              options={field.options || []}
              label={field.label}
              {...props}
            />
          );
        } else if (field.type === "richText") {
          render = (props) => (
            <EditorField
              name={fieldName}
              label={field.label}
              attachMentionsTo={attachMentionsTo}
              {...props}
            />
          );
        } else if (field.type === FormFieldType.avatar) {
          render = (props) => (
            <AvatarImageInput label={field.label} {...props} />
          );
        } else {
          render = () => <div>Unknown field type: {field.type}</div>;
        }
        return (
          <div key={field.name} style={style} className="p-4">
            <FormField name={fieldName} render={render} />
          </div>
        );
      })}
    </div>
  );
}
