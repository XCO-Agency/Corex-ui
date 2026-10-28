import * as React from "react";

const SCRIPT_SRC = "/polaris-2.0-rc.js";

/**
 * The editor's own panels are built from Corex components, which render Polaris
 * web components, so the app document needs the Polaris runtime too (the canvas
 * iframe loads its own copy). The script stays once added: custom elements cannot
 * be unregistered, and the docs pages are unaffected by it.
 */
export function usePolarisRuntime() {
  const [ready, setReady] = React.useState(
    () =>
      typeof customElements !== "undefined" && Boolean(customElements.get("s-button")),
  );

  React.useEffect(() => {
    if (ready) return;
    if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
    let active = true;
    customElements.whenDefined("s-button").then(() => active && setReady(true));
    return () => {
      active = false;
    };
  }, [ready]);

  return ready;
}
