---
trigger: always_on
---

# Corex UI Project Rules

1. **No Tailwind CSS in Blocks or UI Component Examples**:
   - Consuming Shopify apps do not have Tailwind CSS installed and do not support it.
   - Tailwind CSS is **strictly limited** to the playground app shell itself (e.g. playground sidebar, overview, layout shell).
   - In all UI component examples (`apps/playground/src/examples/**`) and blocks (`apps/playground/src/blocks/**`), **NEVER use Tailwind CSS classes**.
   - Instead, compose layouts exclusively using `corex-ui` components (`Box`, `BlockStack`, `InlineStack`, `Grid`, `Card`, `Text`, `Badge`, `Divider`, `Button`, `Icon`, etc.).
   - If a layout requirement cannot be achieved with `corex-ui` primitives, use standard inline or module css styles with Polaris CSS custom properties (`var(--p-color-*)`, `var(--p-space-*)`, etc.), avoiding custom CSS unless strictly necessary.

2. **Modular Architecture & Conventions**:
   - Types must always use `Type` as suffix (e.g., `MetricItemType`).
   - Split complex layouts into `partials/` and `examples/`.
   - Ensure all blocks are copy-pasteable or CLI-installable into any standard Shopify app without external CSS dependencies.

3. **Component Prop Verification**:
   - Never guess or assume props from Shopify Polaris or other libraries. Always inspect the exact TypeScript prop definitions in `packages/corex-ui/src/components/**` before using any `@xco-agency/corex-ui` component.

4. **Polaris Spacing Tokens**:
   - Always use modern Polaris spacing tokens (`"none"`, `"small-500"`, `"small-400"`, `"small-300"`, `"small-200"`, `"small-100"`, `"base"`, `"large-100"`, `"large-200"`, `"large-300"`, `"large-400"`, `"large-500"`) for all `gap` and `padding` props.
   - Never use legacy numeric spacing tokens (`"100"`, `"200"`, `"300"`, `"400"`, etc.).
