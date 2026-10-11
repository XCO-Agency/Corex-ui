import { useHydrated } from "../../core/useHydrated";
import { toISODateString } from "./datePickerUtils";

/**
 * Today's date as an ISO string (`"2026-10-11"`), safe to render on the server.
 *
 * With a `referenceDate`, that date is used everywhere, so the server and the
 * browser render the same thing. Without one, the result is `null` on the
 * server and during hydration — the server's "today" can't be known in the
 * browser, which may be in another timezone or past midnight — and the
 * browser's own today right after. A client-only render gets today directly.
 */
export function useDatePickerToday(referenceDate?: string | Date): string | null {
  const hydrated = useHydrated();
  if (referenceDate instanceof Date) return toISODateString(referenceDate);
  if (referenceDate) return referenceDate.slice(0, 10);
  return hydrated ? toISODateString(new Date()) : null;
}
