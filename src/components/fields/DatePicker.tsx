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

export default function DatePicker({
  value,
  onChange,
}: {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}) {
  const [date, setDate] = useState<Date | undefined>(value);
  const [isOpen, setIsOpen] = useState(false);

  function updateDate(date: Date | undefined) {
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
            "w-[280px] justify-start text-left font-normal",
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
          selected={date}
          onSelect={(value) => {
            value && updateDate(value);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
