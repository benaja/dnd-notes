import { UseControllerProps, useController } from "react-hook-form";
import BaseField, { BaseFieldProps } from "./_BaseField";
import TextInput from "./inputs/TextInput";
import useFormField from "~/lib/hooks/useFormField";
import { HTMLAttributes, HTMLProps } from "react";
import DateInput from "./inputs/DateInput";

type DateFieldProps = {
  value?: Date | null;
  onChange?: (value?: Date | null) => void;
};

export default function DateField({
  value,
  onChange,
  ...props
}: DateFieldProps & BaseFieldProps) {
  return (
    <BaseField {...props}>
      <DateInput value={value} onChange={onChange}></DateInput>
    </BaseField>
  );
}
