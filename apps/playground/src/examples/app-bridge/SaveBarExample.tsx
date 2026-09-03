import { SaveBar, useSaveBar } from "@xco/corex-ui";

export function SaveBarExample() {
  const saveBar = useSaveBar();
  return (
    <SaveBar id="playground-save-bar">
      <button type="button" onClick={() => saveBar.hide("playground-save-bar")}>
        Save
      </button>
      <button type="button" onClick={() => saveBar.hide("playground-save-bar")}>
        Discard
      </button>
    </SaveBar>
  );
}
