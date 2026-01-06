<template>
    <div class="result-card" @click="onClick" :style="cardStyle" :class="{ 'has-cover': coverLoaded }">
        <div class="card-left">
            <div class="rc-header">
                <h3 class="rc-name">{{ item.name }}</h3>
                <div class="rc-divider" aria-hidden></div>
                <span class="rc-author" v-if="item.author.length = 1">{{ item.author[0].name }}</span>
                <span class="rc-author" v-if="item.author.length > 1">{{ item.author[0].name }} ...</span>
            </div>
            <p class="rc-desc">{{ item.description }}</p>
        </div>
        <div class="card-right">
            <div class="gameversion">
                <span v-for="(version, index) in item.gameversion" :key="index" class="version-badge">
                    {{ version }}
                </span>
            </div>
            <div class="tags">
                <span v-for="(tag, index) in item.tags" :key="index" class="tag-badge" :style="tagStyle(tag)">
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
        return { coverLoaded: false, coverSrc: "" };
    },
    mounted() {
        this.tryLoadCover(this.item && this.item.cover);
    },
    watch: {
        "item.cover"(nv) {
            this.tryLoadCover(nv);
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
    },
    computed: {
        cardStyle() {
            if (this.coverLoaded && this.coverSrc) {
                // overlay a subtle left->right gradient on top of the cover image
                return {
                    backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.78), rgba(247,251,255,0.28)), url('${this.coverSrc}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                };
            }
            return {};
        },
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

.result-card.has-cover {
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow: 0 6px 24px rgba(8, 12, 20, 0.12);
}

.rc-header {
    display: flex;
    align-items: center;
    gap: 8px;
}

.rc-name {
    font-size: 18px;
    font-weight: 500;
    margin: 0;
    color: #0b0b0b;
    line-height: 1.15;
}

.result-card.has-cover .rc-name {
    color: #061123;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.6);
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
}

.rc-desc {
    margin: 8px 0 0 0;
    color: #8b9398;
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.result-card.has-cover .rc-author,
.result-card.has-cover .rc-desc {
    color: rgba(10, 20, 30, 0.6);
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.6);
}

.card-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 14px;
    justify-content: center;
    padding-right: 10px;
    min-width: 110px;
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

.result-card.has-cover .version-badge {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.18);
    color: #084a86;
}

.tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
}

.tag-badge {
    padding: 2px 8px;
    border-radius: 6px;
    font-size: 12px;
    box-shadow: 0 1px 0 rgba(16, 24, 40, 0.03);
}

.result-card.has-cover .tag-badge {
    box-shadow: none;
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
        padding: 10px 22px 0 22px;
    }

    .card-left {
        padding-left: 10px;
    }
}
</style>
