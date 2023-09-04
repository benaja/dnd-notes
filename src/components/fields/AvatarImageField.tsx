import { HTMLProps } from "react";
import { UseControllerProps } from "react-hook-form";
import AvatarImageInput from "./inputs/AvatarImageInput";
import useFormField from "~/lib/hooks/useFormField";
import BaseField, { BaseFieldProps } from "./_BaseField";

type AvatarProps = {
  value?: string | null;
  onChange?: (value: string | null) => void;
};

export default function AvatarImageField({
  value,
  onChange,
  ...props
}: AvatarProps & BaseFieldProps) {
  return (
    <BaseField {...props}>
      <AvatarImageInput
        value={value}
        readOnly={props.readOnly}
        onChange={onChange}
        {...props}
      ></AvatarImageInput>
    </BaseField>
  );
}
