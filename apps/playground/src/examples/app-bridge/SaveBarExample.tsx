import { Button, SaveBar, useSaveBar } from "@xco/corex-ui";

export function SaveBarExample() {
  const saveBar = useSaveBar();
  return (
    <SaveBar id="playground-save-bar">
      <Button onClick={() => saveBar.hide("playground-save-bar")}>
        Save
      </Button>
      <Button onClick={() => saveBar.hide("playground-save-bar")}>
        Discard
      </Button>
    </SaveBar>
  );
}
