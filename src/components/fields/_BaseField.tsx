import { HTMLAttributes } from "react";
import { UseControllerProps } from "react-hook-form";
import useFormField from "~/lib/hooks/useFormField";

export default function BaseField({
  label,
  children,
  errorMessage,
  ...props
}: HTMLAttributes<HTMLDivElement> &
  UseControllerProps & {
    label?: string | null;
    children?: React.ReactNode;
    errorMessage?: string | null;
  }) {
  return (
    <div {...props}>
      {label && <label className="font-medium">{label}</label>}

      {children}

      <p className="mt-1 h-4 leading-4 text-red-600">{errorMessage}</p>
    </div>
  );
}
