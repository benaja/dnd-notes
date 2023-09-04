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
import { useEffect, useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "./dropdown-menu";

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
  customCammands,
  onChange,
  onSearch,
}: {
  value?: string | ComboboxItem | null;
  items: ComboboxItem[];
  returnObject?: boolean;
  selectText?: string;
  searchText?: string;
  customCammands?: React.ReactNode;
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
    if (selectedItem || search) return items;

    return [
      {
        label: internalValue.label,
        value: internalValue.value,
      },
      ...items,
    ];
  }, [items, internalValue, valueString, search]);

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

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full max-w-md justify-between"
        >
          {internalValue
            ? internalItems.find((item) => item.value === valueString)?.label
            : selectText || "Select..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] p-0" align="start">
        {customCammands}
        <DropdownMenuGroup>
          <Command shouldFilter={false}>
            <CommandInput
              autoFocus
              value={search}
              onValueChange={updateSearch}
              onFocus={() => updateSearch("")}
              placeholder={searchText || "Search..."}
            />

            <CommandGroup heading="Search results">
              <CommandEmpty>No results</CommandEmpty>
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
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
