export type ToastPropsType = {
  /** Nothing is raised without content, matching v12. */
  content?: string;
  error?: boolean;
  /** Milliseconds the toast stays up. */
  duration?: number;
  /**
   * v12 called this when the toast timed out or was dismissed. App Bridge gives
   * no such callback, so it fires once the toast has been raised — which is what
   * call sites use it for: clearing their own state.
   */
  onDismiss?: () => void;
  /** @deprecated v12 put an action in the toast; App Bridge's has none. */
  action?: { content?: string; onAction?: () => void };
};
