import { UseControllerProps, useController } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

export default function SelectInput({
  options,
  className,
  label,
  ...props
}: {
  options: string[];
  className?: string;
  label?: string;
} & UseControllerProps) {
  const { field, fieldState } = useController(props);

  return (
    <div className={className}>
      {label && <label className="font-medium">{label}</label>}
      <Select
        defaultValue={field.value}
        onValueChange={(value) => field.onChange(value)}
      >
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
    </div>
  );
}
