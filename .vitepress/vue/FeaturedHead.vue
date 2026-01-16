<template>
  <FeatureHeadBase
    :title="title"
    :author-name="authorName"
    :author-bili-i-d="authorBiliID"
    :social-links="socialLinks"
    :avatar-url="avatarUrl"
    :abstract-text="abstractText"
    :resource-link="resourceLink"
    :cover="cover"
    @update-avatar="onAvatarUpdate"
  >
    <!-- 使用具名插槽 'top-line' 提供自定义横线 -->
    <template #top-line>
      <div class="featured-color-line">
        <div class="color-segment orange"></div>
        <div class="image-container">
          <img
            src="/feature/cover/command_block_front.png"
            class="base-image"
            alt="Command Block Front"
          />
          <img
            src="/feature/cover/featured.png"
            class="overlay-image"
            alt="Featured"
          />
        </div>
        <div class="color-segment purple"></div>
      </div>
    </template>
  </FeatureHeadBase>
</template>

<script>
import FeatureHeadBase from './FeatureHeadBase.vue'; // 确保路径正确

export default {
  name: "FeaturedHead",
  components: {
    FeatureHeadBase,
  },
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
    }
  },
  methods: {
    onAvatarUpdate(newAvatarUrl) {
       this.$emit('update-avatar', newAvatarUrl);
    }
  }
};
</script>

<!-- FeatureHeadBase 的样式已经包含了所有需要的样式 -->
<style scoped>
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

.featured-color-line {
  display: flex;
  height: 8px;
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



