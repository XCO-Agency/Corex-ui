# Project Rules for Corex UI

- **No Tailwind CSS in Blocks or UI Examples**: Consuming applications do not have Tailwind CSS and do not support it. Tailwind CSS exists ONLY within the internal playground app shell, never in blocks (`apps/playground/src/blocks/**`) or UI component examples (`apps/playground/src/examples/**`).
- **Use Corex UI Components**: Always compose layouts using `@xco-agency/corex-ui` components (`Box`, `BlockStack`, `InlineStack`, `Grid`, `Card`, `Text`, `Badge`, `Divider`, `DatePicker`, `MetricCard`, etc.). When specific layout tweaks are needed, use inline styles with Polaris CSS tokens (`var(--p-color-*)`, etc.), avoiding custom CSS/modules.
- **Naming Conventions**: Always use `Type` as suffix for type definitions (e.g., `MetricItemType`).
- **Component Prop Verification**: Never guess or assume props from Shopify Polaris or other libraries. Always inspect the exact TypeScript prop definitions in `packages/corex-ui/src/components/**` before using any `@xco-agency/corex-ui` component.
- **Polaris Spacing Tokens**: Always use modern Polaris spacing tokens (`"none"`, `"small-500"`...`"small-100"`, `"base"`, `"large-100"`...`"large-500"`) for all `gap` and `padding` props. Never use legacy numeric tokens (`"100"`, `"200"`, `"300"`, `"400"`).
