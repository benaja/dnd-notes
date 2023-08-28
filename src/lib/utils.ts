import { type ClassValue, clsx } from "clsx";
import debounce from "lodash/debounce";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
