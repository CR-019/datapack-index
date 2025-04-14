<template>
    <div class="article-container">
        <!-- 顶部粗横线 -->
        <div class="color-line thick">
            <div></div>
        </div>

        <!-- 文章标题 -->
        <h1 class="article-title">{{ title }}</h1>

        <!-- 新增资源链接 -->
        <div class="resource-link">
            <a :href="resourceLink" target="_blank" rel="noopener">
                {{ resourceLink }}
            </a>
        </div>

        <!-- 作者信息和摘要 -->
        <div class="content-wrapper">
            <!-- 左侧作者信息 -->
            <div class="author-info">
                <img :src="avatarUrl" :alt="authorName" class="avatar" />
                <div class="author-details">
                    <h3 class="author-name">{{ authorName }}</h3>
                    <div class="social-links">
                        <a v-for="(link, index) in socialLinks" :key="index" :href="link.url" class="link"
                            target="_blank">
                            {{ link.name }}
                        </a>
                    </div>
                </div>
            </div>

        </div>

        <!-- 底部细横线 -->
        <div class="color-line thin">
            <div></div>
        </div>
    </div>
</template>

<script>
export default {
    name: "FeatureHead",
    props: {
        title: {
            type: String,
            default: "芝士标题",
        },
        authorName: {
            type: String,
            default: "是名字",
        },
        avatarUrl: {
            type: String,
            default: "https://via.placeholder.com/50",
        },
        socialLinks: {
            type: Array,
            default: () => [
                { name: "GitHub", url: "https://github.com" },
                { name: "B站", url: "https://weibo.com" }
            ]
        },
        abstractText: {
            type: String,
            default: "让我简单喵两句",
        },
        resourceLink: {
            type: String,
            default: "https://example.com/resource",
        }
    },
};
</script>

<style scoped>
.article-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.color-line {
    display: flex;
    height: 4px;
    margin: 20px 0;
}

.color-line.thick {
    height: 4px;
}

.color-line.thin {
    height: 2px;
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

.resource-link {
  text-align: center;
  margin: -10px 0 20px 0; /* 上负边距拉近与标题的距离 */
  font-size: 0.9rem;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.resource-link a {
  color: #666;
  text-decoration: none;
  border-bottom: 1px dotted #999;
}

.resource-link a:hover {
  color: #694ec6;
  opacity: 1;
  border-bottom-style: solid;
}

.article-title {
    text-align: center;
    margin: 30px 0;
    color: #333;
}

.content-wrapper {
    display: flex;
    gap: 10px;
    margin: 20px 0;
}

.author-info {
    flex: 0 0 37%;
    display: flex;
    gap: 30px;
}

.avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
}

.author-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.author-name {
    margin: 0;
    font-size: 1rem;
    font-style: italic;
    font-weight: 500;
}

.social-links {
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

.divider-vertical {
    width: 1px;
    background: #ddd;
    margin: 10px 0;
}

.abstract {
    flex: 1;
    padding-left: 20px;
}

.abstract-title {
    margin: 0 0 15px 0;
    color: #333;
    font-size: 1.1rem;
}

.abstract-content {
    margin: 0;
    color: #666;
    line-height: 1.6;
    font-size: 0.95rem;
}
</style>
