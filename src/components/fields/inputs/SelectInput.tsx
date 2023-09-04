import { UseControllerProps, useController } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import useInput from "~/lib/hooks/useInput";

export default function SelectInput({
  options,
  label,
  value,
  readOnly,
  onChange,
}: {
  value?: string | null;
  options: string[] | { label: string; value: string }[];
  label?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}) {
  const { internalValue, onInput } = useInput(value ?? "", onChange);

  const optionsWithLabels = options.map((option) => {
    if (typeof option === "string") {
      return { label: option, value: option };
    }

    return option;
  });

  return (
    <Select
      defaultValue={internalValue}
      onValueChange={onInput}
      disabled={readOnly}
    >
      <SelectTrigger>
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {optionsWithLabels.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
