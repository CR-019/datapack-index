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
            src="/feature/cover/outline.png"
            class="base-image"
            alt="Outline"
          />
          <img
            :src="spotlightSrcComputed"
            class="overlay-image"
            alt="Spotlight"
          />
        </div>
        <div class="color-segment purple"></div>
      </div>
    </template>
  </FeatureHeadBase>
</template>

<script>
import FeatureHeadBase from './FeatureHeadBase.vue'; // 请确保路径正确

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
      type: String,
      default: "", // 添加默认值
    },
    cover: {
      type: [String, Boolean],
      default: false,
    },
    type: {
      type: Number,
      default: 0,
    }
  },
  computed: {
    spotlightSrcComputed() {
      return `/datapack-index/feature/cover/spotlight${this.type}.png`;
    },
    // firstSocialLink 计算属性由 FeatureHeadBase 处理
  },
  methods: {
    onAvatarUpdate(newAvatarUrl) {
       // 将更新事件传递给父组件
       this.$emit('update-avatar', newAvatarUrl);
    }
  }
};
</script>


<style scoped>

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
  width: 60%;
  height: auto;
  aspect-ratio: 1/1;
  object-fit: contain;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -70%);
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




@media (max-width: 768px) {

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
}
</style>



