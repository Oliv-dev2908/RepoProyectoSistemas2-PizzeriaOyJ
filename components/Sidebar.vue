<template>
  <el-container class="layout-container-demo">
    <!-- Botón Toggle para Móvil -->
    <button class="sidebar-toggle-btn" @click="toggleMobileSidebar">
      <el-icon v-if="!isMobileVisible"><ElementPlusIcons.Menu /></el-icon>
      <el-icon v-else><ElementPlusIcons.Close /></el-icon>
    </button>

    <!-- Sidebar con comportamiento responsivo -->
    <el-aside 
      :class="{ 
        'collapsed': isCollapse && !isMobile, 
        'mobile-visible': isMobileVisible && isMobile 
      }" 
      :style="{ width: (isCollapse && !isMobile) ? '64px' : (isMobile ? '240px' : '200px') }"
    >
      <el-scrollbar class="el-scrollbar-menu">
        <el-menu default-active="2" class="el-menu-vertical-demo" 
          :collapse="isCollapse && !isMobile" 
          :collapse-transition="false" 
          v-if="sidebarOpened"
        >
          <!-- Branding -->
          <div class="p-4 flex flex-col items-center border-b border-theme mb-2" v-if="!isCollapse || isMobile">
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
            <span class="ml-2">{{ isDark ? 'Oscuro' : 'Claro' }}</span>
          </el-menu-item>

          <!-- Rutas Dinámicas -->
          <el-menu-item v-if="filteredRoutes.length > 0" v-for="route in filteredRoutes" :key="route.path"
            :index="route.path"
            @click="navigateAndClose(route.path)">
            <el-icon>
              <component :is="route.icon" />
            </el-icon>
            <template #title>{{ route.name }}</template>
          </el-menu-item>

          <!-- Configuración de Marca (Admin Only) -->
          <el-menu-item v-if="userRole === 'admin'" @click="navigateAndClose('/admin/configuracion')" index="/admin/configuracion">
            <el-icon><ElementPlusIcons.Setting /></el-icon>
            <template #title>Configuración de Marca</template>
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
              <el-menu-item v-for="child in route.children" :key="child.path" :index="`/${route.path}/${child.path}`" @click="navigateAndClose(`/${route.path}/${child.path}`)">
                {{ child.name }}
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>

          <!-- Espaciador -->
          <div class="flex-grow"></div>

          <!-- Cerrar Sesión -->
          <el-menu-item @click="handleLogout" index="/logout" class="!text-ctp-red mt-auto border-t border-theme">
            <el-icon><ElementPlusIcons.SwitchButton /></el-icon>
            <template #title>Cerrar Sesión</template>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container class="relative">
      <!-- Overlay para móvil cuando sidebar está abierto -->
      <div v-if="isMobile && isMobileVisible" @click="isMobileVisible = false" 
        class="fixed inset-0 bg-black/50 z-[999] transition-opacity"></div>
      
      <el-main>
        <el-scrollbar>
          <div class="p-4 sm:p-6 lg:p-8 pt-16 sm:pt-6">
            <slot></slot>
          </div>
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

const isMobile = ref(false);
const isMobileVisible = ref(false);
const sidebarOpened = ref(true);
const isCollapse = ref(false);

//Pantalla de carga y navegación
const navigateAndClose = async (path) => {
  if (isMobile.value) isMobileVisible.value = false;
  
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
  if (isMobile.value) isMobileVisible.value = false;
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

const toggleMobileSidebar = () => {
  isMobileVisible.value = !isMobileVisible.value;
};

//Responsividad
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
  if (!isMobile.value) {
    isMobileVisible.value = false;
    isCollapse.value = window.innerWidth < 1024; // Auto-colapsar en tablets medianas
  } else {
    isCollapse.value = false; // En móvil siempre ancho completo cuando se ve
  }
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
});
</script>
