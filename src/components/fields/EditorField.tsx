import useFormField from "~/lib/hooks/useFormField";
import BaseField from "./_BaseField";
import EditorInput from "./inputs/EditorInput";
import { HTMLProps } from "react";
import { UseControllerProps } from "react-hook-form";

type EditorFieldProps = {
  label?: string | null;
  value?: string | null;
  minimal?: boolean;
  onChange?: (value: string) => void;
};

export default function EditorField({
  label,
  value,
  minimal,
  onChange,
  ...props
}: HTMLProps<HTMLDivElement> & UseControllerProps & EditorFieldProps) {
  const { field, fieldState } = useFormField(props);

  return (
    <BaseField
      label={label}
      errorMessage={fieldState?.error?.message}
      {...props}
    >
      <EditorInput
        minimal={minimal}
        value={field.value}
        onChange={field.onChange}
      />
    </BaseField>
  );
}
