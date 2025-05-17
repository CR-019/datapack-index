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
  background: #c47c4e;
}

.color-line > div {
  background: #74b096;
}

.color-line::after {
  background: #694ec6;
}
</style>