"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { useState } from "react";

export default function DateInput({
  value,
  onChange,
}: {
  value?: Date | null;
  onChange?: (date?: Date | null) => void;
}) {
  const [date, setDate] = useState<Date | undefined | null>(value);
  const [isOpen, setIsOpen] = useState(false);

  function updateDate(date: Date | undefined | null) {
    setDate(date);
    onChange?.(date);
    setIsOpen(false);
  }

  return (
    <Popover open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={(value) => {
            value && updateDate(value);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
