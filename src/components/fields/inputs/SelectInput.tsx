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
  onChange,
}: {
  value?: string | null;
  options: string[];
  label?: string;
  onChange?: (value: string) => void;
}) {
  const { internalValue, onInput } = useInput(value ?? "", onChange);

  return (
    <Select defaultValue={internalValue} onValueChange={onInput}>
      <SelectTrigger>
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
