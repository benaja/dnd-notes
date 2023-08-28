import { FormField } from "~/server/routers/settingsRouter";
import TextInput from "./TextInput";
import SelectInput from "./SelectInput";

export default function GenericForm({ fields }: { fields: FormField[] }) {
  return (
    <div className="-mx-4 flex flex-wrap">
      {fields.map((field, index) => {
        const style = {
          width: field.width * 100 + "%",
        };

        let component: JSX.Element;

        if (field.type === "string") {
          component = <TextInput name={field.name} label={field.label} />;
        } else if (field.type === "number") {
          component = (
            <TextInput name={field.name} label={field.label} type="number" />
          );
        } else if (field.type === "select") {
          component = (
            <SelectInput
              name={field.name}
              options={field.options || []}
              label={field.label}
            />
          );
        } else {
          component = <div>Unknown field type: {field.type}</div>;
        }
        return (
          <div key={field.name} style={style} className="p-4">
            {component}
          </div>
        );
        // return (
        //   <div key={field.name} className="flex flex-col">
        //     <label htmlFor={field.name}>{field.label}</label>
        //     <input type={field.type} id={field.name} name={field.name} />
        //   </div>
        // );
      })}
    </div>
  );
}
