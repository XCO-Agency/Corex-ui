import * as React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy, Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommandSnippet } from "@/components/CommandSnippet";
import { registry } from "@/data/registry";
import { COREX_UI_VERSION } from "@/lib/version";
import { cn } from "@/lib/utils";
import { ComponentCodeViewer } from "./component-detail/partials/ComponentCodeViewer";

const PACKAGE_MANAGERS = [
  { id: "pnpm", install: "pnpm add @xco-agency/corex-ui", dlx: "pnpm dlx" },
  { id: "npm", install: "npm install @xco-agency/corex-ui", dlx: "npx" },
  { id: "yarn", install: "yarn add @xco-agency/corex-ui", dlx: "npx" },
] as const;

type PackageManagerIdType = (typeof PACKAGE_MANAGERS)[number]["id"];

const CDN_SCRIPT_CODE = `<script src="https://cdn.shopify.com/shopifycloud/polaris-2.0-rc.js"></script>`;

const USAGE_CODE = `import { useState } from "react";
import { Page, Card, TextField, Button } from "@xco-agency/corex-ui";

function ProductForm() {
  const [title, setTitle] = useState("");

  return (
    <Page heading="New product">
      <Card>
        <TextField label="Title" value={title} onChange={setTitle} />
        <Button variant="primary" onClick={save}>
          Save
        </Button>
      </Card>
    </Page>
  );
}`;

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

const REQUIREMENTS = [
  "React 18 or 19.",
  "A Shopify app rendered in the admin, or a page that loads the Polaris web components script.",
  "No .npmrc or auth token: the package is on the public npm registry.",
];

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly { id: T; label: string }[];
  onChange: (id: T) => void;
}) {
  return (
    <div className="inline-flex rounded-md border border-border/80 p-0.5">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={cn(
            "cursor-pointer rounded px-2 py-0.5 text-xs transition-colors",
            value === option.id
              ? "bg-muted font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Step({
  n,
  title,
  aside,
  children,
}: {
  n: number;
  title: React.ReactNode;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className="relative pb-10 pl-8 last:pb-0">
      <span className="absolute top-0 left-0 flex size-5 items-center justify-center rounded-full border border-border bg-background font-mono text-[10px] font-medium text-foreground">
        {n}
      </span>
      <div className="mb-3 flex min-h-5 flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {aside}
      </div>
      <div className="space-y-3 text-[13px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </li>
  );
}

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="rounded bg-muted px-1 py-0.5 font-mono text-[12px] text-foreground">
    {children}
  </code>
);

export function Installation() {
  const [pm, setPm] = React.useState<PackageManagerIdType>("pnpm");
  const activePm = PACKAGE_MANAGERS.find((p) => p.id === pm)!;

  const [copiedSkill, setCopiedSkill] = React.useState(false);
  const [skillMode, setSkillMode] = React.useState<"cli" | "raw">("cli");
  const [target, setTarget] =
    React.useState<(typeof ASSISTANT_TARGETS)[number]["id"]>("all");

  const handleCopySkill = async () => {
    try {
      const res = await fetch("/SKILL.md");
      await navigator.clipboard.writeText(await res.text());
      setCopiedSkill(true);
      setTimeout(() => setCopiedSkill(false), 2000);
    } catch {
      window.open("/SKILL.md", "_blank");
    }
  };

  const skillCommand = `${activePm.dlx} skills add XCO-Agency/Corex-ui${
    target === "all" ? "" : ` -a ${target}`
  }`;

  return (
    <div className="mx-auto w-full max-w-2xl pb-16">
      <header className="space-y-2 pt-4 pb-8">
        <p className="font-mono text-[11px] text-muted-foreground">
          Getting started · v{COREX_UI_VERSION}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">
          Installation
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Add <Code>@xco-agency/corex-ui</Code> to your Shopify app. It keeps the legacy
          Polaris React API and renders Shopify's Polaris web components underneath.
        </p>
      </header>

      <section className="mb-10 rounded-lg border border-border/70 px-4 py-3">
        <h2 className="mb-2 text-xs font-medium text-foreground">Requirements</h2>
        <ul className="space-y-1.5 text-[13px] text-muted-foreground">
          {REQUIREMENTS.map((item) => (
            <li key={item} className="flex gap-2">
              <Check className="mt-0.5 size-3.5 shrink-0 text-foreground/50" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <ol className="relative before:absolute before:top-2 before:bottom-2 before:left-2.5 before:w-px before:bg-border">
        <Step
          n={1}
          title="Install the package"
          aside={
            <Segmented
              value={pm}
              options={PACKAGE_MANAGERS.map((p) => ({ id: p.id, label: p.id }))}
              onChange={setPm}
            />
          }
        >
          <CommandSnippet command={activePm.install} />
        </Step>

        <Step n={2} title="Polaris web components">
          <p>
            The library wraps Shopify's <Code>s-*</Code> custom elements. Inside the Shopify
            admin they are already registered globally, so embedded apps need nothing extra.
          </p>
          <div className="flex gap-2 rounded-md bg-muted/40 px-3 py-2 text-xs">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            <span>
              Rendering outside the admin (a standalone preview, Storybook, tests)? Load the
              script in your HTML shell:
            </span>
          </div>
          <CommandSnippet command={CDN_SCRIPT_CODE} prompt={null} />
        </Step>

        <Step n={3} title="Start building">
          <p>
            Import from <Code>@xco-agency/corex-ui</Code> instead of{" "}
            <Code>@shopify/polaris</Code>. Prefer the modern props shown in each component's API
            reference.
          </p>
          <ComponentCodeViewer
            code={USAGE_CODE}
            filename="ProductForm.tsx"
            language="tsx"
            className="rounded-lg shadow-none"
          />
        </Step>

        <Step
          n={4}
          title={
            <>
              AI assistant skill{" "}
              <span className="ml-1 font-normal text-muted-foreground">optional</span>
            </>
          }
          aside={
            <Segmented
              value={skillMode}
              options={[
                { id: "cli", label: "CLI" },
                { id: "raw", label: "SKILL.md" },
              ]}
              onChange={setSkillMode}
            />
          }
        >
          <p>
            Gives Cursor, Claude Code, Antigravity or Copilot the full component catalog (
            {registry.length} components) with modern props only, so they don't reach for
            deprecated Polaris APIs.
          </p>

          {skillMode === "cli" ? (
            <>
              <div className="flex flex-wrap items-center gap-1">
                {ASSISTANT_TARGETS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTarget(t.id)}
                    className={cn(
                      "cursor-pointer rounded px-2 py-0.5 text-xs transition-colors",
                      target === t.id
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <CommandSnippet command={skillCommand} />
              <p className="text-xs">
                Writes the skill to <Code>.cursor/rules/</Code>, <Code>.claude/skills/</Code> or{" "}
                <Code>.agents/skills/</Code> depending on the assistant.
              </p>
            </>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                <Button size="xs" className="h-7 px-2.5" onClick={handleCopySkill}>
                  {copiedSkill ? <Check /> : <Copy />}
                  {copiedSkill ? "Copied" : "Copy SKILL.md"}
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  nativeButton={false}
                  className="h-7 px-2.5"
                  render={<a href="/SKILL.md" download="corex-ui-skill.md" />}
                >
                  <Download />
                  Download
                </Button>
              </div>
              <ComponentCodeViewer
                code={CURL_SKILL_CODE}
                filename="Terminal"
                language="bash"
                className="rounded-lg shadow-none"
              />
            </>
          )}
        </Step>
      </ol>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-5 text-[13px]">
        <span className="text-muted-foreground">Next: browse live examples.</span>
        <div className="flex gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1 font-medium text-foreground/80 hover:text-foreground"
          >
            Components <ArrowRight className="size-3.5" />
          </Link>
          <Link
            to="/#blocks"
            className="inline-flex items-center gap-1 font-medium text-foreground/80 hover:text-foreground"
          >
            Blocks <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
