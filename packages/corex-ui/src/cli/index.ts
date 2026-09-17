// packages/corex-ui/src/cli/index.ts
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { execSync } from "node:child_process";

const PKG_NAME = "@xco-agency/corex-ui";
const DEFAULT_REGISTRY_URL =
  process.env.COREX_REGISTRY_URL || "https://corex-ui.xco.agency/r";

// ANSI Styling helpers
const c = {
  reset: "\x1b[0m",
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  boldGreen: (s: string) => `\x1b[1;32m${s}\x1b[0m`,
  boldCyan: (s: string) => `\x1b[1;36m${s}\x1b[0m`,
};

async function prompt(question: string, defaultVal = ""): Promise<string> {
  const rl = readline.createInterface({ input, output });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim() || defaultVal;
}

async function confirm(question: string, defaultYes = true): Promise<boolean> {
  const suffix = defaultYes ? " [Y/n] " : " [y/N] ";
  const answer = await prompt(`${question}${c.dim(suffix)}`);
  if (!answer) return defaultYes;
  return /^y(es)?$/i.test(answer);
}

function detectPackageManager(cwd: string): "pnpm" | "yarn" | "bun" | "npm" {
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(cwd, "bun.lockb"))) return "bun";
  return "npm";
}

function resolveBaseComponentsDir(cwd: string, customDir?: string): string {
  if (customDir) {
    return path.resolve(cwd, customDir);
  }

  // Check for corex.json config
  const configPath = path.join(cwd, "corex.json");
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      if (config.componentsDir) {
        return path.resolve(cwd, config.componentsDir);
      }
    } catch {
      // ignore
    }
  }

  // Standard React Router v7 & legacy Remix Shopify app convention:
  // app/components/<block-name>/
  if (fs.existsSync(path.join(cwd, "app"))) {
    return path.join(cwd, "app/components");
  }

  // Standard Vite / Next / SPA
  if (fs.existsSync(path.join(cwd, "src/components"))) {
    return path.join(cwd, "src/components");
  }
  if (fs.existsSync(path.join(cwd, "src"))) {
    return path.join(cwd, "src/components");
  }

  return path.join(cwd, "components");
}

async function checkAndInstallCorexUI(cwd: string, autoConfirm: boolean) {
  const pkgPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgPath)) return;

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    const hasDep =
      (pkg.dependencies && pkg.dependencies[PKG_NAME]) ||
      (pkg.devDependencies && pkg.devDependencies[PKG_NAME]);

    if (hasDep) return;
  } catch {
    return;
  }

  console.log(
    `\n${c.yellow("Notice:")} ${c.bold(PKG_NAME)} is required for Corex UI blocks but is not in package.json.`
  );

  const pm = detectPackageManager(cwd);
  const installCmd =
    pm === "pnpm"
      ? `pnpm add ${PKG_NAME}`
      : pm === "yarn"
        ? `yarn add ${PKG_NAME}`
        : pm === "bun"
          ? `bun add ${PKG_NAME}`
          : `npm install ${PKG_NAME}`;

  const shouldInstall = autoConfirm
    ? true
    : await confirm(`Would you like to install ${c.cyan(PKG_NAME)} now?`, true);

  if (shouldInstall) {
    console.log(`Running: ${c.cyan(installCmd)}...\n`);
    try {
      execSync(installCmd, { cwd, stdio: "inherit" });
      console.log(`${c.green("✔")} Successfully installed ${PKG_NAME}\n`);
    } catch {
      console.log(
        `${c.yellow("⚠")} Automatic install failed. Please run manually: ${c.cyan(installCmd)}\n`
      );
    }
  } else {
    console.log(
      `${c.yellow("Skipping install.")} Make sure to install ${PKG_NAME} manually: ${c.cyan(installCmd)}\n`
    );
  }
}

type RegistryBlockItem = {
  name: string;
  title: string;
  description: string;
  filesCount: number;
};

type BlockSchema = {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies?: string[];
  files: Array<{
    path: string;
    content: string;
    type: string;
    target?: string;
  }>;
};

async function fetchRegistryIndex(): Promise<RegistryBlockItem[]> {
  if (
    DEFAULT_REGISTRY_URL.startsWith("file://") ||
    DEFAULT_REGISTRY_URL.startsWith("/") ||
    DEFAULT_REGISTRY_URL.startsWith(".")
  ) {
    const filePath = path.resolve(
      DEFAULT_REGISTRY_URL.replace(/^file:\/\//, ""),
      "index.json"
    );
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  }
  const res = await fetch(`${DEFAULT_REGISTRY_URL}/index.json`);
  if (!res.ok) {
    throw new Error(`Failed to fetch block index from ${DEFAULT_REGISTRY_URL}/index.json`);
  }
  return res.json() as Promise<RegistryBlockItem[]>;
}

async function fetchBlock(blockName: string): Promise<BlockSchema> {
  if (
    DEFAULT_REGISTRY_URL.startsWith("file://") ||
    DEFAULT_REGISTRY_URL.startsWith("/") ||
    DEFAULT_REGISTRY_URL.startsWith(".")
  ) {
    const filePath = path.resolve(
      DEFAULT_REGISTRY_URL.replace(/^file:\/\//, ""),
      `blocks/${blockName}.json`
    );
    if (!fs.existsSync(filePath)) {
      throw new Error(`Block "${blockName}" was not found in registry.`);
    }
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  }
  const res = await fetch(`${DEFAULT_REGISTRY_URL}/blocks/${blockName}.json`);
  if (!res.ok) {
    throw new Error(`Block "${blockName}" was not found in the registry.`);
  }
  return res.json() as Promise<BlockSchema>;
}

export async function runCLI(argv: string[]) {
  const args = argv.slice(2);

  if (args.includes("-h") || args.includes("--help") || args.length === 0) {
    console.log(`
${c.boldCyan("Corex UI CLI")} - Add blocks directly to your Shopify app

${c.bold("Usage:")}
  npx @xco-agency/corex-ui add [block-name] [options]

${c.bold("Options:")}
  -y, --yes          Skip confirmation prompts and accept defaults
  -o, --overwrite    Overwrite existing files without prompting
  -d, --dir <path>   Target directory (defaults to app/components/)
  -h, --help         Show help
  -v, --version      Show version

${c.bold("Examples:")}
  npx @xco-agency/corex-ui add onboarding
  npx @xco-agency/corex-ui add pricing-plans
  npx @xco-agency/corex-ui add --dir app/components
`);
    return;
  }

  if (args.includes("-v") || args.includes("--version")) {
    console.log("0.1.5");
    return;
  }

  const isAddCommand = args[0] === "add";
  if (!isAddCommand) {
    console.log(`${c.red("Unknown command:")} "${args[0]}". Did you mean "add"?`);
    return;
  }

  const yes = args.includes("-y") || args.includes("--yes");
  const overwrite = args.includes("-o") || args.includes("--overwrite");

  let customDir: string | undefined;
  const dirIdx = args.findIndex((a) => a === "-d" || a === "--dir");
  if (dirIdx !== -1 && args[dirIdx + 1]) {
    customDir = args[dirIdx + 1];
  }

  // Determine block name (first positional argument after "add")
  const positionalArgs = args
    .slice(1)
    .filter((arg, i, arr) => !arg.startsWith("-") && arr[i - 1] !== "-d" && arr[i - 1] !== "--dir");

  let blockName = positionalArgs[0];

  const cwd = process.cwd();

  // 1. If block name is not provided, prompt user with list
  if (!blockName) {
    console.log(`\n${c.cyan("Fetching available blocks from registry...")}`);
    let indexList: RegistryBlockItem[] = [];
    try {
      indexList = await fetchRegistryIndex();
    } catch (err: any) {
      console.log(`${c.red("Error:")} ${err.message}`);
      return;
    }

    console.log(`\n${c.bold("Available Blocks:")}`);
    indexList.forEach((item, idx) => {
      console.log(
        `  ${c.dim(`${(idx + 1).toString().padStart(2, " ")}.`)} ${c.bold(item.name.padEnd(25, " "))} ${c.dim(item.description)}`
      );
    });

    const choice = await prompt(`\n${c.bold("Enter block number or name to install:")} `);
    if (!choice) {
      console.log("No block selected. Aborted.");
      return;
    }

    const num = parseInt(choice, 10);
    const selectedItem =
      !isNaN(num) && num >= 1 && num <= indexList.length
        ? indexList[num - 1]
        : undefined;
    if (selectedItem) {
      blockName = selectedItem.name;
    } else {
      blockName = choice.toLowerCase().trim();
    }
  }

  // 2. Fetch block schema
  console.log(`\n${c.dim("Fetching")} ${c.cyan(blockName)} ${c.dim("from Corex UI registry...")}`);
  let blockData: BlockSchema;
  try {
    blockData = await fetchBlock(blockName);
  } catch (err: any) {
    console.log(`\n${c.red("Error:")} ${err.message}`);
    try {
      const list = await fetchRegistryIndex();
      console.log(`\n${c.bold("Did you mean one of these?")}`);
      list.forEach((b) => console.log(`  - ${b.name}`));
    } catch {}
    return;
  }

  // 3. Resolve destination: app/components/<block-name>/
  const baseComponentsDir = resolveBaseComponentsDir(cwd, customDir);
  const targetBlockDir = path.join(baseComponentsDir, blockName);
  const relativeTargetDir = path.relative(cwd, targetBlockDir);

  if (!yes) {
    const ok = await confirm(
      `Ready to install ${c.boldCyan(blockData.title)} (${blockData.files.length} files) into ${c.cyan(relativeTargetDir)}?`,
      true
    );
    if (!ok) {
      console.log("Installation cancelled.");
      return;
    }
  }

  // 4. Verify & install @xco-agency/corex-ui if missing (no other packages installed)
  await checkAndInstallCorexUI(cwd, yes);

  // 5. Write block files
  console.log(`\n${c.dim("Writing files to")} ${c.cyan(relativeTargetDir)}...`);
  let writtenCount = 0;
  let skippedCount = 0;

  for (const file of blockData.files) {
    const targetFilePath = path.join(targetBlockDir, file.path);
    const parentDir = path.dirname(targetFilePath);

    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    if (fs.existsSync(targetFilePath) && !overwrite) {
      if (yes) {
        // Skip existing in yes mode unless overwrite is set
        skippedCount++;
        continue;
      }
      const replace = await confirm(
        `  ${c.yellow("File exists:")} ${path.relative(cwd, targetFilePath)}. Overwrite?`,
        false
      );
      if (!replace) {
        skippedCount++;
        continue;
      }
    }

    fs.writeFileSync(targetFilePath, file.content, "utf-8");
    writtenCount++;
    console.log(`  ${c.green("✓")} ${file.path}`);
  }

  // 6. Print next steps
  console.log(`\n${c.boldGreen("✔ Successfully installed")} ${c.bold(blockData.title)}!`);
  console.log(
    `  Installed ${c.cyan(`${writtenCount} file(s)`)} directly to ${c.boldCyan(relativeTargetDir)}`
  );
  if (skippedCount > 0) {
    console.log(`  ${c.dim(`(${skippedCount} unchanged files skipped)`)}`);
  }

  console.log(`\n${c.bold("Next steps:")}`);
  console.log(`  Import the block in your route or component:`);
  console.log(
    `  ${c.cyan(`import { ${toPascalCase(blockName)} } from "~/components/${blockName}";`)}\n`
  );
}

function toPascalCase(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

// Auto-run if executed as script
if (process.argv[1] && (process.argv[1].endsWith("cli.js") || process.argv[1].endsWith("cli.ts") || process.argv[1].endsWith("cli.mjs"))) {
  runCLI(process.argv).catch((err) => {
    console.error(`\n${c.red("Unexpected error:")}`, err);
    process.exit(1);
  });
}
