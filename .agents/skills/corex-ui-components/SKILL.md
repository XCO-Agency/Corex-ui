---
name: corex-ui-components
description: >-
  Comprehensive reference of all available UI components in @xco-agency/corex-ui,
  their modern props, types, subcomponents, and rules. Legacy and deprecated props
  are strictly excluded.
---

# Corex UI Components Reference

Complete reference of all **77 UI components** in `@xco-agency/corex-ui` and their **modern props**.

> [!IMPORTANT]
> **Strict Corex UI Guidelines**:
>
> 1. **No Custom HTML or Inline Styles**: Never use raw HTML (`<div>`, `<button>`, `<span>`, `<p>`, `<a>`, `<svg>`, `<input>`, etc.) or Tailwind CSS in blocks or component examples. Compose UI exclusively using `@xco-agency/corex-ui` components.
> 2. **Polaris Spacing Tokens Only**: Use modern Polaris spacing tokens (`"none"`, `"small-500"`...`"small-100"`, `"small"`, `"base"`, `"large"`, `"large-100"`...`"large-500"`) for all `gap` and `padding` props. **Never use legacy numeric tokens** (`"100"`, `"200"`, `"300"`, `"400"`, etc.).
> 3. **No `style` prop on `<Card>`**: `<Card>` renders the Shopify `<s-section>` web component; inline `style` does not penetrate. If custom styling, fixed dimensions, or positioning is needed, wrap `<Card>` in a `<Box>`.
> 4. **No Legacy or Deprecated Props**: Every component in this reference documents ONLY active, modern props. Deprecated props (such as `align`/`blockAlign` on stacks, `primary`/`destructive`/`url` on `Button`, `title`/`status` on `Banner`, etc.) are explicitly forbidden.

---

## Modern Polaris Spacing Tokens

When specifying `gap`, `padding`, `rowGap`, or `columnGap`, use **exclusively** these modern Polaris tokens:

| Token         | CSS Pixel Value | Notes                          |
| :------------ | :-------------- | :----------------------------- |
| `"none"`      | 0px             | Zero spacing                   |
| `"small-500"` | 1px             | Micro separation               |
| `"small-400"` | 2px             | Hairline gap                   |
| `"small-300"` | 4px             | Tight elements / icon pairings |
| `"small-200"` | 6px             | Dense badges / chips           |
| `"small-100"` | 8px             | Standard compact spacing       |
| `"small"`     | 8px             | Alias for `small-100`          |
| `"base"`      | 16px            | **Default layout spacing**     |
| `"large-100"` | 20px            | Section content                |
| `"large-200"` | 24px            | Card content separation        |
| `"large-300"` | 32px            | Major section gap              |
| `"large-400"` | 40px            | Page block separation          |
| `"large-500"` | 48px            | Outer page gutter              |

---

## Critical Deprecation Replacements

| Component           | Deprecated Legacy Prop                                                                                                                                                            | Modern Replacement                                                                                                                                   |
| :------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BlockStack`        | `align`                                                                                                                                                                           | `alignItems`                                                                                                                                         |
| `BlockStack`        | `inlineAlign`                                                                                                                                                                     | `justifyContent`                                                                                                                                     |
| `InlineStack`       | `align`                                                                                                                                                                           | `justifyContent`                                                                                                                                     |
| `InlineStack`       | `blockAlign`                                                                                                                                                                      | `alignItems`                                                                                                                                         |
| `Button`            | `primary`                                                                                                                                                                         | `variant="primary"`                                                                                                                                  |
| `Button`            | `destructive`                                                                                                                                                                     | `tone="critical"`                                                                                                                                    |
| `Button`            | `plain`                                                                                                                                                                           | `variant="plain"`                                                                                                                                    |
| `Button`            | `outline`                                                                                                                                                                         | `variant="secondary"`                                                                                                                                |
| `Button`            | `fullWidth`                                                                                                                                                                       | `inlineSize="fill"`                                                                                                                                  |
| `Button`            | `url`                                                                                                                                                                             | `href`                                                                                                                                               |
| `Button`            | `external`                                                                                                                                                                        | `target="_blank"`                                                                                                                                    |
| `Banner`            | `title`                                                                                                                                                                           | `heading`                                                                                                                                            |
| `Banner`            | `status`                                                                                                                                                                          | `tone`                                                                                                                                               |
| `Badge`             | `status`                                                                                                                                                                          | `tone`                                                                                                                                               |
| `Card`              | `title`                                                                                                                                                                           | `heading`                                                                                                                                            |
| `Card`              | `style`                                                                                                                                                                           | Wrap `<Card>` in `<Box ...>`                                                                                                                         |
| `Page`              | `title`                                                                                                                                                                           | `heading`                                                                                                                                            |
| `Page`              | `fullWidth`                                                                                                                                                                       | `inlineSize="large"`                                                                                                                                 |
| `Page`              | `narrowWidth`                                                                                                                                                                     | `inlineSize="small"`                                                                                                                                 |
| `Page`              | `backAction`                                                                                                                                                                      | `breadcrumbActions`                                                                                                                                  |
| `Table`             | `Table.Header`                                                                                                                                                                    | `Table.HeaderCell`                                                                                                                                   |
| `Tag`               | `url`                                                                                                                                                                             | Wrap in `<Link>`                                                                                                                                     |
| `Layout.Section`    | `fullWidth` / `oneHalf` / `oneThird`                                                                                                                                              | `variant="fullWidth"` / `"oneHalf"` / `"oneThird"`                                                                                                   |
| `Layout.Section`    | `oneFourth` / `secondary`                                                                                                                                                         | `variant="oneFourth"` / `variant="secondary"`                                                                                                        |
| `Box`               | `width` / `minWidth` / `maxWidth`                                                                                                                                                 | `inlineSize` / `minInlineSize` / `maxInlineSize`                                                                                                     |
| `Box`               | `height` / `minHeight` / `maxHeight`                                                                                                                                              | `blockSize` / `minBlockSize` / `maxBlockSize`                                                                                                        |
| `Box`               | `as`, `color`, `shadow`, `position`, `inset*`, `zIndex`, `opacity`, `outline*`, `overflowX`/`overflowY`, per-side `border*Width`/`border*Radius`, `printHidden`, `visuallyHidden` | Not supported by `<s-box>`. Use the modern `Box` props (`border`, `borderRadius`, `overflow`, `accessibilityVisibility`) or compose other components |
| `Button`            | `monochrome`, `style`                                                                                                                                                             | Not supported; remove                                                                                                                                |
| `ButtonGroup`       | `variant="segmented"`                                                                                                                                                             | `gap="none"`                                                                                                                                         |
| `Card`              | `sectioned`                                                                                                                                                                       | Remove; `Card` always pads its content                                                                                                               |
| `ActionList`        | `activator`                                                                                                                                                                       | `children` (the trigger)                                                                                                                             |
| `ActionList` item   | `url`                                                                                                                                                                             | `href`                                                                                                                                               |
| `DatePicker`        | `activator`                                                                                                                                                                       | `children` render function                                                                                                                           |
| `TextField`         | `requiredIndicator`                                                                                                                                                               | `required`                                                                                                                                           |
| `Link`              | `monochrome` / `removeUnderline`                                                                                                                                                  | Not supported; remove                                                                                                                                |
| `List`              | `gap`                                                                                                                                                                             | Remove; native lists own their spacing                                                                                                               |
| `Page`              | `subtitle`, `titleHidden`, `titleMetadata`, `additionalMetadata`, `actionGroups`, `compactTitle`, ...                                                                             | `accessory` / page body content / `secondaryActions`                                                                                                 |
| `Pagination`        | `accessibilityLabel`                                                                                                                                                              | Remove                                                                                                                                               |
| `ResourceList` item | `persistActions` / `shortcutActions` / `verticalAlignment`                                                                                                                        | Pass row actions in `children`                                                                                                                       |
| `SkeletonPage`      | `narrowWidth` / `fullWidth`                                                                                                                                                       | Wrap in a `Page` with `inlineSize`                                                                                                                   |
| `Toast`             | `action`                                                                                                                                                                          | Remove; App Bridge toasts have no action                                                                                                             |
| `Combobox`          | `allowMultiple` / `active` / `activator`                                                                                                                                          | `multiple` / `open` / `Combobox.Input` (removed props)                                                                                               |

---

## Component Directory by Category

### Layout & Structure

| Component                             | Description                                                                                                            | Subcomponents      |
| :------------------------------------ | :--------------------------------------------------------------------------------------------------------------------- | :----------------- |
| [**Box**](#box)                       | Low-level layout container wrapping Shopify's `<s-box>`. Provides padding, borders, background colors, and dimensions. | —                  |
| [**BlockStack**](#blockstack)         | Vertical flex layout container. Automatically stacks children with uniform gaps along the block axis.                  | —                  |
| [**InlineStack**](#inlinestack)       | Horizontal flex layout container. Distributes children along the inline axis with uniform gap.                         | —                  |
| [**Grid**](#grid)                     | CSS grid container wrapping `<s-grid>`. Distributes child `<Grid.Item>` components.                                    | `Grid.Item`        |
| [**InlineGrid**](#inlinegrid)         | Two-dimensional layout grid for responsive column arrangements.                                                        | —                  |
| [**Layout**](#layout)                 | Legacy page layout structure containing `<Layout.Section>` partitions.                                                 | `Layout.Section`   |
| [**FormLayout**](#formlayout)         | Standard form layout container providing consistent spacing between inputs and input groups.                           | `FormLayout.Group` |
| [**TextContainer**](#textcontainer)   | Typography container providing consistent vertical flow and paragraph margins.                                         | —                  |
| [**QueryContainer**](#querycontainer) | Container query wrapper component enabling responsive styling based on container dimensions.                           | —                  |

### Typography & Content

| Component                               | Description                                                                                          | Subcomponents |
| :-------------------------------------- | :--------------------------------------------------------------------------------------------------- | :------------ |
| [**Text**](#text)                       | Primary typography component wrapping `<s-text>`. Provides variants, tones, weights, and truncation. | —             |
| [**Paragraph**](#paragraph)             | Standard block paragraph typography wrapping `<s-paragraph>`.                                        | —             |
| [**InlineCode**](#inlinecode)           | Inline monospace code snippet container.                                                             | —             |
| [**DescriptionList**](#descriptionlist) | Definition list mapping terms to descriptions.                                                       | —             |
| [**List**](#list)                       | Bullet or numbered list wrapper around `<s-unordered-list>` / `<s-ordered-list>`.                    | `List.Item`   |

### Buttons & Actions

| Component                       | Description                                                                                                   | Subcomponents |
| :------------------------------ | :------------------------------------------------------------------------------------------------------------ | :------------ |
| [**Button**](#button)           | Standard interactive button wrapping `<s-button>`. Supports primary, secondary, tertiary, and plain variants. | —             |
| [**ButtonGroup**](#buttongroup) | Groups related `<Button>` components horizontally or as segmented controls.                                   | —             |
| [**Clickable**](#clickable)     | Accessible interactive wrapper wrapping `<s-clickable>`. Allows any content to act as a button or link.       | —             |
| [**Link**](#link)               | Interactive link wrapper around `<s-link>`. Supports navigation and external targets.                         | —             |

### Data Display & Surfaces

| Component                         | Description                                                                                                                                              | Subcomponents                                                                                                                 |
| :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------- |
| [**Card**](#card)                 | Content surface section wrapping `<s-section>`. Note: Never pass `style` directly to `<Card>`.                                                           | —                                                                                                                             |
| [**Table**](#table)               | Native data table wrapping `<s-table>`. Composed using subcomponents `Table.HeaderRow`, `Table.HeaderCell`, `Table.Body`, `Table.Row`, and `Table.Cell`. | `Table.HeaderRow`, `Table.HeaderCell`, `Table.Body`, `Table.Row`, `Table.Cell`, `Table.SubRowConnector`, `Table.ExpandButton` |
| [**IndexTable**](#indextable)     | Feature-rich resource table supporting bulk actions, row selection, pagination, and sorting.                                                             | `IndexTable.Row`, `IndexTable.Cell`                                                                                           |
| [**ResourceList**](#resourcelist) | Vertical list of merchant domain objects/resources with consistent layout and empty states.                                                              | —                                                                                                                             |
| [**MetricCard**](#metriccard)     | KPI and analytics metric card with integrated sparkline visualization and badge indicators.                                                              | —                                                                                                                             |
| [**Badge**](#badge)               | Compact status indicator badge wrapping `<s-badge>`.                                                                                                     | —                                                                                                                             |
| [**Tag**](#tag)                   | Removable chip/tag wrapping `<s-chip>`.                                                                                                                  | —                                                                                                                             |

### Forms & Inputs

| Component                           | Description                                                                               | Subcomponents                                                                            |
| :---------------------------------- | :---------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------- |
| [**TextField**](#textfield)         | Single-line or multiline text input wrapping `<s-text-field>` and `<s-text-area>`.        | —                                                                                        |
| [**SearchField**](#searchfield)     | Specialized search field input wrapping `<s-search-field>` with built-in clear button.    | —                                                                                        |
| [**NumberField**](#numberfield)     | Numeric input wrapping `<s-number-field>` with min/max, step, and decimal handling.       | —                                                                                        |
| [**EmailField**](#emailfield)       | Email input wrapping `<s-email-field>` with built-in email keyboard and validation.       | —                                                                                        |
| [**PasswordField**](#passwordfield) | Password input wrapping `<s-password-field>` with toggleable visibility.                  | —                                                                                        |
| [**UrlField**](#urlfield)           | URL input wrapping `<s-url-field>` with URL-specific keyboard and validation.             | —                                                                                        |
| [**DateField**](#datefield)         | Single date field input wrapping `<s-date-field>`.                                        | —                                                                                        |
| [**DatePicker**](#datepicker)       | Calendar date picker supporting preset ranges, single dates, and date ranges.             | —                                                                                        |
| [**MoneyField**](#moneyfield)       | Currency and monetary amount input wrapping `<s-money-field>` with currency code support. | —                                                                                        |
| [**ColorField**](#colorfield)       | Color picker input wrapping `<s-color-field>` with optional alpha channel.                | —                                                                                        |
| [**Select**](#select)               | Dropdown select control wrapping `<s-select>`.                                            | —                                                                                        |
| [**Checkbox**](#checkbox)           | Binary or indeterminate checkbox wrapping `<s-checkbox>`.                                 | —                                                                                        |
| [**Switch**](#switch)               | Toggle switch control wrapping `<s-switch>`.                                              | —                                                                                        |
| [**ChoiceList**](#choicelist)       | Radio button or checkbox list group allowing single or multiple selections.               | —                                                                                        |
| [**RangeSlider**](#rangeslider)     | Slider input for selecting values within a range.                                         | —                                                                                        |
| [**DropZone**](#dropzone)           | File drag-and-drop zone wrapping `<s-drop-zone>`.                                         | —                                                                                        |
| [**Combobox**](#combobox)           | Accessible autocomplete and combobox popover control.                                     | `Combobox.Input`, `Combobox.Content`, `Combobox.List`, `Combobox.Item`, `Combobox.Empty` |
| [**Autocomplete**](#autocomplete)   | High-level single-selection autocomplete input with debounced querying.                   | —                                                                                        |

### Filtering & Search

| Component                         | Description                                                                                       | Subcomponents                                                                                                                                                                                                                                           |
| :-------------------------------- | :------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [**IndexFilters**](#indexfilters) | Unified search, filtering pills, saved views, and column selector matching Polaris table headers. | `IndexFilters.SearchField`, `IndexFilters.Actions`, `IndexFilters.ViewOptions`, `IndexFilters.ViewOptionsSort`, `IndexFilters.ViewOptionsToggles`, `IndexFilters.ViewOptionsColumns`, `IndexFilters.ViewVisibleActiveFilter`, `IndexFilters.SaveAction` |

### Feedback & Indicators

| Component                         | Description                                                              | Subcomponents |
| :-------------------------------- | :----------------------------------------------------------------------- | :------------ |
| [**Banner**](#banner)             | Callout banner for system messages and alerts wrapping `<s-banner>`.     | —             |
| [**ProgressBar**](#progressbar)   | Visual progress indicator wrapping `<s-progress>`.                       | —             |
| [**Spinner**](#spinner)           | Loading spinner wrapping `<s-spinner>`.                                  | —             |
| [**InlineError**](#inlineerror)   | Inline validation error message display with alert icon.                 | —             |
| [**Toast**](#toast)               | Transient toast notification anchored via App Bridge.                    | —             |
| [**Skeleton**](#skeleton)         | Skeleton placeholder line or box for loading state.                      | —             |
| [**SkeletonPage**](#skeletonpage) | Skeleton page layout placeholder with title and content skeleton blocks. | —             |

### Media & Visual Elements

| Component                     | Description                                                                                          | Subcomponents      |
| :---------------------------- | :--------------------------------------------------------------------------------------------------- | :----------------- |
| [**Icon**](#icon)             | Polaris icon glyph wrapping `<s-icon>`.                                                              | —                  |
| [**IconTile**](#icontile)     | Rounded square tile with tinted background and centered icon.                                        | —                  |
| [**Avatar**](#avatar)         | Visual avatar icon or image wrapping `<s-avatar>`.                                                   | —                  |
| [**Thumbnail**](#thumbnail)   | Product or media image thumbnail wrapping `<s-thumbnail>`.                                           | —                  |
| [**Image**](#image)           | Responsive image wrapper around `<s-image>`.                                                         | —                  |
| [**Selectable**](#selectable) | Toned selection outline around a card or any element; standalone toggle or radio/multi-select group. | `Selectable.Group` |
| [**Divider**](#divider)       | Visual separating line wrapping `<s-divider>`.                                                       | —                  |

### Overlays & Navigation

| Component                       | Description                                                                                                        | Subcomponents                                                                                         |
| :------------------------------ | :----------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| [**Page**](#page)               | Top-level page layout container wrapping `<s-page>`. Houses header, breadcrumbs, actions, aside, and page content. | —                                                                                                     |
| [**Tabs**](#tabs)               | Tabbed navigation bar supporting both standard tabs and compact index-filter view selectors.                       | —                                                                                                     |
| [**Pagination**](#pagination)   | Pagination navigation buttons for traversing records.                                                              | —                                                                                                     |
| [**Modal**](#modal)             | Dialog modal overlay wrapping `<s-modal>` or `<ui-modal>`.                                                         | —                                                                                                     |
| [**Popover**](#popover)         | Contextual popover overlay anchored to a trigger element.                                                          | `Popover.Trigger`, `Popover.Content`                                                                  |
| [**FlexPopover**](#flexpopover) | Custom floating popover with explicit positioning, anchor refs, and boundary management.                           | —                                                                                                     |
| [**Floating**](#floating)       | Floating portal layer with collapse and expanding capabilities.                                                    | —                                                                                                     |
| [**Tooltip**](#tooltip)         | Lightweight popup tooltip wrapping `<s-tooltip>`.                                                                  | —                                                                                                     |
| [**Menu**](#menu)               | Menu overlay wrapping `<s-menu>` containing action list items.                                                     | —                                                                                                     |
| [**Navigation**](#navigation)   | Sidebar navigation component with hierarchical sections, items, and search.                                        | `Navigation.Section`, `Navigation.Item`, `Navigation.Label`, `Navigation.Search`, `Navigation.Footer` |
| [**Collapsible**](#collapsible) | Smoothly animated expand/collapse container.                                                                       | —                                                                                                     |
| [**Transition**](#transition)   | Animated transition wrapper for enter/exit animations.                                                             | —                                                                                                     |
| [**EmptyState**](#emptystate)   | Prominent placeholder UI for empty screens or zero search results.                                                 | —                                                                                                     |
| [**ActionList**](#actionlist)   | Action menu list of actions and choices with integrated Popover overlay.                                           | —                                                                                                     |

### App Bridge Chrome

| Component                   | Description                                                                       | Subcomponents |
| :-------------------------- | :-------------------------------------------------------------------------------- | :------------ |
| [**AppWindow**](#appwindow) | App Bridge window container wrapping `<s-app-window>` for modal or iframe shells. | —             |
| [**AppNav**](#appnav)       | App Bridge top-level navigation container wrapping `<s-app-nav>`.                 | —             |
| [**SaveBar**](#savebar)     | Shopify App Bridge sticky contextual save bar wrapping `<ui-save-bar>`.           | —             |
| [**TitleBar**](#titlebar)   | Shopify App Bridge modal or page title bar wrapping `<ui-title-bar>`.             | —             |

---

## Component API & Props Reference

### ActionList

Action menu list of actions and choices with an integrated Popover overlay. Automatically wraps its trigger (`children`, or a default 3-dots `<Button variant="tertiary" icon="menu-horizontal" />`) and content in a Popover. Clicking any action item automatically dismisses the popover.

```tsx
import { ActionList, Button } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop       | Type                                       | Description                                                                                                           |
| :--------- | :----------------------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| `children` | `ReactNode &#124; undefined`               | The trigger element for the Popover. Defaults to `<Button variant="tertiary" icon="menu-horizontal" />` when omitted. |
| `items`    | `ActionListItemType[] &#124; undefined`    | Array of action items to display.                                                                                     |
| `sections` | `ActionListSectionType[] &#124; undefined` | Array of grouped action sections, each with an optional `title` and `items`.                                          |
| `id`       | `string &#124; undefined`                  | Optional ID for the list container.                                                                                   |

#### Item Fields (`ActionListItemType`)

| Field         | Type                                              | Description                                                            |
| :------------ | :------------------------------------------------ | :--------------------------------------------------------------------- |
| `content`     | `ReactNode`                                       | Action label or title.                                                 |
| `onAction`    | `(() => void) &#124; undefined`                   | Callback when clicked. Automatically closes the popover.               |
| `href`        | `string &#124; undefined`                         | Link URL. Renders the item as a real anchor link.                      |
| `icon`        | `IconType &#124; IconSourceType &#124; undefined` | Polaris icon name string (e.g. `"edit"`, `"delete"`) or SVG component. |
| `destructive` | `boolean &#124; undefined`                        | Critical red styling on label and icon.                                |
| `disabled`    | `boolean &#124; undefined`                        | Disables the item.                                                     |
| `helpText`    | `ReactNode &#124; undefined`                      | Subdued description beneath the label.                                 |
| `active`      | `boolean &#124; undefined`                        | Subdued background state indicating current selection.                 |
| `prefix`      | `ReactNode &#124; undefined`                      | Element displayed before icon/label.                                   |
| `suffix`      | `ReactNode &#124; undefined`                      | Element displayed at the end of the row.                               |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `actionRole`: v12 switched the items between `button` and `menuitem`.
> - `url`: Deprecated on `ActionListItemType`, use `href` instead.

#### Examples

**With custom trigger button:**

```tsx
<ActionList
  items={[
    { content: "Export CSV", onAction: () => exportCsv() },
    { content: "Import CSV", onAction: () => importCsv() },
  ]}
>
  <Button variant="secondary">More actions</Button>
</ActionList>
```

**With default 3-dots trigger:**

```tsx
<ActionList
  items={[
    { content: "Edit", icon: "edit", onAction: () => handleEdit() },
    { content: "Duplicate", onAction: () => handleDuplicate() },
    {
      content: "Delete",
      icon: "delete",
      destructive: true,
      onAction: () => handleDelete(),
    },
  ]}
/>
```

**With sections:**

```tsx
<ActionList
  sections={[
    {
      title: "Manage",
      items: [
        { content: "Edit", icon: "edit", onAction: () => edit() },
        {
          content: "Duplicate",
          icon: "duplicate",
          helpText: "Keeps the original",
          onAction: () => duplicate(),
        },
      ],
    },
    {
      title: "Danger zone",
      items: [
        {
          content: "Delete",
          icon: "delete",
          destructive: true,
          onAction: () => remove(),
        },
      ],
    },
  ]}
>
  <Button variant="tertiary">Actions</Button>
</ActionList>
```

---

### AppNav

App Bridge top-level navigation container wrapping `<s-app-nav>`.

```tsx
import { AppNav } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop             | Type                                                                                                                               | Description                                                                                           |
| :--------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| `id`             | `string &#124; undefined`                                                                                                          | —                                                                                                     |
| `className`      | `string &#124; undefined`                                                                                                          | —                                                                                                     |
| `style`          | `CSSProperties &#124; undefined`                                                                                                   | —                                                                                                     |
| `defaultChecked` | `boolean &#124; undefined`                                                                                                         | —                                                                                                     |
| `defaultValue`   | `string &#124; number &#124; readonly string[] &#124; undefined`                                                                   | —                                                                                                     |
| `slot`           | `string &#124; undefined`                                                                                                          | —                                                                                                     |
| `tabIndex`       | `number &#124; undefined`                                                                                                          | —                                                                                                     |
| `title`          | `string &#124; undefined`                                                                                                          | —                                                                                                     |
| `role`           | `AriaRole &#124; undefined`                                                                                                        | —                                                                                                     |
| `prefix`         | `string &#124; undefined`                                                                                                          | —                                                                                                     |
| `color`          | `string &#124; undefined`                                                                                                          | —                                                                                                     |
| `inputMode`      | `"none" &#124; "search" &#124; "text" &#124; "tel" &#124; "url" &#124; "email" &#124; "numeric" &#124; "decimal" &#124; undefined` | Hints at the type of data that might be entered by the user while editing the element or its contents |
| `onFocus`        | `FocusEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                            | —                                                                                                     |
| `onBlur`         | `FocusEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                            | —                                                                                                     |
| `onChange`       | `FormEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                             | —                                                                                                     |
| `onInput`        | `FormEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                             | —                                                                                                     |
| `onKeyDown`      | `KeyboardEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                         | —                                                                                                     |
| `onKeyUp`        | `KeyboardEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                         | —                                                                                                     |
| `onClick`        | `MouseEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                            | —                                                                                                     |
| `onMouseEnter`   | `MouseEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                            | —                                                                                                     |
| `onMouseLeave`   | `MouseEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                            | —                                                                                                     |
| `onSelect`       | `ReactEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                            | —                                                                                                     |
| `children`       | `ReactNode`                                                                                                                        | `Link` children, e.g. `<Link url="/app" rel="home">Home</Link>`.                                      |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `onKeyPress`: Use `onKeyUp` or `onKeyDown` instead
> - `onKeyPressCapture`: Use `onKeyUpCapture` or `onKeyDownCapture` instead

#### Example

```tsx
<AppNav>
  <Link href="/app" rel="home">
    Dashboard
  </Link>
  <Link href="/app/orders">Orders</Link>
</AppNav>
```

---

### AppWindow

App Bridge window container wrapping `<s-app-window>` for modal or iframe shells.

```tsx
import { AppWindow } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                 | Type                                                                                                                               | Description                                                                                                                                                                                                                               |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                 | `string &#124; undefined`                                                                                                          | —                                                                                                                                                                                                                                         |
| `className`          | `string &#124; undefined`                                                                                                          | —                                                                                                                                                                                                                                         |
| `style`              | `CSSProperties &#124; undefined`                                                                                                   | —                                                                                                                                                                                                                                         |
| `defaultChecked`     | `boolean &#124; undefined`                                                                                                         | —                                                                                                                                                                                                                                         |
| `defaultValue`       | `string &#124; number &#124; readonly string[] &#124; undefined`                                                                   | —                                                                                                                                                                                                                                         |
| `slot`               | `string &#124; undefined`                                                                                                          | —                                                                                                                                                                                                                                         |
| `tabIndex`           | `number &#124; undefined`                                                                                                          | —                                                                                                                                                                                                                                         |
| `title`              | `string &#124; undefined`                                                                                                          | —                                                                                                                                                                                                                                         |
| `role`               | `AriaRole &#124; undefined`                                                                                                        | —                                                                                                                                                                                                                                         |
| `prefix`             | `string &#124; undefined`                                                                                                          | —                                                                                                                                                                                                                                         |
| `color`              | `string &#124; undefined`                                                                                                          | —                                                                                                                                                                                                                                         |
| `inputMode`          | `"none" &#124; "search" &#124; "text" &#124; "tel" &#124; "url" &#124; "email" &#124; "numeric" &#124; "decimal" &#124; undefined` | Hints at the type of data that might be entered by the user while editing the element or its contents                                                                                                                                     |
| `children`           | `ReactNode`                                                                                                                        | —                                                                                                                                                                                                                                         |
| `onFocus`            | `FocusEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                            | —                                                                                                                                                                                                                                         |
| `onBlur`             | `FocusEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                            | —                                                                                                                                                                                                                                         |
| `onChange`           | `FormEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                             | —                                                                                                                                                                                                                                         |
| `onInput`            | `FormEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                             | —                                                                                                                                                                                                                                         |
| `onKeyDown`          | `KeyboardEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                         | —                                                                                                                                                                                                                                         |
| `onKeyUp`            | `KeyboardEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                         | —                                                                                                                                                                                                                                         |
| `onClick`            | `MouseEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                            | —                                                                                                                                                                                                                                         |
| `onMouseEnter`       | `MouseEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                            | —                                                                                                                                                                                                                                         |
| `onMouseLeave`       | `MouseEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                            | —                                                                                                                                                                                                                                         |
| `onSelect`           | `ReactEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                            | —                                                                                                                                                                                                                                         |
| `src` **(required)** | `string`                                                                                                                           | URL of the page to load inside the window.                                                                                                                                                                                                |
| `onClose`            | `(() =&gt; void) &#124; undefined`                                                                                                 | Callback fired when the window is closed or hidden.                                                                                                                                                                                       |
| `onHide`             | `(() =&gt; void) &#124; undefined`                                                                                                 | Callback fired when the window is closed or hidden.                                                                                                                                                                                       |
| `saveBar`            | `boolean &#124; AppWindowSaveBarConfigType &#124; undefined`                                                                       | When enabled, automatically mounts a SaveBar on the host parent page for this AppWindow and bridges Save/Discard actions to the iframe via `useAppWindowSaveBar`. Can be boolean or configuration object with custom handlers and labels. |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `onKeyPress`: Use `onKeyUp` or `onKeyDown` instead
> - `onKeyPressCapture`: Use `onKeyUpCapture` or `onKeyDownCapture` instead

#### Example

```tsx
<AppWindow src="/app/settings" onClose={() => handleClose()} />
```

---

### Autocomplete

High-level single-selection autocomplete input with debounced querying.

```tsx
import { Autocomplete } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop          | Type                                            | Description                                   |
| :------------ | :---------------------------------------------- | :-------------------------------------------- |
| `options`     | `AutocompleteOptionType[] &#124; undefined`     | The collection of suggestion options.         |
| `value`       | `string &#124; undefined`                       | Search query or input value.                  |
| `onChange`    | `((value: string) =&gt; void) &#124; undefined` | Callback when search query changes.           |
| `selected`    | `string &#124; undefined`                       | The currently selected option value.          |
| `onSelect`    | `((value: string) =&gt; void) &#124; undefined` | Callback fired when an option is selected.    |
| `label`       | `string &#124; undefined`                       | Input label.                                  |
| `placeholder` | `string &#124; undefined`                       | Input placeholder text.                       |
| `disabled`    | `boolean &#124; undefined`                      | Whether the input is disabled.                |
| `loading`     | `boolean &#124; undefined`                      | Loading state showing a spinner.              |
| `emptyState`  | `ReactNode`                                     | Content shown when no options match.          |
| `open`        | `boolean &#124; undefined`                      | Controlled open state of the suggestion list. |
| `onClose`     | `(() =&gt; void) &#124; undefined`              | Callback when the suggestion list closes.     |
| `id`          | `string &#124; undefined`                       | —                                             |
| `className`   | `string &#124; undefined`                       | —                                             |
| `style`       | `CSSProperties &#124; undefined`                | —                                             |

#### Example

```tsx
<Autocomplete
  options={suggestions}
  value={query}
  onChange={(q) => setQuery(q)}
  onSelect={(val) => handleSelect(val)}
  label="Search customers"
/>
```

---

### Avatar

Visual avatar icon or image wrapping `<s-avatar>`.

```tsx
import { Avatar } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                 | Type                                                                            | Description                                                                                                                                       |
| :------------------- | :------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                 | `string &#124; undefined`                                                       | A unique identifier for the element.                                                                                                              |
| `slot`               | `Lowercase&lt;string&gt; &#124; undefined`                                      | Assigns this element to a parent's slot.                                                                                                          |
| `src`                | `string &#124; undefined`                                                       | The URL or path to the image. Initials will be rendered as a fallback if `src` is not provided, fails to load or does not load quickly            |
| `initials`           | `string &#124; undefined`                                                       | Initials to display in the avatar.                                                                                                                |
| `alt`                | `string &#124; undefined`                                                       | An alternative text that describes the avatar for the reader to understand what it is about or identify the user the avatar belongs to.           |
| `name`               | `string &#124; undefined`                                                       | Name of person or entity (used for initials calculation / accessibility).                                                                         |
| `shape`              | `(string & {}) &#124; "round" &#124; "square" &#124; undefined`                 | Shape of the avatar ('round' &#124; 'square').                                                                                                    |
| `accessibilityLabel` | `string &#124; undefined`                                                       | Visually hidden label describing avatar.                                                                                                          |
| `source`             | `string &#124; undefined`                                                       | Source image URL (legacy Polaris prop mapping to `src`).                                                                                          |
| `image`              | `string &#124; undefined`                                                       | Image URL alias mapping to `src`.                                                                                                                 |
| `size`               | `"small-200" &#124; "base" &#124; "large-200" &#124; SizeType &#124; undefined` | —                                                                                                                                                 |
| `customer`           | `boolean &#124; undefined`                                                      | v12's `customer` placeholder glyph. `s-avatar` renders initials or a generic person, so this is accepted and ignored, with a development warning. |

#### Example

```tsx
<Avatar name="Jane Doe" size="base" shape="round" />
```

---

### Badge

Compact status indicator badge wrapping `<s-badge>`.

```tsx
import { Badge } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop        | Type                                                                                                                                                     | Description                                                                                                                                              |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`        | `string &#124; undefined`                                                                                                                                | A unique identifier for the element.                                                                                                                     |
| `slot`      | `Lowercase&lt;string&gt; &#124; undefined`                                                                                                               | Assigns this element to a parent's slot.                                                                                                                 |
| `color`     | `"base" &#124; "strong" &#124; undefined`                                                                                                                | Modify the color to be more or less intense.                                                                                                             |
| `size`      | `"base" &#124; "large" &#124; "large-100" &#124; undefined`                                                                                              | Adjusts the size.                                                                                                                                        |
| `icon`      | `"" &#124; IconType &#124; "empty" &#124; undefined`                                                                                                     | The type of icon to be displayed in the badge.                                                                                                           |
| `children`  | `ReactNode`                                                                                                                                              | —                                                                                                                                                        |
| `tone`      | `"auto" &#124; "neutral" &#124; "info" &#124; "success" &#124; "caution" &#124; "warning" &#124; "critical" &#124; BadgeLegacyToneType &#124; undefined` | `s-badge`'s tones, plus v12's `attention` and `magic`. `attention` is a caution by another name; `magic` marked AI features and reads closest to `info`. |
| `progress`  | `"incomplete" &#124; "partiallyComplete" &#124; "complete" &#124; undefined`                                                                             | Visual indicator of progress status.                                                                                                                     |
| `className` | `string &#124; undefined`                                                                                                                                | —                                                                                                                                                        |
| `style`     | `CSSProperties &#124; undefined`                                                                                                                         | —                                                                                                                                                        |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `status`: Use `tone`. Kept for legacy-API compatibility.

#### Example

```tsx
<Badge tone="success" progress="complete">
  Paid
</Badge>
```

---

### Banner

Callout banner for system messages and alerts wrapping `<s-banner>`.

```tsx
import { Banner } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop          | Type                                                                                        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| :------------ | :------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`          | `string &#124; undefined`                                                                   | A unique identifier for the element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `slot`        | `Lowercase&lt;string&gt; &#124; undefined`                                                  | Assigns this element to a parent's slot.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `children`    | `any`                                                                                       | The content of the Banner.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `heading`     | `string &#124; undefined`                                                                   | The title of the banner.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `tone`        | `"auto" &#124; "info" &#124; "success" &#124; "warning" &#124; "critical" &#124; undefined` | Sets the tone of the Banner, based on the intention of the information being conveyed. The banner is a live region and the type of status will be dictated by the Tone selected. - `critical` creates an [assertive live region](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/alert_role) that is announced by screen readers immediately. - `neutral`, `info`, `success`, `warning` and `caution` creates an [informative live region](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/status_role) that is announced by screen readers after the current message. |
| `dismissible` | `boolean &#124; undefined`                                                                  | Determines whether the close button of the banner is present. When the close button is pressed, the `dismiss` event will fire, then `hidden` will be true, any animation will complete, and the `afterhide` event will fire.                                                                                                                                                                                                                                                                                                                                                                                       |
| `onDismiss`   | `((event: CallbackEvent&lt;"s-banner"&gt;) =&gt; void) &#124; null &#124; undefined`        | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `onAfterHide` | `((event: CallbackEvent&lt;"s-banner"&gt;) =&gt; void) &#124; null &#124; undefined`        | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `title`: Use `heading`. Kept for legacy-API compatibility.
> - `status`: Use `tone`. Kept for legacy-API compatibility.

#### Example

```tsx
<Banner
  heading="Payment Pending"
  tone="warning"
  dismissible
  onDismiss={() => handleDismiss()}
>
  <Text>The transaction is currently processing.</Text>
</Banner>
```

---

### BlockStack

Vertical flex layout container. Automatically stacks children with uniform gaps along the block axis.

```tsx
import { BlockStack } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                 | Type                                                                                                                               | Description                                                                                                                                            |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultChecked`     | `boolean &#124; undefined`                                                                                                         | —                                                                                                                                                      |
| `defaultValue`       | `string &#124; number &#124; readonly string[] &#124; undefined`                                                                   | —                                                                                                                                                      |
| `slot`               | `string &#124; undefined`                                                                                                          | —                                                                                                                                                      |
| `tabIndex`           | `number &#124; undefined`                                                                                                          | —                                                                                                                                                      |
| `title`              | `string &#124; undefined`                                                                                                          | —                                                                                                                                                      |
| `role`               | `AriaRole &#124; undefined`                                                                                                        | —                                                                                                                                                      |
| `prefix`             | `string &#124; undefined`                                                                                                          | —                                                                                                                                                      |
| `color`              | `string &#124; undefined`                                                                                                          | —                                                                                                                                                      |
| `inputMode`          | `"none" &#124; "search" &#124; "text" &#124; "tel" &#124; "url" &#124; "email" &#124; "numeric" &#124; "decimal" &#124; undefined` | Hints at the type of data that might be entered by the user while editing the element or its contents                                                  |
| `onFocus`            | `FocusEventHandler&lt;HTMLDivElement&gt; &#124; undefined`                                                                         | —                                                                                                                                                      |
| `onBlur`             | `FocusEventHandler&lt;HTMLDivElement&gt; &#124; undefined`                                                                         | —                                                                                                                                                      |
| `onChange`           | `FormEventHandler&lt;HTMLDivElement&gt; &#124; undefined`                                                                          | —                                                                                                                                                      |
| `onInput`            | `FormEventHandler&lt;HTMLDivElement&gt; &#124; undefined`                                                                          | —                                                                                                                                                      |
| `onKeyDown`          | `KeyboardEventHandler&lt;HTMLDivElement&gt; &#124; undefined`                                                                      | —                                                                                                                                                      |
| `onKeyUp`            | `KeyboardEventHandler&lt;HTMLDivElement&gt; &#124; undefined`                                                                      | —                                                                                                                                                      |
| `onClick`            | `MouseEventHandler&lt;HTMLDivElement&gt; &#124; undefined`                                                                         | —                                                                                                                                                      |
| `onMouseEnter`       | `MouseEventHandler&lt;HTMLDivElement&gt; &#124; undefined`                                                                         | —                                                                                                                                                      |
| `onMouseLeave`       | `MouseEventHandler&lt;HTMLDivElement&gt; &#124; undefined`                                                                         | —                                                                                                                                                      |
| `onSelect`           | `ReactEventHandler&lt;HTMLDivElement&gt; &#124; undefined`                                                                         | —                                                                                                                                                      |
| `children`           | `ReactNode`                                                                                                                        | —                                                                                                                                                      |
| `as`                 | `ElementType &#124; undefined`                                                                                                     | HTML element or custom component to render as.                                                                                                         |
| `gap`                | `PolarisSpacingType`                                                                                                               | Spacing between elements. Use modern Polaris spacing tokens ("none", "small-500"..."large-500", "base"). Never use legacy numeric tokens.              |
| `rowGap`             | `PolarisSpacingType`                                                                                                               | Spacing between elements. Use modern Polaris spacing tokens ("none", "small-500"..."large-500", "base"). Never use legacy numeric tokens.              |
| `columnGap`          | `PolarisSpacingType`                                                                                                               | Spacing between elements. Use modern Polaris spacing tokens ("none", "small-500"..."large-500", "base"). Never use legacy numeric tokens.              |
| `justifyContent`     | `JustifyContent &#124; undefined`                                                                                                  | CSS `justifyContent` property. Takes precedence over `inlineAlign`.                                                                                    |
| `alignItems`         | `AlignItems &#124; undefined`                                                                                                      | CSS `alignItems` property. Takes precedence over `align`.                                                                                              |
| `alignContent`       | `AlignContent &#124; undefined`                                                                                                    | CSS `alignContent` property.                                                                                                                           |
| `wrap`               | `boolean &#124; undefined`                                                                                                         | Wrap stack elements to additional columns/rows as needed. Accepts boolean (`true` -> "wrap", `false` -> "nowrap") or standard CSS `flexWrap` keywords. |
| `fill`               | `boolean &#124; undefined`                                                                                                         | Fills the container's inline axis, as v12's `fill` did.                                                                                                |
| `grow`               | `number &#124; boolean &#124; FlexGrow &#124; undefined`                                                                           | Flex grow factor. When `true`, expands to fill available space (`flex-grow: 1`).                                                                       |
| `shrink`             | `boolean &#124; undefined`                                                                                                         | Flex shrink factor. When `false`, prevents shrinking (`flex-shrink: 0`).                                                                               |
| `flex`               | `Flex&lt;string &#124; number&gt; &#124; undefined`                                                                                | Flex shorthand property.                                                                                                                               |
| `order`              | `Order &#124; undefined`                                                                                                           | Flex order.                                                                                                                                            |
| `inline`             | `boolean &#124; undefined`                                                                                                         | Render as an inline flex container (`display: inline-flex`).                                                                                           |
| `padding`            | `PolarisSpacingType &#124; string`                                                                                                 | Internal padding. Accepts 1 to 4 modern Polaris spacing tokens. Never use legacy numeric tokens.                                                       |
| `paddingBlock`       | `BoxPaddingDirectionType &#124; undefined`                                                                                         | —                                                                                                                                                      |
| `paddingBlockStart`  | `BoxPaddingDirectionType &#124; undefined`                                                                                         | —                                                                                                                                                      |
| `paddingBlockEnd`    | `BoxPaddingDirectionType &#124; undefined`                                                                                         | —                                                                                                                                                      |
| `paddingInline`      | `BoxPaddingDirectionType &#124; undefined`                                                                                         | —                                                                                                                                                      |
| `paddingInlineStart` | `BoxPaddingDirectionType &#124; undefined`                                                                                         | —                                                                                                                                                      |
| `paddingInlineEnd`   | `BoxPaddingDirectionType &#124; undefined`                                                                                         | —                                                                                                                                                      |
| `inlineSize`         | `InlineSize&lt;string &#124; number&gt; &#124; undefined`                                                                          | Width or inlineSize.                                                                                                                                   |
| `minInlineSize`      | `MinInlineSize&lt;string &#124; number&gt; &#124; undefined`                                                                       | —                                                                                                                                                      |
| `maxInlineSize`      | `MaxInlineSize&lt;string &#124; number&gt; &#124; undefined`                                                                       | —                                                                                                                                                      |
| `blockSize`          | `BlockSize&lt;string &#124; number&gt; &#124; undefined`                                                                           | Height or blockSize.                                                                                                                                   |
| `minBlockSize`       | `MinBlockSize&lt;string &#124; number&gt; &#124; undefined`                                                                        | —                                                                                                                                                      |
| `maxBlockSize`       | `MaxBlockSize&lt;string &#124; number&gt; &#124; undefined`                                                                        | —                                                                                                                                                      |
| `overflow`           | `Overflow &#124; undefined`                                                                                                        | Overflow behavior.                                                                                                                                     |
| `overflowX`          | `OverflowX &#124; undefined`                                                                                                       | —                                                                                                                                                      |
| `overflowY`          | `OverflowY &#124; undefined`                                                                                                       | —                                                                                                                                                      |
| `position`           | `Position &#124; undefined`                                                                                                        | Position.                                                                                                                                              |
| `className`          | `string &#124; undefined`                                                                                                          | Additional CSS class names.                                                                                                                            |
| `style`              | `CSSProperties &#124; undefined`                                                                                                   | Inline CSS styles.                                                                                                                                     |
| `id`                 | `string &#124; undefined`                                                                                                          | Unique identifier.                                                                                                                                     |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `onKeyPress`: Use `onKeyUp` or `onKeyDown` instead
> - `onKeyPressCapture`: Use `onKeyUpCapture` or `onKeyDownCapture` instead
> - `align`: Use `alignItems` instead.
> - `inlineAlign`: Use `justifyContent` instead.
> - `Legacy numeric gap/padding tokens ("100", "200", "300", "400", "500")`: Use modern Polaris spacing tokens ("small-200", "base", "large-100", etc.) instead.

#### Example

```tsx
<BlockStack gap="base" alignItems="start">
  <Text variant="headingMd">Heading</Text>
  <Text color="subdued">Description content</Text>
</BlockStack>
```

---

### Box

Low-level layout container wrapping Shopify's `<s-box>`. Provides padding, borders, background colors, and dimensions.

```tsx
import { Box } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                      | Type                                                                               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| :------------------------ | :--------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                      | `string &#124; undefined`                                                          | A unique identifier for the element.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `accessibilityLabel`      | `string &#124; undefined`                                                          | A label that describes the purpose or contents of the element. When set, it will be announced to users using assistive technologies and will provide them with more context. Only use this when the element's content is not enough context for users using assistive technologies.                                                                                                                                                                                       |
| `inlineSize`              | `SizeUnitsOrAuto &#124; undefined`                                                 | Adjust the [inline size](https://developer.mozilla.org/en-US/docs/Web/CSS/inline-size).                                                                                                                                                                                                                                                                                                                                                                                   |
| `accessibilityVisibility` | `"hidden" &#124; "visible" &#124; "exclusive" &#124; undefined`                    | Changes the visibility of the element. - `visible`: the element is visible to all users. - `hidden`: the element is removed from the accessibility tree but remains visible. - `exclusive`: the element is visually hidden but remains in the accessibility tree.                                                                                                                                                                                                         |
| `minInlineSize`           | `SizeUnits &#124; undefined`                                                       | Adjust the [minimum inline size](https://developer.mozilla.org/en-US/docs/Web/CSS/min-inline-size).                                                                                                                                                                                                                                                                                                                                                                       |
| `maxInlineSize`           | `SizeUnitsOrNone &#124; undefined`                                                 | Adjust the [maximum inline size](https://developer.mozilla.org/en-US/docs/Web/CSS/max-inline-size).                                                                                                                                                                                                                                                                                                                                                                       |
| `blockSize`               | `SizeUnitsOrAuto &#124; undefined`                                                 | Adjust the [block size](https://developer.mozilla.org/en-US/docs/Web/CSS/block-size).                                                                                                                                                                                                                                                                                                                                                                                     |
| `minBlockSize`            | `SizeUnits &#124; undefined`                                                       | Adjust the [minimum block size](https://developer.mozilla.org/en-US/docs/Web/CSS/min-block-size).                                                                                                                                                                                                                                                                                                                                                                         |
| `maxBlockSize`            | `SizeUnitsOrNone &#124; undefined`                                                 | Adjust the [maximum block size](https://developer.mozilla.org/en-US/docs/Web/CSS/max-block-size).                                                                                                                                                                                                                                                                                                                                                                         |
| `overflow`                | `"hidden" &#124; "visible" &#124; undefined`                                       | Sets the overflow behavior of the element. - `hidden`: clips the content when it is larger than the element’s container. The element will not be scrollable and the users will not be able to access the clipped content by dragging or using a scroll wheel on a mouse. - `visible`: the content that extends beyond the element’s container is visible.                                                                                                                 |
| `accessibilityRole`       | `AccessibilityRole &#124; undefined`                                               | Sets the semantic meaning of the component’s content. When set, the role will be used by assistive technologies to help users navigate the page.                                                                                                                                                                                                                                                                                                                          |
| `border`                  | `BorderShorthand &#124; undefined`                                                 | Set the border via the shorthand property. This can be a size, optionally followed by a color, optionally followed by a style. If the color is not specified, it will be `base`. If the style is not specified, it will be `auto`. Values can be overridden by `borderWidth`, `borderStyle`, and `borderColor`.                                                                                                                                                           |
| `display`                 | `MaybeResponsive&lt;"none" &#124; "auto"&gt; &#124; undefined`                     | Sets the outer [display](https://developer.mozilla.org/en-US/docs/Web/CSS/display) type of the component. The outer type sets a component's participation in [flow layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flow_layout). - `auto` the component's initial value. The actual value depends on the component and context. - `none` hides the component from display and removes it from the accessibility tree, making it invisible to screen readers. |
| `children`                | `ReactNode`                                                                        | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `background`              | `BoxBackgroundType &#124; undefined`                                               | Adjust the background of the component ('transparent' &#124; 'base' &#124; 'subdued' &#124; 'strong' or legacy Polaris alias).                                                                                                                                                                                                                                                                                                                                            |
| `borderWidth`             | `BoxBorderWidthType &#124; undefined`                                              | Adjust the width of the border ('small-100' &#124; 'small' &#124; 'base' &#124; 'large' &#124; 'large-100' &#124; 'none' &#124; legacy token).                                                                                                                                                                                                                                                                                                                            |
| `borderStyle`             | `BoxBorderStyleType &#124; undefined`                                              | Adjust the style of the border ('solid' &#124; 'dashed' &#124; 'dotted' &#124; 'none' &#124; '').                                                                                                                                                                                                                                                                                                                                                                         |
| `borderColor`             | `BoxBorderColorType &#124; undefined`                                              | Adjust the color of the border ('subdued' &#124; 'base' &#124; 'strong' &#124; 'transparent' &#124; legacy token).                                                                                                                                                                                                                                                                                                                                                        |
| `borderRadius`            | `BoxBorderRadiusType &#124; undefined`                                             | Adjust the radius of the border ('none' &#124; 'small-100' &#124; 'small' &#124; 'base' &#124; 'large' &#124; 'large-100' &#124; 'max' &#124; 'full' &#124; legacy token).                                                                                                                                                                                                                                                                                                |
| `padding`                 | `PolarisSpacingType &#124; string`                                                 | Internal padding. Accepts 1 to 4 modern Polaris spacing tokens. Never use legacy numeric tokens.                                                                                                                                                                                                                                                                                                                                                                          |
| `paddingBlock`            | `ResponsivePropType&lt;BoxPaddingDirectionType&gt; &#124; undefined`               | Adjust the block-padding (overrides block value of padding).                                                                                                                                                                                                                                                                                                                                                                                                              |
| `paddingBlockStart`       | `ResponsivePropType&lt;BoxPaddingDirectionType&gt; &#124; undefined`               | Adjust the block-start padding (overrides block-start of paddingBlock).                                                                                                                                                                                                                                                                                                                                                                                                   |
| `paddingBlockEnd`         | `ResponsivePropType&lt;BoxPaddingDirectionType&gt; &#124; undefined`               | Adjust the block-end padding (overrides block-end of paddingBlock).                                                                                                                                                                                                                                                                                                                                                                                                       |
| `paddingInline`           | `ResponsivePropType&lt;BoxPaddingDirectionType&gt; &#124; undefined`               | Adjust the inline padding (overrides inline value of padding).                                                                                                                                                                                                                                                                                                                                                                                                            |
| `paddingInlineStart`      | `ResponsivePropType&lt;BoxPaddingDirectionType&gt; &#124; undefined`               | Adjust the inline-start padding (overrides inline-start of paddingInline).                                                                                                                                                                                                                                                                                                                                                                                                |
| `paddingInlineEnd`        | `ResponsivePropType&lt;BoxPaddingDirectionType&gt; &#124; undefined`               | Adjust the inline-end padding (overrides inline-end of paddingInline).                                                                                                                                                                                                                                                                                                                                                                                                    |
| `role`                    | `string &#124; undefined`                                                          | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `tabIndex`                | `number &#124; undefined`                                                          | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `slot`                    | `string &#124; undefined`                                                          | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `style`                   | `CSSProperties &#124; undefined`                                                   | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `className`               | `string &#124; undefined`                                                          | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `onClick`                 | `((event: MouseEvent&lt;HTMLElement, MouseEvent&gt;) =&gt; void) &#124; undefined` | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `onMouseEnter`            | `((event: MouseEvent&lt;HTMLElement, MouseEvent&gt;) =&gt; void) &#124; undefined` | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `onMouseLeave`            | `((event: MouseEvent&lt;HTMLElement, MouseEvent&gt;) =&gt; void) &#124; undefined` | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `onFocus`                 | `((event: FocusEvent&lt;HTMLElement, Element&gt;) =&gt; void) &#124; undefined`    | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `onBlur`                  | `((event: FocusEvent&lt;HTMLElement, Element&gt;) =&gt; void) &#124; undefined`    | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `as`: HTML Element type in legacy Polaris React. In Polaris web components, the element is always `<s-box>`.
> - `color`: Color of children text.
> - `borderBlockStartWidth`: Vertical start border width.
> - `borderBlockEndWidth`: Vertical end border width.
> - `borderInlineStartWidth`: Horizontal start border width.
> - `borderInlineEndWidth`: Horizontal end border width.
> - `borderStartStartRadius`: Vertical start horizontal start border radius.
> - `borderStartEndRadius`: Vertical start horizontal end border radius.
> - `borderEndStartRadius`: Vertical end horizontal start border radius.
> - `borderEndEndRadius`: Vertical end horizontal end border radius.
> - `overflowX`: Horizontal content clipping ('hidden' | 'scroll' | 'clip').
> - `overflowY`: Vertical content clipping ('hidden' | 'scroll' | 'clip').
> - `shadow`: Box shadow alias or CSS box-shadow.
> - `position`: CSS positioning mode ('relative' | 'absolute' | 'fixed' | 'sticky').
> - `insetBlockStart`: Top position offset.
> - `insetBlockEnd`: Bottom position offset.
> - `insetInlineStart`: Left position offset.
> - `insetInlineEnd`: Right position offset.
> - `opacity`: Opacity of box.
> - `outlineColor`: Outline color.
> - `outlineStyle`: Outline style ('solid' | 'dashed').
> - `outlineWidth`: Outline width.
> - `printHidden`: Visually hides content during print.
> - `visuallyHidden`: Visually hides the content while keeping it accessible to screen readers.
>   In modern Polaris web components, this maps directly to `accessibilityVisibility="exclusive"`.
> - `zIndex`: Z-index layer of box.
> - `width`: Legacy dimension alias. Use `inlineSize` in modern code.
> - `minWidth`: Legacy dimension alias. Use `minInlineSize` in modern code.
> - `maxWidth`: Legacy dimension alias. Use `maxInlineSize` in modern code.
> - `height`: Legacy dimension alias. Use `blockSize` in modern code.
> - `minHeight`: Legacy dimension alias. Use `minBlockSize` in modern code.
> - `maxHeight`: Legacy dimension alias. Use `maxBlockSize` in modern code.
> - `Legacy numeric padding tokens ("100", "200", "300", "400", "500")`: Use modern Polaris spacing tokens ("small-200", "base", "large-100", etc.) instead.

#### Example

```tsx
<Box
  padding="base"
  background="subdued"
  borderRadius="base"
  borderWidth="small-100"
  borderColor="subdued"
>
  <Text>Container content</Text>
</Box>
```

---

### Button

Standard interactive button wrapping `<s-button>`. Supports primary, secondary, tertiary, and plain variants.

```tsx
import { Button } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                 | Type                                                                                                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| :------------------- | :------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                 | `string &#124; undefined`                                                                                | A unique identifier for the element.                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `slot`               | `Lowercase&lt;string&gt; &#124; undefined`                                                               | Assigns this element to a parent's slot.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `children`           | `any`                                                                                                    | The content of the Button.                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `onFocus`            | `((event: CallbackEvent&lt;"s-button"&gt;) =&gt; void) &#124; null &#124; undefined`                     | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `onBlur`             | `((event: CallbackEvent&lt;"s-button"&gt;) =&gt; void) &#124; null &#124; undefined`                     | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `onClick`            | `((event: CallbackEvent&lt;"s-button"&gt;) =&gt; void) &#124; null &#124; undefined`                     | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `disabled`           | `boolean &#124; undefined`                                                                               | Disables the Button meaning it cannot be clicked or receive focus.                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `loading`            | `boolean &#124; undefined`                                                                               | Replaces content with a loading indicator while a background action is being performed. This also disables the Button.                                                                                                                                                                                                                                                                                                                                                                           |
| `accessibilityLabel` | `string &#124; undefined`                                                                                | A label that describes the purpose or contents of the Button. It will be read to users using assistive technologies such as screen readers. Use this when using only an icon or the Button text is not enough context for users using assistive technologies.                                                                                                                                                                                                                                    |
| `icon`               | `"" &#124; IconType &#124; "empty" &#124; undefined`                                                     | The type of icon to be displayed in the Button.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `type`               | `"button" &#124; "reset" &#124; "submit" &#124; undefined`                                               | The behavior of the Button. - `submit`: Used to indicate the component acts as a submit button, meaning it submits the closest form. - `button`: Used to indicate the component acts as a button, meaning it has no default action. - `reset`: Used to indicate the component acts as a reset button, meaning it resets the closest form (returning fields to their default values). This property is ignored if the component supports `href` or `commandFor`/`command` and one of them is set. |
| `interestFor`        | `string &#124; undefined`                                                                                | ID of a component that should respond to interest (e.g. hover and focus) on this component.                                                                                                                                                                                                                                                                                                                                                                                                      |
| `download`           | `string &#124; undefined`                                                                                | Causes the browser to treat the linked URL as a download with the string being the file name. Download only works for same-origin URLs or the `blob:` and `data:` schemes.                                                                                                                                                                                                                                                                                                                       |
| `target`             | `"auto" &#124; "_blank" &#124; "_self" &#124; "_parent" &#124; "_top" &#124; AnyString &#124; undefined` | Specifies where to display the linked URL.                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `href`               | `string &#124; undefined`                                                                                | The URL to link to. - If set, it will navigate to the location specified by `href` after executing the `click` event. - If a `commandFor` is set, the `command` will be executed instead of the navigation.                                                                                                                                                                                                                                                                                      |
| `command`            | `"--auto" &#124; "--show" &#124; "--hide" &#124; "--toggle" &#124; "--copy" &#124; undefined`            | Sets the action the `commandFor` should take when this clickable is activated. See the documentation of particular components for the actions they support. - `--auto`: a default action for the target component. - `--show`: shows the target component. - `--hide`: hides the target component. - `--toggle`: toggles the target component. - `--copy`: copies the target ClipboardItem.                                                                                                      |
| `commandFor`         | `string &#124; undefined`                                                                                | ID of a component that should respond to activations (e.g. clicks) on this component. See `command` for how to control the behavior of the target.                                                                                                                                                                                                                                                                                                                                               |
| `inlineSize`         | `"fill" &#124; "auto" &#124; "fit-content" &#124; undefined`                                             | The displayed inline width of the Button. - `auto`: the size of the button depends on the surface and context. - `fill`: the button will takes up 100% of the available inline size. - `fit-content`: the button will take up the minimum inline-size required to fit its content.                                                                                                                                                                                                               |
| `variant`            | `ButtonVariantType &#124; undefined`                                                                     | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `size`               | `ButtonSizeType &#124; undefined`                                                                        | v12's sizes. `s-button` has one height and the library ships no stylesheet to override it, so these are accepted and ignored, with a development warning. For dense rows, `variant="tertiary"` is the quiet control.                                                                                                                                                                                                                                                                             |
| `tone`               | `"auto" &#124; "neutral" &#124; "success" &#124; "critical" &#124; "magic" &#124; undefined`             | `s-button`'s tones, plus v12's `success` and `magic`, which fall back to `auto`: the admin does not draw a filled green or violet button.                                                                                                                                                                                                                                                                                                                                                        |
| `submit`             | `boolean &#124; undefined`                                                                               | Sets button type to submit.                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `url`: Use `href`. Kept for legacy-API compatibility.
> - `external`: Use `target`. Kept for legacy-API compatibility.
> - `primary`: Use `variant="primary"`. Kept for legacy-API compatibility.
> - `destructive`: Use `tone="critical"`. Kept for legacy-API compatibility.
> - `plain`: Use `variant="plain"`. Kept for legacy-API compatibility.
> - `outline`: Use `variant="secondary"`. Kept for legacy-API compatibility.
> - `monochrome`: Kept for legacy-API compatibility.
> - `fullWidth`: Use `inlineSize="fill"`.
> - `style`: Inline styles are not supported on web component Button and are stripped.

#### Example

```tsx
<Button variant="primary" tone="critical" onClick={() => handleDelete()}>
  Delete Resource
</Button>
```

---

### ButtonGroup

Groups related `<Button>` components horizontally or as segmented controls.

```tsx
import { ButtonGroup } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                 | Type                                       | Description                                                                                                                               |
| :------------------- | :----------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                 | `string &#124; undefined`                  | A unique identifier for the element.                                                                                                      |
| `slot`               | `Lowercase&lt;string&gt; &#124; undefined` | Assigns this element to a parent's slot.                                                                                                  |
| `accessibilityLabel` | `string &#124; undefined`                  | Label for the button group that describes the content of the group for screen reader users to understand what's included.                 |
| `gap`                | `PolarisSpacingType`                       | Spacing between elements. Use modern Polaris spacing tokens ("none", "small-500"..."large-500", "base"). Never use legacy numeric tokens. |
| `children`           | `ReactNode`                                | —                                                                                                                                         |
| `fullWidth`          | `boolean &#124; undefined`                 | —                                                                                                                                         |
| `className`          | `string &#124; undefined`                  | —                                                                                                                                         |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `variant`: Use `gap="none"` for segmented groups, or omit `gap` for the default.

#### Example

```tsx
<ButtonGroup gap="small-200">
  <Button variant="secondary">Cancel</Button>
  <Button variant="primary">Save</Button>
</ButtonGroup>
```

---

### Card

Content surface section wrapping `<s-section>`. Note: Never pass `style` directly to `<Card>`.

```tsx
import { Card } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                     | Type                                                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| :----------------------- | :--------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                     | `string &#124; undefined`                            | A unique identifier for the element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `slot`                   | `Lowercase&lt;string&gt; &#124; undefined`           | Assigns this element to a parent's slot.                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `children`               | `any`                                                | The content of the Section.                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `heading`                | `string &#124; undefined`                            | A title that describes the content of the section.                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `accessibilityLabel`     | `string &#124; undefined`                            | A label used to describe the section that will be announced by assistive technologies. When no `heading` property is provided or included as a children of the Section, you **must** provide an `accessibilityLabel` to describe the Section. This is important as it allows assistive technologies to provide the right context to users.                                                                                                                                                              |
| `padding`                | `"none" &#124; "base" &#124; undefined`              | Adjust the padding of all edges. - `base`: applies padding that is appropriate for the element. Note that it may result in no padding if this is the right design decision in a particular context. - `none`: removes all padding from the element. This can be useful when elements inside the Section need to span to the edge of the Section. For example, a full-width image. In this case, rely on `s-box` with a padding of 'base' to bring back the desired padding for the rest of the content. |
| `gap`                    | `PolarisSpacingType`                                 | Spacing between elements. Use modern Polaris spacing tokens ("none", "small-500"..."large-500", "base"). Never use legacy numeric tokens.                                                                                                                                                                                                                                                                                                                                                               |
| `icon`                   | `"" &#124; IconType &#124; "empty" &#124; undefined` | Card header actions.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `description`            | `ReactNode`                                          | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `tooltip`                | `ReactNode`                                          | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `actions`                | `ReactNode`                                          | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `primaryFooterAction`    | `CardActionType &#124; undefined`                    | Primary action in the card footer.                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `secondaryFooterActions` | `CardActionType[] &#124; undefined`                  | Secondary actions in the card footer.                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `background`             | `string &#124; undefined`                            | Card padding ('base' &#124; 'none' &#124; legacy '0').                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `title`: use "@heading" Rendered as a heading above the card content.
> - `sectioned`: use
> - `style`: Card wraps <s-section>; inline style does not reliably penetrate. Wrap <Card> in a <Box> if custom styling is needed.

#### Example

```tsx
<Card heading="Customer Summary" gap="base">
  <Text>Customer details content</Text>
</Card>
```

---

### Checkbox

Binary or indeterminate checkbox wrapping `<s-checkbox>`.

```tsx
import { Checkbox } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                           | Type                                                                                   | Description                                                                                                                                                                                                                                                                |
| :----------------------------- | :------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                           | `string &#124; undefined`                                                              | A unique identifier for the element.                                                                                                                                                                                                                                       |
| `defaultChecked`               | `boolean &#124; undefined`                                                             | Whether the control is active by default.                                                                                                                                                                                                                                  |
| `slot`                         | `Lowercase&lt;string&gt; &#124; undefined`                                             | Assigns this element to a parent's slot.                                                                                                                                                                                                                                   |
| `onBlur`                       | `((event: CallbackEvent&lt;"s-checkbox"&gt;) =&gt; void) &#124; null &#124; undefined` | —                                                                                                                                                                                                                                                                          |
| `onInput`                      | `((event: CallbackEvent&lt;"s-checkbox"&gt;) =&gt; void) &#124; null &#124; undefined` | —                                                                                                                                                                                                                                                                          |
| `value`                        | `string &#124; undefined`                                                              | —                                                                                                                                                                                                                                                                          |
| `disabled`                     | `boolean &#124; undefined`                                                             | Disables the control, disallowing any interaction.                                                                                                                                                                                                                         |
| `name`                         | `string &#124; undefined`                                                              | An identifier for the control that is unique within the nearest containing `Form` component.                                                                                                                                                                               |
| `accessibilityLabel`           | `string &#124; undefined`                                                              | A label used for users using assistive technologies like screen readers. When set, any children or `label` supplied will not be announced. This can also be used to display a control without a visual label, while still providing context to users using screen readers. |
| `error`                        | `string &#124; undefined`                                                              | —                                                                                                                                                                                                                                                                          |
| `required`                     | `boolean &#124; undefined`                                                             | Whether the field needs a value. This requirement adds semantic value to the field, but it will not cause an error to appear automatically. If you want to present an error when this field is empty, you can do so with the `error` property.                             |
| `indeterminate`                | `boolean &#124; undefined`                                                             | —                                                                                                                                                                                                                                                                          |
| `defaultIndeterminate`         | `boolean &#124; undefined`                                                             | —                                                                                                                                                                                                                                                                          |
| `labelAccessibilityVisibility` | `"visible" &#124; "exclusive" &#124; undefined`                                        | —                                                                                                                                                                                                                                                                          |
| `label` **(required)**         | `ReactNode`                                                                            | —                                                                                                                                                                                                                                                                          |
| `checked`                      | `boolean &#124; undefined`                                                             | —                                                                                                                                                                                                                                                                          |
| `labelHidden`                  | `boolean &#124; undefined`                                                             | —                                                                                                                                                                                                                                                                          |
| `onChange`                     | `((checked: boolean, id: string) =&gt; void) &#124; undefined`                         | —                                                                                                                                                                                                                                                                          |
| `helpText`                     | `ReactNode`                                                                            | —                                                                                                                                                                                                                                                                          |
| `details`                      | `ReactNode`                                                                            | —                                                                                                                                                                                                                                                                          |
| `className`                    | `string &#124; undefined`                                                              | —                                                                                                                                                                                                                                                                          |

#### Example

```tsx
<Checkbox
  label="Send receipt by email"
  checked={checked}
  onChange={(val) => setChecked(val)}
/>
```

---

### ChoiceList

Radio button or checkbox list group allowing single or multiple selections.

```tsx
import { ChoiceList } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                           | Type                                                                                      | Description                                                                                                                                                                                                                      |
| :----------------------------- | :---------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                           | `string &#124; undefined`                                                                 | A unique identifier for the element.                                                                                                                                                                                             |
| `slot`                         | `Lowercase&lt;string&gt; &#124; undefined`                                                | Assigns this element to a parent's slot.                                                                                                                                                                                         |
| `children`                     | `any`                                                                                     | The choices a user can select from. Accepts `Choice` components.                                                                                                                                                                 |
| `onInput`                      | `((event: CallbackEvent&lt;"s-choice-list"&gt;) =&gt; void) &#124; null &#124; undefined` | —                                                                                                                                                                                                                                |
| `label`                        | `any`                                                                                     | Content to use as the field label.                                                                                                                                                                                               |
| `disabled`                     | `boolean &#124; undefined`                                                                | Disables the field, disallowing any interaction. `disabled` on any child choices is ignored when this is true.                                                                                                                   |
| `values`                       | `string[] &#124; undefined`                                                               | An array of the `value`s of the selected options. This is a convenience prop for setting the `selected` prop on child options.                                                                                                   |
| `name`                         | `string &#124; undefined`                                                                 | An identifier for the field that is unique within the nearest containing form.                                                                                                                                                   |
| `details`                      | `any`                                                                                     | Additional text to provide context or guidance for the field. This text is displayed along with the field and its label to offer more information or instructions to the user. This will also be exposed to screen reader users. |
| `error`                        | `any`                                                                                     | Indicate an error to the user. The field will be given a specific stylistic treatment to communicate problems that have to be resolved immediately.                                                                              |
| `labelAccessibilityVisibility` | `"visible" &#124; "exclusive" &#124; undefined`                                           | Changes the visibility of the component's label. - `visible`: the label is visible to all users. - `exclusive`: the label is visually hidden but remains in the accessibility tree.                                              |
| `multiple`                     | `boolean &#124; undefined`                                                                | Whether multiple choices can be selected.                                                                                                                                                                                        |
| `choices`                      | `ChoiceListOptionType[] &#124; undefined`                                                 | —                                                                                                                                                                                                                                |
| `selected`                     | `string[] &#124; undefined`                                                               | —                                                                                                                                                                                                                                |
| `onChange`                     | `((values: string[], name: string) =&gt; void) &#124; undefined`                          | —                                                                                                                                                                                                                                |

#### Example

```tsx
<ChoiceList
  title="Shipping priority"
  choices={[
    { label: "Standard", value: "std" },
    { label: "Express", value: "exp" },
  ]}
  selected={[selected]}
  onChange={(val) => setSelected(val[0])}
/>
```

---

### Clickable

Accessible interactive wrapper wrapping `<s-clickable>`. Allows any content to act as a button or link.

```tsx
import { Clickable } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                      | Type                                                                                                                                                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| :------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                      | `string &#124; undefined`                                                                                                                            | A unique identifier for the element.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `onFocus`                 | `(((event: CallbackEvent&lt;"s-clickable"&gt;) =&gt; void) & ((event: FocusEvent&lt;Element, Element&gt;) =&gt; void)) &#124; null &#124; undefined` | Callback fired on focus.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `onBlur`                  | `(((event: CallbackEvent&lt;"s-clickable"&gt;) =&gt; void) & ((event: FocusEvent&lt;Element, Element&gt;) =&gt; void)) &#124; null &#124; undefined` | Callback fired on blur.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `disabled`                | `boolean &#124; undefined`                                                                                                                           | Disables the clickable, meaning it cannot be clicked or receive focus. In this state, onClick will not fire. If the click event originates from a child element, the event will immediately stop propagating from this element. However, items within the clickable can still receive focus and be interacted with. This has no impact on the visual state by default, but developers are encouraged to style the clickable accordingly.                                  |
| `loading`                 | `boolean &#124; undefined`                                                                                                                           | Disables the clickable, and indicates to assistive technology that the loading is in progress. This also disables the clickable.                                                                                                                                                                                                                                                                                                                                          |
| `accessibilityLabel`      | `string &#124; undefined`                                                                                                                            | A label that describes the purpose or contents of the element. When set, it will be announced to users using assistive technologies and will provide them with more context. Only use this when the element's content is not enough context for users using assistive technologies.                                                                                                                                                                                       |
| `interestFor`             | `string &#124; undefined`                                                                                                                            | ID of a component that should respond to interest (e.g. hover and focus) on this component.                                                                                                                                                                                                                                                                                                                                                                               |
| `download`                | `string &#124; undefined`                                                                                                                            | Causes the browser to treat the linked URL as a download with the string being the file name. Download only works for same-origin URLs or the `blob:` and `data:` schemes.                                                                                                                                                                                                                                                                                                |
| `href`                    | `string &#124; undefined`                                                                                                                            | The URL to link to. - If set, it will navigate to the location specified by `href` after executing the `click` event. - If a `commandFor` is set, the `command` will be executed instead of the navigation.                                                                                                                                                                                                                                                               |
| `command`                 | `"--auto" &#124; "--show" &#124; "--hide" &#124; "--toggle" &#124; "--copy" &#124; undefined`                                                        | Sets the action the `commandFor` should take when this clickable is activated. See the documentation of particular components for the actions they support. - `--auto`: a default action for the target component. - `--show`: shows the target component. - `--hide`: hides the target component. - `--toggle`: toggles the target component. - `--copy`: copies the target ClipboardItem.                                                                               |
| `commandFor`              | `string &#124; undefined`                                                                                                                            | ID of a component that should respond to activations (e.g. clicks) on this component. See `command` for how to control the behavior of the target.                                                                                                                                                                                                                                                                                                                        |
| `accessibilityVisibility` | `"hidden" &#124; "visible" &#124; "exclusive" &#124; undefined`                                                                                      | Changes the visibility of the element. - `visible`: the element is visible to all users. - `hidden`: the element is removed from the accessibility tree but remains visible. - `exclusive`: the element is visually hidden but remains in the accessibility tree.                                                                                                                                                                                                         |
| `minInlineSize`           | `SizeUnits &#124; undefined`                                                                                                                         | Adjust the [minimum inline size](https://developer.mozilla.org/en-US/docs/Web/CSS/min-inline-size).                                                                                                                                                                                                                                                                                                                                                                       |
| `maxInlineSize`           | `SizeUnitsOrNone &#124; undefined`                                                                                                                   | Adjust the [maximum inline size](https://developer.mozilla.org/en-US/docs/Web/CSS/max-inline-size).                                                                                                                                                                                                                                                                                                                                                                       |
| `blockSize`               | `SizeUnitsOrAuto &#124; undefined`                                                                                                                   | Adjust the [block size](https://developer.mozilla.org/en-US/docs/Web/CSS/block-size).                                                                                                                                                                                                                                                                                                                                                                                     |
| `minBlockSize`            | `SizeUnits &#124; undefined`                                                                                                                         | Adjust the [minimum block size](https://developer.mozilla.org/en-US/docs/Web/CSS/min-block-size).                                                                                                                                                                                                                                                                                                                                                                         |
| `maxBlockSize`            | `SizeUnitsOrNone &#124; undefined`                                                                                                                   | Adjust the [maximum block size](https://developer.mozilla.org/en-US/docs/Web/CSS/max-block-size).                                                                                                                                                                                                                                                                                                                                                                         |
| `overflow`                | `"hidden" &#124; "visible" &#124; undefined`                                                                                                         | Sets the overflow behavior of the element. - `hidden`: clips the content when it is larger than the element’s container. The element will not be scrollable and the users will not be able to access the clipped content by dragging or using a scroll wheel on a mouse. - `visible`: the content that extends beyond the element’s container is visible.                                                                                                                 |
| `accessibilityRole`       | `AccessibilityRole &#124; undefined`                                                                                                                 | Sets the semantic meaning of the component’s content. When set, the role will be used by assistive technologies to help users navigate the page.                                                                                                                                                                                                                                                                                                                          |
| `border`                  | `BorderShorthand &#124; undefined`                                                                                                                   | Set the border via the shorthand property. This can be a size, optionally followed by a color, optionally followed by a style. If the color is not specified, it will be `base`. If the style is not specified, it will be `auto`. Values can be overridden by `borderWidth`, `borderStyle`, and `borderColor`.                                                                                                                                                           |
| `display`                 | `MaybeResponsive&lt;"none" &#124; "auto"&gt; &#124; undefined`                                                                                       | Sets the outer [display](https://developer.mozilla.org/en-US/docs/Web/CSS/display) type of the component. The outer type sets a component's participation in [flow layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flow_layout). - `auto` the component's initial value. The actual value depends on the component and context. - `none` hides the component from display and removes it from the accessibility tree, making it invisible to screen readers. |
| `children`                | `ReactNode`                                                                                                                                          | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `background`              | `BoxBackgroundType &#124; undefined`                                                                                                                 | Adjust the background of the component ('transparent' &#124; 'base' &#124; 'subdued' &#124; 'strong' or legacy Polaris alias).                                                                                                                                                                                                                                                                                                                                            |
| `borderWidth`             | `BoxBorderWidthType &#124; undefined`                                                                                                                | Adjust the width of the border ('small-100' &#124; 'small' &#124; 'base' &#124; 'large' &#124; 'large-100' &#124; 'none' &#124; legacy token).                                                                                                                                                                                                                                                                                                                            |
| `borderStyle`             | `BoxBorderStyleType &#124; undefined`                                                                                                                | Adjust the style of the border ('solid' &#124; 'dashed' &#124; 'dotted' &#124; 'none' &#124; '').                                                                                                                                                                                                                                                                                                                                                                         |
| `borderColor`             | `BoxBorderColorType &#124; undefined`                                                                                                                | Adjust the color of the border ('subdued' &#124; 'base' &#124; 'strong' &#124; 'transparent' &#124; legacy token).                                                                                                                                                                                                                                                                                                                                                        |
| `borderRadius`            | `BoxBorderRadiusType &#124; undefined`                                                                                                               | Adjust the radius of the border ('none' &#124; 'small-100' &#124; 'small' &#124; 'base' &#124; 'large' &#124; 'large-100' &#124; 'max' &#124; 'full' &#124; legacy token).                                                                                                                                                                                                                                                                                                |
| `padding`                 | `ResponsivePropType&lt;BoxPaddingType&gt; &#124; undefined`                                                                                          | Adjust the padding of all edges using 1-to-4-value flow-relative syntax or responsive keyword. Order: block-start inline-end block-end inline-start. Accepts modern SizeKeyword tokens ('small-200', 'base') as well as legacy Polaris numeric tokens ('200', '400').                                                                                                                                                                                                     |
| `paddingBlock`            | `ResponsivePropType&lt;BoxPaddingDirectionType&gt; &#124; undefined`                                                                                 | Adjust the block-padding (overrides block value of padding).                                                                                                                                                                                                                                                                                                                                                                                                              |
| `paddingBlockStart`       | `ResponsivePropType&lt;BoxPaddingDirectionType&gt; &#124; undefined`                                                                                 | Adjust the block-start padding (overrides block-start of paddingBlock).                                                                                                                                                                                                                                                                                                                                                                                                   |
| `paddingBlockEnd`         | `ResponsivePropType&lt;BoxPaddingDirectionType&gt; &#124; undefined`                                                                                 | Adjust the block-end padding (overrides block-end of paddingBlock).                                                                                                                                                                                                                                                                                                                                                                                                       |
| `paddingInline`           | `ResponsivePropType&lt;BoxPaddingDirectionType&gt; &#124; undefined`                                                                                 | Adjust the inline padding (overrides inline value of padding).                                                                                                                                                                                                                                                                                                                                                                                                            |
| `paddingInlineStart`      | `ResponsivePropType&lt;BoxPaddingDirectionType&gt; &#124; undefined`                                                                                 | Adjust the inline-start padding (overrides inline-start of paddingInline).                                                                                                                                                                                                                                                                                                                                                                                                |
| `paddingInlineEnd`        | `ResponsivePropType&lt;BoxPaddingDirectionType&gt; &#124; undefined`                                                                                 | Adjust the inline-end padding (overrides inline-end of paddingInline).                                                                                                                                                                                                                                                                                                                                                                                                    |
| `target`                  | `TargetType &#124; undefined`                                                                                                                        | Target browsing context for navigation ('_blank' &#124; '_self' &#124; '_parent' &#124; '_top').                                                                                                                                                                                                                                                                                                                                                                          |
| `inlineSize`              | `"fill" &#124; SizeUnitsOrAuto &#124; undefined`                                                                                                     | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `external`                | `boolean &#124; undefined`                                                                                                                           | Convenience prop: opens link in a new tab with rel="noopener noreferrer".                                                                                                                                                                                                                                                                                                                                                                                                 |
| `type`                    | `ClickableButtonType &#124; undefined`                                                                                                               | Button behavior type ('button' &#124; 'submit' &#124; 'reset').                                                                                                                                                                                                                                                                                                                                                                                                           |
| `onClick`                 | `((event: MouseEvent&lt;Element, MouseEvent&gt;) =&gt; void) &#124; null &#124; undefined`                                                           | Callback fired on click.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `role`                    | `string &#124; undefined`                                                                                                                            | ARIA role, for a clickable standing in as a listbox option or similar.                                                                                                                                                                                                                                                                                                                                                                                                    |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `as`: HTML Element type in legacy Polaris React. In Polaris web components, the element is always `<s-box>`.
> - `color`: Color of children text.
> - `borderBlockStartWidth`: Vertical start border width.
> - `borderBlockEndWidth`: Vertical end border width.
> - `borderInlineStartWidth`: Horizontal start border width.
> - `borderInlineEndWidth`: Horizontal end border width.
> - `borderStartStartRadius`: Vertical start horizontal start border radius.
> - `borderStartEndRadius`: Vertical start horizontal end border radius.
> - `borderEndStartRadius`: Vertical end horizontal start border radius.
> - `borderEndEndRadius`: Vertical end horizontal end border radius.
> - `overflowX`: Horizontal content clipping ('hidden' | 'scroll' | 'clip').
> - `overflowY`: Vertical content clipping ('hidden' | 'scroll' | 'clip').
> - `shadow`: Box shadow alias or CSS box-shadow.
> - `position`: CSS positioning mode ('relative' | 'absolute' | 'fixed' | 'sticky').
> - `insetBlockStart`: Top position offset.
> - `insetBlockEnd`: Bottom position offset.
> - `insetInlineStart`: Left position offset.
> - `insetInlineEnd`: Right position offset.
> - `opacity`: Opacity of box.
> - `outlineColor`: Outline color.
> - `outlineStyle`: Outline style ('solid' | 'dashed').
> - `outlineWidth`: Outline width.
> - `printHidden`: Visually hides content during print.
> - `visuallyHidden`: Visually hides the content while keeping it accessible to screen readers.
>   In modern Polaris web components, this maps directly to `accessibilityVisibility="exclusive"`.
> - `zIndex`: Z-index layer of box.
> - `width`: Legacy dimension alias. Use `inlineSize` in modern code.
> - `minWidth`: Legacy dimension alias. Use `minInlineSize` in modern code.
> - `maxWidth`: Legacy dimension alias. Use `maxInlineSize` in modern code.
> - `height`: Legacy dimension alias. Use `blockSize` in modern code.
> - `minHeight`: Legacy dimension alias. Use `minBlockSize` in modern code.
> - `maxHeight`: Legacy dimension alias. Use `maxBlockSize` in modern code.

#### Example

```tsx
<Clickable onClick={() => handleClick()} padding="base">
  <Text>Clickable Row</Text>
</Clickable>
```

---

### Collapsible

Smoothly animated expand/collapse container.

```tsx
import { Collapsible } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                      | Type                                                                                      | Description                                                                                                                                                                                                          |
| :------------------------ | :---------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `expanded`                | `boolean &#124; undefined`                                                                | Controlled expanded state. Omit to let the component manage its own state via `defaultExpanded`.                                                                                                                     |
| `separator`               | `boolean &#124; undefined`                                                                | Whether to show a separator between the target and the content.                                                                                                                                                      |
| `defaultExpanded`         | `boolean &#124; undefined`                                                                | Initial expanded state when uncontrolled.                                                                                                                                                                            |
| `onExpandedChange`        | `((expanded: boolean) =&gt; void) &#124; undefined`                                       | Fired whenever the expanded state changes, whether controlled or uncontrolled.                                                                                                                                       |
| `children` **(required)** | `ReactNode &#124; ((props: CollapsibleRenderPropsType) =&gt; ReactNode)`                  | The always-visible target — a card grid, a row header, a trigger button. Accepts a render function to read the current expanded state and its `toggle`/`expand`/`collapse` helpers (e.g. to build a custom trigger). |
| `framed`                  | `boolean &#124; undefined`                                                                | Frames the target and content together with a shared border/background while expanded, so individual targets (e.g. cards) can drop their own outline and read as one grouped surface.                                |
| `duration`                | `number &#124; undefined`                                                                 | Expand/collapse transition duration, in milliseconds.                                                                                                                                                                |
| `easing`                  | `string &#124; undefined`                                                                 | Transition timing function applied to the expand/collapse animation.                                                                                                                                                 |
| `accessibilityLabel`      | `string &#124; undefined`                                                                 | Accessible label for the root wrapper.                                                                                                                                                                               |
| `id`                      | `string &#124; undefined`                                                                 | Id applied to the content region (and used to derive `aria-controls`).                                                                                                                                               |
| `content`                 | `ReactNode &#124; ((props: CollapsibleRenderPropsType) =&gt; ReactNode) &#124; undefined` | The collapsible region revealed when expanded. Stays mounted so the height animation works for content of any size. Accepts a render function for the expanded state and helpers.                                    |

#### Example

```tsx
<Collapsible expanded={open}>
  <Box padding="base">
    <Text>Expanded collapsible details</Text>
  </Box>
</Collapsible>
```

---

### ColorField

Color picker input wrapping `<s-color-field>` with optional alpha channel.

```tsx
import { ColorField } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                           | Type                                                        | Description                                                                     |
| :----------------------------- | :---------------------------------------------------------- | :------------------------------------------------------------------------------ |
| `label` **(required)**         | `ReactNode`                                                 | —                                                                               |
| `value`                        | `string &#124; undefined`                                   | —                                                                               |
| `defaultValue`                 | `string &#124; undefined`                                   | —                                                                               |
| `alpha`                        | `boolean &#124; undefined`                                  | —                                                                               |
| `onChange`                     | `((value: string, id: string) =&gt; void) &#124; undefined` | Legacy signature: fires on every change, mirroring `s-color-field`'s `onInput`. |
| `onBlur`                       | `((event: Event) =&gt; void) &#124; undefined`              | —                                                                               |
| `onFocus`                      | `((event: Event) =&gt; void) &#124; undefined`              | —                                                                               |
| `placeholder`                  | `string &#124; undefined`                                   | —                                                                               |
| `disabled`                     | `boolean &#124; undefined`                                  | —                                                                               |
| `readOnly`                     | `boolean &#124; undefined`                                  | —                                                                               |
| `error`                        | `ReactNode`                                                 | —                                                                               |
| `helpText`                     | `ReactNode`                                                 | —                                                                               |
| `details`                      | `ReactNode`                                                 | —                                                                               |
| `prefix`                       | `ReactNode`                                                 | —                                                                               |
| `suffix`                       | `ReactNode`                                                 | —                                                                               |
| `autoComplete`                 | `string &#124; undefined`                                   | —                                                                               |
| `labelAccessibilityVisibility` | `"visible" &#124; "exclusive" &#124; undefined`             | —                                                                               |
| `id`                           | `string &#124; undefined`                                   | —                                                                               |
| `name`                         | `string &#124; undefined`                                   | —                                                                               |
| `requiredIndicator`            | `boolean &#124; undefined`                                  | —                                                                               |
| `className`                    | `string &#124; undefined`                                   | —                                                                               |

#### Example

```tsx
<ColorField label="Theme Color" value={hex} alpha onChange={(val) => setHex(val)} />
```

---

### Combobox

Accessible autocomplete and combobox popover control.

```tsx
import { Combobox } from "@xco-agency/corex-ui";
```

#### Subcomponents

| Subcomponent       | Description                                           | Key Props                                                |
| :----------------- | :---------------------------------------------------- | :------------------------------------------------------- |
| `Combobox.Input`   | Input field for search filtering and selected tags.   | `placeholder?, showClear?, label?, helpText?, disabled?` |
| `Combobox.Content` | Popover container wrapping the option list.           | `children`                                               |
| `Combobox.List`    | List container for combobox items.                    | `children`                                               |
| `Combobox.Item`    | Selectable item in combobox list.                     | `value: string, children`                                |
| `Combobox.Empty`   | Rendered when no combobox options match search query. | `children`                                               |

#### Modern Props

| Prop                 | Type                                                                                 | Description                                                     |
| :------------------- | :----------------------------------------------------------------------------------- | :-------------------------------------------------------------- |
| `items`              | `readonly T[] &#124; undefined`                                                      | The collection of items for combobox suggestions.               |
| `itemToStringValue`  | `((item: T) =&gt; string) &#124; undefined`                                          | Convert item to string representation for display and search.   |
| `value`              | `any`                                                                                | Controlled value (or array of values if multiple).              |
| `defaultValue`       | `any`                                                                                | Initial uncontrolled value.                                     |
| `onValueChange`      | `((value: any) =&gt; void) &#124; undefined`                                         | Callback when selection changes.                                |
| `multiple`           | `boolean &#124; undefined`                                                           | Enable multi-selection (displays tags).                         |
| `open`               | `boolean &#124; undefined`                                                           | Controlled open state.                                          |
| `defaultOpen`        | `boolean &#124; undefined`                                                           | Initial uncontrolled open state.                                |
| `onOpenChange`       | `((open: boolean) =&gt; void) &#124; undefined`                                      | Callback when open state changes.                               |
| `onClose`            | `(() =&gt; void) &#124; undefined`                                                   | Callback when the popover closes.                               |
| `inputValue`         | `string &#124; undefined`                                                            | Controlled search input query.                                  |
| `onInputValueChange` | `((inputValue: string) =&gt; void) &#124; undefined`                                 | Callback when input query changes.                              |
| `filter`             | `false &#124; ((item: T, query: string) =&gt; boolean) &#124; null &#124; undefined` | Custom filter function, or false to disable built-in filtering. |
| `autoHighlight`      | `boolean &#124; undefined`                                                           | Highlight first matching suggestion automatically.              |
| `disabled`           | `boolean &#124; undefined`                                                           | Whether the combobox is disabled.                               |
| `readOnly`           | `boolean &#124; undefined`                                                           | Whether the combobox is read-only.                              |
| `id`                 | `string &#124; undefined`                                                            | —                                                               |
| `className`          | `string &#124; undefined`                                                            | —                                                               |
| `style`              | `CSSProperties &#124; undefined`                                                     | —                                                               |
| `children`           | `ReactNode`                                                                          | —                                                               |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `allowMultiple`: Removed. Use `multiple`.
> - `active`: Removed. Use `open`.
> - `activator`: Removed. Compose `Combobox.Input` as the trigger.
> - `preferredPosition / willLoadMoreOptions / onScrolledToBottom`: Removed with the v12 Listbox implementation.

#### Example

```tsx
<Combobox items={options} onValueChange={(val) => setSelected(val)}>
  <Combobox.Input placeholder="Search tags" showClear />
  <Combobox.Content>
    <Combobox.List>
      {options.map((opt) => (
        <Combobox.Item key={opt.value} value={opt.value}>
          {opt.label}
        </Combobox.Item>
      ))}
    </Combobox.List>
  </Combobox.Content>
</Combobox>
```

---

### DateField

Single date field input wrapping `<s-date-field>`.

```tsx
import { DateField } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                           | Type                                                                                                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| :----------------------------- | :------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                           | `string &#124; undefined`                                                                                                 | A unique identifier for the element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `defaultValue`                 | `string &#124; undefined`                                                                                                 | The default value for the field.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `slot`                         | `Lowercase&lt;string&gt; &#124; undefined`                                                                                | Assigns this element to a parent's slot.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `onFocus`                      | `((event: CallbackEvent&lt;"s-date-field"&gt;) =&gt; void) &#124; null &#124; undefined`                                  | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `onBlur`                       | `((event: CallbackEvent&lt;"s-date-field"&gt;) =&gt; void) &#124; null &#124; undefined`                                  | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `onChange`                     | `(((event: CallbackEvent&lt;"s-date-field"&gt;) =&gt; void) & ((value: string, id: string) =&gt; void)) &#124; undefined` | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `onInput`                      | `((event: CallbackEvent&lt;"s-date-field"&gt;) =&gt; void) &#124; null &#124; undefined`                                  | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `placeholder`                  | `string &#124; undefined`                                                                                                 | A short hint that describes the expected value of the field.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `disabled`                     | `boolean &#124; undefined`                                                                                                | Disables the field, disallowing any interaction.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `name`                         | `string &#124; undefined`                                                                                                 | An identifier for the field that is unique within the nearest containing form.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `view`                         | `string &#124; undefined`                                                                                                 | Displayed month in `YYYY-MM` format. `onViewChange` is called when this value changes. Defaults to `defaultView`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `error`                        | `string &#124; undefined`                                                                                                 | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `required`                     | `boolean &#124; undefined`                                                                                                | Whether the field needs a value. This requirement adds semantic value to the field, but it will not cause an error to appear automatically. If you want to present an error when this field is empty, you can do so with the `error` property.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `labelAccessibilityVisibility` | `"visible" &#124; "exclusive" &#124; undefined`                                                                           | Changes the visibility of the component's label. - `visible`: the label is visible to all users. - `exclusive`: the label is visually hidden but remains in the accessibility tree.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `readOnly`                     | `boolean &#124; undefined`                                                                                                | The field cannot be edited by the user. It is focusable will be announced by screen readers.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `autocomplete`                 | `string`                                                                                                                  | A hint as to the intended content of the field. When set to `on` (the default), this property indicates that the field should support autofill, but you do not have any more semantic information on the intended contents. When set to `off`, you are indicating that this field contains sensitive information, or contents that are never saved, like one-time codes. Alternatively, you can provide value which describes the specific data you would like to be entered into this field during autofill.                                                                                                                                                                                                                                                                                                                                     |
| `allow`                        | `string &#124; undefined`                                                                                                 | Dates that can be selected. A comma-separated list of dates, date ranges. Whitespace is allowed after commas. The default `''` allows all dates. - Dates in `YYYY-MM-DD` format allow a single date. - Dates in `YYYY-MM` format allow a whole month. - Dates in `YYYY` format allow a whole year. - Ranges are expressed as `start--end`. - Ranges are inclusive. - If either `start` or `end` is omitted, the range is unbounded in that direction. - If parts of the date are omitted for `start`, they are assumed to be the minimum possible value. So `2024--` is equivalent to `2024-01-01--`. - If parts of the date are omitted for `end`, they are assumed to be the maximum possible value. So `--2024` is equivalent to `--2024-12-31`. - Whitespace is allowed either side of `--`.                                                  |
| `allowDays`                    | `string &#124; undefined`                                                                                                 | Days of the week that can be selected. These intersect with the result of `allow` and `disallow`. A comma-separated list of days. Whitespace is allowed after commas. The default `''` has no effect on the result of `allow` and `disallow`. Days are `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `disallow`                     | `string &#124; undefined`                                                                                                 | Dates that cannot be selected. These subtract from `allow`. A comma-separated list of dates, date ranges. Whitespace is allowed after commas. The default `''` has no effect on `allow`. - Dates in `YYYY-MM-DD` format disallow a single date. - Dates in `YYYY-MM` format disallow a whole month. - Dates in `YYYY` format disallow a whole year. - Ranges are expressed as `start--end`. - Ranges are inclusive. - If either `start` or `end` is omitted, the range is unbounded in that direction. - If parts of the date are omitted for `start`, they are assumed to be the minimum possible value. So `2024--` is equivalent to `2024-01-01--`. - If parts of the date are omitted for `end`, they are assumed to be the maximum possible value. So `--2024` is equivalent to `--2024-12-31`. - Whitespace is allowed either side of `--`. |
| `disallowDays`                 | `string &#124; undefined`                                                                                                 | Days of the week that cannot be selected. This subtracts from `allowDays`, and intersects with the result of `allow` and `disallow`. A comma-separated list of days. Whitespace is allowed after commas. The default `''` has no effect on `allowDays`. Days are `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `defaultView`                  | `string &#124; undefined`                                                                                                 | Default month to display in `YYYY-MM` format. This value is used until `view` is set, either directly or as a result of user interaction. Defaults to the current month in the user's locale.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `onViewChange`                 | `((event: CallbackEvent&lt;"s-date-field"&gt;) =&gt; void) &#124; null &#124; undefined`                                  | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `label` **(required)**         | `ReactNode`                                                                                                               | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `value`                        | `string &#124; undefined`                                                                                                 | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `helpText`                     | `ReactNode`                                                                                                               | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `details`                      | `ReactNode`                                                                                                               | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `className`                    | `string &#124; undefined`                                                                                                 | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

#### Example

```tsx
<DateField label="Start Date" value={date} onChange={(val) => setDate(val)} />
```

---

### DatePicker

Calendar date picker supporting preset ranges, single dates, and date ranges.

```tsx
import { DatePicker } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop           | Type                                                                                                                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| :------------- | :---------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`           | `string &#124; undefined`                                                                                                           | A unique identifier for the element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `defaultValue` | `(string & DatePickerValueType) &#124; undefined`                                                                                   | Default selected value. The default means no date is selected. If the provided value is invalid, no date is selected. - If `type="single"`, this is a date in `YYYY-MM-DD` format. - If `type="multiple"`, this is a comma-separated list of dates in `YYYY-MM-DD` format. - If `type="range"`, this is a range in `YYYY-MM-DD--YYYY-MM-DD` format. The range is inclusive. Default initial date or range when uncontrolled.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `slot`         | `Lowercase&lt;string&gt; &#124; undefined`                                                                                          | Assigns this element to a parent's slot.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `onFocus`      | `((event: CallbackEvent&lt;"s-date-picker"&gt;) =&gt; void) &#124; null &#124; undefined`                                           | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `onBlur`       | `((event: CallbackEvent&lt;"s-date-picker"&gt;) =&gt; void) &#124; null &#124; undefined`                                           | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `onChange`     | `(((event: CallbackEvent&lt;"s-date-picker"&gt;) =&gt; void) & ((value: string &#124; DateRangeType) =&gt; void)) &#124; undefined` | Callback fired when date or range changes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `onInput`      | `((event: CallbackEvent&lt;"s-date-picker"&gt;) =&gt; void) &#124; null &#124; undefined`                                           | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `value`        | `string &#124; undefined`                                                                                                           | Current selected value. The default means no date is selected. If the provided value is invalid, no date is selected. Otherwise: - If `type="single"`, this is a date in `YYYY-MM-DD` format. - If `type="multiple"`, this is a comma-separated list of dates in `YYYY-MM-DD` format. - If `type="range"`, this is a range in `YYYY-MM-DD--YYYY-MM-DD` format. The range is inclusive.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `name`         | `string &#124; undefined`                                                                                                           | An identifier for the field that is unique within the nearest containing form.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `type`         | `"single" &#124; "range" &#124; undefined`                                                                                          | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `view`         | `string &#124; undefined`                                                                                                           | Displayed month in `YYYY-MM` format. `onViewChange` is called when this value changes. Defaults to `defaultView`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `allow`        | `string &#124; undefined`                                                                                                           | Dates that can be selected. A comma-separated list of dates, date ranges. Whitespace is allowed after commas. The default `''` allows all dates. - Dates in `YYYY-MM-DD` format allow a single date. - Dates in `YYYY-MM` format allow a whole month. - Dates in `YYYY` format allow a whole year. - Ranges are expressed as `start--end`. - Ranges are inclusive. - If either `start` or `end` is omitted, the range is unbounded in that direction. - If parts of the date are omitted for `start`, they are assumed to be the minimum possible value. So `2024--` is equivalent to `2024-01-01--`. - If parts of the date are omitted for `end`, they are assumed to be the maximum possible value. So `--2024` is equivalent to `--2024-12-31`. - Whitespace is allowed either side of `--`.                                                  |
| `allowDays`    | `string &#124; undefined`                                                                                                           | Days of the week that can be selected. These intersect with the result of `allow` and `disallow`. A comma-separated list of days. Whitespace is allowed after commas. The default `''` has no effect on the result of `allow` and `disallow`. Days are `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `disallow`     | `string &#124; undefined`                                                                                                           | Dates that cannot be selected. These subtract from `allow`. A comma-separated list of dates, date ranges. Whitespace is allowed after commas. The default `''` has no effect on `allow`. - Dates in `YYYY-MM-DD` format disallow a single date. - Dates in `YYYY-MM` format disallow a whole month. - Dates in `YYYY` format disallow a whole year. - Ranges are expressed as `start--end`. - Ranges are inclusive. - If either `start` or `end` is omitted, the range is unbounded in that direction. - If parts of the date are omitted for `start`, they are assumed to be the minimum possible value. So `2024--` is equivalent to `2024-01-01--`. - If parts of the date are omitted for `end`, they are assumed to be the maximum possible value. So `--2024` is equivalent to `--2024-12-31`. - Whitespace is allowed either side of `--`. |
| `disallowDays` | `string &#124; undefined`                                                                                                           | Days of the week that cannot be selected. This subtracts from `allowDays`, and intersects with the result of `allow` and `disallow`. A comma-separated list of days. Whitespace is allowed after commas. The default `''` has no effect on `allowDays`. Days are `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `defaultView`  | `string &#124; undefined`                                                                                                           | Default month to display in `YYYY-MM` format. This value is used until `view` is set, either directly or as a result of user interaction. Defaults to the current month in the user's locale.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `onViewChange` | `((event: CallbackEvent&lt;"s-date-picker"&gt;) =&gt; void) &#124; null &#124; undefined`                                           | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `selected`     | `DatePickerValueType &#124; undefined`                                                                                              | Selected single date (`"2026-09-05"`), date range object (`{ start: "2026-01-01", end: "2026-09-05" }`), or Date.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `onApply`      | `((range: DateRangeType, meta?: { presetId?: string &#124; undefined; } &#124; undefined) =&gt; void) &#124; undefined`             | Callback fired when user clicks the "Apply" button. When the applied range came from a preset (rather than a manual/calendar selection), `meta.presetId` names it — persist that id instead of the resolved range so relative presets (e.g. "Last 7 days") stay dynamic across reloads instead of freezing to today's dates.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `onCancel`     | `(() =&gt; void) &#124; undefined`                                                                                                  | Callback fired when user clicks the "Cancel" button.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `presets`      | `boolean &#124; DatePresetItemType[] &#124; undefined`                                                                              | Whether to display the left presets sidebar. If `true`, standard presets are used. If an array of `DatePresetItemType`, custom presets are rendered. If `false` or omitted/empty, the left presets sidebar is hidden.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `inline`       | `boolean &#124; undefined`                                                                                                          | If `true`, the date picker panel is rendered inline. If `false` (default), renders an activator button that opens the date picker in a Popover.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `children`     | `((formattedRange: string, id: string) =&gt; ReactNode) &#124; undefined`                                                           | children element when rendered as a popover.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `allowRange`   | `boolean &#124; undefined`                                                                                                          | Whether range selection is allowed (default: true).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `minDate`      | `string &#124; undefined`                                                                                                           | Earliest selectable date (inclusive), as an ISO date string (`"2026-01-01"`). Unset by default.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `maxDate`      | `string &#124; undefined`                                                                                                           | Latest selectable date (inclusive), as an ISO date string (`"2026-12-31"`). Defaults to today, disabling future dates. Pass an explicit future date to allow picking beyond today.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `disabled`     | `boolean &#124; undefined`                                                                                                          | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `className`    | `string &#124; undefined`                                                                                                           | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `style`        | `CSSProperties &#124; undefined`                                                                                                    | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `activator`: use `children` instead

#### Example

```tsx
<DatePicker
  selected={selectedRange}
  onApply={(range) => setSelectedRange(range)}
  allowRange
/>
```

---

### DescriptionList

Definition list mapping terms to descriptions.

```tsx
import { DescriptionList } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop        | Type                                         | Description                                                                                                                               |
| :---------- | :------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `items`     | `DescriptionListItemType[] &#124; undefined` | —                                                                                                                                         |
| `gap`       | `PolarisSpacingType`                         | Spacing between elements. Use modern Polaris spacing tokens ("none", "small-500"..."large-500", "base"). Never use legacy numeric tokens. |
| `id`        | `string &#124; undefined`                    | —                                                                                                                                         |
| `className` | `string &#124; undefined`                    | —                                                                                                                                         |
| `style`     | `CSSProperties &#124; undefined`             | —                                                                                                                                         |

#### Example

```tsx
<DescriptionList
  items={[
    { term: "Plan", description: "Shopify Plus" },
    { term: "Status", description: "Active" },
  ]}
/>
```

---

### Selectable

Wraps a card or any element and draws a toned outline while it is selected. Use it instead of hand-rolled borders for selectable cards (plans, channels, options).

```tsx
import { Selectable } from "@xco-agency/corex-ui";
```

Wraps a card or any element and draws a toned outline around it while it is selected.
Built on plain elements (not a Polaris web component), so the outline works on any content.

```tsx
import { Selectable, Card, Text } from "@xco-agency/corex-ui";

<Selectable tone="success" indicator onSelectedChange={(selected) => {}}>
  <Card>
    <Text>Online Store</Text>
  </Card>
</Selectable>;
```

#### Props

| Prop                 | Type                                                          | Default  | Description                                              |
| -------------------- | ------------------------------------------------------------- | -------- | -------------------------------------------------------- |
| `selected`           | `boolean`                                                     | —        | Controlled state.                                        |
| `defaultSelected`    | `boolean`                                                     | `false`  | Initial state when uncontrolled.                         |
| `onSelectedChange`   | `(selected: boolean) => void`                                 | —        | Click, Space or Enter toggles it.                        |
| `value`              | `string`                                                      | —        | Identifies the item inside a `Selectable.Group`.         |
| `tone`               | `"info" \| "success" \| "warning" \| "critical" \| "neutral"` | `"info"` | Outline colour (`auto` = info, `caution` = warning).     |
| `interactive`        | `boolean`                                                     | `true`   | `false` makes it a highlight only, driven by `selected`. |
| `disabled`           | `boolean`                                                     | —        | Dims the item and blocks interaction.                    |
| `indicator`          | `boolean`                                                     | `false`  | Check badge in the corner while selected.                |
| `outlineWidth`       | `1 \| 2 \| 3`                                                 | `2`      | Outline thickness in px.                                 |
| `outlineOffset`      | `number`                                                      | `0`      | Gap between content and outline in px.                   |
| `borderRadius`       | `"none" \| "small" \| "base" \| "large" \| "large-100"`       | `"base"` | Match the wrapped element's corners.                     |
| `inlineSize`         | `"fill" \| "auto"`                                            | `"fill"` | Width of the wrapper.                                    |
| `accessibilityLabel` | `string`                                                      | —        | Accessible name.                                         |

#### `Selectable.Group`

Owns the selection of several items: radio-like by default, or `multiple`.

```tsx
<Selectable.Group value={plan} onChange={setPlan} accessibilityLabel="Plan">
  <Selectable value="starter">…</Selectable>
  <Selectable value="growth">…</Selectable>
</Selectable.Group>
```

`value` / `defaultValue` are arrays of selected values, `onChange` receives the full array,
and `tone` / `disabled` apply to every item that doesn't set its own.

#### Accessibility

Interactive items expose `role="checkbox"` (or `"radio"` in a single-select group) with
`aria-checked`, are focusable, and show a focus ring. Highlight-only items (`interactive={false}`)
have no role and set `aria-current` while selected.

#### Theming

Override the outline colours with `--cx-selectable-info`, `-success`, `-warning`, `-critical`
and `-neutral` on any ancestor.

---

### Divider

Visual separating line wrapping `<s-divider>`.

```tsx
import { Divider } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop        | Type                                       | Description                                                                                                                                               |
| :---------- | :----------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`        | `string &#124; undefined`                  | A unique identifier for the element.                                                                                                                      |
| `slot`      | `Lowercase&lt;string&gt; &#124; undefined` | Assigns this element to a parent's slot.                                                                                                                  |
| `color`     | `"base" &#124; "strong" &#124; undefined`  | Modify the color to be more or less intense.                                                                                                              |
| `direction` | `"inline" &#124; "block" &#124; undefined` | Specify the direction of the divider. This uses [logical properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values). |

#### Example

```tsx
<Divider direction="inline" />
```

---

### DropZone

File drag-and-drop zone wrapping `<s-drop-zone>`.

```tsx
import { DropZone } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                           | Type                                            | Description                                                                                                                                                                                                                                                                                     |
| :----------------------------- | :---------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`                        | `ReactNode`                                     | —                                                                                                                                                                                                                                                                                               |
| `accept`                       | `string &#124; undefined`                       | —                                                                                                                                                                                                                                                                                               |
| `multiple`                     | `boolean &#124; undefined`                      | —                                                                                                                                                                                                                                                                                               |
| `allowMultiple`                | `boolean &#124; undefined`                      | Alias for `multiple` for backwards-compatibility.                                                                                                                                                                                                                                               |
| `accessibilityLabel`           | `string &#124; undefined`                       | —                                                                                                                                                                                                                                                                                               |
| `labelAccessibilityVisibility` | `"visible" &#124; "exclusive" &#124; undefined` | —                                                                                                                                                                                                                                                                                               |
| `disabled`                     | `boolean &#124; undefined`                      | —                                                                                                                                                                                                                                                                                               |
| `error`                        | `ReactNode`                                     | —                                                                                                                                                                                                                                                                                               |
| `helpText`                     | `ReactNode`                                     | —                                                                                                                                                                                                                                                                                               |
| `details`                      | `ReactNode`                                     | —                                                                                                                                                                                                                                                                                               |
| `requiredIndicator`            | `boolean &#124; undefined`                      | —                                                                                                                                                                                                                                                                                               |
| `required`                     | `boolean &#124; undefined`                      | —                                                                                                                                                                                                                                                                                               |
| `id`                           | `string &#124; undefined`                       | —                                                                                                                                                                                                                                                                                               |
| `name`                         | `string &#124; undefined`                       | —                                                                                                                                                                                                                                                                                               |
| `value`                        | `string &#124; undefined`                       | —                                                                                                                                                                                                                                                                                               |
| `files`                        | `File[] &#124; undefined`                       | —                                                                                                                                                                                                                                                                                               |
| `onChange`                     | `((event: Event) =&gt; void) &#124; undefined`  | —                                                                                                                                                                                                                                                                                               |
| `onDrop`                       | `((files: File[]) =&gt; void) &#124; undefined` | v12's callback, called with the files the element accepted. v12 also passed the rejected ones as a third argument; `s-drop-zone` reports only what it accepted, so that argument is not offered rather than filled with a guess — `onDropRejected` is the element's own signal for a rejection. |
| `onInput`                      | `((event: Event) =&gt; void) &#124; undefined`  | —                                                                                                                                                                                                                                                                                               |
| `onDropRejected`               | `((event: Event) =&gt; void) &#124; undefined`  | —                                                                                                                                                                                                                                                                                               |
| `onBlur`                       | `((event: Event) =&gt; void) &#124; undefined`  | —                                                                                                                                                                                                                                                                                               |
| `onFocus`                      | `((event: Event) =&gt; void) &#124; undefined`  | —                                                                                                                                                                                                                                                                                               |
| `children`                     | `ReactNode`                                     | —                                                                                                                                                                                                                                                                                               |
| `className`                    | `string &#124; undefined`                       | —                                                                                                                                                                                                                                                                                               |

#### Example

```tsx
<DropZone
  label="Upload images"
  accept="image/*"
  multiple
  onDrop={(files) => handleFiles(files)}
/>
```

---

### EmailField

Email input wrapping `<s-email-field>` with built-in email keyboard and validation.

```tsx
import { EmailField } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                           | Type                                                        | Description                                                                        |
| :----------------------------- | :---------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| `label` **(required)**         | `ReactNode`                                                 | —                                                                                  |
| `value`                        | `string &#124; undefined`                                   | —                                                                                  |
| `defaultValue`                 | `string &#124; undefined`                                   | —                                                                                  |
| `minLength`                    | `number &#124; undefined`                                   | —                                                                                  |
| `maxLength`                    | `number &#124; undefined`                                   | —                                                                                  |
| `onChange`                     | `((value: string, id: string) =&gt; void) &#124; undefined` | Legacy signature: fires on every keystroke, mirroring `s-email-field`'s `onInput`. |
| `onBlur`                       | `((event: Event) =&gt; void) &#124; undefined`              | —                                                                                  |
| `onFocus`                      | `((event: Event) =&gt; void) &#124; undefined`              | —                                                                                  |
| `placeholder`                  | `string &#124; undefined`                                   | —                                                                                  |
| `disabled`                     | `boolean &#124; undefined`                                  | —                                                                                  |
| `readOnly`                     | `boolean &#124; undefined`                                  | —                                                                                  |
| `error`                        | `ReactNode`                                                 | —                                                                                  |
| `helpText`                     | `ReactNode`                                                 | —                                                                                  |
| `details`                      | `ReactNode`                                                 | —                                                                                  |
| `prefix`                       | `ReactNode`                                                 | —                                                                                  |
| `suffix`                       | `ReactNode`                                                 | —                                                                                  |
| `autoComplete`                 | `string &#124; undefined`                                   | —                                                                                  |
| `labelAccessibilityVisibility` | `"visible" &#124; "exclusive" &#124; undefined`             | —                                                                                  |
| `id`                           | `string &#124; undefined`                                   | —                                                                                  |
| `name`                         | `string &#124; undefined`                                   | —                                                                                  |
| `requiredIndicator`            | `boolean &#124; undefined`                                  | —                                                                                  |
| `className`                    | `string &#124; undefined`                                   | —                                                                                  |

#### Example

```tsx
<EmailField label="Customer Email" value={email} onChange={(val) => setEmail(val)} />
```

---

### EmptyState

Prominent placeholder UI for empty screens or zero search results.

```tsx
import { EmptyState } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop              | Type                                                                                | Description                                                                          |
| :---------------- | :---------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------- |
| `heading`         | `ReactNode`                                                                         | The heading title for the empty state.                                               |
| `title`           | `ReactNode`                                                                         | Legacy Polaris alias for `heading`.                                                  |
| `action`          | `ReactNode &#124; EmptyStateActionType`                                             | Primary action button descriptor or custom React node.                               |
| `secondaryAction` | `ReactNode &#124; EmptyStateActionType`                                             | Secondary action button descriptor or custom React node.                             |
| `image`           | `ReactNode`                                                                         | Primary illustration / image: URL string or custom ReactNode (SVG, Image component). |
| `largeImage`      | `ReactNode`                                                                         | Larger image alternative URL or ReactNode for wider screens.                         |
| `imageContained`  | `boolean &#124; undefined`                                                          | Whether the image should be constrained within a contained width.                    |
| `sectionned`      | `boolean &#124; undefined`                                                          | —                                                                                    |
| `imageAlt`        | `string &#124; undefined`                                                           | Alternative text for the image illustration.                                         |
| `icon`            | `string &#124; number &#124; boolean &#124; ReactElement&lt;any, string &#124; ...` | Polaris icon name or icon component when an icon is used instead of an image.        |
| `footerContent`   | `ReactNode`                                                                         | Additional footer content displayed below the action buttons (e.g. help link).       |
| `children`        | `ReactNode`                                                                         | Main description or additional content of the empty state.                           |
| `padding`         | `BoxPaddingType &#124; undefined`                                                   | Padding using Polaris spacing tokens.                                                |
| `className`       | `string &#124; undefined`                                                           | Custom CSS class name.                                                               |
| `id`              | `string &#124; undefined`                                                           | Unique element ID.                                                                   |
| `style`           | `CSSProperties &#124; undefined`                                                    | Inline styles with Polaris CSS custom properties.                                    |

#### Example

```tsx
<EmptyState
  heading="No products found"
  action={{ content: "Add Product", onAction: () => handleAdd() }}
>
  <Text>Get started by creating your first product.</Text>
</EmptyState>
```

---

### FlexPopover

Custom floating popover with explicit positioning, anchor refs, and boundary management.

```tsx
import { FlexPopover } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                      | Type                                                        | Description                                                                           |
| :------------------------ | :---------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| `anchorId`                | `string &#124; undefined`                                   | ID of the element the popover is positioned against (resolved in the owner document). |
| `anchorRef`               | `RefObject&lt;HTMLElement &#124; null&gt; &#124; undefined` | Direct ref to the anchor element.                                                     |
| `isOpen` **(required)**   | `boolean`                                                   | —                                                                                     |
| `onClose` **(required)**  | `() =&gt; void`                                             | Fired on Escape or on pointer-down outside the popover, the anchor and `boundaryRef`. |
| `heading`                 | `ReactNode`                                                 | Optional heading displayed in the popover header. Defaults to "Filters".              |
| `closeAccessibilityLabel` | `string &#124; undefined`                                   | Optional accessibility label for the header close button.                             |
| `width`                   | `string &#124; undefined`                                   | —                                                                                     |
| `minWidth`                | `string &#124; undefined`                                   | —                                                                                     |
| `maxHeight`               | `string &#124; undefined`                                   | —                                                                                     |
| `offset`                  | `number &#124; undefined`                                   | —                                                                                     |
| `matchAnchorWidth`        | `boolean &#124; undefined`                                  | Whether the popover should match the width of the anchor element.                     |
| `boundaryRef`             | `RefObject&lt;HTMLElement &#124; null&gt; &#124; undefined` | Element whose clicks never dismiss the popover.                                       |
| `className`               | `string &#124; undefined`                                   | —                                                                                     |
| `style`                   | `CSSProperties &#124; undefined`                            | —                                                                                     |
| `zIndex`                  | `number &#124; undefined`                                   | —                                                                                     |
| `noHeader`                | `boolean &#124; undefined`                                  | —                                                                                     |
| `children` **(required)** | `ReactNode`                                                 | —                                                                                     |

#### Example

```tsx
<FlexPopover isOpen={isOpen} onClose={() => setIsOpen(false)} heading="Filter Details">
  <Box padding="base">
    <Text>Filter options</Text>
  </Box>
</FlexPopover>
```

---

### Floating

Floating portal layer with collapse and expanding capabilities.

```tsx
import { Floating } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                 | Type                                                                     | Description                                                                                                                                                        |
| :------------------- | :----------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`           | `ReactNode &#124; ((props: FloatingRenderPropsType) =&gt; ReactNode)`    | Children rendered when floating UI is expanded (or always if not collapsible). Supports standard ReactNode or a render function receiving collapse state controls. |
| `position`           | `FloatingPositionType &#124; undefined`                                  | Position anchor on screen or relative parent container.                                                                                                            |
| `strategy`           | `FloatingStrategyType &#124; undefined`                                  | CSS positioning mode.                                                                                                                                              |
| `offset`             | `FloatingOffsetType &#124; undefined`                                    | Edge offset distance from the viewport or container boundaries. Can be a number (pixels), string (e.g. "16px", "2rem"), or object with directional offsets.        |
| `zIndex`             | `string &#124; number &#124; undefined`                                  | Z-index layer for the floating container.                                                                                                                          |
| `transparent`        | `boolean &#124; undefined`                                               | Whether the container background is transparent and allows click-through on empty regions.                                                                         |
| `collapsible`        | `boolean &#124; undefined`                                               | Whether the floating UI can be collapsed.                                                                                                                          |
| `collapsed`          | `boolean &#124; undefined`                                               | Controlled collapsed state.                                                                                                                                        |
| `defaultCollapsed`   | `boolean &#124; undefined`                                               | Default collapsed state when uncontrolled.                                                                                                                         |
| `onToggleCollapse`   | `((collapsed: boolean) =&gt; void) &#124; undefined`                     | Callback fired when collapsed state changes.                                                                                                                       |
| `onCollapsedChange`  | `((collapsed: boolean) =&gt; void) &#124; undefined`                     | Callback fired when collapsed state changes (alias).                                                                                                               |
| `collapsedContent`   | `ReactNode &#124; ((props: { expand: () =&gt; void; }) =&gt; ReactNode)` | Node to render when collapsed (e.g. floating action button or icon trigger). Supports standard ReactNode or a render function with an expand helper.               |
| `collapseTrigger`    | `ReactNode`                                                              | Optional custom collapse trigger node.                                                                                                                             |
| `accessibilityLabel` | `string &#124; undefined`                                                | Accessible label for the floating region or trigger.                                                                                                               |
| `className`          | `string &#124; undefined`                                                | Additional CSS class name for the root floating container.                                                                                                         |
| `style`              | `CSSProperties &#124; undefined`                                         | Additional inline styles for the root floating container.                                                                                                          |
| `id`                 | `string &#124; undefined`                                                | Unique ID for the floating element.                                                                                                                                |

#### Example

```tsx
<Floating position="bottom-end">
  <Card heading="Quick Support">Chat content</Card>
</Floating>
```

---

### FormLayout

Standard form layout container providing consistent spacing between inputs and input groups.

```tsx
import { FormLayout } from "@xco-agency/corex-ui";
```

#### Subcomponents

| Subcomponent       | Description                         | Key Props                                                          |
| :----------------- | :---------------------------------- | :----------------------------------------------------------------- |
| `FormLayout.Group` | Horizontal grouping of form inputs. | `title?: string, helpText?: string, condensed?: boolean, children` |

#### Modern Props

| Prop         | Type                             | Description                                                                                                                               |
| :----------- | :------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `children`   | `ReactNode`                      | —                                                                                                                                         |
| `gap`        | `PolarisSpacingType`             | Spacing between elements. Use modern Polaris spacing tokens ("none", "small-500"..."large-500", "base"). Never use legacy numeric tokens. |
| `inlineSize` | `string &#124; undefined`        | Width of the form layout. Defaults to `100%`.                                                                                             |
| `id`         | `string &#124; undefined`        | —                                                                                                                                         |
| `className`  | `string &#124; undefined`        | —                                                                                                                                         |
| `style`      | `CSSProperties &#124; undefined` | —                                                                                                                                         |

#### Example

```tsx
<FormLayout gap="base">
  <TextField label="First Name" />
  <TextField label="Last Name" />
</FormLayout>
```

---

### Grid

CSS grid container wrapping `<s-grid>`. Distributes child `<Grid.Item>` components.

```tsx
import { Grid } from "@xco-agency/corex-ui";
```

#### Subcomponents

| Subcomponent | Description                                 | Key Props                                               |
| :----------- | :------------------------------------------ | :------------------------------------------------------ |
| `Grid.Item`  | Grid item child positioned within `<Grid>`. | `columnSpan?: number, rowSpan?: number, column?: string | number, row?: string | number, area?: string, children` |

#### Modern Props

| Prop                      | Type                                                                                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| :------------------------ | :-------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                      | `string &#124; undefined`                                                                                 | A unique identifier for the element.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `accessibilityLabel`      | `string &#124; undefined`                                                                                 | A label that describes the purpose or contents of the element. When set, it will be announced to users using assistive technologies and will provide them with more context. Only use this when the element's content is not enough context for users using assistive technologies.                                                                                                                                                                                       |
| `inlineSize`              | `SizeUnitsOrAuto &#124; undefined`                                                                        | Adjust the [inline size](https://developer.mozilla.org/en-US/docs/Web/CSS/inline-size).                                                                                                                                                                                                                                                                                                                                                                                   |
| `accessibilityVisibility` | `"hidden" &#124; "visible" &#124; "exclusive" &#124; undefined`                                           | Changes the visibility of the element. - `visible`: the element is visible to all users. - `hidden`: the element is removed from the accessibility tree but remains visible. - `exclusive`: the element is visually hidden but remains in the accessibility tree.                                                                                                                                                                                                         |
| `justifyContent`          | `"" &#124; JustifyContentKeyword &#124; undefined`                                                        | Aligns the grid along the inline axis. This overrides the inline value of `placeContent`.                                                                                                                                                                                                                                                                                                                                                                                 |
| `alignItems`              | `"" &#124; AlignItemsKeyword &#124; undefined`                                                            | Aligns the grid items along the block axis.                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `alignContent`            | `"" &#124; AlignContentKeyword &#124; undefined`                                                          | Aligns the grid along the block axis. This overrides the block value of `placeContent`.                                                                                                                                                                                                                                                                                                                                                                                   |
| `minInlineSize`           | `SizeUnits &#124; undefined`                                                                              | Adjust the [minimum inline size](https://developer.mozilla.org/en-US/docs/Web/CSS/min-inline-size).                                                                                                                                                                                                                                                                                                                                                                       |
| `maxInlineSize`           | `SizeUnitsOrNone &#124; undefined`                                                                        | Adjust the [maximum inline size](https://developer.mozilla.org/en-US/docs/Web/CSS/max-inline-size).                                                                                                                                                                                                                                                                                                                                                                       |
| `blockSize`               | `SizeUnitsOrAuto &#124; undefined`                                                                        | Adjust the [block size](https://developer.mozilla.org/en-US/docs/Web/CSS/block-size).                                                                                                                                                                                                                                                                                                                                                                                     |
| `minBlockSize`            | `SizeUnits &#124; undefined`                                                                              | Adjust the [minimum block size](https://developer.mozilla.org/en-US/docs/Web/CSS/min-block-size).                                                                                                                                                                                                                                                                                                                                                                         |
| `maxBlockSize`            | `SizeUnitsOrNone &#124; undefined`                                                                        | Adjust the [maximum block size](https://developer.mozilla.org/en-US/docs/Web/CSS/max-block-size).                                                                                                                                                                                                                                                                                                                                                                         |
| `overflow`                | `"hidden" &#124; "visible" &#124; undefined`                                                              | Sets the overflow behavior of the element. - `hidden`: clips the content when it is larger than the element’s container. The element will not be scrollable and the users will not be able to access the clipped content by dragging or using a scroll wheel on a mouse. - `visible`: the content that extends beyond the element’s container is visible.                                                                                                                 |
| `accessibilityRole`       | `AccessibilityRole &#124; undefined`                                                                      | Sets the semantic meaning of the component’s content. When set, the role will be used by assistive technologies to help users navigate the page.                                                                                                                                                                                                                                                                                                                          |
| `border`                  | `BorderShorthand &#124; undefined`                                                                        | Set the border via the shorthand property. This can be a size, optionally followed by a color, optionally followed by a style. If the color is not specified, it will be `base`. If the style is not specified, it will be `auto`. Values can be overridden by `borderWidth`, `borderStyle`, and `borderColor`.                                                                                                                                                           |
| `display`                 | `MaybeResponsive&lt;"none" &#124; "auto"&gt; &#124; undefined`                                            | Sets the outer [display](https://developer.mozilla.org/en-US/docs/Web/CSS/display) type of the component. The outer type sets a component's participation in [flow layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flow_layout). - `auto` the component's initial value. The actual value depends on the component and context. - `none` hides the component from display and removes it from the accessibility tree, making it invisible to screen readers. |
| `justifyItems`            | `"" &#124; JustifyItemsKeyword &#124; undefined`                                                          | Aligns the grid items along the inline axis.                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `placeItems`              | `AlignItemsKeyword &#124; "stretch stretch" &#124; "stretch normal" &#124; "stretch center" &#124; ...`   | A shorthand property for `justify-items` and `align-items`.                                                                                                                                                                                                                                                                                                                                                                                                               |
| `placeContent`            | `AlignContentKeyword &#124; "stretch stretch" &#124; "stretch normal" &#124; "stretch center" &#124; ...` | A shorthand property for `justify-content` and `align-content`.                                                                                                                                                                                                                                                                                                                                                                                                           |
| `gridTemplateColumns`     | `string &#124; undefined`                                                                                 | Define columns and specify their size. `gridTemplateColumns` either accepts: - [track sizing values](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout#fixed_and_flexible_track_sizes) (e.g. `1fr auto`) - OR [responsive values](https://shopify.dev/docs/api/app-home/using-polaris-components#responsive-values) string with the supported track sizing values as a query value.                                          |
| `gridTemplateRows`        | `string &#124; undefined`                                                                                 | Define rows and specify their size. `gridTemplateRows` either accepts: - [track sizing values](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout#fixed_and_flexible_track_sizes) (e.g. `1fr auto`) - OR [responsive values](https://shopify.dev/docs/api/app-home/using-polaris-components#responsive-values) string with the supported track sizing values as a query value.                                                |
| `children`                | `ReactNode`                                                                                               | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `background`              | `BoxBackgroundType &#124; undefined`                                                                      | Adjust the background of the component ('transparent' &#124; 'base' &#124; 'subdued' &#124; 'strong' or legacy Polaris alias).                                                                                                                                                                                                                                                                                                                                            |
| `borderWidth`             | `BoxBorderWidthType &#124; undefined`                                                                     | Adjust the width of the border ('small-100' &#124; 'small' &#124; 'base' &#124; 'large' &#124; 'large-100' &#124; 'none' &#124; legacy token).                                                                                                                                                                                                                                                                                                                            |
| `borderStyle`             | `BoxBorderStyleType &#124; undefined`                                                                     | Adjust the style of the border ('solid' &#124; 'dashed' &#124; 'dotted' &#124; 'none' &#124; '').                                                                                                                                                                                                                                                                                                                                                                         |
| `borderColor`             | `BoxBorderColorType &#124; undefined`                                                                     | Adjust the color of the border ('subdued' &#124; 'base' &#124; 'strong' &#124; 'transparent' &#124; legacy token).                                                                                                                                                                                                                                                                                                                                                        |
| `borderRadius`            | `BoxBorderRadiusType &#124; undefined`                                                                    | Adjust the radius of the border ('none' &#124; 'small-100' &#124; 'small' &#124; 'base' &#124; 'large' &#124; 'large-100' &#124; 'max' &#124; 'full' &#124; legacy token).                                                                                                                                                                                                                                                                                                |
| `padding`                 | `ResponsivePropType&lt;BoxPaddingType&gt; &#124; undefined`                                               | Adjust the padding of all edges using 1-to-4-value flow-relative syntax or responsive keyword. Order: block-start inline-end block-end inline-start. Accepts modern SizeKeyword tokens ('small-200', 'base') as well as legacy Polaris numeric tokens ('200', '400').                                                                                                                                                                                                     |
| `paddingBlock`            | `ResponsivePropType&lt;BoxPaddingDirectionType&gt; &#124; undefined`                                      | Adjust the block-padding (overrides block value of padding).                                                                                                                                                                                                                                                                                                                                                                                                              |
| `paddingBlockStart`       | `ResponsivePropType&lt;BoxPaddingDirectionType&gt; &#124; undefined`                                      | Adjust the block-start padding (overrides block-start of paddingBlock).                                                                                                                                                                                                                                                                                                                                                                                                   |
| `paddingBlockEnd`         | `ResponsivePropType&lt;BoxPaddingDirectionType&gt; &#124; undefined`                                      | Adjust the block-end padding (overrides block-end of paddingBlock).                                                                                                                                                                                                                                                                                                                                                                                                       |
| `paddingInline`           | `ResponsivePropType&lt;BoxPaddingDirectionType&gt; &#124; undefined`                                      | Adjust the inline padding (overrides inline value of padding).                                                                                                                                                                                                                                                                                                                                                                                                            |
| `paddingInlineStart`      | `ResponsivePropType&lt;BoxPaddingDirectionType&gt; &#124; undefined`                                      | Adjust the inline-start padding (overrides inline-start of paddingInline).                                                                                                                                                                                                                                                                                                                                                                                                |
| `paddingInlineEnd`        | `ResponsivePropType&lt;BoxPaddingDirectionType&gt; &#124; undefined`                                      | Adjust the inline-end padding (overrides inline-end of paddingInline).                                                                                                                                                                                                                                                                                                                                                                                                    |
| `gap`                     | `PolarisSpacingType`                                                                                      | Spacing between elements. Use modern Polaris spacing tokens ("none", "small-500"..."large-500", "base"). Never use legacy numeric tokens.                                                                                                                                                                                                                                                                                                                                 |
| `rowGap`                  | `PolarisSpacingType`                                                                                      | Spacing between elements. Use modern Polaris spacing tokens ("none", "small-500"..."large-500", "base"). Never use legacy numeric tokens.                                                                                                                                                                                                                                                                                                                                 |
| `columnGap`               | `PolarisSpacingType`                                                                                      | Spacing between elements. Use modern Polaris spacing tokens ("none", "small-500"..."large-500", "base"). Never use legacy numeric tokens.                                                                                                                                                                                                                                                                                                                                 |
| `columns`                 | `GridColumnsType &#124; undefined`                                                                        | Shorthand / convenience alias for columns. If a number `n` is provided, maps to `repeat(${n}, minmax(0, 1fr))`. If a string is provided, sets `gridTemplateColumns`. If an object is provided (e.g. `{ xs: 1, sm: 2, md: 4 }`), maps to responsive container queries.                                                                                                                                                                                                     |
| `rows`                    | `GridRowsType &#124; undefined`                                                                           | Shorthand / convenience alias for rows. If a number `n` is provided, maps to `repeat(${n}, minmax(0, 1fr))`. If a string is provided, sets `gridTemplateRows`. If an object is provided (e.g. `{ xs: 1, sm: 2, md: 4 }`), maps to responsive container queries.                                                                                                                                                                                                           |
| `areas`                   | `string &#124; undefined`                                                                                 | Named grid areas specification.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `role`                    | `string &#124; undefined`                                                                                 | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `tabIndex`                | `number &#124; undefined`                                                                                 | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `className`               | `string &#124; undefined`                                                                                 | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `style`                   | `CSSProperties &#124; undefined`                                                                          | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `slot`                    | `string &#124; undefined`                                                                                 | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `as`: HTML Element type in legacy Polaris React. In Polaris web components, the element is always `<s-box>`.
> - `color`: Color of children text.
> - `borderBlockStartWidth`: Vertical start border width.
> - `borderBlockEndWidth`: Vertical end border width.
> - `borderInlineStartWidth`: Horizontal start border width.
> - `borderInlineEndWidth`: Horizontal end border width.
> - `borderStartStartRadius`: Vertical start horizontal start border radius.
> - `borderStartEndRadius`: Vertical start horizontal end border radius.
> - `borderEndStartRadius`: Vertical end horizontal start border radius.
> - `borderEndEndRadius`: Vertical end horizontal end border radius.
> - `overflowX`: Horizontal content clipping ('hidden' | 'scroll' | 'clip').
> - `overflowY`: Vertical content clipping ('hidden' | 'scroll' | 'clip').
> - `shadow`: Box shadow alias or CSS box-shadow.
> - `position`: CSS positioning mode ('relative' | 'absolute' | 'fixed' | 'sticky').
> - `insetBlockStart`: Top position offset.
> - `insetBlockEnd`: Bottom position offset.
> - `insetInlineStart`: Left position offset.
> - `insetInlineEnd`: Right position offset.
> - `opacity`: Opacity of box.
> - `outlineColor`: Outline color.
> - `outlineStyle`: Outline style ('solid' | 'dashed').
> - `outlineWidth`: Outline width.
> - `printHidden`: Visually hides content during print.
> - `visuallyHidden`: Visually hides the content while keeping it accessible to screen readers.
>   In modern Polaris web components, this maps directly to `accessibilityVisibility="exclusive"`.
> - `zIndex`: Z-index layer of box.
> - `width`: Legacy dimension alias. Use `inlineSize` in modern code.
> - `minWidth`: Legacy dimension alias. Use `minInlineSize` in modern code.
> - `maxWidth`: Legacy dimension alias. Use `maxInlineSize` in modern code.
> - `height`: Legacy dimension alias. Use `blockSize` in modern code.
> - `minHeight`: Legacy dimension alias. Use `minBlockSize` in modern code.
> - `maxHeight`: Legacy dimension alias. Use `maxBlockSize` in modern code.

#### Example

```tsx
<Grid gridTemplateColumns="2fr 1fr" gap="base">
  <Grid.Item>
    <Card heading="Main Details">Content</Card>
  </Grid.Item>
  <Grid.Item>
    <Card heading="Sidebar">Sidebar content</Card>
  </Grid.Item>
</Grid>
```

---

### Icon

Polaris icon glyph wrapping `<s-icon>`.

```tsx
import { Icon } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                 | Type                                                         | Description                                                                                 |
| :------------------- | :----------------------------------------------------------- | :------------------------------------------------------------------------------------------ |
| `id`                 | `string &#124; undefined`                                    | A unique identifier for the element.                                                        |
| `slot`               | `Lowercase&lt;string&gt; &#124; undefined`                   | Assigns this element to a parent's slot.                                                    |
| `color`              | `"base" &#124; "subdued" &#124; undefined`                   | Modify the color to be more or less intense.                                                |
| `size`               | `"small" &#124; "base" &#124; undefined`                     | Adjusts the size of the icon.                                                               |
| `interestFor`        | `string &#124; undefined`                                    | ID of a component that should respond to interest (e.g. hover and focus) on this component. |
| `source`             | `IconSourceType`                                             | Icon name (e.g. `"save"`, `"search"`, `"star"`) or a Polaris SVG component.                 |
| `tone`               | `IconToneType`                                               | —                                                                                           |
| `type`               | `"" &#124; "key" &#124; "content" &#124; "color" &#124; ...` | —                                                                                           |
| `accessibilityLabel` | `string &#124; undefined`                                    | —                                                                                           |
| `style`              | `CSSProperties &#124; undefined`                             | —                                                                                           |

#### Example

```tsx
<Icon type="search" tone="neutral" />
```

---

### IconTile

Rounded square tile with tinted background and centered icon.

```tsx
import { IconTile } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop           | Type                                                                              | Description                                                                        |
| :------------- | :-------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| `children`     | `ReactNode`                                                                       | —                                                                                  |
| `tone`         | `IconTileToneType &#124; undefined`                                               | Visual tone (background & icon color)                                              |
| `color`        | `IconTileColorType &#124; undefined`                                              | Color intensity ('base' for subtle/light tint, 'strong' for saturated solid color) |
| `borderRadius` | `IconTileBorderRadiusType &#124; undefined`                                       | Rounded corner style                                                               |
| `size`         | `IconTileSizeType &#124; undefined`                                               | Size dimensions ('sm' = 32px, 'md' = 40px, 'lg' = 44px)                            |
| `style`        | `CSSProperties &#124; undefined`                                                  | Custom inline styles                                                               |
| `className`    | `string &#124; undefined`                                                         | CSS class name                                                                     |
| `id`           | `string &#124; undefined`                                                         | Element ID                                                                         |
| `slot`         | `string &#124; undefined`                                                         | —                                                                                  |
| `role`         | `string &#124; undefined`                                                         | —                                                                                  |
| `onClick`      | `((e: MouseEvent&lt;HTMLDivElement, MouseEvent&gt;) =&gt; void) &#124; undefined` | Click handler                                                                      |

#### Example

```tsx
<IconTile tone="success" color="base" size="base">
  <Icon type="check" />
</IconTile>
```

---

### Image

Responsive image wrapper around `<s-image>`.

```tsx
import { Image } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                 | Type                                                                                                                                                         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                 | `string &#124; undefined`                                                                                                                                    | A unique identifier for the element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `slot`               | `Lowercase&lt;string&gt; &#124; undefined`                                                                                                                   | Assigns this element to a parent's slot.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `loading`            | `"eager" &#124; "lazy" &#124; undefined`                                                                                                                     | Determines the loading behavior of the image: - `eager`: Immediately loads the image, irrespective of its position within the visible viewport. - `lazy`: Delays loading the image until it approaches a specified distance from the viewport. Browser loading strategy (`"lazy" &#124; "eager"`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `alt` **(required)** | `string`                                                                                                                                                     | An alternative text description that describe the image for the reader to understand what it is about. It is extremely useful for both users using assistive technology and sighted users. A well written description provides people with visual impairments the ability to participate in consuming non-text content. When a screen readers encounters an `s-image`, the description is read and announced aloud. If an image fails to load, potentially due to a poor connection, the `alt` is displayed on screen instead. This has the benefit of letting a sighted buyer know an image was meant to load here, but as an alternative, they’re still able to consume the text content. Read [considerations when writing alternative text](https://www.shopify.com/ca/blog/image-alt-text#4) to learn more. Alternative text for accessibility. Required by Shopify Polaris guidelines. |
| `inlineSize`         | `"fill" &#124; "auto" &#124; undefined`                                                                                                                      | The displayed inline width of the image. - `fill`: the image will takes up 100% of the available inline size. - `auto`: the image will be displayed at its natural size.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `accessibilityRole`  | `"none" &#124; "img" &#124; "presentation" &#124; undefined`                                                                                                 | Sets the semantic meaning of the component’s content. When set, the role will be used by assistive technologies to help users navigate the page.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `border`             | `BorderShorthand &#124; undefined`                                                                                                                           | Set the border via the shorthand property. This can be a size, optionally followed by a color, optionally followed by a style. If the color is not specified, it will be `base`. If the style is not specified, it will be `auto`. Values can be overridden by `borderWidth`, `borderStyle`, and `borderColor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `borderColor`        | `"" &#124; ColorKeyword &#124; undefined`                                                                                                                    | Adjust the color of the border.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `borderRadius`       | `"none" &#124; "small-200" &#124; "small-100" &#124; "small" &#124; ...`                                                                                     | Adjust the radius of the border. Border radius (supports Polaris tokens e.g. `"small"`, `"base"`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `borderStyle`        | `"" &#124; MaybeAllValuesShorthandProperty&lt;BoxBorderStyles&gt; &#124; undefined`                                                                          | Adjust the style of the border.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `borderWidth`        | `"" &#124; MaybeAllValuesShorthandProperty&lt;"none" &#124; "small-100" &#124; "small" &#124; "base" &#124; "large" &#124; "large-100"&gt; &#124; undefined` | Adjust the width of the border.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `srcSet`             | `string &#124; undefined`                                                                                                                                    | A set of image sources and their width or pixel density descriptors. This overrides the `src` property. One or more image candidate URLs with pixel density or width descriptors.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `sizes`              | `string &#124; undefined`                                                                                                                                    | A set of media conditions and their corresponding sizes. Media conditions indicating image slot width.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `aspectRatio`        | ``${number}` &#124; `${number}/${number}` &#124; `${number}/ ${number}` &#124; `${number} /${number}` &#124; ...`                                            | The aspect ratio of the image. The rendering of the image will depend on the `inlineSize` value: - `inlineSize="fill"`: the aspect ratio will be respected and the image will take the necessary space. - `inlineSize="auto"`: the image will not render until it has loaded and the aspect ratio will be ignored. For example, if the value is set as `50 / 100`, the getter returns `50 / 100`. If the value is set as `0.5`, the getter returns `0.5 / 1`. Explicit aspect ratio (e.g. `"16/9"`, `"1/1"`).                                                                                                                                                                                                                                                                                                                                                                                |
| `objectFit`          | `"contain" &#124; "cover" &#124; undefined`                                                                                                                  | Determines how the content of the image is resized to fit its container. The image is positioned in the center of the container. How the image fits its container (`"cover" &#124; "contain" &#124; "fill" &#124; "none" &#124; "scale-down"`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `src`                | `string &#124; undefined`                                                                                                                                    | Source URL of the image.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `source`             | `string &#124; undefined`                                                                                                                                    | Legacy Polaris alias for `src`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `width`              | `string &#124; number &#124; undefined`                                                                                                                      | Explicit width of the image.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `height`             | `string &#124; number &#124; undefined`                                                                                                                      | Explicit height of the image.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `className`          | `string &#124; undefined`                                                                                                                                    | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `style`              | `CSSProperties &#124; undefined`                                                                                                                             | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `onLoad`             | `((event: Event) =&gt; void) &#124; undefined`                                                                                                               | Fired when the image successfully loads.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `onError`            | `((event: Event) =&gt; void) &#124; undefined`                                                                                                               | Fired if the image fails to load.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

#### Example

```tsx
<Image src="/logo.png" alt="Company Logo" width={120} height={40} />
```

---

### IndexFilters

Unified search, filtering pills, saved views, and column selector matching Polaris table headers.

```tsx
import { IndexFilters } from "@xco-agency/corex-ui";
```

#### Subcomponents

| Subcomponent                           | Description                                                                                                                                                                                                                                | Key Props                                                                                                                                                                               |
| :------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `IndexFilters.SearchField`             | Search input with debouncing and active filter pills.                                                                                                                                                                                      | `queryValue?: string, onQueryChange?: (val) => void, filters?: IndexFilterItemType[], appliedFilters?: IndexAppliedFilterType[], onClearAll?: () => void`                               |
| `IndexFilters.Actions`                 | Right-side container for custom action buttons. Inside `IndexFilters` it ends with the built-in save action (unless disabled or placed with `IndexFilters.SaveAction`).                                                                    | `children`                                                                                                                                                                              |
| `IndexFilters.ViewVisibleActiveFilter` | Shows its children only while a search or filter is active, with a horizontal expand/collapse animation. Each instance animates independently, so it never conflicts with the built-in save action. Always visible outside `IndexFilters`. | `children, visible?: boolean (overrides active state), duration?: number (ms, default 200)`                                                                                             |
| `IndexFilters.SaveAction`              | Places the built-in save action explicitly; the automatic one in `Actions` is then skipped (never rendered twice).                                                                                                                         | none (configured via root `saveAction` / `onSaveView`)                                                                                                                                  |
| `IndexFilters.ViewOptions`             | View options popover; composes the sections below with dividers between them.                                                                                                                                                              | `children, activator?: ReactElement, icon?: IconType, accessibilityLabel?: string, disabled?: boolean, minInlineSize?, maxInlineSize?`                                                  |
| `IndexFilters.ViewOptionsSort`         | Sort row with a select.                                                                                                                                                                                                                    | `options: IndexFilterSortOptionType[], value?: string, onChange?: (value) => void, label?: string, icon?: IconType &#124; null`                                                         |
| `IndexFilters.ViewOptionsToggles`      | Switch rows (e.g. "Hide archived").                                                                                                                                                                                                        | `items: IndexFilterViewToggleItemType[] ({ key, label, icon?, checked, disabled?, onChange? }), onChange?: (key, checked) => void`                                                      |
| `IndexFilters.ViewOptionsColumns`      | Column list: show/hide via eye button, reorder via drag handle or arrow keys. `onChange` returns the full reordered list.                                                                                                                  | `columns: IndexFilterColumnItemType[] ({ key, label, visible?, hideable?, reorderable? }), onChange?: (columns) => void, title?: ReactNode, direction?: "vertical" &#124; "horizontal"` |

#### Modern Props

| Prop               | Type                                                                                                                   | Description                                                                                                                                                                                                  |
| :----------------- | :--------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `queryValue`       | `string &#124; undefined`                                                                                              | Current search query string.                                                                                                                                                                                 |
| `queryPlaceholder` | `string &#124; undefined`                                                                                              | Placeholder text for the search input. Defaults to "search by keywords".                                                                                                                                     |
| `onQueryChange`    | `((value: string) =&gt; void) &#124; undefined`                                                                        | Callback when search query changes.                                                                                                                                                                          |
| `onQueryClear`     | `(() =&gt; void) &#124; undefined`                                                                                     | Callback when search query is cleared.                                                                                                                                                                       |
| `onQueryBlur`      | `(() =&gt; void) &#124; undefined`                                                                                     | Callback on search input blur.                                                                                                                                                                               |
| `onQueryFocus`     | `(() =&gt; void) &#124; undefined`                                                                                     | Callback on search input focus.                                                                                                                                                                              |
| `debounceDelay`    | `number &#124; undefined`                                                                                              | Debounce delay in ms for `onQueryChange`. Defaults to 300. Use 0 for immediate updates.                                                                                                                      |
| `tabs`             | `ReactNode`                                                                                                            | Content rendered on the left of the search input, typically `<Tabs compact ... />`.                                                                                                                          |
| `filters`          | `IndexFilterItemType[] &#124; undefined`                                                                               | Available filter items.                                                                                                                                                                                      |
| `appliedFilters`   | `IndexAppliedFilterType[] &#124; undefined`                                                                            | Currently applied filter pills.                                                                                                                                                                              |
| `onAddFilter`      | `((filterKey: string, index: number) =&gt; void) &#124; undefined`                                                     | Callback when a filter is picked from the filters popover. `index` is the position in `appliedFilters` where the new pill should be inserted (the caret position between pills when the popover was opened). |
| `onFilterSelect`   | `((filterKey: string, value: string &#124; string[], operator?: string &#124; undefined) =&gt; void) &#124; undefined` | Callback when a filter value is selected in the value popover.                                                                                                                                               |
| `onOperatorChange` | `((filterKey: string, operator: string) =&gt; void) &#124; undefined`                                                  | Callback when a filter operator changes.                                                                                                                                                                     |
| `onClearAll`       | `(() =&gt; void) &#124; undefined`                                                                                     | Callback when the user clicks "Clear search and filters".                                                                                                                                                    |
| `disabled`         | `boolean &#124; undefined`                                                                                             | Whether the search field is disabled.                                                                                                                                                                        |
| `id`               | `string &#124; undefined`                                                                                              | Optional DOM element ID.                                                                                                                                                                                     |

#### Root Props (`<IndexFilters>`)

The root also accepts all search field props above (declarative mode).

| Prop               | Type                                                                                         | Description                                                                                                                                                                         |
| :----------------- | :------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`         | `ReactNode`                                                                                  | Composable toolbar (`IndexFilters.SearchField`, `IndexFilters.Actions`, ...).                                                                                                       |
| `actions`          | `ReactNode`                                                                                  | Right-side content in declarative mode (no `children`).                                                                                                                             |
| `saveAction`       | `boolean &#124; IndexFiltersSaveActionType`                                                  | Built-in "Save" action, shown only while filters are active; opens a modal asking for the view name. **Enabled by default.** `false` removes it; an object configures it.           |
| `onSaveView`       | `((view: IndexFiltersSavedViewType) =&gt; void &#124; Promise&lt;void&gt;) &#124; undefined` | Called with `{ name, query, filters }` (filters without `onRemove`). Store it and render it as a tab. A thrown error / rejected promise keeps the modal open and shows the message. |
| `hasActiveFilters` | `boolean &#124; undefined`                                                                   | Overrides active detection. By default active = non-blank `queryValue` or any applied filter with a non-empty `value`.                                                              |

`IndexFiltersSaveActionType`: `{ label?: string ("Save"), disabled?: boolean, modalTitle?: string ("Save as new view"), nameLabel?: string ("Name"), namePlaceholder?: string, saveLabel?: string ("Save"), cancelLabel?: string ("Cancel"), validateName?: (name) => string | undefined }` — return an error message from `validateName` to block the save (e.g. duplicate tab names).

> Do not add a manual "Save" button to `IndexFilters.Actions` — use the built-in save action. Wrap other filter-dependent actions (e.g. "Export") in `IndexFilters.ViewVisibleActiveFilter`.

#### Example

```tsx
<IndexFilters
  // Built-in save: shown while filters are active, asks for a name, then stores a tab.
  onSaveView={(view) =>
    setSavedViews((prev) => [...prev, { ...view, id: crypto.randomUUID() }])
  }
  saveAction={{
    validateName: (name) =>
      tabs.some((tab) => tab.label === name)
        ? "A view with this name already exists"
        : undefined,
  }}
>
  <IndexFilters.SearchField
    tabs={<Tabs tabs={tabs} selected={selectedTab} onSelect={selectTab} compact />}
    queryValue={search}
    onQueryChange={(q) => setSearch(q)}
    filters={availableFilters}
    appliedFilters={appliedFilters}
  />
  <IndexFilters.Actions>
    {/* Custom actions visible only while filters are active */}
    <IndexFilters.ViewVisibleActiveFilter>
      <Button variant="tertiary" icon="export" onClick={exportFiltered}>
        Export
      </Button>
    </IndexFilters.ViewVisibleActiveFilter>
    <IndexFilters.ViewOptions>
      <IndexFilters.ViewOptionsSort
        options={sortOptions}
        value={sort}
        onChange={setSort}
      />
      <IndexFilters.ViewOptionsToggles
        items={[
          {
            key: "archived",
            label: "Hide archived",
            icon: "archive",
            checked: hideArchived,
            onChange: setHideArchived,
          },
        ]}
      />
      {/* Same array drives the table: columns.filter((c) => c.visible !== false) */}
      <IndexFilters.ViewOptionsColumns columns={columns} onChange={setColumns} />
    </IndexFilters.ViewOptions>
  </IndexFilters.Actions>
</IndexFilters>
```

---

### IndexTable

Feature-rich resource table supporting bulk actions, row selection, pagination, and sorting.

```tsx
import { IndexTable } from "@xco-agency/corex-ui";
```

#### Subcomponents

| Subcomponent      | Description                                                   | Key Props                                                                                               |
| :---------------- | :------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------ |
| `IndexTable.Row`  | Table row in `IndexTable` with integrated selection checkbox. | `id: string, selected?: boolean, position?: number, onClick?: () => void, disabled?: boolean, children` |
| `IndexTable.Cell` | Data cell within an `IndexTable.Row`.                         | `children, flush?: boolean, format?: 'base'                                                             | 'currency' | 'numeric' | string, alignment?: 'start' | 'center' | 'end'` |

#### Modern Props

| Prop                    | Type                                                                                                                                   | Description                                                                                                                                              |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`              | `ReactNode`                                                                                                                            | —                                                                                                                                                        |
| `headings`              | `(ReactNode &#124; IndexTableHeadingType)[] &#124; undefined`                                                                          | Headings can be strings or IndexTableHeadingType objects.                                                                                                |
| `rows`                  | `ReactNode[][] &#124; undefined`                                                                                                       | Direct rows matrix (DataTable format: 2D array of cells).                                                                                                |
| `columnContentTypes`    | `("text" &#124; "numeric")[] &#124; undefined`                                                                                         | Column content types (DataTable format: ["text", "numeric", ...]).                                                                                       |
| `itemCount`             | `number &#124; undefined`                                                                                                              | —                                                                                                                                                        |
| `selectedItemsCount`    | `number &#124; "All" &#124; undefined`                                                                                                 | A count, or `"All"` when every row across every page is selected.                                                                                        |
| `onSelectionChange`     | `((selectionType: IndexTableSelectionTypeType, toggleType: boolean, selection?: string &#124; undefined) =&gt; void) &#124; undefined` | —                                                                                                                                                        |
| `selectable`            | `boolean &#124; undefined`                                                                                                             | —                                                                                                                                                        |
| `bulkActions`           | `IndexTableBulkActionType[] &#124; undefined`                                                                                          | —                                                                                                                                                        |
| `promotedBulkActions`   | `IndexTableBulkActionType[] &#124; undefined`                                                                                          | Promoted bulk actions shown directly next to the selection count dropdown.                                                                               |
| `resourceName`          | `{ singular: string; plural: string; } &#124; undefined`                                                                               | —                                                                                                                                                        |
| `loading`               | `boolean &#124; undefined`                                                                                                             | —                                                                                                                                                        |
| `emptyState`            | `ReactNode`                                                                                                                            | Replaces the whole table or body when there are no items.                                                                                                |
| `pagination`            | `IndexTablePaginationType &#124; undefined`                                                                                            | Pagination controls (`{ floating, hasPrevious, hasNext, onPrevious, onNext, label }`). Set `floating: true` to float the pagination pill over the table. |
| `gridTemplateColumns`   | `string &#124; undefined`                                                                                                              | Optional custom CSS grid template columns (e.g. "44px 2fr 1fr 1fr").                                                                                     |
| `footerContent`         | `ReactNode`                                                                                                                            | Custom footer content (e.g. "Learn more about products" link).                                                                                           |
| `showAllSelectedToggle` | `boolean &#124; undefined`                                                                                                             | Whether to allow toggling "Show all selected".                                                                                                           |
| `id`                    | `string &#124; undefined`                                                                                                              | —                                                                                                                                                        |
| `className`             | `string &#124; undefined`                                                                                                              | —                                                                                                                                                        |
| `style`                 | `CSSProperties &#124; undefined`                                                                                                       | —                                                                                                                                                        |
| `increasedTableDensity` | `boolean &#124; undefined`                                                                                                             | —                                                                                                                                                        |
| `truncate`              | `boolean &#124; undefined`                                                                                                             | —                                                                                                                                                        |
| `verticalAlign`         | `"baseline" &#124; "top" &#124; "bottom" &#124; "middle" &#124; undefined`                                                             | —                                                                                                                                                        |
| `hasZebraStriping`      | `boolean &#124; undefined`                                                                                                             | —                                                                                                                                                        |
| `sortColumnIndex`       | `number &#124; undefined`                                                                                                              | Index of the currently sorted column.                                                                                                                    |
| `sortDirection`         | `"ascending" &#124; "descending" &#124; undefined`                                                                                     | Direction of the current sort.                                                                                                                           |
| `onSort`                | `((columnIndex: number, direction: IndexTableSortDirectionType) =&gt; void) &#124; undefined`                                          | Called when a sortable heading is clicked, with the column and its next direction.                                                                       |
| `onReorder`             | `((fromIndex: number, toIndex: number) =&gt; void) &#124; undefined`                                                                   | Enables drag-to-reorder rows (also Alt+↑/↓). Reorder your data with `reorderItems`.                                                                      |

#### Example

```tsx
<IndexTable
  itemCount={items.length}
  selectedItemsCount={selectedResources.length}
  headings={[{ title: "Title" }, { title: "Status" }]}
  selectable
  pagination={{
    floating: true,
    hasPrevious: page > 1,
    hasNext: page < totalPages,
    label: `${start} – ${end} of ${items.length}`,
    onPrevious: () => setPage((p) => p - 1),
    onNext: () => setPage((p) => p + 1),
  }}
>
  {items.map((item) => (
    <IndexTable.Row id={item.id} key={item.id}>
      <IndexTable.Cell>{item.title}</IndexTable.Cell>
      <IndexTable.Cell>{item.status}</IndexTable.Cell>
    </IndexTable.Row>
  ))}
</IndexTable>
```

---

### InlineCode

Inline monospace code snippet container.

```tsx
import { InlineCode } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop        | Type                             | Description |
| :---------- | :------------------------------- | :---------- |
| `children`  | `ReactNode`                      | —           |
| `id`        | `string &#124; undefined`        | —           |
| `className` | `string &#124; undefined`        | —           |
| `style`     | `CSSProperties &#124; undefined` | —           |

#### Example

```tsx
<InlineCode>npm install @xco-agency/corex-ui</InlineCode>
```

---

### InlineError

Inline validation error message display with alert icon.

```tsx
import { InlineError } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop        | Type                             | Description                                                                                                                                                                   |
| :---------- | :------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message`   | `ReactNode`                      | Nothing renders without a message, matching v12.                                                                                                                              |
| `fieldID`   | `string &#124; undefined`        | The field this error belongs to. The error gets the id `${fieldID}-error`, so the field can point at it with `aria-describedby` — which is the whole reason v12 asked for it. |
| `id`        | `string &#124; undefined`        | —                                                                                                                                                                             |
| `className` | `string &#124; undefined`        | —                                                                                                                                                                             |
| `style`     | `CSSProperties &#124; undefined` | —                                                                                                                                                                             |

#### Example

```tsx
<InlineError message="Password must be at least 8 characters" fieldID="password" />
```

---

### InlineGrid

Two-dimensional layout grid for responsive column arrangements.

```tsx
import { InlineGrid } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop         | Type                                         | Description                                                                                                                               |
| :----------- | :------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `children`   | `ReactNode`                                  | —                                                                                                                                         |
| `columns`    | `InlineGridColumnsType &#124; undefined`     | —                                                                                                                                         |
| `gap`        | `PolarisSpacingType`                         | Spacing between elements. Use modern Polaris spacing tokens ("none", "small-500"..."large-500", "base"). Never use legacy numeric tokens. |
| `alignItems` | `GridAlignItemsKeywordType &#124; undefined` | —                                                                                                                                         |
| `id`         | `string &#124; undefined`                    | —                                                                                                                                         |
| `className`  | `string &#124; undefined`                    | —                                                                                                                                         |
| `style`      | `CSSProperties &#124; undefined`             | —                                                                                                                                         |

#### Example

```tsx
<InlineGrid columns={["oneThird", "twoThirds"]} gap="base">
  <Text>Left column</Text>
  <Text>Right column</Text>
</InlineGrid>
```

---

### InlineStack

Horizontal flex layout container. Distributes children along the inline axis with uniform gap.

```tsx
import { InlineStack } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                 | Type                                                                                                                               | Description                                                                                                                                    |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultChecked`     | `boolean &#124; undefined`                                                                                                         | —                                                                                                                                              |
| `defaultValue`       | `string &#124; number &#124; readonly string[] &#124; undefined`                                                                   | —                                                                                                                                              |
| `slot`               | `string &#124; undefined`                                                                                                          | —                                                                                                                                              |
| `tabIndex`           | `number &#124; undefined`                                                                                                          | —                                                                                                                                              |
| `title`              | `string &#124; undefined`                                                                                                          | —                                                                                                                                              |
| `role`               | `AriaRole &#124; undefined`                                                                                                        | —                                                                                                                                              |
| `prefix`             | `string &#124; undefined`                                                                                                          | —                                                                                                                                              |
| `color`              | `string &#124; undefined`                                                                                                          | —                                                                                                                                              |
| `inputMode`          | `"none" &#124; "search" &#124; "text" &#124; "tel" &#124; "url" &#124; "email" &#124; "numeric" &#124; "decimal" &#124; undefined` | Hints at the type of data that might be entered by the user while editing the element or its contents                                          |
| `onFocus`            | `FocusEventHandler&lt;HTMLDivElement&gt; &#124; undefined`                                                                         | —                                                                                                                                              |
| `onBlur`             | `FocusEventHandler&lt;HTMLDivElement&gt; &#124; undefined`                                                                         | —                                                                                                                                              |
| `onChange`           | `FormEventHandler&lt;HTMLDivElement&gt; &#124; undefined`                                                                          | —                                                                                                                                              |
| `onInput`            | `FormEventHandler&lt;HTMLDivElement&gt; &#124; undefined`                                                                          | —                                                                                                                                              |
| `onKeyDown`          | `KeyboardEventHandler&lt;HTMLDivElement&gt; &#124; undefined`                                                                      | —                                                                                                                                              |
| `onKeyUp`            | `KeyboardEventHandler&lt;HTMLDivElement&gt; &#124; undefined`                                                                      | —                                                                                                                                              |
| `onClick`            | `MouseEventHandler&lt;HTMLDivElement&gt; &#124; undefined`                                                                         | —                                                                                                                                              |
| `onMouseEnter`       | `MouseEventHandler&lt;HTMLDivElement&gt; &#124; undefined`                                                                         | —                                                                                                                                              |
| `onMouseLeave`       | `MouseEventHandler&lt;HTMLDivElement&gt; &#124; undefined`                                                                         | —                                                                                                                                              |
| `onSelect`           | `ReactEventHandler&lt;HTMLDivElement&gt; &#124; undefined`                                                                         | —                                                                                                                                              |
| `children`           | `ReactNode`                                                                                                                        | —                                                                                                                                              |
| `as`                 | `ElementType &#124; undefined`                                                                                                     | HTML element or custom component to render as.                                                                                                 |
| `gap`                | `PolarisSpacingType`                                                                                                               | Spacing between elements. Use modern Polaris spacing tokens ("none", "small-500"..."large-500", "base"). Never use legacy numeric tokens.      |
| `rowGap`             | `PolarisSpacingType`                                                                                                               | Spacing between elements. Use modern Polaris spacing tokens ("none", "small-500"..."large-500", "base"). Never use legacy numeric tokens.      |
| `columnGap`          | `PolarisSpacingType`                                                                                                               | Spacing between elements. Use modern Polaris spacing tokens ("none", "small-500"..."large-500", "base"). Never use legacy numeric tokens.      |
| `justifyContent`     | `JustifyContent &#124; undefined`                                                                                                  | CSS `justifyContent` property. Takes precedence over `align`.                                                                                  |
| `alignItems`         | `AlignItems &#124; undefined`                                                                                                      | CSS `alignItems` property. Takes precedence over `blockAlign`.                                                                                 |
| `alignContent`       | `AlignContent &#124; undefined`                                                                                                    | CSS `alignContent` property.                                                                                                                   |
| `wrap`               | `boolean &#124; undefined`                                                                                                         | Wrap stack elements to additional rows as needed. Accepts boolean (`true` -> "wrap", `false` -> "nowrap") or standard CSS `flexWrap` keywords. |
| `fill`               | `boolean &#124; undefined`                                                                                                         | Fills the container's inline axis, as v12's `fill` did.                                                                                        |
| `grow`               | `number &#124; boolean &#124; FlexGrow &#124; undefined`                                                                           | Flex grow factor. When `true`, expands to fill available space (`flex-grow: 1`).                                                               |
| `shrink`             | `boolean &#124; undefined`                                                                                                         | Flex shrink factor. When `false`, prevents shrinking (`flex-shrink: 0`).                                                                       |
| `flex`               | `Flex&lt;string &#124; number&gt; &#124; undefined`                                                                                | Flex shorthand property.                                                                                                                       |
| `order`              | `Order &#124; undefined`                                                                                                           | Flex order.                                                                                                                                    |
| `inline`             | `boolean &#124; undefined`                                                                                                         | Render as an inline flex container (`display: inline-flex`).                                                                                   |
| `padding`            | `PolarisSpacingType &#124; string`                                                                                                 | Internal padding. Accepts 1 to 4 modern Polaris spacing tokens. Never use legacy numeric tokens.                                               |
| `paddingBlock`       | `BoxPaddingDirectionType &#124; undefined`                                                                                         | —                                                                                                                                              |
| `paddingBlockStart`  | `BoxPaddingDirectionType &#124; undefined`                                                                                         | —                                                                                                                                              |
| `paddingBlockEnd`    | `BoxPaddingDirectionType &#124; undefined`                                                                                         | —                                                                                                                                              |
| `paddingInline`      | `BoxPaddingDirectionType &#124; undefined`                                                                                         | —                                                                                                                                              |
| `paddingInlineStart` | `BoxPaddingDirectionType &#124; undefined`                                                                                         | —                                                                                                                                              |
| `paddingInlineEnd`   | `BoxPaddingDirectionType &#124; undefined`                                                                                         | —                                                                                                                                              |
| `inlineSize`         | `InlineSize&lt;string &#124; number&gt; &#124; undefined`                                                                          | Width or inlineSize.                                                                                                                           |
| `minInlineSize`      | `MinInlineSize&lt;string &#124; number&gt; &#124; undefined`                                                                       | —                                                                                                                                              |
| `maxInlineSize`      | `MaxInlineSize&lt;string &#124; number&gt; &#124; undefined`                                                                       | —                                                                                                                                              |
| `blockSize`          | `BlockSize&lt;string &#124; number&gt; &#124; undefined`                                                                           | Height or blockSize.                                                                                                                           |
| `minBlockSize`       | `MinBlockSize&lt;string &#124; number&gt; &#124; undefined`                                                                        | —                                                                                                                                              |
| `maxBlockSize`       | `MaxBlockSize&lt;string &#124; number&gt; &#124; undefined`                                                                        | —                                                                                                                                              |
| `overflow`           | `Overflow &#124; undefined`                                                                                                        | Overflow behavior.                                                                                                                             |
| `overflowX`          | `OverflowX &#124; undefined`                                                                                                       | —                                                                                                                                              |
| `overflowY`          | `OverflowY &#124; undefined`                                                                                                       | —                                                                                                                                              |
| `position`           | `Position &#124; undefined`                                                                                                        | Position.                                                                                                                                      |
| `className`          | `string &#124; undefined`                                                                                                          | Additional CSS class names.                                                                                                                    |
| `style`              | `CSSProperties &#124; undefined`                                                                                                   | Inline CSS styles.                                                                                                                             |
| `id`                 | `string &#124; undefined`                                                                                                          | Unique identifier.                                                                                                                             |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `onKeyPress`: Use `onKeyUp` or `onKeyDown` instead
> - `onKeyPressCapture`: Use `onKeyUpCapture` or `onKeyDownCapture` instead
> - `align`: Use `justifyContent` instead.
> - `blockAlign`: Use `alignItems` instead.
> - `Legacy numeric gap/padding tokens ("100", "200", "300", "400", "500")`: Use modern Polaris spacing tokens ("small-200", "base", "large-100", etc.) instead.

#### Example

```tsx
<InlineStack gap="small-200" alignItems="center" justifyContent="space-between">
  <Text>Status</Text>
  <Badge tone="success">Active</Badge>
</InlineStack>
```

---

### Layout

Legacy page layout structure containing `<Layout.Section>` partitions.

```tsx
import { Layout } from "@xco-agency/corex-ui";
```

#### Subcomponents

| Subcomponent     | Description                            | Key Props            |
| :--------------- | :------------------------------------- | :------------------- |
| `Layout.Section` | Content partition within a `<Layout>`. | `variant?: 'oneHalf' | 'oneThird' | 'oneFourth' | 'fullWidth', children` |

#### Modern Props

| Prop        | Type                               | Description                                                                                                                               |
| :---------- | :--------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `children`  | `ReactNode`                        | —                                                                                                                                         |
| `gap`       | `PolarisSpacingType`               | Spacing between elements. Use modern Polaris spacing tokens ("none", "small-500"..."large-500", "base"). Never use legacy numeric tokens. |
| `id`        | `string &#124; undefined`          | —                                                                                                                                         |
| `className` | `string &#124; undefined`          | —                                                                                                                                         |
| `style`     | `CSSProperties &#124; undefined`   | —                                                                                                                                         |
| `columns`   | `GridColumnsType &#124; undefined` | Grid columns configuration. Defaults to responsive `{ xs: 1, sm: 1, md: 12, lg: 12 }`.                                                    |

#### Example

```tsx
<Layout gap="base">
  <Layout.Section variant="oneHalf">
    <Card heading="Column 1">Content 1</Card>
  </Layout.Section>
  <Layout.Section variant="oneHalf">
    <Card heading="Column 2">Content 2</Card>
  </Layout.Section>
</Layout>
```

---

### Link

Interactive link wrapper around `<s-link>`. Supports navigation and external targets.

```tsx
import { Link } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                 | Type                                                                                          | Description                                                                                                                                                                                                                                                                                                                                                                                 |
| :------------------- | :-------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                 | `string &#124; undefined`                                                                     | A unique identifier for the element.                                                                                                                                                                                                                                                                                                                                                        |
| `slot`               | `Lowercase&lt;string&gt; &#124; undefined`                                                    | Assigns this element to a parent's slot.                                                                                                                                                                                                                                                                                                                                                    |
| `accessibilityLabel` | `string &#124; undefined`                                                                     | A label that describes the purpose or contents of the Link. It will be read to users using assistive technologies such as screen readers. Use this when using only an icon or the content of the link is not enough context for users using assistive technologies.                                                                                                                         |
| `tone`               | `"auto" &#124; "neutral" &#124; "critical" &#124; undefined`                                  | Sets the tone of the Link, based on the intention of the information being conveyed.                                                                                                                                                                                                                                                                                                        |
| `interestFor`        | `string &#124; undefined`                                                                     | ID of a component that should respond to interest (e.g. hover and focus) on this component.                                                                                                                                                                                                                                                                                                 |
| `href`               | `string &#124; undefined`                                                                     | The URL to link to. - If set, it will navigate to the location specified by `href` after executing the `click` event. - If a `commandFor` is set, the `command` will be executed instead of the navigation. Modern web component href prop.                                                                                                                                                 |
| `command`            | `"--auto" &#124; "--show" &#124; "--hide" &#124; "--toggle" &#124; "--copy" &#124; undefined` | Sets the action the `commandFor` should take when this clickable is activated. See the documentation of particular components for the actions they support. - `--auto`: a default action for the target component. - `--show`: shows the target component. - `--hide`: hides the target component. - `--toggle`: toggles the target component. - `--copy`: copies the target ClipboardItem. |
| `commandFor`         | `string &#124; undefined`                                                                     | ID of a component that should respond to activations (e.g. clicks) on this component. See `command` for how to control the behavior of the target.                                                                                                                                                                                                                                          |
| `children`           | `ReactNode`                                                                                   | —                                                                                                                                                                                                                                                                                                                                                                                           |
| `url`                | `string &#124; undefined`                                                                     | Legacy Polaris URL prop.                                                                                                                                                                                                                                                                                                                                                                    |
| `onClick`            | `((event: MouseEvent) =&gt; void) &#124; undefined`                                           | —                                                                                                                                                                                                                                                                                                                                                                                           |
| `external`           | `boolean &#124; undefined`                                                                    | Opens link in new browsing tab.                                                                                                                                                                                                                                                                                                                                                             |
| `target`             | `TargetType &#124; undefined`                                                                 | Target browsing context ('_blank' &#124; '_self' &#124; '_parent' &#124; '_top').                                                                                                                                                                                                                                                                                                           |
| `download`           | `string &#124; boolean &#124; undefined`                                                      | Prompts the user to save the linked URL instead of navigating.                                                                                                                                                                                                                                                                                                                              |
| `className`          | `string &#124; undefined`                                                                     | —                                                                                                                                                                                                                                                                                                                                                                                           |
| `style`              | `CSSProperties &#124; undefined`                                                              | —                                                                                                                                                                                                                                                                                                                                                                                           |
| `rel`                | `string &#124; undefined`                                                                     | Link relationship (e.g. `'noopener noreferrer'`).                                                                                                                                                                                                                                                                                                                                           |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `monochrome`: Kept for legacy-API compatibility.
> - `removeUnderline`: Kept for legacy-API compatibility.

#### Example

```tsx
<Link href="https://shopify.dev" target="_blank">
  Shopify Documentation
</Link>
```

---

### List

Bullet or numbered list wrapper around `<s-unordered-list>` / `<s-ordered-list>`.

```tsx
import { List } from "@xco-agency/corex-ui";
```

#### Subcomponents

| Subcomponent | Description                              | Key Props  |
| :----------- | :--------------------------------------- | :--------- |
| `List.Item`  | Individual bullet or numbered list item. | `children` |

#### Modern Props

| Prop        | Type                             | Description                                                             |
| :---------- | :------------------------------- | :---------------------------------------------------------------------- |
| `children`  | `ReactNode`                      | —                                                                       |
| `type`      | `ListTypeType &#124; undefined`  | `bullet` renders `s-unordered-list`, `number` renders `s-ordered-list`. |
| `id`        | `string &#124; undefined`        | —                                                                       |
| `className` | `string &#124; undefined`        | —                                                                       |
| `style`     | `CSSProperties &#124; undefined` | —                                                                       |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `gap`: The native lists own their spacing.

#### Example

```tsx
<List type="bullet">
  <List.Item>Step one</List.Item>
  <List.Item>Step two</List.Item>
</List>
```

---

### Menu

Menu overlay wrapping `<s-menu>` containing action list items.

```tsx
import { Menu } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                 | Type                                       | Description                                                                                                                                                |
| :------------------- | :----------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `slot`               | `Lowercase&lt;string&gt; &#124; undefined` | Assigns this element to a parent's slot.                                                                                                                   |
| `accessibilityLabel` | `string &#124; undefined`                  | A label that describes the purpose or contents of the element. When set, it will be announced using assistive technologies and provide additional context. |
| `id` **(required)**  | `string`                                   | Required so a trigger `Button` can reference it via `commandFor`.                                                                                          |
| `children`           | `ReactNode`                                | —                                                                                                                                                          |
| `className`          | `string &#124; undefined`                  | —                                                                                                                                                          |

#### Example

```tsx
<Button commandFor="order-actions-menu" icon="menu">More actions</Button>
<Menu id="order-actions-menu">
  <Button icon="duplicate">Duplicate</Button>
  <Button icon="archive">Archive</Button>
  <Button icon="delete" tone="critical">Delete</Button>
</Menu>
```

---

### MetricCard

KPI and analytics metric card with integrated sparkline visualization and badge indicators.

```tsx
import { MetricCard } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                   | Type                                                 | Description                                                                                                                                                                                                                          |
| :--------------------- | :--------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                   | `string &#124; undefined`                            | —                                                                                                                                                                                                                                    |
| `title` **(required)** | `string`                                             | —                                                                                                                                                                                                                                    |
| `fetching`             | `boolean &#124; undefined`                           | —                                                                                                                                                                                                                                    |
| `expanded`             | `boolean &#124; undefined`                           | Drops this card's own border/background — use uniformly across a group of cards when any one of them is expanded, so they read as one grouped surface (e.g. inside a `Collapsible` wrapper) instead of each keeping its own outline. |
| `pressed`              | `boolean &#124; undefined`                           | Highlights this specific card as the active/selected one within a group, independent of `expanded`. Use it to mark which card's content is currently shown (tab-like selection) without affecting the others.                        |
| `value`                | `ReactNode`                                          | —                                                                                                                                                                                                                                    |
| `tooltip`              | `ReactNode`                                          | —                                                                                                                                                                                                                                    |
| `icon`                 | `"" &#124; IconType &#124; "empty" &#124; undefined` | —                                                                                                                                                                                                                                    |
| `iconTone`             | `ToneType`                                           | —                                                                                                                                                                                                                                    |
| `badge`                | `MetricCardBadgeType &#124; undefined`               | —                                                                                                                                                                                                                                    |
| `sparklineData`        | `number[] &#124; undefined`                          | Time-series — one number per day/interval, oldest first.                                                                                                                                                                             |
| `sparklineColor`       | `SparklineColorType`                                 | —                                                                                                                                                                                                                                    |
| `sparklineWidth`       | `number &#124; undefined`                            | —                                                                                                                                                                                                                                    |
| `sparklineHeight`      | `number &#124; undefined`                            | —                                                                                                                                                                                                                                    |
| `onClick`              | `(() =&gt; void) &#124; undefined`                   | —                                                                                                                                                                                                                                    |

#### Example

```tsx
<MetricCard
  title="Total Sales"
  value="$45,210.00"
  sparklineData={[10, 25, 45, 30, 60, 80]}
  sparklineColor="success"
/>
```

---

### Modal

Dialog modal overlay wrapping `<s-modal>` or `<ui-modal>`.

```tsx
import { Modal } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                     | Type                                                                                          | Description                                                                                                                                                                                                                                                                                                                                                                                           |
| :----------------------- | :-------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                     | `string &#124; undefined`                                                                     | A unique identifier for the element.                                                                                                                                                                                                                                                                                                                                                                  |
| `slot`                   | `Lowercase&lt;string&gt; &#124; undefined`                                                    | Assigns this element to a parent's slot.                                                                                                                                                                                                                                                                                                                                                              |
| `heading`                | `string &#124; undefined`                                                                     | A title that describes the content of the Modal.                                                                                                                                                                                                                                                                                                                                                      |
| `onHide`                 | `(((event: CallbackEvent&lt;"s-modal"&gt;) =&gt; void) & (() =&gt; void)) &#124; undefined`   | A callback fired when the modal closes. Use to perform cleanup or trigger side effects when the modal is dismissed. App Bridge modal dismiss callback, called whenever modal hides.                                                                                                                                                                                                                   |
| `size`                   | `"small-100" &#124; "small" &#124; "base" &#124; "large" &#124; "large-100" &#124; undefined` | Adjust the size of the Modal.                                                                                                                                                                                                                                                                                                                                                                         |
| `accessibilityLabel`     | `string &#124; undefined`                                                                     | A label that describes the purpose of the modal. When set, it will be announced to users using assistive technologies and will provide them with more context. This overrides the `heading` prop for screen readers.                                                                                                                                                                                  |
| `onAfterHide`            | `((event: CallbackEvent&lt;"s-modal"&gt;) =&gt; void) &#124; null &#124; undefined`           | A callback fired after the modal has fully closed and any exit animation completes. Use to reset form state, clear temporary data, or update the page after dismissal.                                                                                                                                                                                                                                |
| `padding`                | `"none" &#124; "base" &#124; undefined`                                                       | Adjust the padding around the Modal content. `base`: applies padding that is appropriate for the element. `none`: removes all padding from the element. This can be useful when elements inside the Modal need to span to the edge of the Modal. For example, a full-width image. In this case, rely on `Box` with a padding of 'base' to bring back the desired padding for the rest of the content. |
| `hideOverlay`            | `(() =&gt; void) &#124; undefined`                                                            | Method to hide an overlay.                                                                                                                                                                                                                                                                                                                                                                            |
| `showOverlay`            | `(() =&gt; void) &#124; undefined`                                                            | Method to show an overlay.                                                                                                                                                                                                                                                                                                                                                                            |
| `toggleOverlay`          | `(() =&gt; void) &#124; undefined`                                                            | Method to toggle the visiblity of an overlay.                                                                                                                                                                                                                                                                                                                                                         |
| `onShow`                 | `((event: CallbackEvent&lt;"s-modal"&gt;) =&gt; void) &#124; null &#124; undefined`           | A callback fired when the modal starts to open, before any entrance animation begins. Use to prepare content or fetch data needed for the modal.                                                                                                                                                                                                                                                      |
| `onAfterShow`            | `((event: CallbackEvent&lt;"s-modal"&gt;) =&gt; void) &#124; null &#124; undefined`           | A callback fired after the modal has fully opened and any entrance animation completes. Use to focus an input field or initialize content once the modal is visible.                                                                                                                                                                                                                                  |
| `alignSelf`              | `"center" &#124; "start" &#124; undefined`                                                    | Places the Modal on the block axis on a large screen                                                                                                                                                                                                                                                                                                                                                  |
| `children`               | `ReactNode`                                                                                   | —                                                                                                                                                                                                                                                                                                                                                                                                     |
| `open` **(required)**    | `boolean`                                                                                     | Controls visibility. `Modal` owns no internal open state, matching legacy `Modal`.                                                                                                                                                                                                                                                                                                                    |
| `onClose` **(required)** | `() =&gt; void`                                                                               | —                                                                                                                                                                                                                                                                                                                                                                                                     |
| `title`                  | `ReactNode`                                                                                   | —                                                                                                                                                                                                                                                                                                                                                                                                     |
| `primaryAction`          | `ModalActionType &#124; undefined`                                                            | —                                                                                                                                                                                                                                                                                                                                                                                                     |
| `secondaryActions`       | `ModalActionType[] &#124; undefined`                                                          | —                                                                                                                                                                                                                                                                                                                                                                                                     |
| `className`              | `string &#124; undefined`                                                                     | —                                                                                                                                                                                                                                                                                                                                                                                                     |
| `variant`                | `"small" &#124; "base" &#124; "large" &#124; "max" &#124; undefined`                          | Modal size variant. Use `"max"` for full-screen / full-viewport App Bridge modals. When `variant` or `src` is specified, `Modal` renders `<ui-modal>` (App Bridge web component).                                                                                                                                                                                                                     |
| `src`                    | `string &#124; undefined`                                                                     | For cross-document modals: URL of the iframe page to load inside the modal. Note: in App Bridge, any children inside a `src` modal other than `TitleBar` and `SaveBar` will be ignored.                                                                                                                                                                                                               |
| `saveBar`                | `boolean &#124; ModalSaveBarConfigType &#124; undefined`                                      | When enabled, automatically mounts a host `<SaveBar>` attached to the modal and establishes a bidirectional state and action handshake for iframe or inline content.                                                                                                                                                                                                                                  |
| `channel`                | `string &#124; undefined`                                                                     | BroadcastChannel channel name used for iframe sync when `src` or `saveBar` is used.                                                                                                                                                                                                                                                                                                                   |

#### Example

```tsx
<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Export orders"
  primaryAction={{ content: "Export", onAction: () => handleExport() }}
>
  <Text>Export options and confirmation details</Text>
</Modal>
```

---

### MoneyField

Currency and monetary amount input wrapping `<s-money-field>` with currency code support.

```tsx
import { MoneyField } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop       | Type                                                        | Description                                                                        |
| :--------- | :---------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| `onChange` | `((value: string, id: string) =&gt; void) &#124; undefined` | Legacy signature: fires on every keystroke, mirroring `s-money-field`'s `onInput`. |
| `helpText` | `ReactNode`                                                 | —                                                                                  |
| `prefix`   | `ReactNode`                                                 | —                                                                                  |
| `suffix`   | `ReactNode`                                                 | —                                                                                  |

#### Example

```tsx
<MoneyField
  label="Price"
  currencyCode="USD"
  value={price}
  onChange={(val) => setPrice(val)}
/>
```

---

### Navigation

Sidebar navigation component with hierarchical sections, items, and search.

```tsx
import { Navigation } from "@xco-agency/corex-ui";
```

#### Subcomponents

| Subcomponent         | Description                                    | Key Props                                                                                                                       |
| :------------------- | :--------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| `Navigation.Section` | Grouping of navigation items.                  | `title?: string, items?: NavigationItemPropsType[], fill?: boolean, separator?: boolean`                                        |
| `Navigation.Item`    | Clickable navigation link or item.             | `url?: string, label: string, icon?: IconType, badge?: ReactNode, selected?: boolean, disabled?: boolean, onClick?: () => void` |
| `Navigation.Label`   | Non-interactive category label.                | `children`                                                                                                                      |
| `Navigation.Search`  | Navigation search bar input.                   | `value?: string, onChange?: (val) => void, placeholder?: string`                                                                |
| `Navigation.Footer`  | Pinned footer container in sidebar navigation. | `children`                                                                                                                      |

#### Modern Props

| Prop                      | Type                                                                               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| :------------------------ | :--------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                      | `string &#124; undefined`                                                          | A unique identifier for the element.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `accessibilityLabel`      | `string &#124; undefined`                                                          | A label that describes the purpose or contents of the element. When set, it will be announced to users using assistive technologies and will provide them with more context. Only use this when the element's content is not enough context for users using assistive technologies.                                                                                                                                                                                       |
| `inlineSize`              | `SizeUnitsOrAuto &#124; undefined`                                                 | Adjust the [inline size](https://developer.mozilla.org/en-US/docs/Web/CSS/inline-size).                                                                                                                                                                                                                                                                                                                                                                                   |
| `accessibilityVisibility` | `"hidden" &#124; "visible" &#124; "exclusive" &#124; undefined`                    | Changes the visibility of the element. - `visible`: the element is visible to all users. - `hidden`: the element is removed from the accessibility tree but remains visible. - `exclusive`: the element is visually hidden but remains in the accessibility tree.                                                                                                                                                                                                         |
| `minInlineSize`           | `SizeUnits &#124; undefined`                                                       | Adjust the [minimum inline size](https://developer.mozilla.org/en-US/docs/Web/CSS/min-inline-size).                                                                                                                                                                                                                                                                                                                                                                       |
| `maxInlineSize`           | `SizeUnitsOrNone &#124; undefined`                                                 | Adjust the [maximum inline size](https://developer.mozilla.org/en-US/docs/Web/CSS/max-inline-size).                                                                                                                                                                                                                                                                                                                                                                       |
| `blockSize`               | `SizeUnitsOrAuto &#124; undefined`                                                 | Adjust the [block size](https://developer.mozilla.org/en-US/docs/Web/CSS/block-size).                                                                                                                                                                                                                                                                                                                                                                                     |
| `minBlockSize`            | `SizeUnits &#124; undefined`                                                       | Adjust the [minimum block size](https://developer.mozilla.org/en-US/docs/Web/CSS/min-block-size).                                                                                                                                                                                                                                                                                                                                                                         |
| `maxBlockSize`            | `SizeUnitsOrNone &#124; undefined`                                                 | Adjust the [maximum block size](https://developer.mozilla.org/en-US/docs/Web/CSS/max-block-size).                                                                                                                                                                                                                                                                                                                                                                         |
| `overflow`                | `"hidden" &#124; "visible" &#124; undefined`                                       | Sets the overflow behavior of the element. - `hidden`: clips the content when it is larger than the element’s container. The element will not be scrollable and the users will not be able to access the clipped content by dragging or using a scroll wheel on a mouse. - `visible`: the content that extends beyond the element’s container is visible.                                                                                                                 |
| `accessibilityRole`       | `AccessibilityRole &#124; undefined`                                               | Sets the semantic meaning of the component’s content. When set, the role will be used by assistive technologies to help users navigate the page.                                                                                                                                                                                                                                                                                                                          |
| `border`                  | `BorderShorthand &#124; undefined`                                                 | Set the border via the shorthand property. This can be a size, optionally followed by a color, optionally followed by a style. If the color is not specified, it will be `base`. If the style is not specified, it will be `auto`. Values can be overridden by `borderWidth`, `borderStyle`, and `borderColor`.                                                                                                                                                           |
| `display`                 | `MaybeResponsive&lt;"none" &#124; "auto"&gt; &#124; undefined`                     | Sets the outer [display](https://developer.mozilla.org/en-US/docs/Web/CSS/display) type of the component. The outer type sets a component's participation in [flow layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flow_layout). - `auto` the component's initial value. The actual value depends on the component and context. - `none` hides the component from display and removes it from the accessibility tree, making it invisible to screen readers. |
| `children`                | `ReactNode`                                                                        | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `background`              | `BoxBackgroundType &#124; undefined`                                               | Adjust the background of the component ('transparent' &#124; 'base' &#124; 'subdued' &#124; 'strong' or legacy Polaris alias).                                                                                                                                                                                                                                                                                                                                            |
| `borderWidth`             | `BoxBorderWidthType &#124; undefined`                                              | Adjust the width of the border ('small-100' &#124; 'small' &#124; 'base' &#124; 'large' &#124; 'large-100' &#124; 'none' &#124; legacy token).                                                                                                                                                                                                                                                                                                                            |
| `borderStyle`             | `BoxBorderStyleType &#124; undefined`                                              | Adjust the style of the border ('solid' &#124; 'dashed' &#124; 'dotted' &#124; 'none' &#124; '').                                                                                                                                                                                                                                                                                                                                                                         |
| `borderColor`             | `BoxBorderColorType &#124; undefined`                                              | Adjust the color of the border ('subdued' &#124; 'base' &#124; 'strong' &#124; 'transparent' &#124; legacy token).                                                                                                                                                                                                                                                                                                                                                        |
| `borderRadius`            | `BoxBorderRadiusType &#124; undefined`                                             | Adjust the radius of the border ('none' &#124; 'small-100' &#124; 'small' &#124; 'base' &#124; 'large' &#124; 'large-100' &#124; 'max' &#124; 'full' &#124; legacy token).                                                                                                                                                                                                                                                                                                |
| `padding`                 | `ResponsivePropType&lt;BoxPaddingType&gt; &#124; undefined`                        | Adjust the padding of all edges using 1-to-4-value flow-relative syntax or responsive keyword. Order: block-start inline-end block-end inline-start. Accepts modern SizeKeyword tokens ('small-200', 'base') as well as legacy Polaris numeric tokens ('200', '400').                                                                                                                                                                                                     |
| `paddingBlock`            | `ResponsivePropType&lt;BoxPaddingDirectionType&gt; &#124; undefined`               | Adjust the block-padding (overrides block value of padding).                                                                                                                                                                                                                                                                                                                                                                                                              |
| `paddingBlockStart`       | `ResponsivePropType&lt;BoxPaddingDirectionType&gt; &#124; undefined`               | Adjust the block-start padding (overrides block-start of paddingBlock).                                                                                                                                                                                                                                                                                                                                                                                                   |
| `paddingBlockEnd`         | `ResponsivePropType&lt;BoxPaddingDirectionType&gt; &#124; undefined`               | Adjust the block-end padding (overrides block-end of paddingBlock).                                                                                                                                                                                                                                                                                                                                                                                                       |
| `paddingInline`           | `ResponsivePropType&lt;BoxPaddingDirectionType&gt; &#124; undefined`               | Adjust the inline padding (overrides inline value of padding).                                                                                                                                                                                                                                                                                                                                                                                                            |
| `paddingInlineStart`      | `ResponsivePropType&lt;BoxPaddingDirectionType&gt; &#124; undefined`               | Adjust the inline-start padding (overrides inline-start of paddingInline).                                                                                                                                                                                                                                                                                                                                                                                                |
| `paddingInlineEnd`        | `ResponsivePropType&lt;BoxPaddingDirectionType&gt; &#124; undefined`               | Adjust the inline-end padding (overrides inline-end of paddingInline).                                                                                                                                                                                                                                                                                                                                                                                                    |
| `role`                    | `string &#124; undefined`                                                          | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `tabIndex`                | `number &#124; undefined`                                                          | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `slot`                    | `string &#124; undefined`                                                          | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `style`                   | `CSSProperties &#124; undefined`                                                   | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `className`               | `string &#124; undefined`                                                          | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `onClick`                 | `((event: MouseEvent&lt;HTMLElement, MouseEvent&gt;) =&gt; void) &#124; undefined` | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `onMouseEnter`            | `((event: MouseEvent&lt;HTMLElement, MouseEvent&gt;) =&gt; void) &#124; undefined` | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `onMouseLeave`            | `((event: MouseEvent&lt;HTMLElement, MouseEvent&gt;) =&gt; void) &#124; undefined` | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `onFocus`                 | `((event: FocusEvent&lt;HTMLElement, Element&gt;) =&gt; void) &#124; undefined`    | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `onBlur`                  | `((event: FocusEvent&lt;HTMLElement, Element&gt;) =&gt; void) &#124; undefined`    | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `selected`                | `TId &#124; undefined`                                                             | Currently selected navigation item ID (controlled mode).                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `defaultSelected`         | `TId &#124; undefined`                                                             | Initial selected navigation item ID (uncontrolled mode).                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `onChange`                | `((selected: TId) =&gt; void) &#124; undefined`                                    | Callback fired when the selected navigation item changes.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `onSelect`                | `((selected: TId) =&gt; void) &#124; undefined`                                    | Callback fired when the selected navigation item changes. Alias for `onChange`.                                                                                                                                                                                                                                                                                                                                                                                           |
| `onChanged`               | `((selected: TId) =&gt; void) &#124; undefined`                                    | Callback fired when the selected navigation item changes. Alias for `onChange`.                                                                                                                                                                                                                                                                                                                                                                                           |
| `sectionned`              | `boolean &#124; undefined`                                                         | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `sticky`                  | `number &#124; boolean &#124; undefined`                                           | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `as`: HTML Element type in legacy Polaris React. In Polaris web components, the element is always `<s-box>`.
> - `color`: Color of children text.
> - `borderBlockStartWidth`: Vertical start border width.
> - `borderBlockEndWidth`: Vertical end border width.
> - `borderInlineStartWidth`: Horizontal start border width.
> - `borderInlineEndWidth`: Horizontal end border width.
> - `borderStartStartRadius`: Vertical start horizontal start border radius.
> - `borderStartEndRadius`: Vertical start horizontal end border radius.
> - `borderEndStartRadius`: Vertical end horizontal start border radius.
> - `borderEndEndRadius`: Vertical end horizontal end border radius.
> - `overflowX`: Horizontal content clipping ('hidden' | 'scroll' | 'clip').
> - `overflowY`: Vertical content clipping ('hidden' | 'scroll' | 'clip').
> - `shadow`: Box shadow alias or CSS box-shadow.
> - `position`: CSS positioning mode ('relative' | 'absolute' | 'fixed' | 'sticky').
> - `insetBlockStart`: Top position offset.
> - `insetBlockEnd`: Bottom position offset.
> - `insetInlineStart`: Left position offset.
> - `insetInlineEnd`: Right position offset.
> - `opacity`: Opacity of box.
> - `outlineColor`: Outline color.
> - `outlineStyle`: Outline style ('solid' | 'dashed').
> - `outlineWidth`: Outline width.
> - `printHidden`: Visually hides content during print.
> - `visuallyHidden`: Visually hides the content while keeping it accessible to screen readers.
>   In modern Polaris web components, this maps directly to `accessibilityVisibility="exclusive"`.
> - `zIndex`: Z-index layer of box.
> - `width`: Legacy dimension alias. Use `inlineSize` in modern code.
> - `minWidth`: Legacy dimension alias. Use `minInlineSize` in modern code.
> - `maxWidth`: Legacy dimension alias. Use `maxInlineSize` in modern code.
> - `height`: Legacy dimension alias. Use `blockSize` in modern code.
> - `minHeight`: Legacy dimension alias. Use `minBlockSize` in modern code.
> - `maxHeight`: Legacy dimension alias. Use `maxBlockSize` in modern code.

#### Example

```tsx
<Navigation selected="orders">
  <Navigation.Section>
    <Navigation.Item id="orders" label="Orders" icon="order" />
    <Navigation.Item id="products" label="Products" icon="product" />
  </Navigation.Section>
</Navigation>
```

---

### NumberField

Numeric input wrapping `<s-number-field>` with min/max, step, and decimal handling.

```tsx
import { NumberField } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop       | Type                                                        | Description |
| :--------- | :---------------------------------------------------------- | :---------- |
| `onChange` | `((value: string, id: string) =&gt; void) &#124; undefined` | —           |
| `helpText` | `string &#124; undefined`                                   | —           |

#### Example

```tsx
<NumberField
  label="Quantity"
  value={qty}
  min={1}
  max={99}
  onChange={(val) => setQty(val)}
/>
```

---

### Page

Top-level page layout container wrapping `<s-page>`. Houses header, breadcrumbs, actions, aside, and page content.

```tsx
import { Page } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                | Type                                                                 | Description                                                                                                                                                       |
| :------------------ | :------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`          | `ReactNode`                                                          | The main content of the page.                                                                                                                                     |
| `heading`           | `string &#124; undefined`                                            | The main page heading (native `s-page` prop).                                                                                                                     |
| `inlineSize`        | `PageInlineSizeType &#124; undefined`                                | The inline size of the page (native `s-page` prop). - `base`: default inline size - `large`: full width with whitespace - `small`: narrow / single-column layout  |
| `id`                | `string &#124; undefined`                                            | A unique identifier for the element.                                                                                                                              |
| `className`         | `string &#124; undefined`                                            | Additional CSS classes.                                                                                                                                           |
| `aside`             | `ReactNode`                                                          | Supplementary content displayed in a sidebar alongside the main content (slot="aside"). Only rendered when `inlineSize` is set to `base`.                         |
| `accessory`         | `ReactNode`                                                          | Additional contextual information about the page (slot="accessory").                                                                                              |
| `breadcrumbActions` | `ReactNode`                                                          | Navigation links to navigate back to parent pages (slot="breadcrumb-actions"). Typically displays as a back arrow or breadcrumb trail in the page header.         |
| `primaryAction`     | `ReactNode &#124; PagePrimaryActionType`                             | Primary page-level action. Can be an action descriptor object or a React element. Rendered in `slot="primary-action"` with variant="primary".                     |
| `secondaryActions`  | `ReactNode &#124; (ReactNode &#124; PageMenuActionDescriptorType)[]` | Collection of secondary page-level actions. Can be an array of action descriptors or React nodes, or a single React node. Rendered in `slot="secondary-actions"`. |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `title`: Use `heading` instead. Page title, in large type.
> - `subtitle`: not exist on new UI.
> - `fullWidth`: Use `inlineSize="large"` instead. Remove the normal max-width on the page.
> - `narrowWidth`: Use `inlineSize="small"` instead. Decreases the maximum layout width. Intended for single-column layouts.
> - `backAction`: Use `breadcrumbActions` instead. A back action link.
> - `titleHidden`: Visually hiding the title is not directly supported on `s-page`.
> - `pageReadyAccessibilityLabel`: Accessibility labels are handled differently in web components.
> - `filterActions`: Filtering action list items is not supported on `s-page`.
> - `pagination`: Page-level pagination is not directly supported on `s-page`. Render pagination inside the page body.
> - `actionGroups`: Action groups are not directly supported on `s-page`. Provide individual actions in `secondaryActions`.
> - `titleMetadata`: Use `accessory` or place status information inside the page body.
> - `additionalMetadata`: Use `accessory` or place metadata inside the page body.
> - `compactTitle`: Spacing between heading and subheading is managed automatically by `s-page`.
> - `hasSubtitleMaxWidth`: Subtitle max-width is managed automatically by `s-page`.
> - `onActionRollup`: Action rollup is managed automatically by `s-page`.

#### Example

```tsx
<Page
  heading="Products"
  inlineSize="base"
  primaryAction={{ content: "Add Product", onAction: () => handleAdd() }}
>
  <Card heading="Product List">Content</Card>
</Page>
```

---

### Pagination

Pagination navigation buttons for traversing records.

```tsx
import { Pagination } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop              | Type                               | Description                                                                                                          |
| :---------------- | :--------------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| `hasPrevious`     | `boolean &#124; undefined`         | —                                                                                                                    |
| `hasNext`         | `boolean &#124; undefined`         | —                                                                                                                    |
| `onPrevious`      | `(() =&gt; void) &#124; undefined` | —                                                                                                                    |
| `onNext`          | `(() =&gt; void) &#124; undefined` | —                                                                                                                    |
| `label`           | `ReactNode`                        | Rendered between the two buttons, e.g. "Showing 1–20 of 240".                                                        |
| `previousTooltip` | `string &#124; undefined`          | Accessible names for the two buttons.                                                                                |
| `nextTooltip`     | `string &#124; undefined`          | —                                                                                                                    |
| `id`              | `string &#124; undefined`          | —                                                                                                                    |
| `className`       | `string &#124; undefined`          | —                                                                                                                    |
| `style`           | `CSSProperties &#124; undefined`   | —                                                                                                                    |
| `floating`        | `boolean &#124; undefined`         | Renders the control as a raised pill (white surface, shadow) with quiet buttons, for use floating over page content. |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `accessibilityLabel`: v12 bound `J`/`K`; not reproduced.

#### Example

```tsx
<Pagination
  hasPrevious={page > 1}
  hasNext={hasNextPage}
  onPrevious={() => setPage((p) => p - 1)}
  onNext={() => setPage((p) => p + 1)}
/>
```

---

### Paragraph

Standard block paragraph typography wrapping `<s-paragraph>`.

```tsx
import { Paragraph } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                      | Type                                                                                                                          | Description                                                                                                                                                                                                                                                       |
| :------------------------ | :---------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                      | `string &#124; undefined`                                                                                                     | A unique identifier for the element.                                                                                                                                                                                                                              |
| `slot`                    | `Lowercase&lt;string&gt; &#124; undefined`                                                                                    | Assigns this element to a parent's slot.                                                                                                                                                                                                                          |
| `color`                   | `"base" &#124; "subdued" &#124; undefined`                                                                                    | Modify the color to be more or less intense.                                                                                                                                                                                                                      |
| `tone`                    | `"auto" &#124; "neutral" &#124; "info" &#124; "success" &#124; "caution" &#124; "warning" &#124; "critical" &#124; undefined` | Sets the tone of the component, based on the intention of the information being conveyed.                                                                                                                                                                         |
| `accessibilityVisibility` | `"hidden" &#124; "visible" &#124; "exclusive" &#124; undefined`                                                               | Changes the visibility of the element. - `visible`: the element is visible to all users. - `hidden`: the element is removed from the accessibility tree but remains visible. - `exclusive`: the element is visually hidden but remains in the accessibility tree. |
| `fontVariantNumeric`      | `"auto" &#124; "normal" &#124; "tabular-nums" &#124; undefined`                                                               | Set the numeric properties of the font.                                                                                                                                                                                                                           |
| `lineClamp`               | `number &#124; undefined`                                                                                                     | Truncates the text content to the specified number of lines.                                                                                                                                                                                                      |
| `children`                | `ReactNode`                                                                                                                   | —                                                                                                                                                                                                                                                                 |
| `className`               | `string &#124; undefined`                                                                                                     | —                                                                                                                                                                                                                                                                 |
| `style`                   | `CSSProperties &#124; undefined`                                                                                              | —                                                                                                                                                                                                                                                                 |

#### Example

```tsx
<Paragraph>Detailed explanatory description goes here.</Paragraph>
```

---

### PasswordField

Password input wrapping `<s-password-field>` with toggleable visibility.

```tsx
import { PasswordField } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                           | Type                                                        | Description                                                                           |
| :----------------------------- | :---------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| `label` **(required)**         | `ReactNode`                                                 | —                                                                                     |
| `value`                        | `string &#124; undefined`                                   | —                                                                                     |
| `defaultValue`                 | `string &#124; undefined`                                   | —                                                                                     |
| `minLength`                    | `number &#124; undefined`                                   | —                                                                                     |
| `maxLength`                    | `number &#124; undefined`                                   | —                                                                                     |
| `onChange`                     | `((value: string, id: string) =&gt; void) &#124; undefined` | Legacy signature: fires on every keystroke, mirroring `s-password-field`'s `onInput`. |
| `onBlur`                       | `((event: Event) =&gt; void) &#124; undefined`              | —                                                                                     |
| `onFocus`                      | `((event: Event) =&gt; void) &#124; undefined`              | —                                                                                     |
| `placeholder`                  | `string &#124; undefined`                                   | —                                                                                     |
| `disabled`                     | `boolean &#124; undefined`                                  | —                                                                                     |
| `readOnly`                     | `boolean &#124; undefined`                                  | —                                                                                     |
| `error`                        | `ReactNode`                                                 | —                                                                                     |
| `helpText`                     | `ReactNode`                                                 | —                                                                                     |
| `details`                      | `ReactNode`                                                 | —                                                                                     |
| `prefix`                       | `ReactNode`                                                 | —                                                                                     |
| `suffix`                       | `ReactNode`                                                 | —                                                                                     |
| `autoComplete`                 | `string &#124; undefined`                                   | —                                                                                     |
| `labelAccessibilityVisibility` | `"visible" &#124; "exclusive" &#124; undefined`             | —                                                                                     |
| `id`                           | `string &#124; undefined`                                   | —                                                                                     |
| `name`                         | `string &#124; undefined`                                   | —                                                                                     |
| `requiredIndicator`            | `boolean &#124; undefined`                                  | —                                                                                     |
| `className`                    | `string &#124; undefined`                                   | —                                                                                     |

#### Example

```tsx
<PasswordField label="API Secret" value={secret} onChange={(val) => setSecret(val)} />
```

---

### Popover

Contextual popover overlay anchored to a trigger element.

```tsx
import { Popover } from "@xco-agency/corex-ui";
```

#### Subcomponents

| Subcomponent      | Description                                     | Key Props  |
| :---------------- | :---------------------------------------------- | :--------- |
| `Popover.Trigger` | Element that triggers the popover when clicked. | `children` |
| `Popover.Content` | Container for popover popup content.            | `children` |

#### Modern Props

| Prop       | Type                               | Description                                                                                                                                                                                                                    |
| :--------- | :--------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`       | `string &#124; undefined`          | Custom ID for the popover element. Auto-generated if omitted.                                                                                                                                                                  |
| `children` | `ReactNode`                        | —                                                                                                                                                                                                                              |
| `active`   | `boolean &#124; undefined`         | Controlled open state. Left undefined, the popover is driven entirely by the native invoker API, which is what the trigger wires up. Set it when the page has to keep the popover open itself — during an in-flight save, say. |
| `onClose`  | `(() =&gt; void) &#124; undefined` | Called when the popover closes, however it was closed.                                                                                                                                                                         |

#### Example

```tsx
<Popover id="popover-id" active={active} onClose={() => setActive(false)}>
  <Popover.Trigger>
    <Button onClick={() => setActive((a) => !a)}>Open Popover</Button>
  </Popover.Trigger>
  <Popover.Content>
    <Box padding="base">
      <Text>Popover contents</Text>
    </Box>
  </Popover.Content>
</Popover>
```

---

### ProgressBar

Visual progress indicator wrapping `<s-progress>`.

```tsx
import { ProgressBar } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                 | Type                                   | Description                                                                                                                                                                                                                      |
| :------------------- | :------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accessibilityLabel` | `string &#124; undefined`              | A label that describes the purpose or content of the component for assistive technologies like screen readers. Use this to provide additional context when the visible content alone doesn't clearly convey what is progressing. |
| `max`                | `number &#124; undefined`              | How much work the task requires in total. Must be greater than 0.                                                                                                                                                                |
| `tone`               | `ProgressBarToneType &#124; undefined` | The semantic meaning and color treatment of the component.                                                                                                                                                                       |
| `value`              | `number &#124; undefined`              | How much of the task has been completed, as a number between 0 and max. Without a value the progress is indeterminate: the task is ongoing with no indication of how long it is expected to take.                                |
| `id`                 | `string &#124; undefined`              | Element ID                                                                                                                                                                                                                       |
| `className`          | `string &#124; undefined`              | CSS class name                                                                                                                                                                                                                   |
| `slot`               | `string &#124; undefined`              | Element slot name                                                                                                                                                                                                                |

#### Example

```tsx
<ProgressBar value={75} max={100} tone="success" />
```

---

### QueryContainer

Container query wrapper component enabling responsive styling based on container dimensions.

```tsx
import { QueryContainer } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop            | Type                                       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| :-------------- | :----------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`            | `string &#124; undefined`                  | A unique identifier for the element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `slot`          | `Lowercase&lt;string&gt; &#124; undefined` | Assigns this element to a parent's slot.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `children`      | `any`                                      | The content of the container.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `containerName` | `string &#124; undefined`                  | The name of the container, which can be used in your container queries to target this container specifically. We place the container name of `s-default` on every container. Because of this, it is not required to add a `containerName` identifier in your queries. For example, a `@container (inline-size <= 300px) none, auto` query is equivalent to `@container s-default (inline-size <= 300px) none, auto`. Any value set in `containerName` will be set alongside alongside `s-default`. For example, `containerName="my-container-name"` will result in a value of `s-default my-container-name` set on the `container-name` CSS property of the rendered HTML. |
| `className`     | `string &#124; undefined`                  | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `style`         | `CSSProperties &#124; undefined`           | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

#### Example

```tsx
<QueryContainer containerName="cardContainer">
  <Text>Responsive based on container width</Text>
</QueryContainer>
```

---

### RangeSlider

Slider input for selecting values within a range.

```tsx
import { RangeSlider } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                      | Type                                          | Description                                                            |
| :------------------------ | :-------------------------------------------- | :--------------------------------------------------------------------- |
| `label` **(required)**    | `ReactNode`                                   | Label for the range input.                                             |
| `labelAction`             | `RangeSliderLabelActionType &#124; undefined` | Adds an action next to the label.                                      |
| `labelHidden`             | `boolean &#124; undefined`                    | Visually hide the label (it stays in the accessibility tree).          |
| `id`                      | `string &#124; undefined`                     | ID for the range input.                                                |
| `value` **(required)**    | `number`                                      | Current value.                                                         |
| `min`                     | `number &#124; undefined`                     | Minimum possible value.                                                |
| `max`                     | `number &#124; undefined`                     | Maximum possible value.                                                |
| `step`                    | `number &#124; undefined`                     | Increment value for changes.                                           |
| `output`                  | `boolean &#124; undefined`                    | Shows a tooltip with the current value while dragging/focused.         |
| `helpText`                | `ReactNode`                                   | Additional text to aid in use.                                         |
| `error`                   | `ReactNode`                                   | Displays an error message and switches the control to a critical tone. |
| `disabled`                | `boolean &#124; undefined`                    | Disables the control.                                                  |
| `prefix`                  | `ReactNode`                                   | Element to display before the input.                                   |
| `suffix`                  | `ReactNode`                                   | Element to display after the input.                                    |
| `onChange` **(required)** | `(value: number, id: string) =&gt; void`      | Callback when the value changes.                                       |
| `onFocus`                 | `(() =&gt; void) &#124; undefined`            | Callback when a handle is focused.                                     |
| `onBlur`                  | `(() =&gt; void) &#124; undefined`            | Callback when focus leaves the handle.                                 |
| `className`               | `string &#124; undefined`                     | —                                                                      |
| `style`                   | `CSSProperties &#124; undefined`              | —                                                                      |

#### Example

```tsx
<RangeSlider
  label="Discount percentage"
  value={discount}
  min={0}
  max={100}
  output
  onChange={(val) => setDiscount(val)}
/>
```

---

### ResourceList

Vertical list of merchant domain objects/resources with consistent layout and empty states.

```tsx
import { ResourceList } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop           | Type                                                                      | Description                                                                                                                               |
| :------------- | :------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `items`        | `T[] &#124; undefined`                                                    | —                                                                                                                                         |
| `renderItem`   | `((item: T, id: string, index: number) =&gt; ReactNode) &#124; undefined` | —                                                                                                                                         |
| `resourceName` | `{ singular: string; plural: string; } &#124; undefined`                  | Used for the list's accessible name.                                                                                                      |
| `emptyState`   | `ReactNode`                                                               | Replaces the whole list when there are no items.                                                                                          |
| `loading`      | `boolean &#124; undefined`                                                | —                                                                                                                                         |
| `gap`          | `PolarisSpacingType`                                                      | Spacing between elements. Use modern Polaris spacing tokens ("none", "small-500"..."large-500", "base"). Never use legacy numeric tokens. |
| `id`           | `string &#124; undefined`                                                 | —                                                                                                                                         |
| `className`    | `string &#124; undefined`                                                 | —                                                                                                                                         |
| `style`        | `CSSProperties &#124; undefined`                                          | —                                                                                                                                         |

#### Example

```tsx
<ResourceList
  items={products}
  renderItem={(item) => <Text key={item.id}>{item.title}</Text>}
/>
```

---

### SaveBar

Shopify App Bridge sticky contextual save bar wrapping `<ui-save-bar>`.

```tsx
import { SaveBar } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                  | Type                               | Description                                                                                                                                                                                                 |
| :-------------------- | :--------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                  | `string &#124; undefined`          | A unique identifier for the save bar                                                                                                                                                                        |
| `children`            | `any`                              | HTML `<button>` elements to hook into the Save and Discard buttons of the contextual save bar. The button with variant `primary` is the Save button and the button without a variant is the Discard button. |
| `discardConfirmation` | `boolean &#124; undefined`         | Whether to show a confirmation dialog when the discard button is clicked                                                                                                                                    |
| `open`                | `boolean &#124; undefined`         | When true, automatically shows the save bar via App Bridge; when false, hides it.                                                                                                                           |
| `saveText`            | `string &#124; undefined`          | Label for the primary Save button when using `onSave`. Default "Save".                                                                                                                                      |
| `discardText`         | `string &#124; undefined`          | Label for the secondary Discard button when using `onDiscard`. Default "Discard".                                                                                                                           |
| `onSave`              | `(() =&gt; void) &#124; undefined` | Called when the Save button is clicked.                                                                                                                                                                     |
| `onDiscard`           | `(() =&gt; void) &#124; undefined` | Called when the Discard button is clicked.                                                                                                                                                                  |
| `disabled`            | `boolean &#124; undefined`         | Disables both buttons.                                                                                                                                                                                      |
| `loading`             | `boolean &#124; undefined`         | Puts the Save button into a loading state.                                                                                                                                                                  |

#### Example

```tsx
<SaveBar open={isDirty} onSave={() => handleSave()} onDiscard={() => handleDiscard()} />
```

---

### SearchField

Specialized search field input wrapping `<s-search-field>` with built-in clear button.

```tsx
import { SearchField } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                           | Type                                                                                       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :----------------------------- | :----------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                           | `string &#124; undefined`                                                                  | A unique identifier for the element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `defaultValue`                 | `string &#124; undefined`                                                                  | The default value for the field.                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `slot`                         | `Lowercase&lt;string&gt; &#124; undefined`                                                 | Assigns this element to a parent's slot.                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `onFocus`                      | `((event: CallbackEvent&lt;"s-search-field"&gt;) =&gt; void) &#124; null &#124; undefined` | A callback fired when the field receives focus.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `onBlur`                       | `((event: CallbackEvent&lt;"s-search-field"&gt;) =&gt; void) &#124; null &#124; undefined` | A callback fired when the field loses focus.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `onInput`                      | `((event: CallbackEvent&lt;"s-search-field"&gt;) =&gt; void) &#124; null &#124; undefined` | A callback fired when the user makes changes to the field value. This fires before `onChange`.                                                                                                                                                                                                                                                                                                                                                                                                                |
| `value`                        | `string &#124; undefined`                                                                  | The current value for the field. If omitted, the field will be empty.                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `label`                        | `any`                                                                                      | Content to use as the field label.                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `placeholder`                  | `string &#124; undefined`                                                                  | A short hint that describes the expected value of the field.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `disabled`                     | `boolean &#124; undefined`                                                                 | Disables the field, disallowing any interaction.                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `name`                         | `string &#124; undefined`                                                                  | An identifier for the field that is unique within the nearest containing form.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `details`                      | `string &#124; undefined`                                                                  | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `error`                        | `string &#124; undefined`                                                                  | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `required`                     | `boolean &#124; undefined`                                                                 | Whether the field needs a value. This requirement adds semantic value to the field, but it will not cause an error to appear automatically. If you want to present an error when this field is empty, you can do so with the `error` property.                                                                                                                                                                                                                                                                |
| `labelAccessibilityVisibility` | `"visible" &#124; "exclusive" &#124; undefined`                                            | Changes the visibility of the component's label. - `visible`: the label is visible to all users. - `exclusive`: the label is visually hidden but remains in the accessibility tree.                                                                                                                                                                                                                                                                                                                           |
| `readOnly`                     | `boolean &#124; undefined`                                                                 | The field cannot be edited by the user. It is focusable will be announced by screen readers.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `autocomplete`                 | `"off" &#124; "on" &#124; string`                                                          | A hint as to the intended content of the field. When set to `on` (the default), this property indicates that the field should support autofill, but you do not have any more semantic information on the intended contents. When set to `off`, you are indicating that this field contains sensitive information, or contents that are never saved, like one-time codes. Alternatively, you can provide value which describes the specific data you would like to be entered into this field during autofill. |
| `maxLength`                    | `number &#124; undefined`                                                                  | Specifies the maximum number of characters allowed.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `minLength`                    | `number &#124; undefined`                                                                  | Specifies the min number of characters allowed.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `onChange`                     | `((value: string, id?: string &#124; undefined) =&gt; void) &#124; undefined`              | Callback fired on every input change.                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `onDebouncedChange`            | `((value: string) =&gt; void) &#124; undefined`                                            | Callback fired with debounced value.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `debounceDelay`                | `number &#124; undefined`                                                                  | Debounce delay in ms for onDebouncedChange. Defaults to 300ms.                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `helpText`                     | `string &#124; undefined`                                                                  | Callback fired when search is cleared.                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

#### Example

```tsx
<SearchField
  label="Search orders"
  value={query}
  onInput={(e) => setQuery(e.target.value)}
/>
```

---

### Select

Dropdown select control wrapping `<s-select>`.

```tsx
import { Select } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                           | Type                                                                     | Description                                                                                                                                                                                                                                    |
| :----------------------------- | :----------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                           | `string &#124; undefined`                                                | A unique identifier for the element.                                                                                                                                                                                                           |
| `slot`                         | `Lowercase&lt;string&gt; &#124; undefined`                               | Assigns this element to a parent's slot.                                                                                                                                                                                                       |
| `children`                     | `any`                                                                    | The options a user can select from. Accepts `Option` and `OptionGroup` components.                                                                                                                                                             |
| `onFocus`                      | `((event: CallbackEvent&lt;"s-select"&gt;) =&gt; void) &#124; undefined` | —                                                                                                                                                                                                                                              |
| `onBlur`                       | `((event: CallbackEvent&lt;"s-select"&gt;) =&gt; void) &#124; undefined` | —                                                                                                                                                                                                                                              |
| `onInput`                      | `((event: CallbackEvent&lt;"s-select"&gt;) =&gt; void) &#124; undefined` | —                                                                                                                                                                                                                                              |
| `placeholder`                  | `string &#124; undefined`                                                | A short hint that describes the expected value of the field.                                                                                                                                                                                   |
| `disabled`                     | `boolean &#124; undefined`                                               | Disables the field, disallowing any interaction.                                                                                                                                                                                               |
| `name`                         | `string &#124; undefined`                                                | An identifier for the field that is unique within the nearest containing form.                                                                                                                                                                 |
| `icon`                         | `"" &#124; IconType &#124; "empty" &#124; undefined`                     | The type of icon to be displayed in the field.                                                                                                                                                                                                 |
| `error`                        | `string &#124; undefined`                                                | —                                                                                                                                                                                                                                              |
| `required`                     | `boolean &#124; undefined`                                               | Whether the field needs a value. This requirement adds semantic value to the field, but it will not cause an error to appear automatically. If you want to present an error when this field is empty, you can do so with the `error` property. |
| `labelAccessibilityVisibility` | `"visible" &#124; "exclusive" &#124; undefined`                          | Changes the visibility of the component's label. - `visible`: the label is visible to all users. - `exclusive`: the label is visually hidden but remains in the accessibility tree.                                                            |
| `label` **(required)**         | `ReactNode`                                                              | —                                                                                                                                                                                                                                              |
| `options` **(required)**       | `(string &#124; SelectOptionType)[]`                                     | —                                                                                                                                                                                                                                              |
| `value`                        | `V &#124; undefined`                                                     | —                                                                                                                                                                                                                                              |
| `onChange`                     | `((value: NoInfer&lt;V&gt;, id: string) =&gt; void) &#124; undefined`    | —                                                                                                                                                                                                                                              |
| `helpText`                     | `ReactNode`                                                              | —                                                                                                                                                                                                                                              |
| `details`                      | `ReactNode`                                                              | —                                                                                                                                                                                                                                              |
| `className`                    | `string &#124; undefined`                                                | —                                                                                                                                                                                                                                              |

#### Example

```tsx
<Select
  label="Status"
  options={[
    { label: "Active", value: "active" },
    { label: "Draft", value: "draft" },
  ]}
  value={status}
  onChange={(val) => setStatus(val)}
/>
```

---

### Skeleton

Skeleton placeholder line or box for loading state.

```tsx
import { Skeleton } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop           | Type                                                | Description                                                                                                                      |
| :------------- | :-------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| `width`        | `string &#124; number &#124; undefined`             | Width or inlineSize of the skeleton. Default "100%". Accepts numbers (px) or CSS strings.                                        |
| `inlineSize`   | `string &#124; number &#124; undefined`             | —                                                                                                                                |
| `height`       | `string &#124; number &#124; undefined`             | Height or blockSize of the skeleton. Default 16px. Accepts numbers (px) or CSS strings.                                          |
| `blockSize`    | `string &#124; number &#124; undefined`             | —                                                                                                                                |
| `borderRadius` | `number &#124; SkeletonRadiusType &#124; undefined` | Border radius: 'small' (4px) &#124; 'base' (8px, default) &#124; 'large' (12px) &#124; 'full' &#124; 'none' or custom CSS value. |
| `className`    | `string &#124; undefined`                           | —                                                                                                                                |
| `style`        | `CSSProperties &#124; undefined`                    | —                                                                                                                                |
| `children`     | `ReactNode`                                         | —                                                                                                                                |
| `id`           | `string &#124; undefined`                           | —                                                                                                                                |

#### Example

```tsx
<Skeleton inlineSize="200px" blockSize="24px" borderRadius="base" />
```

---

### SkeletonPage

Skeleton page layout placeholder with title and content skeleton blocks.

```tsx
import { SkeletonPage } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop            | Type                             | Description                                                        |
| :-------------- | :------------------------------- | :----------------------------------------------------------------- |
| `children`      | `ReactNode`                      | —                                                                  |
| `title`         | `ReactNode`                      | Draws a placeholder where the page title goes. Defaults to `true`. |
| `primaryAction` | `boolean &#124; undefined`       | Draws a placeholder button in the title row.                       |
| `id`            | `string &#124; undefined`        | —                                                                  |
| `className`     | `string &#124; undefined`        | —                                                                  |
| `style`         | `CSSProperties &#124; undefined` | —                                                                  |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `narrowWidth`: v12 narrowed the page; wrap in a `Page` for that.
> - `fullWidth`: v12 widened the page; wrap in a `Page` for that.

#### Example

```tsx
<SkeletonPage title="Products" primaryAction>
  <Skeleton inlineSize="100%" blockSize="200px" />
</SkeletonPage>
```

---

### Spinner

Loading spinner wrapping `<s-spinner>`.

```tsx
import { Spinner } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                 | Type                                                         | Description                                                                                                                                                                                                                                                                               |
| :------------------- | :----------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                 | `string &#124; undefined`                                    | A unique identifier for the element.                                                                                                                                                                                                                                                      |
| `slot`               | `Lowercase&lt;string&gt; &#124; undefined`                   | Assigns this element to a parent's slot.                                                                                                                                                                                                                                                  |
| `accessibilityLabel` | `string &#124; undefined`                                    | A label that describes the purpose of the progress. When set, it will be announced to users using assistive technologies and will provide them with more context. Providing an `accessibilityLabel` is recommended if there is no accompanying text describing that something is loading. |
| `size`               | `"base" &#124; "large-100" &#124; SizeType &#124; undefined` | —                                                                                                                                                                                                                                                                                         |
| `className`          | `string &#124; undefined`                                    | —                                                                                                                                                                                                                                                                                         |

#### Example

```tsx
<Spinner size="small" accessibilityLabel="Loading data" />
```

---

### Switch

Toggle switch control wrapping `<s-switch>`.

```tsx
import { Switch } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                           | Type                                                                                 | Description                                                                                                                                                                                                                                                                |
| :----------------------------- | :----------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                           | `string &#124; undefined`                                                            | A unique identifier for the element.                                                                                                                                                                                                                                       |
| `defaultChecked`               | `boolean &#124; undefined`                                                           | Whether the control is active by default.                                                                                                                                                                                                                                  |
| `slot`                         | `Lowercase&lt;string&gt; &#124; undefined`                                           | Assigns this element to a parent's slot.                                                                                                                                                                                                                                   |
| `onBlur`                       | `((event: CallbackEvent&lt;"s-switch"&gt;) =&gt; void) &#124; null &#124; undefined` | —                                                                                                                                                                                                                                                                          |
| `onInput`                      | `((event: CallbackEvent&lt;"s-switch"&gt;) =&gt; void) &#124; null &#124; undefined` | —                                                                                                                                                                                                                                                                          |
| `value`                        | `string &#124; undefined`                                                            | —                                                                                                                                                                                                                                                                          |
| `label`                        | `any`                                                                                | Visual content to use as the control label.                                                                                                                                                                                                                                |
| `disabled`                     | `boolean &#124; undefined`                                                           | Disables the control, disallowing any interaction.                                                                                                                                                                                                                         |
| `name`                         | `string &#124; undefined`                                                            | An identifier for the control that is unique within the nearest containing `Form` component.                                                                                                                                                                               |
| `accessibilityLabel`           | `string &#124; undefined`                                                            | A label used for users using assistive technologies like screen readers. When set, any children or `label` supplied will not be announced. This can also be used to display a control without a visual label, while still providing context to users using screen readers. |
| `details`                      | `any`                                                                                | Additional text to provide context or guidance for the field. This text is displayed along with the field and its label to offer more information or instructions to the user. This will also be exposed to screen reader users.                                           |
| `error`                        | `any`                                                                                | Indicate an error to the user. The field will be given a specific stylistic treatment to communicate problems that have to be resolved immediately.                                                                                                                        |
| `checked`                      | `boolean &#124; undefined`                                                           | Whether the control is active.                                                                                                                                                                                                                                             |
| `required`                     | `boolean &#124; undefined`                                                           | Whether the field needs a value. This requirement adds semantic value to the field, but it will not cause an error to appear automatically. If you want to present an error when this field is empty, you can do so with the `error` property.                             |
| `labelAccessibilityVisibility` | `"visible" &#124; "exclusive" &#124; undefined`                                      | Changes the visibility of the component's label. - `visible`: the label is visible to all users. - `exclusive`: the label is visually hidden but remains in the accessibility tree.                                                                                        |
| `onChange`                     | `((checked: boolean, id: string) =&gt; void) &#124; undefined`                       | —                                                                                                                                                                                                                                                                          |

#### Example

```tsx
<Switch
  label="Enable notifications"
  checked={enabled}
  onChange={(val) => setEnabled(val)}
/>
```

---

### Table

Native data table wrapping `<s-table>`. Composed using subcomponents `Table.HeaderRow`, `Table.HeaderCell`, `Table.Body`, `Table.Row`, and `Table.Cell`.

```tsx
import { Table } from "@xco-agency/corex-ui";
```

#### Subcomponents

| Subcomponent            | Description                                                                                | Key Props                                                                  |
| :---------------------- | :----------------------------------------------------------------------------------------- | :------------------------------------------------------------------------- |
| `Table.HeaderRow`       | Container row for header cells inside `Table`.                                             | `children, className, id, style`                                           |
| `Table.HeaderCell`      | Single column header cell. Wraps contents in a small Text component with optional tooltip. | `children, tooltip?, format?, listSlot?`                                   |
| `Table.Body`            | Body section containing `Table.Row` elements.                                              | `children, className, id, style`                                           |
| `Table.Row`             | Data row inside `Table.Body`.                                                              | `children, clickDelegate?, onClick?, className, id, style`                 |
| `Table.Cell`            | Standard data cell inside `Table.Row`.                                                     | `children, className, id, style`                                           |
| `Table.SubRowConnector` | Visual branch connector tree line for nested sub-rows.                                     | `isLast?: boolean, className, style`                                       |
| `Table.ExpandButton`    | Expand/collapse chevron toggle button for tree tables.                                     | `expanded: boolean, onToggle: (e) => void, accessibilityLabel?, disabled?` |

#### Modern Props

| Prop              | Type                                           | Description                                                                                                                                                                                                          |
| :---------------- | :--------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`              | `string &#124; undefined`                      | A unique identifier for the element.                                                                                                                                                                                 |
| `slot`            | `Lowercase&lt;string&gt; &#124; undefined`     | Assigns this element to a parent's slot.                                                                                                                                                                             |
| `children`        | `any`                                          | The content of the Table.                                                                                                                                                                                            |
| `loading`         | `boolean &#124; undefined`                     | Whether the table is in a loading state, such as initial page load or loading the next page in a paginated table. When true, the table could be in an inert state, which prevents user interaction.                  |
| `variant`         | `"list" &#124; "auto" &#124; undefined`        | Sets the layout of the Table. - `list`: The Table is displayed as a list. - `table`: The Table is displayed as a table. - `auto`: The Table is displayed as a table on wide devices and as a list on narrow devices. |
| `paginate`        | `boolean &#124; undefined`                     | Whether to use pagination controls.                                                                                                                                                                                  |
| `hasPreviousPage` | `boolean &#124; undefined`                     | Whether there's a previous page of data.                                                                                                                                                                             |
| `hasNextPage`     | `boolean &#124; undefined`                     | Whether there's an additional page of data.                                                                                                                                                                          |
| `onNextPage`      | `((event: Event) =&gt; void) &#124; undefined` | Called when the next page button is clicked.                                                                                                                                                                         |
| `onPreviousPage`  | `((event: Event) =&gt; void) &#124; undefined` | Called when the previous page button is clicked.                                                                                                                                                                     |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `Table.Header`: Deprecated header cell alias. Use Table.HeaderCell instead.

#### Example

```tsx
<Table>
  <Table.HeaderRow>
    <Table.HeaderCell>Product</Table.HeaderCell>
    <Table.HeaderCell>Price</Table.HeaderCell>
  </Table.HeaderRow>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Classic T-Shirt</Table.Cell>
      <Table.Cell>$25.00</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

---

### Tabs

Tabbed navigation bar supporting both standard tabs and compact index-filter view selectors.

```tsx
import { Tabs } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                  | Type                                                                                | Description                                                                                                                    |
| :-------------------- | :---------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------- |
| `tabs` **(required)** | `TabItemType&lt;TId&gt;[]`                                                          | —                                                                                                                              |
| `selected`            | `number &#124; TId &#124; null &#124; undefined`                                    | Index or ID of the currently selected tab. Can be a tab index (number) for Polaris compatibility or tab ID (`TId`).            |
| `onSelect`            | `((selected: TId) =&gt; void) &#124; ((index: number) =&gt; void) &#124; undefined` | Callback when a tab is selected. Receives tab ID (`TId`) or index (`number`).                                                  |
| `value`               | `TId &#124; null &#124; undefined`                                                  | ID of the currently selected tab.                                                                                              |
| `onChange`            | `((id: TId) =&gt; void) &#124; undefined`                                           | Callback when a tab is selected, passing the tab ID.                                                                           |
| `showBadge`           | `boolean &#124; undefined`                                                          | —                                                                                                                              |
| `rightSide`           | `ReactNode`                                                                         | —                                                                                                                              |
| `inlineSize`          | `"fill" &#124; "auto" &#124; "fit" &#124; undefined`                                | —                                                                                                                              |
| `compact`             | `boolean &#124; undefined`                                                          | Minimalist compact dropdown mode, rendering a dropdown selector button inspired by Shopify Polaris IndexFilters view switcher. |
| `children`            | `ReactNode`                                                                         | Content of the currently selected tab's panel.                                                                                 |
| `className`           | `string &#124; undefined`                                                           | —                                                                                                                              |
| `id`                  | `string &#124; undefined`                                                           | —                                                                                                                              |

#### Example

```tsx
<Tabs
  tabs={[
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "archived", label: "Archived" },
  ]}
  selected={currentTab}
  onSelect={(id) => setCurrentTab(id)}
/>
```

---

### Tag

Removable chip/tag wrapping `<s-chip>`.

```tsx
import { Tag } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                 | Type                                       | Description                                                                                                                               |
| :------------------- | :----------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                 | `string &#124; undefined`                  | A unique identifier for the element.                                                                                                      |
| `slot`               | `Lowercase&lt;string&gt; &#124; undefined` | Assigns this element to a parent's slot.                                                                                                  |
| `color`              | `ColorKeyword &#124; undefined`            | Modify the color to be more or less intense.                                                                                              |
| `accessibilityLabel` | `string &#124; undefined`                  | A label that describes the purpose or contents of the Chip. It will be read to users using assistive technologies such as screen readers. |
| `removable`          | `boolean &#124; undefined`                 | Whether the chip is removable.                                                                                                            |
| `children`           | `ReactNode`                                | —                                                                                                                                         |
| `onRemove`           | `(() =&gt; void) &#124; undefined`         | Passing a handler makes the tag removable, as it did in v12.                                                                              |
| `disabled`           | `boolean &#124; undefined`                 | —                                                                                                                                         |
| `className`          | `string &#124; undefined`                  | —                                                                                                                                         |
| `style`              | `CSSProperties &#124; undefined`           | —                                                                                                                                         |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `url`: v12 linked a tag to a URL; wrap it in a `Link` instead.

#### Example

```tsx
<Tag onRemove={() => handleRemove("summer")}>Summer Sale</Tag>
```

---

### Text

Primary typography component wrapping `<s-text>`. Provides variants, tones, weights, and truncation.

```tsx
import { Text } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                      | Type                                                                                                                                              | Description                                                                                                                                                                                                                                                       |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                      | `string &#124; undefined`                                                                                                                         | A unique identifier for the element.                                                                                                                                                                                                                              |
| `slot`                    | `Lowercase&lt;string&gt; &#124; undefined`                                                                                                        | Assigns this element to a parent's slot.                                                                                                                                                                                                                          |
| `type`                    | `"strong" &#124; "address" &#124; "generic" &#124; "redundant" &#124; undefined`                                                                  | Provide semantic meaning and default styling to the text. Other presentation properties on Text override the default styling.                                                                                                                                     |
| `interestFor`             | `string &#124; undefined`                                                                                                                         | ID of a component that should respond to interest (e.g. hover and focus) on this component. ID of the element (e.g. s-tooltip) that should respond to interest/hover on this text                                                                                 |
| `accessibilityVisibility` | `"hidden" &#124; "visible" &#124; "exclusive" &#124; undefined`                                                                                   | Changes the visibility of the element. - `visible`: the element is visible to all users. - `hidden`: the element is removed from the accessibility tree but remains visible. - `exclusive`: the element is visually hidden but remains in the accessibility tree. |
| `fontVariantNumeric`      | `"auto" &#124; "normal" &#124; "tabular-nums" &#124; undefined`                                                                                   | Set the numeric properties of the font.                                                                                                                                                                                                                           |
| `children`                | `ReactNode`                                                                                                                                       | —                                                                                                                                                                                                                                                                 |
| `variant`                 | `"small" &#124; "base" &#124; "large" &#124; "xs" &#124; ...`                                                                                     | —                                                                                                                                                                                                                                                                 |
| `tone`                    | `ToneType &#124; "white"`                                                                                                                         | —                                                                                                                                                                                                                                                                 |
| `color`                   | `(string & {}) &#124; "base" &#124; "info" &#124; "success" &#124; "warning" &#124; "critical" &#124; "subdued" &#124; "strong" &#124; undefined` | Text color: supports Polaris keywords ('base', 'subdued', 'strong') and legacy Polaris 'subdued'                                                                                                                                                                  |
| `fontWeight`              | `(string & {}) &#124; "medium" &#124; "regular" &#124; "semibold" &#124; "bold" &#124; undefined`                                                 | Font weight: supports regular, medium, semibold, bold                                                                                                                                                                                                             |
| `heading`                 | `boolean &#124; undefined`                                                                                                                        | Applies heading weight and semantic h* wrapper tag per variant                                                                                                                                                                                                    |
| `as`                      | `ElementType &#124; undefined`                                                                                                                    | Custom tag override (e.g. `as="p"` or `as="span"`).                                                                                                                                                                                                               |
| `underline`               | `boolean &#124; undefined`                                                                                                                        | Shorthand for subdued color                                                                                                                                                                                                                                       |
| `lineClamp`               | `number &#124; undefined`                                                                                                                         | —                                                                                                                                                                                                                                                                 |
| `breakWord`               | `boolean &#124; undefined`                                                                                                                        | —                                                                                                                                                                                                                                                                 |
| `numeric`                 | `boolean &#124; undefined`                                                                                                                        | —                                                                                                                                                                                                                                                                 |
| `className`               | `string &#124; undefined`                                                                                                                         | —                                                                                                                                                                                                                                                                 |
| `style`                   | `CSSProperties &#124; undefined`                                                                                                                  | —                                                                                                                                                                                                                                                                 |
| `tooltip`                 | `ReactNode`                                                                                                                                       | —                                                                                                                                                                                                                                                                 |

#### Example

```tsx
<Text variant="headingMd" tone="neutral" fontWeight="bold">
  Orders
</Text>
```

---

### TextContainer

Typography container providing consistent vertical flow and paragraph margins.

```tsx
import { TextContainer } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop        | Type                                        | Description                             |
| :---------- | :------------------------------------------ | :-------------------------------------- |
| `children`  | `ReactNode`                                 | —                                       |
| `spacing`   | `TextContainerSpacingType &#124; undefined` | v12's two rhythms. Defaults to `loose`. |
| `id`        | `string &#124; undefined`                   | —                                       |
| `className` | `string &#124; undefined`                   | —                                       |
| `style`     | `CSSProperties &#124; undefined`            | —                                       |

#### Example

```tsx
<TextContainer spacing="base">
  <Paragraph>First paragraph.</Paragraph>
  <Paragraph>Second paragraph.</Paragraph>
</TextContainer>
```

---

### TextField

Single-line or multiline text input wrapping `<s-text-field>` and `<s-text-area>`.

```tsx
import { TextField } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                           | Type                                                                                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :----------------------------- | :--------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                           | `string &#124; undefined`                                                                | A unique identifier for the element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `defaultValue`                 | `string &#124; undefined`                                                                | The default value for the field.                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `slot`                         | `Lowercase&lt;string&gt; &#124; undefined`                                               | Assigns this element to a parent's slot.                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `prefix`                       | `string &#124; undefined`                                                                | A value to be displayed immediately before the editable portion of the field. This is useful for displaying an implied part of the value, such as "https://" or "+353". This cannot be edited by the user, and it isn't included in the value of the field. It may not be displayed until the user has interacted with the input. For example, an inline label may take the place of the prefix until the user focuses the input.                                                                             |
| `children`                     | `ReactNode`                                                                              | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `onFocus`                      | `((event: CallbackEvent&lt;"s-text-field"&gt;) =&gt; void) &#124; null &#124; undefined` | A callback fired when the field receives focus.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `onBlur`                       | `((event: CallbackEvent&lt;"s-text-field"&gt;) =&gt; void) &#124; null &#124; undefined` | A callback fired when the field loses focus.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `onInput`                      | `((event: CallbackEvent&lt;"s-text-field"&gt;) =&gt; void) &#124; null &#124; undefined` | A callback fired when the user makes changes to the field value. This fires before `onChange`.                                                                                                                                                                                                                                                                                                                                                                                                                |
| `value`                        | `string &#124; undefined`                                                                | The current value for the field. If omitted, the field will be empty.                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `label`                        | `any`                                                                                    | Content to use as the field label.                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `placeholder`                  | `string &#124; undefined`                                                                | A short hint that describes the expected value of the field.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `disabled`                     | `boolean &#124; undefined`                                                               | Disables the field, disallowing any interaction.                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `name`                         | `string &#124; undefined`                                                                | An identifier for the field that is unique within the nearest containing form.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `icon`                         | `AnyString &#124; IconType$1 &#124; undefined`                                           | The type of icon to be displayed in the field.                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `details`                      | `string &#124; undefined`                                                                | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `error`                        | `string &#124; undefined`                                                                | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `required`                     | `boolean &#124; undefined`                                                               | Whether the field needs a value. This requirement adds semantic value to the field, but it will not cause an error to appear automatically. If you want to present an error when this field is empty, you can do so with the `error` property.                                                                                                                                                                                                                                                                |
| `labelAccessibilityVisibility` | `"visible" &#124; "exclusive" &#124; undefined`                                          | Changes the visibility of the component's label. - `visible`: the label is visible to all users. - `exclusive`: the label is visually hidden but remains in the accessibility tree.                                                                                                                                                                                                                                                                                                                           |
| `readOnly`                     | `boolean &#124; undefined`                                                               | The field cannot be edited by the user. It is focusable will be announced by screen readers.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `autocomplete`                 | `"off" &#124; "on" &#124; string`                                                        | A hint as to the intended content of the field. When set to `on` (the default), this property indicates that the field should support autofill, but you do not have any more semantic information on the intended contents. When set to `off`, you are indicating that this field contains sensitive information, or contents that are never saved, like one-time codes. Alternatively, you can provide value which describes the specific data you would like to be entered into this field during autofill. |
| `maxLength`                    | `number &#124; undefined`                                                                | Specifies the maximum number of characters allowed.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `minLength`                    | `number &#124; undefined`                                                                | Specifies the min number of characters allowed.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `suffix`                       | `string &#124; undefined`                                                                | A value to be displayed immediately after the editable portion of the field. This is useful for displaying an implied part of the value, such as "@shopify.com", or "%". This cannot be edited by the user, and it isn't included in the value of the field. It may not be displayed until the user has interacted with the input. For example, an inline label may take the place of the suffix until the user focuses the input.                                                                            |
| `onChange`                     | `((value: string, id: string) =&gt; void) &#124; undefined`                              | Legacy signature: fires on every keystroke, mirroring `s-text-field`'s `onInput`.                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `helpText`                     | `string &#124; undefined`                                                                | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `multiline`                    | `number &#124; boolean &#124; undefined`                                                 | `true`/a row count renders `s-text-area` instead of `s-text-field`.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `autoComplete`                 | `string &#124; undefined`                                                                | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `requiredIndicator`: Deprecated. Use `required` instead.

#### Example

```tsx
<TextField
  label="Email"
  value={email}
  onChange={(val) => setEmail(val)}
  placeholder="user@example.com"
/>
```

---

### Thumbnail

Product or media image thumbnail wrapping `<s-thumbnail>`.

```tsx
import { Thumbnail } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop     | Type                                                                                                             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| :------- | :--------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`     | `string &#124; undefined`                                                                                        | A unique identifier for the element.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `slot`   | `Lowercase&lt;string&gt; &#124; undefined`                                                                       | Assigns this element to a parent's slot.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `alt`    | `string &#124; undefined`                                                                                        | An alternative text description that describe the image for the reader to understand what it is about. It is extremely useful for both users using assistive technology and sighted users. A well written description provides people with visual impairments the ability to participate in consuming non-text content. When a screen readers encounters an `s-image`, the description is read and announced aloud. If an image fails to load, potentially due to a poor connection, the `alt` is displayed on screen instead. This has the benefit of letting a sighted buyer know an image was meant to load here, but as an alternative, they’re still able to consume the text content. Read [considerations when writing alternative text](https://www.shopify.com/ca/blog/image-alt-text#4) to learn more. |
| `size`   | `"small-200" &#124; "small-100" &#124; "small" &#124; "base" &#124; "large" &#124; "large-100" &#124; undefined` | Adjusts the size the product thumbnail image.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `src`    | `string &#124; undefined`                                                                                        | The image URL. Supports both modern `src` and legacy Polaris `source`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `source` | `string &#124; undefined`                                                                                        | —                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

#### Example

```tsx
<Thumbnail src="https://placehold.co/100" size="small" alt="Product thumbnail" />
```

---

### TitleBar

Shopify App Bridge modal or page title bar wrapping `<ui-title-bar>`.

```tsx
import { TitleBar } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop             | Type                                                                                                                               | Description                                                                                           |
| :--------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| `id`             | `string &#124; undefined`                                                                                                          | —                                                                                                     |
| `className`      | `string &#124; undefined`                                                                                                          | —                                                                                                     |
| `style`          | `CSSProperties &#124; undefined`                                                                                                   | —                                                                                                     |
| `defaultChecked` | `boolean &#124; undefined`                                                                                                         | —                                                                                                     |
| `defaultValue`   | `string &#124; number &#124; readonly string[] &#124; undefined`                                                                   | —                                                                                                     |
| `slot`           | `string &#124; undefined`                                                                                                          | —                                                                                                     |
| `tabIndex`       | `number &#124; undefined`                                                                                                          | —                                                                                                     |
| `role`           | `AriaRole &#124; undefined`                                                                                                        | —                                                                                                     |
| `prefix`         | `string &#124; undefined`                                                                                                          | —                                                                                                     |
| `color`          | `string &#124; undefined`                                                                                                          | —                                                                                                     |
| `inputMode`      | `"none" &#124; "search" &#124; "text" &#124; "tel" &#124; "url" &#124; "email" &#124; "numeric" &#124; "decimal" &#124; undefined` | Hints at the type of data that might be entered by the user while editing the element or its contents |
| `children`       | `ReactNode`                                                                                                                        | Action buttons or content placed within the title bar.                                                |
| `onFocus`        | `FocusEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                            | —                                                                                                     |
| `onBlur`         | `FocusEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                            | —                                                                                                     |
| `onChange`       | `FormEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                             | —                                                                                                     |
| `onInput`        | `FormEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                             | —                                                                                                     |
| `onKeyDown`      | `KeyboardEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                         | —                                                                                                     |
| `onKeyUp`        | `KeyboardEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                         | —                                                                                                     |
| `onClick`        | `MouseEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                            | —                                                                                                     |
| `onMouseEnter`   | `MouseEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                            | —                                                                                                     |
| `onMouseLeave`   | `MouseEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                            | —                                                                                                     |
| `onSelect`       | `ReactEventHandler&lt;HTMLElement&gt; &#124; undefined`                                                                            | —                                                                                                     |
| `title`          | `string &#124; undefined`                                                                                                          | The title text displayed in the modal title bar.                                                      |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `onKeyPress`: Use `onKeyUp` or `onKeyDown` instead
> - `onKeyPressCapture`: Use `onKeyUpCapture` or `onKeyDownCapture` instead

#### Example

```tsx
<TitleBar title="Settings">
  <Button variant="primary" onClick={() => handleSave()}>
    Save
  </Button>
</TitleBar>
```

---

### Toast

Transient toast notification anchored via App Bridge.

```tsx
import { Toast } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop        | Type                               | Description                                                                                                                                                                                               |
| :---------- | :--------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `error`     | `boolean &#124; undefined`         | —                                                                                                                                                                                                         |
| `duration`  | `number &#124; undefined`          | Milliseconds the toast stays up.                                                                                                                                                                          |
| `onDismiss` | `(() =&gt; void) &#124; undefined` | v12 called this when the toast timed out or was dismissed. App Bridge gives no such callback, so it fires once the toast has been raised — which is what call sites use it for: clearing their own state. |
| `content`   | `string &#124; undefined`          | Toast message. Nothing is raised without content.                                                                                                                                                         |

> [!CAUTION]
> **Forbidden Legacy Props (DO NOT USE)**:
>
> - `action`: v12 put an action in the toast; App Bridge's has none.

#### Example

```tsx
<Toast content="Changes saved successfully" onDismiss={() => setToastOpen(false)} />
```

---

### Tooltip

Lightweight popup tooltip wrapping `<s-tooltip>`.

```tsx
import { Tooltip } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                      | Type                                       | Description                              |
| :------------------------ | :----------------------------------------- | :--------------------------------------- |
| `id`                      | `string &#124; undefined`                  | A unique identifier for the element.     |
| `slot`                    | `Lowercase&lt;string&gt; &#124; undefined` | Assigns this element to a parent's slot. |
| `children` **(required)** | `ReactNode`                                | The element the tooltip is anchored to.  |
| `className`               | `string &#124; undefined`                  | —                                        |
| `content` **(required)**  | `ReactNode`                                | The tooltip content.                     |

#### Example

```tsx
<Tooltip content="Order fulfillment status">
  <Badge tone="info">Unfulfilled</Badge>
</Tooltip>
```

---

### Transition

Animated transition wrapper for enter/exit animations.

```tsx
import { Transition } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop             | Type                                                                    | Description                                                                                                                               |
| :--------------- | :---------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `children`       | `ReactNode`                                                             | The content to animate. Supports either standard React nodes or a render function receiving current animation phase information.          |
| `animate`        | `TransitionVariantType &#124; TransitionKeyframesType &#124; undefined` | Animation preset variant name or custom keyframes definition.                                                                             |
| `variant`        | `TransitionVariantType &#124; TransitionKeyframesType &#124; undefined` | Alias for `animate` to follow Polaris / design-system prop conventions.                                                                   |
| `show`           | `boolean &#124; undefined`                                              | Whether the element is currently visible / active. If not provided, defaults to `true` (animates in when mounted).                        |
| `leaving`        | `boolean &#124; undefined`                                              | Inverse alias for `show` — convenient for wizard and stage workflows. When `leaving={true}`, the component automatically transitions out. |
| `appear`         | `boolean &#124; undefined`                                              | Whether to animate into view when the component first mounts.                                                                             |
| `duration`       | `TransitionDurationType &#124; undefined`                               | Transition duration in milliseconds, or separate enter and exit durations.                                                                |
| `delay`          | `TransitionDelayType &#124; undefined`                                  | Transition delay in milliseconds, or separate enter and exit delays.                                                                      |
| `easing`         | `TransitionEasingType &#124; undefined`                                 | CSS transition timing function, or separate enter and exit timing functions.                                                              |
| `reverse`        | `boolean &#124; undefined`                                              | When `true`, exiting returns strictly back to the `enterFrom` position (pure reverse motion) rather than the forward `exitTo` position.   |
| `onEnter`        | `(() =&gt; void) &#124; undefined`                                      | Called when the enter transition begins.                                                                                                  |
| `onEntered`      | `(() =&gt; void) &#124; undefined`                                      | Called when the enter transition completes.                                                                                               |
| `onExit`         | `(() =&gt; void) &#124; undefined`                                      | Called when the exit transition begins.                                                                                                   |
| `onExited`       | `(() =&gt; void) &#124; undefined`                                      | Called when the exit transition completes.                                                                                                |
| `as`             | `ElementType &#124; undefined`                                          | HTML element type used for the outer wrapper.                                                                                             |
| `inlineSize`     | `string &#124; number &#124; undefined`                                 | Width / inline size of the wrapper.                                                                                                       |
| `blockSize`      | `string &#124; number &#124; undefined`                                 | Height / block size of the wrapper.                                                                                                       |
| `display`        | `Display &#124; undefined`                                              | CSS display property.                                                                                                                     |
| `alignItems`     | `AlignItems &#124; undefined`                                           | CSS align-items property.                                                                                                                 |
| `justifyContent` | `JustifyContent &#124; undefined`                                       | CSS justify-content property.                                                                                                             |
| `flexDirection`  | `FlexDirection &#124; undefined`                                        | CSS flex-direction property.                                                                                                              |
| `style`          | `CSSProperties &#124; undefined`                                        | Additional custom inline styles.                                                                                                          |
| `className`      | `string &#124; undefined`                                               | Additional class name.                                                                                                                    |
| `id`             | `string &#124; undefined`                                               | HTML element ID.                                                                                                                          |
| `role`           | `string &#124; undefined`                                               | ARIA role of the wrapper, e.g. `"rowgroup"`.                                                                                              |

#### Example

```tsx
<Transition show={isVisible} variant="fade">
  <Text>Fade animated content</Text>
</Transition>
```

---

### UrlField

URL input wrapping `<s-url-field>` with URL-specific keyboard and validation.

```tsx
import { UrlField } from "@xco-agency/corex-ui";
```

#### Modern Props

| Prop                           | Type                                                        | Description                                                                      |
| :----------------------------- | :---------------------------------------------------------- | :------------------------------------------------------------------------------- |
| `label` **(required)**         | `ReactNode`                                                 | —                                                                                |
| `value`                        | `string &#124; undefined`                                   | —                                                                                |
| `defaultValue`                 | `string &#124; undefined`                                   | —                                                                                |
| `minLength`                    | `number &#124; undefined`                                   | —                                                                                |
| `maxLength`                    | `number &#124; undefined`                                   | —                                                                                |
| `onChange`                     | `((value: string, id: string) =&gt; void) &#124; undefined` | Legacy signature: fires on every keystroke, mirroring `s-url-field`'s `onInput`. |
| `onBlur`                       | `((event: Event) =&gt; void) &#124; undefined`              | —                                                                                |
| `onFocus`                      | `((event: Event) =&gt; void) &#124; undefined`              | —                                                                                |
| `placeholder`                  | `string &#124; undefined`                                   | —                                                                                |
| `disabled`                     | `boolean &#124; undefined`                                  | —                                                                                |
| `readOnly`                     | `boolean &#124; undefined`                                  | —                                                                                |
| `error`                        | `ReactNode`                                                 | —                                                                                |
| `helpText`                     | `ReactNode`                                                 | —                                                                                |
| `details`                      | `ReactNode`                                                 | —                                                                                |
| `prefix`                       | `ReactNode`                                                 | —                                                                                |
| `suffix`                       | `ReactNode`                                                 | —                                                                                |
| `autoComplete`                 | `string &#124; undefined`                                   | —                                                                                |
| `labelAccessibilityVisibility` | `"visible" &#124; "exclusive" &#124; undefined`             | —                                                                                |
| `id`                           | `string &#124; undefined`                                   | —                                                                                |
| `name`                         | `string &#124; undefined`                                   | —                                                                                |
| `requiredIndicator`            | `boolean &#124; undefined`                                  | —                                                                                |
| `className`                    | `string &#124; undefined`                                   | —                                                                                |

#### Example

```tsx
<UrlField label="Website" value={url} onChange={(val) => setUrl(val)} />
```

---
