import useFormField from "~/lib/hooks/useFormField";
import BaseField, { BaseFieldProps } from "./_BaseField";
import { HTMLProps } from "react";
import { UseControllerProps } from "react-hook-form";
import SelectInput from "./inputs/SelectInput";

type SelectProps = {
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
}: SelectProps & BaseFieldProps) {
  return (
    <BaseField label={label} {...props}>
      <SelectInput options={options} value={value} onChange={onChange} />
    </BaseField>
  );
}
