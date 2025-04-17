<script setup>
import { useRoute } from 'vue-router'; // Importa useRoute para acceder a la ruta actual
import Sidebar from './components/Sidebar.vue';

const route = useRoute(); // Obtiene la ruta actual

// Define las rutas donde la Sidebar no debe mostrarse
const noSidebarRoutes = ['/login', '/signup'];

// Verifica si la ruta actual está en la lista de rutas sin Sidebar
const showSidebar = computed(() => {
    return !noSidebarRoutes.includes(route.path);
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
