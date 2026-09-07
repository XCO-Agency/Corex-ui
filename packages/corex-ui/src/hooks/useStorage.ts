import { useState, useEffect, useCallback, useRef } from "react";

export type StorageTypeType = "session" | "local";

export type StorageValueType<T> = {
  value: T;
  expiresAt?: number;
};

export type UseStorageOptionsType<T> = {
  /**
   * The storage key.
   */
  key?: string;
  /**
   * Initial default value if no valid data is stored or if expired.
   */
  initialValue?: T;
  /**
   * Storage backend to use: "session" (sessionStorage) or "local" (localStorage).
   * Defaults to "session".
   */
  storage?: StorageTypeType;
  /**
   * Alias for `storage`.
   */
  type?: StorageTypeType;
  /**
   * Expiration duration in milliseconds (e.g. `1000 * 60 * 60 * 24` for 1 day).
   */
  expiresIn?: number;
  /**
   * Custom serializer. Defaults to JSON.stringify.
   */
  serialize?: (value: StorageValueType<T>) => string;
  /**
   * Custom deserializer. Defaults to JSON.parse.
   */
  deserialize?: (value: string) => StorageValueType<T>;
  /**
   * Whether to sync value changes across multiple tabs/windows.
   * Defaults to true.
   */
  syncTabs?: boolean;
};

export type UseStorageResultType<T> = [
  value: T,
  setValue: (value: T | ((prev: T) => T)) => void,
  remove: () => void,
] & {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  update: (value: T | ((prev: T) => T)) => void;
  remove: () => void;
  reset: () => void;
};

const STORAGE_CUSTOM_EVENT = "corex-storage-update";

// In-memory fallback map for restricted iframe environments (e.g. Safari ITP / Shopify embeds)
const memoryStorage = new Map<string, string>();

function getStorageInstance(storageType: StorageTypeType): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    const storage = storageType === "local" ? window.localStorage : window.sessionStorage;
    const testKey = "__corex_test__";
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return storage;
  } catch {
    return null;
  }
}

/**
 * Hook to persist and manage state in sessionStorage or localStorage with expiration support.
 * Compatible with Shopify app embeds (cross-origin iframes) with graceful in-memory fallback.
 * Supports both object destructuring `{ value, setValue, update, remove, reset }` and array destructuring `[value, setValue, remove]`.
 */
export function useStorage<T>(
  keyOrOptions: string | (UseStorageOptionsType<T> & { key: string; initialValue: T }),
  initialValueArg?: T,
  optionsArg?: UseStorageOptionsType<T>,
): UseStorageResultType<T> {
  const isObjectSignature = typeof keyOrOptions === "object" && keyOrOptions !== null;

  const key = isObjectSignature ? keyOrOptions.key : (keyOrOptions as string);
  const initialValue = isObjectSignature
    ? keyOrOptions.initialValue
    : (initialValueArg as T);

  const mergedOptions = isObjectSignature
    ? keyOrOptions
    : (optionsArg ?? {});

  const {
    storage = mergedOptions.type ?? "session",
    expiresIn = mergedOptions.expiresIn,
    serialize = (val: StorageValueType<T>) => JSON.stringify(val),
    deserialize = (raw: string) => JSON.parse(raw) as StorageValueType<T>,
    syncTabs = true,
  } = mergedOptions;

  const initialRef = useRef(initialValue);
  initialRef.current = initialValue;

  const readValue = useCallback((): T => {
    if (typeof window === "undefined") {
      return initialRef.current;
    }

    try {
      const storageProvider = getStorageInstance(storage);
      const raw = storageProvider ? storageProvider.getItem(key) : memoryStorage.get(key);

      if (raw === null || raw === undefined) {
        return initialRef.current;
      }

      const parsed = deserialize(raw);

      // Support structured StorageValueType format
      if (typeof parsed === "object" && parsed !== null && "value" in parsed) {
        if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
          if (storageProvider) {
            storageProvider.removeItem(key);
          } else {
            memoryStorage.delete(key);
          }
          return initialRef.current;
        }
        return parsed.value;
      }

      // Support raw legacy values
      return parsed as unknown as T;
    } catch {
      return initialRef.current;
    }
  }, [key, storage, deserialize]);

  const [value, setValueState] = useState<T>(readValue);

  const setStoredValue = useCallback(
    (nextValue: T | ((previousValue: T) => T)) => {
      try {
        setValueState((previousValue) => {
          const resolvedValue =
            typeof nextValue === "function"
              ? (nextValue as (previous: T) => T)(previousValue)
              : nextValue;

          const storageProvider = getStorageInstance(storage);
          const data: StorageValueType<T> = {
            value: resolvedValue,
            ...(expiresIn ? { expiresAt: Date.now() + expiresIn } : {}),
          };

          const serialized = serialize(data);

          if (storageProvider) {
            storageProvider.setItem(key, serialized);
          } else {
            memoryStorage.set(key, serialized);
          }

          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent(STORAGE_CUSTOM_EVENT, {
                detail: { key, value: serialized },
              }),
            );
          }

          return resolvedValue;
        });
      } catch (error) {
        console.warn(`[useStorage] Failed to save key "${key}":`, error);
      }
    },
    [key, storage, expiresIn, serialize],
  );

  const remove = useCallback(() => {
    try {
      const storageProvider = getStorageInstance(storage);
      if (storageProvider) {
        storageProvider.removeItem(key);
      } else {
        memoryStorage.delete(key);
      }

      setValueState(initialRef.current);

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent(STORAGE_CUSTOM_EVENT, {
            detail: { key, value: null },
          }),
        );
      }
    } catch (error) {
      console.warn(`[useStorage] Failed to remove key "${key}":`, error);
    }
  }, [key, storage]);

  const reset = useCallback(() => {
    setStoredValue(initialRef.current);
  }, [setStoredValue]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; value: string | null }>;
      if (customEvent.detail?.key === key) {
        if (customEvent.detail.value === null) {
          setValueState(initialRef.current);
        } else {
          try {
            const parsed = deserialize(customEvent.detail.value);
            if (typeof parsed === "object" && parsed !== null && "value" in parsed) {
              if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
                setValueState(initialRef.current);
              } else {
                setValueState(parsed.value);
              }
            } else {
              setValueState(parsed as unknown as T);
            }
          } catch {
            setValueState(initialRef.current);
          }
        }
      }
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === key) {
        if (e.newValue === null) {
          setValueState(initialRef.current);
        } else {
          try {
            const parsed = deserialize(e.newValue);
            if (typeof parsed === "object" && parsed !== null && "value" in parsed) {
              if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
                setValueState(initialRef.current);
              } else {
                setValueState(parsed.value);
              }
            } else {
              setValueState(parsed as unknown as T);
            }
          } catch {
            setValueState(initialRef.current);
          }
        }
      }
    };

    window.addEventListener(STORAGE_CUSTOM_EVENT, handleCustomEvent);
    if (syncTabs && storage === "local") {
      window.addEventListener("storage", handleStorageEvent);
    }

    return () => {
      window.removeEventListener(STORAGE_CUSTOM_EVENT, handleCustomEvent);
      if (syncTabs && storage === "local") {
        window.removeEventListener("storage", handleStorageEvent);
      }
    };
  }, [key, storage, syncTabs, deserialize]);

  // Construct dual-accessible result (works as both tuple array and object)
  const result = [value, setStoredValue, remove] as unknown as UseStorageResultType<T>;
  result.value = value;
  result.setValue = setStoredValue;
  result.update = setStoredValue;
  result.remove = remove;
  result.reset = reset;

  return result;
}
