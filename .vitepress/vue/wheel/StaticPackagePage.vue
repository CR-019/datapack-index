<template>
	<div class="package-page">
		<nav class="package-nav" :aria-label="copy.navigation">
			<a :href="searchUrl">{{ copy.backToSearch }}</a>
			<span>/</span>
			<a :href="allUrl">{{ copy.allPackages }}</a>
		</nav>

		<article class="package-content">
			<section class="package-hero">
				<div class="cover-wrap">
					<img v-if="coverUrl" :src="coverUrl" :alt="`${displayName} ${copy.icon}`" class="cover" />
					<div v-else class="cover cover--placeholder">{{ initials }}</div>
				</div>
				<div class="hero-main">
					<div class="title-row">
						<h1>{{ displayName }}</h1>
						<span v-if="packageVersion" class="version-chip">{{ packageVersion }}</span>
					</div>
					<p v-if="description" class="description">{{ description }}</p>
					<div v-if="authors.length" class="authors">
						<a
							v-for="author in authors"
							:key="author.key"
							:href="author.socialLinks?.[0]?.url || undefined"
							:class="{ 'author--plain': !author.socialLinks?.[0]?.url }"
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
					<section class="install-panel install-panel--unavailable" aria-labelledby="static-mcfpm-title">
						<div class="install-heading">
							<div>
								<span class="eyebrow">Mcfpm</span>
								<h2 id="static-mcfpm-title">{{ copy.notPublishedTitle }}</h2>
							</div>
						</div>
						<div class="unavailable-row" role="status">
							<span class="unavailable-icon" aria-hidden="true">!</span>
							<p>{{ copy.noQuickInstall }}</p>
						</div>
					</section>
					<div class="vp-doc package-markdown static-package-markdown">
						<Content />
					</div>
				</main>

				<div class="package-sidebar" role="complementary" :aria-label="copy.sidebar">
					<section class="metadata-panel">
						<h2>{{ copy.packageInformation }}</h2>
						<dl>
							<div><dt>Mcfpm</dt><dd>{{ copy.notPublishedStatus }}</dd></div>
							<div v-if="license"><dt>{{ copy.license }}</dt><dd>{{ license }}</dd></div>
							<div v-if="gameVersions.length"><dt>Minecraft</dt><dd>{{ gameVersions.join(requirementSeparator) }}</dd></div>
						</dl>
						<div class="metadata-links">
							<a v-if="projectUrl" :href="projectUrl" target="_blank" rel="noopener noreferrer">{{ copy.projectHome }}</a>
							<a :href="editUrl" target="_blank" rel="noopener noreferrer">{{ copy.editPage }}</a>
						</div>
					</section>
					<RepoCard v-if="githubRepository" :repo="githubRepository" />
				</div>
			</div>
		</article>
	</div>
</template>

<script setup>
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useData, useRoute, withBase } from "vitepress";

import RepoCard from "./RepoCard.vue";
import { githubRepositoryTitle } from "./mcfpmPackages.mjs";

const route = useRoute();
const { frontmatter, lang, page } = useData();
const isEnglish = computed(() => String(lang.value || "").startsWith("en"));
const copy = computed(() => isEnglish.value ? {
	navigation: "Wheel navigation",
	backToSearch: "Back to search",
	allPackages: "All packages",
	icon: "icon",
	notPublishedTitle: "This package has not been published to Mcfpm",
	noQuickInstall: "This static catalog entry does not provide a quick-install command.",
	notPublishedStatus: "Not published",
	sidebar: "Additional package information",
	packageInformation: "Package information",
	license: "License",
	projectHome: "Project homepage",
	editPage: "Edit this page on GitHub",
	siteTitle: "Vanilla Wheel",
} : {
	navigation: "前置馆导航",
	backToSearch: "返回搜索",
	allPackages: "全部资源",
	icon: "图标",
	notPublishedTitle: "此包尚未上传至 Mcfpm",
	noQuickInstall: "此静态条目不提供快速安装命令。",
	notPublishedStatus: "尚未上传",
	sidebar: "软件包补充信息",
	packageInformation: "软件包信息",
	license: "许可证",
	projectHome: "项目主页",
	editPage: "在 GitHub 编辑此页",
	siteTitle: "香草前置馆",
});

const info = computed(() => frontmatter.value || {});
const githubRepository = computed(() => {
	const repository = typeof info.value.repo === "string" ? info.value.repo.trim() : "";
	return githubRepositoryTitle(repository) ? repository : "";
});
const displayName = computed(() => (isEnglish.value ? githubRepositoryTitle(githubRepository.value) : null)
	|| info.value.name
	|| copy.value.siteTitle);
const description = computed(() => typeof info.value.description === "string" ? info.value.description : "");
const packageVersion = computed(() => info.value.version == null ? "" : String(info.value.version));
const gameVersions = computed(() => values(info.value.gameversion));
const tags = computed(() => values(info.value.tags));
const license = computed(() => typeof info.value.license === "string" ? info.value.license : "");
const coverUrl = computed(() => assetUrl(info.value.cover));
const projectUrl = computed(() => githubRepository.value ? `https://github.com/${githubRepository.value}` : "");
const initials = computed(() => String(displayName.value || "").trim().split(/\s+/).slice(0, 2)
	.map((part) => part[0] || "").join("").slice(0, 2).toUpperCase());
const authors = ref([]);
let authorRequest = 0;

const searchUrl = computed(() => isEnglish.value ? "/datapack-index/en/wheel" : "/datapack-index/wheel");
const allUrl = computed(() => isEnglish.value ? "/datapack-index/en/wheel/all" : "/datapack-index/wheel/all");
const requirementSeparator = computed(() => isEnglish.value ? "; " : "；");
const editUrl = computed(() => {
	const relativePath = String(page.value?.relativePath || "")
		.replaceAll("\\", "/")
		.split("/")
		.map((segment) => encodeURIComponent(segment))
		.join("/");
	return `https://github.com/CR-019/datapack-index/blob/master/${relativePath}`;
});

function values(value) {
	if (Array.isArray(value)) return value.filter((entry) => entry != null && String(entry).trim()).map(String);
	return value == null || !String(value).trim() ? [] : [String(value)];
}

function assetUrl(value) {
	if (typeof value !== "string" || !value.trim()) return "";
	const url = value.trim();
	if (/^https?:\/\//i.test(url)) return url;
	const base = import.meta.env.BASE_URL || "/";
	if (base !== "/" && url.startsWith(base)) return url;
	return withBase(url.startsWith("/") ? url : `/${url}`);
}

function sourceAuthors() {
	const value = info.value.author;
	return (Array.isArray(value) ? value : value == null ? [] : [value]).flatMap((entry) => {
		if (typeof entry === "string" && entry.trim()) return [{ name: entry.trim(), char: "" }];
		if (!entry || typeof entry !== "object") return [];
		const name = String(entry.name || entry.authorName || "").trim();
		return name ? [{ ...entry, name, char: entry.char || entry.c || "" }] : [];
	});
}

async function loadAuthors() {
	if (typeof window === "undefined") return;
	const request = ++authorRequest;
	const resolved = await Promise.all(sourceAuthors().map(async (author, index) => {
		let metadata = null;
		try {
			const response = await fetch(withBase(`/authors/${encodeURIComponent(author.name)}.json`));
			if (response.ok) metadata = await response.json();
		} catch {
			// Fall back to the page's frontmatter below.
		}
		const socialLinks = Array.isArray(metadata?.socialLinks)
			? metadata.socialLinks
			: (Array.isArray(author.socialLinks) ? author.socialLinks : []);
		return {
			key: `${author.name}-${index}`,
			name: metadata?.name || author.name,
			avatarUrl: assetUrl(metadata?.avatar || author.avatarUrl || author.avatar),
			socialLinks,
		};
	}));
	if (request === authorRequest) authors.value = resolved;
}

onMounted(() => {
	window.scrollTo({ top: 0, left: 0 });
	void loadAuthors();
});
watch(() => route.path, () => {
	window.scrollTo({ top: 0, left: 0 });
	void loadAuthors();
});
watchEffect(() => {
	if (typeof document !== "undefined") document.title = `${displayName.value} | ${copy.value.siteTitle}`;
});
</script>

<style scoped src="./packagePage.css"></style>
