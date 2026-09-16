---
trigger: always_on
---

# Corex UI Project Rules

1. **Strictly Use Corex UI Components (No Tailwind CSS, Custom HTML, or Inline Styles)**:
   - Consuming Shopify apps do not have Tailwind CSS installed and do not support custom CSS or inline styling hacks.
   - Tailwind CSS is **strictly limited** to the playground app shell itself (e.g. playground sidebar, overview, layout shell).
   - In all UI component examples (`apps/playground/src/examples/**`) and blocks (`apps/playground/src/blocks/**`), **NEVER use Tailwind CSS classes, custom HTML tags (`<div>`, `<button>`, `<input>`, `<textarea>`, `<svg>`, `<span>`, `<p>`, `<a>`, etc.), or inline `style={{ ... }}` objects**.
   - **Always remember this rule**: You must compose layouts exclusively using `@xco-agency/corex-ui` components (`Box`, `BlockStack`, `InlineStack`, `Grid`, `Card`, `Text`, `Badge`, `Divider`, `Button`, `Icon`, `Avatar`, `Thumbnail`, `Modal`, `ProgressBar`, `Link`, `Clickable`, etc.). *(Exception: 3rd-party App/Partner logos such as in `AppIconBadge` represent external brand identities and use dedicated branded vector logos/images).*
   - Use `Box` (with its props: `padding`, `background`, `borderWidth`, `borderColor`, `borderRadius`, `inlineSize`, `maxInlineSize`, `position`, etc.), `BlockStack`, `InlineStack`, and `Grid` for all layout structures instead of raw HTML elements or inline CSS.

2. **Modular Architecture & Conventions**:
   - Types must always use `Type` as suffix (e.g., `MetricItemType`).
   - Split complex layouts into `partials/` and `examples/`.
   - Ensure all blocks are copy-pasteable or CLI-installable into any standard Shopify app without external CSS dependencies.

3. **Component Prop Verification**:
   - Never guess or assume props from Shopify Polaris or other libraries. Always inspect the exact TypeScript prop definitions in `packages/corex-ui/src/components/**` before using any `@xco-agency/corex-ui` component.

4. **Polaris Spacing Tokens**:
   - Always use modern Polaris spacing tokens (`"none"`, `"small-500"`, `"small-400"`, `"small-300"`, `"small-200"`, `"small-100"`, `"base"`, `"large-100"`, `"large-200"`, `"large-300"`, `"large-400"`, `"large-500"`) for all `gap` and `padding` props.
   - Never use legacy numeric spacing tokens (`"100"`, `"200"`, `"300"`, `"400"`, etc.).

5. **No `style` prop on `Card`**:
   - `<Card>` is composed on top of Shopify's `<s-section>` web component, meaning inline `style={{ ... }}` does not reliably penetrate or style the surface element.
   - **Never pass `style` directly to `<Card>`**.
   - If container styling (such as fixed positioning, custom borders, or wrappers) is required, wrap `<Card>` in a `<Box>` component or apply layout props to internal child components.
