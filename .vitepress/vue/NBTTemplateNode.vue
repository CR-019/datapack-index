<template>
    <div v-if="!isError" class="nbt-tree nbt-template">
        <span>
            <span class="nbt-seg" v-for="(seg) in segs" :style="{
                'margin-right': '1em',
                'margin-left': seg === '=' ? (isExtend ? '-1.5em' : '-2em') : '0',
                'color': seg === '__' ? '#daf3ff' : (seg === '=' ? 'white' : 'black')
            }">{{ seg }}</span>
            <span @click="onClick">
                <strong style="font-size: 15px">{{ nbt.templateName }}共通标签</strong>
                <span class="fold-button">
                    {{ isFolded ? "[展开]" : "[收起]" }}
                </span>
            </span>
        </span>
        <!--子节点-->
        <div v-if="nbt.children?.length && !isFolded">
            <template v-for="(child, index) in getChildren()">
                <NBTNode v-if="child.children.length === 0" :nbtObj="child"
                         :is-last="index === nbt.children.length - 1 && !isExtend"/>
                <div v-else-if="child.isTemplate" >
                    <NBTNode :nbt-obj="child"
                             :is-last="index === nbt.children.length - 1 && !isExtend"
                             :is-template-input="true"
                    />
                    <NBTTemplateNode :nbtObj="child"
                                     :is-last="index === nbt.children.length - 1 && !isExtend"
                    />
                </div>
                <NBTTree v-else-if="child.children.length !== 0" :nbtObj="child"
                         :is-last="index === nbt.children.length - 1 && !isExtend"
                />
            </template>
        </div>
    </div>
</template>

<script>
import { NBT } from "../NBTStructure";
import NBTNode from "./NBTNode.vue";
import NBTTree from "./NBTTree.vue";

export default {
    name: "NBTTemplateNode",
    components: {NBTTree, NBTNode},
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
        path: {
            type: String,
            default: null
        },
        isExtend: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            /** @type {NBT | null} */
            nbt: null, // NBT数据
            isTemplate: true, // 是否是模板
            gap: 0, // 缩进量
            /** @type {string[]} */
            icons: [], // 图标列表
            /** @type {string[]} */
            segs: [],
            isFolded: true,
            isError: false,
            errorMsg: ""
        };
    },
    created() {
        if(this.nbtObj){
            this.nbt = this.nbtObj;
            this.segs =  [
                ...(this.nbt.segs || []),
                !(this.nbt.isRoot && !this.nbt.isTemplate) && !this.isExtend ? (this.isLast ? '__' : '│') : '=',
            ];
            //console.log(this.nbt)
        }else {
            this.isError = true
            this.errorMsg = "未定义模板NBT数据"
            console.error(err)
        }

    },
    methods: {
        getChildren() {
            if (this.nbt.children && this.nbt.children.length) {
                return this.nbt.children.map((child) => {
                    child.gap = this.nbt.gap + 1;
                    child.segs = [
                        ...(this.nbt.segs || []),
                        !(this.nbt.isRoot && !this.nbt.isTemplate) && !this.isExtend ? (this.isLast ? '__' : '│') : '=',
                    ];
                    return child;
                });
            }
            return [];
        },
        onClick(){
            this.isFolded = !this.isFolded
            this.nbt.instantiateExtends(this.nbt.extends).then((result) => {
                this.extend = result
                //console.log(result)
            }).catch((err) => {
                this.isError = true
                this.errorMsg = err.message
                console.error(err)
            });
            //实例化子类型
            this.nbt.instantiateChildren().then(() => {
                //console.log(this.nbt.children)
            }).catch(err => {
                this.isError = true
                this.errorMsg = err.message
                console.error(err)
            })
        }
    },
};
</script>
