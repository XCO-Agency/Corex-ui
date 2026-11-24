/**
 * Assets are served first. The worker only runs when nothing in `dist` matches.
 * SPA mode would otherwise rewrite those misses to `index.html` with status 200,
 * so crawlers treat `/sitemap.xml` and other missing files as HTML pages.
 * Real files such as `/robots.txt` never reach the worker.
 */

export const ROBOTS_TAG = "noindex, nofollow";

type AssetsBinding = {
  fetch(input: Request): Promise<Response>;
};

export type WorkerEnv = {
  ASSETS: AssetsBinding;
};

/** True when the last path segment looks like a file (`sitemap.xml`), not a route. */
export function isAssetLikePath(pathname: string): boolean {
  const trimmed = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const segment = trimmed.slice(trimmed.lastIndexOf("/") + 1);
  const dot = segment.lastIndexOf(".");
  return dot > 0 && dot < segment.length - 1;
}

export function applyRobotsTag(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("X-Robots-Tag", ROBOTS_TAG);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function assetMissResponse(): Response {
  return new Response("Not found\n", {
    status: 404,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "X-Robots-Tag": ROBOTS_TAG,
    },
  });
}

/**
 * SPA fallback answers with `index.html`. A missing file whose extension is not
 * HTML comes back as `text/html`; a real asset keeps its own content type.
 */
export function isSpaHtmlFallback(pathname: string, response: Response): boolean {
  if (response.status !== 200) return false;
  const type = response.headers.get("content-type") ?? "";
  if (!type.toLowerCase().includes("text/html")) return false;
  return !/\.html?$/i.test(pathname.replace(/\/+$/, ""));
}

export async function handleRequest(request: Request, env: WorkerEnv): Promise<Response> {
  const { pathname } = new URL(request.url);

  if (!isAssetLikePath(pathname)) {
    return applyRobotsTag(await env.ASSETS.fetch(request));
  }

  const asset = await env.ASSETS.fetch(request);
  if (asset.status === 404 || isSpaHtmlFallback(pathname, asset)) {
    return assetMissResponse();
  }
  return applyRobotsTag(asset);
}
