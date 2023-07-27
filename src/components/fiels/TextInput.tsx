import { UseControllerProps, useController } from "react-hook-form";

type InputProps = {
  label?: string;
  type?: string;
};

export default function TextInput(props: InputProps & UseControllerProps) {
  const { field, fieldState } = useController(props);

  return (
    <>
      {props.label ?? <label>{props.label}</label>}
      <input
        className="form-control m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 text-sm font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
        type={props.type ?? "text"}
        {...field}
      />

      <p className="mt-1 h-4 leading-4 text-red-600">
        {fieldState?.error?.message}
      </p>
    </>
  );
}
