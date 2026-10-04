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
*Installs the rule into your project's `.cursor/rules/` directory.*

### Claude Code
```bash
pnpm dlx skills add XCO-Agency/Corex-ui -a claude-code
```
*Installs the skill into your project's `.claude/skills/` directory.*

### Antigravity / Gemini
```bash
pnpm dlx skills add XCO-Agency/Corex-ui -a antigravity
```
*Installs the skill into `.agents/skills/corex-ui-components/SKILL.md`.*

### GitHub Copilot
```bash
pnpm dlx skills add XCO-Agency/Corex-ui -a copilot
```
*Configures instructions in `.github/copilot-instructions.md`.*

---

## Alternative: Direct Download (cURL)

If you prefer to download the raw skill without using `skills.sh`:

```bash
mkdir -p .agents/skills/corex-ui-components && \
curl -sSL https://raw.githubusercontent.com/XCO-Agency/Corex-ui/main/.agents/skills/corex-ui-components/SKILL.md \
  -o .agents/skills/corex-ui-components/SKILL.md
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

1. **Strict Corex UI Component Usage**:
   Never outputs raw HTML (`<div>`, `<button>`, `<span>`, `<input>`, `<svg>`, etc.) or Tailwind CSS in blocks. Composes layouts exclusively with `@xco-agency/corex-ui` components (`Box`, `BlockStack`, `InlineStack`, `Card`, `Button`, `Text`, etc.).

2. **Modern Polaris Spacing Tokens**:
   Enforces modern Polaris spacing tokens (`"none"`, `"small-500"`...`"small-100"`, `"base"`, `"large-100"`...`"large-500"`) for all `gap` and `padding` props. Forbids legacy numeric tokens (`"100"`, `"200"`, `"300"`, `"400"`).

3. **No Deprecated Polaris Props**:
   Ensures the agent uses active modern props:
   - `variant="primary"` instead of legacy `primary`
   - `tone="critical"` instead of legacy `destructive`
   - `variant="plain"` instead of legacy `plain`
   - `alignItems` and `justifyContent` instead of legacy `align` or `blockAlign`
   - `heading` instead of legacy `title` on `Banner`

4. **Component API Verification**:
   Provides accurate prop signatures for all 75+ components including compound components (`Combobox`, `IndexFilters`, `DatePicker`, `ActionList`, etc.).
