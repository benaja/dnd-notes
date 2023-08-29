import useFormField from "~/lib/hooks/useFormField";
import BaseField from "./_BaseField";
import { HTMLProps } from "react";
import { UseControllerProps } from "react-hook-form";
import SelectInput from "./inputs/SelectInput";

type SelectProps = {
  label?: string | null;
  value?: string | null;
  options: string[];
  onChange?: (value: string) => void;
};

export default function SelectField({
  label,
  value,
  options,
  type,
  onChange,
  ...props
}: HTMLProps<HTMLDivElement> & UseControllerProps & SelectProps) {
  const { field, fieldState } = useFormField(props);

  return (
    <BaseField
      label={label}
      errorMessage={fieldState?.error?.message}
      {...props}
    >
      <SelectInput
        options={options}
        value={field.value}
        onChange={field.onChange}
      />
    </BaseField>
  );
}
