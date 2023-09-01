import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useMemo, useState } from "react";

export type ComboboxItem = {
  value: string;
  label: string;
};

export function Combobox({
  value,
  items,
  returnObject,
  selectText,
  searchText,
  onChange,
  onSearch,
}: {
  value?: string | ComboboxItem | null;
  items: ComboboxItem[];
  returnObject?: boolean;
  selectText?: string;
  searchText?: string;
  onChange?: (value: string | ComboboxItem | null) => void;
  onSearch?: (value: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const valueString =
    typeof internalValue === "object" ? internalValue?.value : internalValue;
  const [search, setSearch] = useState("");
  const internalItems = useMemo(() => {
    if (!internalValue || typeof internalValue === "string") return items;

    const selectedItem = items.find((item) => item.value === valueString);
    if (selectedItem) return items;

    return [
      {
        label: internalValue.label,
        value: internalValue.value,
      },
      ...items,
    ];
  }, [items, internalValue, valueString]);

  function updateValue(value: string | null) {
    let newValue: string | ComboboxItem | null;
    if (returnObject) {
      newValue = items.find((item) => item.value === value) ?? null;
    } else {
      newValue = value;
    }
    setInternalValue(newValue);
    onChange?.(newValue);
  }

  function updateSearch(value: string) {
    setSearch(value);
    onSearch?.(value);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {internalValue
            ? internalItems.find((item) => item.value === valueString)?.label
            : selectText || "Select..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            value={search}
            onValueChange={updateSearch}
            onFocus={() => updateSearch("")}
            placeholder={searchText || "Search..."}
          />
          <CommandEmpty>No results</CommandEmpty>
          <CommandGroup>
            {internalItems.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={(currentValue) => {
                  updateValue(
                    currentValue === valueString ? null : currentValue,
                  );
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    valueString === item.value ? "opacity-100" : "opacity-0",
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
