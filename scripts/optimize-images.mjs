import { createHash, randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import {
  mkdir,
  open,
  readFile,
  readdir,
  rename,
  rm,
  stat,
} from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import sharp from "sharp";
import { optimize as optimizeSvg } from "svgo";

export const OPTIMIZER_VERSION = "v1";
export const DEFAULT_CONCURRENCY = 2;

const RASTER_OPTIONS = Object.freeze({ quality: 80 });
const SVG_OPTIONS = Object.freeze({
  multipass: true,
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          cleanupNumericValues: false,
          cleanupIds: {
            minify: false,
            remove: false,
          },
          convertPathData: false,
        },
      },
    },
    "sortAttrs",
    {
      name: "addAttributesToSVGElement",
      params: {
        attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
      },
    },
  ],
});

const FORMAT_CONFIG = Object.freeze({
  png: { engine: "sharp", format: "png", options: RASTER_OPTIONS },
  jpeg: { engine: "sharp", format: "jpeg", options: RASTER_OPTIONS },
  svg: { engine: "svgo", options: SVG_OPTIONS },
});

function imageFormat(filePath) {
  switch (path.extname(filePath).toLowerCase()) {
    case ".png":
      return "png";
    case ".jpg":
    case ".jpeg":
      return "jpeg";
    case ".svg":
      return "svg";
    default:
      return undefined;
  }
}

export function parseConcurrency(value, fallback = DEFAULT_CONCURRENCY) {
  if (value === undefined || value === "") return fallback;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

async function collectImageFiles(directory) {
  const files = [];

  async function visit(currentDirectory) {
    const entries = await readdir(currentDirectory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));

    for (const entry of entries) {
      const entryPath = path.join(currentDirectory, entry.name);
      if (entry.isDirectory()) {
        await visit(entryPath);
      } else if (entry.isFile() && imageFormat(entryPath)) {
        files.push(entryPath);
      }
    }
  }

  await visit(directory);
  return files;
}

function configFingerprint(format) {
  return JSON.stringify({
    optimizerVersion: OPTIMIZER_VERSION,
    format,
    ...FORMAT_CONFIG[format],
  });
}

async function cacheKeyForFile(filePath, format) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(filePath)) {
    hash.update(chunk);
  }
  hash.update("\0");
  hash.update(format);
  hash.update("\0");
  hash.update(configFingerprint(format));
  return hash.digest("hex");
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function cachePaths(cacheDirectory, key) {
  const directory = path.join(cacheDirectory, key.slice(0, 2));
  return {
    directory,
    manifest: path.join(directory, `${key}.json`),
    output: path.join(directory, `${key}.bin`),
  };
}

async function atomicWrite(filePath, data) {
  const temporaryPath = `${filePath}.${process.pid}.${randomUUID()}.tmp`;
  let handle;
  try {
    await mkdir(path.dirname(filePath), { recursive: true });
    handle = await open(temporaryPath, "wx");
    await handle.writeFile(data);
    await handle.sync();
    await handle.close();
    handle = undefined;
    await rename(temporaryPath, filePath);
  } catch (error) {
    await handle?.close().catch(() => {});
    await rm(temporaryPath, { force: true }).catch(() => {});
    throw error;
  }
}

async function readCachedResult(cacheDirectory, key, sourceSize, logger) {
  const cache = cachePaths(cacheDirectory, key);
  let manifest;

  try {
    manifest = JSON.parse(await readFile(cache.manifest, "utf8"));
  } catch (error) {
    if (error?.code !== "ENOENT") {
      logger.warn(
        `[image-optimizer] Ignoring invalid cache entry ${cache.manifest}: ${error.message}`,
      );
    }
    return undefined;
  }

  if (
    manifest.schema !== 1 ||
    manifest.sourceSize !== sourceSize ||
    !["optimized", "original"].includes(manifest.decision)
  ) {
    logger.warn(`[image-optimizer] Ignoring invalid cache entry ${cache.manifest}`);
    return undefined;
  }

  if (manifest.decision === "original") {
    return { decision: "original" };
  }

  try {
    const output = await readFile(cache.output);
    if (
      output.byteLength !== manifest.outputSize ||
      output.byteLength >= sourceSize ||
      sha256(output) !== manifest.outputSha256
    ) {
      logger.warn(`[image-optimizer] Ignoring invalid cache entry ${cache.output}`);
      return undefined;
    }
    return { decision: "optimized", output };
  } catch (error) {
    if (error?.code !== "ENOENT") {
      logger.warn(
        `[image-optimizer] Ignoring invalid cache entry ${cache.output}: ${error.message}`,
      );
    }
    return undefined;
  }
}

async function writeCachedResult(cacheDirectory, key, sourceSize, output) {
  const cache = cachePaths(cacheDirectory, key);
  const shouldOptimize = output.byteLength < sourceSize;
  const manifest = {
    schema: 1,
    sourceSize,
    decision: shouldOptimize ? "optimized" : "original",
    ...(shouldOptimize
      ? {
          outputSize: output.byteLength,
          outputSha256: sha256(output),
        }
      : {}),
  };

  if (shouldOptimize) {
    await atomicWrite(cache.output, output);
  }
  await atomicWrite(cache.manifest, `${JSON.stringify(manifest)}\n`);
}

async function optimizeBuffer({ buffer, filePath, format }) {
  if (format === "svg") {
    return Buffer.from(
      optimizeSvg(buffer.toString(), {
        path: filePath,
        ...SVG_OPTIONS,
      }).data,
    );
  }

  return sharp(buffer).toFormat(format, RASTER_OPTIONS).toBuffer();
}

async function runWithConcurrency(items, concurrency, worker) {
  let nextIndex = 0;
  const workerCount = Math.min(concurrency, items.length);

  async function runWorker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      await worker(items[index]);
    }
  }

  await Promise.all(Array.from({ length: workerCount }, () => runWorker()));
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MiB`;
}

/**
 * Optimize all PNG, JPEG, and SVG files below a VitePress output directory.
 * The optimizer option is intentionally injectable so the scheduling and cache
 * behavior can be tested independently from native codecs.
 */
export async function optimizeImages({
  distDirectory = path.resolve(".vitepress/dist"),
  cacheDirectory = path.resolve(".cache/image-optimizer", OPTIMIZER_VERSION),
  concurrency = parseConcurrency(process.env.IMAGE_OPTIMIZER_CONCURRENCY),
  optimizer = optimizeBuffer,
  logger = console,
} = {}) {
  const startedAt = performance.now();
  const effectiveConcurrency = parseConcurrency(concurrency);
  const files = await collectImageFiles(distDirectory);
  const groupsByKey = new Map();
  let bytesBefore = 0;

  for (const filePath of files) {
    const format = imageFormat(filePath);
    const fileStat = await stat(filePath);
    const key = await cacheKeyForFile(filePath, format);
    bytesBefore += fileStat.size;

    const existingGroup = groupsByKey.get(key);
    if (existingGroup) {
      existingGroup.files.push(filePath);
    } else {
      groupsByKey.set(key, {
        key,
        format,
        sourceSize: fileStat.size,
        files: [filePath],
      });
    }
  }

  const groups = [...groupsByKey.values()];
  const stats = {
    scannedFiles: files.length,
    uniqueInputs: groups.length,
    processedInputs: 0,
    cacheHits: 0,
    deduplicatedFiles: files.length - groups.length,
    optimizedFiles: 0,
    unchangedFiles: 0,
    failedFiles: 0,
    bytesBefore,
    bytesAfter: bytesBefore,
    bytesSaved: 0,
    concurrency: effectiveConcurrency,
    elapsedMs: 0,
  };

  await runWithConcurrency(groups, effectiveConcurrency, async (group) => {
    const relativePath = path.relative(distDirectory, group.files[0]);
    let result = await readCachedResult(
      cacheDirectory,
      group.key,
      group.sourceSize,
      logger,
    );

    if (result) {
      stats.cacheHits += 1;
    } else {
      stats.processedInputs += 1;
      try {
        const source = await readFile(group.files[0]);
        const output = await optimizer({
          buffer: source,
          filePath: group.files[0],
          format: group.format,
        });
        result =
          output.byteLength < source.byteLength
            ? { decision: "optimized", output }
            : { decision: "original" };

        try {
          await writeCachedResult(
            cacheDirectory,
            group.key,
            source.byteLength,
            output,
          );
        } catch (error) {
          logger.warn(
            `[image-optimizer] Could not cache ${relativePath}: ${error.message}`,
          );
        }
      } catch (error) {
        stats.failedFiles += group.files.length;
        logger.warn(
          `[image-optimizer] Keeping ${relativePath} unchanged: ${error.message}`,
        );
        return;
      }
    }

    if (result.decision === "original") {
      stats.unchangedFiles += group.files.length;
      return;
    }

    const savedPerFile = group.sourceSize - result.output.byteLength;
    for (const filePath of group.files) {
      try {
        await atomicWrite(filePath, result.output);
        stats.optimizedFiles += 1;
        stats.bytesSaved += savedPerFile;
        stats.bytesAfter -= savedPerFile;
      } catch (error) {
        stats.failedFiles += 1;
        logger.warn(
          `[image-optimizer] Keeping ${path.relative(distDirectory, filePath)} unchanged: ${error.message}`,
        );
      }
    }
  });

  stats.elapsedMs = Math.round(performance.now() - startedAt);
  const savedPercent = stats.bytesBefore
    ? ((stats.bytesSaved / stats.bytesBefore) * 100).toFixed(1)
    : "0.0";
  logger.log(
    `[image-optimizer] Scanned ${stats.scannedFiles} files (${stats.uniqueInputs} unique, ` +
      `${stats.deduplicatedFiles} duplicate files reused); processed ${stats.processedInputs}, ` +
      `cache hits ${stats.cacheHits}; optimized ${stats.optimizedFiles}, kept ` +
      `${stats.unchangedFiles}, failed ${stats.failedFiles}; saved ` +
      `${formatBytes(stats.bytesSaved)} / ${formatBytes(stats.bytesBefore)} ` +
      `(${savedPercent}%) in ${(stats.elapsedMs / 1000).toFixed(2)}s ` +
      `(concurrency ${effectiveConcurrency}).`,
  );

  return stats;
}

const isMain =
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isMain) {
  optimizeImages().catch((error) => {
    console.error(`[image-optimizer] Fatal error: ${error.stack ?? error.message}`);
    process.exitCode = 1;
  });
}
