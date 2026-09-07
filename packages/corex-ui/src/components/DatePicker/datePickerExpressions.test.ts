import { describe, expect, it } from "vitest";
import {
  resolveDateExpression,
  resolveSemanticRange,
  resolveComparisonRange,
  resolvePresetRangeById,
  resolveDateFilterValue,
  resolveDateFilterComparison,
  getPresetDefinitions,
  findPresetDefinitionById,
} from "./datePickerExpressions";
import { getDefaultPresets } from "./datePickerUtils";

// Monday, September 7, 2026 — matches this repo's sandbox "today".
const REF = new Date(2026, 8, 7);

describe("resolveDateExpression", () => {
  it("resolves today and yesterday", () => {
    expect(resolveDateExpression("today", REF)).toBe("2026-09-07");
    expect(resolveDateExpression("yesterday", REF)).toBe("2026-09-06");
  });

  it("resolves startOf/endOf with day offsets", () => {
    expect(resolveDateExpression("startOfDay(-6d)", REF)).toBe("2026-09-01");
    expect(resolveDateExpression("startOfDay(-29d)", REF)).toBe("2026-08-09");
  });

  it("resolves week boundaries (Monday-start) with a week offset", () => {
    expect(resolveDateExpression("startOfWeek(-1w)", REF)).toBe("2026-08-31");
    expect(resolveDateExpression("endOfWeek(-1w)", REF)).toBe("2026-09-06");
    expect(resolveDateExpression("startOfWeek", REF)).toBe("2026-09-07");
  });

  it("resolves month boundaries with clamped month offsets", () => {
    expect(resolveDateExpression("startOfMonth(-1m)", REF)).toBe("2026-08-01");
    expect(resolveDateExpression("endOfMonth(-1m)", REF)).toBe("2026-08-31");
    // Mar 31 - 1 month must clamp to Feb 28 (2026 is not a leap year), not overflow into March.
    expect(resolveDateExpression("startOfMonth(-1m)", new Date(2026, 2, 31))).toBe("2026-02-01");
  });

  it("resolves quarter boundaries", () => {
    expect(resolveDateExpression("startOfQuarter(-1q)", REF)).toBe("2026-04-01");
    expect(resolveDateExpression("endOfQuarter(-1q)", REF)).toBe("2026-06-30");
  });

  it("resolves year boundaries", () => {
    expect(resolveDateExpression("startOfYear(-1y)", REF)).toBe("2025-01-01");
    expect(resolveDateExpression("endOfYear(-1y)", REF)).toBe("2025-12-31");
  });

  it("resolves fixed month/day expressions anchored to the reference year", () => {
    expect(resolveDateExpression("date(11-27)", REF)).toBe("2026-11-27");
  });

  it("throws on an unsupported expression", () => {
    expect(() => resolveDateExpression("nextMonth", REF)).toThrow();
  });
});

describe("resolveSemanticRange / resolveComparisonRange", () => {
  it("resolves a since/until pair", () => {
    expect(resolveSemanticRange({ since: "startOfDay(-6d)", until: "today" }, REF)).toEqual({
      start: "2026-09-01",
      end: "2026-09-07",
    });
  });

  it("computes previous_period as the immediately preceding equal-length window", () => {
    const current = { start: "2026-09-01", end: "2026-09-07" }; // 7 days
    expect(resolveComparisonRange(current, "previous_period")).toEqual({
      start: "2026-08-25",
      end: "2026-08-31",
    });
  });

  it("computes previous_year as the same range shifted back a year", () => {
    const current = { start: "2026-09-01", end: "2026-09-07" };
    expect(resolveComparisonRange(current, "previous_year")).toEqual({
      start: "2025-09-01",
      end: "2025-09-07",
    });
  });
});

describe("preset definition tree", () => {
  it("resolves 'last_7_days' by id", () => {
    expect(resolvePresetRangeById("last_7_days", REF)).toEqual({
      start: "2026-09-01",
      end: "2026-09-07",
    });
  });

  it("finds nested preset definitions by id", () => {
    expect(findPresetDefinitionById("month_to_date")?.label).toBe("Month to date");
  });

  it("'custom' carries no semantic range", () => {
    expect(findPresetDefinitionById("custom")?.range).toBeUndefined();
  });

  it("getDefaultPresets stays a pure function of the reference date (no resolved dates baked in)", () => {
    const a = getDefaultPresets(REF);
    const b = getDefaultPresets(new Date(2020, 0, 1));
    const todayPresetA = a.find((p) => p.id === "today");
    const todayPresetB = b.find((p) => p.id === "today");
    expect(todayPresetA?.range).toEqual({ start: "2026-09-07", end: "2026-09-07" });
    expect(todayPresetB?.range).toEqual({ start: "2020-01-01", end: "2020-01-01" });
  });

  it("every leaf preset (except 'custom') declares a semantic range, not resolved dates", () => {
    const flatten = (defs: ReturnType<typeof getPresetDefinitions>): typeof defs =>
      defs.flatMap((d) => [d, ...(d.children ? flatten(d.children) : [])]);
    for (const def of flatten(getPresetDefinitions())) {
      if (def.children || def.id === "custom") continue;
      expect(def.range).toBeDefined();
      expect(typeof def.range?.since).toBe("string");
      expect(typeof def.range?.until).toBe("string");
    }
  });
});

describe("DateFilterValueType (storage-facing value)", () => {
  it("resolves a preset filter value dynamically from its id", () => {
    const value = { type: "preset" as const, presetId: "last_7_days" };
    expect(resolveDateFilterValue(value, REF)).toEqual({ start: "2026-09-01", end: "2026-09-07" });

    // The same stored value resolves differently a month later — proof it never froze a date.
    const later = new Date(2026, 9, 7);
    expect(resolveDateFilterValue(value, later)).toEqual({ start: "2026-10-01", end: "2026-10-07" });
  });

  it("resolves a custom filter value to its stored absolute range", () => {
    const value = { type: "custom" as const, range: { start: "2026-01-01", end: "2026-01-31" } };
    expect(resolveDateFilterValue(value, REF)).toEqual(value.range);
  });

  it("resolves the comparison range using the preset's own rule", () => {
    const value = { type: "preset" as const, presetId: "last_7_days" };
    expect(resolveDateFilterComparison(value, REF)).toEqual({ start: "2026-08-25", end: "2026-08-31" });
  });

  it("falls back to previous_period for custom ranges", () => {
    const value = { type: "custom" as const, range: { start: "2026-09-01", end: "2026-09-07" } };
    expect(resolveDateFilterComparison(value, REF)).toEqual({ start: "2026-08-25", end: "2026-08-31" });
  });
});
