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
						:document-path="detailsDocumentPath"
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
import {
	fetchEnglishGitHubReadme,
	fetchMcfpmPackage,
	fetchStaticPackageDocument,
	githubRepositoryFromUrl,
	githubRepositoryTitle,
	packageRepositoryPageUrl,
} from "./mcfpmPackages.mjs";

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
const localizedStaticDocument = ref(null);
const documentationSource = ref(null);
let legacyContentRequest = 0;

const selectedVersion = computed(() => {
	if (!packageData.value) return null;
	return packageData.value.versions.find((version) => version.version === selectedVersionName.value)
		|| packageData.value.versions.find((version) => version.version === packageData.value.latestVersion)
		|| packageData.value.versions[0];
});
const site = computed(() => selectedVersion.value?.site || packageData.value?.display || null);
const originalDisplayName = computed(() => site.value?.name
	|| packageData.value?.name
	|| packageData.value?.coordinate
	|| copy.value.fallbackName);
const displayName = computed(() => (isEnglish.value ? githubRepositoryTitle(resolveGitHubRepository()) : null)
	|| originalDisplayName.value);
const description = computed(() => (isEnglish.value ? localizedStaticDocument.value?.description : null)
	|| site.value?.description
	|| selectedVersion.value?.description
	|| packageData.value?.description
	|| copy.value.fallbackDescription(packageData.value?.coordinate || ""));
const authors = computed(() => Array.isArray(site.value?.authors) ? site.value.authors : []);
const gameVersions = computed(() => Array.isArray(site.value?.gameVersions) && site.value.gameVersions.length
	? site.value.gameVersions
	: selectedVersion.value?.minecraftRequirements || []);
const tags = computed(() => isEnglish.value && localizedStaticDocument.value?.tags?.length
	? localizedStaticDocument.value.tags
	: (Array.isArray(site.value?.tags) ? site.value.tags : []));
const initials = computed(() => displayName.value.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").slice(0, 2).toUpperCase());
const installCommand = computed(() => `mcfpm install ${packageData.value.coordinate}@${selectedVersion.value.version}`);
const copyLabel = computed(() => copied.value ? copy.value.copiedCommand : copy.value.copyCommand);
const detailsMarkdown = computed(() => documentationSource.value?.markdown || site.value?.detailsMarkdown || "");
const detailsDocumentPath = computed(() => documentationSource.value?.documentPath || site.value?.legacyPath || "");
const sourceLabel = computed(() => selectedVersion.value?.source === "nexus" ? "Nexus" : "Maven Central");
const listSeparator = computed(() => isEnglish.value ? ", " : "、");
const requirementSeparator = computed(() => isEnglish.value ? "; " : "；");
const searchUrl = computed(() => isEnglish.value ? "/datapack-index/en/wheel" : "/datapack-index/wheel");
const allUrl = computed(() => isEnglish.value ? "/datapack-index/en/wheel/all" : "/datapack-index/wheel/all");
const repositoryPageUrl = computed(() => packageData.value && selectedVersion.value
	? packageRepositoryPageUrl(packageData.value.coordinate, selectedVersion.value)
	: null);
const repositoryPageLabel = computed(() => selectedVersion.value?.source === "nexus" ? copy.value.nexusPage : copy.value.centralPage);
function resolveGitHubRepository(staticDocument = localizedStaticDocument.value) {
	const candidates = [
		site.value?.projectUrl,
		...(Array.isArray(selectedVersion.value?.upstreamUrls) ? selectedVersion.value.upstreamUrls : []),
	];
	for (const candidate of candidates) {
		const repository = githubRepositoryFromUrl(candidate);
		if (repository) return repository;
	}
	return staticDocument?.githubRepository || null;
}
const githubRepository = computed(() => resolveGitHubRepository());

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
	localizedStaticDocument.value = null;
	documentationSource.value = null;
	let staticDocument = null;
	if (legacyPath) {
		try {
			staticDocument = await fetchStaticPackageDocument(legacyPath, isEnglish.value ? "en" : "zh-CN");
		} catch (caught) {
			console.warn("Static wheel source document is unavailable; using repository metadata", caught);
		}
	}
	if (request !== legacyContentRequest) return;
	localizedStaticDocument.value = staticDocument;
	let githubReadme = null;
	const repository = resolveGitHubRepository(staticDocument);
	if (isEnglish.value && repository) {
		try {
			githubReadme = await fetchEnglishGitHubReadme(repository);
		} catch (caught) {
			console.warn("GitHub README is unavailable; using the localized Wheel document", caught);
		}
	}
	if (request !== legacyContentRequest) return;
	documentationSource.value = githubReadme || (staticDocument ? {
		markdown: staticDocument.markdown,
		documentPath: staticDocument.documentPath,
	} : null);
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

<style scoped src="./packagePage.css"></style>
