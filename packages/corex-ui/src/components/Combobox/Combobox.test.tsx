import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Combobox } from "./Combobox";

describe("Combobox", () => {
  it("exposes compound subcomponents on the Combobox object", () => {
    expect(Combobox.Input).toBeTypeOf("object");
    expect(Combobox.Content).toBeTypeOf("object");
    expect(Combobox.List).toBeTypeOf("object");
    expect(Combobox.Item).toBeTypeOf("object");
    expect(Combobox.Empty).toBeTypeOf("object");
  });

  // Modern compound / Base UI / shadcn style tests
  it("renders simple combobox with items and function child in Combobox.List", () => {
    const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"];

    render(
      <Combobox items={frameworks} open>
        <Combobox.Input placeholder="Select a framework" />
        <Combobox.Content>
          <Combobox.Empty>No items found.</Combobox.Empty>
          <Combobox.List>
            {(item) => (
              <Combobox.Item key={item} value={item}>
                {item}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>,
    );

    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("SvelteKit")).toBeInTheDocument();
    expect(screen.getByText("Nuxt.js")).toBeInTheDocument();
    expect(screen.getByText("Remix")).toBeInTheDocument();
    expect(screen.getByText("Astro")).toBeInTheDocument();
  });

  it("filters suggestions based on inputValue", () => {
    const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"];

    render(
      <Combobox items={frameworks} inputValue="sve" open>
        <Combobox.Input placeholder="Select a framework" />
        <Combobox.Content>
          <Combobox.Empty>No items found.</Combobox.Empty>
          <Combobox.List>
            {(item) => (
              <Combobox.Item key={item} value={item}>
                {item}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>,
    );

    expect(screen.getByText("SvelteKit")).toBeInTheDocument();
    expect(screen.queryByText("Next.js")).toBeNull();
    expect(screen.queryByText("Remix")).toBeNull();
  });

  it("renders empty state when query does not match any item", () => {
    const frameworks = ["Next.js", "SvelteKit"];

    render(
      <Combobox items={frameworks} inputValue="NonExistentFramework" open>
        <Combobox.Input placeholder="Select a framework" />
        <Combobox.Content>
          <Combobox.Empty>No items found.</Combobox.Empty>
          <Combobox.List>
            {(item) => (
              <Combobox.Item key={item} value={item}>
                {item}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>,
    );

    expect(screen.getByText("No items found.")).toBeInTheDocument();
    expect(screen.queryByText("Next.js")).toBeNull();
  });

  it("handles item selection in single select mode", () => {
    const onValueChange = vi.fn();
    const frameworks = ["Next.js", "SvelteKit"];

    render(
      <Combobox items={frameworks} onValueChange={onValueChange} open>
        <Combobox.Input placeholder="Select a framework" />
        <Combobox.Content>
          <Combobox.Empty>No items found.</Combobox.Empty>
          <Combobox.List>
            {(item) => (
              <Combobox.Item key={item} value={item}>
                {item}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>,
    );

    fireEvent.click(screen.getByText("SvelteKit"));
    expect(onValueChange).toHaveBeenCalledWith("SvelteKit");
  });

  it("supports custom object items with itemToStringValue", () => {
    type FrameworkType = { label: string; value: string };
    const frameworks: FrameworkType[] = [
      { label: "Next.js", value: "next" },
      { label: "SvelteKit", value: "sveltekit" },
    ];
    const onValueChange = vi.fn();

    render(
      <Combobox
        items={frameworks}
        itemToStringValue={(f) => f.label}
        onValueChange={onValueChange}
        open
      >
        <Combobox.Input placeholder="Select a framework" />
        <Combobox.Content>
          <Combobox.Empty>No items found.</Combobox.Empty>
          <Combobox.List>
            {(framework) => (
              <Combobox.Item key={framework.value} value={framework}>
                {framework.label}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>,
    );

    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("SvelteKit")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Next.js"));
    expect(onValueChange).toHaveBeenCalledWith(frameworks[0]);
  });

  it("supports multiple selection with built-in Tags and removal", () => {
    const frameworks = ["Next.js", "SvelteKit", "Nuxt.js"];
    const onValueChange = vi.fn();

    render(
      <Combobox
        items={frameworks}
        multiple
        value={["Next.js", "Nuxt.js"]}
        onValueChange={onValueChange}
        open
      >
        <Combobox.Input placeholder="Add framework" />
        <Combobox.Content>
          <Combobox.Empty>No items found.</Combobox.Empty>
          <Combobox.List>
            {(item) => (
              <Combobox.Item key={item} value={item}>
                {item}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>,
    );

    // Verify chips in-flow rendered by Tag
    const chips = document.querySelectorAll("s-chip");
    expect(chips.length).toBe(2);

    // Click an option to add it
    fireEvent.click(screen.getByText("SvelteKit"));
    expect(onValueChange).toHaveBeenCalledWith(["Next.js", "Nuxt.js", "SvelteKit"]);
  });

  it("replaces chevron-down with clear button when showClear is true and value exists", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Combobox items={["Alpha", "Beta"]} value="Alpha" onValueChange={onValueChange}>
        <Combobox.Input showClear placeholder="Select item" />
        <Combobox.Content>
          <Combobox.List>
            {(item) => (
              <Combobox.Item key={item} value={item}>
                {item}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>,
    );

    // Clear button replaces chevron when value exists and showClear is true
    const clearBtn = document.querySelector(
      '[accessibilitylabel="Clear selection"], [accessibility-label="Clear selection"]',
    );
    expect(clearBtn).toBeInTheDocument();
    expect(
      document.querySelector(
        '[accessibilitylabel="Open suggestions"], [accessibility-label="Open suggestions"]',
      ),
    ).toBeNull();

    // Clicking clear resets value
    fireEvent.click(clearBtn!);
    expect(onValueChange).toHaveBeenCalledWith(undefined);

    // When value is empty, chevron button is shown instead
    rerender(
      <Combobox items={["Alpha", "Beta"]} value={undefined} onValueChange={onValueChange}>
        <Combobox.Input showClear placeholder="Select item" />
      </Combobox>,
    );
    expect(
      document.querySelector(
        '[accessibilitylabel="Clear selection"], [accessibility-label="Clear selection"]',
      ),
    ).toBeNull();
    expect(
      document.querySelector(
        '[accessibilitylabel="Open suggestions"], [accessibility-label="Open suggestions"], [accessibilitylabel="Close suggestions"], [accessibility-label="Close suggestions"]',
      ),
    ).toBeInTheDocument();
  });

  it("removes only one tag per Backspace keypress", () => {
    const onValueChange = vi.fn();
    render(
      <Combobox
        items={["Alpha", "Beta", "Gamma"]}
        multiple
        value={["Alpha", "Beta", "Gamma"]}
        onValueChange={onValueChange}
      >
        <Combobox.Input placeholder="Select item" />
        <Combobox.Content>
          <Combobox.List>
            {(item) => (
              <Combobox.Item key={item} value={item}>
                {item}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>,
    );

    const input = document.querySelector("input")!;
    fireEvent.keyDown(input, { key: "Backspace" });

    // Should only remove the last tag ("Gamma") and call onValueChange exactly once
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(["Alpha", "Beta"]);
  });

  it("does not select any item by default when value is undefined and supports hover highlight", () => {
    const categories = [
      { label: "Frontend", value: "frontend" },
      { label: "Backend", value: "backend" },
    ];
    render(
      <Combobox
        items={categories}
        itemToStringValue={(cat) => cat.label}
        open
      >
        <Combobox.Input placeholder="Choose category..." />
        <Combobox.Content>
          <Combobox.List>
            {(cat) => (
              <Combobox.Item key={cat.value} value={cat}>
                {cat.label}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>,
    );

    // No option should have aria-selected="true"
    const options = document.querySelectorAll('[role="option"]');
    expect(options.length).toBe(2);
    expect(options[0]?.getAttribute("aria-selected")).toBe("false");
    expect(options[1]?.getAttribute("aria-selected")).toBe("false");

    // No option should have subdued background initially (no item highlighted)
    expect((options[0] as any).background).toBeUndefined();
    expect((options[1] as any).background).toBeUndefined();

    // Hover over the second item
    fireEvent.mouseEnter(options[1]!.closest("s-box")!);
    expect((options[1] as any).background).toBe("subdued");
  });

  it("implements WAI-ARIA 1.2 and autocomplete best practices on input and list", () => {
    const frameworks = ["Next.js", "Remix"];
    render(
      <Combobox items={frameworks} id="test-combobox" open>
        <Combobox.Input placeholder="Search..." />
        <Combobox.Content>
          <Combobox.List>
            {(item) => (
              <Combobox.Item key={item} value={item}>
                {item}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Content>
      </Combobox>,
    );

    const input = document.querySelector("input")!;
    expect(input.getAttribute("role")).toBe("combobox");
    expect(input.getAttribute("aria-autocomplete")).toBe("list");
    expect(input.getAttribute("aria-expanded")).toBe("true");
    expect(input.getAttribute("aria-haspopup")).toBe("listbox");
    expect(input.getAttribute("aria-controls")).toBe("test-combobox-listbox");
    expect(input.getAttribute("autocomplete")).toBe("off");
    expect(input.getAttribute("autocorrect")).toBe("off");
    expect(input.getAttribute("autocapitalize")).toBe("none");
    expect(input.getAttribute("spellcheck")).toBe("false");

    const listbox = document.querySelector('[role="listbox"]')!;
    expect(listbox).toBeInTheDocument();
    expect(listbox.id).toBe("test-combobox-listbox");

    const options = document.querySelectorAll('[role="option"]');
    expect(options[0]?.id).toBe("test-combobox-item-0");
    expect(options[1]?.id).toBe("test-combobox-item-1");

    // Hover second option -> aria-activedescendant matches
    fireEvent.mouseEnter(options[1]!.closest("s-box")!);
    expect(input.getAttribute("aria-activedescendant")).toBe("test-combobox-item-1");
  });
});
