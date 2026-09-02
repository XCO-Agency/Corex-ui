export function SandboxNote() {
  return (
    <div className="sandbox-note">
      <strong>Requires a real embedded Shopify admin session.</strong> This playground is a
      standalone browser tab, not an embedded app — <code>window.shopify</code> and the content
      an <code>AppWindow</code> would load don&rsquo;t exist here, so the interaction below is
      illustrative. The code samples are the real, copyable API.
    </div>
  );
}
