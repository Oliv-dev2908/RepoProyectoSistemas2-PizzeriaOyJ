<template>
  <el-container class="layout-container-demo" style="height: 100vh">
    <el-aside :class="{ 'collapsed': isCollapse }" :style="{ width: isCollapse ? '64px' : '200px' }">
      <el-scrollbar class="el-scrollbar-menu">
        <el-menu default-active="2" class="el-menu-vertical-demo" :collapse="isCollapse" @open="handleOpen"
          @close="handleClose" :collapse-transition="false" v-if="sidebarOpened">
          <el-menu-item index="1" @click="toggleDark()" center="true">
            <el-icon v-if="isDark">
              <Moon />
            </el-icon>
            <el-icon v-else>
              <Sunny />
            </el-icon>
            <span class="ml-2">{{ isDark ? 'Dark' : 'Light' }}</span>
          </el-menu-item>
          <el-sub-menu index="2">
            <template #title>
              <el-icon>
                <Location />
              </el-icon>
              <span>Navigator One</span>
            </template>
            <el-menu-item-group>
              <template #title><span>Group One</span></template>
              <el-menu-item index="2-1">item one</el-menu-item>
              <el-menu-item index="2-2">item two</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group Two">
              <el-menu-item index="2-3">item three</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="2-4">
              <template #title><span>item four</span></template>
              <el-menu-item index="2-4-1">item one</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-menu-item index="3">
            <el-icon>
              <Document />
            </el-icon>
            <template #title>Navigator Three</template>
          </el-menu-item>
          <el-menu-item index="/products/categoria">
            <el-icon>
              <Setting />
            </el-icon>
            <template #title>Navigator Four</template>
          </el-menu-item>
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
import { ref, onMounted, onUnmounted } from 'vue';
import { useCookie } from '#app';
import { Moon, Sunny } from '@element-plus/icons-vue';
import { Document, Location, Setting } from '@element-plus/icons-vue';
import { useDark } from '@vueuse/core'
import { useToggle } from '@vueuse/shared'

const isCollapse = ref(false);
const sidebarOpened = ref(true);
const themeCookie = useCookie('theme'); // Usar cookie para persistir el estado
const isDark = useDark({
  initialValue: themeCookie.value === 'dark', // Establecer el valor inicial basado en la cookie
});
console.log(isDark);
const toggleDark = useToggle(isDark)

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
/* Estilos generales */
.common-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-container {
  flex: 1;
  display: flex;
}

/* Estilos para el aside */
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

/* Estilos para el menú */
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