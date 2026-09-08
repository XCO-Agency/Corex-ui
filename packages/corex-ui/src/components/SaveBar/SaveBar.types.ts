import type { ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

export type SaveBarPropsType = Omit<PolarisPropsType<"ui-save-bar">, "ref"> & {
  /** When true, automatically shows the save bar via App Bridge; when false, hides it. */
  open?: boolean;
  /** Whether to show a confirmation dialog when the discard button is clicked. */
  /** Label for the primary Save button when using `onSave`. Default "Save". */
  saveText?: string;
  /** Label for the secondary Discard button when using `onDiscard`. Default "Discard". */
  discardText?: string;
  /** Called when the Save button is clicked. */
  onSave?: () => void;
  /** Called when the Discard button is clicked. */
  onDiscard?: () => void;
  /** Disables both buttons. */
  disabled?: boolean;
  /** Puts the Save button into a loading state. */
  loading?: boolean;
};
