import * as React from "react";
import {
  Code2,
  Sparkles,
  Layers,
  ArrowUpRight,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ComponentCodeViewer } from "./component-detail/partials/ComponentCodeViewer";

import { UseSaveBarDemo } from "@/examples/utils/UseSaveBarDemo";
import UseSaveBarDemoRaw from "@/examples/utils/UseSaveBarDemo.tsx?raw";

import { UseAppWindowSaveBarDemo } from "@/examples/utils/UseAppWindowSaveBarDemo";
import UseAppWindowSaveBarDemoRaw from "@/examples/utils/UseAppWindowSaveBarDemo.tsx?raw";

import { UseToastDemo } from "@/examples/utils/UseToastDemo";
import UseToastDemoRaw from "@/examples/utils/UseToastDemo.tsx?raw";

import { UseDimensionDemo } from "@/examples/utils/UseDimensionDemo";
import UseDimensionDemoRaw from "@/examples/utils/UseDimensionDemo.tsx?raw";

import { UseParamsDemo } from "@/examples/utils/UseParamsDemo";
import UseParamsDemoRaw from "@/examples/utils/UseParamsDemo.tsx?raw";

import { UseStorageDemo } from "@/examples/utils/UseStorageDemo";
import UseStorageDemoRaw from "@/examples/utils/UseStorageDemo.tsx?raw";

type HookDocItemType = {
  id: string;
  name: string;
  badge: string;
  badgeVariant?: "default" | "secondary" | "outline" | "destructive" | "success" | "warning";
  description: string;
  importCode: string;
  DemoComponent: React.ComponentType;
  code: string;
  filename: string;
  parameters: { name: string; type: string; description: string }[];
  returns: { name: string; type: string; description: string }[];
};

const HOOKS_DATA: HookDocItemType[] = [
  {
    id: "use-save-bar",
    name: "useSaveBar",
    badge: "App Bridge",
    badgeVariant: "default",
    description:
      "Controls the Shopify Admin top SaveBar imperatively, allowing apps to show, hide, toggle, and trigger discard confirmation dialogs.",
    importCode: `import { useSaveBar } from "@xco-agency/corex-ui";`,
    DemoComponent: UseSaveBarDemo,
    code: UseSaveBarDemoRaw,
    filename: "UseSaveBarExample.tsx",
    parameters: [],
    returns: [
      {
        name: "show",
        type: "(id?: string) => Promise<void> | void",
        description: "Displays the SaveBar (defaults to 'corex-ui-save-bar').",
      },
      {
        name: "hide",
        type: "(id?: string) => Promise<void> | void",
        description: "Hides the SaveBar.",
      },
      {
        name: "toggle",
        type: "(id?: string) => Promise<void> | void",
        description: "Toggles visibility of the SaveBar.",
      },
      {
        name: "leaveConfirmation",
        type: "() => Promise<void>",
        description: "Triggers Shopify App Bridge's native leave confirmation prompt.",
      },
    ],
  },
  {
    id: "use-app-window-save-bar",
    name: "useAppWindowSaveBar",
    badge: "App Bridge & Iframe",
    badgeVariant: "success",
    description:
      "Connects an iframe page opened via <AppWindow saveBar /> with the host SaveBar, bidirectional syncing form dirty state, loading, and save/discard actions.",
    importCode: `import { useAppWindowSaveBar } from "@xco-agency/corex-ui";`,
    DemoComponent: UseAppWindowSaveBarDemo,
    code: UseAppWindowSaveBarDemoRaw,
    filename: "UseAppWindowSaveBarExample.tsx",
    parameters: [
      {
        name: "windowId",
        type: "string",
        description: "Window ID matching the parent AppWindow id. Defaults to 'corex-app-window'.",
      },
      {
        name: "open",
        type: "boolean",
        description: "Whether the host SaveBar should be open (e.g. isDirty).",
      },
      {
        name: "loading",
        type: "boolean",
        description: "Sets the host Save button to loading state during asynchronous saves.",
      },
      {
        name: "onSave",
        type: "() => void | Promise<void>",
        description: "Callback fired when the merchant clicks Save on the host save bar.",
      },
      {
        name: "onDiscard",
        type: "() => void | Promise<void>",
        description: "Callback fired when the merchant clicks Discard on the host save bar.",
      },
    ],
    returns: [
      {
        name: "show",
        type: "() => void",
        description: "Manually shows the host SaveBar.",
      },
      {
        name: "hide",
        type: "() => void",
        description: "Manually hides the host SaveBar.",
      },
      {
        name: "leaveConfirmation",
        type: "() => Promise<void>",
        description: "Triggers host leave confirmation dialog.",
      },
    ],
  },
  {
    id: "use-toast",
    name: "useToast",
    badge: "App Bridge",
    badgeVariant: "default",
    description:
      "Dispatches native Shopify App Bridge non-blocking toast notifications across the merchant's admin window.",
    importCode: `import { useToast } from "@xco-agency/corex-ui";`,
    DemoComponent: UseToastDemo,
    code: UseToastDemoRaw,
    filename: "UseToastExample.tsx",
    parameters: [],
    returns: [
      {
        name: "show",
        type: "(message: string, options?: { isError?: boolean; duration?: number }) => void",
        description:
          "Triggers a native Shopify toast notification with optional error tone and custom duration.",
      },
    ],
  },
  {
    id: "use-dimension",
    name: "useDimension",
    badge: "Responsive Layout",
    badgeVariant: "secondary",
    description:
      "Tracks container or window dimensions with modern Polaris responsive breakpoints (xs < 490, sm < 768, md < 1040, lg >= 1040) using ResizeObserver.",
    importCode: `import { useDimension } from "@xco-agency/corex-ui";`,
    DemoComponent: UseDimensionDemo,
    code: UseDimensionDemoRaw,
    filename: "UseDimensionExample.tsx",
    parameters: [
      {
        name: "debounceMs",
        type: "number",
        description: "Optional debounce duration in milliseconds (defaults to 0 for immediate tracking).",
      },
      {
        name: "initialDimension",
        type: "{ width: number; height: number }",
        description: "SSR fallback dimensions (defaults to { width: 1040, height: 800 }).",
      },
    ],
    returns: [
      { name: "width", type: "number", description: "Current observed width in pixels." },
      { name: "height", type: "number", description: "Current observed height in pixels." },
      {
        name: "breakpoint",
        type: "'xs' | 'sm' | 'md' | 'lg'",
        description: "Calculated Polaris breakpoint token.",
      },
      { name: "isXs / isSm / isMd / isLg", type: "boolean", description: "Convenience boolean flags." },
      { name: "ref", type: "(node: HTMLElement | null) => void", description: "Callback ref to attach to target container element." },
    ],
  },
  {
    id: "use-params",
    name: "useParams",
    badge: "Routing & Embed",
    badgeVariant: "secondary",
    description:
      "Safely parses Shopify embedded app URL parameters (shop, host, locale) and provides helpers to update or clear query parameters without triggering full page reloads.",
    importCode: `import { useParams } from "@xco-agency/corex-ui";`,
    DemoComponent: UseParamsDemo,
    code: UseParamsDemoRaw,
    filename: "UseParamsExample.tsx",
    parameters: [],
    returns: [
      { name: "shop", type: "string | null", description: "Sanitized myshopify.com domain if present in query." },
      { name: "host", type: "string | null", description: "Base64 Shopify App Bridge host parameter." },
      { name: "locale", type: "string | null", description: "Shopify merchant locale string (e.g. 'en', 'fr')." },
      {
        name: "setParam",
        type: "(key: string, value: string | null | undefined) => void",
        description: "Updates or removes a single query param in-place.",
      },
      {
        name: "setParams",
        type: "(updates: Record<string, string | null | undefined>) => void",
        description: "Updates multiple query parameters in a single history transaction.",
      },
    ],
  },
  {
    id: "use-storage",
    name: "useStorage",
    badge: "State Persistence",
    badgeVariant: "outline",
    description:
      "Reactive localStorage and sessionStorage hook with automatic JSON serialization, TTL expiration duration, and multi-tab synchronization.",
    importCode: `import { useStorage } from "@xco-agency/corex-ui";`,
    DemoComponent: UseStorageDemo,
    code: UseStorageDemoRaw,
    filename: "UseStorageExample.tsx",
    parameters: [
      { name: "key", type: "string", description: "Storage key identifier in browser storage." },
      { name: "storage", type: "'session' | 'local'", description: "Storage backend. Defaults to 'session'." },
      { name: "initialValue", type: "T", description: "Default fallback value." },
      { name: "expiresIn", type: "number", description: "TTL expiration in minutes (e.g. 60 for 1 hour)." },
      { name: "syncTabs", type: "boolean", description: "Sync changes across tabs via StorageEvent. Defaults to true." },
    ],
    returns: [
      { name: "value / [0]", type: "T", description: "Current deserialized value." },
      { name: "setValue / update", type: "(val: T | ((prev: T) => T)) => void", description: "Reactive updater." },
      { name: "remove / reset", type: "() => void", description: "Removes stored key and resets to initial value." },
    ],
  },
];

export function Utils() {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-2 sm:px-4 lg:px-6 py-4 pb-24">
      {/* Page Header */}
      <header className="space-y-4 pb-8 border-b border-border/80">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1.5 px-2.5 py-1 text-xs font-medium">
            <Code2 className="size-3.5 text-muted-foreground" />
            <span>Corex UI Utilities</span>
          </Badge>
          <Badge variant="secondary" className="gap-1.5 px-2.5 py-1 text-xs font-medium">
            <Sparkles className="size-3 text-emerald-500" />
            <span>6 Production Hooks</span>
          </Badge>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Utilities &amp; Hooks
          </h1>
          <p className="text-base text-muted-foreground max-w-3xl leading-relaxed">
            A comprehensive suite of custom React hooks tailored specifically for Shopify app embeds,
            Polaris web components, and App Bridge communication. Fully typed with zero external runtime dependencies.
          </p>
        </div>

        {/* Quick Jump Anchor Links */}
        <nav className="flex flex-wrap gap-2 pt-2" aria-label="Jump to hook">
          {HOOKS_DATA.map((hook) => (
            <a
              key={hook.id}
              href={`#${hook.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground hover:bg-muted/50"
            >
              <span className="font-mono text-foreground font-semibold">{hook.name}()</span>
              <span className="text-[10px] text-muted-foreground/80">({hook.badge})</span>
            </a>
          ))}
        </nav>
      </header>

      {/* Main List of Hooks */}
      <div className="divide-y divide-border/60">
        {HOOKS_DATA.map((hook) => {
          const Demo = hook.DemoComponent;

          return (
            <article key={hook.id} id={hook.id} className="scroll-mt-20 py-12 space-y-8">
              {/* Hook Header */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
                      {hook.name}()
                    </h2>
                    <Badge variant={hook.badgeVariant ?? "secondary"} className="text-xs">
                      {hook.badge}
                    </Badge>
                  </div>

                  {/* Copy Import Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2 text-xs font-mono"
                    onClick={() => handleCopy(hook.id, hook.importCode)}
                  >
                    {copiedId === hook.id ? (
                      <>
                        <Check className="size-3.5 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        <span>Copy Import</span>
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {hook.description}
                </p>

                <div className="rounded-md bg-muted/70 px-3 py-2 font-mono text-xs text-foreground border border-border/50 overflow-x-auto">
                  <code>{hook.importCode}</code>
                </div>
              </div>

              {/* Interactive Live Demo */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Interactive Live Demo
                  </h3>
                </div>
                <div className="rounded-xl border border-border/80 bg-background/50 p-4 sm:p-6 shadow-xs">
                  <Demo />
                </div>
              </div>

              {/* Code Snippet */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Usage Example Code
                </h3>
                <div className="rounded-xl border border-border overflow-hidden">
                  <ComponentCodeViewer
                    code={hook.code}
                    filename={hook.filename}
                    language="tsx"
                  />
                </div>
              </div>

              {/* API Reference Tables */}
              <div className="space-y-6 pt-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  API Reference
                </h3>

                {hook.parameters.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-foreground">Parameters / Options</h4>
                    <div className="overflow-x-auto rounded-lg border border-border">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-muted/50 text-muted-foreground">
                          <tr>
                            <th className="px-4 py-2.5 font-medium">Name</th>
                            <th className="px-4 py-2.5 font-medium">Type</th>
                            <th className="px-4 py-2.5 font-medium">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {hook.parameters.map((param) => (
                            <tr key={param.name}>
                              <td className="px-4 py-2 font-mono font-semibold text-foreground">
                                {param.name}
                              </td>
                              <td className="px-4 py-2 font-mono text-muted-foreground">
                                {param.type}
                              </td>
                              <td className="px-4 py-2 text-muted-foreground">
                                {param.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {hook.returns.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-foreground">Return Value / Methods</h4>
                    <div className="overflow-x-auto rounded-lg border border-border">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-muted/50 text-muted-foreground">
                          <tr>
                            <th className="px-4 py-2.5 font-medium">Property / Method</th>
                            <th className="px-4 py-2.5 font-medium">Signature</th>
                            <th className="px-4 py-2.5 font-medium">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {hook.returns.map((ret) => (
                            <tr key={ret.name}>
                              <td className="px-4 py-2 font-mono font-semibold text-foreground">
                                {ret.name}
                              </td>
                              <td className="px-4 py-2 font-mono text-muted-foreground">
                                {ret.type}
                              </td>
                              <td className="px-4 py-2 text-muted-foreground">
                                {ret.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
