import useFormField from "~/lib/hooks/useFormField";
import BaseField from "./_BaseField";
import EditorInput from "./inputs/EditorInput";
import { HTMLProps } from "react";
import { UseControllerProps } from "react-hook-form";
import { AttachToProps } from "~/lib/hooks/useMentions";

type EditorFieldProps = {
  label?: string | null;
  value?: string | null;
  minimal?: boolean;
  attachMentionsTo?: AttachToProps;
  onChange?: (value: string) => void;
};

export default function EditorField({
  label,
  value,
  minimal,
  attachMentionsTo,
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
        attachMentionsTo={attachMentionsTo}
        onChange={field.onChange}
      />
    </BaseField>
  );
}
