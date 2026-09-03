import { AlertCircle } from "lucide-react";

export function ComponentSandboxAlert() {
  return (
    <div className="relative my-6 overflow-hidden rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-950 dark:text-amber-200">
      <div className="flex items-start gap-3">
        <AlertCircle className="size-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="space-y-1 text-sm leading-relaxed">
          <p className="font-semibold text-amber-900 dark:text-amber-100">
            Requires a real embedded Shopify admin session
          </p>
          <p className="text-amber-800/90 dark:text-amber-200/90">
            This playground runs as a standalone browser tab, not an embedded app.
            Global APIs like <code className="rounded bg-amber-500/20 px-1.5 py-0.5 font-mono text-xs text-amber-950 dark:text-amber-100">window.shopify</code> and
            components like <code className="rounded bg-amber-500/20 px-1.5 py-0.5 font-mono text-xs text-amber-950 dark:text-amber-100">AppWindow</code> need the Shopify Admin context to execute fully. The preview interaction below is illustrative, while the code samples show the real, copyable API.
          </p>
        </div>
      </div>
    </div>
  );
}
