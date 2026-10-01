import { useEffect } from "react";
import { useToast } from "../../hooks/useToast";
import { devWarning } from "../../utils/devWarning";
import type { ToastPropsType } from "./Toast.types";

/**
 * v12 rendered a Toast element inside a Frame. 2.x raises one through App Bridge,
 * so this renders nothing and fires the platform's toast instead — call sites keep
 * mounting it conditionally exactly as they do now, and the dismissal is the
 * admin's.
 */
export function Toast({
  content,
  error,
  duration,
  onDismiss,
  action,
}: ToastPropsType): null {
  const toast = useToast();

  if (action !== undefined) {
    devWarning("Toast", "`action` is ignored; App Bridge's toast has no action.");
  }

  useEffect(() => {
    if (!content) return;

    toast.show(content, { isError: error, duration });
    onDismiss?.();
    // Re-raising on a new `onDismiss` identity would show the toast twice.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, error, duration]);

  return null;
}
