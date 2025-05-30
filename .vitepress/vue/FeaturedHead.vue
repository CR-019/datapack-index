<template>
    <div class="article-container">
        <!--头图，仅当cover不是false时显示-->
        <div v-if="cover !== false" class="header-image-wrapper">
            <img :src="cover" alt="是封面" class="header-image">
            <div class="gradient-overlay"></div>
        </div>
        <div v-else class="spacer"></div>
        <!-- 顶部粗横线 -->
        <div class="featured-color-line">
            <div class="color-segment orange"></div>
            <div class="image-container">
                <img src="/feature/cover/command_block_front.png" class="base-image" alt="">
                <img src="/feature/cover/featured.png" class="overlay-image" alt="">
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
                <div class="avatar-wrapper">
                    <img :src="avatarUrl" :alt="authorName" class="avatar" @error="handleAvatarError"/>
                    <div v-if="avatarLoading" class="loading-indicator"></div>
                </div>
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
    data() {
        return {
            hasError: false, // 用于判断图片加载失败
            avatarLoading: false,
            avatarError: false,
            //avatarUrl: "https://via.placeholder.com/50",
        };
    },
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
        authorBiliID: {
            type: String,
            default: "",
        },
        socialLinks: {
            type: Array,
            default: () => [
                { name: "GitHub", url: "https://github.com" },
                { name: "BiliBili", url: "https://weibo.com" }
            ]
        },
        avatarUrl: {
            type: String,
            default: "https://via.placeholder.com/50",
        },
        abstractText: {
            type: String,
            default: "让我简单喵两句",
        },
        resourceLink: {
            type: String
        },
        cover: {
            type: [String,Boolean],
            default: false
        }
    },
    mounted(){
        //this.fetchAvatar();
    },
    methods: {
        async fetchAvatar(){
            this.avatarLoading = true;
            try{
                const response = await fetch(`/api/bilibili/user/${this.authorBiliID}`);
                const data = await response.json();
                if(data?.face){
                    this.avatarUrl = data.face + "@100w_100h.jpg";
                }
            }catch(error){
                console.error("获取头像失败", error);
                this.avatarError = true;
            } finally {
                this.avatarLoading = false;
            }
        },
        handleAvatarError() {
            this.avatarError = true;
            this.avatarUrl = "https://via.placeholder.com/50"; // 设置默认头像
        }
    }
};
</script>

<style scoped>
.spacer {
  flex: 1;
  height: 30px;
  position: relative;
}

.header-container {
  max-width: 800px;
  margin: 0 auto;
}

.header-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 30%;
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
  background: linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%);
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
  flex: 0 0 20%;
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
  width: 20%;
  height: auto;
  aspect-ratio: 1/1;
  object-fit: contain;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -80%) rotate(45deg);
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.overlay-image {
  position: absolute;
  width: 70%;
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

.dark .article-title {
    color: #ccc;
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

.avatar-wrapper {
  position: relative;
  width: 50px;
  height: 50px;
}

.avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
}


.loading-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 0.3; }
  100% { opacity: 0.6; }
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

@media (max-width: 768px) {
  .header-image-wrapper {
    padding-top: 50%; /* 调整为更适合手机端的宽高比 */
  }

  .article-container {
    padding: 10px; /* 减少边距以适应小屏幕 */
  }

  .featured-color-line {
    height: 6px; /* 缩小顶部横线高度 */
  }

  .image-container {
    height: 80%; /* 调整高度以适应小屏幕 */
  }

  .base-image {
    width: 15%; /* 缩小基础图片尺寸 */
  }

  .overlay-image {
    width: 60%; /* 缩小覆盖图片尺寸 */
  }

  .article-title {
    font-size: 1.2rem; /* 调整标题字体大小 */
    margin: 20px 0; /* 减少标题的上下边距 */
  }

  .resource-link {
    font-size: 0.8rem; /* 调整资源链接字体大小 */
  }

  .content-wrapper {
    flex-direction: column; /* 改为纵向布局 */
    gap: 15px; /* 增加间距 */
  }

  .author-info {
    flex: 1; /* 占满宽度 */
    gap: 15px; /* 减少间距 */
  }

  .avatar-wrapper {
    width: 40px; /* 缩小头像尺寸 */
    height: 40px;
  }

  .avatar {
    width: 40px;
    height: 40px;
  }

  .author-name {
    font-size: 0.9rem; /* 缩小作者名字字体 */
  }

  .social-links {
    gap: 5px; /* 减少社交链接间距 */
  }

  .abstract {
    padding-left: 0; /* 移除左边距 */
  }

  .abstract-title {
    font-size: 1rem; /* 缩小摘要标题字体 */
  }

  .abstract-content {
    font-size: 0.85rem; /* 缩小摘要内容字体 */
  }
}
</style>
