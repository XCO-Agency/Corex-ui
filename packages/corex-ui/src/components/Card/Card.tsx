import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { devWarning } from "../../utils/devWarning";
import { Text } from "../Text";
import type { CardProps } from "./Card.types";

const SSection = createWebComponent<HTMLElement>("s-section");

/**
 * Composed pattern: legacy `Card` has no direct Polaris web component
 * equivalent (there is no `s-card`). It's built on `s-section`, the closest
 * primitive for a bordered content surface, with an optional heading
 * composed from `Text` for the legacy `title` prop.
 */
export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { children, title, sectioned, padding, ...rest },
  ref,
) {
  if (sectioned !== undefined) {
    devWarning(
      "Card",
      "`sectioned` has no effect — every Card already renders as a single s-section.",
    );
  }

  return (
    <SSection ref={ref} padding={padding} {...rest}>
      {title ? (
        <Text as="h2" variant="headingSm">
          {title}
        </Text>
      ) : null}
      {children}
    </SSection>
  );
});
