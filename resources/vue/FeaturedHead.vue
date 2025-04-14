<template>
    <div class="article-container">
        <!--头图-->
        <div class="header-image-wrapper">
            <img
                :src="cover"
                alt="是封面"
                class="header-image"
            >
            <div class="gradient-overlay"></div>
        </div>

        <!-- 顶部粗横线 -->
        <div class="featured-color-line">
            <div class="color-segment orange"></div>
            <div class="image-container">
                <img src="/public/feature/command_block_front.png" class="base-image" alt="">
                <img src="/public/feature/title.png" class="overlay-image" alt="">
            </div>
            <div class="color-segment purple"></div>
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
        <div class="color-line">
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
        },
        cover: {
            type: String,
            default: ""
        }
    },
};
</script>

<style scoped>
.header-container {
  max-width: 800px;
  margin: 0 auto;
}

.header-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 37%; 
  overflow: hidden;
  border-radius: 4px 4px 0 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.header-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  overflow: hidden;
}

.header-image:hover {
  transform: scale(1.03);
}

.header-image-wrapper:hover .gradient-overlay{
  opacity: 0.1;
}

.gradient-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%);
  transition: opacity 0.3s ease;
  pointer-events: none; 
}

.article-container {
    max-width: 800px;
    padding: 20px;
}

.featured-color-line {
  display: flex;
  height: 8px;
}

.color-segment {
  flex: 1;
}

.orange {
  background: #c47c4e;
}

.purple {
  background: #694ec6;
}

.image-container {
  flex: 1;
  position: relative;
  background: #74b096;
  height: 100%;
}

.base-image {
  position: absolute;
  width: 37%;
  height: auto;
  aspect-ratio: 1/1;
  object-fit: contain;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -90%) rotate(45deg);
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.overlay-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -75%);
  max-width: 100%;
  z-index: 1;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.color-line {
  display: flex;
  margin: 20px 0;
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
