<template>
  <div>
    <p>Hi from {{ name }}</p>
    
    <!-- Botón de cierre de sesión -->
    <button 
      @click="logout"
      class="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-200"
    >
      Cerrar sesión
    </button>

    <button
      @click="categoria"
      class="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-200">
      Categorias  
    </button>

    <NLink to="/">
      Home page
    </NLink>
  </div>
</template>

<script setup>
import { useRouter } from 'nuxt/app';

const client = useSupabaseClient();
const router = useRouter();

async function logout() {
  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;
    router.push("/login"); // Redirige al login después de cerrar sesión
  } catch (error) {
    console.log(error);
  }
}

async function categoria() {
  try {
    await router.push("/products/categoria");
  } catch (error) {
    console.error("Error al redirigir a /products/categoria:", error.message);
  }
}
</script>

<script>
export default {
  asyncData() {
    return {
      name: process.static ? 'static' : (process.server ? 'server' : 'client')
    }
  },
  head: {
    title: 'About page'
  }
}
</script>
