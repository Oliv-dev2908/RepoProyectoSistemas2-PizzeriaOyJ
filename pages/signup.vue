<template>
  <div class="min-h-screen flex items-center justify-center bg-black">
    <div class="bg-[#121212] p-8 rounded-lg shadow-lg w-full max-w-sm">
      <div class="text-center mb-6">
        <img
          src="https://www.creativefabrica.com/wp-content/uploads/2022/04/17/Pizza-Logo-Design-Graphics-29132095-1.jpg"
          alt="Logo Pizzería"
          class="mx-auto mb-4 w-16 h-16 object-contain rounded-full border-2 border-white"
        />
        <h2 class="text-3xl font-bold text-white">Crear Cuenta</h2>
      </div>

      <form @submit.prevent="signUp">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-300">Correo electrónico</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="mt-1 p-2 w-full border border-gray-700 rounded-md bg-black text-white focus:border-green-500 focus:ring-green-500 transition duration-300"
            placeholder="example@correo.com"
            required
          />
        </div>

        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-300">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="mt-1 p-2 w-full border border-gray-700 rounded-md bg-black text-white focus:border-green-500 focus:ring-green-500 transition duration-300"
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
          class="w-full bg-gradient-to-r from-red-500 to-yellow-500 text-black py-2 rounded-md hover:opacity-90 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Crear Cuenta
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-400">
          ¿Ya tienes una cuenta?
          <button
            @click="irALogin"
            class="ml-2 text-green-500 hover:text-green-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
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
        errorMsg.value = error.message; // Muestra el mensaje de error si algo fall
    }
}

function irALogin() {
  router.push('/login');
}
</script>

<style scoped>
img[alt="Logo Pizzería"] {
  transition: transform 0.3s;
}
img[alt="Logo Pizzería"]:hover {
  transform: rotate(360deg);
}
</style>
