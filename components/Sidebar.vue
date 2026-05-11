<template>
  <el-container class="layout-container-demo">
    <!-- Botón Toggle para Móvil (Flotante) -->
    <button v-if="isMobile" class="sidebar-toggle-btn" @click="toggleMobileSidebar">
      <el-icon v-if="!isMobileVisible"><ElementPlusIcons.Menu /></el-icon>
      <el-icon v-else><ElementPlusIcons.Close /></el-icon>
    </button>

    <!-- Overlay de Fondo para Móvil -->
    <div 
      v-if="isMobile && isMobileVisible" 
      class="fixed inset-0 bg-black/60 z-[999] transition-opacity duration-300"
      @click="isMobileVisible = false"
    ></div>

    <!-- Sidebar con comportamiento responsivo -->
    <el-aside 
      :class="{ 
        'collapsed': isCollapse && !isMobile, 
        'mobile-visible': isMobileVisible && isMobile 
      }" 
      :style="{ width: (isCollapse && !isMobile) ? '64px' : '240px' }"
    >
      <el-scrollbar class="el-scrollbar-menu">
        <el-menu 
          default-active="2" 
          class="el-menu-vertical-demo" 
          :collapse="isCollapse && !isMobile" 
          :collapse-transition="false" 
          v-if="sidebarOpened"
        >
          <!-- Branding -->
          <div class="p-6 flex flex-col items-center border-b border-theme mb-4" v-if="!isCollapse || isMobile">
            <img :src="configuracion.logo_url" alt="Logo" class="w-20 h-20 object-contain rounded-full shadow-lg border-4 border-ctp-red mb-3" />
            <span class="text-sm font-bold text-ctp-red text-center font-pizza-title">{{ configuracion.nombre_pizzeria }}</span>
          </div>

          <!-- Rutas Dinámicas -->
          <el-menu-item v-for="route in filteredRoutes" :key="route.path" :index="route.path" @click="navigateAndClose(route.path)">
            <el-icon><component :is="route.icon" /></el-icon>
            <template #title>{{ route.name }}</template>
          </el-menu-item>

          <!-- Configuración de Marca (Admin Only) -->
          <el-menu-item v-if="userRole === 'admin'" @click="navigateAndClose('/admin/configuracion')" index="/admin/configuracion">
            <el-icon><ElementPlusIcons.Setting /></el-icon>
            <template #title>Personalización</template>
          </el-menu-item>

          <el-sub-menu v-for="route in filteredRoutesChildren" :key="route.path" :index="route.path">
            <template #title>
              <el-icon><component :is="route.icon" /></el-icon>
              <span>{{ route.name }}</span>
            </template>
            <el-menu-item v-for="child in route.children" :key="child.path" :index="`/${route.path}/${child.path}`" @click="navigateAndClose(`/${route.path}/${child.path}`)">
              {{ child.name }}
            </el-menu-item>
          </el-sub-menu>

          <div class="flex-grow"></div>

          <!-- Cerrar Sesión -->
          <el-menu-item @click="handleLogout" index="/logout" class="!text-ctp-red !mt-10 border-t border-theme">
            <el-icon><ElementPlusIcons.SwitchButton /></el-icon>
            <template #title>Cerrar Sesión</template>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container class="flex-1 overflow-hidden">
      <el-main class="h-full w-full">
        <el-scrollbar>
          <div class="p-4 sm:p-6 md:p-8 lg:p-10 pt-20 sm:pt-6">
            <slot></slot>
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
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
    console.error('Error logout:', error)
  } finally {
    loadingInstance.close()
  }
}

const toggleMobileSidebar = () => {
  isMobileVisible.value = !isMobileVisible.value;
};

const checkScreenSize = () => {
  const width = window.innerWidth;
  isMobile.value = width < 768;
  if (!isMobile.value) {
    isMobileVisible.value = false;
    isCollapse.value = width < 1024;
  } else {
    isCollapse.value = false;
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
