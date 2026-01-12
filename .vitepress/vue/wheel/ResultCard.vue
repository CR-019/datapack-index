<template>
    <div class="result-card" @click="onClick">
        <div class="card-left">
            <!-- cover thumbnail on the left: image or generated placeholder -->
            <div class="card-thumb">
                <img v-if="coverLoaded" :src="coverSrc" alt="cover" />
                <div v-else class="thumb-placeholder" :style="placeholderStyle">{{ initials }}</div>
            </div>
            <div class="left-content">
                    <div class="rc-header">
                        <h3 class="rc-name" ref="nameEl" :style="{ fontSize: nameFontSize + 'px' }">{{ item.name }}</h3>
                    </div>
                    <span class="rc-author" v-if="item.author">{{ item.author[0].name }}</span>
                    <p class="rc-desc">{{ item.description }}</p>
            </div>
        </div>
        <div class="card-right">
            <div class="gameversion">
                <span v-for="(version, index) in item.gameversion" :key="index" class="version-badge">
                    {{ version }}
                </span>
            </div>
            <div class="tags" aria-hidden="false">
                <!-- 渲染所有标签：默认只展示前两个，额外的在悬停时显示 -->
                <span v-for="(tag, index) in (item.tags || [])" :key="index" :class="['tag-badge', { 'extra-tag': index >= 2 }]" :style="tagStyle(tag)">
                    {{ tag }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { stringToBadgeColors } from '../../scripts/badgeColor';

export default {
    name: "ResultCard",
    props: {
        item: { type: Object, required: true },
    },
    data() {
        return { coverLoaded: false, coverSrc: "", nameFontSize: 18, _resizeTimer: null };
    },
    mounted() {
        this.tryLoadCover(this.item && this.item.cover);
        this.adjustNameFontSize();
        // debounce resize
        this._onResize = () => {
            clearTimeout(this._resizeTimer);
            this._resizeTimer = setTimeout(() => this.adjustNameFontSize(), 120);
        };
        window.addEventListener("resize", this._onResize);
    },
    watch: {
        "item.cover"(nv) {
            this.tryLoadCover(nv);
        },
        "item.name"() {
            this.adjustNameFontSize();
        },
    },
    methods: {
        onClick() {
            const dest = this.item.path ?? this.item.id ?? null;
            if (dest) this.$emit("select", "/datapack-index" + dest);
        },

        tagStyle(tag) {
            // hard-coded tag color map
            const colorSet = stringToBadgeColors(tag);
            return {
                background: colorSet.background,
                border: `1px solid ${colorSet.border}`,
                color: colorSet.text,
                padding: '4px 8px',
                'border-radius': '8px',
                'font-size': '12px'
            };
        },
        tryLoadCover(src) {
            this.coverLoaded = false;
            this.coverSrc = "";
            if (!src) return;
            try {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => {
                    this.coverLoaded = true;
                    this.coverSrc = src;
                };
                img.onerror = () => {
                    this.coverLoaded = false;
                    this.coverSrc = "";
                };
                img.src = src;
            } catch (e) {
                this.coverLoaded = false;
                this.coverSrc = "";
            }
        },
        // adjust the name font size to fit on one line; if cannot, fallback to ellipsis
        adjustNameFontSize() {
            this.$nextTick(() => {
                const el = this.$refs.nameEl;
                if (!el) return;
                const minSize = 12; // minimum font size in px
                const maxSize = 18; // default / starting font size
                // reset to max for measurement
                el.style.whiteSpace = 'nowrap';
                el.style.overflow = 'visible';
                el.style.textOverflow = 'clip';
                let size = maxSize;
                el.style.fontSize = size + 'px';
                // If it's already fitting, set and return
                const fits = () => el.scrollWidth <= el.clientWidth + 1; // tolerance
                if (fits()) {
                    this.nameFontSize = size;
                    // ensure ellipsis not applied
                    el.style.overflow = '';
                    el.style.textOverflow = '';
                    return;
                }
                // decrement until fit or reach min
                while (size > minSize && !fits()) {
                    size -= 1;
                    el.style.fontSize = size + 'px';
                }
                this.nameFontSize = size;
                // if still doesn't fit at min size, apply ellipsis
                if (!fits()) {
                    el.style.whiteSpace = 'nowrap';
                    el.style.overflow = 'hidden';
                    el.style.textOverflow = 'ellipsis';
                    this.nameFontSize = minSize;
                } else {
                    // clear overflow styles if fits
                    el.style.overflow = '';
                    el.style.textOverflow = '';
                }
            });
        },
    },
    computed: {
        initials() {
            const name = (this.item && this.item.name) || "";
            if (!name) return "";
            const parts = name.trim().split(/\s+/);
            if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
            return (parts[0][0] + parts[1][0]).toUpperCase();
        },
        placeholderStyle() {
            const colors = stringToBadgeColors((this.item && this.item.name) || "");
            return {
                background: `linear-gradient(135deg, ${colors.background}, ${colors.border})`,
                color: colors.text,
            };
        },
    },
    beforeDestroy() {
        // Vue 2 hook
        try {
            window.removeEventListener("resize", this._onResize);
        } catch (e) {}
    },
    unmounted() {
        // Vue 3 hook
        try {
            window.removeEventListener("resize", this._onResize);
        } catch (e) {}
    },
};

</script>

<style scoped>
.result-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 18px;
    margin-bottom: 14px;
    border: 2px solid rgba(16, 24, 32, 0.06);
    border-radius: 18px;
    cursor: pointer;
    background: linear-gradient(90deg, #fefeff 0%, #ffffff 60%);
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    will-change: transform, opacity;
    animation: popIn 320ms cubic-bezier(0.4, 0, 0.2, 1);
    min-height: 140px;

    /* allow overlay pseudo element when cover present */
    position: relative;
    overflow: hidden;
}

@keyframes popIn {
    from {
        opacity: 0;
        transform: translateY(8px) scale(0.985);
    }

    60% {
        opacity: 1;
        transform: translateY(-2px) scale(1.005);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.result-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(12, 24, 40, 0.08);
}

.rc-header {
    display: flex;
    align-items: center;
    gap: 8px;
}

.card-thumb {
    width: 48px;
    height: 48px;
    flex: 0 0 48px;
    border-radius: 8px;
    overflow: hidden;
    background: #f6f8fa;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(16,24,32,0.04);
    box-shadow: 0 2px 6px rgba(12,24,40,0.04);
}

.card-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.thumb-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 16px;
    color: #fff;
    border-radius: 6px;
    box-shadow: inset 0 -6px 12px rgba(0,0,0,0.06);
    transition: transform 120ms ease, box-shadow 120ms ease;
}

.result-card:hover .thumb-placeholder {
    transform: translateY(-2px);
}

.card-left {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.left-content {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.rc-header {
    align-items: center;
}

.rc-name {
    font-size: 18px;
    font-weight: 500;
    margin: 0;
    color: #0b0b0b;
    line-height: 1.1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    vertical-align: middle;
}

.rc-divider {
    width: 1px;
    height: 18px;
    background: rgba(16, 24, 40, 0.06);
    border-radius: 1px;
}

.rc-author {
    color: #7f8689;
    font-size: 13px;
    margin-top: 4px;
    display: block;
}

.rc-desc {
    margin: 4px 0 0 0;
    color: #8b9398;
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    box-orient: vertical;
    transition: opacity 180ms ease, max-height 220ms ease, margin 180ms ease;
    max-height: 50px; /* slightly smaller to fit layout */
    opacity: 1;
}

.card-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 14px;
    justify-content: center;
    min-width: 160px; 

    /* ensure content sits above possible cover overlay */
    position: relative;
    z-index: 1;
}

.gameversion {
    display: flex;
    gap: 8px;
    align-items: center;
}

.version-badge {
    background: rgba(30, 144, 255, 0.06);
    border: 1px solid rgba(30, 144, 255, 0.18);
    color: #1e90ff;
    padding: 3px 8px;
    border-radius: 999px;
    font-size: 12px;
    box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.02);
}

.tags {
    display: flex;
    gap: 8px;
    flex-wrap: nowrap; 
    justify-content: center;
    overflow: hidden;
    align-items: center;
}

.tag-badge {
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 12px;
    box-shadow: 0 1px 0 rgba(16, 24, 40, 0.03);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

/* extra tags hidden by default, revealed on hover */
.tag-badge.extra-tag {
    display: none;
    opacity: 0;
    transform: translateY(4px);
    transition: opacity 160ms ease, transform 160ms ease;
}

.result-card:hover .tag-badge.extra-tag,
.result-card:focus-within .tag-badge.extra-tag {
    display: inline-block;
    opacity: 1;
    transform: translateY(0);
}

/* 当显示所有标签（悬停或聚焦）时，隐藏描述并添加过渡动画 */
.result-card:hover .rc-desc,
.result-card:focus-within .rc-desc {
    opacity: 0;
    max-height: 0;
    margin: 0;
}

/* Shrink description area to avoid pushing tags */
.card-left {
    flex: 1 1 auto;
    min-width: 0;
    padding-right: 12px;
}

.rc-desc {
    font-size: 12px;
    max-width: 100%;
}

/* Responsive: on narrow screens stack layout */
@media (max-width: 520px) {
    .result-card {
        flex-direction: column;
        align-items: stretch;
    }

    .card-right {
        flex-direction: row;
        justify-content: flex-start;
        gap: 8px;
        min-width: 0;
        padding: 10px 10px 0 10px;
    }

    .card-left {
        padding-left: 10px;
    }
}

/* Dark mode 支持 */
.dark .result-card {
    /* 更偏向黑色的主题色 */
    background: linear-gradient(90deg, #1b1b1f 0%, #1c1c20 60%);
    border-color: rgba(255, 255, 255, 0.06);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.8);
    color: #f3f3f3;
}

.dark .result-card:hover {
    box-shadow: 0 7px 20px rgba(0, 0, 0, 0.85);
}

/* thumbnail adjustments for dark mode to keep consistency */
.dark .card-thumb {
    border: 1px solid rgba(255,255,255,0.04);
    box-shadow: 0 2px 6px rgba(0,0,0,0.5);
}

/* ensure text sits above the overlay */
.dark .result-card .card-left,
.dark .result-card .card-right {
    position: relative;
    z-index: 1;
}

.dark .rc-name {
    color: #ffffff;
}

.dark .rc-divider {
    background: rgba(255, 255, 255, 0.04);
}

.dark .rc-author {
    color: #bdbdbd;
}

.dark .rc-desc {
    color: #9ea6ac;
}

.dark .version-badge {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #ffffff;
}

.dark .tag-badge {
    box-shadow: none;
    color: #e6e6e6;
    border-color: rgba(255, 255, 255, 0.06);
    background: rgba(255, 255, 255, 0.02);
}
</style>
