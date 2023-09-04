"use client";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";

export default function EditableText(
  {
    value,
    onChange,
    className,
    tag = "p",
  }: {
    value?: string | null;
    onChange?: (value: string) => void;
    className?: string;
    tag?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  } = {
    value: "",
  },
) {
  const internalValue = useRef(value);
  const input = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (input.current) {
      input.current.focus();
    }
  });

  function updateValue(value: string) {
    internalValue.current = value;
    onChange?.(value);
  }

  const Comp = tag;

  useEffect(() => {
    if (input.current) {
      input.current.textContent = value || "";
    }
  }, [value]);

  return (
    <Comp
      ref={input}
      contentEditable={isEditing}
      onClick={() => setIsEditing(true)}
      onBlur={() => setIsEditing(false)}
      onInput={(e) => updateValue(e.currentTarget.textContent || "")}
      className={cn("focus-visible:outline-none", className)}
    />
  );
}
