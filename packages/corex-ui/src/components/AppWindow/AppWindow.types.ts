import type { PolarisPropsType } from "../../types/common";

type NativeAppWindowProps = PolarisPropsType<"s-app-window">;

export type AppWindowSaveBarConfigType = {
  onSave?: () => void;
  onDiscard?: () => void;
  saveText?: string;
  discardText?: string;
  discardConfirmation?: boolean;
};

export type AppWindowPropsType = Omit<NativeAppWindowProps, "src"> & {
  /** URL of the page to load inside the window. */
  src: string;
  id?: string;
  className?: string;
  /**
   * When enabled, automatically mounts a SaveBar on the host parent page for this AppWindow
   * and bridges Save/Discard actions to the iframe via `useAppWindowSaveBar`.
   * Can be boolean or configuration object with custom handlers and labels.
   */
  saveBar?: boolean | AppWindowSaveBarConfigType;
};
