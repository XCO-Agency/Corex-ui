# AI Coding Assistant Skill

`@xco-agency/corex-ui` includes an official **Agent Skill** designed for AI coding assistants (such as **Cursor**, **Claude Code**, **Antigravity**, **Windsurf**, and **GitHub Copilot**).

The skill equips your AI assistant with the complete component catalog, modern prop definitions, subcomponents, and rules — preventing it from hallucinating deprecated Polaris React props or outputting invalid HTML elements.

---

## Quick Install via `skills.sh`

In your consuming Shopify app's root directory, run:

```bash
# Using pnpm
pnpm dlx skills add XCO-Agency/Corex-ui

# Using npm
npx skills add XCO-Agency/Corex-ui

# Using bun
bunx skills add XCO-Agency/Corex-ui
```

The interactive CLI will detect your project and prompt you to select your AI coding assistant.

---

## Target Specific AI Assistants

You can install directly for your specific tool using the `-a` flag:

### Cursor

```bash
pnpm dlx skills add XCO-Agency/Corex-ui -a cursor
```

_Installs the rule into your project's `.cursor/rules/` directory._

### Claude Code

```bash
pnpm dlx skills add XCO-Agency/Corex-ui -a claude-code
```

_Installs the skill into your project's `.claude/skills/` directory._

### Antigravity / Gemini

```bash
pnpm dlx skills add XCO-Agency/Corex-ui -a antigravity
```

_Installs the skill into `.agents/skills/corex-ui-components/SKILL.md`._

### GitHub Copilot

```bash
pnpm dlx skills add XCO-Agency/Corex-ui -a copilot
```

_Configures instructions in `.github/copilot-instructions.md`._

---

## Alternative: Direct Download (cURL)

If you prefer to download the raw skill without using `skills.sh`:

```bash
mkdir -p .agents/skills/corex-ui-components/references && \
curl -sSL https://raw.githubusercontent.com/XCO-Agency/Corex-ui/main/.agents/skills/corex-ui-components/SKILL.md \
  -o .agents/skills/corex-ui-components/SKILL.md && \
curl -sSL https://raw.githubusercontent.com/XCO-Agency/Corex-ui/main/.agents/skills/corex-ui-components/references/components.md \
  -o .agents/skills/corex-ui-components/references/components.md
```

---

## Copy Skill Directly to Clipboard

If you want to paste the skill prompt directly into your AI assistant chat, custom instructions, or Cursor rules:

### macOS

```bash
curl -sSL https://raw.githubusercontent.com/XCO-Agency/Corex-ui/main/.agents/skills/corex-ui-components/SKILL.md | pbcopy
```

### Linux (`xclip`)

```bash
curl -sSL https://raw.githubusercontent.com/XCO-Agency/Corex-ui/main/.agents/skills/corex-ui-components/SKILL.md | xclip -selection clipboard
```

### Windows (PowerShell)

```powershell
(Invoke-WebRequest -Uri "https://raw.githubusercontent.com/XCO-Agency/Corex-ui/main/.agents/skills/corex-ui-components/SKILL.md").Content | Set-Clipboard
```

### Raw Markdown Link

- [View & Copy Raw SKILL.md](https://raw.githubusercontent.com/XCO-Agency/Corex-ui/main/.agents/skills/corex-ui-components/SKILL.md)

---

## What the Skill Teaches Your AI Agent

`SKILL.md` is short on purpose (rules and page patterns). The full per-component prop tables live in `references/components.md`, which the agent opens only when it needs one component's props.

1. **The right page for the job.**
   Detail, edit and create pages use `Page inlineSize="base"` with an `aside` column, like Shopify's product page. Settings use `inlineSize="small"` in one column. Index pages use `large` with `IndexFilters` and `IndexTable`. Dashboards use `large` with a `Grid` of chart cards. Forms save through `SaveBar`.

2. **The right field for each kind of data.**
   Money is `MoneyField`, counts are `NumberField`, email is `EmailField`, a choice of two to four short options is `Segment`, six or more options is `Select`, an immediate on/off is `Switch`, and so on. Related short fields sit side by side in `FormLayout.Group`.

3. **Only Corex UI components.**
   Never raw HTML (`<div>`, `<button>`, `<span>`, `<input>`, `<svg>`) or Tailwind in admin UI. Layouts are composed with `Page`, `Card`, `BlockStack`, `InlineStack`, `Grid`, `Box`.

4. **Modern Polaris spacing tokens.**
   `"none"`, `"small-500"`…`"small-100"`, `"base"`, `"large-100"`…`"large-500"` for every `gap` and `padding`. Never the legacy numeric tokens.

5. **No deprecated props.**
   A table of replacements, for example `variant="primary"` for `primary`, `tone="critical"` for `destructive`, `heading` for `title`, `inlineSize="small"` for `narrowWidth`, `details` for `helpText`, `Page aside` instead of `Layout`.

6. **Verified props.**
   The agent reads `<Name>PropsType` in the installed `dist/index.d.ts` instead of recalling Polaris React.
