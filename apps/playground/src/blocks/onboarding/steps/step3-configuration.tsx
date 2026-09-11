import type { Dispatch } from "react";
import type { OnboardingActionType, OnboardingStateType } from "../onboarding.types";
import { CURRENCIES, SAMPLE_CART_TOTAL } from "../constants";
import {
  Box,
  BlockStack,
  InlineStack,
  Button,
  Icon,
  IconTile,
  ProgressBar,
  Select,
  Text,
  TextField,
} from "@xco-agency/corex-ui";

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

export type Step3ConfigurationPropsType = {
  state: OnboardingStateType;
  dispatch: Dispatch<OnboardingActionType>;
};

export function Step3Configuration({ state, dispatch }: Step3ConfigurationPropsType) {
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
    <Box paddingBlock="large">
      <BlockStack gap="large" alignItems="center" style={{ width: "100%" }}>
        <BlockStack gap="small-300" alignItems="center">
          <IconTile tone="caution">
            <Icon type="delivery" tone="caution" />
          </IconTile>
          <Text
            heading
            variant="large"
            tooltip="Customers will see a dynamic progress bar in the Cart Drawer encouraging them to add more items to earn free shipping."
          >
            One quick detail
          </Text>
          <Text color="subdued">
            Set your free shipping threshold — we&rsquo;ll handle the rest.
          </Text>
        </BlockStack>
        <Box
          padding="large-200"
          border="base"
          borderRadius="large"
          inlineSize="100%"
          background="base"
        >
          <BlockStack gap="large-100" alignItems="center" style={{ width: "100%" }}>
            <Box inlineSize="100%">
              <InlineStack gap="small-200" alignItems="start">
                <Box inlineSize="120px">
                  <Select
                    label="Currency"
                    value={state.storeCurrency}
                    options={CURRENCIES}
                    onChange={(currency) =>
                      dispatch({
                        type: "SET_CURRENCY",
                        currency,
                      })
                    }
                  />
                </Box>
                <Box inlineSize="100%">
                  <TextField
                    label="Free shipping threshold"
                    type="number"
                    value={String(threshold)}
                    onChange={handleAmountChange}
                    autoComplete="off"
                  />
                </Box>
              </InlineStack>
            </Box>

            <Box
              padding="base"
              border="base"
              borderRadius="base"
              background="subdued"
              inlineSize="100%"
            >
              <BlockStack gap="small-100">
                <InlineStack justifyContent="space-between" alignItems="center">
                  <Text color="subdued">SAMPLE CART TOTAL</Text>
                  <Text heading>
                    {formatCurrency(SAMPLE_CART_TOTAL, state.storeCurrency)}
                  </Text>
                </InlineStack>

                <ProgressBar progress={percent} size="base" tone="neutral" />

                <Text tone="success" heading>
                  {qualifies
                    ? "This cart qualifies for free shipping."
                    : `Add ${formatCurrency(remaining, state.storeCurrency)} more for free shipping.`}
                </Text>
              </BlockStack>
            </Box>
          </BlockStack>
        </Box>
        <BlockStack gap="small-200" style={{ width: "100%" }} alignItems="center">
          <InlineStack gap="small-200" style={{ width: "100%" }} justifyContent="space-between">
            <Button onClick={() => dispatch({ type: "GO_BACK" })}>Back</Button>
            <Button
              variant="primary"
              onClick={() => {
                dispatch({ type: "CONFIRM_THRESHOLD" });
                dispatch({ type: "GO_NEXT" });
              }}
            >
              Save &amp; continue
            </Button>
          </InlineStack>
          <Button variant="tertiary" onClick={() => dispatch({ type: "GO_NEXT" })}>
            Skip for now — I&rsquo;ll set this later
          </Button>
        </BlockStack>
      </BlockStack>
    </Box>
  );
}
