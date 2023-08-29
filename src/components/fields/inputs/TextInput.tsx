import {
  HTMLAttributes,
  HTMLProps,
  HtmlHTMLAttributes,
  forwardRef,
} from "react";
import { UseControllerProps, useController } from "react-hook-form";
import useInput from "~/lib/hooks/useInput";

type InputProps = {
  label?: string;
  type?: string;
  className?: string;
};

function parseValue(value?: string | number, type?: string) {
  if (type === "number" && typeof value === "string") {
    if (!value) return null;
    return parseFloat(value);
  }
  return value ?? null;
}

export default forwardRef(function TextInput(
  {
    value,
    onChange,
    ...props
  }: HTMLProps<HTMLInputElement> & {
    value?: string | number | null;
    onChange?: (value: string | number | null) => void;
  },
  ref: React.Ref<HTMLInputElement>,
) {
  const { internalValue, onInput } = useInput<string | number | null>(
    parseValue(value, props.type),
    onChange,
  );

  return (
    <input
      className="form-control m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 text-sm font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
      value={internalValue ?? ""}
      onChange={(event) => {
        return onInput(parseValue(event.target.value, props.type));
      }}
      ref={ref}
      {...props}
    />
  );
});
