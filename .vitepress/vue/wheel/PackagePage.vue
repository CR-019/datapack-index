<template>
	<div class="package-page">
		<nav class="package-nav" aria-label="前置馆导航">
			<a href="/datapack-index/wheel">返回搜索</a>
			<span>/</span>
			<a href="/datapack-index/wheel/all">全部资源</a>
		</nav>

		<div v-if="loading" class="page-state">正在获取软件包信息…</div>
		<div v-else-if="error" class="page-state page-state--error">
			<h1>无法显示软件包</h1>
			<p>{{ error }}</p>
		</div>
		<article v-else-if="packageData && selectedVersion" class="package-content">
			<section class="package-hero">
				<div class="cover-wrap">
					<img v-if="site?.coverUrl" :src="site.coverUrl" :alt="`${displayName} 图标`" class="cover" />
					<div v-else class="cover cover--placeholder">{{ initials }}</div>
				</div>
				<div class="hero-main">
					<div class="title-row">
						<h1>{{ displayName }}</h1>
						<span class="version-chip">{{ selectedVersion.version }}</span>
					</div>
					<p class="coordinate">{{ packageData.coordinate }}</p>
					<p class="description">{{ description }}</p>
					<div v-if="authors.length" class="authors">
						<a
							v-for="author in authors"
							:key="author.name"
							:href="author.links?.[0]?.url || undefined"
							:class="{ 'author--plain': !author.links?.[0]?.url }"
							target="_blank"
							rel="noopener noreferrer"
						>
							<img v-if="author.avatarUrl" :src="author.avatarUrl" alt="" />
							<span>{{ author.name }}</span>
						</a>
					</div>
					<div class="badges">
						<span v-for="version in gameVersions" :key="`game-${version}`" class="badge badge--version">{{ version }}</span>
						<span v-for="tag in tags" :key="`tag-${tag}`" class="badge">{{ tag }}</span>
					</div>
				</div>
			</section>

			<section class="install-panel" aria-labelledby="install-title">
				<div class="install-heading">
					<div>
						<span class="eyebrow">安装</span>
						<h2 id="install-title">在项目目录中使用 Mcfpm</h2>
					</div>
					<label>
						<span>版本</span>
						<select :value="selectedVersion.version" @change="selectVersion($event.target.value)">
							<option v-for="version in packageData.versions" :key="version.version" :value="version.version">{{ version.version }}</option>
						</select>
					</label>
				</div>
				<div class="command-tabs" role="tablist" aria-label="包管理器">
					<span class="command-tab command-tab--active">mcfpm</span>
				</div>
				<div class="command-row">
					<code>{{ installCommand }}</code>
					<button type="button" :aria-label="copyLabel" @click="copyInstallCommand">
						{{ copied ? "已复制" : "复制" }}
					</button>
				</div>
			</section>

			<div class="detail-grid">
				<main class="readme-panel">
					<div v-if="detailsHtml" class="package-markdown" v-html="detailsHtml"></div>
					<div v-else class="metadata-fallback">
						<h2>关于这个软件包</h2>
						<p>{{ description }}</p>
						<p>该软件包来自 {{ sourceLabel }}。发布者尚未提供额外的介绍文档。</p>
					</div>
				</main>

				<aside class="metadata-panel">
					<h2>软件包信息</h2>
					<dl>
						<div><dt>来源</dt><dd>{{ sourceLabel }}</dd></div>
						<div><dt>许可证</dt><dd>{{ selectedVersion.license }}</dd></div>
						<div><dt>制品类型</dt><dd>{{ selectedVersion.types?.join("、") || "未知" }}</dd></div>
						<div v-if="selectedVersion.minecraftRequirements?.length"><dt>Minecraft</dt><dd>{{ selectedVersion.minecraftRequirements.join("；") }}</dd></div>
						<div v-if="selectedVersion.dependencies?.length"><dt>Mcfpm 依赖</dt><dd><code v-for="dependency in selectedVersion.dependencies" :key="dependency">{{ dependency }}</code></dd></div>
					</dl>
					<div class="metadata-links">
						<a v-if="site?.projectUrl" :href="site.projectUrl" target="_blank" rel="noopener noreferrer">项目主页</a>
						<a :href="selectedVersion.descriptorUrl" target="_blank" rel="noopener noreferrer">查看 .mcfpkg 描述符</a>
					</div>
				</aside>
			</div>
		</article>
	</div>
</template>

<script setup>
import MarkdownIt from "markdown-it";
import { computed, onMounted, ref } from "vue";

import { fetchMcfpmPackage } from "./mcfpmPackages.mjs";

const markdown = new MarkdownIt({ html: false, linkify: true, typographer: false });
const defaultLinkOpen = markdown.renderer.rules.link_open || ((tokens, index, options, env, self) => self.renderToken(tokens, index, options));
markdown.renderer.rules.link_open = (tokens, index, options, env, self) => {
	tokens[index].attrSet("target", "_blank");
	tokens[index].attrSet("rel", "noopener noreferrer");
	return defaultLinkOpen(tokens, index, options, env, self);
};

const packageData = ref(null);
const selectedVersionName = ref("");
const loading = ref(true);
const error = ref("");
const copied = ref(false);

const selectedVersion = computed(() => {
	if (!packageData.value) return null;
	return packageData.value.versions.find((version) => version.version === selectedVersionName.value)
		|| packageData.value.versions.find((version) => version.version === packageData.value.latestVersion)
		|| packageData.value.versions[0];
});
const site = computed(() => selectedVersion.value?.site || packageData.value?.display || null);
const displayName = computed(() => site.value?.name || packageData.value?.name || packageData.value?.coordinate || "Mcfpm 软件包");
const description = computed(() => site.value?.description || selectedVersion.value?.description || packageData.value?.description || `${packageData.value?.coordinate} 的 Mcfpm 软件包`);
const authors = computed(() => Array.isArray(site.value?.authors) ? site.value.authors : []);
const gameVersions = computed(() => Array.isArray(site.value?.gameVersions) ? site.value.gameVersions : []);
const tags = computed(() => Array.isArray(site.value?.tags) ? site.value.tags : []);
const initials = computed(() => displayName.value.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").slice(0, 2).toUpperCase());
const installCommand = computed(() => `mcfpm install ${packageData.value.coordinate}@${selectedVersion.value.version}`);
const copyLabel = computed(() => copied.value ? "安装命令已复制" : "复制安装命令");
const detailsHtml = computed(() => site.value?.detailsMarkdown ? markdown.render(site.value.detailsMarkdown) : "");
const sourceLabel = computed(() => selectedVersion.value?.source === "nexus" ? "Nexus" : "Maven Central");

function selectVersion(version) {
	if (!packageData.value.versions.some((entry) => entry.version === version)) return;
	selectedVersionName.value = version;
	const url = new URL(window.location.href);
	url.searchParams.set("version", version);
	window.history.replaceState(null, "", url);
	document.title = `${displayName.value} ${version} | 香草前置馆`;
}

async function copyInstallCommand() {
	await navigator.clipboard.writeText(installCommand.value);
	copied.value = true;
	window.setTimeout(() => { copied.value = false; }, 1600);
}

onMounted(async () => {
	try {
		window.scrollTo({ top: 0, left: 0 });
		const query = new URL(window.location.href).searchParams;
		const coordinate = query.get("package") || "";
		packageData.value = await fetchMcfpmPackage(coordinate);
		const requestedVersion = query.get("version");
		selectedVersionName.value = packageData.value.versions.some((entry) => entry.version === requestedVersion)
			? requestedVersion
			: packageData.value.latestVersion;
		document.title = `${displayName.value} | 香草前置馆`;
	} catch (caught) {
		error.value = caught instanceof Error ? caught.message : String(caught);
	} finally {
		loading.value = false;
	}
});
</script>

<style scoped>
.package-page { max-width: 1160px; margin: 0 auto; padding: 14px 24px 64px; }
.package-nav { display: flex; gap: 10px; margin-bottom: 20px; color: var(--vp-c-text-2); font-size: 14px; }
.package-nav a { color: var(--vp-c-brand-1); text-decoration: none; }
.page-state { padding: 70px 0; text-align: center; color: var(--vp-c-text-2); }
.page-state--error { color: var(--vp-c-danger-1); }

.package-hero { display: flex; gap: 28px; padding: 24px 0; border-bottom: 1px solid var(--vp-c-divider); }
.cover-wrap { flex: 0 0 auto; }
.cover { width: 108px; height: 108px; border-radius: 14px; object-fit: cover; box-shadow: 0 8px 24px rgba(12, 24, 40, 0.1); }
.cover--placeholder { display: grid; place-items: center; background: linear-gradient(135deg, #ddebff, #91bdf7); color: #164c8c; font-size: 34px; font-weight: 800; }
.hero-main { min-width: 0; flex: 1; }
.title-row { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
.title-row h1 { margin: 0; border: 0; font-size: clamp(28px, 4vw, 42px); line-height: 1.15; }
.version-chip, .badge { display: inline-flex; align-items: center; min-height: 25px; padding: 3px 9px; border: 1px solid var(--vp-c-divider); border-radius: 999px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-2); font-size: 12px; }
.version-chip, .badge--version { border-color: color-mix(in srgb, var(--vp-c-brand-1) 30%, transparent); background: color-mix(in srgb, var(--vp-c-brand-1) 9%, transparent); color: var(--vp-c-brand-1); }
.coordinate { margin: 7px 0 0; color: var(--vp-c-text-3); font-family: var(--vp-font-family-mono); font-size: 13px; }
.description { max-width: 760px; margin: 12px 0; color: var(--vp-c-text-2); font-size: 16px; }
.authors, .badges { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.authors a { display: inline-flex; align-items: center; gap: 7px; color: var(--vp-c-text-1); text-decoration: none; }
.authors img { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }
.authors .author--plain { pointer-events: none; }

.install-panel { margin: 28px 0; overflow: hidden; border: 1px solid var(--vp-c-divider); border-radius: 16px; background: var(--vp-c-bg-soft); }
.install-heading { display: flex; justify-content: space-between; gap: 20px; padding: 18px 20px 12px; }
.install-heading h2 { margin: 2px 0 0; border: 0; padding: 0; font-size: 18px; }
.eyebrow { color: var(--vp-c-brand-1); font-size: 12px; font-weight: 700; text-transform: uppercase; }
.install-heading label { display: flex; align-items: center; gap: 8px; color: var(--vp-c-text-2); font-size: 13px; }
.install-heading select { min-width: 112px; padding: 7px 28px 7px 10px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg); color: var(--vp-c-text-1); }
.command-tabs { padding: 0 20px; border-bottom: 1px solid var(--vp-c-divider); }
.command-tab { display: inline-block; padding: 9px 3px 8px; color: var(--vp-c-text-2); font-size: 13px; }
.command-tab--active { border-bottom: 2px solid var(--vp-c-brand-1); color: var(--vp-c-brand-1); font-weight: 700; }
.command-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 20px; background: #111827; color: #f8fafc; }
.command-row code { overflow-x: auto; padding: 0; background: transparent; color: inherit; white-space: nowrap; }
.command-row button { flex: 0 0 auto; padding: 7px 12px; border: 1px solid #475569; border-radius: 8px; background: #1e293b; color: #f8fafc; cursor: pointer; }

.detail-grid { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 36px; align-items: start; }
.readme-panel { min-width: 0; }
.package-markdown :deep(h1), .package-markdown :deep(h2), .package-markdown :deep(h3) { scroll-margin-top: 90px; }
.package-markdown :deep(img) { max-width: 100%; border-radius: 10px; }
.package-markdown :deep(pre) { overflow-x: auto; }
.metadata-panel { position: sticky; top: 90px; padding: 18px; border: 1px solid var(--vp-c-divider); border-radius: 14px; background: var(--vp-c-bg-soft); }
.metadata-panel h2 { margin: 0 0 12px; border: 0; padding: 0; font-size: 17px; }
.metadata-panel dl { margin: 0; }
.metadata-panel dl > div { padding: 10px 0; border-bottom: 1px solid var(--vp-c-divider); }
.metadata-panel dt { color: var(--vp-c-text-3); font-size: 12px; }
.metadata-panel dd { margin: 3px 0 0; overflow-wrap: anywhere; }
.metadata-panel dd code { display: block; margin-top: 4px; font-size: 11px; }
.metadata-links { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
.metadata-links a { color: var(--vp-c-brand-1); text-decoration: none; }

@media (max-width: 800px) {
	.package-page { padding: 10px 16px 48px; }
	.package-hero { gap: 16px; }
	.cover { width: 78px; height: 78px; }
	.detail-grid { grid-template-columns: 1fr; }
	.metadata-panel { position: static; }
}

@media (max-width: 560px) {
	.package-hero { align-items: flex-start; }
	.cover { width: 62px; height: 62px; border-radius: 10px; }
	.title-row h1 { font-size: 25px; }
	.install-heading { flex-direction: column; }
	.command-row { align-items: flex-start; }
	.command-row code { font-size: 12px; }
}
</style>
