import { AppWindow, Button } from "@xco/corex-ui";

export function AppWindowDeclarativeExample() {
  return (
    <>
      <Button command="--show" commandFor="app-window-declarative">
        Open App Window
      </Button>{" "}
      <Button command="--hide" commandFor="app-window-declarative">
        Close App Window
      </Button>
      <AppWindow id="app-window-declarative" src="/app-window-content.html" />
    </>
  );
}
