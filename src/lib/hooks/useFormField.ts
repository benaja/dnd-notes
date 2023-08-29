import { UseControllerProps, useController } from "react-hook-form";

export default function useFormField(props: UseControllerProps) {
  const { field, fieldState } = useController(props);

  return {
    field,
    fieldState,
  };
}
