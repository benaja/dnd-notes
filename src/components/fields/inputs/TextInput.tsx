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

function parseValue(value?: string | number | null, type?: string) {
  if (type === "number" && typeof value === "string") {
    if (!value) return null;
    return parseFloat(value);
  }
  return value ?? null;
}

export default function TextInput({
  value,
  onChange,
  ...props
}: Omit<HTMLProps<HTMLInputElement>, "value" | "onChange"> & {
  value?: string | number | null;
  onChange?: (value: string | number | null) => void;
}) {
  const { internalValue, onInput } = useInput<string | number | null>(
    parseValue(value, props.type),
    onChange,
  );

  if (props.type === "textarea") {
    return (
      <textarea
        className="form-control m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 text-sm font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
        value={internalValue ?? ""}
        onChange={(event) => {
          return onInput(parseValue(event.target.value, props.type));
        }}
      />
    );
  }

  return (
    <input
      className="form-control m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 text-sm font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
      value={internalValue ?? ""}
      onChange={(event) => {
        return onInput(parseValue(event.target.value, props.type));
      }}
      {...props}
    />
  );
}
