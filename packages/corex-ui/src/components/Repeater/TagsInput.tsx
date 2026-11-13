import { useEffect, useRef, useState, type ReactElement, type RefObject } from "react";
import { Badge } from "../Badge";
import { Box } from "../Box";
import { Combobox, useCombobox } from "../Combobox";
import { InlineStack } from "../InlineStack";
import { Spinner } from "../Spinner";
import { Tag } from "../Tag";
import type { RepeaterTagsInputPropsType } from "./Repeater.types";

const STYLE_ID = "cx-repeater-tags-styles";

// The chips are Corex Tag and Badge. This keeps the wrapping flow, its padding
// in the value strip, and a borderless inline input: Combobox.Input cannot sit
// inline without its own border and chevron.
const TAGS_CSS = `
.cx-repeater-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--p-space-150, 6px);
  padding: var(--p-space-400, 16px);
  min-block-size: 44px;
  box-sizing: border-box;
  cursor: text;
}
.cx-repeater-tags[data-disabled="true"] { cursor: default; }
.cx-repeater-tags__input {
  flex: 1 1 72px;
  min-inline-size: 72px;
  margin: 0;
  padding: 2px 0;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--p-color-text, #303030);
  font: inherit;
  font-size: var(--p-font-size-300, 13px);
  line-height: 20px;
}
.cx-repeater-tags__input::placeholder {
  color: var(--p-color-text-secondary, #616161);
}
`;

function ensureStyles(node: HTMLElement | null): void {
  const doc = node?.ownerDocument;
  if (!doc) return;
  const existing = doc.getElementById(STYLE_ID);
  if (existing) {
    if (existing.textContent !== TAGS_CSS) existing.textContent = TAGS_CSS;
    return;
  }
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = TAGS_CSS;
  doc.head.appendChild(style);
}

export type TagsKeyActionType = "commit" | "remove-last" | "ignore";

/** What a key does in the input: add the typed value, drop the last chip, or nothing. */
export function tagsKeyAction(
  key: string,
  draft: string,
  hasValues: boolean,
  commitKeys: readonly string[] = ["Enter", ","],
): TagsKeyActionType {
  if (commitKeys.includes(key)) return "commit";
  if (key === "Backspace" && draft === "" && hasValues) return "remove-last";
  return "ignore";
}

/**
 * The values `draft` adds to `values`: split on commas when a comma commits,
 * trimmed, without blanks or anything already chosen.
 */
export function valuesToAdd(
  draft: string,
  values: readonly string[],
  splitOnComma: boolean,
): string[] {
  const parts = splitOnComma ? draft.split(",") : [draft];
  const added: string[] = [];
  for (const part of parts) {
    const next = part.trim();
    if (!next || values.includes(next) || added.includes(next)) continue;
    added.push(next);
  }
  return added;
}

function Chips({
  values,
  join,
  placeholder,
  removeLabel,
  inputRef,
  commitKeys,
  disabled,
  onRemove,
  onCommit,
  onRemoveLast,
}: {
  values: readonly string[];
  join: string;
  placeholder: string;
  removeLabel: (value: string) => string;
  inputRef: RefObject<HTMLInputElement | null>;
  commitKeys: readonly string[];
  disabled: boolean;
  onRemove: (value: string) => void;
  onCommit: (draft: string) => void;
  onRemoveLast: () => void;
}): ReactElement {
  const { anchorRef, ...combo } = useCombobox<string>();
  const flowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => ensureStyles(flowRef.current), []);

  return (
    <div
      className="cx-repeater-tags"
      data-disabled={disabled ? "true" : undefined}
      ref={(node) => {
        flowRef.current = node;
        (anchorRef as { current: unknown }).current = node;
      }}
      onMouseDown={(event) => {
        // A press on the strip's padding puts the caret in the input.
        const target = event.target as HTMLElement;
        if (target.closest("button, input, s-chip, s-badge")) return;
        event.preventDefault();
        if (!disabled) inputRef.current?.focus();
      }}
    >
      {values.flatMap((value, index) => {
        const chip = (
          <Tag
            key={value}
            color="base"
            accessibilityLabel={removeLabel(value)}
            disabled={disabled}
            onRemove={disabled ? undefined : () => onRemove(value)}
          >
            {value}
          </Tag>
        );
        if (index === 0) return [chip];
        return [
          <Badge key={`${value}-join`} tone="neutral">
            {join}
          </Badge>,
          chip,
        ];
      })}
      <input
        ref={inputRef as RefObject<HTMLInputElement>}
        className="cx-repeater-tags__input"
        value={combo.inputValue}
        placeholder={values.length > 0 ? "" : placeholder}
        aria-label={placeholder}
        role="combobox"
        // Combobox.List is `${comboboxId}-listbox`.
        aria-controls={`${combo.comboboxId}-listbox`}
        aria-autocomplete="list"
        aria-expanded={combo.open}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        disabled={disabled}
        onFocus={() => combo.setOpen(true)}
        onChange={(event) => {
          combo.setInputValue(event.target.value);
          combo.setOpen(true);
        }}
        onKeyDown={(event) => {
          const items = combo.filteredItems;
          const count = items.length;
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            combo.setOpen(true);
            if (count === 0) return;
            combo.setHighlightedIndex((prev) =>
              event.key === "ArrowDown"
                ? prev < 0
                  ? 0
                  : (prev + 1) % count
                : prev <= 0
                  ? count - 1
                  : prev - 1,
            );
            return;
          }
          if (event.key === "Escape" && combo.open) {
            event.preventDefault();
            combo.setOpen(false);
            return;
          }
          // Enter on a highlighted suggestion picks it, as the list does.
          if (event.key === "Enter" && combo.highlightedIndex >= 0 && count > 0) {
            const item = items[combo.highlightedIndex];
            if (item !== undefined) {
              event.preventDefault();
              combo.setInputValue("");
              onCommit(String(item));
              return;
            }
          }
          const action = tagsKeyAction(
            event.key,
            combo.inputValue,
            values.length > 0,
            commitKeys,
          );
          if (action === "ignore") return;
          event.preventDefault();
          if (action === "commit") {
            const draft = combo.inputValue;
            combo.setInputValue("");
            onCommit(draft);
            return;
          }
          onRemoveLast();
        }}
        onPaste={(event) => {
          // Pasting "red, blue" adds both when a comma commits.
          if (!commitKeys.includes(",")) return;
          const text = event.clipboardData.getData("text");
          if (!text.includes(",")) return;
          event.preventDefault();
          combo.setInputValue("");
          onCommit(`${combo.inputValue}${text}`);
        }}
      />
    </div>
  );
}

/**
 * A row's multi-value field: chosen values are Corex tags with the match
 * mode (AND / OR) as a neutral badge between them, and the text input on the
 * same line. Focusing it opens the suggestions and leaves them open so
 * several can be picked. Enter or a comma adds what was typed; Backspace in
 * an empty input removes the last chip.
 */
export function TagsInput({
  values,
  onChange,
  mode = "any",
  joinLabels = { all: "AND", any: "OR" },
  placeholder = "Add a value",
  suggestions,
  loadSuggestions,
  suggestionsKey,
  commitKeys = ["Enter", ","],
  removeAccessibilityLabel = (value) => `Remove ${value}`,
  disabled = false,
}: RepeaterTagsInputPropsType): ReactElement {
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState<readonly string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const requestId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const loadRef = useRef(loadSuggestions);
  loadRef.current = loadSuggestions;

  // A new kind of value (tags to vendors) starts its suggestions over.
  useEffect(() => {
    requestId.current += 1;
    setLoaded(null);
    setLoading(false);
  }, [suggestionsKey]);

  const ensureSuggestions = () => {
    const load = loadRef.current;
    if (!load || loaded !== null || loading) return;
    const request = requestId.current + 1;
    requestId.current = request;
    setLoading(true);
    load()
      .then((next) => {
        if (requestId.current === request) setLoaded(next);
      })
      .catch(() => {
        // Typing a value still works when the list cannot load.
        if (requestId.current === request) setLoaded([]);
      })
      .finally(() => {
        if (requestId.current === request) setLoading(false);
      });
  };

  const focusInput = () => {
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const add = (text: string) => {
    const added = valuesToAdd(text, values, commitKeys.includes(","));
    setDraft("");
    if (added.length === 0) return;
    onChange([...values, ...added]);
    focusInput();
  };

  // Chosen values leave the list even before anything is typed (Combobox
  // skips `filter` for an empty query).
  const items = [...(suggestions ?? []), ...(loaded ?? [])].filter(
    (item, index, all) => all.indexOf(item) === index && !values.includes(item),
  );

  return (
    <Combobox
      multiple
      open={open && !disabled}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) ensureSuggestions();
      }}
      items={items}
      itemToStringValue={(item: string) => item}
      value={[]}
      inputValue={draft}
      onInputValueChange={setDraft}
      onValueChange={(next: string[]) => {
        const picked = Array.isArray(next) ? next.map(String) : [];
        const added = picked.filter((item) => item && !values.includes(item));
        if (added.length === 0) return;
        setDraft("");
        onChange([...values, ...added]);
        focusInput();
      }}
      filter={(item: string, query: string) => {
        if (values.includes(item)) return false;
        const needle = query.trim().toLowerCase();
        return !needle || item.toLowerCase().includes(needle);
      }}
      disabled={disabled}
    >
      <Chips
        values={values}
        join={mode === "all" ? joinLabels.all : joinLabels.any}
        placeholder={placeholder}
        removeLabel={removeAccessibilityLabel}
        inputRef={inputRef}
        commitKeys={commitKeys}
        disabled={disabled}
        onRemove={(value) => {
          onChange(values.filter((item) => item !== value));
          focusInput();
        }}
        onCommit={add}
        onRemoveLast={() => {
          onChange(values.slice(0, -1));
          focusInput();
        }}
      />
      <Combobox.Content>
        {loading ? (
          <Box padding="none">
            <InlineStack align="center" blockAlign="center">
              <Spinner size="small" accessibilityLabel={placeholder} />
            </InlineStack>
          </Box>
        ) : (
          <Combobox.List aria-label={placeholder}>
            {(item: string) => (
              <Combobox.Item key={item} value={item}>
                {item}
              </Combobox.Item>
            )}
          </Combobox.List>
        )}
      </Combobox.Content>
    </Combobox>
  );
}
TagsInput.displayName = "Repeater.TagsInput";
