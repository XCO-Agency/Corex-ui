import { useState, type Dispatch } from "react";
import type {
  OnboardingActionType,
  OnboardingStateType,
  OptionalToolIdType,
} from "../onboarding.types";
import {
  Box,
  BlockStack,
  InlineStack,
  Grid,
  Badge,
  Button,
  Clickable,
  Icon,
  IconTile,
  Modal,
  Switch,
  Text,
} from "@xco-agency/corex-ui";
import styles from "../onboarding.module.css";

const OPTIONAL_ICONS: Record<
  OptionalToolIdType,
  "discount" | "rocket" | "gift-card" | "bolt"
> = {
  "volume-discounts": "discount",
  "post-purchase-upsell": "rocket",
  "product-addons": "gift-card",
  "checkout-bumps": "bolt",
};

export type Step4AddToolsPropsType = {
  state: OnboardingStateType;
  dispatch: Dispatch<OnboardingActionType>;
};

export function Step4AddTools({ state, dispatch }: Step4AddToolsPropsType) {
  const [activeModalToolId, setActiveModalToolId] = useState<OptionalToolIdType | null>(
    null,
  );

  const selectedCount = state.optionalTools.filter((tool) => tool.selected).length;
  const activeTool = state.optionalTools.find((t) => t.id === activeModalToolId);

  return (
    <Box paddingBlock="large">
      <BlockStack gap="large" alignItems="center">
        <Box inlineSize="100%" maxInlineSize="640px">
          <BlockStack gap="large-100" alignItems="center">
            <BlockStack gap="small-100" alignItems="center">
              <Text
                heading
                variant="large"

                tooltip="Enable optional revenue drivers like Volume Discounts, Post-Purchase Upsells, and Checkout Bumps with one click."
              >
                Add more revenue tools
              </Text>
              <Text color="subdued">
                Optional, high-impact modules with pre-tuned presets. Nothing here is
                required to launch.
              </Text>
            </BlockStack>

            <Grid gridTemplateColumns="repeat(2, minmax(260px, 1fr))" gap="base">
              {state.optionalTools.map((tool, i) => {
                const activePreset = tool.presets.find(
                  (p) => p.id === tool.selectedPresetId,
                );
                return (
                  <div
                    key={tool.id}
                    className={styles.staggerItem}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <Box
                      padding="base"
                      border="base"
                      borderRadius="large"
                      background="base"
                      inlineSize="100%"
                    >
                      <BlockStack gap="small-100">
                        <InlineStack justifyContent="space-between" alignItems="center">
                          <IconTile
                            size="sm"
                            tone={tool.selected ? "success" : "subdued"}
                          >
                            <Icon
                              type={OPTIONAL_ICONS[tool.id]}
                              tone={tool.selected ? "success" : "neutral"}
                            />
                          </IconTile>
                          <Switch
                            checked={tool.selected}
                            onChange={() =>
                              dispatch({
                                type: "TOGGLE_OPTIONAL_TOOL",
                                id: tool.id,
                              })
                            }
                          />
                        </InlineStack>
                        <Text heading>{tool.name}</Text>
                        <Text color="subdued">{tool.description}</Text>
                        <InlineStack
                          justifyContent="space-between"
                          alignItems="center"
                          gap="base"
                          style={{ width: "100%" }}
                        >
                          <Badge tone="neutral">{tool.impact}</Badge>
                          <Button
                            disabled={!tool.selected}
                            onClick={() => setActiveModalToolId(tool.id)}
                          >
                            {activePreset ? activePreset.label : "Configure with presets"}
                          </Button>
                        </InlineStack>
                      </BlockStack>
                    </Box>
                  </div>
                );
              })}
            </Grid>

            {activeTool && (
              <Modal
                open={Boolean(activeModalToolId)}
                onClose={() => setActiveModalToolId(null)}
                title={`Configure ${activeTool.name}`}
                primaryAction={{
                  content: "Done",
                  onAction: () => setActiveModalToolId(null),
                }}
              >
                <Box padding="base">
                  <BlockStack gap="base">
                    <Text color="subdued">{activeTool.description}</Text>

                    <BlockStack gap="small-200">
                      {activeTool.presets.map((preset) => {
                        const isSelected =
                          (activeTool.selectedPresetId || activeTool.presets[0]?.id) ===
                          preset.id;
                        return (
                          <Clickable
                            key={preset.id}
                            onClick={() => {
                              dispatch({
                                type: "SELECT_PRESET",
                                id: activeTool.id,
                                presetId: preset.id,
                              });
                              dispatch({
                                type: "CONFIRM_TOOL_CONFIG",
                                id: activeTool.id,
                              });
                            }}
                            borderRadius="large"
                          >
                            <Box
                              padding="base"
                              border="base"
                              borderRadius="large"
                              background={isSelected ? "subdued" : "base"}
                            >
                              <InlineStack
                                gap="base"
                                alignItems="center"
                                justifyContent="space-between"
                              >
                                <BlockStack gap="none">
                                  <Text heading>{preset.label}</Text>
                                  <Text color="subdued">{preset.description}</Text>
                                </BlockStack>
                                {isSelected && <Badge tone="success">Selected</Badge>}
                              </InlineStack>
                            </Box>
                          </Clickable>
                        );
                      })}
                    </BlockStack>
                  </BlockStack>
                </Box>
              </Modal>
            )}

            <Box paddingBlockStart="small" inlineSize="100%">
              <InlineStack
                justifyContent="space-between"
                alignItems="center"
                gap="base"
                style={{ width: "100%" }}
              >
                <Text color="subdued">
                  {selectedCount === 0
                    ? "No tools selected yet"
                    : `${selectedCount} tool${selectedCount > 1 ? "s" : ""} selected`}
                </Text>

                <InlineStack gap="small-200" alignItems="center">
                  <Button onClick={() => dispatch({ type: "GO_BACK" })}>Back</Button>
                  <Button variant="primary" onClick={() => dispatch({ type: "GO_NEXT" })}>
                    {selectedCount === 0 ? "Skip for now" : "Save & Continue"}
                  </Button>
                </InlineStack>
              </InlineStack>
            </Box>

            <Text color="subdued">
              *Illustrative benchmarks — your own Analytics will show real lift once live.
            </Text>
          </BlockStack>
        </Box>
      </BlockStack>
    </Box>
  );
}
