import type { ReactNode } from "react";

export interface ModalAction {
  content: ReactNode;
  onAction?: () => void;
  destructive?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export interface ModalProps {
  children?: ReactNode;
  /** Controls visibility. `Modal` owns no internal open state, matching legacy `Modal`. */
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  primaryAction?: ModalAction;
  secondaryActions?: ModalAction[];
  className?: string;
  id?: string;
}
