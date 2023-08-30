import { UseControllerProps, useController } from "react-hook-form";
import BaseField, { BaseFieldProps } from "./_BaseField";
import TextInput from "./inputs/TextInput";
import useFormField from "~/lib/hooks/useFormField";
import { HTMLAttributes, HTMLProps } from "react";

type InputProps = {
  value?: string | number | null;
  type?: string;
  onChange?: (value: string | number | null) => void;
};

export default function TextField({
  value,
  onChange,
  type,
  ...props
}: InputProps & BaseFieldProps) {
  return (
    <BaseField {...props}>
      <TextInput type={type} value={value} onChange={onChange}></TextInput>
    </BaseField>
  );
}