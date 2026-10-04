import * as React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileCode,
  Package,
  Rocket,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VersionBadge } from "@/components/VersionBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ComponentCodeViewer } from "./component-detail/partials/ComponentCodeViewer";

const PACKAGE_MANAGERS = [
  { id: "npm", label: "npm", command: "npm install @xco-agency/corex-ui" },
  { id: "pnpm", label: "pnpm", command: "pnpm add @xco-agency/corex-ui" },
  { id: "yarn", label: "yarn", command: "yarn add @xco-agency/corex-ui" },
] as const;

const CDN_SCRIPT_CODE = `<script src="https://cdn.shopify.com/shopifycloud/polaris-2.0-rc.js"></script>`;

const USAGE_CODE = `import { Page, Card, TextField, Button } from "@xco-agency/corex-ui";

function ProductForm() {
  const [title, setTitle] = useState("");

  return (
    <Page title="New product">
      <Card>
        <TextField label="Title" value={title} onChange={setTitle} />
        <Button primary onClick={save}>
          Save
        </Button>
      </Card>
    </Page>
  );
}`;

const TYPES_CODE = `npm install --save-dev @shopify/polaris-types`;

const CURL_SKILL_CODE = `mkdir -p .agents/skills/corex-ui-components && \\
curl -sSL https://raw.githubusercontent.com/XCO-Agency/Corex-ui/main/.agents/skills/corex-ui-components/SKILL.md \\
  -o .agents/skills/corex-ui-components/SKILL.md`;

const ASSISTANT_TARGETS = [
  { id: "all", label: "Auto-detect" },
  { id: "cursor", label: "Cursor" },
  { id: "claude-code", label: "Claude Code" },
  { id: "antigravity", label: "Antigravity" },
  { id: "copilot", label: "Copilot" },
] as const;

function StepNumber({ n }: { n: number }) {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
      {n}
    </span>
  );
}

export function Installation() {
  const [pm, setPm] = React.useState<(typeof PACKAGE_MANAGERS)[number]["id"]>("pnpm");
  const activePm = PACKAGE_MANAGERS.find((p) => p.id === pm)!;

  const [copiedSkill, setCopiedSkill] = React.useState(false);
  const [skillInstallMode, setSkillInstallMode] = React.useState<"cli" | "raw">("cli");
  const [targetAssistant, setTargetAssistant] =
    React.useState<(typeof ASSISTANT_TARGETS)[number]["id"]>("all");

  const handleCopySkill = async () => {
    try {
      const raw =
        await import("../../../../.agents/skills/corex-ui-components/SKILL.md?raw");
      await navigator.clipboard.writeText(raw.default);
      setCopiedSkill(true);
      setTimeout(() => setCopiedSkill(false), 2000);
    } catch {
      try {
        const res = await fetch("/SKILL.md");
        const text = await res.text();
        await navigator.clipboard.writeText(text);
        setCopiedSkill(true);
        setTimeout(() => setCopiedSkill(false), 2000);
      } catch {
        window.open("/SKILL.md", "_blank");
      }
    }
  };

  const getSkillCliCommand = () => {
    const base =
      pm === "pnpm"
        ? "pnpm dlx skills add XCO-Agency/Corex-ui"
        : "npx skills add XCO-Agency/Corex-ui";
    if (targetAssistant === "all") return base;
    return `${base} -a ${targetAssistant}`;
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-3 pb-24 md:px-4">
      {/* Branded header, matching component detail pages */}
      <header className="space-y-4 pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1.5 px-2.5 py-1 text-xs font-medium">
            <Rocket className="size-3.5 text-muted-foreground" />
            <span>Getting started</span>
          </Badge>
          <VersionBadge />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Installation
        </h1>

        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Add{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">
            @xco-agency/corex-ui
          </code>{" "}
          to your Shopify app in a few minutes. It's a drop-in,
          legacy-Polaris-React-compatible component set backed by Shopify's actively
          maintained Polaris web components.
        </p>
      </header>

      <div className="space-y-10">
        {/* Requirements */}
        <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Requirements</h2>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>React 18 or 19, as either a peer dependency.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>
                A Shopify app shell that loads the Polaris web components CDN script
                &mdash; Shopify CLI-scaffolded apps already do this.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>
                No{" "}
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                  .npmrc
                </code>{" "}
                configuration or authentication tokens &mdash; it's published to the
                public npm registry.
              </span>
            </li>
          </ul>
        </section>

        {/* Step 1: install */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <StepNumber n={1} />
            <h2 className="text-base font-semibold text-foreground">
              Install the package
            </h2>
          </div>

          <div className="ml-10 space-y-3">
            <div className="inline-flex rounded-lg border border-border/80 bg-muted/40 p-0.5">
              {PACKAGE_MANAGERS.map((manager) => (
                <button
                  key={manager.id}
                  type="button"
                  onClick={() => setPm(manager.id)}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                    pm === manager.id
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {manager.label}
                </button>
              ))}
            </div>

            <ComponentCodeViewer
              code={activePm.command}
              filename="Terminal"
              language="bash"
            />

            {/* <p className="text-xs text-muted-foreground">
              Optional but recommended &mdash; install prop types for editor autocomplete:
            </p>
            <ComponentCodeViewer code={TYPES_CODE} filename="Terminal" language="bash" /> */}
          </div>
        </section>

        {/* Step 2: CDN script */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <StepNumber n={2} />
            <h2 className="text-base font-semibold text-foreground">
              Load the Polaris web components
            </h2>
          </div>

          <div className="ml-10 space-y-3">
            <p className="text-sm text-muted-foreground">
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                @xco-agency/corex-ui
              </code>{" "}
              has no runtime dependency on Polaris &mdash; this script is what registers
              the{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                s-*
              </code>{" "}
              custom elements the library wraps. Add it to your app's HTML shell:
            </p>
            <s-banner tone="critical">
              for the new version of polaris UI , you don't need to install the cdn the s-
              components are globally available custom elements served buy shopify admin
              it self.
            </s-banner>
            <ComponentCodeViewer
              code={CDN_SCRIPT_CODE}
              filename="index.html"
              language="markup"
            />
          </div>
        </section>

        {/* Step 3: usage */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <StepNumber n={3} />
            <h2 className="text-base font-semibold text-foreground">Start building</h2>
          </div>

          <div className="ml-10 space-y-3">
            <p className="text-sm text-muted-foreground">
              Import components exactly like you would from{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                @shopify/polaris
              </code>
              &mdash; prop names carry over one-to-one.
            </p>
            <ComponentCodeViewer
              code={USAGE_CODE}
              filename="ProductForm.tsx"
              language="tsx"
            />
          </div>
        </section>

        {/* Step 4: AI Skill */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <StepNumber n={4} />
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-foreground">
                  Add AI Assistant Skill
                </h2>
                <Badge
                  variant="outline"
                  className="text-[10px] text-muted-foreground font-normal"
                >
                  Optional
                </Badge>
              </div>
            </div>

            {/* Quick Action to Copy Skill Markdown */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopySkill}
              className="gap-1.5 text-xs font-medium cursor-pointer"
            >
              {copiedSkill ? (
                <>
                  <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Skill copied!
                  </span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5 text-muted-foreground" />
                  <span>Copy skill (.md)</span>
                </>
              )}
            </Button>
          </div>

          <div className="ml-10 space-y-4">
            <p className="text-sm text-muted-foreground">
              Building with AI coding assistants (<strong>Cursor</strong>,{" "}
              <strong>Claude Code</strong>, <strong>Antigravity</strong>, or{" "}
              <strong>Copilot</strong>)? Equip your agent with the official Corex UI skill
              so it knows all modern props, spacing tokens, and components:
            </p>

            {/* Mode switcher: skills.sh CLI vs Direct / Raw .md */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex rounded-lg border border-border/80 bg-muted/40 p-0.5">
                <button
                  type="button"
                  onClick={() => setSkillInstallMode("cli")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                    skillInstallMode === "cli"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Terminal className="size-3.5" />
                  <span>CLI (skills.sh)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSkillInstallMode("raw")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                    skillInstallMode === "raw"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <FileCode className="size-3.5" />
                  <span>Direct Skill (.md)</span>
                </button>
              </div>

              {skillInstallMode === "cli" && (
                <div className="flex flex-wrap items-center gap-1 text-xs">
                  <span className="text-muted-foreground mr-1 text-[11px]">Target:</span>
                  {ASSISTANT_TARGETS.map((target) => (
                    <button
                      key={target.id}
                      type="button"
                      onClick={() => setTargetAssistant(target.id)}
                      className={cn(
                        "rounded px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer",
                        targetAssistant === target.id
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {target.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {skillInstallMode === "cli" ? (
              <div className="space-y-2">
                <ComponentCodeViewer
                  code={getSkillCliCommand()}
                  filename="Terminal"
                  language="bash"
                />
                <p className="text-[12px] text-muted-foreground">
                  The CLI detects your installed coding assistants and automatically
                  places the skill rules into your project (e.g.{" "}
                  <code>.cursor/rules/</code>, <code>.claude/skills/</code>, or{" "}
                  <code>.agents/skills/</code>).
                </p>
              </div>
            ) : (
              <div className="space-y-3 rounded-xl border border-border/80 bg-card p-4 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FileCode className="size-4 text-primary" />
                    <span className="font-mono text-xs font-semibold text-foreground">
                      .agents/skills/corex-ui-components/SKILL.md
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      77 Components
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleCopySkill}
                      className="gap-1.5 text-xs cursor-pointer"
                    >
                      {copiedSkill ? (
                        <>
                          <Check className="size-3.5" />
                          <span>Copied skill!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" />
                          <span>Copy full skill</span>
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      render={
                        <a
                          href="/SKILL.md"
                          download="corex-ui-skill.md"
                          className="gap-1.5 text-xs"
                        />
                      }
                    >
                      <Download className="size-3.5" />
                      <span>Download</span>
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Contains strict Corex UI rules, modern Polaris spacing tokens,
                  deprecation replacements, and exact TypeScript prop signatures. Paste
                  directly into your assistant rules or custom prompt.
                </p>

                <div className="pt-1">
                  <span className="text-[11px] font-medium text-muted-foreground block mb-1.5">
                    Or download via cURL:
                  </span>
                  <ComponentCodeViewer
                    code={CURL_SKILL_CODE}
                    filename="Terminal"
                    language="bash"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Next steps */}
        <section className="rounded-2xl border border-dashed border-border/80 p-5">
          <div className="flex items-center gap-2 pb-1">
            <Package className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Next steps</h2>
          </div>
          <p className="pb-4 text-sm text-muted-foreground">
            Browse every component with a live example and copyable source, or jump
            straight into the blocks library for ready-made page compositions.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button render={<Link to="/" />}>
              Browse components
              <ArrowRight />
            </Button>
            <Button render={<Link to="/#Layouts" />}>
              <Terminal />
              Explore blocks
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
