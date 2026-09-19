// apps/playground/scripts/build-registry.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const playgroundDir = path.resolve(__dirname, "..");
const blocksDir = path.resolve(playgroundDir, "src/blocks");
const outputDir = path.resolve(playgroundDir, "public/r/blocks");
const outputIndexFile = path.resolve(playgroundDir, "public/r/index.json");

// Human-friendly block titles & descriptions
const BLOCK_METADATA = {
  "activity-feed": {
    title: "Activity Feed",
    description: "Chronological audit log and real-time merchant events feed.",
  },
  "app-cross-sell": {
    title: "App Cross-Sell",
    description: "Ecosystem app promotion card with one-click installation trigger.",
  },
  "cards": {
    title: "Cards",
    description: "Three versatile card layouts: minimalist, media showcase, and media with actions.",
  },
  "discount-rules": {
    title: "Discount Rules",
    description: "Volume tiers, free gifts, and automated BOGO promotional rules.",
  },
  "integrations-hub": {
    title: "Integrations Hub",
    description: "Third-party ERP, CRM, and marketing connectors management.",
  },
  "metrics-dashboard": {
    title: "Metrics Dashboard",
    description: "Executive revenue, conversion, and order KPI overview with comparison trends.",
  },
  "notification-templates": {
    title: "Notification Templates",
    description: "Email & SMS transactional template customizer with variable insertion.",
  },
  "onboarding": {
    title: "Merchant Onboarding",
    description: "Multi-step Shopify onboarding wizard with theme embed verification.",
  },
  "onboarding-new": {
    title: "Modern Onboarding Flow",
    description: "Streamlined interactive checklist onboarding with progress tracking.",
  },
  "pricing-plans": {
    title: "Pricing Plans",
    description: "Subscription plan selection with billing interval toggle and Shopify confirmation modal.",
  },
  "resource-table": {
    title: "Resource Table",
    description: "Data table with multi-criteria filtering, bulk actions, and pagination.",
  },
  "settings-layout": {
    title: "Settings Layout",
    description: "Two-column annotated configuration layout matching Shopify Admin conventions.",
  },
  "subscription-management": {
    title: "Subscription Management",
    description: "Recurring revenue plan management, usage limits, and plan tier modifiers.",
  },
  "support-hub": {
    title: "Support Hub",
    description: "Knowledge base FAQ accordion, diagnostic system health, and priority support.",
  },
  "video-tutorial": {
    title: "Video Tutorial",
    description: "Interactive video lesson viewer with timestamps, resources, and checklist.",
  },
  "workflow-builder": {
    title: "Workflow Builder",
    description: "Visual logic automation editor with triggers, conditional branches, and actions.",
  },
};

function getFilesRecursively(dir, baseDir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getFilesRecursively(fullPath, baseDir));
    } else if (/\.(tsx|ts|css|json)$/.test(entry.name)) {
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, "/");
      const content = fs.readFileSync(fullPath, "utf-8");
      files.push({ relativePath, content });
    }
  }

  return files;
}

function toTitleCase(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function buildRegistry() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const blockSlugs = fs.readdirSync(blocksDir).filter((name) => {
    return fs.statSync(path.join(blocksDir, name)).isDirectory();
  });

  const indexList = [];

  for (const slug of blockSlugs) {
    const blockPath = path.join(blocksDir, slug);
    const blockFiles = getFilesRecursively(blockPath, blockPath);

    const meta = BLOCK_METADATA[slug] || {
      title: toTitleCase(slug),
      description: `${toTitleCase(slug)} block for Shopify applications.`,
    };

    const blockJson = {
      name: slug,
      type: "registry:block",
      title: meta.title,
      description: meta.description,
      dependencies: ["@xco-agency/corex-ui"],
      files: blockFiles.map((file) => ({
        path: file.relativePath,
        content: file.content,
        type: "registry:block",
        target: `components/${slug}/${file.relativePath}`,
      })),
    };

    const outFilePath = path.join(outputDir, `${slug}.json`);
    fs.writeFileSync(outFilePath, JSON.stringify(blockJson, null, 2), "utf-8");

    indexList.push({
      name: slug,
      title: meta.title,
      description: meta.description,
      filesCount: blockFiles.length,
    });
  }

  // Sort index alphabetically by name
  indexList.sort((a, b) => a.name.localeCompare(b.name));

  fs.writeFileSync(outputIndexFile, JSON.stringify(indexList, null, 2), "utf-8");

  console.log(`\x1b[32m✔ Registry built successfully!\x1b[0m`);
  console.log(`  Blocks generated: \x1b[36m${indexList.length}\x1b[0m`);
  console.log(`  Registry folder:  \x1b[36m${path.relative(playgroundDir, outputDir)}\x1b[0m`);
  console.log(`  Index file:       \x1b[36m${path.relative(playgroundDir, outputIndexFile)}\x1b[0m`);
}

buildRegistry();
