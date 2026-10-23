import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ForwardRefExoticComponent,
  ReactElement,
  ReactNode,
  RefAttributes,
} from "react";
import type { Dialog } from "@base-ui/react/dialog";
import type { Command as CommandPrimitive } from "cmdk";

type CommandRootPrimitiveProps = ComponentPropsWithoutRef<typeof CommandPrimitive>;
type CommandInputPrimitiveProps = ComponentPropsWithoutRef<typeof CommandPrimitive.Input>;
type CommandListPrimitiveProps = ComponentPropsWithoutRef<typeof CommandPrimitive.List>;
type CommandEmptyPrimitiveProps = ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>;
type CommandGroupPrimitiveProps = ComponentPropsWithoutRef<typeof CommandPrimitive.Group>;
type CommandItemPrimitiveProps = ComponentPropsWithoutRef<typeof CommandPrimitive.Item>;
type CommandSeparatorPrimitiveProps = ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>;

/** Sidebar nav entry when `sidebar` layout is enabled. */
export type CommandSidebarGroupType = {
  /** Stable id — must match `Command.Group` `value`. */
  value: string;
  /** Label shown in the left sidebar. */
  label: ReactNode;
  /** Optional leading icon (e.g. `<Icon source="settings" />`). */
  icon?: ReactNode;
};

export type CommandContextType = {
  sidebar: boolean;
  /** True when `sidebarGroups` was passed on `<Command>` (skip auto-register). */
  hasExplicitSidebarGroups: boolean;
  search: string;
  setSearch: (value: string) => void;
  /** Sticky selected sidebar group (click). */
  sidebarGroup: string | null;
  setSidebarGroup: (value: string) => void;
  /** Transient hover group — wins over sticky while hovering. */
  hoveredSidebarGroup: string | null;
  setHoveredSidebarGroup: (value: string | null) => void;
  /** Effective group shown on the right (`hovered ?? selected`). */
  activeSidebarGroup: string | null;
  sidebarGroups: CommandSidebarGroupType[];
  registerSidebarGroup: (group: CommandSidebarGroupType) => void;
  unregisterSidebarGroup: (value: string) => void;
};

export type CommandPropsType = Omit<CommandRootPrimitiveProps, "className"> & {
  className?: string;
  style?: CSSProperties;
  /**
   * Two-column layout: groups as a left sidebar, items of the
   * selected/hovered group on the right. Defaults to `false`.
   */
  sidebar?: boolean;
  /**
   * Explicit sidebar entries (order + labels + icons). When omitted, groups
   * are collected from `Command.Group` `value` / `heading` registrations.
   */
  sidebarGroups?: CommandSidebarGroupType[];
  /** Controlled sticky sidebar group id. */
  sidebarGroup?: string;
  /** Uncontrolled initial sticky sidebar group. */
  defaultSidebarGroup?: string;
  /** Called when the sticky sidebar group changes (click). */
  onSidebarGroupChange?: (value: string) => void;
  /** Left sidebar width. @default "12rem" */
  sidebarWidth?: string;
};

export type CommandInputPropsType = Omit<CommandInputPrimitiveProps, "className"> & {
  className?: string;
  style?: CSSProperties;
  /** Hide the leading search icon. @default false */
  hideIcon?: boolean;
};

export type CommandListPropsType = Omit<CommandListPrimitiveProps, "className"> & {
  className?: string;
  style?: CSSProperties;
  /** Max height of the scrollable list. @default "18rem" */
  maxHeight?: string;
};

export type CommandEmptyPropsType = Omit<CommandEmptyPrimitiveProps, "className"> & {
  className?: string;
  style?: CSSProperties;
};

export type CommandGroupPropsType = Omit<CommandGroupPrimitiveProps, "className"> & {
  className?: string;
  style?: CSSProperties;
  /**
   * Stable group id used by the sidebar layout. Falls back to string `heading`
   * when omitted.
   */
  value?: string;
  /** Optional sidebar icon when auto-registering groups. */
  icon?: ReactNode;
};

export type CommandItemPropsType = Omit<CommandItemPrimitiveProps, "className"> & {
  className?: string;
  style?: CSSProperties;
};

export type CommandSeparatorPropsType = Omit<CommandSeparatorPrimitiveProps, "className"> & {
  className?: string;
  style?: CSSProperties;
};

export type CommandShortcutPropsType = ComponentPropsWithoutRef<"span">;

export type CommandSidebarPropsType = ComponentPropsWithoutRef<"nav"> & {
  /** Override auto-built entries for this sidebar instance. */
  groups?: CommandSidebarGroupType[];
};

export type CommandDialogPropsType = Omit<Dialog.Root.Props, "children"> & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Screen-reader title. @default "Command Palette" */
  title?: string;
  /** Screen-reader description. @default "Search for a command to run..." */
  description?: string;
  /** Portal mount target (iframe-aware). */
  container?: HTMLElement | null;
};

export type CommandComponentType = ForwardRefExoticComponent<
  CommandPropsType & RefAttributes<HTMLDivElement>
> & {
  Input: ForwardRefExoticComponent<CommandInputPropsType & RefAttributes<HTMLInputElement>>;
  List: ForwardRefExoticComponent<CommandListPropsType & RefAttributes<HTMLDivElement>>;
  Empty: ForwardRefExoticComponent<CommandEmptyPropsType & RefAttributes<HTMLDivElement>>;
  Group: ForwardRefExoticComponent<CommandGroupPropsType & RefAttributes<HTMLDivElement>>;
  Item: ForwardRefExoticComponent<CommandItemPropsType & RefAttributes<HTMLDivElement>>;
  Separator: ForwardRefExoticComponent<CommandSeparatorPropsType & RefAttributes<HTMLDivElement>>;
  Shortcut: (props: CommandShortcutPropsType) => ReactElement;
  Sidebar: (props: CommandSidebarPropsType) => ReactElement;
  Dialog: (props: CommandDialogPropsType) => ReactElement;
};
