import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, fallbackValue?: T) {
  const [value, setValue] = useState<T>(fallbackValue);
  useEffect(() => {
    const stored = localStorage.getItem(key);
    setValue(stored ? (JSON.parse(stored) as T) : fallbackValue);
  }, [fallbackValue, key]);

  useEffect(() => {
    if (!value) {
      localStorage.removeItem(key);
    } else if (JSON.stringify(value) !== localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue] as const;
}
