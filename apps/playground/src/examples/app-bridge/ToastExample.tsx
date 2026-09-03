import { Button, useToast } from "@xco/corex-ui";

export function ToastExample() {
  const toast = useToast();
  return <Button onClick={() => toast.show("Saved")}>Save</Button>;
}
