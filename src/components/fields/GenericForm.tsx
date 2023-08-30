import SelectField from "./SelectField";
import EditorField from "./EditorField";
import TextField from "./TextField";
import { AttachToProps } from "~/lib/hooks/useMentions";
import FormField, { FormFieldRenderProps } from "./FormField";
import { Fields, FormFieldType } from "~/jsonTypes";
import AvatarImageField from "./AvatarImageField";
import DateField from "./DateField";
import parseISO from "date-fns/parseISO";

export default function GenericForm({
  fields,
  attachMentionsTo,
}: {
  fields: Fields;
  attachMentionsTo?: AttachToProps;
}) {
  return (
    <div className="-mx-4 flex flex-wrap">
      {Object.keys(fields)
        .sort((a, b) => (fields[a].position || 0) - (fields[b].position || 0))
        .map((key) => {
          const field = fields[key];
          const style = {
            width: field.width * 100 + "%",
          };

          let render: (props: FormFieldRenderProps) => React.ReactNode;
          let fieldName = `fields.${key}.value`;

          if (field.type === "string") {
            render = (props) => <TextField label={field.label} {...props} />;
          } else if (field.type === FormFieldType.Number) {
            render = (props) => (
              <TextField label={field.label} type="number" {...props} />
            );
          } else if (field.type === FormFieldType.Select) {
            render = (props) => (
              <SelectField
                name={fieldName}
                options={field.options || []}
                label={field.label}
                {...props}
              />
            );
          } else if (field.type === FormFieldType.RichText) {
            render = (props) => (
              <EditorField
                name={fieldName}
                label={field.label}
                attachMentionsTo={{
                  source: attachMentionsTo?.source || undefined,
                  fieldName: key,
                }}
                {...props}
              />
            );
          } else if (field.type === FormFieldType.Avatar) {
            render = (props) => (
              <AvatarImageField label={field.label} {...props} />
            );
          } else if (field.type === FormFieldType.Date) {
            render = ({ value, ...props }) => (
              <DateField
                label={field.label}
                value={value ? parseISO(value) : null}
                {...props}
              />
            );
          } else {
            render = () => <div>Unknown field type: {field.type}</div>;
          }
          return (
            <div key={key} style={style} className="p-4">
              <FormField name={fieldName} render={render} />
            </div>
          );
        })}
    </div>
  );
}
