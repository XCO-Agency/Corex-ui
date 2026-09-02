import type { ReactNode } from "react";
import type { ModalAction } from "../Modal/Modal.types";

export interface PageProps {
  children?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  primaryAction?: ModalAction;
  secondaryActions?: ModalAction[];
  /** No confirmed `s-page` equivalent yet; accepted for API compatibility only. */
  backAction?: { content?: string; onAction?: () => void };
  fullWidth?: boolean;
  className?: string;
  id?: string;
}
