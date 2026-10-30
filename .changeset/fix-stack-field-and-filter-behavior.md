---
"@xco-agency/corex-ui": patch
---

Fix layout and field behavior the component docs already described. `BlockStack` and `InlineStack` `shrink` now maps `true` to flex-shrink 1 and `false` to 0. `TextContainer` uses the loose (`base`) and tight (`small-200`) rhythms. `MoneyField` `onChange` fires on each keystroke. App Bridge modals mount their SaveBar. Fixed IndexFilters columns no longer show a drag handle.
