import { lstat, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const skippedDirectories = new Set([".git", "node_modules"]);
const forbiddenExtensions = new Set([
  ".7z",
  ".appx",
  ".cer",
  ".crt",
  ".db",
  ".der",
  ".dll",
  ".exe",
  ".har",
  ".key",
  ".msi",
  ".msix",
  ".mhtml",
  ".node",
  ".ovpn",
  ".p12",
  ".pem",
  ".pfx",
  ".sqlite",
  ".sqlite3",
  ".webarchive",
  ".zip",
]);
const forbiddenBasenames = new Set([".env", ".npmrc"]);
const allowedBinaryExtensions = new Set([".jpeg", ".jpg", ".png"]);
const requiredPaths = [
  "README.md",
  "LICENSE.md",
  "SECURITY.md",
  "CONTRIBUTING.md",
  "ROADMAP.md",
  "assets/database-safety.svg",
  "assets/release-safety.svg",
  "assets/research-studio-workflow.png",
  "docs/README.md",
  "docs/design-decisions.md",
  "docs/engineering-notes.md",
  "docs/synthetic-export.example.json",
  "docs/threat-model.md",
  "docs/verification-evidence.md",
];

const sensitivePatterns = [
  {
    label: "private project path",
    pattern: new RegExp(["[A-Z]:", "[/\\\\]+", "Extensions_Programs"].join(""), "i"),
  },
  {
    label: "Windows user-profile path",
    pattern: new RegExp(["C:", "[/\\\\]+", "Users", "[/\\\\]+"].join(""), "i"),
  },
  {
    label: "private key marker",
    pattern: new RegExp(["BEGIN ", "(?:RSA |EC |OPENSSH )?", "PRIVATE KEY"].join(""), "i"),
  },
  { label: "authorization bearer value", pattern: /Authorization\s*:\s*Bearer/i },
  { label: "cookie header", pattern: /Cookie\s*:/i },
  {
    label: "assistant conversation URL",
    pattern: new RegExp(["chatgpt", "\\.", "com/c/", "[0-9a-f-]{16,}"].join(""), "i"),
  },
  {
    label: "GitHub personal access token",
    pattern: new RegExp(["github", "_pat_", "[A-Za-z0-9_]{20,}"].join("")),
  },
  {
    label: "legacy GitHub personal access token",
    pattern: new RegExp(["gh", "p_", "[A-Za-z0-9]{20,}"].join("")),
  },
];

const failures = [];
const files = [];
let markdownImageCount = 0;
let relativeLinkCount = 0;
let jsonCount = 0;
let svgCount = 0;

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && skippedDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    const relative = path.relative(root, absolute).replaceAll(path.sep, "/");
    const stat = await lstat(absolute);
    if (stat.isSymbolicLink()) {
      failures.push(`${relative}: symbolic links are not allowed in the public case study`);
      continue;
    }
    if (entry.isDirectory()) await walk(absolute);
    else if (entry.isFile()) files.push({ absolute, relative, size: stat.size });
  }
}

await walk(root);

const relativeFiles = new Set(files.map((file) => file.relative));
for (const required of requiredPaths) {
  if (!relativeFiles.has(required)) failures.push(`${required}: required presentation file is missing`);
}

for (const file of files) {
  const extension = path.extname(file.relative).toLowerCase();
  const basename = path.basename(file.relative).toLowerCase();
  if (forbiddenBasenames.has(basename) || basename.startsWith(".env.")) {
    failures.push(`${file.relative}: environment or package-registry configuration is not allowed`);
    continue;
  }
  if (forbiddenExtensions.has(extension)) {
    failures.push(`${file.relative}: forbidden private, executable, database, archive, or credential file type`);
    continue;
  }

  if (allowedBinaryExtensions.has(extension)) {
    if (file.size > 2 * 1024 * 1024) {
      failures.push(`${file.relative}: image exceeds the 2 MiB presentation budget`);
    }
    if (extension === ".png") {
      const signature = await readFile(file.absolute).then((buffer) => buffer.subarray(0, 8).toString("hex"));
      if (signature !== "89504e470d0a1a0a") failures.push(`${file.relative}: invalid PNG signature`);
    }
    continue;
  }

  const text = await readFile(file.absolute, "utf8");
  for (const { label, pattern } of sensitivePatterns) {
    if (pattern.test(text)) failures.push(`${file.relative}: potential ${label}`);
  }

  if (extension === ".json") {
    jsonCount += 1;
    try {
      JSON.parse(text);
    } catch (error) {
      failures.push(`${file.relative}: invalid JSON (${error.message})`);
    }
  }

  if (extension === ".svg") {
    svgCount += 1;
    if (!/<title\b/i.test(text)) failures.push(`${file.relative}: SVG is missing an accessible <title>`);
    if (!/<desc\b/i.test(text)) failures.push(`${file.relative}: SVG is missing an accessible <desc>`);
    if (/<script\b/i.test(text)) failures.push(`${file.relative}: SVG scripts are not allowed`);
    if (/\b(?:href|xlink:href)\s*=\s*["']https?:/i.test(text)) {
      failures.push(`${file.relative}: SVG remote resources are not allowed`);
    }
  }

  if (extension !== ".md") continue;

  const targets = [];
  const imagePattern = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^)]*["'])?\)/g;
  for (const match of text.matchAll(imagePattern)) {
    markdownImageCount += 1;
    if (!match[1].trim()) failures.push(`${file.relative}: image is missing meaningful alternative text`);
    targets.push(match[2]);
  }
  const linkPattern = /(?<!!)\[([^\]]+)\]\(([^)\s]+)(?:\s+["'][^)]*["'])?\)/g;
  for (const match of text.matchAll(linkPattern)) targets.push(match[2]);

  for (const target of targets) {
    const rawTarget = target.replace(/^<|>$/g, "");
    if (/^(?:https?:|mailto:|#)/i.test(rawTarget)) continue;

    relativeLinkCount += 1;
    const targetWithoutAnchor = rawTarget.split("#", 1)[0];
    if (!targetWithoutAnchor) continue;
    let decodedTarget;
    try {
      decodedTarget = decodeURIComponent(targetWithoutAnchor);
    } catch {
      failures.push(`${file.relative}: link target is not valid URL encoding (${rawTarget})`);
      continue;
    }
    const resolved = path.resolve(path.dirname(file.absolute), decodedTarget);
    if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
      failures.push(`${file.relative}: relative link escapes the repository (${rawTarget})`);
      continue;
    }
    try {
      await lstat(resolved);
    } catch {
      failures.push(`${file.relative}: broken relative link (${rawTarget})`);
    }
  }
}

const fixturePath = path.join(root, "docs", "synthetic-export.example.json");
try {
  const fixture = JSON.parse(await readFile(fixturePath, "utf8"));
  if (!String(fixture.example_notice ?? "").toLowerCase().includes("fabricated")) {
    failures.push("docs/synthetic-export.example.json: fabricated-data notice is missing");
  }
  if (fixture.provenance?.fixture !== true) {
    failures.push("docs/synthetic-export.example.json: fixture provenance flag must be true");
  }
} catch {
  // The general JSON validation above reports the actionable parsing failure.
}

if (failures.length > 0) {
  console.error("Public case-study audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `Public case-study audit passed: ${files.length} files, ${markdownImageCount} Markdown images, ${relativeLinkCount} relative links, ${jsonCount} JSON files, and ${svgCount} accessible SVGs.`,
  );
}
