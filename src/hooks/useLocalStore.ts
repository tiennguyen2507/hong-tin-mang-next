import * as React from "react";

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

function safeParseJson<T>(raw: string): T | undefined {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

function readLocalStorage<T>(key: string): T | undefined {
  const raw = window.localStorage.getItem(key);
  if (raw == null) return undefined;
  return safeParseJson<T>(raw);
}

function writeLocalStorage<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function useLocalStore<T>(
  key: string,
  initialValue: T,
): [T, SetState<T>, boolean] {
  const [hydrated, setHydrated] = React.useState(false);
  const [value, setValue] = React.useState<T>(initialValue);

  React.useEffect(() => {
    setHydrated(true);
    try {
      const fromStorage = readLocalStorage<T>(key);
      if (fromStorage !== undefined) setValue(fromStorage);
    } catch {
      // ignore read errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      writeLocalStorage(key, value);
    } catch {
      // ignore quota/deny errors
    }
  }, [hydrated, key, value]);

  return [value, setValue, hydrated];
}

