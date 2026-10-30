import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryContainer } from "./QueryContainer";

function containerOf(text: string): HTMLElement & { containerName?: string } {
  return screen.getByText(text).parentElement as HTMLElement & { containerName?: string };
}

describe("QueryContainer", () => {
  it("renders an s-query-container with an inline-size container", () => {
    render(
      <QueryContainer>
        <span>Inner</span>
      </QueryContainer>,
    );

    const el = containerOf("Inner");
    expect(el.tagName.toLowerCase()).toBe("s-query-container");
    expect(el.style.display).toBe("block");
    expect(el.style.width).toBe("100%");
    expect(el.style.containerType).toBe("inline-size");
  });

  it("sets containerName as an attribute and a live property", () => {
    render(
      <QueryContainer containerName="cardContainer">
        <span>Named</span>
      </QueryContainer>,
    );

    const el = containerOf("Named");
    expect(el).toHaveAttribute("containername", "cardContainer");
    expect(el.containerName).toBe("cardContainer");
  });

  it("lets a style override the width and keeps the container type", () => {
    render(
      <QueryContainer style={{ width: "20rem" }}>
        <span>Sized</span>
      </QueryContainer>,
    );

    const el = containerOf("Sized");
    expect(el.style.width).toBe("20rem");
    expect(el.style.display).toBe("block");
    expect(el.style.containerType).toBe("inline-size");
  });

  it("forwards id, className, and slot", () => {
    render(
      <QueryContainer id="region" className="card" slot="aside">
        <span>Slotted</span>
      </QueryContainer>,
    );

    const el = containerOf("Slotted");
    expect(el).toHaveAttribute("id", "region");
    expect(el).toHaveAttribute("class", "card");
    expect(el).toHaveAttribute("slot", "aside");
  });

  it("forwards a ref to the container element", () => {
    const ref = createRef<HTMLElement>();
    render(
      <QueryContainer ref={ref}>
        <span>Ref</span>
      </QueryContainer>,
    );

    expect(ref.current).toBe(containerOf("Ref"));
  });
});
