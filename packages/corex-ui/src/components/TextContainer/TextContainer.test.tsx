import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TextContainer } from "./TextContainer";

describe("TextContainer", () => {
  it("uses the loose rhythm by default", () => {
    render(
      <TextContainer>
        <span>Prose</span>
      </TextContainer>,
    );

    expect(screen.getByText("Prose").parentElement!.style.gap).toContain("--p-space-400");
  });

  it("tightens the rhythm on request", () => {
    render(
      <TextContainer spacing="tight">
        <span>Prose</span>
      </TextContainer>,
    );

    expect(screen.getByText("Prose").parentElement!.style.gap).toContain("--p-space-200");
  });
});
