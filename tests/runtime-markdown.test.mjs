import assert from "node:assert/strict";
import test from "node:test";

import { renderRuntimeMarkdown, validateRuntimeMarkdown } from "../.vitepress/vue/wheel/runtimeMarkdown.mjs";

test("renders the site's footnote, KaTeX, container, table, and custom-component syntax", () => {
	const source = `# Title

::: tip Notice
Inline $x^2$ and a note.[^1]
:::

| A | B |
| - | - |
| 1 | 2 |

<ColorLine :height="4" />

[^1]: Footnote text`;
	const html = renderRuntimeMarkdown(source, { english: true, baseUrl: "/datapack-index/" });
	assert.match(html, /class="tip custom-block"/);
	assert.match(html, /class="katex"/);
	assert.match(html, /class="footnotes"/);
	assert.match(html, /<table>/);
	assert.match(html, /<ColorLine :height="4" \/>/);
});

test("keeps package prose in its source language", () => {
	assert.match(renderRuntimeMarkdown("这是前置原文。", { english: true }), /这是前置原文。/);
});

test("allows only registered components and inert bound values", () => {
	assert.equal(validateRuntimeMarkdown("<RepoCard repo=\"Example/Pack\" />"), "<RepoCard repo=\"Example/Pack\" />");
	assert.throws(() => validateRuntimeMarkdown("<UnknownWidget />"), /unsupported component/);
	assert.throws(() => validateRuntimeMarkdown("<ColorLine :height=\"globalThis.fetch('https:\/\/evil.test')\" />"), /unsafe bound property/);
	assert.throws(() => validateRuntimeMarkdown("<ColorLine :height=globalThis />"), /unsafe bound property/);
	assert.throws(() => validateRuntimeMarkdown("<img src=x onerror=alert(1)>"), /unsafe HTML/);
	assert.throws(() => validateRuntimeMarkdown("<ColorLine @click=\"attack\" />"), /unsafe HTML/);
	assert.throws(() => validateRuntimeMarkdown("<a href=\"javascript:alert(1)\">x</a>"), /unsafe HTML/);
});
