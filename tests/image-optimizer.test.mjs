import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import sharp from "sharp";

import {
  DEFAULT_CONCURRENCY,
  optimizeImages,
  parseConcurrency,
} from "../scripts/optimize-images.mjs";

const quietLogger = {
  log() {},
  warn() {},
};

async function temporaryDirectories(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), "image-optimizer-test-"));
  const distDirectory = path.join(root, "dist");
  const cacheDirectory = path.join(root, "cache");
  await mkdir(distDirectory, { recursive: true });
  t.after(() => rm(root, { recursive: true, force: true }));
  return { root, distDirectory, cacheDirectory };
}

async function put(directory, relativePath, contents) {
  const filePath = path.join(directory, relativePath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, contents);
  return filePath;
}

test("cold and hot caches reuse duplicate content", async (t) => {
  const { distDirectory, cacheDirectory } = await temporaryDirectories(t);
  const original = Buffer.from("same image bytes in two paths");
  const firstPath = await put(distDirectory, "one.png", original);
  const secondPath = await put(distDirectory, "nested/two.png", original);
  let optimizerCalls = 0;
  const optimizer = async () => {
    optimizerCalls += 1;
    return Buffer.from("small");
  };

  const cold = await optimizeImages({
    distDirectory,
    cacheDirectory,
    optimizer,
    logger: quietLogger,
  });

  assert.equal(cold.scannedFiles, 2);
  assert.equal(cold.uniqueInputs, 1);
  assert.equal(cold.deduplicatedFiles, 1);
  assert.equal(cold.processedInputs, 1);
  assert.equal(cold.cacheHits, 0);
  assert.equal(optimizerCalls, 1);
  assert.deepEqual(await readFile(firstPath), Buffer.from("small"));
  assert.deepEqual(await readFile(secondPath), Buffer.from("small"));

  // A VitePress rebuild restores the original files before the post-build pass.
  await writeFile(firstPath, original);
  await writeFile(secondPath, original);
  const hot = await optimizeImages({
    distDirectory,
    cacheDirectory,
    optimizer,
    logger: quietLogger,
  });

  assert.equal(hot.processedInputs, 0);
  assert.equal(hot.cacheHits, 1);
  assert.equal(optimizerCalls, 1);
  assert.deepEqual(await readFile(firstPath), Buffer.from("small"));
  assert.deepEqual(await readFile(secondPath), Buffer.from("small"));
});

test("changing content at the same path creates a new cache entry", async (t) => {
  const { distDirectory, cacheDirectory } = await temporaryDirectories(t);
  const imagePath = await put(distDirectory, "changing.jpg", Buffer.from("first version"));
  let optimizerCalls = 0;
  const optimizer = async () => {
    optimizerCalls += 1;
    return Buffer.from([optimizerCalls]);
  };

  await optimizeImages({
    distDirectory,
    cacheDirectory,
    optimizer,
    logger: quietLogger,
  });
  await writeFile(imagePath, Buffer.from("second version with different content"));
  const changed = await optimizeImages({
    distDirectory,
    cacheDirectory,
    optimizer,
    logger: quietLogger,
  });

  assert.equal(changed.processedInputs, 1);
  assert.equal(changed.cacheHits, 0);
  assert.equal(optimizerCalls, 2);
  assert.deepEqual(await readFile(imagePath), Buffer.from([2]));
});

test("an output that is not smaller is kept and that decision is cached", async (t) => {
  const { distDirectory, cacheDirectory } = await temporaryDirectories(t);
  const original = Buffer.from("already-small");
  const imagePath = await put(distDirectory, "small.jpeg", original);
  let optimizerCalls = 0;
  const optimizer = async ({ buffer }) => {
    optimizerCalls += 1;
    return Buffer.concat([buffer, Buffer.from("-larger")]);
  };

  const cold = await optimizeImages({
    distDirectory,
    cacheDirectory,
    optimizer,
    logger: quietLogger,
  });
  const hot = await optimizeImages({
    distDirectory,
    cacheDirectory,
    optimizer,
    logger: quietLogger,
  });

  assert.equal(cold.unchangedFiles, 1);
  assert.equal(hot.cacheHits, 1);
  assert.equal(hot.unchangedFiles, 1);
  assert.equal(optimizerCalls, 1);
  assert.deepEqual(await readFile(imagePath), original);
});

test("SVG optimization works and a corrupt raster does not stop the run", async (t) => {
  const { distDirectory, cacheDirectory } = await temporaryDirectories(t);
  const svgPath = await put(
    distDirectory,
    "verbose.svg",
    `<svg height="10" width="10">
      <!-- this deliberately long comment is removable during optimization -->
      <rect width="10" height="10" fill="#ff0000" />
    </svg>`,
  );
  const corruptPath = await put(
    distDirectory,
    "corrupt.png",
    Buffer.from("not a PNG"),
  );
  const validPath = path.join(distDirectory, "valid.png");
  await sharp({
    create: {
      width: 32,
      height: 32,
      channels: 4,
      background: { r: 25, g: 100, b: 200, alpha: 1 },
    },
  })
    .png({ compressionLevel: 0 })
    .toFile(validPath);
  const corruptOriginal = await readFile(corruptPath);
  const warnings = [];

  const stats = await optimizeImages({
    distDirectory,
    cacheDirectory,
    logger: {
      log() {},
      warn(message) {
        warnings.push(message);
      },
    },
  });

  const optimizedSvg = await readFile(svgPath, "utf8");
  assert.equal(stats.scannedFiles, 3);
  assert.equal(stats.failedFiles, 1);
  assert.match(optimizedSvg, /<svg/);
  assert.doesNotMatch(optimizedSvg, /removable/);
  assert.deepEqual(await readFile(corruptPath), corruptOriginal);
  assert.ok((await readFile(validPath)).byteLength > 0);
  assert.ok(warnings.some((warning) => warning.includes("corrupt.png")));
});

test("configured concurrency is enforced and one task failure is isolated", async (t) => {
  const { distDirectory, cacheDirectory } = await temporaryDirectories(t);
  for (let index = 0; index < 7; index += 1) {
    await put(
      distDirectory,
      `${index}.png`,
      Buffer.from(`unique image contents ${index}`),
    );
  }

  let active = 0;
  let maximumActive = 0;
  const optimizer = async ({ buffer }) => {
    active += 1;
    maximumActive = Math.max(maximumActive, active);
    await new Promise((resolve) => setTimeout(resolve, 15));
    active -= 1;
    if (buffer.toString().endsWith("3")) throw new Error("intentional failure");
    return buffer.subarray(0, 2);
  };

  const stats = await optimizeImages({
    distDirectory,
    cacheDirectory,
    concurrency: 2,
    optimizer,
    logger: quietLogger,
  });

  assert.equal(maximumActive, 2);
  assert.equal(stats.failedFiles, 1);
  assert.equal(stats.optimizedFiles, 6);
  assert.deepEqual(await readFile(path.join(distDirectory, "3.png")), Buffer.from("unique image contents 3"));
});

test("concurrency parsing accepts only positive safe integers", () => {
  assert.equal(parseConcurrency(undefined), DEFAULT_CONCURRENCY);
  assert.equal(parseConcurrency(""), DEFAULT_CONCURRENCY);
  assert.equal(parseConcurrency("3"), 3);
  assert.equal(parseConcurrency("0"), DEFAULT_CONCURRENCY);
  assert.equal(parseConcurrency("1.5"), DEFAULT_CONCURRENCY);
  assert.equal(parseConcurrency("invalid"), DEFAULT_CONCURRENCY);
});
