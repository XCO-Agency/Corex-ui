import { useRef } from "react";
import { AppWindow, Button } from "@xco/corex-ui";

export function AppWindowExample() {
  const windowRef = useRef<HTMLElementTagNameMap["s-app-window"]>(null);
  return (
    <>
      <Button onClick={() => windowRef.current?.show()}>Show App Window</Button>{" "}
      <Button onClick={() => windowRef.current?.hide()}>Hide App Window</Button>
      <AppWindow ref={windowRef} src="/app-window-content.html" />
    </>
  );
}
