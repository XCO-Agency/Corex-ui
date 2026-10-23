import { useCallback, useRef, useState } from "react";

/** Controlled when `value` is defined, otherwise holds its own state. */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
): [T, (next: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const controlledRef = useRef(isControlled);
  controlledRef.current = isControlled;

  const setValue = useCallback((next: T) => {
    if (!controlledRef.current) setInternal(next);
    onChangeRef.current?.(next);
  }, []);

  return [isControlled ? (value as T) : internal, setValue];
}
