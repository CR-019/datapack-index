# 沙盒

香草图书馆御用沙盒及涂鸦墙

---

<script setup>
    import NBTNode from '/.vitepress/vue/NBTNode.vue'
</script>

<NBTNode>

@Desc<"这是一个测试数据结构">
data Test {
    @Desc<"这是一个测试元素">
    a as int;
    b as string;
    c as test:test;
    @Desc<"这是一个测试嵌套元素">
    d as data {
        @Desc<"这是一个测试嵌套子元素">
        child as int;
        d as data {
        @Desc<"这是一个测试嵌套子元素">
        child as int;
        qwq as float;
    };
    };
    e as list\<qwq>;
}

</NBTNode>
