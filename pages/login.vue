<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
      <h2 class="text-2xl font-bold text-center text-gray-700 mb-6">Iniciar Sesión</h2>

      <form @submit.prevent="signIn">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="example@correo.com"
            required
          />
        </div>

        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="******"
            required
          />
        </div>

        <div v-if="errorMsg" class="text-red-500 text-sm mb-4">
          {{ errorMsg }}
        </div>

        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Iniciar Sesión
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-500">
          ¿No tienes una cuenta?
          <button
            @click="irASignup"
            class="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'nuxt/app';
import { ref } from 'vue';

const client = useSupabaseClient();
const router = useRouter();
const email = ref("");
const password = ref(null);
const errorMsg = ref(null);

async function signIn(){
    try {
        const { error } = await client.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        });
        if (error) throw error;
        router.push("/about"); // Redirige a la página "about" después del login exitoso
    } catch (error) {
        errorMsg.value = error.message; // Muestra el mensaje de error si la autenticación falla
    }
}

function irASignup() {
  router.push('/signup'); // Ajusta la ruta a tu página de registro
}
</script>

<style scoped>
/* Estilos opcionales */
</style>