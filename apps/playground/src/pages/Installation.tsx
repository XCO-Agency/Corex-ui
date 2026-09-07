import * as React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Package,
  Rocket,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ComponentCodeViewer } from "./component-detail/partials/ComponentCodeViewer";

const PACKAGE_MANAGERS = [
  { id: "npm", label: "npm", command: "npm install @xco-agency/corex-ui" },
  { id: "pnpm", label: "pnpm", command: "pnpm add @xco-agency/corex-ui" },
  { id: "yarn", label: "yarn", command: "yarn add @xco-agency/corex-ui" },
] as const;

const CDN_SCRIPT_CODE = `<script src="https://cdn.shopify.com/shopifycloud/polaris-1.js"></script>`;

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

  return (
    <div className="mx-auto w-full max-w-3xl px-3 pb-24 md:px-4">
      {/* Branded header, matching component detail pages */}
      <header className="space-y-4 pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1.5 px-2.5 py-1 text-xs font-medium">
            <Rocket className="size-3.5 text-muted-foreground" />
            <span>Getting started</span>
          </Badge>
          <Badge variant="success" className="gap-1.5 px-2.5 py-1 text-xs font-medium">
            <Sparkles className="size-3" />
            <span>v0.1.0 Ready</span>
          </Badge>
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
            <Button variant="outline" render={<Link to="/#Layouts" />}>
              <Terminal />
              Explore blocks
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
