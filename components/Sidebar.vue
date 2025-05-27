<template>
  <el-container class="layout-container-demo" style="height: 100vh">
    <el-aside :class="{ 'collapsed': isCollapse }" :style="{ width: isCollapse ? '64px' : '200px' }">
      <el-scrollbar class="el-scrollbar-menu">
        <el-menu default-active="2" class="el-menu-vertical-demo" :collapse="isCollapse":collapse-transition="false" v-if="sidebarOpened">
          <el-menu-item @click="toggleDark()" center="true" index="#">
            <el-icon v-if="isDark">
              <ElementPlusIcons.Moon />
            </el-icon>
            <el-icon v-else>
              <ElementPlusIcons.Sunny />
            </el-icon>
            <span class="ml-2">{{ isDark ? 'Dark' : 'Light' }}</span>
          </el-menu-item>
          <el-menu-item v-if="filteredRoutes.length > 0" v-for="route in filteredRoutes" :key="route.path"
            :index="route.path"
            @click="navigateWithLoading(route.path)">
            <el-icon>
              <component :is="route.icon" />
            </el-icon>
            <template #title>{{ route.name }}</template>
          </el-menu-item>

          <el-sub-menu v-for="route in filteredRoutesChildren" v-if="filteredRoutesChildren.length > 0"
            :key="route.path":index="route.path">
            <template #title>
              <el-icon>
                <component :is="route.icon" />
              </el-icon>
              <span>{{ route.name }}</span>
            </template>
            <el-menu-item-group>
              <template #title><span>{{ route.name }}</span></template>
              <el-menu-item v-for="child in route.children":index="`/${route.path}/${child.path}`" @click="navigateWithLoading(`/${route.path}/${child.path}`)">
                {{ child.name }}
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-main>
        <el-scrollbar>
          
          <slot></slot>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useDark } from '@vueuse/core';
import { useCookie } from '#app';
import { ref, computed, onMounted, onUnmounted, markRaw } from 'vue';
import * as ElementPlusIcons from '@element-plus/icons-vue';
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs';
import { useRouter } from 'vue-router';
import { useAppRoutes } from './../client/compossables/useAppRoutes'
const { filteredRoutes, filteredRoutesChildren } = useAppRoutes()
//Pantalla de carga
const router = useRouter();
const navigateWithLoading = async (path) => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Loading...',
    background: 'rgba(0, 0, 0, 0.7)',
  });

  try {
    await router.push(path);
  } finally {
    loadingInstance.close();
  }
};
//Modo Oscuro
const themeCookie = useCookie('theme');
const isDark = useDark({
  initialValue: themeCookie.value
});
const toggleDark = () => {
  isDark.value = !isDark.value;
  themeCookie.value = isDark.value ? 'dark' : 'light';
  localStorage.setItem('dark-mode', isDark.value);
};
//Variable de router
const sidebarOpened = ref(true);
const isCollapse = ref(false);
//Pantalla
const checkScreenSize = () => {
  isCollapse.value = window.innerWidth < 768;
};
onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});
onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
});
</script>
<style scoped>
.common-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-container {
  flex: 1;
  display: flex;
}

.el-aside {
  background-color: var(--el-bg-color);
  transition: width 0.3s ease;
  overflow: hidden;
  height: 100%;
}

.el-aside.collapsed {
  width: 64px !important;
  height: 100%;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100vh;
}

.el-menu-vertical-demo.el-menu--collapse {
  min-height: 100vh;
}

.el-scrollbar-menu:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100vh;
}

.el-scrollbar-menu.el-menu--collapse {
  min-height: 100vh;
}
</style>
