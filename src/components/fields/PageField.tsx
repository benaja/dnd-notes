import BaseField, { BaseFieldProps } from "./_BaseField";
import PageInput, { PageInputProps } from "./inputs/PageInput";

export default function PageField({
  value,
  types,
  onChange,
  ...props
}: PageInputProps & BaseFieldProps) {
  return (
    <BaseField {...props}>
      <PageInput types={types} value={value} onChange={onChange} />
    </BaseField>
  );
}