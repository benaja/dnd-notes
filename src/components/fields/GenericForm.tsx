import { FormField } from "~/server/routers/settingsRouter";
import SelectField from "./SelectField";
import EditorField from "./EditorField";
import TextField from "./TextField";

export default function GenericForm({ fields }: { fields: FormField[] }) {
  return (
    <div className="-mx-4 flex flex-wrap">
      {fields.map((field, index) => {
        const style = {
          width: field.width * 100 + "%",
        };

        let component: JSX.Element;
        let fieldName = `fields.${field.name}`;

        if (field.type === "string") {
          component = <TextField name={fieldName} label={field.label} />;
        } else if (field.type === "number") {
          component = (
            <TextField name={fieldName} label={field.label} type="number" />
          );
        } else if (field.type === "select") {
          component = (
            <SelectField
              name={fieldName}
              options={field.options || []}
              label={field.label}
            />
          );
        } else if (field.type === "richText") {
          component = (
            <EditorField minimal name={fieldName} label={field.label} />
          );
        } else {
          component = <div>Unknown field type: {field.type}</div>;
        }
        return (
          <div key={field.name} style={style} className="p-4">
            {component}
          </div>
        );
      })}
    </div>
  );
}
