import { useState } from 'react';
export function useLocalStorage<T>(key: string, fallback: T, validate: (value: unknown) => value is T) {
  const [value, setValue] = useState<T>(() => { try { const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? 'null'); return validate(parsed) ? parsed : fallback; } catch { return fallback; } });
  const [storageError, setStorageError] = useState(false);
  const update = (next: T) => { setValue(next); try { localStorage.setItem(key, JSON.stringify(next)); setStorageError(false); } catch { setStorageError(true); } };
  return [value, update, storageError] as const;
}
