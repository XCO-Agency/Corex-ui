import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Icon } from "../Icon";
import { COMMAND_CSS, COMMAND_STYLE_ID } from "./Command.css";
import type {
  CommandComponentType,
  CommandContextType,
  CommandDialogPropsType,
  CommandEmptyPropsType,
  CommandGroupPropsType,
  CommandInputPropsType,
  CommandItemPropsType,
  CommandListPropsType,
  CommandPropsType,
  CommandSeparatorPropsType,
  CommandShortcutPropsType,
  CommandSidebarGroupType,
  CommandSidebarPropsType,
} from "./Command.types";

const CommandContext = createContext<CommandContextType | null>(null);

function useCommandContext(): CommandContextType | null {
  return useContext(CommandContext);
}

function ensureCommandStyles(node: HTMLElement | null) {
  const doc = node?.ownerDocument ?? (typeof document !== "undefined" ? document : null);
  if (!doc) return;
  const existing = doc.getElementById(COMMAND_STYLE_ID);
  if (existing) {
    if (existing.textContent !== COMMAND_CSS) existing.textContent = COMMAND_CSS;
    return;
  }
  const style = doc.createElement("style");
  style.id = COMMAND_STYLE_ID;
  style.textContent = COMMAND_CSS;
  doc.head.appendChild(style);
}

function resolveGroupId(
  value: string | undefined,
  heading: ReactNode | undefined,
): string | null {
  if (value) return value;
  if (typeof heading === "string" || typeof heading === "number") return String(heading);
  return null;
}

/**
 * Command menu for search and quick actions (shadcn / cmdk).
 *
 * Set `sidebar` for a two-column layout: group nav on the left, items on the right.
 *
 * ```tsx
 * <Command sidebar defaultSidebarGroup="suggestions">
 *   <Command.Input placeholder="Type a command or search..." />
 *   <Command.List>
 *     <Command.Group heading="Suggestions" value="suggestions">…</Command.Group>
 *     <Command.Group heading="Settings" value="settings">…</Command.Group>
 *   </Command.List>
 * </Command>
 * ```
 */
const CommandRoot = forwardRef<HTMLDivElement, CommandPropsType>(function Command(
  {
    className,
    style,
    sidebar = false,
    sidebarGroups: sidebarGroupsProp,
    sidebarGroup: sidebarGroupProp,
    defaultSidebarGroup,
    onSidebarGroupChange,
    sidebarWidth = "12rem",
    children,
    ...props
  },
  ref,
) {
  const [search, setSearch] = useState("");
  const [registeredGroups, setRegisteredGroups] = useState<CommandSidebarGroupType[]>([]);
  const [hoveredSidebarGroup, setHoveredSidebarGroup] = useState<string | null>(null);
  const [uncontrolledGroup, setUncontrolledGroup] = useState<string | null>(
    defaultSidebarGroup ?? null,
  );

  const isSidebarGroupControlled = sidebarGroupProp !== undefined;
  const stickySidebarGroup = isSidebarGroupControlled
    ? (sidebarGroupProp ?? null)
    : uncontrolledGroup;

  const setSidebarGroup = useCallback(
    (value: string) => {
      if (!isSidebarGroupControlled) setUncontrolledGroup(value);
      onSidebarGroupChange?.(value);
    },
    [isSidebarGroupControlled, onSidebarGroupChange],
  );

  const registerSidebarGroup = useCallback((group: CommandSidebarGroupType) => {
    setRegisteredGroups((prev) => {
      if (prev.some((entry) => entry.value === group.value)) {
        return prev.map((entry) => (entry.value === group.value ? group : entry));
      }
      return [...prev, group];
    });
  }, []);

  const unregisterSidebarGroup = useCallback((value: string) => {
    setRegisteredGroups((prev) => prev.filter((entry) => entry.value !== value));
  }, []);

  const hasExplicitSidebarGroups = sidebarGroupsProp != null;
  const sidebarGroups = sidebarGroupsProp ?? registeredGroups;

  // Pick a default sticky group once groups are known.
  useEffect(() => {
    if (!sidebar || stickySidebarGroup || sidebarGroups.length === 0) return;
    setSidebarGroup(sidebarGroups[0]!.value);
  }, [sidebar, stickySidebarGroup, sidebarGroups, setSidebarGroup]);

  const activeSidebarGroup = hoveredSidebarGroup ?? stickySidebarGroup;

  const contextValue = useMemo<CommandContextType>(
    () => ({
      sidebar,
      hasExplicitSidebarGroups,
      search,
      setSearch,
      sidebarGroup: stickySidebarGroup,
      setSidebarGroup,
      hoveredSidebarGroup,
      setHoveredSidebarGroup,
      activeSidebarGroup,
      sidebarGroups,
      registerSidebarGroup,
      unregisterSidebarGroup,
    }),
    [
      sidebar,
      hasExplicitSidebarGroups,
      search,
      stickySidebarGroup,
      setSidebarGroup,
      hoveredSidebarGroup,
      activeSidebarGroup,
      sidebarGroups,
      registerSidebarGroup,
      unregisterSidebarGroup,
    ],
  );

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      ensureCommandStyles(node);
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const rootStyle: CSSProperties = {
    ...(sidebar ? { ["--command-sidebar-width" as string]: sidebarWidth } : null),
    ...style,
  };

  return (
    <CommandContext.Provider value={contextValue}>
      <CommandPrimitive
        ref={setRefs}
        data-slot="command"
        data-sidebar={sidebar ? "" : undefined}
        className={className}
        style={rootStyle}
        {...props}
      >
        {children}
      </CommandPrimitive>
    </CommandContext.Provider>
  );
});
CommandRoot.displayName = "Command";

const CommandInput = forwardRef<HTMLInputElement, CommandInputPropsType>(function CommandInput(
  { className, style, hideIcon = false, value, onValueChange, ...props },
  ref,
) {
  const ctx = useCommandContext();
  const controlled = value !== undefined;
  const resolvedValue = controlled ? value : (ctx?.search ?? "");

  const setSearch = ctx?.setSearch;
  useEffect(() => {
    if (controlled && typeof value === "string") setSearch?.(value);
  }, [controlled, value, setSearch]);

  return (
    <div data-slot="command-input-wrapper">
      {hideIcon ? null : (
        <span data-slot="command-input-icon" aria-hidden>
          <Icon source="search" size="small" />
        </span>
      )}
      <CommandPrimitive.Input
        ref={ref}
        data-slot="command-input"
        className={className}
        style={style}
        value={resolvedValue}
        onValueChange={(next) => {
          ctx?.setSearch(next);
          onValueChange?.(next);
        }}
        {...props}
      />
    </div>
  );
});
CommandInput.displayName = "Command.Input";

function CommandSidebar({
  className,
  style,
  groups: groupsProp,
  ...props
}: CommandSidebarPropsType): ReactElement | null {
  const ctx = useCommandContext();
  if (!ctx?.sidebar) return null;

  const groups = groupsProp ?? ctx.sidebarGroups;
  if (groups.length === 0) return null;

  const searching = ctx.search.trim().length > 0;

  return (
    <nav
      data-slot="command-sidebar"
      aria-label="Command groups"
      className={className}
      style={style}
      {...props}
    >
      {groups.map((group) => {
        const isSticky = ctx.sidebarGroup === group.value;
        const isHovered = ctx.hoveredSidebarGroup === group.value;
        const isActive = ctx.activeSidebarGroup === group.value;
        return (
          <button
            key={group.value}
            type="button"
            data-slot="command-sidebar-item"
            data-active={isActive ? "" : undefined}
            data-selected={isSticky ? "" : undefined}
            data-hovered={isHovered ? "" : undefined}
            aria-current={isActive && !searching ? "true" : undefined}
            onClick={() => ctx.setSidebarGroup(group.value)}
            onMouseEnter={() => ctx.setHoveredSidebarGroup(group.value)}
            onMouseLeave={() => ctx.setHoveredSidebarGroup(null)}
            onFocus={() => ctx.setHoveredSidebarGroup(group.value)}
            onBlur={() => ctx.setHoveredSidebarGroup(null)}
          >
            {group.icon ? (
              <span data-slot="command-sidebar-item-icon">{group.icon}</span>
            ) : null}
            <span data-slot="command-sidebar-item-label">{group.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
CommandSidebar.displayName = "Command.Sidebar";

const CommandList = forwardRef<HTMLDivElement, CommandListPropsType>(function CommandList(
  { className, style, maxHeight, children, ...props },
  ref,
) {
  const ctx = useCommandContext();
  const listStyle: CSSProperties = {
    ...(maxHeight ? { ["--command-list-max-height" as string]: maxHeight } : null),
    ...style,
  };

  const list = (
    <CommandPrimitive.List
      ref={ref}
      data-slot="command-list"
      className={className}
      style={listStyle}
      {...props}
    >
      {children}
    </CommandPrimitive.List>
  );

  if (!ctx?.sidebar) return list;

  return (
    <div data-slot="command-body">
      <CommandSidebar />
      <div data-slot="command-panel">{list}</div>
    </div>
  );
});
CommandList.displayName = "Command.List";

const CommandEmpty = forwardRef<HTMLDivElement, CommandEmptyPropsType>(function CommandEmpty(
  { className, style, ...props },
  ref,
) {
  return (
    <CommandPrimitive.Empty
      ref={ref}
      data-slot="command-empty"
      className={className}
      style={style}
      {...props}
    />
  );
});
CommandEmpty.displayName = "Command.Empty";

const CommandGroup = forwardRef<HTMLDivElement, CommandGroupPropsType>(function CommandGroup(
  { className, style, value, heading, icon, forceMount, children, ...props },
  ref,
) {
  const ctx = useCommandContext();
  const groupId = resolveGroupId(value, heading);

  const registerSidebarGroup = ctx?.registerSidebarGroup;
  const unregisterSidebarGroup = ctx?.unregisterSidebarGroup;
  const sidebarEnabled = Boolean(ctx?.sidebar);
  const skipRegister = Boolean(ctx?.hasExplicitSidebarGroups);

  useEffect(() => {
    if (!sidebarEnabled || !groupId || skipRegister || !registerSidebarGroup) return;
    registerSidebarGroup({
      value: groupId,
      label: typeof heading === "string" || typeof heading === "number" ? String(heading) : groupId,
      icon,
    });
    return () => unregisterSidebarGroup?.(groupId);
  }, [
    sidebarEnabled,
    skipRegister,
    groupId,
    heading,
    icon,
    registerSidebarGroup,
    unregisterSidebarGroup,
  ]);

  const searching = (ctx?.search.trim().length ?? 0) > 0;
  const hideForSidebar =
    Boolean(ctx?.sidebar) &&
    !searching &&
    groupId != null &&
    ctx?.activeSidebarGroup != null &&
    groupId !== ctx.activeSidebarGroup;

  // Do not use cmdk `forceMount` for sidebar: it skips item registration
  // (Empty always shows) and disables search filtering on items.
  // Inactive groups omit children so they leave the item registry / a11y tree.
  return (
    <CommandPrimitive.Group
      ref={ref}
      data-slot="command-group"
      data-group-value={groupId ?? undefined}
      data-sidebar-hidden={hideForSidebar ? "" : undefined}
      forceMount={forceMount}
      heading={ctx?.sidebar && !searching ? undefined : heading}
      className={className}
      style={{
        ...(hideForSidebar ? { display: "none" } : null),
        ...style,
      }}
      {...props}
    >
      {hideForSidebar ? null : children}
    </CommandPrimitive.Group>
  );
});
CommandGroup.displayName = "Command.Group";

const CommandItem = forwardRef<HTMLDivElement, CommandItemPropsType>(function CommandItem(
  { className, style, ...props },
  ref,
) {
  return (
    <CommandPrimitive.Item
      ref={ref}
      data-slot="command-item"
      className={className}
      style={style}
      {...props}
    />
  );
});
CommandItem.displayName = "Command.Item";

const CommandSeparator = forwardRef<HTMLDivElement, CommandSeparatorPropsType>(
  function CommandSeparator({ className, style, ...props }, ref) {
    const ctx = useCommandContext();
    const searching = (ctx?.search.trim().length ?? 0) > 0;
    // Separators are noise in sidebar (single-group) mode.
    if (ctx?.sidebar && !searching) return null;

    return (
      <CommandPrimitive.Separator
        ref={ref}
        data-slot="command-separator"
        className={className}
        style={style}
        {...props}
      />
    );
  },
);
CommandSeparator.displayName = "Command.Separator";

function CommandShortcut({ className, style, ...props }: CommandShortcutPropsType): ReactElement {
  return <span data-slot="command-shortcut" className={className} style={style} {...props} />;
}
CommandShortcut.displayName = "Command.Shortcut";

/**
 * Command palette in a centered dialog (Base UI Dialog + cmdk Command).
 * Pass `open` / `onOpenChange` for controlled use, or `defaultOpen`.
 */
function CommandDialog({
  children,
  className,
  style,
  title = "Command Palette",
  description = "Search for a command to run...",
  container,
  ...props
}: CommandDialogPropsType): ReactElement {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  const markerRef = useCallback((node: HTMLSpanElement | null) => {
    if (!node) {
      setPortalContainer(null);
      return;
    }
    ensureCommandStyles(node);
    setPortalContainer(node.ownerDocument.body);
  }, []);

  useLayoutEffect(() => {
    if (portalContainer) ensureCommandStyles(portalContainer);
  }, [portalContainer]);

  return (
    <>
      <span
        ref={markerRef}
        data-slot="command-dialog-marker"
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
        aria-hidden
      />
      <DialogPrimitive.Root data-slot="command-dialog" {...props}>
        <DialogPrimitive.Portal container={container ?? portalContainer ?? undefined}>
          <DialogPrimitive.Backdrop data-slot="command-dialog-overlay" />
          <DialogPrimitive.Viewport data-slot="command-dialog-viewport">
            <DialogPrimitive.Popup
              data-slot="command-dialog-popup"
              className={className}
              style={style}
            >
              <div data-slot="command-dialog-sr">
                <DialogPrimitive.Title>{title}</DialogPrimitive.Title>
                <DialogPrimitive.Description>{description}</DialogPrimitive.Description>
              </div>
              {children}
            </DialogPrimitive.Popup>
          </DialogPrimitive.Viewport>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
CommandDialog.displayName = "Command.Dialog";

export const Command = Object.assign(CommandRoot, {
  Input: CommandInput,
  List: CommandList,
  Empty: CommandEmpty,
  Group: CommandGroup,
  Item: CommandItem,
  Separator: CommandSeparator,
  Shortcut: CommandShortcut,
  Sidebar: CommandSidebar,
  Dialog: CommandDialog,
}) as unknown as CommandComponentType;
