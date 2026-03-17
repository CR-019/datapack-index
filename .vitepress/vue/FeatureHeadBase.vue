<template>
  <div class="article-container">
    <!-- 头图，仅当 cover 不是 false 时显示 -->
    <div v-if="cover !== false" class="header-image-wrapper">
      <img :src="cover" alt="是封面" class="header-image" />
      <div class="gradient-overlay"></div>
    </div>
    <div v-else class="spacer"></div>

    <!-- 顶部横线区域 - 使用插槽 -->
    <slot name="top-line">
      <!-- 默认的彩色横线 -->
      <div class="color-line thick">
        <div></div>
      </div>
    </slot>

    <!-- 文章标题 -->
    <h1 class="article-title">{{ title }}</h1>

    <!-- 新增资源链接 -->
    <div class="resource-link" v-if="resourceLink">
      <a :href="resourceLink" target="_blank" rel="noopener">
        {{ resourceLink }}
      </a>
    </div>

    <!-- 作者信息和摘要 -->
    <div class="content-wrapper">
      <!-- 主作者信息 -->
      <div 
        class="author-info primary-author" 
        @mouseenter="hoveredAuthorIndex = 0" 
        @mouseleave="hoveredAuthorIndex = -1"
      >
        <div class="avatar-wrapper">
          <a v-if="firstSocialLink" :href="firstSocialLink.url" class="avatar-link" target="_blank">
            <img 
              :src="(mainAuthor && mainAuthor.avatar) || avatarUrl" 
              :alt="authorName" 
              class="avatar" 
              @error="handleAvatarError"
              @mouseenter="highlightFirstSocialLink = true"
              @mouseleave="highlightFirstSocialLink = false"
            />
          </a>
          <img 
            v-else 
            :src="(mainAuthor && mainAuthor.avatar) || avatarUrl" 
            :alt="authorName" 
            class="avatar" 
            @error="handleAvatarError"
            @mouseenter="highlightFirstSocialLink = true"
            @mouseleave="highlightFirstSocialLink = false"
          />
          <div v-if="avatarLoading" class="loading-indicator"></div>
        </div>
        <div class="author-details">
          <a 
            v-if="firstSocialLink" 
            :href="firstSocialLink.url" 
            class="author-name-link" 
            target="_blank"
            @mouseenter="highlightFirstSocialLink = true"
            @mouseleave="highlightFirstSocialLink = false"
          >
            <h3 class="author-name">{{ mainAuthor ? mainAuthor.name : authorName }}</h3>
          </a>
          <h3 
            v-else 
            class="author-name"
            @mouseenter="highlightFirstSocialLink = true"
            @mouseleave="highlightFirstSocialLink = false"
          >
            {{ mainAuthor ? mainAuthor.name : authorName }}
          </h3>
          <div class="social-links">
            <a 
              v-for="(link, index) in (mainAuthor && mainAuthor.socialLinks) || socialLinks || []" 
              :key="index" 
              :href="link.url" 
              class="link"
              :class="{ 'highlight': (index === 0 && highlightFirstSocialLink) || hoveredSocialLink === index }"
              @mouseenter="hoveredSocialLink = index"
              @mouseleave="hoveredSocialLink = -1"
              target="_blank"
            >
              {{ link.name }}
            </a>
          </div>
        </div>
      </div>

      <!-- 额外作者列表 -->
      <div v-if="extraAuthorsInfo && extraAuthorsInfo.length > 0" class="extra-authors">
        <div 
          v-for="(author, index) in extraAuthorsInfo" 
          :key="index" 
          class="extra-author-wrapper"
        >
          <div class="vertical-divider"></div>
          <div 
            class="author-info extra-author"
            @mouseenter="hoveredAuthorIndex = index + 1" 
            @mouseleave="hoveredAuthorIndex = -1"
          >
            <div class="avatar-wrapper">
              <a 
                v-if="author.socialLinks && author.socialLinks[0]" 
                :href="author.socialLinks[0].url" 
                class="avatar-link" 
                target="_blank"
                @mouseenter="highlightSpecificFirstSocialLink(index)"
                @mouseleave="resetHighlightSpecific(index)"
              >
                <img 
                  :src="author.avatar || ''" 
                  :alt="author.name || ''" 
                  class="avatar"
                  @error="() => handleExtraAvatarError(index)"
                  @mouseenter="highlightSpecificFirstSocialLink(index)"
                  @mouseleave="resetHighlightSpecific(index)"
                />
              </a>
              <img 
                v-else 
                :src="author.avatar || ''" 
                :alt="author.name || ''" 
                class="avatar"
                @error="() => handleExtraAvatarError(index)"
                @mouseenter="highlightSpecificFirstSocialLink(index)"
                @mouseleave="resetHighlightSpecific(index)"
              />
            </div>
            <div class="author-details">
              <a 
                v-if="author.socialLinks && author.socialLinks[0]" 
                :href="author.socialLinks[0].url" 
                class="author-name-link"
                target="_blank"
                @mouseenter="highlightSpecificFirstSocialLink(index)"
                @mouseleave="resetHighlightSpecific(index)"
              >
                <h3 class="author-name">{{ author.name }}</h3>
              </a>
              <h3 
                v-else 
                class="author-name"
                @mouseenter="highlightSpecificFirstSocialLink(index)"
                @mouseleave="resetHighlightSpecific(index)"
              >
                {{ author.name }}
              </h3>
              <div class="social-links">
                <a 
                  v-for="(link, idx) in (author.socialLinks || [])" 
                  :key="idx" 
                  :href="link.url" 
                  class="link"
                  :class="{ 
                    'highlight': (idx === 0 && currentHighlightedIndex === index) || (hoveredSocialLink === idx && hoveredAuthorIndex === index + 1)
                  }"
                  @mouseenter="hoveredSocialLink = idx"
                  @mouseleave="hoveredSocialLink = -1"
                  target="_blank"
                >
                  {{ link.name }}
                </a>
              </div>
            </div>
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
  name: "ArticleHeaderBase",
  props: {
    title: {
      type: String,
      default: "芝士标题",
    },
    authorName: {
      type: String,
      default: "是名字",
    },
    abstractText: {
      type: String,
      default: "让我简单喵两句",
    },
    resourceLink: {
      type: String,
      default: "",
    },
    cover: {
      type: [String, Boolean],
      default: false,
    },
    // 新增：额外作者列表
    extraAuthors: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      avatarLoading: false,
      avatarError: false,
      extraAvatarErrors: [], // 记录每个额外作者头像是否出错
      mainAuthor: null,
      extraAuthorsInfo: [],
      hoveredAuthorIndex: -1, // 跟踪当前悬停的作者索引
      highlightFirstSocialLink: false, // 控制主作者第一个社媒链接高亮
      hoveredSocialLink: -1, // 控制具体哪个社媒链接被悬停
      currentHighlightedIndex: -1, // 控制当前高亮的额外作者索引
    };
  },
  computed: {
    firstSocialLink() {
      return this.mainAuthor && this.mainAuthor.socialLinks && this.mainAuthor.socialLinks.length > 0
        ? this.mainAuthor.socialLinks[0]
        : null;
    },
  },
  methods: {
    async fetchAvatar() {
      this.avatarLoading = true;
      try {
        const response = await fetch(`/api/bilibili/user/${this.authorBiliID}`);
        const data = await response.json();
        if (data?.face) {
          this.$emit("update-avatar", data.face + "@100w_100h.jpg");
        }
      } catch (error) {
        console.error("获取头像失败", error);
        this.avatarError = true;
        this.$emit("update-avatar", "https://via.placeholder.com/50");
      } finally {
        this.avatarLoading = false;
      }
    },
    handleAvatarError() {
      this.avatarError = true;
      this.$emit("update-avatar", "https://via.placeholder.com/50");
    },
    handleExtraAvatarError(index) {
      // 可以扩展为替换默认头像等逻辑
      this.$set(this.extraAvatarErrors, index, true);
      console.warn(`额外作者 #${index} 头像加载失败`);
    },
    highlightSpecificFirstSocialLink(index) {
      this.currentHighlightedIndex = index;
    },
    resetHighlightSpecific(index) {
      if (this.currentHighlightedIndex === index) {
        this.currentHighlightedIndex = -1;
      }
    }
  },
  async mounted() {
    try {
      // load main author by name
      const mainRes = await fetch(`/datapack-index/authors/${this.authorName}.json`);
      if (mainRes && mainRes.ok) {
        this.mainAuthor = await mainRes.json();
        // normalize avatar path
        if (this.mainAuthor.avatar) this.mainAuthor.avatar = '/datapack-index' + this.mainAuthor.avatar;
      }

      // load extra authors
      for (const extra of this.extraAuthors || []) {
        if (!extra) continue;
        if (typeof extra === 'string') {
          const r = await fetch(`/datapack-index/authors/${extra}.json`);
          if (r && r.ok) {
            const obj = await r.json();
            if (obj.avatar) obj.avatar = '/datapack-index' + obj.avatar;
            this.extraAuthorsInfo.push(obj);
          }
        } else if (extra.authorName) {
          if (extra.avatarUrl || (extra.socialLinks && extra.socialLinks.length)) {
            this.extraAuthorsInfo.push({ name: extra.authorName, avatar: extra.avatarUrl, socialLinks: extra.socialLinks || [] });
          } else {
            const r = await fetch(`/datapack-index/authors/${extra.authorName}.json`);
            if (r && r.ok) {
              const obj = await r.json();
              if (obj.avatar) obj.avatar = '/datapack-index' + obj.avatar;
              this.extraAuthorsInfo.push(obj);
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  },
};
</script>

<style scoped>
.spacer {
  flex: 1;
  height: 30px;
  position: relative;
}

.header-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 30%;
  overflow: hidden;
  border-radius: 4px 4px 0 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.header-image-wrapper:hover .gradient-overlay {
  opacity: 0.1;
}

.gradient-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.3) 0%, transparent 100%);
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.article-container {
  max-width: 800px;
  padding: 20px;
  margin: 0 auto;
  /* 居中 */
}

.color-line,
.featured-color-line {
  display: flex;
  margin: 20px 0 0 0;
}

.thick {
  height: 5px;
}

.thin {
  height: 2px;
}

/* 通用颜色段样式 */
.color-segment {
  flex: 1;
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

/* 特色横线特定样式 */
.featured-color-line {
  height: 8px;
  /* 设置特色横线高度 */
  align-items: center;
  /* 垂直居中子元素 */
}

.orange {
  background: #c47c4e;
}

.purple {
  background: #694ec6;
}

.image-container {
  position: relative;
  height: 100%;
  width: calc(100% - 2 * (100% / 3));
  /* 中间部分宽度，根据需要调整 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  margin: 2px 0 0 0;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 700;
  font-style: italic;
}

.resource-link {
  text-align: center;
  margin: -10px 35px 20px 35px;
  font-size: 0.9rem;
  opacity: 0.8;
  transition: opacity 0.3s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  align-items: flex-start;
}

.author-info {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  padding: 10px;
  border-radius: 8px;
  max-width: 33;
}

.author-info:hover,
.author-info.hovered {
  transform: scale(1.03);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.primary-author {
  flex: 0 0 37%;
}

.extra-author {
  flex: 1;
}

.extra-author-wrapper {
  display: flex;
  align-items: flex-start;
}

.vertical-divider {
  width: 1px;
  background: rgba(0, 0, 0, 0.2);
  align-self: stretch;
  margin: 0 15px;
}

.extra-authors {
  display: flex;
  gap: 10px; /* 减小间距以便容纳分割线 */
  flex-wrap: wrap;
  flex: 1;
}

.avatar-wrapper {
  position: relative;
  width: 50px;
  height: 50px;
  flex-shrink: 0;
}

.avatar-link {
  display: block;
  width: fit-content;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.author-details {
  flex: 1;
}

.author-info:hover .avatar,
.author-info.hovered .avatar {
  transform: scale(1.1);
}

.author-name-link {
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease;
}

.author-name-link:hover {
  color: #0550ae;
}

.dark .author-name-link {
  color: #ccc;
  text-decoration: none;
}

.dark .author-name-link:hover {
  color: #0550ae;
}

.author-name {
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
  transition: color 0.3s ease;
}

.author-name:hover {
  color: inherit; /* 确保作者名字在悬停时不改变颜色 */
}

.social-links {
  display: flex;
  gap: 10px;
  margin-top: 4px;
  flex-wrap: wrap;
}

.link {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.link.highlight {
  color: #0550ae !important;
}

.link:hover {
  color: #0550ae;
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
    padding-top: 50%;
  }

  .article-container {
    padding: 10px;
  }

  .featured-color-line {
    height: 6px;
  }

  .image-container {
    height: 80%;
  }

  .article-title {
    font-size: 1.2rem;
    margin: 20px 0;
  }

  .resource-link {
    font-size: 0.8rem;
  }

  .content-wrapper {
    flex-direction: column;
    gap: 15px;
  }

  .primary-author,
  .extra-authors {
    flex: auto;
    justify-content: flex-start;
  }

  .vertical-divider {
    width: 100%;
    height: 1px;
    margin: 10px 0;
  }

  .extra-authors {
    flex-direction: column;
    gap: 15px;
  }

  .author-info {
    gap: 15px;
  }

  .avatar-wrapper {
    width: 40px;
    height: 40px;
  }

  .avatar {
    width: 40px;
    height: 40px;
  }

  .author-name {
    font-size: 0.9rem;
  }

  .social-links {
    gap: 5px;
  }

  .abstract {
    padding-left: 0;
  }

  .abstract-title {
    font-size: 1rem;
  }

  .abstract-content {
    font-size: 0.85rem;
  }
}
</style>
