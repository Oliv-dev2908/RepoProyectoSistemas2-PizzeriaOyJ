<template>
  <el-container class="layout-container-demo" style="height: 100vh">
    <el-aside :class="{ 'collapsed': isCollapse }" :style="{ width: isCollapse ? '64px' : '200px' }">
      <el-scrollbar class="el-scrollbar-menu">
        <el-menu default-active="2" class="el-menu-vertical-demo" :collapse="isCollapse" :collapse-transition="false" v-if="sidebarOpened">
          <!-- Branding y Toggle Dark Mode -->
          <div class="p-4 flex flex-col items-center border-b border-theme mb-2" v-if="!isCollapse">
            <img :src="configuracion.logo_url" alt="Logo" class="w-16 h-16 object-contain rounded-full shadow-md border-2 border-ctp-red mb-2" />
            <span class="text-sm font-bold text-ctp-red text-center font-pizza-title">{{ configuracion.nombre_pizzeria }}</span>
          </div>

          <el-menu-item @click="toggleDark()" center="true" index="#">
            <el-icon v-if="isDark">
              <ElementPlusIcons.Moon />
            </el-icon>
            <el-icon v-else>
              <ElementPlusIcons.Sunny />
            </el-icon>
            <span class="ml-2">{{ isDark ? 'Dark' : 'Light' }}</span>
          </el-menu-item>

          <!-- Rutas Dinámicas -->
          <el-menu-item v-if="filteredRoutes.length > 0" v-for="route in filteredRoutes" :key="route.path"
            :index="route.path"
            @click="navigateWithLoading(route.path)">
            <el-icon>
              <component :is="route.icon" />
            </el-icon>
            <template #title>{{ route.name }}</template>
          </el-menu-item>

          <!-- Configuración de Marca (Admin Only) -->
          <el-menu-item v-if="userRole === 'admin'" @click="navigateWithLoading('/admin/configuracion')" index="/admin/configuracion">
            <el-icon><ElementPlusIcons.Setting /></el-icon>
            <template #title>Configuración de Marca</template>
          </el-menu-item>

          <!-- Cerrar Sesión -->
          <el-menu-item @click="handleLogout" index="/logout" class="!text-ctp-red">
            <el-icon><ElementPlusIcons.SwitchButton /></el-icon>
            <template #title>Cerrar Sesión</template>
          </el-menu-item>

          <el-sub-menu v-for="route in filteredRoutesChildren" v-if="filteredRoutesChildren.length > 0"
            :key="route.path" :index="route.path">
            <template #title>
              <el-icon>
                <component :is="route.icon" />
              </el-icon>
              <span>{{ route.name }}</span>
            </template>
            <el-menu-item-group>
              <template #title><span>{{ route.name }}</span></template>
              <el-menu-item v-for="child in route.children" :index="`/${route.path}/${child.path}`" @click="navigateWithLoading(`/${route.path}/${child.path}`)">
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
import * as ElementPlusIcons from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { useAppRoutes } from './../client/compossables/useAppRoutes'
import { useUserRole } from './../client/compossables/useUserRole'
import { useConfiguracion } from './../client/compossables/useConfiguracion'
import { ElLoading } from 'element-plus';

const { filteredRoutes, filteredRoutesChildren } = useAppRoutes()
const { userRole } = useUserRole()
const { configuracion } = useConfiguracion()
const supabase = useSupabaseClient()
const router = useRouter();

//Pantalla de carga
const navigateWithLoading = async (path) => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Cargando...',
    background: 'rgba(0, 0, 0, 0.7)',
  });

  try {
    await router.push(path);
  } finally {
    loadingInstance.close();
  }
};

const handleLogout = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Cerrando sesión...',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  try {
    await supabase.auth.signOut()
    router.push('/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  } finally {
    loadingInstance.close()
  }
}

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

//Variables de visualización
const sidebarOpened = ref(true);
const isCollapse = ref(false);

//Responsividad
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
