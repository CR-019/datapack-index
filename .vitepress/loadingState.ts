import { ref, provide, inject, onUnmounted } from 'vue';
import {NBT} from "./NBTStructure";

const LOADING_KEY = Symbol('loading_state');

export function createLoadingState() {
    const loadedComponents = ref<Set<string>>(new Set());

    // 标记组件已加载
    const markLoaded = (name: string) => {
        loadedComponents.value.add(name);
    };

    // 检查组件是否已加载
    const isLoaded = (name: string) => {
        return loadedComponents.value.has(name);
    };

    // 检查多个组件是否都已加载，处理缺失组件
    const allLoaded = (names: string[]) => {
        // 如果没有依赖，直接返回true
        if (names.length === 0) return true;

        // 检查所有依赖组件是否都已加载
        return names.every(name => loadedComponents.value.has(name));
    };

    // 检查依赖组件是否存在（是否在页面上）
    const dependenciesExist = (names: string[]) => {
        // 如果没有依赖，直接返回true
        if (names.length === 0) return true;

        // 获取页面上所有可能的组件ID
        const allElements = Array.from(document.querySelectorAll('[data-component-id]'));
        const existingIds = allElements.map(el => el.getAttribute('data-component-id'));

        // 检查所有依赖组件是否都在页面上
        return names.every(name => existingIds.includes(name));
    };

    provide(LOADING_KEY, {
        markLoaded,
        isLoaded,
        allLoaded,
    });

    onUnmounted(() => {
        loadedComponents.value.clear();
    });
}

export function useLoadingState() {
    const state = inject<{
        markLoaded: (name: string) => void;
        isLoaded: (name: string) => boolean;
        allLoaded: (names: string[]) => boolean;
        dependenciesExist: (names: string[]) => boolean;
    }>(LOADING_KEY);

    if (!state) throw new Error('Loading state not initialized');
    return state;
}