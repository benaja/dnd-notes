import BaseField, { BaseFieldProps } from "./_BaseField";
import PageInput, { PageInputProps } from "./inputs/PageInput";

export default function PageField({
  value,
  types,
  onChange,
  attachTo,
  ...props
}: PageInputProps & BaseFieldProps) {
  return (
    <BaseField {...props}>
      <PageInput
        readOnly={props.readOnly}
        attachTo={attachTo}
        types={types}
        value={value}
        onChange={onChange}
      />
    </BaseField>
  );
}
