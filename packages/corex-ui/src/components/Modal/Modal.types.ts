import type { ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeModalProps = PolarisPropsType<"s-modal">;

export type ModalActionType = {
  content: ReactNode;
  onAction?: () => void;
  destructive?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

export type ModalPropsType = Omit<NativeModalProps, "children" | "title"> & {
  children?: ReactNode;
  /** Controls visibility. `Modal` owns no internal open state, matching legacy `Modal`. */
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  primaryAction?: ModalActionType;
  secondaryActions?: ModalActionType[];
  className?: string;
  id?: string;
};
