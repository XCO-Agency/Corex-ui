import { describe, expect, it } from "vitest";
import { childrenText } from "./childrenText";

describe("childrenText", () => {
  it("returns a string child as-is", () => {
    expect(childrenText("Save")).toBe("Save");
  });

  it("collects text out of mixed array children", () => {
    expect(childrenText([<span key="icon" />, " Resume"])).toBe("Resume");
  });

  it("walks nested elements", () => {
    expect(
      childrenText(
        <span>
          <strong>Save</strong> changes
        </span>,
      ),
    ).toBe("Save changes");
  });

  it("includes numbers and ignores booleans, null and undefined", () => {
    expect(childrenText([null, undefined, false, "Page ", 2])).toBe("Page 2");
  });

  it("returns an empty string when there is no text", () => {
    expect(childrenText(<span />)).toBe("");
    expect(childrenText(null)).toBe("");
  });
});
