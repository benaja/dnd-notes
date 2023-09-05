import SelectFieldComponent from "./SelectField";
import EditorField from "./EditorField";
import { AttachToProps } from "~/lib/hooks/useMentions";
import FormField, { FormFieldRenderProps } from "./FormField";
import { Fields, FormFieldType, FormFields } from "~/jsonTypes";
import AvatarImageField from "./AvatarImageField";
import parseISO from "date-fns/parseISO";
import TextFieldComponent from "./TextField";
import DateFieldComponent from "./DateField";
import ImageInputComponent from "./ImageInput";
import PageFieldComponent from "./PageField";
import {
  DateField,
  ImageField,
  PageField,
  RichTextField,
  SelectField,
  TextField,
} from "~/lib/form-fields";
import { cn } from "~/lib/utils";
import { useFormContext } from "react-hook-form";

function createField(field: FormFields) {
  switch (field.type) {
    case FormFieldType.Text:
      return new TextField(field);
    case FormFieldType.Date:
      return new DateField(field);
    case FormFieldType.Select:
      return new SelectField(field);
    case FormFieldType.RichText:
      return new RichTextField(field);
    case FormFieldType.Image:
      return new ImageField(field);
    case FormFieldType.PageSelector:
      return new PageField(field);
    default:
      return null;
  }
}

export default function GenericForm({
  fields,
  attachMentionsTo,
  readonly,
}: {
  fields: Fields;
  attachMentionsTo?: AttachToProps;
  readonly?: boolean;
}) {
  const form = useFormContext();

  return (
    <div className="-mx-4 flex flex-wrap">
      {fields.map((fieldObj, index) => {
        const field = createField(fieldObj);
        if (!field) {
          return (
            <div key={fieldObj.name}>Unknown field type: {fieldObj.type}</div>
          );
        }

        let render: (
          props: FormFieldRenderProps & { readOnly?: boolean },
        ) => React.ReactNode;
        let fieldName = `fields.${index}.value`;

        form.register(`fields.${index}.name`, { value: field.name });

        if (field instanceof TextField) {
          render = (props) => (
            <TextFieldComponent
              type={field.options.type}
              label={field.label}
              {...props}
            />
          );
        } else if (field instanceof SelectField) {
          render = (props) => (
            <SelectFieldComponent
              options={field.options.items || []}
              label={field.label}
              {...props}
            />
          );
        } else if (field instanceof RichTextField) {
          render = (props) => (
            <EditorField
              name={fieldName}
              label={field.label}
              attachMentionsTo={{
                source: attachMentionsTo?.source || undefined,
                fieldName: field.name,
              }}
              {...props}
            />
          );
        } else if (field instanceof ImageField) {
          render = (props) =>
            field.options.type === "round" ? (
              <AvatarImageField label={field.label} {...props} />
            ) : (
              <ImageInputComponent
                name={field.name}
                label={field.label}
                {...props}
              />
            );
        } else if (field instanceof DateField) {
          render = ({ value, ...props }) => (
            <DateFieldComponent
              label={field.label}
              value={
                value && typeof value === "string" ? parseISO(value) : value
              }
              {...props}
            />
          );
        } else if (field instanceof PageField) {
          render = (props) => (
            <PageFieldComponent
              types={field.options.types}
              label={field.label}
              attachTo={{
                source: attachMentionsTo?.source || undefined,
                fieldName: field.name,
              }}
              {...props}
            />
          );
        } else {
          render = () => <div>Unknown field type</div>;
        }
        return (
          <div
            key={field.name}
            className={cn("w-full min-w-[250px] p-4", field.className)}
          >
            {readonly ? (
              render({
                value: fieldObj.value,
                onChange: () => {},
                readOnly: readonly,
              })
            ) : (
              <FormField name={fieldName} render={render} />
            )}
          </div>
        );
      })}
    </div>
  );
}
