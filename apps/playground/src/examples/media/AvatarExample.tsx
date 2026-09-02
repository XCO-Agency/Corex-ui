import { Avatar, InlineStack } from "@xco/corex-ui";

export function AvatarExample() {
  return (
    <InlineStack gap="small-200">
      <Avatar name="Ada Lovelace" initials="AL" />
      <Avatar name="Grace Hopper" initials="GH" />
    </InlineStack>
  );
}
