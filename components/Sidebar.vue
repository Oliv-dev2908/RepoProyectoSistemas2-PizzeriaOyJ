<template>
  <el-container class="layout-container-demo" style="height: 100vh">
    <el-aside :class="{ 'collapsed': isCollapse }" :style="{ width: isCollapse ? '64px' : '200px' }">
      <el-scrollbar class="el-scrollbar-menu">
        <el-menu default-active="2" class="el-menu-vertical-demo" :collapse="isCollapse" @open="handleOpen"
          @close="handleClose" :collapse-transition="false" v-if="sidebarOpened" router>
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
            :index="route.path">
            <el-icon>
              <component :is="route.icon"/>
            </el-icon>
            <template #title>{{ route.name }}</template>
          </el-menu-item>

          <el-sub-menu v-for="route in filteredRoutesChildren" v-if="filteredRoutesChildren.length > 0"
            :key="route.path" :index="route.path">
            <template #title>
              <el-icon>
                <component :is="route.icon"/>
              </el-icon>
              <span>{{ route.name }}</span>
            </template>
            <el-menu-item-group>
              <template #title><span>{{route.name}}</span></template>
              <el-menu-item v-for="child in route.children" :index="`/${route.path}/${child.path}`">
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useUserRole } from './../client/compossables/useUserRole';
import * as ElementPlusIcons from '@element-plus/icons-vue';
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs';

const themeCookie = useCookie('theme');
const isDark = useDark({
  initialValue: themeCookie.value
});

const sidebarOpened = ref(true);
const isCollapse = ref(false);
const { userRole } = useUserRole(); // Accede al rol del usuario desde el composable

const routes = ref([
  {
    path: '/user',
    name: 'User ',
    icon: ElementPlusIcons.UserFilled,
    roles: ['comun'],
    children: [],
  },
  {
    path: 'products',
    name: 'UserPaths ',
    icon: ElementPlusIcons.KnifeFork,
    roles: ['comun'],
    children: [
      {
        path: 'tamano',
        name: 'Sizes',
        roles: ['comun'],
      },
      {
        path: 'categoria',
        name: 'Category',
        roles: ['comun'],
      },
    ],
  },
  {
    path: '/products',
    name: 'Products',
    icon: ElementPlusIcons.KnifeFork,
    roles: ['admin'],
    children: [
      {
        path: 'tamanos',
        name: 'Sizes',
        roles: ['admin'],
      },
      {
        path: 'categoria',
        name: 'Category',
        roles: ['admin'],
      },
    ],
  },
]);

const filteredRoutes = computed(() => {
  return routes.value.filter(route => {
    return !route.roles || route.roles.includes(userRole.value) && route.children.length == 0;
  });
});
console.log(filteredRoutes.value[0].icon.setup);
const filteredRoutesChildren = computed(() => {
  return routes.value.filter(route => {
    return !route.roles || route.roles.includes(userRole.value) && route.children.length > 0;
  })
})
const toggleDark = () => {
  isDark.value = !isDark.value;
  themeCookie.value = isDark.value ? 'dark' : 'light';
  localStorage.setItem('dark-mode', isDark.value);
};

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
};

const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};

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