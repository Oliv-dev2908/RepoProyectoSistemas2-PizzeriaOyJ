<script setup>
import { useRoute } from 'vue-router';
import { onMounted, watchEffect, computed } from 'vue';
import { useDark } from '@vueuse/core';
import Sidebar from './components/Sidebar.vue';
import { useConfiguracion } from './client/compossables/useConfiguracion';

const { configuracion, fetchConfig, currentThemePalette } = useConfiguracion();
const isDark = useDark();
const route = useRoute();

// Define las rutas donde la Sidebar no debe mostrarse
const noSidebarRoutes = ['/login', '/signup'];

const showSidebar = computed(() => {
    return !noSidebarRoutes.includes(route.path);
});

onMounted(async () => {
    await fetchConfig();
});

// Inyección dinámica de variables CSS y Título
watchEffect(() => {
    if (process.client) {
        document.title = configuracion.value.nombre_pizzeria;
        
        const palette = { ...currentThemePalette.value };
        const customOverrides = isDark.value 
            ? configuracion.value.custom_colors_dark 
            : configuracion.value.custom_colors_light;

        // Aplicar sobrescrituras personalizadas sobre la paleta base
        if (customOverrides) {
            Object.entries(customOverrides).forEach(([key, value]) => {
                if (value && value !== '') palette[key] = value;
            });
        }

        const root = document.documentElement;
        
        // Sobrescribir variables de Catppuccin dinámicamente
        Object.entries(palette).forEach(([key, value]) => {
            root.style.setProperty(`--ctp-${key}`, value);
        });

        // Actualizar variables semánticas de la pizzería
        root.style.setProperty('--pizza-red', palette.red);
        root.style.setProperty('--pizza-orange', palette.peach);
        root.style.setProperty('--pizza-cream', !isDark.value ? palette.rosewater : palette.surface0);
        root.style.setProperty('--pizza-brown', !isDark.value ? palette.maroon : palette.text);
        root.style.setProperty('--pizza-bg', palette.base);
        root.style.setProperty('--pizza-card', !isDark.value ? '#ffffff' : palette.surface1);
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
