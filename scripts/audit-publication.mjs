import { createHash } from "node:crypto";
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
  "assets/manifest.json",
  "assets/database-safety.svg",
  "assets/product-approved-exports.jpg",
  "assets/product-approved-review.jpg",
  "assets/product-library-overview.jpg",
  "assets/product-prompt-provenance.jpg",
  "assets/release-safety.svg",
  "assets/research-studio-workflow.png",
  "docs/README.md",
  "docs/approval-and-automation.md",
  "docs/design-decisions.md",
  "docs/engineering-notes.md",
  "docs/prompt-contract.md",
  "docs/releases/case-study-2026.08.15.md",
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

function pngDimensions(buffer) {
  if (buffer.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function jpegDimensions(buffer) {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  const startOfFrameMarkers = new Set([
    0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
  ]);
  let offset = 2;
  while (offset + 8 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    while (buffer[offset] === 0xff) offset += 1;
    const marker = buffer[offset];
    offset += 1;
    if (marker === 0xd9 || marker === 0xda) break;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (offset + 2 > buffer.length) break;
    const length = buffer.readUInt16BE(offset);
    if (length < 2 || offset + length > buffer.length) break;
    if (startOfFrameMarkers.has(marker)) {
      return { width: buffer.readUInt16BE(offset + 5), height: buffer.readUInt16BE(offset + 3) };
    }
    offset += length;
  }
  return null;
}

function svgDimensions(buffer) {
  const source = buffer.toString("utf8");
  const width = Number(source.match(/<svg\b[^>]*\bwidth=["'](\d+)["']/i)?.[1]);
  const height = Number(source.match(/<svg\b[^>]*\bheight=["'](\d+)["']/i)?.[1]);
  return Number.isInteger(width) && Number.isInteger(height) ? { width, height } : null;
}

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && skippedDirectories.has(entry.name)) continue;
    if (entry.isFile() && entry.name === ".git") continue;
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

const assetFiles = files.filter(
  (file) => file.relative.startsWith("assets/") && file.relative !== "assets/manifest.json",
);
try {
  const manifest = JSON.parse(await readFile(path.join(root, "assets", "manifest.json"), "utf8"));
  if (manifest.schemaVersion !== 1) {
    failures.push("assets/manifest.json: unsupported schemaVersion");
  }
  if (!String(manifest.captureBoundary ?? "").includes("synthetic-fixture")) {
    failures.push("assets/manifest.json: synthetic/publication boundary is missing");
  }

  const entries = Array.isArray(manifest.assets) ? manifest.assets : [];
  const entriesByPath = new Map();
  for (const entry of entries) {
    if (!entry || typeof entry.path !== "string" || !entry.path.startsWith("assets/")) {
      failures.push("assets/manifest.json: every entry needs a repository-relative assets/ path");
      continue;
    }
    if (entriesByPath.has(entry.path)) {
      failures.push(`assets/manifest.json: duplicate entry ${entry.path}`);
      continue;
    }
    entriesByPath.set(entry.path, entry);

    if (!new Set(["original-diagram", "synthetic-ui-capture"]).has(entry.classification)) {
      failures.push(`${entry.path}: unsupported publication classification`);
    }
    if (!/^[0-9a-f]{64}$/.test(entry.sha256 ?? "")) {
      failures.push(`${entry.path}: manifest SHA-256 must be 64 lowercase hexadecimal characters`);
    }

    const file = assetFiles.find((candidate) => candidate.relative === entry.path);
    if (!file) {
      failures.push(`${entry.path}: manifest entry has no matching asset`);
      continue;
    }
    const buffer = await readFile(file.absolute);
    const digest = createHash("sha256").update(buffer).digest("hex");
    if (digest !== entry.sha256) failures.push(`${entry.path}: SHA-256 differs from manifest`);
    if (file.size !== entry.bytes) failures.push(`${entry.path}: byte size differs from manifest`);

    const extension = path.extname(entry.path).toLowerCase();
    const expectedMediaType =
      extension === ".png"
        ? "image/png"
        : extension === ".jpg" || extension === ".jpeg"
          ? "image/jpeg"
          : extension === ".svg"
            ? "image/svg+xml"
            : null;
    if (entry.mediaType !== expectedMediaType) {
      failures.push(`${entry.path}: mediaType does not match the file extension`);
    }

    const dimensions =
      extension === ".png"
        ? pngDimensions(buffer)
        : extension === ".jpg" || extension === ".jpeg"
          ? jpegDimensions(buffer)
          : extension === ".svg"
            ? svgDimensions(buffer)
            : null;
    if (!dimensions) {
      failures.push(`${entry.path}: dimensions could not be read`);
    } else if (dimensions.width !== entry.width || dimensions.height !== entry.height) {
      failures.push(`${entry.path}: dimensions differ from manifest`);
    }
  }

  for (const file of assetFiles) {
    if (!entriesByPath.has(file.relative)) {
      failures.push(`${file.relative}: asset is missing from assets/manifest.json`);
    }
  }
} catch (error) {
  failures.push(`assets/manifest.json: could not validate manifest (${error.message})`);
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
    if (extension === ".jpg" || extension === ".jpeg") {
      const signature = await readFile(file.absolute).then((buffer) => buffer.subarray(0, 3).toString("hex"));
      if (signature !== "ffd8ff") failures.push(`${file.relative}: invalid JPEG signature`);
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
