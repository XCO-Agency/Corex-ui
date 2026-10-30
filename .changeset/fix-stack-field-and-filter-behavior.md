---
"@xco-agency/corex-ui": patch
---

Fix layout and field behavior the component docs already described. `BlockStack` and `InlineStack` `shrink` maps `true` to flex-shrink 1, `false` to 0, and a number to that flex-shrink value. `TextContainer` uses the loose (`base`) and tight (`small-200`) rhythms. `MoneyField` `onChange` fires on each keystroke. App Bridge modals mount their SaveBar as a child of the modal. A fixed IndexFilters column keeps its drag handle and disables it.
