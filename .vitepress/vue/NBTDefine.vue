<template>
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
import {NBT} from "../NBTStructure";

export default {
    name: "NBTDefine",
    props: {
        code: {
            type: String
        },
        nbtId: {
            type: String
        }
    },
    data() {
        return {
            isError: false,
            errorMsg: ""
        };
    },
    beforeCreate() {
        compileString(this.code).then(result => {
            let nbt = result;
            console.log(result)
            //实例化NBT的继承
            nbt.instantiateExtends(nbt.extends).then(() => {
                //实例化子类型
                nbt.instantiateChildren().then(() => {
                    NBT.addCache(this.id, nbt)
                }).catch(err => {
                    this.isError = true
                    this.errorMsg = err.message
                    console.error(err)
                })
            }).catch((err) => {
                this.isError = true
                this.errorMsg = err.message
                console.error(err)
            });
        }).catch(err => {
            this.isError = true
            this.errorMsg = err.message
            console.error(err)
        })
    }
};
</script>