import { useEffect, useState } from "react";

export default function useInput<T>(value: T, onChange?: (value: T) => void) {
  const [internalValue, setInternalValue] = useState<T>(value);

  function onInput(value: T) {
    setInternalValue(value);
    onChange?.(value);
  }

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return {
    internalValue,
    onInput,
  };
}
