import type { ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeModalProps = PolarisPropsType<"s-modal">;

export type ModalCommandType = "--auto" | "--show" | "--hide" | "--toggle" | "--copy";

export type ModalActionType = {
  content: ReactNode;
  onAction?: () => void;
  destructive?: boolean;
  disabled?: boolean;
  loading?: boolean;
  command?: ModalCommandType;
};

export type ModalSaveBarConfigType = {
  /** Called when the Save button is clicked on the host save bar. */
  onSave?: () => void | Promise<void>;
  /** Called when the Discard button is clicked on the host save bar. */
  onDiscard?: () => void | Promise<void>;
  /** Custom label for the primary button. If empty/omitted in App Bridge, App Bridge provides localized label. */
  saveText?: string;
  /** Custom label for the discard button. If empty/omitted in App Bridge, App Bridge provides localized label. */
  discardText?: string;
  /** Whether to show confirmation modal on discard. Default is true. */
  discardConfirmation?: boolean;
  /** BroadcastChannel name for cross-document handshake with iframe. */
  channel?: string;
};

export type ModalPropsType = Omit<NativeModalProps, "children" | "title"> & {
  children?: ReactNode;
  /** Controls visibility. `Modal` owns no internal open state, matching legacy `Modal`. */
  open: boolean;
  onClose: () => void;
  /** App Bridge modal dismiss callback, called whenever modal hides. */
  onHide?: () => void;
  title?: ReactNode;
  primaryAction?: ModalActionType;
  secondaryActions?: ModalActionType[];
  className?: string;
  id?: string;
  /**
   * Modal size variant. Use `"max"` for full-screen / full-viewport App Bridge modals.
   * When `variant` or `src` is specified, `Modal` renders `<ui-modal>` (App Bridge web component).
   */
  variant?: "small" | "base" | "large" | "max";
  /**
   * For cross-document modals: URL of the iframe page to load inside the modal.
   * Note: in App Bridge, any children inside a `src` modal other than `TitleBar` and `SaveBar` will be ignored.
   */
  src?: string;
  /**
   * When enabled, automatically mounts a host `<SaveBar>` attached to the modal and
   * establishes a bidirectional state and action handshake for iframe or inline content.
   */
  saveBar?: boolean | ModalSaveBarConfigType;
  /** BroadcastChannel channel name used for iframe sync when `src` or `saveBar` is used. */
  channel?: string;
};
