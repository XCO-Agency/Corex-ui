import { Button, ButtonGroup } from "@xco-agency/corex-ui";

export function ButtonGroupExample() {
  return (
    <ButtonGroup gap="none">
      <Button slot="secondary-actions">One</Button>
      <Button slot="secondary-actions">Two</Button>
      <Button slot="secondary-actions">Three</Button>
    </ButtonGroup>
  );
}
