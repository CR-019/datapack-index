# 沙盒

香草图书馆御用沙盒及涂鸦墙

---

<script setup>
    import NBTTree from '/.vitepress/vue/NBTTree.vue'
</script>

<NBTTree code='
@Desc<"这是一个测试数据结构">
data Test: minecraft:Item {
    @Desc<"这是一个测试元素">
    a as int;
    b as string;
    c as minecraft:Item; 
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
    e as list<minecraft:Item>;
    f as list<data {
        @Desc<"这是一个测试嵌套子元素">
        child as int;        
    }>;
}'
/>