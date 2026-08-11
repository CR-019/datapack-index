<template>
  <div class="color-line" :style="{ height: height + 'px' }">
    <div></div>
  </div>
</template>

<script>
export default {
  name: "ColorLine",
  props: {
    // 线条高度，默认 2px
    height: {
      type: Number,
      default: 2
    }
  }
};
</script>

<style scoped>
.color-line {
  display: flex;
  margin: 32px 0;
  background-color: transparent;
}

.color-line::before,
.color-line::after,
.color-line > div {
  content: "";
  flex: 1;
}

.color-line::before {
  background: var(--feature-orange);
}

.color-line > div {
  background: var(--feature-green);
}

.color-line::after {
  background: var(--feature-purple);
}
</style>