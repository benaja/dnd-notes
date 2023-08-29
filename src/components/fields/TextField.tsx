import { UseControllerProps, useController } from "react-hook-form";
import BaseField from "./_BaseField";
import TextInput from "./inputs/TextInput";
import useFormField from "~/lib/hooks/useFormField";
import { HTMLAttributes, HTMLProps } from "react";

type InputProps = {
  label?: string | null;
  value?: string | null;
  type?: string;
  onChange?: (value: string) => void;
};

export default function TextField({
  label,
  value,
  onChange,
  type,
  ...props
}: HTMLProps<HTMLDivElement> & UseControllerProps & InputProps) {
  const { field, fieldState } = useFormField(props);

  console.log(field.name, field.value);

  return (
    <BaseField
      label={label}
      errorMessage={fieldState?.error?.message}
      {...props}
    >
      <TextInput type={type} {...field}></TextInput>
    </BaseField>
  );
}
