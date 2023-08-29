import { UseControllerProps, useController } from "react-hook-form";

export type FormFieldRenderProps = {
  value: any;
  errorMessage?: string | null;
  onChange: (value: any) => void;
};

export default function FormField({
  render,
  ...props
}: {
  render?: (props: FormFieldRenderProps) => React.ReactNode;
} & UseControllerProps) {
  const { field, fieldState } = useController(props);
  return (
    <>
      {render?.({
        value: field.value,
        onChange: (value) => {
          field.onChange(value);
        },
        errorMessage: fieldState?.error?.message,
      })}
    </>
  );
}
