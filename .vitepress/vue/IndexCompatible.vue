<template>
    <article class="article-card" :class="{ 'has-background': hasBackground }" :style="backgroundStyle">
        <!-- 背景层 -->
        <div v-if="hasBackground" class="background-layer">
            <img :src="background" alt="" class="background-image" @error="handleBgError" />
        </div>

        <!--内容层-->
        <div class="content-layer">
            <!-- 顶部装饰线 -->
            <div class="color-line">
                <div></div>
            </div>
            <!-- 内容主体 -->
            <div class="content-wrapper">
                <!-- 左侧元信息 -->
                <div class="meta-section">
                    <div class="author-info">
                        <img :src="avatarUrl" :alt="authorName" class="avatar" />
                        <div class="author-details">
                            <h3 class="author-name">{{ authorName }}</h3>
                        </div>
                    </div>

                    <div class="social-links">
                        <a v-for="(link, index) in socialLinks" :key="index" :href="link.url" class="link"
                            target="_blank">
                            {{ link.name }}
                        </a>
                    </div>
                </div>

                <!-- 新增竖线分隔 -->
                <div class="vertical-divider"></div>

                <!-- 右侧内容 -->
                <div class="content-section">
                    <h3 class="article-title">
                        <a :href="url">{{ title }}</a>
                    </h3>
                    <div class="article-abstract-wrapper">
                        <p class="article-abstract">{{ abstract }}</p>
                    </div>
                </div>
            </div>
        </div>
    </article>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        abstract: {
            type: String,
            required: true,
        },
        authorName: {
            type: String,
            required: true,
        },
        avatarUrl: {
            type: String,
            required: true,
        },
        socialLinks: {
            type: Array,
            default: () => [
                { name: "GitHub", url: "https://github.com" },
                { name: "BiliBili", url: "https://weibo.com" },
            ],
        },
        background: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            bgLoadError: false,
        };
    },
    computed: {
        hasBackground() {
            return this.background && !this.bgLoadError;
        },
        backgroundStyle() {
            return this.hasBackground
                ? { position: "relative", overflow: "hidden" }
                : {};
        },
    },
    methods: {
        handleBgError() {
            this.bgLoadError = true;
        },
    },
};
</script>

<style scoped>
.article-card {
    border-radius: 12px;
    position: relative;
    background: var(--vp-c-bg-soft);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: flex;
    min-height: 200px;
    margin-top: 40px;
    margin-bottom: 40px;
}

.background-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.background-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(2px) brightness(1.1);
    opacity: 0.6;
}

.dark .background-image {
    filter: blur(2px) brightness(0.5);
}

.content-layer {
    position: relative;
    z-index: 1;
    border-radius: 12px;
    overflow: hidden;
    min-width: 0;
}

.article-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.color-line {
    display: flex;
    height: 5px;
}

.color-line::before,
.color-line::after,
.color-line>div {
    content: "";
    flex: 1;
}

.color-line::before {
    background: #c47c4e;
}

.color-line>div {
    background: #74b096;
}

.color-line::after {
    background: #694ec6;
}

.content-wrapper {
    display: flex;
    gap: 2rem;
    padding: 20px;
    border-radius: 12px;
}

.has-background .content-wrapper {
  margin-top: 2.5rem;
  background: rgba(255, 255, 255, 0.7);
}

.dark .content-wrapper {
  margin-top: 2.5rem;
  background: rgba(0, 0, 0, 0.3);
}

.meta-section {
  flex: 0 0 28%;
  min-width: 0;
}

.author-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--vp-c-brand-light);
}

.author-details {
    line-height: 1.4;
}

.author-name {
    font-size: 0.95rem;
    font-weight: 600;
    margin: 0;
    color: var(--vp-c-text-1);
}

.social-links {
    margin-left: 10px;
    display: flex;
    gap: 10px;
}

.link {
    color: #666;
    text-decoration: none;
    font-size: 0.9rem;
}

.link:hover {
    color: #333;
}

.vertical-divider {
    width: 1px;
    background: rgba(0, 0, 0, 0.2);
    align-self: stretch;
    position: relative;
}

.content-wrapper {
    flex: 1;
    display: flex;
}

.article-title {
    font-size: 1.25rem;
    margin: 0 0 1rem;
}

.article-title a {
    color: inherit;
    text-decoration: none;
    font-weight: 600;
}

.article-title a:hover {
    color: var(--vp-c-brand);
}

.article-abstract-wrapper {
    flex: 1;
    overflow-y: auto;

    min-height: calc(1.6em * 3);
    max-height: var(--max-height, 200px);

    scroll-behavior: smooth;
}

.article-abstract {
    color: var(--vp-c-text-1);
    margin: 0;
    white-space: pre-wrap;
}

.article-abstract-wrapper::-webkit-scrollbar {
    width: 6px;
}

.article-abstract-wrapper::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
}

.article-abstract-wrapper::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
}

@media (max-width: 768px) {
    .article-card {
        flex-direction: column;
        min-height: auto;
    }

    .content-wrapper {
        flex-direction: column;
        gap: 1rem;
        padding: 15px;
    }

    .meta-section {
        flex: 0 0 auto;
        margin-bottom: 1rem;
        text-align: center;
    }

    .author-info {
        justify-content: center;
    }

    .vertical-divider {
        display: none;
    }

    .content-section {
        text-align: center;
    }

    .article-title {
        font-size: 1rem;
    }

    .article-abstract-wrapper {
        max-height: none;
    }
}
</style>
