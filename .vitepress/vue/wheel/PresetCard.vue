<template>
    <a :href="url" class="preset-card" :title="title">
        <div class="card-body">
            <h3 class="title">{{ title }}</h3>
            <p class="desc" v-if="description">{{ description }}</p>
        </div>
    </a>
</template>

<script setup>
const props = defineProps({
    title: { type: String, default: 'Untitled' },
    description: { type: String, default: '' },
    url: { type: String, default: '#' },
});
</script>

<style scoped>
.preset-card {
    display: block;
    text-decoration: none;
    color: inherit;
    border: 1px solid var(--vp-c-divider, #e6e6e6);
    border-radius: 8px;
    padding: 12px;
    transition: box-shadow .12s ease, transform .08s ease;
    background: var(--vp-c-bg, #fff);
}

.preset-card:hover {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
}

.title {
    margin: 0 0 6px 0;
    font-size: 15px;
    font-weight: 600;
}

.desc {
    margin: 0;
    color: var(--vp-c-muted, #666);
    font-size: 13px;
    line-height: 1.4;
}
</style>
