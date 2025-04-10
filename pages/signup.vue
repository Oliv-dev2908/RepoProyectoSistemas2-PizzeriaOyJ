<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
      <h2 class="text-2xl font-bold text-center text-gray-700 mb-6">Crear Cuenta</h2>

      <form @submit.prevent="signUp">
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

        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
          <input
            type="name"
            id="name"
            v-model="name"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="User Name"
            required
          />
        </div>


        <div v-if="errorMsg" class="text-red-500 text-sm mb-4">
          {{ errorMsg }}
        </div>

        <div v-if="succesMsg" class="text-green-500 text-sm mb-4">
          {{ succesMsg }}
        </div>

        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Crear Cuenta
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-500">
          ¿Ya tienes una cuenta?
          <button
            @click="irALogin"
            class="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Volver a Iniciar Sesión
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'nuxt/app';

const client = useSupabaseClient();
const router = useRouter();
const email = ref("");
const name = ref("");
const password = ref(null);
const errorMsg = ref(null);
const succesMsg = ref(null);

async function signUp(){
    try {
        var { data, error } = await client.auth.signUp({
            email: email.value,
            password: password.value,
            options: {
                data: {
                    display_name: name.value,
                }
            }
        });
        if (error){
          throw error;
        }
        const { errorUserName } = await client.auth.updateUser({ data });
        succesMsg.value = "Check your email to confirm your account"; // Mensaje de éxito
    } catch (error) {
        errorMsg.value = error.message; // Muestra el mensaje de error si algo falla
    }
}

function irALogin() {
  router.push('/login'); // Ajusta la ruta a tu página de inicio de sesión
}
</script>

<style scoped>
/* Estilos opcionales */
</style>