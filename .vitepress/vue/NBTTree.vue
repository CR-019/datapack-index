<script setup>
import {defineAsyncComponent} from 'vue';
const NBTTemplateNode = defineAsyncComponent(() => import('./NBTTemplateNode.vue'));
</script>

<template>
    <div v-if="!isError" class="nbt-tree"
         :class="{ 'nbt-template': isTemplate && !nbt.isRoot }"
         :style="{'margin-left': (!isTemplate && nbt.isRoot) ? '2em' : '0'}">
        <span>
            <span class="nbt-seg" v-for="(seg, index) in segs" :style="{
                'margin-right': index < segs.length - 1 ? '1em' : '0',
                'margin-left': seg === '=' ? '-2em' : '0',
                'color': seg === '__' || seg === '=' ? 'white' : 'black'
            }">{{ seg }}</span>
            <span v-for="(icon, index) in icons" :key="index" class="nbt-icon">
                <img :src="icon" alt="Icon" />
            </span>
            <span v-if="!icons.length">
                <img src="/nbt_sprites/any.svg" alt="NBT Icon" />
            </span>
            <strong>{{ nbt.name }}</strong>
            <span v-if="nbt.description !== '' ">：</span>
            <span>{{ nbt.description }}</span>
        </span>
        <!--继承-->
        <div v-if="extend.length">
            <template v-for="(child) in extend">
                <NBTTemplateNode :nbtObj="child" :is-extend="true"/>
            </template>
        </div>
        <!--子节点-->
        <div v-if="nbt.children?.length">
            <template v-for="(child, index) in getChildren()">
                <NBTNode v-if="child.children.length === 0" :nbtObj="child"
                         :is-last="index === nbt.children.length - 1"/>
                <div v-else-if="child.isTemplate" >
                    <NBTNode :nbt-obj="child" :is-last="index === nbt.children.length - 1" :is-template-input="false"/>
                    <NBTTemplateNode :nbtObj="child"
                                     :is-last="index === nbt.children.length - 1"/>
                </div>
                <NBTTree v-else-if="child.children.length !== 0" :nbtObj="child"
                         :is-last="index === nbt.children.length - 1"/>
            </template>
        </div>
    </div>
    <div v-if="isError" class="error-alert">
        <div class="error-header">NBT数据模板解析错误</div>
        <div class="error-content">呜呜，香草图书馆被玩坏了——这不是香草的问题，绝对不是！</div>
        <div class="error-content">
            <pre>{{errorMsg}}</pre>
        </div>
    </div>
</template>

<script>
import { compileString } from '../MCFPPNBTParser'
import NBTNode from "./NBTNode.vue";
import {NBT} from "../NBTStructure";

export default {
    name: "NBTTree",
    components: {
        NBTNode
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
            errorMsg: "",
            /** @type {NBT[]}*/
            extend: []
        };
    },
    created() {
        if(this.code){
            this.nbt = compileString(this.code).then(result => {
                this.nbt = result;
                //实例化NBT的继承
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
                this.isTemplate = this.nbt.isTemplate;
                this.icons = this.nbt.getIcon();
                this.nbt.gap = 0; // 初始化缩进
            }).catch(err => {
                this.isError = true
                this.errorMsg = err.message
                console.error(err)
            })
        } else if (this.nbtObj) {
            this.nbt = this.nbtObj;
            this.isTemplate = this.nbt.isTemplate;
            this.icons = this.nbt.getIcon();
            this.gap = this.nbt.gap;
            this.segs = [...(this.nbt.segs || []), this.isLast ? '└─' : '├─'];
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
    watch: {

    }
};
</script>