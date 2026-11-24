import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  ROBOTS_TAG,
  applyRobotsTag,
  handleRequest,
  isAssetLikePath,
  isSpaHtmlFallback,
} from "./routing";

const spa = () =>
  new Response("<!doctype html><title>playground</title>", {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });

function assets(files: Record<string, Response>) {
  return {
    async fetch(request: Request) {
      const { pathname } = new URL(request.url);
      return files[pathname] ? files[pathname].clone() : spa();
    },
  };
}

describe("playground crawler routing", () => {
  it("treats a dotted final segment as an asset path", () => {
    expect(isAssetLikePath("/sitemap.xml")).toBe(true);
    expect(isAssetLikePath("/robots.txt")).toBe(true);
    expect(isAssetLikePath("/assets/app.js")).toBe(true);
    expect(isAssetLikePath("/missing.html")).toBe(true);
    expect(isAssetLikePath("/components/button")).toBe(false);
    expect(isAssetLikePath("/")).toBe(false);
    expect(isAssetLikePath("/_capture/button")).toBe(false);
    expect(isAssetLikePath("/sitemap.xml/")).toBe(true);
  });

  it("recognizes the SPA shell served in place of a missing file", () => {
    expect(isSpaHtmlFallback("/sitemap.xml", spa())).toBe(true);
    expect(isSpaHtmlFallback("/app-window-content.html", spa())).toBe(false);
    expect(
      isSpaHtmlFallback(
        "/robots.txt",
        new Response("ok", { headers: { "content-type": "text/plain" } }),
      ),
    ).toBe(false);
  });

  it("returns 404 for a missing asset and the shell for an app route", async () => {
    const env = {
      ASSETS: assets({
        "/robots.txt": new Response("User-agent: *\nAllow: /\n", {
          headers: { "content-type": "text/plain; charset=utf-8" },
        }),
        "/app-window-content.html": new Response("<!doctype html><p>frame</p>", {
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
      }),
    };

    const sitemap = await handleRequest(
      new Request("https://corex-ui.xco.agency/sitemap.xml"),
      env,
    );
    expect(sitemap.status).toBe(404);
    expect(sitemap.headers.get("content-type")).toContain("text/plain");
    expect(sitemap.headers.get("X-Robots-Tag")).toBe(ROBOTS_TAG);
    expect(await sitemap.text()).not.toContain("<!doctype html>");

    const robots = await handleRequest(
      new Request("https://corex-ui.xco.agency/robots.txt"),
      env,
    );
    expect(robots.status).toBe(200);
    expect(await robots.text()).toBe("User-agent: *\nAllow: /\n");
    expect(robots.headers.get("X-Robots-Tag")).toBe(ROBOTS_TAG);

    const page = await handleRequest(
      new Request("https://corex-ui.xco.agency/components/button"),
      env,
    );
    expect(page.status).toBe(200);
    expect(await page.text()).toContain("<!doctype html>");
    expect(page.headers.get("X-Robots-Tag")).toBe(ROBOTS_TAG);

    const frame = await handleRequest(
      new Request("https://corex-ui.xco.agency/app-window-content.html"),
      env,
    );
    expect(frame.status).toBe(200);
    expect(await frame.text()).toContain("frame");
  });

  it("sets the robots tag without dropping an existing status", () => {
    const tagged = applyRobotsTag(new Response(null, { status: 304 }));
    expect(tagged.status).toBe(304);
    expect(tagged.headers.get("X-Robots-Tag")).toBe(ROBOTS_TAG);
  });

  it("publishes robots.txt with no sitemap and a site-wide noindex header", () => {
    const robots = readFileSync(path.join(process.cwd(), "public/robots.txt"), "utf8");
    expect(robots).toBe("User-agent: *\nAllow: /\n");
    expect(robots.toLowerCase()).not.toContain("sitemap");

    const headers = readFileSync(path.join(process.cwd(), "public/_headers"), "utf8");
    expect(headers.startsWith("/*")).toBe(true);
    expect(headers).toContain("X-Robots-Tag: noindex, nofollow");
  });
});
