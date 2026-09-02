import type { ReactNode } from "react";

export interface TabDescriptor {
  id: string;
  content: ReactNode;
  accessibilityLabel?: string;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabDescriptor[];
  /** Index of the selected tab. Omit for uncontrolled usage. */
  selected?: number;
  onSelect?: (selectedTabIndex: number) => void;
  /** Content of the currently selected tab's panel. */
  children?: ReactNode;
  className?: string;
  id?: string;
}
