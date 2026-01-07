<template>
    <div v-if="isMobile">
        <div class="card actions-card">
            <div class="actions">

                <a href="../" target="_blank" class="action back-btn" rel="noopener noreferrer">
                    <svg viewBox="0 0 16 16" class="icon" aria-hidden="true"><path fill="currentColor" d="M5.5 3.5L4.5 4.5 8.0 8 4.5 11.5 5.5 12.5 10 8z"></path></svg>
                    <span>返回搜索</span>
                </a>
                <a :href="githubPath" target="_blank" class="action edit-btn" rel="noopener noreferrer">
                    <svg viewBox="0 0 16 16" class="icon" aria-hidden="true"><path fill="currentColor" d="M12.3 1.7a1 1 0 0 1 1.4 0l.6.6a1 1 0 0 1 0 1.4l-8.6 8.6a1 1 0 0 1-.5.3l-3 1a.5.5 0 0 1-.6-.6l1-3a1 1 0 0 1 .3-.5l8.6-8.6zM11.3 3L4 10.3 3 11l.7-1L12 3.7 11.3 3z"></path></svg>
                    <span>在 GitHub 编辑此页</span>
                </a>
            </div>
        </div>
    </div>
    <div class="info-card" v-if="hasInfo">
        <div class="info-cover-wrapper" aria-hidden>
            <img v-if="info.cover" :src="info.cover" class="info-cover" />
            <div v-else class="info-cover-spacer" />
        </div>
        <div class="info-body">
            <div class="info-main">
                <div class="info-main-left">
                    <div class="info-header">
                        <h3 class="info-title">{{ info.name }}</h3>
                        <div v-if="!isMobile" class="info-divider" aria-hidden></div>
                        <span>{{ info.version }}</span>
                    </div>
                    <p class="info-desc" v-if="info.description">{{ info.description }}</p>
                </div>
                <div class="info-main-right">
                    <div class="authors-scroll">
                            <div class="author-item" v-for="(a, idx) in mergedAuthors" :key="idx">
                                <img v-if="a.avatar" :src="normalizeAvatar(a.avatar)" class="author-avatar" @click="openFirstSocial(a)" />
                                <div class="author-name" @click="openFirstSocial(a)">{{ a.name }}</div>
                                <div class="author-char" v-if="a.char">{{ a.char }}</div>
                            </div>
                        </div>
                </div>
            </div>
            <div class="gameversion">
                支持的游戏版本：
                <span v-for="(version, index) in info.gameversion" :key="index" class="version-badge">
                    {{ version }}
                </span>
            </div>
            <div class="tags">
                标签：
                <span v-for="(tag, index) in info.tags" :key="index" class="tag-badge" :style="tagStyle(tag)">
                    {{ tag }}
                </span>
            </div>
        </div>
    </div>
    <div class="info-card empty" v-else>无可用信息</div>
    <!-- show repo card under this component only on mobile -->
    <RepoCard v-if="isMobile && info.repo" :repo="info.repo" style="margin-top: 10px;" />
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import RepoCard from './RepoCard.vue';
import { useData } from "vitepress";
import { stringToBadgeColors } from "../../scripts/badgeColor";

const { frontmatter } = useData();

const info = computed(() => {
    return frontmatter.value || {};
});

// authors metadata loaded from public/authors.json
const authorsData = ref([])
onMounted(async () => {
    try {
        const raw = info.value.author || [];
        const list = Array.isArray(raw) ? raw : [raw];

        const promises = list.map(async orig => {
            // accept either string or object { name, char, avatarUrl, socialLinks }
            const name = typeof orig === 'string' ? orig : (orig.name || orig.authorName || '');
            const char = typeof orig === 'object' ? (orig.char || orig.c || '') : '';
            try {
                const res = await fetch(`/datapack-index/authors/${encodeURIComponent(name)}.json`);
                if (res.ok) {
                    const data = await res.json();
                    return {
                        name,
                        char: char || (orig && orig.char) || '',
                        avatar: '/datapack-index/' + data.avatar || (orig && (orig.avatarUrl || orig.avatar)) || '',
                        socialLinks: data.socialLinks || (orig && orig.socialLinks) || []
                    };
                }
            } catch (e) {
                // ignore fetch error and fall back to orig
            }
            // fallback to provided info if fetch failed
            return {
                name,
                char: char || (orig && orig.char) || '',
                avatar: (orig && (orig.avatarUrl || orig.avatar)) || '',
                socialLinks: (orig && orig.socialLinks) || []
            };
        });

        const results = await Promise.all(promises);
        authorsData.value = results.filter(Boolean);
    } catch (e) {
        // ignore
    }
});

const mergedAuthors = computed(() => {
    // authorsData is already an array of resolved author objects
    return (authorsData.value || []).map(item => item).filter(Boolean)
})

// 点击作者头像或名字时，打开该作者第一个 socialLinks 链接（如果存在）
function openFirstSocial(author){
    const url = author?.socialLinks?.[0]?.url
    if (url) window.open(url, '_blank')
}

function normalizeAvatar(av){
    if (!av) return ''
    if (av.startsWith('/')) return av
    return '/'+av.replace(/^\/+/, '')
}

const hasInfo = computed(() => Object.keys(info.value || {}).length > 0);

// mobile detection (match CSS breakpoint used earlier)
const isMobile = ref(false);
onMounted(() => {
    try {
        const mq = window.matchMedia('(max-width: 720px)');
        const update = () => { isMobile.value = !!mq.matches };
        update();
        if (mq.addEventListener) mq.addEventListener('change', update);
        else if (mq.addListener) mq.addListener(update);
    } catch (e) {
        // ignore
    }
});

function tagStyle(tag) {
    // hard-coded tag color map
    const colorSet = stringToBadgeColors(tag);
    return {
        background: colorSet.background,
        border: `1px solid ${colorSet.border}`,
        color: colorSet.text,
        padding: '4px 8px',
        'border-radius': '999px',
        'font-size': '12px',
        'min-width': '36px',
        'line-height': '16px',
        'text-align': 'center',
    };
}
</script>

<style scoped>
.info-card {
    display: flex;
    align-items: flex-start;
    padding: 16px;
    border-bottom: 2px #ebebeb solid;
    background: var(--vp-c-bg, #fff);
}

.info-cover {
    width: 84px;
    height: 84px;
    object-fit: cover;
    border-radius: 6px;
    margin-right: 30px;
}

.info-cover-wrapper {
    width: 84px;
    height: 84px;
    margin-right: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.info-cover-spacer {
    width: 84px;
    height: 84px;
    border-radius: 6px;
    background: linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.04));
    border: 1px dashed rgba(0,0,0,0.04);
}

.info-body {
    flex: 1;
}

.info-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background: linear-gradient(90deg, #fefeff 0%, #ffffff 60%);
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    will-change: transform, opacity;
    animation: popIn 320ms cubic-bezier(0.4, 0, 0.2, 1);
}

.info-main-left{ 
    flex-basis: 2;
    flex-grow: 2;
}

.info-main-right{ 
    flex-basis: 1;
    max-width: 300px;
}

.info-header {
    display: flex;
    align-items: center;
    gap: 8px;
}

.info-title {
    margin: 0 0 6px 0;
    font-size: 20px;
}

.info-divider {
    width: 1px;
    height: 18px;
    background: rgba(16, 24, 40, 0.06);
    border-radius: 1px;
}

.info-desc {
    color: var(--vp-c-text tertiary, #666);
}

.info-meta {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 0.95rem;
}

.info-meta li {
    margin: 0;
}

.empty {
    color: var(--vp-c-text-muted, #999);
    text-align: center;
}

.gameversion {
    display: flex;
    gap: 8px;
    margin-top: 2px;
    align-items: center;
    font-size: smaller;
}

.version-badge {
    background: rgba(30, 144, 255, 0.06);
    border: 1px solid rgba(30, 144, 255, 0.18);
    color: #1e90ff;
    padding: 3px 8px;
    border-radius: 999px;
    font-size: 12px;
    box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.02);
    line-height: 16px;
}

.tags {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 10px;
    font-size: smaller;
}

.authors-scroll{
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    display: flex;
    gap: 40px;
    align-items: center;
    padding-bottom: 6px;
    max-width: 300px;
    margin-right: 48px;
}

.authors-scroll .author-item {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.author-avatar {
    width: 48px;
    height: 48px;
    border-radius: 999px;
    object-fit: cover;
    box-shadow: 0 1px 6px rgba(16, 24, 40, 0.08);
    cursor: pointer;
}

.author-name {
    font-size: 12px;
    color: var(--vp-c-text, #111);
    text-align: center
    ;cursor: pointer
}

.author-char {
    font-size: 11px;
    color: var(--vp-c-text-muted, #888);
    text-align: center
}

/* popover removed: replaced by direct click navigation */

.authors-scroll::-webkit-scrollbar {
    height: 8px
}

.authors-scroll::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.12);
    border-radius: 999px
}

/* Responsive: mobile adaptations without changing original desktop styles */
@media (max-width: 720px) {
    /* keep horizontal layout: cover on left, title/version/desc on right */
    .info-card {
        padding: 12px;
    }

    .info-cover-wrapper {
        width: 72px;
        height: 72px;
        margin-right: 12px;
        margin-bottom: 0;
    }

    .info-cover,
    .info-cover-spacer {
        width: 72px;
        height: 72px;
        margin-right: 0;
    }

    .info-main {
        /* remain row so header + desc sit to the right of image */
        flex-direction: row;
        align-items: flex-start;
        gap: 12px;
    }

    .info-main-left {
        flex-basis: auto;
        flex-grow: 1;
        min-width: 0; /* allow children to truncate properly */
    }

    .info-main-right {
        flex-basis: auto;
        max-width: none;
        width: auto;
        margin-right: 0;
        margin-top: 0;
        display: flex;
        justify-content: flex-start;
    }

    .authors-scroll {
        max-width: 100%;
        gap: 18px;
        margin-right: 0;
        padding-bottom: 4px;
    }

    .author-avatar {
        width: 40px;
        height: 40px;
    }

    .author-name {
        font-size: 12px;
        max-width: 72px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .info-title {
        font-size: 18px;
    }

    .info-desc {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
    }

    .info-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0px;
    }

    .gameversion,
    .tags {
        flex-wrap: wrap;
        gap: 6px;
        font-size: 12px;
    }

    .version-badge,
    .tag-badge {
        font-size: 11px;
        padding: 3px 6px;
    }
}

@media (max-width: 420px) {
    .info-cover-wrapper,
    .info-cover,
    .info-cover-spacer {
        width: 56px;
        height: 56px;
    }

    .author-avatar {
        width: 36px;
        height: 36px;
    }

    .authors-scroll {
        gap: 12px;
    }

    .info-title {
        font-size: 16px;
    }
}

.card {
    padding: 8px;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    background: #fff;
    color: #111;
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
    width: 100%;
    margin-bottom: 18px;
}

.actions-card {
    padding: 12px;
}

.actions {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    gap: 8px;
}

.action {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 8px;
    text-decoration: none;
    border: 1px solid rgba(16,24,40,0.04);
}

.action .icon { width: 16px; height: 16px; display: inline-block; color: #374151 }


.edit-btn span, .back-btn span { font-weight: 500; font-size: 0.95rem }

/* Dark mode 支持 (参考 RepoCard) */
.dark .info-card {
    background: linear-gradient(180deg, #1b1b1f 0%, #1c1c20 60%);
    border-bottom-color: #313131;
    color: #dfdfd6;
}

.dark .info-cover-spacer {
    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.03));
    border: 1px dashed rgba(255,255,255,0.04);
}

.dark .info-main {
    background: transparent;
}

.dark .info-title {
    color: #ffffff;
}

.dark .info-divider {
    background: rgba(255, 255, 255, 0.04);
}

.dark .info-desc {
    color: #dfdfd6;
}

.dark .version-badge {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #dfdfd6;
}

.dark .tag-badge {
    background: rgba(255,255,255,0.02);
    color: #e6e6e6;
    border-color: rgba(255,255,255,0.06);
}

.dark .author-avatar {
    box-shadow: none;
}

.dark .author-name {
    color: #dfdfd6;
}

.dark .author-char {
    color: #c0c0b9;
}

.dark .authors-scroll::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.06);
}

.dark .card {
    background: linear-gradient(180deg, #1b1b1f 0%, #1c1c20 60%);
    color: #dfdfd6;
}

.dark .action {
    border: 1px solid rgba(255,255,255,0.04);
}

.dark .action .icon {
    color: #e4e4e4;
}
</style>
