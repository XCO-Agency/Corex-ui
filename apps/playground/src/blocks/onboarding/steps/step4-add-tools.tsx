import type { Dispatch } from "react";
import type {
  OnboardingActionType,
  OnboardingStateType,
  OptionalToolIdType,
} from "../types";
import { IconTile } from "~/components/ui/IconTile";
import Content from "~/components/ui/typography/Content";
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
  const selectedCount = state.optionalTools.filter((tool) => tool.selected).length;

  return (
    <s-box paddingBlock="large">
      <s-stack direction="block" gap="large" alignItems="center">
        <s-box inlineSize="100%" maxInlineSize="640px">
          <s-stack direction="block" gap="large-100" alignItems="center">
            <s-stack direction="block" gap="small-100" alignItems="center">
              <Content
                variant="headingMd"
                tooltip="Enable optional revenue drivers like Volume Discounts, Post-Purchase Upsells, and Checkout Bumps with one click."
              >
                Add more revenue tools
              </Content>
              <Content subdue>
                Optional, high-impact modules with pre-tuned presets. Nothing here is
                required to launch.
              </Content>
            </s-stack>

            <s-grid gridTemplateColumns="repeat(2, minmax(260px, 1fr))" gap="base">
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
                    <s-box
                      padding="base"
                      border="base"
                      borderRadius="large"
                      background="base"
                      inlineSize="100%"
                    >
                      <s-stack direction="block" gap="small-100">
                        <s-stack
                          direction="inline"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <IconTile tone={tool.selected ? "success" : "subdued"}>
                            <s-icon
                              type={OPTIONAL_ICONS[tool.id]}
                              tone="success"
                              size="base"
                            />
                          </IconTile>
                          <s-switch
                            checked={tool.selected}
                            onChange={() =>
                              dispatch({ type: "TOGGLE_OPTIONAL_TOOL", id: tool.id })
                            }
                          />
                        </s-stack>
                        <s-heading>{tool.name}</s-heading>
                        <s-paragraph color="subdued">{tool.description}</s-paragraph>
                        <s-stack
                          justifyContent="space-between"
                          direction="inline"
                          alignItems="center"
                          gap="base"
                          inlineSize="100%"
                        >
                          <s-badge tone="neutral">{tool.impact}</s-badge>
                          <s-button disabled={!tool.selected} commandFor={tool.id}>
                            {activePreset ? activePreset.label : "Configure with presets"}
                          </s-button>
                        </s-stack>
                      </s-stack>
                    </s-box>

                    <s-modal id={tool.id} heading={`Configure ${tool.name}`}>
                      <s-box padding="base">
                        <s-stack direction="block" gap="base">
                          <s-paragraph color="subdued">{tool.description}</s-paragraph>

                          <s-stack direction="block" gap="small-200">
                            {tool.presets.map((preset) => {
                              const isSelected =
                                (tool.selectedPresetId || tool.presets[0]?.id) ===
                                preset.id;
                              return (
                                <div
                                  key={preset.id}
                                  onClick={() => {
                                    dispatch({
                                      type: "SELECT_PRESET",
                                      id: tool.id,
                                      presetId: preset.id,
                                    });
                                    dispatch({
                                      type: "CONFIRM_TOOL_CONFIG",
                                      id: tool.id,
                                    });
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <s-box
                                    padding="base"
                                    border="base"
                                    borderRadius="large"
                                    background={isSelected ? "subdued" : "base"}
                                  >
                                    <s-stack
                                      direction="inline"
                                      gap="base"
                                      alignItems="center"
                                      justifyContent="space-between"
                                    >
                                      <s-stack direction="block" gap="none">
                                        <s-heading>{preset.label}</s-heading>
                                        <s-paragraph color="subdued">
                                          {preset.description}
                                        </s-paragraph>
                                      </s-stack>
                                      {isSelected && (
                                        <s-badge tone="success">Selected</s-badge>
                                      )}
                                    </s-stack>
                                  </s-box>
                                </div>
                              );
                            })}
                          </s-stack>

                          <s-stack
                            direction="inline"
                            gap="small-200"
                            justifyContent="end"
                          >
                            <s-button
                              variant="primary"
                              commandFor={tool.id}
                              command="--hide"
                            >
                              Done
                            </s-button>
                          </s-stack>
                        </s-stack>
                      </s-box>
                    </s-modal>
                  </div>
                );
              })}
            </s-grid>

            <s-box paddingBlockStart="small" inlineSize="100%">
              <s-stack
                justifyContent="space-between"
                direction="inline"
                alignItems="center"
                gap="base"
                inlineSize="100%"
              >
                <s-paragraph color="subdued">
                  {selectedCount === 0
                    ? "No tools selected yet"
                    : `${selectedCount} tool${selectedCount > 1 ? "s" : ""} selected`}
                </s-paragraph>

                <s-stack direction="inline" gap="small-200" alignItems="center">
                  <s-button onClick={() => dispatch({ type: "GO_BACK" })}>Back</s-button>
                  <s-button
                    variant="primary"
                    onClick={() => dispatch({ type: "GO_NEXT" })}
                  >
                    {selectedCount === 0 ? "Skip for now" : `Save & Continue`}
                  </s-button>
                </s-stack>
              </s-stack>
            </s-box>

            <Content subdue>
              *Illustrative benchmarks — your own Analytics will show real lift once live.
            </Content>
          </s-stack>
        </s-box>
      </s-stack>
    </s-box>
  );
}
