import { useEffect, useState } from "react";

/** Current time, refreshed every `intervalMs` (default each minute) while `enabled`. */
export function useNow(enabled: boolean, intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!enabled) return undefined;
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [enabled, intervalMs]);
  return now;
}
