"use client";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";

export default function EditableText(
  {
    value,
    onChange,
    display,
    children,
    className,
    onBlur,
  }: {
    value?: string | null;
    onChange?: (value: string) => void;
    onBlur?: (value: string) => void;
    display?: React.ReactNode;
    children?: (props: {
      value?: string | null;
      onClick: () => void;
      className?: string;
    }) => React.ReactNode;
    className?: string;
  } = {
    value: "",
    display: <p></p>,
  },
) {
  const [internalValue, setInternalValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (input.current) {
      input.current.focus();
    }
  });

  function onContentClick() {
    setIsEditing(true);
  }

  function updateValue(value: string) {
    setInternalValue(value);
    onChange?.(value);
  }

  if (isEditing) {
    return (
      <div className={className}>
        <input
          ref={input}
          type="text"
          className={classNames("-m-1 w-full bg-transparent p-1")}
          value={internalValue || ""}
          onInput={(e) => updateValue((e.target as HTMLInputElement).value)}
          onBlur={(e) => {
            setIsEditing(false);
            onBlur?.((e.target as HTMLInputElement).value);
          }}
        />
      </div>
    );
  }

  if (!children) {
    return (
      <p onClick={onContentClick} className={className}>
        {internalValue}
      </p>
    );
  }

  return children({ value: internalValue, onClick: onContentClick, className });
}
