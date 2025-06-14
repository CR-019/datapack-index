<template>
    <div v-if="!isError" class="nbt-tree"
        :class="{
            'nbt-template': isTemplate && !nbt.isRoot,
            'nbt-not-template': !(isTemplate && !nbt.isRoot || isTemplateInput)
        }"
        :style="{'margin-left': (!isTemplate && nbt.isRoot) ? '2em' : '0'}"
    >
        <span>
            <span class="nbt-seg" v-for="(seg, index) in segs" :style="{
                'margin-right': index < segs.length - 1 ? '1em' : '0',
                'margin-left': seg === '=' ? '-2em' : '0',
                'color': seg === '__' ? (isTemplate ? '#daf3ff' : 'white') : (seg === '=' ? 'white' : 'black')
            }">{{ seg }}</span>
            <span v-for="(icon, index) in icons" :key="index" class="nbt-icon">
                <img :src="icon" alt="Icon" />
            </span>
            <span v-if="!icons.length">
                <img src="./refs/nbt_sprites/any.svg" alt="NBT Icon" />
            </span>
            <strong>{{ nbt.name }}</strong>
            <span v-if="nbt.description !== '' ">：</span>
            <span>{{ nbt.description }}</span>
        </span>
    </div>
</template>

<script>
import { compileString } from '../MCFPPNBTParser'
import {NBT} from "../NBTStructure";
import { useData } from "vitepress";

export default {
    name: "NBTNode",
    setup() {
        const { withBase } = useData()
        return { withBase }
    },
    props: {
        // 父组件传递的NBT数据
        nbtObj: {
            type: NBT,
            default: null
        },
        isLast: {
            type: Boolean,
            default: true // 是否是最后一个子节点
        },
        code: {
            type: String,
            default: null
        },
        isTemplateInput: {
            type: Boolean,
            default: null
        }
    },
    data() {
        return {
            /** @type {NBT | null} */
            nbt: null, // NBT数据
            isTemplate: false, // 是否是模板
            gap: 0, // 缩进量
            icons: [], // 图标列表
            segs: [],
            isFolded: true,
            isError: false,
            errorMsg: ""
        };
    },
    created() {
        let c = null
        if(this.code){
            c = this.code;
        }
        if(c){
            this.nbt = compileString(c).then(
                (nbt) => {
                    this.nbt = nbt;
                    this.isTemplate = nbt.isTemplate;
                    this.icons = nbt.getIcon();
                    this.nbt.gap = 0; // 初始化缩进
                    //console.log(this.nbt)
                }
            ).catch((error) => {
                this.isError = true
                this.errorMsg = error.message
                console.error(error)
            }); 
        } else if (this.nbtObj) {
            this.nbt = this.nbtObj;
            this.isTemplate = this.nbt.isTemplate;
            this.icons = this.nbt.getIcon();
            this.gap = this.nbt.gap;
            this.segs = [...(this.nbt.segs || []), this.isLast ? '└─' : '├─'];
            //console.log(this.nbt)
        } else {
            this.isError = true
            this.errorMsg = "未指定NBT结构"
        }
    },
    methods: {
        getChildren() {
            if (this.nbt.children && this.nbt.children.length) {
                return this.nbt.children.map((child) => {
                    child.gap = this.nbt.gap + 1;
                    child.segs = [...(this.nbt.segs || []), !(this.nbt.isRoot && !this.nbt.isTemplate) ? (this.isLast ? '__' : '│') : '='];
                    return child;
                });
            }
            return [];
        }
    },
    computed :{
        processedDescription() {
            if (!this.nbt?.description) return ''
            // 转换图片路径
            return this.nbt.description.replace(
                /!\[(.*?)]\((.*?)\)/g,
                (_, alt, src) => `![${alt}](${this.withBase(src)})`
            )
        }
    }
};
</script>
