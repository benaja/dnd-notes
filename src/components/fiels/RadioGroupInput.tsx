import { UseControllerProps, useController } from "react-hook-form";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export default function RadioGroupInput({
  items,
  selected,
  onChange,
  ...props
}: {
  items: {
    label: string;
    value: string;
  }[];
  selected?: string | null;
  onChange?: (value: string) => void;
} & UseControllerProps) {
  const { field, fieldState } = useController(props);
  return (
    <>
      <RadioGroup
        value={field.value}
        onValueChange={(value) => field.onChange(value)}
      >
        {items.map((item) => (
          <div
            key={item.value}
            className="flex cursor-pointer items-center space-x-2"
          >
            <RadioGroupItem value={item.value} id={item.value} />
            <Label htmlFor={item.value}>{item.label}</Label>
          </div>
        ))}
      </RadioGroup>

      <p className="mt-1 h-4 leading-4 text-red-600">
        {fieldState?.error?.message}
      </p>
    </>
  );
}
