import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { DescriptionList } from "./DescriptionList";

describe("DescriptionList", () => {
  it("renders each pair as sibling dt/dd under the dl", () => {
    const { container } = render(
      <DescriptionList
        items={[
          { term: "Status", description: "Open" },
          { term: "Owner", description: "Ada" },
        ]}
      />,
    );

    const list = container.querySelector("dl")!;
    expect(list.querySelectorAll(":scope > dt")).toHaveLength(2);
    expect(list.querySelectorAll(":scope > dd")).toHaveLength(2);
  });

  it("tightens the rows on request", () => {
    const { container } = render(
      <DescriptionList gap="tight" items={[{ term: "A", description: "B" }]} />,
    );

    expect(container.querySelector("dl")!.style.rowGap).toContain("--p-space-200");
  });
});
