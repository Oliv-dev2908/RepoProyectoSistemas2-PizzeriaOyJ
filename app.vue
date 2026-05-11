<script setup>
import { useRoute } from 'vue-router'; // Importa useRoute para acceder a la ruta actual
import Sidebar from './components/Sidebar.vue';
import { useConfiguracion } from './client/compossables/useConfiguracion';
import { onMounted, watchEffect, computed } from 'vue';

const { configuracion, fetchConfig, currentThemePalette } = useConfiguracion();
const route = useRoute(); // Obtiene la ruta actual

// Define las rutas donde la Sidebar no debe mostrarse
const noSidebarRoutes = ['/login', '/signup'];

// Verifica si la ruta actual está en la lista de rutas sin Sidebar
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
        
        const palette = currentThemePalette.value;
        const root = document.documentElement;
        
        // Sobrescribir variables de Catppuccin dinámicamente
        Object.entries(palette).forEach(([key, value]) => {
            root.style.setProperty(`--ctp-${key}`, value);
        });

        // Actualizar variables semánticas de la pizzería
        root.style.setProperty('--pizza-red', palette.red);
        root.style.setProperty('--pizza-orange', palette.peach);
        root.style.setProperty('--pizza-cream', configuracion.value.theme_flavor === 'latte' ? palette.rosewater : palette.surface0);
        root.style.setProperty('--pizza-brown', configuracion.value.theme_flavor === 'latte' ? palette.maroon : palette.text);
        root.style.setProperty('--pizza-bg', palette.base);
        root.style.setProperty('--pizza-card', configuracion.value.theme_flavor === 'latte' ? '#ffffff' : palette.surface1);
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
