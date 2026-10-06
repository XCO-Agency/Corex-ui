import {
  forwardRef,
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { InlineStack } from "../InlineStack";
import { Card } from "../Card";
import { IndexFiltersSearchField } from "./IndexFiltersSearchField";
import {
  IndexFiltersViewOptions,
  IndexFiltersViewOptionsColumns,
  IndexFiltersViewOptionsSort,
  IndexFiltersViewOptionsToggles,
} from "./IndexFiltersViewOptions";
import {
  IndexFiltersSaveAction,
  IndexFiltersSaveButton,
  IndexFiltersSaveModal,
  IndexFiltersViewVisibleActiveFilter,
} from "./IndexFiltersSaveAction";
import {
  IndexFiltersContext,
  isFieldStateActive,
  useIndexFiltersContext,
  type IndexFiltersContextType,
  type IndexFiltersFieldStateType,
} from "./IndexFiltersContext";
import type {
  IndexAppliedFilterType,
  IndexFiltersSaveActionType,
  IndexFiltersSavedViewType,
  IndexFiltersSearchFieldPropsType,
  IndexSavedFilterType,
} from "./IndexFilters.types";

export {
  IndexFiltersSaveAction,
  IndexFiltersViewVisibleActiveFilter,
  IndexFiltersSearchField,
  IndexFiltersViewOptions,
  IndexFiltersViewOptionsColumns,
  IndexFiltersViewOptionsSort,
  IndexFiltersViewOptionsToggles,
};

/** Lays out the right-side actions and appends the built-in save action. */
function IndexFiltersActionsContainer({
  children,
  withSaveAction,
}: {
  children?: ReactNode;
  withSaveAction: boolean;
}) {
  return (
    <InlineStack alignItems="center" blockSize="fill" shrink gap="small-400">
      {children}
      {withSaveAction ? <IndexFiltersSaveButton /> : null}
    </InlineStack>
  );
}

/**
 * Right-side actions container. Inside `IndexFilters` it ends with the
 * built-in save action unless that is disabled or placed explicitly with
 * `<IndexFilters.SaveAction />`.
 */
export function IndexFiltersActions({ children }: { children?: ReactNode }) {
  const id = useId();
  const context = useIndexFiltersContext();
  const registerActions = context?.registerActions;

  useLayoutEffect(() => registerActions?.(id), [registerActions, id]);

  return (
    <IndexFiltersActionsContainer withSaveAction={context?.autoSaveOwnerId === id}>
      {children}
    </IndexFiltersActionsContainer>
  );
}
IndexFiltersActions.displayName = "IndexFiltersActions";

/**
 * Props for the IndexFilters toolbar. Either compose it with `children`
 * (`<IndexFilters.SearchField />`, `<IndexFilters.Actions>`) or configure the
 * search field via props and pass right-side content through `actions`.
 */
type IndexFiltersPropsType = IndexFiltersSearchFieldPropsType & {
  /** Content on the right side, e.g. `<IndexFilters.ViewOptions>`. */
  actions?: ReactNode;
  /** Composable toolbar elements (e.g. <IndexFilters.SearchField />, <IndexFilters.Actions>). */
  children?: ReactNode;
  /**
   * Built-in "Save" action, shown while a search or filter is active. It opens
   * a modal asking for a view name, then calls `onSaveView`. Enabled by
   * default; pass `false` to remove it or an object to configure it.
   */
  saveAction?: boolean | IndexFiltersSaveActionType;
  /** Called with the named view to store, typically as a new tab. */
  onSaveView?: (view: IndexFiltersSavedViewType) => void | Promise<void>;
  /**
   * Overrides whether filters count as active (save action and
   * `ViewVisibleActiveFilter`). By default a non-blank query or a filter with
   * a value is active.
   */
  hasActiveFilters?: boolean;
};

const toSavedFilters = (filters: IndexAppliedFilterType[]): IndexSavedFilterType[] =>
  filters.map(({ onRemove: _onRemove, ...filter }) => filter);

/**
 * IndexFilters toolbar: unified search/filter field on the left, actions on the right.
 * Use it composably (<IndexFilters><IndexFilters.SearchField /><IndexFilters.Actions>...</IndexFilters.Actions></IndexFilters>)
 * or declaratively via props.
 */
const IndexFiltersRoot = forwardRef<HTMLDivElement, IndexFiltersPropsType>(
  function IndexFilters(
    {
      actions,
      children,
      id,
      saveAction = true,
      onSaveView,
      hasActiveFilters,
      ...searchFieldProps
    },
    ref,
  ) {
    const fieldStateRef = useRef<IndexFiltersFieldStateType>({
      query: "",
      appliedFilters: [],
    });
    const [detectedActive, setDetectedActive] = useState(false);
    const [saveModalOpen, setSaveModalOpen] = useState(false);
    const [actionsIds, setActionsIds] = useState<string[]>([]);
    const [explicitSaveCount, setExplicitSaveCount] = useState(0);

    const saveEnabled = saveAction !== false;
    const saveConfig: IndexFiltersSaveActionType =
      typeof saveAction === "object" ? saveAction : {};
    const active = hasActiveFilters ?? detectedActive;

    const reportFieldState = useCallback((state: IndexFiltersFieldStateType) => {
      fieldStateRef.current = state;
      setDetectedActive(isFieldStateActive(state));
    }, []);

    const registerActions = useCallback((actionsId: string) => {
      setActionsIds((prev) => [...prev, actionsId]);
      return () => setActionsIds((prev) => prev.filter((item) => item !== actionsId));
    }, []);

    const registerSaveAction = useCallback(() => {
      setExplicitSaveCount((count) => count + 1);
      return () => setExplicitSaveCount((count) => count - 1);
    }, []);

    const openSaveModal = useCallback(() => setSaveModalOpen(true), []);

    const handleSave = async (name: string) => {
      const { query, appliedFilters } = fieldStateRef.current;
      await onSaveView?.({ name, query, filters: toSavedFilters(appliedFilters) });
    };

    // The last `IndexFilters.Actions` hosts the save action, unless it's placed
    // explicitly; with no `Actions` at all the toolbar renders its own slot.
    const autoSave = saveEnabled && explicitSaveCount === 0;
    const autoSaveOwnerId = autoSave ? (actionsIds[actionsIds.length - 1] ?? null) : null;
    const needsFallbackSlot = autoSave && actionsIds.length === 0;

    const contextValue = useMemo<IndexFiltersContextType>(
      () => ({
        active,
        reportFieldState,
        saveEnabled,
        saveDisabled: Boolean(saveConfig.disabled),
        saveLabel: saveConfig.label ?? "Save",
        openSaveModal,
        registerActions,
        registerSaveAction,
        autoSaveOwnerId,
      }),
      [
        active,
        reportFieldState,
        saveEnabled,
        saveConfig.disabled,
        saveConfig.label,
        openSaveModal,
        registerActions,
        registerSaveAction,
        autoSaveOwnerId,
      ],
    );

    return (
      <IndexFiltersContext.Provider value={contextValue}>
        <Card padding="none">
          <InlineStack
            ref={ref}
            id={id}
            alignItems="center"
            justifyContent="space-between"
            paddingInlineEnd="small-300"
            gap="small-200"
            inlineSize="100%"
          >
            {children ?? (
              <>
                <IndexFiltersSearchField {...searchFieldProps} />
                {actions ? <IndexFiltersActions>{actions}</IndexFiltersActions> : null}
              </>
            )}
            {needsFallbackSlot ? <IndexFiltersActionsContainer withSaveAction /> : null}
          </InlineStack>
        </Card>
        {saveEnabled ? (
          <IndexFiltersSaveModal
            open={saveModalOpen}
            config={saveConfig}
            onClose={() => setSaveModalOpen(false)}
            onSave={handleSave}
          />
        ) : null}
      </IndexFiltersContext.Provider>
    );
  },
);

export const IndexFilters = Object.assign(IndexFiltersRoot, {
  SearchField: IndexFiltersSearchField,
  Actions: IndexFiltersActions,
  ViewOptions: IndexFiltersViewOptions,
  ViewOptionsSort: IndexFiltersViewOptionsSort,
  ViewOptionsToggles: IndexFiltersViewOptionsToggles,
  ViewOptionsColumns: IndexFiltersViewOptionsColumns,
  ViewVisibleActiveFilter: IndexFiltersViewVisibleActiveFilter,
  SaveAction: IndexFiltersSaveAction,
});

// Aliases for backwards compatibility
export const Filters = IndexFilters;
