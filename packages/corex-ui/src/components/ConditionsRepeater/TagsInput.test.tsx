import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { ConditionsRepeater } from "./ConditionsRepeater";
import type { ConditionsMatchModeType } from "./ConditionsRepeater.types";
import { tagsKeyAction, valuesToAdd } from "./TagsInput";

function Harness({
  initial = [],
  mode = "any",
  onChange,
  ...rest
}: {
  initial?: string[];
  mode?: ConditionsMatchModeType;
  onChange?: (values: string[]) => void;
  suggestions?: string[];
  loadSuggestions?: () => Promise<readonly string[]>;
  commitKeys?: string[];
  disabled?: boolean;
}) {
  const [values, setValues] = useState(initial);
  return (
    <ConditionsRepeater.TagsInput
      values={values}
      mode={mode}
      onChange={(next) => {
        setValues(next);
        onChange?.(next);
      }}
      {...rest}
    />
  );
}

const input = () =>
  screen.getByRole("combobox", { name: "Add a value" }) as HTMLInputElement;
const chips = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("s-chip")).map((chip) => chip.textContent);
const joins = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("s-badge")).map((badge) => badge.textContent);

function type(text: string) {
  fireEvent.change(input(), { target: { value: text } });
}

describe("ConditionsRepeater.TagsInput", () => {
  it("renders the values as base tags with the mode between them", () => {
    const { container } = render(
      <Harness initial={["red", "blue", "green"]} mode="all" />,
    );

    expect(chips(container)).toEqual(["red", "blue", "green"]);
    expect(container.querySelector("s-chip")).toHaveAttribute("color", "base");
    expect(joins(container)).toEqual(["AND", "AND"]);
    expect(container.querySelector("s-badge")).toHaveAttribute("tone", "neutral");
  });

  it("shows OR for any, and custom join labels", () => {
    const { container, rerender } = render(<Harness initial={["a", "b"]} />);
    expect(joins(container)).toEqual(["OR"]);

    rerender(
      <ConditionsRepeater.TagsInput
        values={["a", "b"]}
        onChange={() => {}}
        mode="all"
        joinLabels={{ all: "ET", any: "OU" }}
      />,
    );
    expect(joins(container)).toEqual(["ET"]);
  });

  it("adds a trimmed value on Enter and on a comma, and clears the input", () => {
    const onChange = vi.fn();
    const { container } = render(<Harness onChange={onChange} />);

    type("  summer ");
    fireEvent.keyDown(input(), { key: "Enter" });
    expect(chips(container)).toEqual(["summer"]);
    expect(input().value).toBe("");

    type("sale");
    fireEvent.keyDown(input(), { key: "," });
    expect(chips(container)).toEqual(["summer", "sale"]);
    expect(onChange).toHaveBeenLastCalledWith(["summer", "sale"]);
  });

  it("ignores blanks and values already chosen", () => {
    const onChange = vi.fn();
    render(<Harness initial={["red"]} onChange={onChange} />);

    type("red");
    fireEvent.keyDown(input(), { key: "Enter" });
    type("   ");
    fireEvent.keyDown(input(), { key: "Enter" });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("removes the last chip on Backspace in an empty input only", () => {
    const { container } = render(<Harness initial={["a", "b"]} />);

    type("x");
    fireEvent.keyDown(input(), { key: "Backspace" });
    expect(chips(container)).toEqual(["a", "b"]);

    type("");
    fireEvent.keyDown(input(), { key: "Backspace" });
    expect(chips(container)).toEqual(["a"]);
  });

  it("removes a chip from its own remove control, with a label", () => {
    const { container } = render(<Harness initial={["a", "b"]} />);
    const chip = container.querySelectorAll("s-chip")[0]!;

    expect(chip).toHaveAttribute("accessibilityLabel".toLowerCase(), "Remove a");
    act(() => {
      chip.dispatchEvent(new Event("remove", { bubbles: true }));
    });

    expect(chips(container)).toEqual(["b"]);
    expect(joins(container)).toEqual([]);
  });

  it("only shows the placeholder while there are no values", () => {
    const { rerender } = render(
      <ConditionsRepeater.TagsInput values={[]} onChange={() => {}} />,
    );
    expect(input()).toHaveAttribute("placeholder", "Add a value");

    rerender(<ConditionsRepeater.TagsInput values={["a"]} onChange={() => {}} />);
    expect(input()).toHaveAttribute("placeholder", "");
  });

  it("splits a pasted list on commas", () => {
    const { container } = render(<Harness initial={["red"]} />);

    fireEvent.paste(input(), { clipboardData: { getData: () => "blue, red,green" } });

    expect(chips(container)).toEqual(["red", "blue", "green"]);
  });

  it("offers suggestions that are not chosen yet, and adds one on click", () => {
    const { container } = render(
      <Harness initial={["red"]} suggestions={["red", "blue", "black"]} />,
    );

    fireEvent.focus(input());
    expect(screen.queryByRole("option", { name: "red" })).toBeNull();
    type("bl");
    fireEvent.click(screen.getByRole("option", { name: "blue" }));

    expect(chips(container)).toEqual(["red", "blue"]);
  });

  it("loads suggestions once, the first time it opens", async () => {
    const load = vi.fn(() => Promise.resolve(["vendor-a", "vendor-b"]));
    render(<Harness loadSuggestions={load} />);

    await act(async () => {
      fireEvent.focus(input());
    });
    expect(await screen.findByRole("option", { name: "vendor-a" })).toBeInTheDocument();

    fireEvent.keyDown(input(), { key: "Escape" });
    await act(async () => {
      fireEvent.focus(input());
    });
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("is fixed when disabled", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Harness initial={["a"]} onChange={onChange} disabled />,
    );

    expect(input()).toBeDisabled();
    expect(container.querySelector("s-chip")).not.toHaveAttribute("removable");
  });
});

describe("ConditionsRepeater.MatchMode", () => {
  function ModeHarness(props: {
    locked?: boolean;
    onChange?: (v: ConditionsMatchModeType) => void;
  }) {
    const [mode, setMode] = useState<ConditionsMatchModeType>("all");
    return (
      <ConditionsRepeater.MatchMode
        value={mode}
        onChange={(next) => {
          setMode(next);
          props.onChange?.(next);
        }}
        help={(current) =>
          current === "all" ? "Every tag must match." : "Any tag matches."
        }
        locked={props.locked}
      />
    );
  }

  const pill = (container: HTMLElement) => container.querySelector("s-clickable")!;

  it("labels the pill with the mode and its help", () => {
    const { container } = render(<ModeHarness />);

    expect(pill(container)).toHaveTextContent("All");
    expect(pill(container)).toHaveAttribute(
      "accessibilitylabel",
      "Every tag must match.",
    );
  });

  it("opens a menu with the help and both modes, and switches", () => {
    const onChange = vi.fn();
    const { container } = render(<ModeHarness onChange={onChange} />);

    fireEvent.click(pill(container));
    expect(screen.getByText("Every tag must match.")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Any"));

    expect(onChange).toHaveBeenCalledWith("any");
    expect(pill(container)).toHaveTextContent("Any");
  });

  it("is disabled when locked, with the help on hover", () => {
    const onChange = vi.fn();
    const { container } = render(<ModeHarness locked onChange={onChange} />);

    fireEvent.click(pill(container));
    expect(onChange).not.toHaveBeenCalled();
    expect(pill(container)).toHaveAttribute("disabled");
    expect(container.querySelector("s-tooltip, [role='tooltip']")).toBeTruthy();
  });
});

describe("tags helpers", () => {
  it("map keys to actions", () => {
    expect(tagsKeyAction("Enter", "x", false)).toBe("commit");
    expect(tagsKeyAction(",", "x", false)).toBe("commit");
    expect(tagsKeyAction(",", "x", false, ["Enter"])).toBe("ignore");
    expect(tagsKeyAction("Backspace", "", true)).toBe("remove-last");
    expect(tagsKeyAction("Backspace", "", false)).toBe("ignore");
    expect(tagsKeyAction("Backspace", "a", true)).toBe("ignore");
  });

  it("clean the values to add", () => {
    expect(valuesToAdd(" a, b ,a,, c", ["c"], true)).toEqual(["a", "b"]);
    expect(valuesToAdd("a, b", [], false)).toEqual(["a, b"]);
  });
});
