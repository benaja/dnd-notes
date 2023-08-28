import debounce from "lodash/debounce";
import { useMemo } from "react";

export default function useDebounce<T extends any[]>(
  callback: (...args: T) => void,
  delay: number = 300,
): (...args: T) => void {
  return useMemo(() => debounce(callback, delay), []);
}
