<template>
	<div class="package-page">
		<nav class="package-nav" :aria-label="copy.navigation">
			<a :href="searchUrl">{{ copy.backToSearch }}</a>
			<span>/</span>
			<a :href="allUrl">{{ copy.allPackages }}</a>
		</nav>

		<div v-if="loading" class="page-state">{{ copy.loading }}</div>
		<div v-else-if="error" class="page-state page-state--error">
			<h1>{{ copy.loadErrorTitle }}</h1>
			<p>{{ error }}</p>
		</div>
		<article v-else-if="packageData && selectedVersion" class="package-content">
			<section class="package-hero">
				<div class="cover-wrap">
					<img v-if="site?.coverUrl" :src="site.coverUrl" :alt="`${displayName} ${copy.icon}`" class="cover" />
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

			<div class="detail-grid">
				<main class="readme-panel">
					<section class="install-panel" aria-labelledby="install-title">
						<div class="install-heading">
							<div>
								<span class="eyebrow">{{ copy.install }}</span>
								<h2 id="install-title">{{ copy.installTitle }}</h2>
							</div>
							<label>
								<span>{{ copy.version }}</span>
								<select :value="selectedVersion.version" @change="selectVersion($event.target.value)">
									<option v-for="version in packageData.versions" :key="version.version" :value="version.version">{{ version.version }}</option>
								</select>
							</label>
						</div>
						<div class="command-tabs" role="tablist" :aria-label="copy.packageManager">
							<span class="command-tab command-tab--active">mcfpm</span>
						</div>
						<div class="command-row">
							<code>{{ installCommand }}</code>
							<button type="button" :aria-label="copyLabel" @click="copyInstallCommand">
								{{ copied ? copy.copied : copy.copy }}
							</button>
						</div>
					</section>
					<PackageMarkdown
						v-if="detailsMarkdown"
						:source="detailsMarkdown"
						:document-path="site?.legacyPath || ''"
					/>
					<div v-else class="metadata-fallback">
						<h2>{{ copy.about }}</h2>
						<p>{{ description }}</p>
						<p>{{ copy.noDocumentation(sourceLabel) }}</p>
					</div>
				</main>

				<div class="package-sidebar" role="complementary" :aria-label="copy.sidebar">
					<section class="metadata-panel">
						<h2>{{ copy.packageInformation }}</h2>
						<dl>
							<div><dt>{{ copy.source }}</dt><dd>{{ sourceLabel }}</dd></div>
							<div><dt>{{ copy.license }}</dt><dd>{{ selectedVersion.license }}</dd></div>
							<div><dt>{{ copy.artifactType }}</dt><dd>{{ selectedVersion.types?.join(listSeparator) || copy.unknown }}</dd></div>
							<div v-if="selectedVersion.minecraftRequirements?.length"><dt>Minecraft</dt><dd>{{ selectedVersion.minecraftRequirements.join(requirementSeparator) }}</dd></div>
							<div v-if="selectedVersion.dependencies?.length"><dt>{{ copy.dependencies }}</dt><dd><code v-for="dependency in selectedVersion.dependencies" :key="dependency">{{ dependency }}</code></dd></div>
						</dl>
						<div class="metadata-links">
							<a v-if="site?.projectUrl" :href="site.projectUrl" target="_blank" rel="noopener noreferrer">{{ copy.projectHome }}</a>
							<a v-if="repositoryPageUrl" :href="repositoryPageUrl" target="_blank" rel="noopener noreferrer">{{ repositoryPageLabel }}</a>
							<a :href="selectedVersion.descriptorUrl" target="_blank" rel="noopener noreferrer">{{ copy.descriptor }}</a>
						</div>
					</section>
					<RepoCard v-if="githubRepository" :repo="githubRepository" />
				</div>
			</div>
		</article>
	</div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useData } from "vitepress";

import PackageMarkdown from "./PackageMarkdown.vue";
import RepoCard from "./RepoCard.vue";
import { fetchMcfpmPackage, fetchStaticPackageContent, githubRepositoryFromUrl, packageRepositoryPageUrl } from "./mcfpmPackages.mjs";

const { lang } = useData();
const isEnglish = computed(() => String(lang.value || "").startsWith("en"));
const copy = computed(() => isEnglish.value ? {
	navigation: "Wheel navigation",
	backToSearch: "Back to search",
	allPackages: "All packages",
	loading: "Loading package information…",
	loadErrorTitle: "Unable to display package",
	loadError: "Unable to load this package. Please try again later.",
	icon: "icon",
	install: "Install",
	installTitle: "Use Mcfpm in your project directory",
	version: "Version",
	packageManager: "Package manager",
	copied: "Copied",
	copy: "Copy",
	copyCommand: "Copy install command",
	copiedCommand: "Install command copied",
	about: "About this package",
	noDocumentation: (source) => `This package comes from ${source}. The publisher has not provided additional documentation.`,
	sidebar: "Additional package information",
	packageInformation: "Package information",
	source: "Source",
	license: "License",
	artifactType: "Artifact type",
	unknown: "Unknown",
	dependencies: "Mcfpm dependencies",
	projectHome: "Project homepage",
	nexusPage: "View on Nexus",
	centralPage: "View on Maven Central",
	descriptor: "View .mcfpkg descriptor",
	fallbackName: "Mcfpm package",
	fallbackDescription: (coordinate) => `${coordinate} Mcfpm package`,
	siteTitle: "Vanilla Wheel",
} : {
	navigation: "前置馆导航",
	backToSearch: "返回搜索",
	allPackages: "全部资源",
	loading: "正在获取软件包信息…",
	loadErrorTitle: "无法显示软件包",
	loadError: "无法加载这个软件包，请稍后重试。",
	icon: "图标",
	install: "安装",
	installTitle: "在项目目录中使用 Mcfpm",
	version: "版本",
	packageManager: "包管理器",
	copied: "已复制",
	copy: "复制",
	copyCommand: "复制安装命令",
	copiedCommand: "安装命令已复制",
	about: "关于这个软件包",
	noDocumentation: (source) => `该软件包来自 ${source}。发布者尚未提供额外的介绍文档。`,
	sidebar: "软件包补充信息",
	packageInformation: "软件包信息",
	source: "来源",
	license: "许可证",
	artifactType: "制品类型",
	unknown: "未知",
	dependencies: "Mcfpm 依赖",
	projectHome: "项目主页",
	nexusPage: "在 Nexus 中查看",
	centralPage: "在 Maven Central 中查看",
	descriptor: "查看 .mcfpkg 描述符",
	fallbackName: "Mcfpm 软件包",
	fallbackDescription: (coordinate) => `${coordinate} 的 Mcfpm 软件包`,
	siteTitle: "香草前置馆",
});

const packageData = ref(null);
const selectedVersionName = ref("");
const loading = ref(true);
const error = ref("");
const copied = ref(false);
const legacyDetailsMarkdown = ref("");
let legacyContentRequest = 0;

const selectedVersion = computed(() => {
	if (!packageData.value) return null;
	return packageData.value.versions.find((version) => version.version === selectedVersionName.value)
		|| packageData.value.versions.find((version) => version.version === packageData.value.latestVersion)
		|| packageData.value.versions[0];
});
const site = computed(() => selectedVersion.value?.site || packageData.value?.display || null);
const displayName = computed(() => site.value?.name || packageData.value?.name || packageData.value?.coordinate || copy.value.fallbackName);
const description = computed(() => site.value?.description || selectedVersion.value?.description || packageData.value?.description || copy.value.fallbackDescription(packageData.value?.coordinate || ""));
const authors = computed(() => Array.isArray(site.value?.authors) ? site.value.authors : []);
const gameVersions = computed(() => Array.isArray(site.value?.gameVersions) && site.value.gameVersions.length
	? site.value.gameVersions
	: selectedVersion.value?.minecraftRequirements || []);
const tags = computed(() => Array.isArray(site.value?.tags) ? site.value.tags : []);
const initials = computed(() => displayName.value.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").slice(0, 2).toUpperCase());
const installCommand = computed(() => `mcfpm install ${packageData.value.coordinate}@${selectedVersion.value.version}`);
const copyLabel = computed(() => copied.value ? copy.value.copiedCommand : copy.value.copyCommand);
const detailsMarkdown = computed(() => legacyDetailsMarkdown.value || site.value?.detailsMarkdown || "");
const sourceLabel = computed(() => selectedVersion.value?.source === "nexus" ? "Nexus" : "Maven Central");
const listSeparator = computed(() => isEnglish.value ? ", " : "、");
const requirementSeparator = computed(() => isEnglish.value ? "; " : "；");
const searchUrl = computed(() => isEnglish.value ? "/datapack-index/en/wheel" : "/datapack-index/wheel");
const allUrl = computed(() => isEnglish.value ? "/datapack-index/en/wheel/all" : "/datapack-index/wheel/all");
const repositoryPageUrl = computed(() => packageData.value && selectedVersion.value
	? packageRepositoryPageUrl(packageData.value.coordinate, selectedVersion.value)
	: null);
const repositoryPageLabel = computed(() => selectedVersion.value?.source === "nexus" ? copy.value.nexusPage : copy.value.centralPage);
const githubRepository = computed(() => {
	const candidates = [
		site.value?.projectUrl,
		...(Array.isArray(selectedVersion.value?.upstreamUrls) ? selectedVersion.value.upstreamUrls : []),
	];
	for (const candidate of candidates) {
		const repository = githubRepositoryFromUrl(candidate);
		if (repository) return repository;
	}
	return null;
});

function selectVersion(version) {
	if (!packageData.value.versions.some((entry) => entry.version === version)) return;
	selectedVersionName.value = version;
	const url = new URL(window.location.href);
	url.searchParams.set("version", version);
	window.history.replaceState(null, "", url);
	document.title = `${displayName.value} ${version} | ${copy.value.siteTitle}`;
	void loadLegacyDetails();
}

async function loadLegacyDetails() {
	const request = ++legacyContentRequest;
	const legacyPath = site.value?.legacyPath;
	legacyDetailsMarkdown.value = "";
	if (!legacyPath) return;
	try {
		const markdown = await fetchStaticPackageContent(legacyPath);
		if (request === legacyContentRequest) legacyDetailsMarkdown.value = markdown;
	} catch (caught) {
		if (request === legacyContentRequest) {
			console.warn("Static wheel source document is unavailable; using repository metadata", caught);
		}
	}
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
		await loadLegacyDetails();
		document.title = `${displayName.value} | ${copy.value.siteTitle}`;
	} catch (caught) {
		error.value = isEnglish.value ? copy.value.loadError : (caught instanceof Error ? caught.message : String(caught));
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

.detail-grid { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 32px; align-items: start; }
.readme-panel { min-width: 0; }
.package-sidebar { position: sticky; top: 90px; display: flex; min-width: 0; margin-top: 28px; flex-direction: column; gap: 18px; }
.package-markdown { color: var(--vp-c-text-1); font-size: 16px; line-height: 1.75; }
.package-markdown :deep(h1), .package-markdown :deep(h2), .package-markdown :deep(h3), .package-markdown :deep(h4) { position: relative; scroll-margin-top: 90px; color: var(--vp-c-text-1); font-weight: 700; line-height: 1.3; }
.package-markdown :deep(h1) { margin: 0 0 24px; font-size: 32px; }
.package-markdown :deep(h2) { margin: 36px 0 18px; padding-top: 22px; border-top: 1px solid var(--vp-c-divider); font-size: 24px; }
.package-markdown :deep(h3) { margin: 28px 0 14px; font-size: 20px; }
.package-markdown :deep(h4) { margin: 22px 0 12px; font-size: 17px; }
.package-markdown :deep(p) { margin: 16px 0; line-height: 1.8; }
.package-markdown :deep(a) { color: var(--vp-c-brand-1); font-weight: 500; text-decoration: underline; text-decoration-color: color-mix(in srgb, var(--vp-c-brand-1) 35%, transparent); text-underline-offset: 3px; }
.package-markdown :deep(a:hover) { color: var(--vp-c-brand-2); text-decoration-color: currentColor; }
.package-markdown :deep(ul), .package-markdown :deep(ol) { margin: 16px 0; padding-left: 1.6rem; }
.package-markdown :deep(li) { margin: 7px 0; line-height: 1.75; }
.package-markdown :deep(blockquote) { margin: 20px 0; padding: 10px 18px; border-left: 4px solid var(--vp-c-brand-1); border-radius: 0 8px 8px 0; background: var(--vp-c-bg-soft); color: var(--vp-c-text-2); }
.package-markdown :deep(blockquote p) { margin: 6px 0; }
.package-markdown :deep(code) { padding: 3px 6px; border-radius: 5px; background: var(--vp-code-bg); color: var(--vp-code-color); font-family: var(--vp-font-family-mono); font-size: 0.875em; }
.package-markdown :deep(pre) { margin: 20px 0; overflow-x: auto; padding: 18px 20px; border-radius: 10px; background: var(--vp-code-block-bg); line-height: 1.7; white-space: pre !important; }
.package-markdown :deep(div[class*="language-"] > pre) { margin: 0; }
.package-markdown :deep(pre code) { display: block; padding: 0; background: transparent; color: var(--vp-code-block-color); font-size: 14px; white-space: pre !important; word-break: normal; }
.package-markdown :deep(table) { display: block; width: 100%; margin: 20px 0; overflow-x: auto; border-collapse: collapse; font-size: 14px; }
.package-markdown :deep(th), .package-markdown :deep(td) { min-width: 110px; padding: 10px 14px; border: 1px solid var(--vp-c-divider); text-align: left; vertical-align: top; }
.package-markdown :deep(th) { background: var(--vp-c-bg-soft); font-weight: 700; }
.package-markdown :deep(tr:nth-child(2n) td) { background: color-mix(in srgb, var(--vp-c-bg-soft) 65%, transparent); }
.package-markdown :deep(hr) { margin: 32px 0; border: 0; border-top: 1px solid var(--vp-c-divider); }
.package-markdown :deep(img) { max-width: 100%; border-radius: 10px; box-shadow: 0 6px 22px rgba(12, 24, 40, 0.08); }
.metadata-panel { padding: 18px; border: 1px solid var(--vp-c-divider); border-radius: 14px; background: var(--vp-c-bg-soft); }
.metadata-panel h2 { margin: 0 0 12px; border: 0; padding: 0; font-size: 17px; }
.metadata-panel dl { margin: 0; }
.metadata-panel dl > div { padding: 10px 0; border-bottom: 1px solid var(--vp-c-divider); }
.metadata-panel dt { color: var(--vp-c-text-3); font-size: 12px; }
.metadata-panel dd { margin: 3px 0 0; overflow-wrap: anywhere; }
.metadata-panel dd code { display: block; margin-top: 4px; font-size: 11px; }
.metadata-links { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
.metadata-links a { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 9px 11px; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg); color: var(--vp-c-brand-1); text-decoration: none; }
.metadata-links a::after { content: "↗"; color: var(--vp-c-text-3); }
.metadata-links a:hover { border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }

@media (max-width: 800px) {
	.package-page { padding: 10px 16px 48px; }
	.package-hero { gap: 16px; }
	.cover { width: 78px; height: 78px; }
	.detail-grid { grid-template-columns: 1fr; }
	.package-sidebar { position: static; margin-top: 0; }
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
