import type {
  CSSProperties,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from "react";
import type { TextField } from "../TextField";

export type AutocompleteOptionType = {
  value: string;
  label?: ReactNode;
  disabled?: boolean;
};

export type AutocompletePropsType = {
  options?: AutocompleteOptionType[];
  selected?: string[];
  onSelect?: (selected: string[]) => void;
  /** The field. `Autocomplete.TextField` is the usual one. */
  textField?: ReactNode;
  allowMultiple?: boolean;
  loading?: boolean;
  /** Shown in place of the list when there are no options. */
  emptyState?: ReactNode;
  preferredPosition?: "above" | "below" | "mostSpace";
  willLoadMoreResults?: boolean;
  onLoadMoreResults?: () => void;
  /** Controlled open state. If omitted, open state is managed automatically. */
  open?: boolean;
  active?: boolean;
  onClose?: () => void;
  id?: string;
  className?: string;
  style?: CSSProperties;
};

export type AutocompleteComponentType = ForwardRefExoticComponent<
  AutocompletePropsType & RefAttributes<HTMLDivElement>
> & {
  TextField: typeof TextField;
};
