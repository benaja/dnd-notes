"use client";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";

export default function EditableText(
  {
    value,
    onInput,
    display,
    children,
    className,
  }: {
    value: string;
    onInput?: (value: string) => void;
    display?: React.ReactNode;
    children?: (props: {
      value: string;
      onClick: () => void;
      className?: string;
    }) => React.ReactNode;
    className?: string;
  } = {
    onInput: () => {},
    value: "",
    display: <p></p>,
  }
) {
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

  if (isEditing) {
    return (
      <input
        ref={input}
        type="text"
        className={classNames("-m-1 w-full bg-transparent p-1", className)}
        value={value}
        onInput={(e) => onInput && onInput(e.target.value)}
        onBlur={() => setIsEditing(false)}
      />
    );
  }

  if (!children) {
    return (
      <p onClick={onContentClick} className={className}>
        {value}
      </p>
    );
  }

  return children({ value, onClick: onContentClick, className });
}
