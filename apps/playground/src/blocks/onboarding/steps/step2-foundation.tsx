import type { Dispatch } from "react";
import type {
  CoreToolIdType,
  OnboardingActionType,
  OnboardingStateType,
} from "../onboarding.types";
import styles from "../onboarding.module.css";
import {
  Box,
  BlockStack,
  InlineStack,
  Badge,
  Button,
  Icon,
  IconTile,
  Text,
} from "@xco-agency/corex-ui";

const CORE_ICONS: Record<CoreToolIdType, "cart" | "collection" | "chart-vertical"> = {
  "cart-drawer": "cart",
  fbt: "collection",
  analytics: "chart-vertical",
};

export type Step2FoundationPropsType = {
  state: OnboardingStateType;
  dispatch: Dispatch<OnboardingActionType>;
};

export function Step2Foundation({ state, dispatch }: Step2FoundationPropsType) {
  return (
    <Box paddingBlock="large">
      <BlockStack gap="large" alignItems="center">
        <Box inlineSize="100%" maxInlineSize="640px">
          <BlockStack gap="large" alignItems="center">
            <BlockStack gap="small-100" alignItems="center">
              <Badge tone="caution" size="large" icon="check">
                Activation complete
              </Badge>
              <Text
                variant="large"
                heading
                tooltip={
                  <>
                    <Text as="p">Core conversion features Cart Drawer</Text>
                    <Text as="p" tone="info">
                      Frequently Bought Together, and Realtime Analytics are
                      pre-configured and live out of the box.
                    </Text>
                  </>
                }
              >
                Your revenue foundation is ready
              </Text>
              <Text color="subdued">
                We&rsquo;ve already configured the essentials nothing to set up, nothing
                to break.
              </Text>
            </BlockStack>

            <BlockStack gap="small" inlineSize="100%">
              {state.coreTools.map((tool, i) => (
                <div
                  key={tool.id}
                  className={styles.staggerItem}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <Box
                    padding="small"
                    border="base"
                    borderRadius="large"
                    background="base"
                    inlineSize="100%"
                  >
                    <InlineStack
                      justifyContent="space-between"
                      alignItems="center"
                      gap="base"
                    >
                      <InlineStack gap="base" alignItems="center">
                        <IconTile tone="neutral">
                          <Icon type={CORE_ICONS[tool.id]} tone="success" />
                        </IconTile>
                        <BlockStack gap="none">
                          <Text fontWeight="semibold">{tool.name}</Text>
                          <Text color="subdued">{tool.description}</Text>
                        </BlockStack>
                      </InlineStack>
                      <Badge tone="success">Active</Badge>
                    </InlineStack>
                  </Box>
                </div>
              ))}
            </BlockStack>
            <InlineStack gap="small-200" justifyContent="space-between" inlineSize="100%">
              <Button onClick={() => dispatch({ type: "GO_BACK" })}>Back</Button>
              <Button variant="primary" onClick={() => dispatch({ type: "GO_NEXT" })}>
                Continue
              </Button>
            </InlineStack>
            <Text color="subdued">Fully customizable anytime from the Hub.</Text>
          </BlockStack>
        </Box>
      </BlockStack>
    </Box>
  );
}
