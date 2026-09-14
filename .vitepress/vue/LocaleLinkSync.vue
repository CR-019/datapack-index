<template>
	<span hidden aria-hidden="true"></span>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted } from "vue";

import { preserveLocaleQuery } from "./localeLinks.mjs";

const localeLinkSelector = [
	".VPNavBarTranslations a",
	".VPNavBarExtra .translations a",
	".VPNavScreenTranslations a",
].join(",");
let observer;

function synchronizeLocaleLinks() {
	const currentHref = window.location.href;
	for (const anchor of document.querySelectorAll(localeLinkSelector)) {
		const targetHref = anchor.getAttribute("href") || anchor.href;
		const localizedHref = preserveLocaleQuery(currentHref, targetHref, import.meta.env.BASE_URL || "/");
		if (localizedHref !== targetHref) anchor.setAttribute("href", localizedHref);
	}
}

onMounted(async () => {
	await nextTick();
	synchronizeLocaleLinks();
	observer = new MutationObserver(synchronizeLocaleLinks);
	observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });
	window.addEventListener("popstate", synchronizeLocaleLinks);
});

onBeforeUnmount(() => {
	observer?.disconnect();
	window.removeEventListener("popstate", synchronizeLocaleLinks);
});
</script>
