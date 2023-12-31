import useFormField from "~/lib/hooks/useFormField";
import BaseField, { BaseFieldProps } from "./_BaseField";
import { HTMLProps } from "react";
import { UseControllerProps } from "react-hook-form";
import SelectInput from "./inputs/SelectInput";

type SelectProps = {
  value?: string | null;
  options: string[] | { label: string; value: string }[];
  onChange?: (value: string | null) => void;
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
      <SelectInput
        readOnly={props.readOnly}
        options={options}
        value={value}
        onChange={onChange}
      />
    </BaseField>
  );
}
