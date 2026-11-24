---
name: corex-ui-components
description: >-
  How to build Shopify embedded-app admin pages with @xco-agency/corex-ui: which
  page layout to use (detail/edit/create, settings, index, dashboard, onboarding),
  which field component fits each kind of data, modern props only (no deprecated
  Polaris React props), and no raw HTML. Use for any admin UI, form, page or
  chart written with corex-ui.
---

# Corex UI: build pages the Shopify way

Import everything from `@xco-agency/corex-ui` (or the app's `~/ui` barrel). Exact props: read `<Name>PropsType` in `node_modules/@xco-agency/corex-ui/dist/index.d.ts`. Per-component prop tables: [references/components.md](references/components.md). Never recall props from Polaris React.

## Workflow

1. Pick the **page type** below. It fixes `Page` `inlineSize`, the aside and where actions go.
2. Compose the page from `Card`s (one topic each, with a `heading`).
3. Pick each **field by what the data is**, not by habit (field table below).
4. Check the rules and the deprecated list, then verify unfamiliar props in the `.d.ts`.

## Hard rules

- **Only corex-ui components.** No `<div>`, `<span>`, `<button>`, `<input>`, `<a>`, inline `style`, or Tailwind in admin UI. Layout is `Page`, `Card`, `BlockStack`, `InlineStack`, `Grid`, `InlineGrid`, `Box`.
- **Spacing tokens**: `none`, `small-500`…`small-100`, `small`, `base`, `large-100`…`large-500`. Never `"100"`, `"200"`, `"400"`.
- **Never pass `style` to `Card`.** Wrap it in `Box` if you need sizing.
- **Navigate with `Link`/`Button href`**, never `<a>` or `window.location` (breaks the embedded iframe).
- **Strings** are not hard-coded: pass them from the app's i18n.
- **One primary action** per page and per card. Destructive = `tone="critical"`.

## Deprecated → use

| Don't                                                              | Do                                                                  |
| :----------------------------------------------------------------- | :------------------------------------------------------------------ |
| `Page title`, `subtitle`                                           | `heading`; extra context in `accessory` or the body                 |
| `Page fullWidth` / `narrowWidth`                                   | `inlineSize="large"` / `"small"`                                    |
| `Page backAction`                                                  | `breadcrumbActions`                                                 |
| `Page actionGroups`, `titleMetadata`                               | `secondaryActions`, `accessory`                                     |
| `Card title`, `sectioned`                                          | `heading`; drop `sectioned`                                         |
| `Layout` / `Layout.Section` (legacy)                               | `Page aside`, `Grid`, `InlineGrid`                                  |
| `Button primary` / `destructive` / `plain` / `outline`             | `variant="primary"` / `tone="critical"` / `"plain"` / `"secondary"` |
| `Button url`, `external`, `fullWidth`                              | `href`, `target="_blank"`, `inlineSize="fill"`                      |
| `Banner title`, `status`; `Badge status`                           | `heading`, `tone`; `tone`                                           |
| `BlockStack align`/`inlineAlign`; `InlineStack align`/`blockAlign` | `alignItems`/`justifyContent`; `justifyContent`/`alignItems`        |
| `Box width`/`minWidth`/`maxWidth`, `height`…                       | `inlineSize`/`minInlineSize`/`maxInlineSize`, `blockSize`…          |
| `TextField requiredIndicator`; `helpText`                          | `required`; `details`                                               |
| `Checkbox`/`RangeSlider` `labelHidden`                             | `labelAccessibilityVisibility="exclusive"` (where the prop exists)  |
| `Combobox allowMultiple`/`active`; `ChoiceList title`              | `multiple`/`open`; `label`                                          |
| `EmptyState title`                                                 | `heading`                                                           |
| `Table.Header`                                                     | `Table.HeaderCell`                                                  |

## Page types

`Page` `inlineSize`: `base` (default, the only size that renders `aside`), `small` (narrow single column), `large` (full width). Page slots: `heading`, `primaryAction`, `secondaryActions`, `breadcrumbActions`, `accessory` (a `Badge` beside the heading), `aside`. Put Cards straight in `Page`; wrap them in `BlockStack gap="base"` when a `Banner` or other element sits among them, and wrap several aside Cards in one `BlockStack gap="base"`.

| Page                                                           | `inlineSize` | Shape                                                                                                                |
| :------------------------------------------------------------- | :----------- | :------------------------------------------------------------------------------------------------------------------- |
| **Detail / edit / create** (product, order, discount, bundle…) | `base`       | Main column of Cards + **`aside`** column of small Cards (Status, Organization, Notes). Like Shopify's product page. |
| **Settings** (app config, billing, preferences)                | `small`      | One column, one Card per group, no aside. Short.                                                                     |
| **Index / list** (products, offers, orders)                    | `large`      | `IndexFilters` + `IndexTable` in one Card with `padding="none"`, `Pagination` below. `EmptyState` when empty.        |
| **Dashboard / analytics**                                      | `large`      | `Grid columns={{ xs: 1, md: 2 }}` of `Card`s holding `Chart*`; summary `MetricCard`s on top.                         |
| **Onboarding / wizard / single task**                          | `small`      | `Banner`/progress on top, one Card per step, one primary `Button`.                                                   |

Rules for every page:

- `Banner` goes first, directly under the header, for page-level problems only. `tone` info/success/warning/critical.
- **Forms save through `SaveBar`** (`open={dirty}`, `onSave`, `onDiscard`, `loading`), not a Save button in the page body. Pages that aren't forms use `primaryAction`.
- Success confirmation = `useToast`; confirmation of a destructive action = `Modal` with a `tone="critical"` primary action.
- `breadcrumbActions` on every page deeper than the app's top level.
- Empty list = `EmptyState` (heading, one `action`, optional `secondaryAction`) inside the list's Card.

### Detail / edit / create

```tsx
<Page
  heading={product ? product.title : t("product.new")}
  inlineSize="base"
  breadcrumbActions={<Link href="/app/products">{t("products")}</Link>}
  accessory={<Badge tone="success">{t("status.active")}</Badge>}
  secondaryActions={[{ content: t("duplicate"), onClick: duplicate }]}
  aside={
    <BlockStack gap="base">
      <Card heading={t("status")}>
        <Select
          label={t("status")}
          labelAccessibilityVisibility="exclusive"
          options={statusOptions}
          value={status}
          onChange={setStatus}
        />
      </Card>
      <Card heading={t("organization")}>
        <FormLayout>
          <TextField label={t("vendor")} value={vendor} onChange={setVendor} />
          <TextField
            label={t("tags")}
            value={tags}
            onChange={setTags}
            details={t("tagsHelp")}
          />
        </FormLayout>
      </Card>
    </BlockStack>
  }
>
  <Card heading={t("details")}>
    <FormLayout>
      <TextField
        label={t("title")}
        value={title}
        onChange={setTitle}
        required
        error={errors.title}
      />
      <TextField
        label={t("description")}
        value={description}
        onChange={setDescription}
        multiline={4}
      />
    </FormLayout>
  </Card>
  <Card heading={t("pricing")}>
    <FormLayout>
      <FormLayout.Group>
        <MoneyField label={t("price")} value={price} onChange={setPrice} />
        <MoneyField label={t("compareAt")} value={compareAt} onChange={setCompareAt} />
      </FormLayout.Group>
    </FormLayout>
  </Card>
  <SaveBar open={dirty} onSave={save} onDiscard={reset} loading={saving} />
</Page>
```

Main column: the primary content in reading order (details → media → pricing → variants → SEO). Aside: status/visibility, organization, secondary info. Never put the main form in the aside.

### Settings

```tsx
<Page heading={t("settings")} inlineSize="small">
  <Card heading={t("general")}>
    <FormLayout>
      <TextField label={t("storeName")} value={name} onChange={setName} />
      <Switch
        label={t("enableApp")}
        checked={enabled}
        onChange={setEnabled}
        details={t("enableAppHelp")}
      />
    </FormLayout>
  </Card>
  <Card heading={t("notifications")}>
    <ChoiceList
      label={t("sendEmailsFor")}
      multiple
      choices={emailChoices}
      selected={emailFor}
      onChange={setEmailFor}
    />
  </Card>
  <SaveBar open={dirty} onSave={save} onDiscard={reset} />
</Page>
```

Settings are instant-apply `Switch`es or a form with `SaveBar`; never both in one Card.

### Index / list

```tsx
<Page
  heading={t("offers")}
  inlineSize="large"
  primaryAction={{ content: t("createOffer"), href: "/app/offers/new" }}
>
  <Card padding="none">
    <IndexFilters {...filterProps} />
    <IndexTable {...tableProps}>{rows}</IndexTable>
    <Pagination hasPrevious hasNext onPrevious={prev} onNext={next} />
  </Card>
</Page>
```

Use `useIndexResourceState` for selection and `bulkActions`. `Table` is for small static tables, `ResourceList` for simple rows.

### Dashboard

```tsx
<Page heading={t("analytics")} inlineSize="large">
  <Grid columns={{ xs: 1, md: 2 }} gap="base">
    <Card heading={t("sessions")} tooltip={t("sessionsHelp")}>
      <ChartLine
        ariaLabel={t("sessionsChart")}
        dates={dates}
        series={series}
        formatValue={fmt}
        formatDate={fmtDate}
      />
    </Card>
    <Card heading={t("byChannel")}>
      <ChartDonut
        ariaLabel={t("byChannel")}
        slices={slices}
        total={total}
        totalLabel={t("total")}
      />
    </Card>
  </Grid>
</Page>
```

Charts (`ChartLine` `curve="smooth|sharp"`, `ChartBar`, `ChartFunnel`, `ChartBarList`, `ChartDonut`, `ChartSparkline`) carry no title: the `Card` provides `heading`/`tooltip`. All text and number/date formatting comes in through props.

## Fields by kind of data

Every field takes `label` (required), `value`/`onChange`, `error`, `details` (help), `required`, `disabled`. Hide a label visually with `labelAccessibilityVisibility="exclusive"`, never by omitting it.

| The value is…                                    | Use                                                | Notes                                                 |
| :----------------------------------------------- | :------------------------------------------------- | :---------------------------------------------------- |
| Short text (name, title, SKU)                    | `TextField`                                        | `maxLength` when limited; `prefix`/`suffix` for units |
| Long text                                        | `TextField multiline={4}`                          |                                                       |
| Formatted description                            | `RichTextEditor`                                   |                                                       |
| Email / URL / secret                             | `EmailField` / `UrlField` / `PasswordField`        | Gives the right keyboard and validation               |
| Count, quantity, percent                         | `NumberField` (`min`, `max`, `step`; `suffix="%"`) |                                                       |
| Money                                            | `MoneyField`                                       | Never a text field                                    |
| Date / date range                                | `DateField` / `DatePicker allowRange`              |                                                       |
| Colour                                           | `ColorField`                                       | Store hex                                             |
| One of 2–4 short options                         | `Segment`                                          | Inline toggle                                         |
| One of 2–5 options needing explanation           | `ChoiceList` (single)                              | Radios, each choice may have `helpText`               |
| One of 6+ options                                | `Select`                                           | `options` are `{ label, value }`                      |
| One or many from a long or searchable list       | `Combobox` / `Autocomplete`                        | `multiple` for tags                                   |
| Several of a few options                         | `ChoiceList multiple`                              | Checkboxes                                            |
| On/off that applies immediately                  | `Switch`                                           | In settings                                           |
| On/off submitted with the form, agreements, rows | `Checkbox`                                         |                                                       |
| A number on a range                              | `RangeSlider`                                      | Show `output`                                         |
| File or image upload                             | `DropZone`                                         | Show uploads with `Thumbnail`                         |
| Search box                                       | `SearchField`                                      | `onDebouncedChange`                                   |

Form layout: wrap fields in `FormLayout` (vertical, gap `base`); put **related short fields side by side** in `FormLayout.Group` (two columns; price + compare-at, first + last name). One field per row for anything long. Group related fields in one `Card`; unrelated groups get their own `Card`. Validation: set `error` on the field, never a `Banner`, unless the whole page failed.

## Actions and text

- `Button`: `variant` `primary` (one per area) / `secondary` / `tertiary` (dense rows) / `plain`; `tone="critical"` to delete; `loading` while saving; `href` to navigate; `icon` for icon-only with `accessibilityLabel`.
- `Text`: `variant` `headingSm|Md|Lg|Xl`, `bodySm|Md|Lg`; `color="subdued"` for secondary text; `tooltip` for a dotted-underline definition. Don't use heading variants for body copy.
- `Badge` `tone` for status (`success`, `warning`, `critical`, `info`, `attention`); `Tag` for user-entered labels.

## Before you finish

- Does the page type match the table (size, aside, save bar)?
- Is every field the right component for its data? No `TextField` for money, numbers, dates, emails or enums.
- Zero deprecated props, zero raw HTML/`style`, only spacing tokens, strings via i18n?
- Props you were unsure of verified in the `.d.ts`?
