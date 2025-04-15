<template>
    <section class="featured-cover">

        <!-- 封面大图 -->
        <div class="cover-container">
            <img :src="cover" alt="本期封面" class="cover-image">
        </div>

        <!-- 信息栏 -->
        <div class="info-bar">

            <div class="info-left">
                <p class="editors">本期编辑：{{ editors.join('、') }}</p>
                <p class="credits">特别鸣谢：{{ credits.join('、') }}</p>
            </div>
            <div class="info-right">
                <a href="../archive/202504/preface" class="launch-link">创刊寄语</a>
            </div>
        </div>
    </section>

    <!-- 底部装饰线 -->
    <div class="color-line thin">
        <div></div>
    </div>
</template>

<script>

export default {
    props: {
        cover: {
            type: String,
            required: true
        },
        editors: {
            type: Array,
            default: () => ['编辑A', '编辑B']
        },
        credits: {
            type: Array,
            default: () => ['设计团队', '技术支持']
        }
    }
}
</script>

<style scoped>
.featured-cover {
    max-width: 1200px;
}

.color-line {
    height: 2px;
    display: flex;
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

/* 封面容器 */
.cover-container {
    margin: 0 -2rem;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.cover-image {
    width: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.cover-image:hover {
    transform: scale(1.02);
}

/* 信息栏 */
.info-bar {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 1.5rem 0 0.2rem 0;
    border-top: 1px solid var(--vp-c-divider);
}

.info-right {
    flex: 0 0 70%;
    text-align: right;
}

.info-left {
    flex: 1;
    text-align: left;
}

.launch-link {
    display: inline-flex;
    font-size: 1.5rem;
    color: var(--vp-c-brand);
    text-decoration: none;
}

.launch-link:hover {
    text-decoration: underline;
}

.editors,
.credits {
    margin: 0;
    color: var(--vp-c-text-2);
    font-size: 0.95rem;
}
</style>