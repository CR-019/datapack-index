<template>
    <div class="nbt-tree" :class="{ 'nbt-template': isTemplate && !nbt.isRoot }">
        <span>
            <span 
                class="nbt-seg"
                v-for="(seg, index) in segs"
                :style="{ 
                    'margin-right': index < segs.length - 1 ? '1em' : '0',
                    'margin-left': seg === '=' ? '-2em' : '0',
                    'color': seg === '__' || seg === '=' ? 'white' : 'black'
                }"
            >{{ seg }}</span>
            <span v-for="(icon, index) in icons" :key="index" class="nbt-icon">
                <img :src="icon"  alt="Icon"/>
            </span>
            <span v-if="!icons.length">
                <img src="./refs/nbt_sprites/any.svg" alt="NBT Icon" />
            </span>
            <strong>{{ nbt.name }}</strong>：
            <span class="fold-button" v-if="isTemplate && nbt.isRoot" @click="isFolded = !isFolded">
                {{ nbt.templateName }}共通标签  {{ isFolded ? "[展开]" : "[收起]" }}
            </span>
            {{ nbt.description }} 
        </span>
        <!--子节点-->
        <div v-if="nbt.children?.length && (!isTemplate || (isTemplate && nbt.isRoot && !isFolded))">
            <NBTNode 
                v-for="(child, index) in getChildren()" 
                :nbtObj="child" 
                :is-compiled="true" 
                :is-last="index === nbt.children.length - 1" 
                :is-root="false"
            />
        </div>
    </div>
</template>

<script>
import { compileString } from '../MCFPPNBTParser'

export default {
    props: {
        // 父组件传递的NBT数据
        nbtObj: {
            type: Object,
            default: null
        },
        // 标记数据是否已编译（父组件传递的数据默认已处理）
        isCompiled: {
            type: Boolean,
            default: false
        },
        isLast: {
            type: Boolean,
            default: true // 是否是最后一个子节点
        },
    },
    data() {
        return {
            nbt: null, // NBT数据
            isTemplate: false, // 是否是模板
            gap: 0, // 缩进量
            icons: [], // 图标列表
            segs: [],
            isFolded: true,
        };
    },
    created() {
        if (!this.isCompiled && this.$slots.default?.()?.[0]?.children) {
            this.nbt = compileString(this.$slots.default()[0].children).then(
                (nbt) => {
                    this.nbt = nbt;
                    this.isTemplate = nbt.isTemplate;
                    this.icons = nbt.getIcon();
                    this.nbt.gap = 0; // 初始化缩进
                    console.log(nbt)
                }
            ).catch((error) => {
                this.nbt = {
                    name: 'Error',
                    description: `Failed to compile NBT data: ${error.message}`,
                    children: [],
                    gap: 0,
                };
                this.isTemplate = false;
                this.icons = this.nbt.getIcon();
            });
        } else if (this.nbtObj) {
            this.nbt = this.nbtObj;
            this.isTemplate = this.nbt.isTemplate;
            this.icons = this.nbt.getIcon();
            this.gap = this.nbt.gap;
            this.segs = [...(this.nbt.segs || []), this.isLast ? '└─' : '├─'];
        }
    },
    methods: {
        getChildren() {
            if (this.nbt.children && this.nbt.children.length) {
                return this.nbt.children.map((child) => {
                    child.gap = this.nbt.gap + 1;
                    child.segs = [...(this.nbt.segs || []), !(this.nbt.isRoot && !this.nbt.isTemplate) ? (this.isLast?'__':'│'):'='];
                    return child;
                });
            }
            return []; 
        }
    },
};
</script>

<style scoped>
.nbt-template {
    background-color: #daf3ff;
}

.nbt-node-icons {
    display: flex;
    flex-wrap: wrap;
}

.nbt-icon {
    width: 16px;
    height: 16px;
    display: inline-block;
    margin: 0 0.2em;
}

.nbt-icon img {
    width: 100%;
    height: 100%;
}

.nbt-tree {
    display: flex;
    flex-direction: column;
    gap: 0.2em;
}

.nbt-tree>span {
    display: flex;
    align-items: center;
    gap: 0.4em;
}

.nbt-seg {
    font-family: monospace;
}

.fold-button {
    color:rgb(10, 69, 152);
    cursor: pointer;
    user-select: none; /* 标准属性 */
    -webkit-user-select: none; /* Safari/Chrome */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+ */
}
</style>
