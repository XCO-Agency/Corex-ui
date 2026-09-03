const warned = new Set<string>();

/**
 * Warns once (in development only) when a consumer passes a legacy
 * `@shopify/polaris` prop that this wrapper cannot faithfully translate onto
 * the underlying Polaris web component, so migrations surface behavior gaps
 * instead of silently dropping functionality.
 */
export function devWarning(componentName: string, message: string): void {
  if (process.env.NODE_ENV === "production") return;

  const key = `${componentName}:${message}`;
  if (warned.has(key)) return;
  warned.add(key);

  // eslint-disable-next-line no-console
  console.warn(`[@xco-agency/corex-ui] ${componentName}: ${message}`);
}
