export default function TextInput(
  {
    label,
    type,
    name,
    ...props
  }: {
    label?: string;
    type?: string;
    name?: string;
    [key: string]: any;
  } = {
    type: "text",
  }
) {
  return (
    <>
      {label ?? <label>{label}</label>}
      <input
        type={type}
        name={name}
        className="form-control m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 text-sm font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
        {...props}
      />
    </>
  );
}
