<template>
    <aside class="my-sidebar">
        <div class="card actions-card">
            <div class="actions">
                <a href="../" target="_blank" class="action back-btn" rel="noopener noreferrer">
                    <svg viewBox="0 0 16 16" class="icon" aria-hidden="true"><path fill="currentColor" d="M5.5 3.5L4.5 4.5 8.0 8 4.5 11.5 5.5 12.5 10 8z"></path></svg>
                    <span>返回搜索</span>
                </a>
                <a :href="githubPath" target="_blank" class="action edit-btn" rel="noopener noreferrer">
                    <svg viewBox="0 0 16 16" class="icon" aria-hidden="true"><path fill="currentColor" d="M12.3 1.7a1 1 0 0 1 1.4 0l.6.6a1 1 0 0 1 0 1.4l-8.6 8.6a1 1 0 0 1-.5.3l-3 1a.5.5 0 0 1-.6-.6l1-3a1 1 0 0 1 .3-.5l8.6-8.6zM11.3 3L4 10.3 3 11l.7-1L12 3.7 11.3 3z"></path></svg>
                    <span>在 GitHub 编辑此页</span>
                </a>
            </div>
        </div>
        <RepoCard :repo="repo" />
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
    padding: 8px;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    background: #fff;
    color: #111;
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
    width: 100%;
    margin-bottom: 18px;
}

.actions-card {
    padding: 12px;
}

.actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.action {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 8px;
    text-decoration: none;
    border: 1px solid rgba(16,24,40,0.04);
    transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
}

.action .icon { width: 16px; height: 16px; display: inline-block; color: #374151 }

.action:hover { transform: translateY(-1px); box-shadow: 0 3px 6px rgba(16,24,40,0.08); }

.edit-btn { background: #eff8ff; border-color: rgba(6,95,212,0.12); }
.back-btn { background: #eff8ff; border-color: rgba(6,95,212,0.12); }

.edit-btn span, .back-btn span { font-weight: 500; font-size: 0.95rem }
</style>