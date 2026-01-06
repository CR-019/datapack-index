<template>
    <aside class="my-sidebar">
        <div class="card">
            <a :href="githubPath" target="_blank">在Github上编辑此页</a>
        </div>
        <RepoCard :repo='this.repo'/>
    </aside>
</template>

<script>
import RepoCard from './RepoCard.vue';
import { useData, useRoute } from "vitepress";

export default { 
    name: 'SideCard',
    components: { RepoCard },
    data() {
        return {
            repo: "",
            info: null,
            route: ""
        }
    },

    mounted() {
        const { frontmatter } = useData();
        this.info = frontmatter.value || {};
        this.repo = this.info.repo;
    },

    setup() {
        const route = useRoute();
        const githubPath = route.path.replace(/^\/datapack-index\//, '').replace(/\.html$/, '.md').replace(/^\/+/, '')
        return { route: githubPath };
    },

    computed: {
        githubPath() {
            return `https://github.com/CR-019/datapack-index/blob/master/${this.route}` 
        } 
    }
}
</script>

<style scoped>
.my-sidebar {
    padding: 16px;
    margin-bottom: 100px;
}
.card {
    border: 1px solid #e6e6e6;
    border-radius: 8px;
    padding: 8px;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    background: #fff;
    color: #111;
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
    width: 100%;
    margin-bottom: 18px;
}
</style>