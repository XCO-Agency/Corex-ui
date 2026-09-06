import type { Dispatch } from "react";
import type { OnboardingActionType, OnboardingStateType } from "../types";
import { CURRENCIES, SAMPLE_CART_TOTAL } from "../constants";
import Content from "~/components/ui/typography/Content";
import { IconTile } from "~/components/ui/IconTile";
import { ProgressTracker } from "~/components/ui/ProgressTracker";
function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}
export type Step3DefaultConfigurationPropsType = {
  state: OnboardingStateType;
  dispatch: Dispatch<OnboardingActionType>;
};

export function Step3DefaultConfiguration({
  state,
  dispatch,
}: Step3DefaultConfigurationPropsType) {
  const threshold = state.freeShippingThreshold;
  const remaining = Math.max(0, threshold - SAMPLE_CART_TOTAL);
  const qualifies = SAMPLE_CART_TOTAL >= threshold && threshold > 0;
  const percent =
    threshold > 0 ? Math.min(100, (SAMPLE_CART_TOTAL / threshold) * 100) : 100;

  const handleAmountChange = (value: string) => {
    const parsed = Number(value.replace(/[^0-9.]/g, ""));
    dispatch({
      type: "SET_THRESHOLD",
      amount: Number.isFinite(parsed) ? Math.max(0, parsed) : 0,
    });
  };

  return (
    <s-box paddingBlock="large">
      <s-stack direction="block" gap="large" alignItems="center">
        <s-box
          padding="large-200"
          border="base"
          borderRadius="large"
          background="base"
          inlineSize="100%"
          maxInlineSize="460px"
        >
          <s-stack direction="block" gap="large-100" alignItems="center">
            <s-stack direction="block" gap="small-100" alignItems="center">
              <IconTile borderRadius="base" size="lg">
                <s-icon type="delivery" tone="success" size="base" />
              </IconTile>
              <Content
                variant="headingMd"
                tooltip="Customers will see a dynamic progress bar in the Cart Drawer encouraging them to add more items to earn free shipping."
              >
                One quick detail
              </Content>
              <Content subdue>
                Set your free shipping threshold — we&rsquo;ll handle the rest.
              </Content>
            </s-stack>

            <s-box inlineSize="100%">
              <s-stack direction="inline" gap="small-200" alignItems="start">
                <s-box inlineSize="110px">
                  <s-select
                    label="Currency"
                    value={state.storeCurrency}
                    onChange={(e: any) =>
                      dispatch({
                        type: "SET_CURRENCY",
                        currency: (e.target as HTMLSelectElement).value,
                      })
                    }
                  >
                    {CURRENCIES.map((currency) => (
                      <s-option key={currency} value={currency}>
                        {currency}
                      </s-option>
                    ))}
                  </s-select>
                </s-box>
                <s-box inlineSize="100%">
                  <s-number-field
                    label="Free shipping threshold"
                    value={String(threshold)}
                    onInput={(e: any) =>
                      handleAmountChange((e.target as HTMLInputElement).value)
                    }
                  />
                </s-box>
              </s-stack>
            </s-box>

            <s-box
              padding="base"
              border="base"
              borderRadius="base"
              background="subdued"
              inlineSize="100%"
            >
              <s-stack direction="block" gap="small-100">
                <s-stack
                  direction="inline"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <s-text color="subdued">SAMPLE CART TOTAL</s-text>
                  <s-text type="strong">
                    {formatCurrency(SAMPLE_CART_TOTAL, state.storeCurrency)}
                  </s-text>
                </s-stack>

                <ProgressTracker
                  progress={percent}
                  size="lg"
                  tone="success"
                  trackColor="#e5e7eb"
                />

                <s-text tone="success" type="strong">
                  {qualifies
                    ? "This cart qualifies for free shipping."
                    : `Add ${formatCurrency(remaining, state.storeCurrency)} more for free shipping.`}
                </s-text>
              </s-stack>
            </s-box>
          </s-stack>
        </s-box>
        <s-stack direction="block" gap="small-200" inlineSize="100%" alignItems="center">
          <s-stack direction="inline" gap="small-200" alignItems="center">
            <s-button onClick={() => dispatch({ type: "GO_BACK" })}>Back</s-button>
            <s-button
              variant="primary"
              onClick={() => {
                dispatch({ type: "CONFIRM_THRESHOLD" });
                dispatch({ type: "GO_NEXT" });
              }}
            >
              Save &amp; continue
            </s-button>
          </s-stack>
          <s-button variant="tertiary" onClick={() => dispatch({ type: "GO_NEXT" })}>
            Skip for now — I&rsquo;ll set this later
          </s-button>
        </s-stack>
      </s-stack>
    </s-box>
  );
}
