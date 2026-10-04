import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ForwardedRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { mergeRefs } from "../../core/mergeRefs";
import { useDimension } from "../../hooks/useDimension";
import { Checkbox } from "../Checkbox";
import { Icon } from "../Icon";
import { Pagination } from "../Pagination";
import { Text } from "../Text";
import { Transition } from "../Transition";
import type { TransitionKeyframesType } from "../Transition";
import { IndexTableBulkActions } from "./IndexTableBulkActions";
import {
  HANDLE_COLUMN_WIDTH,
  resolveAlignment,
  resolveLayout,
  type IndexTableAlignmentType,
  type ResolvedLayoutType,
} from "./indexTableColumns";
import {
  buildSelectionNode,
  getSelectionState,
  getToggleChanges,
  hasAnySelected,
  type SelectionNodeType,
} from "./indexTableSelection";
import { DRAG_INDEX_ATTRIBUTE, startRowDrag } from "./indexTableRowDrag";
import { INDEX_TABLE_CSS } from "./indexTableStyles";
import type {
  IndexTableCellPropsType,
  IndexTableHeadingType,
  IndexTablePropsType,
  IndexTableRowPropsType,
  IndexTableSortDirectionType,
  IndexTableStickyType,
} from "./IndexTable.types";
import { Floating } from "../Floating";
import { Card } from "../Card";
import { Box } from "../Box";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Elements whose clicks belong to themselves, not to the row they sit in. */
const INTERACTIVE_SELECTOR =
  "a,button,input,select,textarea,label,[role='button'],[role='link'],s-button,s-link,s-clickable,s-checkbox,s-switch,s-select,s-text-field,s-popover";

function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

function alignmentClass(alignment: IndexTableAlignmentType): string | undefined {
  if (alignment === "end") return "cx-it__cell--end";
  if (alignment === "center") return "cx-it__cell--center";
  return undefined;
}

function pinStyle(
  sticky?: IndexTableStickyType,
  offset = "0px",
): CSSProperties | undefined {
  if (sticky === "left") return { insetInlineStart: offset };
  if (sticky === "right") return { insetInlineEnd: offset };
  return undefined;
}

/**
 * True when the click passed through an element matching `selector` on its way
 * up to the element the handler is on.
 *
 * Checks `matches` rather than `instanceof Element`: the table can render into
 * another document (an iframe preview), whose elements fail `instanceof`
 * against this window's `Element`.
 */
function clickPassedThrough(event: MouseEvent<HTMLElement>, selector: string): boolean {
  for (const node of event.nativeEvent.composedPath()) {
    if (node === event.currentTarget) return false;
    const element = node as Partial<Element>;
    if (typeof element.matches === "function" && element.matches(selector)) return true;
  }
  return false;
}

/* -------------------------------------------------------------------------- */
/* Contexts                                                                   */
/* -------------------------------------------------------------------------- */

type IndexTableContextType = {
  selectable: boolean;
  onSelectionChange?: IndexTablePropsType["onSelectionChange"];
  resourceName?: IndexTablePropsType["resourceName"];
  layout: ResolvedLayoutType;
  showSelectedOnly: boolean;
  zebra: boolean;
  registerSticky: (columnIndex: number, sticky: IndexTableStickyType) => void;
  reorderable: boolean;
  /** Starts a pointer drag of the top-level row at `index`. */
  beginDrag: (index: number, event: ReactPointerEvent<HTMLElement>) => void;
  /** Keyboard reorder: moves the row at `index` by `delta` places. */
  moveBy: (index: number, delta: number) => void;
};

const IndexTableContext = createContext<IndexTableContextType | null>(null);

function useIndexTable(): IndexTableContextType {
  const ctx = useContext(IndexTableContext);
  if (!ctx) {
    throw new Error(
      "IndexTable.Row and IndexTable.Cell must be used inside <IndexTable>",
    );
  }
  return ctx;
}

/** Position of a top-level row among the table's children; -1 for nested rows. */
const RowIndexContext = createContext(-1);
/** Nesting depth: 0 for top-level rows, 1+ for `subRows`. */
const DepthContext = createContext(0);
/** Expand / collapse timing for sub-rows, in ms. */
const SUB_ROWS_DURATION = 220;
const SUB_ROWS_EASING = "cubic-bezier(0.2, 0, 0, 1)";
/** A short fade-and-slide; the height is animated separately (see `useSubRowsHeight`). */
const SUB_ROWS_KEYFRAMES: TransitionKeyframesType = {
  enterFrom: { opacity: 0, transform: "translateY(-6px)" },
  enterTo: { opacity: 1, transform: "translateY(0)" },
};

function prefersReducedMotion(element: HTMLElement): boolean {
  return Boolean(
    element.ownerDocument.defaultView?.matchMedia?.("(prefers-reduced-motion: reduce)")
      .matches,
  );
}

/**
 * Animates the sub-rows wrapper's height when it opens and closes, so the rows
 * below glide instead of jumping. `Transition` handles the fade and slide; it
 * only animates opacity and transform, which leave layout alone.
 */
function useSubRowsHeight(expanded: boolean) {
  const ref = useRef<HTMLElement>(null);
  const isFirstRun = useRef(true);

  useIsomorphicLayoutEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const element = ref.current;
    if (
      !element ||
      typeof element.animate !== "function" ||
      prefersReducedMotion(element)
    ) {
      return;
    }

    const full = element.scrollHeight;
    // `clip`, not `hidden`: it doesn't create a scroll container, so pinned
    // cells inside keep sticking while the height animates.
    element.style.overflow = "clip";
    const animation = element.animate(
      [{ height: `${expanded ? 0 : full}px` }, { height: `${expanded ? full : 0}px` }],
      {
        duration: SUB_ROWS_DURATION,
        easing: SUB_ROWS_EASING,
        // Hold the closed height until the rows unmount at the end of the exit.
        fill: expanded ? "none" : "forwards",
      },
    );
    const reset = () => {
      element.style.overflow = "";
    };
    animation.onfinish = reset;
    return () => {
      animation.cancel();
      reset();
    };
  }, [expanded]);

  return ref;
}

/** Selection trees of the rows above a nested row, nearest first. */
const SelectionAncestorsContext = createContext<SelectionNodeType[]>([]);
/** Index of the data column a cell renders in, set by the row for each child. */
const ColumnIndexContext = createContext(-1);

type RowContextType = {
  depth: number;
  expandable: boolean;
  expanded: boolean;
  toggleExpanded: () => void;
};

const RowContext = createContext<RowContextType>({
  depth: 0,
  expandable: false,
  expanded: false,
  toggleExpanded: () => {},
});

/* -------------------------------------------------------------------------- */
/* IndexTable                                                                 */
/* -------------------------------------------------------------------------- */

function normalizeHeadings(
  headings: IndexTablePropsType["headings"],
  columnContentTypes: IndexTablePropsType["columnContentTypes"],
): IndexTableHeadingType[] {
  if (!headings) return [];
  return headings.map((h, index) => {
    if (typeof h === "object" && h !== null && !isValidElement(h) && "title" in h) {
      return h as IndexTableHeadingType;
    }
    return {
      title: h as ReactNode,
      format: columnContentTypes?.[index] === "numeric" ? "numeric" : "base",
    };
  });
}

function IndexTableInner(
  {
    children,
    headings,
    rows,
    columnContentTypes,
    itemCount,
    selectedItemsCount = 0,
    onSelectionChange,
    selectable = true,
    bulkActions = [],
    promotedBulkActions = [],
    resourceName,
    loading = false,
    emptyState,
    pagination,
    gridTemplateColumns,
    footerContent,
    showAllSelectedToggle = true,
    id,
    className,
    style,
    hasZebraStriping = false,
    increasedTableDensity = false,
    truncate = false,
    verticalAlign,
    sortColumnIndex,
    sortDirection,
    onSort,
    onReorder,
  }: IndexTablePropsType,
  ref: ForwardedRef<HTMLElement>,
): ReactElement {
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [stickyOverrides, setStickyOverrides] = useState<
    Record<number, IndexTableStickyType>
  >({});
  const gridRef = useRef<HTMLDivElement>(null);
  const cancelDragRef = useRef<(() => void) | null>(null);
  const { isXs, isSm, ref: measureRef } = useDimension();
  const rootRef = useMemo(
    () => mergeRefs<HTMLDivElement>(ref as ForwardedRef<HTMLDivElement>, measureRef),
    [ref, measureRef],
  );

  const reorderable = Boolean(onReorder);
  const effectiveItemCount = itemCount ?? rows?.length ?? 0;
  const selectedCount =
    selectedItemsCount === "All" ? effectiveItemCount : (selectedItemsCount ?? 0);
  const allSelected = effectiveItemCount > 0 && selectedCount >= effectiveItemCount;
  const isIndeterminate = selectedCount > 0 && !allSelected;
  const plural = resourceName?.plural ?? "items";
  const isBulkActive = selectable && selectedCount > 0;

  // Leaving bulk mode turns the "show all selected" filter off with it.
  useEffect(() => {
    if (!isBulkActive) setShowSelectedOnly(false);
  }, [isBulkActive]);

  const normalizedHeadings = useMemo(
    () => normalizeHeadings(headings, columnContentTypes),
    [headings, columnContentTypes],
  );

  const layout = useMemo(() => {
    const resolved = resolveLayout({
      headings: normalizedHeadings,
      columnCount: rows?.[0]?.length ?? 0,
      selectable,
      reorderable,
      stickyOverrides,
    });
    return gridTemplateColumns ? { ...resolved, gridTemplateColumns } : resolved;
  }, [
    normalizedHeadings,
    rows,
    selectable,
    reorderable,
    stickyOverrides,
    gridTemplateColumns,
  ]);

  const registerSticky = useCallback(
    (columnIndex: number, sticky: IndexTableStickyType) => {
      setStickyOverrides((current) =>
        current[columnIndex] === sticky ? current : { ...current, [columnIndex]: sticky },
      );
    },
    [],
  );

  // Top-level rows, each told its index so drag-and-drop can report positions.
  const bodyRows = useMemo<ReactNode[]>(() => {
    if (rows && rows.length > 0) {
      return rows.map((row, rowIndex) => (
        <RowIndexContext.Provider key={rowIndex} value={rowIndex}>
          <IndexTableRow id={String(rowIndex)} position={rowIndex}>
            {row.map((cell, cellIndex) => (
              <IndexTableCell key={cellIndex}>
                {typeof cell === "string" || typeof cell === "number" ? (
                  <Text>{cell}</Text>
                ) : (
                  cell
                )}
              </IndexTableCell>
            ))}
          </IndexTableRow>
        </RowIndexContext.Provider>
      ));
    }
    return Children.toArray(children)
      .filter(isValidElement)
      .map((child, index) => (
        <RowIndexContext.Provider key={child.key ?? index} value={index}>
          {child}
        </RowIndexContext.Provider>
      ));
  }, [rows, children]);

  const rowCount = bodyRows.length;

  const beginDrag = useCallback(
    (index: number, event: ReactPointerEvent<HTMLElement>) => {
      // Primary button / touch / pen only.
      if (!gridRef.current || !onReorder || event.button > 0) return;
      event.preventDefault();
      cancelDragRef.current?.();
      cancelDragRef.current = startRowDrag({
        grid: gridRef.current,
        fromIndex: index,
        startY: event.clientY,
        source: event.currentTarget,
        pointerId: event.pointerId,
        onDrop: (from, to) => {
          cancelDragRef.current = null;
          onReorder(from, to);
        },
      });
    },
    [onReorder],
  );

  // Leave no floating row behind if the table unmounts mid-drag.
  useEffect(() => () => cancelDragRef.current?.(), []);

  const moveBy = useCallback(
    (index: number, delta: number) => {
      const to = index + delta;
      if (to >= 0 && to < rowCount) onReorder?.(index, to);
    },
    [onReorder, rowCount],
  );

  const contextValue = useMemo<IndexTableContextType>(
    () => ({
      selectable,
      onSelectionChange,
      resourceName,
      layout,
      showSelectedOnly,
      zebra: hasZebraStriping,
      registerSticky,
      reorderable,
      beginDrag,
      moveBy,
    }),
    [
      selectable,
      onSelectionChange,
      resourceName,
      layout,
      showSelectedOnly,
      hasZebraStriping,
      registerSticky,
      reorderable,
      beginDrag,
      moveBy,
    ],
  );

  const rootClassName = cx(
    "cx-it",
    increasedTableDensity && "cx-it--dense",
    truncate && "cx-it--truncate",
    loading && "cx-it--loading",
    verticalAlign === "top" && "cx-it--align-top",
    verticalAlign === "bottom" && "cx-it--align-bottom",
    verticalAlign === "baseline" && "cx-it--align-baseline",
    className,
  );

  if (effectiveItemCount === 0 && emptyState) {
    return (
      <div ref={rootRef} id={id} className={rootClassName} style={style}>
        <style>{INDEX_TABLE_CSS}</style>
        <div className="cx-it__empty">{emptyState}</div>
      </div>
    );
  }

  const selectedLabel =
    selectedItemsCount === "All"
      ? `All ${effectiveItemCount} ${plural} selected`
      : `${selectedCount} selected`;

  const handleSort = (index: number, heading: IndexTableHeadingType) => {
    const next: IndexTableSortDirectionType =
      sortColumnIndex === index
        ? sortDirection === "ascending"
          ? "descending"
          : "ascending"
        : (heading.defaultSortDirection ?? "descending");
    onSort?.(index, next);
  };

  const rootStyle = {
    "--cx-it-cols": layout.gridTemplateColumns,
    "--cx-it-min": layout.minInlineSize,
    "--cx-it-lead": reorderable ? `${HANDLE_COLUMN_WIDTH}px` : "0px",
    ...style,
  } as CSSProperties;

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleScroll = useCallback(() => {
    setIsScrolling(true);
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  return (
    <IndexTableContext.Provider value={contextValue}>
      <div ref={rootRef} id={id} className={rootClassName} style={rootStyle}>
        <style>{INDEX_TABLE_CSS}</style>

        {/* The bulk bar replaces the header row. It sits outside the scroller so
            it stays in view while the columns scroll sideways. */}
        {isBulkActive && (
          <IndexTableBulkActions
            selectedLabel={selectedLabel}
            itemCount={effectiveItemCount}
            plural={plural}
            allSelected={allSelected}
            promotedBulkActions={promotedBulkActions}
            bulkActions={bulkActions}
            onSelectionChange={onSelectionChange}
            showAllSelectedToggle={showAllSelectedToggle}
            showSelectedOnly={showSelectedOnly}
            onShowSelectedOnlyChange={setShowSelectedOnly}
            compact={isXs || isSm}
          />
        )}

        <div
          className={cx("cx-it__scroll", isScrolling && "cx-it__scroll--scrolling")}
          onScroll={handleScroll}
        >
          <div
            role="table"
            aria-label={resourceName?.plural}
            aria-busy={loading || undefined}
            className="cx-it__grid"
            ref={gridRef}
          >
            {!isBulkActive && normalizedHeadings.length > 0 && (
              <div role="row" className="cx-it__row cx-it__row--head">
                {reorderable && (
                  <div
                    role="columnheader"
                    aria-label="Reorder"
                    className={cx(
                      "cx-it__cell cx-it__cell--control",
                      layout.selectionSticky && "cx-it__cell--sticky",
                    )}
                    style={pinStyle(layout.selectionSticky)}
                  />
                )}
                {selectable && (
                  <div
                    role="columnheader"
                    className={cx(
                      "cx-it__cell cx-it__cell--control",
                      layout.selectionSticky && "cx-it__cell--sticky",
                    )}
                    style={pinStyle(layout.selectionSticky, layout.selectionOffset)}
                  >
                    <Checkbox
                      label={`Select all ${plural}`}
                      labelAccessibilityVisibility="exclusive"
                      checked={allSelected}
                      indeterminate={isIndeterminate}
                      onChange={(checked) => onSelectionChange?.("page", checked)}
                    />
                  </div>
                )}
                {layout.columns.map((column, index) => {
                  const heading = normalizedHeadings[index];
                  const isSorted = sortColumnIndex === index;
                  return (
                    <div
                      key={heading?.id ?? index}
                      role="columnheader"
                      aria-sort={
                        heading?.sortable
                          ? isSorted
                            ? (sortDirection ?? "descending")
                            : "none"
                          : undefined
                      }
                      className={cx(
                        "cx-it__cell cx-it__cell--head",
                        alignmentClass(column.alignment),
                        column.sticky && "cx-it__cell--sticky",
                      )}
                      style={pinStyle(column.sticky, column.offset)}
                    >
                      {heading && !heading.hidden && heading.sortable ? (
                        <button
                          type="button"
                          className={cx(
                            "cx-it__control cx-it__sort",
                            isSorted && "cx-it__sort--active",
                          )}
                          onClick={() => handleSort(index, heading)}
                        >
                          {heading.title}
                          <span className="cx-it__sort-icon" aria-hidden="true">
                            <Icon
                              type={
                                isSorted && sortDirection === "ascending"
                                  ? "arrow-up"
                                  : "arrow-down"
                              }
                              size="small"
                            />
                          </span>
                        </button>
                      ) : heading && !heading.hidden ? (
                        heading.title
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}

            {bodyRows}
          </div>
        </div>

        {pagination ? (
          pagination.floating ? (
            <Floating position="bottom-left" offset={{ x: 16, y: 16 }}>
              <Card padding="none">
                <Box padding="small-100">
                  <Pagination
                    hasPrevious={pagination.hasPrevious}
                    hasNext={pagination.hasNext}
                    onPrevious={pagination.onPrevious}
                    onNext={pagination.onNext}
                    label={pagination.label}
                    previousTooltip={pagination.previousTooltip ?? "Previous page"}
                    nextTooltip={pagination.nextTooltip ?? "Next page"}
                    accessibilityLabel={pagination.accessibilityLabel}
                  />
                </Box>
              </Card>
            </Floating>
          ) : (
            <div className="cx-it__pagination">
              <Pagination
                hasPrevious={pagination.hasPrevious}
                hasNext={pagination.hasNext}
                onPrevious={pagination.onPrevious}
                onNext={pagination.onNext}
                label={pagination.label}
                previousTooltip={pagination.previousTooltip ?? "Previous page"}
                nextTooltip={pagination.nextTooltip ?? "Next page"}
                accessibilityLabel={pagination.accessibilityLabel}
              />
            </div>
          )
        ) : null}

        {footerContent && <div className="cx-it__footer">{footerContent}</div>}
      </div>
    </IndexTableContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Row                                                                        */
/* -------------------------------------------------------------------------- */

function IndexTableRow({
  children,
  id,
  selected,
  position,
  onClick,
  disabled,
  selectable: rowSelectable = true,
  subRows,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  className,
  style,
}: IndexTableRowPropsType): ReactElement | null {
  const table = useIndexTable();
  const depth = useContext(DepthContext);
  const contextIndex = useContext(RowIndexContext);
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState(defaultExpanded);

  const expanded = expandedProp ?? uncontrolledExpanded;

  // Sub-rows stay mounted while they animate closed, then unmount.
  const [subRowsMounted, setSubRowsMounted] = useState(expanded);
  if (expanded && !subRowsMounted) setSubRowsMounted(true);
  const subRowsRef = useSubRowsHeight(expanded);
  // Rows open on first render appear without animating.
  const hasRendered = useRef(false);
  useEffect(() => {
    hasRendered.current = true;
  }, []);
  const hasSubRows = Children.toArray(subRows).some(isValidElement);
  const index = depth === 0 ? contextIndex : -1;
  const canDrag = table.reorderable && depth === 0 && index >= 0;
  const zebraIndex = position ?? index;
  const showCheckbox = table.selectable && rowSelectable;

  // With selectable sub-rows, the checkbox reflects the children (checked /
  // indeterminate) and toggling cascades down and back up the tree.
  const ancestors = useContext(SelectionAncestorsContext);
  const selectionNode = useMemo(
    () =>
      buildSelectionNode({ id, selected, selectable: rowSelectable, disabled, subRows }),
    [id, selected, rowSelectable, disabled, subRows],
  );
  const selectionState = getSelectionState(selectionNode);
  const childAncestors = useMemo(
    () => [selectionNode, ...ancestors],
    [selectionNode, ancestors],
  );

  const setSelected = (next: boolean) => {
    for (const change of getToggleChanges(selectionNode, next, ancestors)) {
      table.onSelectionChange?.("single", change.selected, change.id);
    }
  };

  const rowContext = useMemo<RowContextType>(
    () => ({
      depth,
      expandable: hasSubRows,
      expanded,
      toggleExpanded: () => {
        const next = !expanded;
        if (expandedProp === undefined) setUncontrolledExpanded(next);
        onExpandedChange?.(next);
      },
    }),
    [depth, hasSubRows, expanded, expandedProp, onExpandedChange],
  );

  // "Show all selected" keeps a parent visible while any of its children is selected.
  if (table.showSelectedOnly && !hasAnySelected(selectionNode)) return null;

  const cells = Children.toArray(children).filter(isValidElement);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!onClick || clickPassedThrough(event, INTERACTIVE_SELECTOR)) return;
    onClick();
  };

  // The whole checkbox cell selects: a click anywhere in it toggles the row and
  // never reaches the row's own click handler.
  const handleSelectCellClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (disabled || clickPassedThrough(event, "s-checkbox")) return;
    setSelected(selectionState !== "all");
  };

  const handleHandleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      table.moveBy(index, event.key === "ArrowUp" ? -1 : 1);
    }
  };

  const controlPin = table.layout.selectionSticky;

  return (
    <>
      <div
        role="row"
        id={id}
        aria-selected={showCheckbox ? selectionState === "all" : undefined}
        aria-level={depth > 0 ? depth + 1 : undefined}
        aria-expanded={hasSubRows ? expanded : undefined}
        aria-disabled={disabled || undefined}
        className={cx(
          "cx-it__row cx-it__row--body",
          onClick && "cx-it__row--clickable",
          table.zebra && zebraIndex % 2 === 1 && "cx-it__row--zebra",
          className,
        )}
        style={style}
        {...(canDrag ? { [DRAG_INDEX_ATTRIBUTE]: index } : {})}
        onClick={handleClick}
      >
        {table.reorderable && (
          <div
            role="cell"
            className={cx(
              "cx-it__cell cx-it__cell--control",
              controlPin && "cx-it__cell--sticky",
            )}
            style={pinStyle(controlPin)}
          >
            {canDrag && (
              <button
                type="button"
                aria-label="Reorder row. Use the up and down arrow keys to move it."
                className="cx-it__control cx-it__control--icon cx-it__handle"
                onPointerDown={(event) => table.beginDrag(index, event)}
                onKeyDown={handleHandleKeyDown}
              >
                <Icon type="drag-handle" />
              </button>
            )}
          </div>
        )}

        {table.selectable && (
          <div
            role="cell"
            className={cx(
              "cx-it__cell cx-it__cell--control",
              showCheckbox && "cx-it__cell--select",
              controlPin && "cx-it__cell--sticky",
            )}
            style={pinStyle(controlPin, table.layout.selectionOffset)}
            onClick={showCheckbox ? handleSelectCellClick : undefined}
          >
            {showCheckbox && (
              <Checkbox
                label={`Select ${table.resourceName?.singular ?? id ?? "row"}`}
                labelAccessibilityVisibility="exclusive"
                checked={selectionState === "all"}
                indeterminate={selectionState === "some"}
                disabled={disabled}
                onChange={() => setSelected(selectionState !== "all")}
              />
            )}
          </div>
        )}

        <RowContext.Provider value={rowContext}>
          {cells.map((cell, cellIndex) => (
            <ColumnIndexContext.Provider key={cell.key ?? cellIndex} value={cellIndex}>
              {cell}
            </ColumnIndexContext.Provider>
          ))}
        </RowContext.Provider>
      </div>

      {hasSubRows && subRowsMounted && (
        <Transition
          ref={subRowsRef}
          role="rowgroup"
          className="cx-it__subrows"
          show={expanded}
          appear={hasRendered.current}
          reverse
          variant={SUB_ROWS_KEYFRAMES}
          duration={SUB_ROWS_DURATION}
          easing={SUB_ROWS_EASING}
          onExited={() => setSubRowsMounted(false)}
        >
          <DepthContext.Provider value={depth + 1}>
            <RowIndexContext.Provider value={-1}>
              <SelectionAncestorsContext.Provider value={childAncestors}>
                {subRows}
              </SelectionAncestorsContext.Provider>
            </RowIndexContext.Provider>
          </DepthContext.Provider>
        </Transition>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Cell                                                                       */
/* -------------------------------------------------------------------------- */

/** Indent per nesting level for `subRows`, in px. */
const NESTED_INDENT = 24;

function IndexTableCell({
  children,
  sticky,
  flush,
  format,
  alignment,
  className,
  style,
}: IndexTableCellPropsType): ReactElement {
  const table = useIndexTable();
  const row = useContext(RowContext);
  const columnIndex = useContext(ColumnIndexContext);
  const { registerSticky } = table;

  // A pinned cell pins its whole column, header and checkbox included.
  useIsomorphicLayoutEffect(() => {
    if (sticky && columnIndex >= 0) registerSticky(columnIndex, sticky);
  }, [sticky, columnIndex, registerSticky]);

  const column = table.layout.columns[columnIndex];
  const pin = sticky ?? column?.sticky;
  const resolvedAlignment =
    alignment ?? (format ? resolveAlignment({ format }) : (column?.alignment ?? "start"));
  const isFirst = columnIndex === 0;
  const colMaxWidth =
    column?.minWidth && column.minWidth > 260
      ? ({ "--cx-it-col-max": `${column.minWidth}px` } as CSSProperties)
      : undefined;

  return (
    <div
      role="cell"
      className={cx(
        "cx-it__cell",
        alignmentClass(resolvedAlignment),
        flush && "cx-it__cell--flush",
        pin && "cx-it__cell--sticky",
        className,
      )}
      style={{ ...pinStyle(pin, column?.offset), ...colMaxWidth, ...style }}
    >
      {isFirst && row.depth > 0 && (
        <div
          className="cx-it__indent"
          style={{ inlineSize: row.depth * NESTED_INDENT }}
          aria-hidden="true"
        />
      )}
      {isFirst && row.expandable && (
        <button
          type="button"
          aria-label={row.expanded ? "Collapse row" : "Expand row"}
          aria-expanded={row.expanded}
          className="cx-it__control cx-it__control--icon"
          onClick={(event) => {
            event.stopPropagation();
            row.toggleExpanded();
          }}
        >
          <Icon type={row.expanded ? "chevron-down" : "chevron-right"} />
        </button>
      )}
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Compound export                                                            */
/* -------------------------------------------------------------------------- */

type IndexTableComponentType = ((
  props: IndexTablePropsType & { ref?: ForwardedRef<HTMLElement> },
) => ReactElement) & {
  Row: typeof IndexTableRow;
  Cell: typeof IndexTableCell;
};

export const IndexTable = Object.assign(forwardRef(IndexTableInner), {
  Row: IndexTableRow,
  Cell: IndexTableCell,
}) as unknown as IndexTableComponentType;
