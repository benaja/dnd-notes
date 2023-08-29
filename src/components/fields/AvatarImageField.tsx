import { HTMLProps } from "react";
import { UseControllerProps } from "react-hook-form";
import AvatarImageInput from "./inputs/AvatarImageInput";
import useFormField from "~/lib/hooks/useFormField";

type AvatarProps = {
  label?: string | null;
  value?: string | null;
  type?: string;
  onChange?: (value: string | null) => void;
};

export default function AvatarImageField({
  value,
  onChange,
  ...props
}: HTMLProps<HTMLDivElement> & UseControllerProps & AvatarProps) {
  const { field, fieldState } = useFormField({
    ...props,
    // defaultValue: value ?? null,
  });

  console.log(field.name, field.value); // <console>

  return (
    <AvatarImageInput
      value={field.value}
      onChange={field.onChange}
      {...props}
    ></AvatarImageInput>
  );
}
