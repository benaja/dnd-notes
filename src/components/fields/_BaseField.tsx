import { HTMLAttributes } from "react";
import { UseControllerProps } from "react-hook-form";
import useFormField from "~/lib/hooks/useFormField";

export type BaseFieldProps = {
  label?: string | null;
  errorMessage?: string | null;
};

export default function BaseField({
  label,
  children,
  errorMessage,
  ...props
}: HTMLAttributes<HTMLDivElement> &
  BaseFieldProps & {
    children?: React.ReactNode;
  }) {
  return (
    <div {...props}>
      {label && <label className="font-medium">{label}</label>}

      {children}

      <p className="mt-1 h-4 leading-4 text-red-600">{errorMessage}</p>
    </div>
  );
}
