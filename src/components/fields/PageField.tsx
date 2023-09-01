import BaseField, { BaseFieldProps } from "./_BaseField";
import PageInput, { PageInputProps } from "./inputs/PageInput";

export default function PageField({
  value,
  onChange,
  ...props
}: PageInputProps & BaseFieldProps) {
  return (
    <BaseField {...props}>
      <PageInput value={value} onChange={onChange} />
    </BaseField>
  );
}
