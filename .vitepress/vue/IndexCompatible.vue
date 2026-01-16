<template>
    <article class="article-card" :class="{ 'has-background': hasBackground }" :style="backgroundStyle">
        <!-- 背景层 -->
        <div v-if="hasBackground" class="background-layer">
            <img :src="background" alt="" class="background-image" @error="handleBgError" />
        </div>

        <!-- 内容层 -->
        <div class="content-layer">
            <!-- 顶部装饰线 -->
            <div class="color-line">
                <div></div>
            </div>
            <!-- 内容主体 -->
            <div class="content-wrapper">
                <!-- 左侧元信息 (在宽屏下为左侧，窄屏下为顶部) -->
                <div class="meta-section">
                    <!-- 主作者信息块 -->
                    <div class="author-container">
                        <div class="author-info">
                            <!-- 将头像和名字一起包裹在链接中 -->
                            <a v-if="mainAuthor && mainAuthor.socialLinks && mainAuthor.socialLinks.length > 0"
                                :href="mainAuthor.socialLinks[0].url" class="author-link" target="_blank">
                                <img :src="mainAuthor.avatar || ''" :alt="mainAuthor.name || ''"
                                    class="avatar" />
                                <div class="author-details">
                                    <h3 class="author-name">{{ mainAuthor.name }}</h3>
                                </div>
                            </a>
                            <!-- 如果没有社交链接，则不包裹链接 -->
                            <template v-else>
                                <img :src="(mainAuthor && mainAuthor.avatar) || ''"
                                    :alt="(mainAuthor && mainAuthor.name) || ''" class="avatar" />
                                <div class="author-details">
                                    <h3 class="author-name">{{ mainAuthor ? mainAuthor.name : authorName }}</h3>
                                </div>
                            </template>
                        </div>

                        <div class="social-links">
                            <a v-for="(link, index) in (mainAuthor && mainAuthor.socialLinks) || []" :key="index"
                                :href="link.url" class="link" target="_blank">
                                {{ link.name }}
                            </a>
                        </div>
                    </div> <!-- /主作者信息块 -->

                    <!-- 额外作者信息块 -->
                    <template v-if="extraAuthorsInfo && extraAuthorsInfo.length">
                        <div v-for="(extraAuthor, index) in extraAuthorsInfo" :key="index" class="author-container">
                            <div class="author-info">
                                <!-- 为额外作者的头像和名字添加链接 -->
                                <a v-if="extraAuthor && extraAuthor.socialLinks && extraAuthor.socialLinks.length > 0"
                                    :href="extraAuthor.socialLinks[0].url" class="author-link" target="_blank">
                                    <img :src="extraAuthor.avatar || ''" :alt="extraAuthor.name || ''"
                                        class="avatar" />
                                    <div class="author-details">
                                        <h4 class="extra-author-name">{{ extraAuthor.name }}</h4>
                                    </div>
                                </a>
                                <!-- 如果额外作者没有社交链接，则不包裹链接 -->
                                <template v-else>
                                    <img :src="(extraAuthor && extraAuthor.avatar) || ''"
                                        :alt="(extraAuthor && extraAuthor.name) || ''" class="avatar" />
                                    <div class="author-details">
                                        <h4 class="extra-author-name">{{ extraAuthor ? extraAuthor.name : '' }}
                                        </h4>
                                    </div>
                                </template>
                            </div>
                            <div class="social-links">
                                <a v-for="(link, linkIndex) in (extraAuthor && extraAuthor.socialLinks) || []"
                                    :key="linkIndex" :href="link.url" class="link" target="_blank">
                                    {{ link.name }}
                                </a>
                            </div>
                        </div> <!-- /额外作者信息块 -->
                    </template>
                </div> <!-- /左侧元信息 -->

                <!-- 新增竖线分隔 (仅在宽屏显示) -->
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
        // 新增：额外作者列表
        extraAuthors: {
            type: Array,
            default: () => [],
        },
        background: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            bgLoadError: false,
            mainAuthor: null,
            extraAuthorsInfo: [],
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
        }
    },
    // 使用 Vue Options API 的 mounted 钩子来执行异步加载
    async mounted() {
        // 获取主要作者（如果存在）
        const mainRes = await fetch(`/datapack-index/authors/${this.authorName}.json`);
        if (mainRes && mainRes.ok) {
            this.mainAuthor = await mainRes.json();
            this.mainAuthor.avatar = '/datapack-index' + this.mainAuthor.avatar
        }
        // 获取额外作者信息：支持传入字符串（name）或对象（包含 authorName/avatarUrl/socialLinks）
        for (const extra of this.extraAuthors || []) {
            if (!extra) continue;
            if (typeof extra === 'string') {
                const r = await fetch(`/datapack-index/authors/${extra}.json`);
                if (r && r.ok) {
                    const data = await r.json();
                    this.extraAuthorsInfo.push({
                        name: extra,
                        avatar: '/datapack-index' + data.avatar,
                        socialLinks: data.socialLinks || []
                    });
                }
            } else if (extra.authorName) {
                // 如果 extra 已包含 avatarUrl 或 socialLinks，直接使用；否则尝试从单文件作者目录加载
                if (extra.avatarUrl || (extra.socialLinks && extra.socialLinks.length)) {
                    this.extraAuthorsInfo.push({
                        name: extra.authorName,
                        avatar: '/datapack-index' + extra.avatarUrl,
                        socialLinks: extra.socialLinks || []
                    });
                } else {
                    const r = await fetch(`/datapack-index/authors/${extra.authorName}.json`);
                    if (r && r.ok) {
                        const data = await r.json();
                        this.extraAuthorsInfo.push({
                            name: extra.authorName,
                            avatar: '/datapack-index' + data.avatar,
                            socialLinks: data.socialLinks || []
                        });
                    }
                }
            }
        }
    }
};
</script>

<style scoped>
.article-card {
    border-radius: 12px;
    position: relative;
    background: var(--vp-c-bg-soft);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    display: flex;
    /* 移除固定 min-height，让卡片高度由内容决定 */
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
    width: 100%;
    /* 确保内容层占满 */
}

.article-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.color-line {
    display: flex;
    height: 5px;
    width: 100%;
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
    /* 使用 align-items: stretch 使左右两侧等高 */
    align-items: stretch;
    width: 100%;
    /* 确保内容包装器占满可用空间 */
}

.has-background .content-wrapper {
    margin-top: 2.5rem;
    background: rgba(255, 255, 255, 0.7);
}

.dark .content-wrapper {
    background: rgba(0, 0, 0, 0.3);
}

/* 左侧元信息区域 */
.meta-section {
    min-width: 25%;
    /* 使用 flex-direction: column 来垂直排列作者块 */
    display: flex;
    flex-direction: column;
    /* 移除 gap，改用伪元素实现分隔 */
    /* gap: 1rem;  */
}

/* 新增：作者块容器 */
.author-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    /* 宽屏下左对齐 */
    gap: 0.5rem;
    /* 控制头像名字和社交链接之间的间距 */
}

/* 宽屏下，作者块之间添加水平分隔线 */
.author-container:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-bottom: 1rem;
    margin-bottom: 1rem;
}

.dark .author-container:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}


/* 作者信息块 (主作者和额外作者) */
.author-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

/* 包裹头像和名字的链接样式 */
.author-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    text-decoration: none;
    /* 移除默认下划线 */
    color: inherit;
    /* 继承父级颜色 */
    border-radius: 50px;
    /* 圆角效果 */
    padding: 5px;
    /* 内边距 */
    transition: background-color 0.2s ease;
    /* 背景过渡效果 */
}

.author-link:hover .author-name {
    color: #0550ae;
}

.avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--vp-c-brand-light);
    flex-shrink: 0;
    /* 防止头像被压缩 */
    /* 移除头像自身的边框，由父级 a 标签提供视觉效果 */
    /* border: none; */
}

.author-details {
    line-height: 1.4;
    flex-grow: 1;
    /* 让名字占据剩余空间 */
}

.author-name,
.extra-author-name {
    font-size: 0.95rem;
    font-weight: 600;
    margin: 0;
    color: var(--vp-c-text-1);
    /* 移除名字的悬停效果，因为整个链接区域会处理悬停 */
}

.extra-author-name {
    font-size: 0.9rem;
    font-weight: 500;
}

/* 社交链接 */
.social-links {
    /* 在宽屏下，链接缩进与头像对齐 */
    margin-left: calc(48px + 1rem);
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.link {
    color: #666;
    text-decoration: none;
    font-size: 0.9rem;
    white-space: nowrap;
}

.link:hover {
    color: #333;
}


/* 竖线分隔 (仅宽屏) */
.vertical-divider {
    width: 1px;
    background: rgba(0, 0, 0, 0.2);
    height: auto;
    /* 适应父容器高度 */
    margin: 0;
    /* 确保没有额外的 margin 影响布局 */
}

/* 右侧内容区域 */
.content-section {
    /* 关键修改：flex 设置为 1，占据剩余空间 */
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    /* 防止溢出 */
    /* 确保内容部分从顶部开始 */
    align-items: flex-start;
}

.article-title {
    font-size: 1.25rem;
    margin: 0 0 1rem;
    flex-shrink: 0;
    /* 标题不被压缩 */
    /* 确保标题文本左对齐 */
    text-align: left;
    width: 100%;
}

.article-title a {
    color: inherit;
    text-decoration: none;
    font-weight: 600;
    /* 链接内容左对齐 */
    display: block;
}

.article-title a:hover {
    color: var(--vp-c-brand);
}

.article-abstract-wrapper {
    flex: 1;
    /* 占据剩余空间 */
    overflow-y: auto;
    min-height: calc(1.6em * 3);
    /* 最小高度 */
    /* 移除 max-height，让高度由内容决定 */
    scroll-behavior: smooth;
    width: 100%;
    /* 占满父容器宽度 */
    /* 确保文本左对齐 */
    text-align: left;
}

.article-abstract {
    color: var(--vp-c-text-1);
    margin: 0;
    white-space: pre-wrap;
    /* 确保段落文本左对齐 */
    text-align: left;
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

/* 响应式设计 - 窄屏 (手机) */
@media (max-width: 768px) {
    .article-card {
        flex-direction: column;
        min-height: auto;
    }

    .content-wrapper {
        flex-direction: column;
        padding: 15px;
        align-items: stretch;
        /* 确保子项宽度一致 */
    }

    /* 修改点：在窄屏下，元信息区域变为水平排列作者块 */
    .meta-section {
        /* 确保自己是 flex 容器 */
        display: flex !important;
        /* 改为水平排列，并允许换行 */
        flex-direction: row !important;
        flex-wrap: wrap;
        justify-content: center;
        /* 水平居中 */
        align-items: flex-start;
        /* 顶部对齐作者块 */


        /* 原有样式 */
        flex: 0 0 auto;
        margin-bottom: 0rem;
        width: 100%;
    }

    /* 修改点：每个作者块在窄屏下居中其内部内容 */
    .author-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        /* 窄屏下，作者块内部内容居中 */
        text-align: center;
        gap: 0.5rem;
        flex: 0 1 auto;
        /* 宽度由内容决定，允许收缩 */
        min-width: min-content;
        /* 防止被过度压缩 */
        /* 移除宽屏下的分隔线和间距 */
        border-bottom: none !important;
        padding-bottom: 0 !important;
        margin-bottom: 0 !important;
        /* --- 新增/修改的窄屏分隔和间距逻辑 --- */
        /* 除了最后一个，都添加右边框（模拟竖线） */
        /* border-right: 1px solid rgba(0, 0, 0, 0.2); */
        /* 除了最后一个，都添加右边距 */
        margin-right: 1rem;
        /* --- */
    }

    /* 修改点：给除了第一个之外的作者块添加左边距，使竖线看起来居中 */
    .author-container+.author-container {
        margin-left: 1rem;
        /* 1rem 间距的另一半 */
    }

    /* 修改点：为除了最后一个之外的作者块添加自定义竖线 */
    .author-container:not(:last-child) {
        position: relative;
    }

    .author-container:not(:last-child)::after {
        content: "";
        position: absolute;
        top: 50%;
        right: -1rem;
        /* 定位在右边距的中间 */
        transform: translateY(-50%);
        height: 4rem;
        /* 线条高度 */
        width: 1px;
        /* 线条宽度 */
        background-color: rgba(0, 0, 0, 0.2);
        /* 线条颜色 */
    }

    .dark .author-container:not(:last-child)::after {
        background-color: rgba(255, 255, 255, 0.2);
    }

    /* 修改点：移除最后一个作者块的右边距，避免溢出 */
    .author-container:last-child {
        margin-right: 0;
    }

    /* 窄屏下，社交链接不再缩进，而是居中 */
    .social-links {
        margin-left: 1.5rem;
        justify-content: left;
        width: 100%;
    }

    /* 窄屏下隐藏竖线 */
    .vertical-divider {
        display: none;
    }


    /* 窄屏下内容区域居中 */
    .content-section {
        text-align: center;
        align-items: center;
        /* 内容也居中 */
        /* 添加顶部间距，因为移除了 meta-section 的 margin-bottom */
        margin-top: 1rem;
    }

    .article-title {
        font-size: 1rem;
        text-align: center;
        /* 标题居中 */
    }

    .article-title a {
        display: inline;
        /* 链接行为调整以适应居中 */
    }

    .article-abstract-wrapper {
        max-height: none;
        text-align: center;
        /* 摘要居中 */
    }

    .article-abstract {
        text-align: center;
        /* 段落文本居中 */
    }
}
</style>
