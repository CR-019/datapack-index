<template>
    <div class="preset-search">
        <input v-model="query" @keyup.enter="onEnter" type="search" :placeholder="placeholder" class="search-input" />
        <button class="all-btn" @click="goAll">全部前置库</button>
    </div>
</template>

<script setup>
import { ref, watch, toRefs } from "vue";
const props = defineProps({
    modelValue: { type: String, default: "" },
    placeholder: { type: String, default: "搜索前置库（按回车搜索）" },
});
const emit = defineEmits(["update:modelValue", "search", "goto-all"]);

const query = ref(props.modelValue);
watch(
    () => props.modelValue,
    (v) => (query.value = v)
);
watch(query, (v) => emit("update:modelValue", v));

function onEnter() {
    emit("search", query.value);
}
function goAll() {
    emit("goto-all", query.value);
}
</script>

<style scoped>
.preset-search {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 16px;
}

.search-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--vp-c-divider, #e6e6e6);
    border-radius: 6px;
    font-size: 14px;
}

.all-btn {
    padding: 8px 12px;
    background: var(--vp-c-brand, #3eaf7c);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.all-btn:hover {
    opacity: 0.95;
}
</style>
