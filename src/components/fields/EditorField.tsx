import useFormField from "~/lib/hooks/useFormField";
import BaseField, { BaseFieldProps } from "./_BaseField";
import EditorInput from "./inputs/EditorInput";
import { HTMLProps } from "react";
import { UseControllerProps } from "react-hook-form";
import { AttachToProps } from "~/lib/hooks/useMentions";

type EditorFieldProps = {
  label?: string | null;
  value?: string | null;
  minimal?: boolean;
  readOnly?: boolean;
  attachMentionsTo?: AttachToProps;
  onChange?: (value: string) => void;
};

export default function EditorField({
  label,
  value,
  minimal,
  attachMentionsTo,
  readOnly,
  onChange,
  ...props
}: EditorFieldProps & BaseFieldProps) {
  return (
    <BaseField label={label} {...props}>
      <EditorInput
        minimal={minimal}
        value={value || ""}
        attachMentionsTo={attachMentionsTo}
        readOnly={readOnly}
        onChange={onChange}
      />
    </BaseField>
  );
}
