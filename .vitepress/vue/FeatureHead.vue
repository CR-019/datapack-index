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
    <!-- 使用默认插槽内容（即基础组件中的默认横线） -->
  </FeatureHeadBase>
</template>

<script>
import FeatureHeadBase from './FeatureHeadBase.vue'; 

export default {
  name: "FeatureHead",
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
       // 将更新事件传递给父组件，或者如果 FeatureHead 是最终使用者，可以在这里处理
       // 例如，通过 $emit 向上再传递，或者直接修改 data（如果 avatarUrl 是 data）
       // 这里我们假设 FeatureHead 的 avatarUrl 是响应式的，可以通过 prop 更新
       // 或者 FeatureHead 自己管理 avatarUrl 的状态
       this.$emit('update-avatar', newAvatarUrl); // 如果 FeatureHead 也需要通知它的父组件
    }
  }
};
</script>

<!-- FeatureHeadBase 的样式已经包含了所有需要的样式 -->
<style scoped>
/* 如果有 FeatureHead 特有的样式，可以在这里添加 */
</style>



