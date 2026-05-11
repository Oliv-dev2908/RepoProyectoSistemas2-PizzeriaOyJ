<script setup>
import { useRoute } from 'vue-router';
import { onMounted, watchEffect, computed } from 'vue';
import Sidebar from './components/Sidebar.vue';
import { useConfiguracion } from './client/compossables/useConfiguracion';

const { configuracion, fetchConfig, currentThemePalette } = useConfiguracion();
const route = useRoute();

// Define las rutas donde la Sidebar no debe mostrarse
const noSidebarRoutes = ['/login', '/signup'];

const showSidebar = computed(() => {
    return !noSidebarRoutes.includes(route.path);
});

onMounted(async () => {
    await fetchConfig();
});

// Inyección dinámica de variables CSS y Título (Paleta Única)
watchEffect(() => {
    if (process.client) {
        document.title = configuracion.value.nombre_pizzeria;
        
        // 1. Obtener paleta base
        const palette = { ...currentThemePalette.value };
        
        // 2. Mezclar con sobrescrituras personalizadas
        const customOverrides = configuracion.value.custom_colors;
        if (customOverrides) {
            Object.entries(customOverrides).forEach(([key, value]) => {
                if (value && value !== '') palette[key] = value;
            });
        }

        const root = document.documentElement;
        
        // 3. Inyectar variables de Catppuccin / Base
        Object.entries(palette).forEach(([key, value]) => {
            root.style.setProperty(`--ctp-${key}`, value);
        });

        // 4. Actualizar variables semánticas de la pizzería
        // Estas variables rigen los componentes personalizados y Element Plus
        root.style.setProperty('--pizza-red', palette.red);
        root.style.setProperty('--pizza-orange', palette.peach);
        root.style.setProperty('--pizza-cream', palette.rosewater || palette.surface0);
        root.style.setProperty('--pizza-brown', palette.text);
        root.style.setProperty('--pizza-bg', palette.base);
        root.style.setProperty('--pizza-card', palette.mantle || palette.surface1);
        
        // 5. Semantic Theme Colors (Unificados)
        root.style.setProperty('--theme-text', palette.text);
        root.style.setProperty('--theme-text-secondary', palette.subtext0 || palette.text);
        root.style.setProperty('--theme-bg', palette.base);
        root.style.setProperty('--theme-surface', palette.surface0 || palette.base);
        root.style.setProperty('--theme-card', palette.mantle || palette.surface1);
        root.style.setProperty('--theme-border', palette.surface1 || palette.surface0);

        // 6. Eliminar rastro de modo oscuro para evitar conflictos
        root.classList.remove('dark');
    }
});
</script>

<template>
    <div>
        <Sidebar v-if="showSidebar">
            <NuxtPage />
        </Sidebar>

        <NuxtPage v-else />
    </div>
</template>
