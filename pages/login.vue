<template>
  <div class="min-h-screen flex items-center justify-center bg-black">
    <div class="bg-[#121212] p-8 rounded-lg shadow-lg w-full max-w-sm">
      <!-- Sección de encabezado con logo y título pizzería -->
      <div class="text-center mb-6">
        <img
          src="https://www.creativefabrica.com/wp-content/uploads/2022/04/17/Pizza-Logo-Design-Graphics-29132095-1.jpg"
          alt="Logo Pizzería" class="mx-auto mb-4 w-16 h-16 object-contain rounded-full border-2 border-white" />
        <h2 class="text-3xl font-bold text-white">Bienvenido a Bella Napoli</h2>
      </div>

      <!-- Botones de login social con toques pizzería -->
      <div class="space-y-4 mb-6">
        <button
          class="w-full flex items-center justify-center py-2 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gradient-to-r from-red-500 to-yellow-500 text-black"
          @click="signInWithOAuth">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
            alt="Google" class="w-5 h-5 mr-2" />
          Iniciar sesión con Google
        </button>

        <button
          class="w-full flex items-center justify-center py-2 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gradient-to-r from-green-500 to-red-500 text-black"
          @click="signInWithFacebookAuth">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/2048px-2023_Facebook_icon.svg.png"
            alt="Facebook" class="w-5 h-5 mr-2" />
          Iniciar sesión con Facebook
        </button>

        <button
          class="w-full flex items-center justify-center py-2 rounded-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-gradient-to-r from-yellow-500 to-green-500 text-black"
          @click="signInWithTwitterAuth">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/2491px-Logo_of_Twitter.svg.png"
            alt="Twitter" class="w-5 h-5 mr-2" />
          Iniciar sesión con Twitter
        </button>
      </div>

      <!-- Separador -->
      <div class="flex items-center my-4">
        <hr class="flex-grow border-t border-gray-700" />
        <span class="px-2 text-gray-400">o</span>
        <hr class="flex-grow border-t border-gray-700" />
      </div>

      <!-- Formulario de login -->
      <form @submit.prevent="signIn">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-300">
            Correo electrónico
          </label>
          <input type="email" id="email" v-model="email"
            class="mt-1 p-2 w-full border border-gray-700 rounded-md bg-black text-white focus:border-green-500 focus:ring-green-500 transition duration-300"
            placeholder="example@correo.com" required />
        </div>

        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-300">
            Contraseña
          </label>
          <input type="password" id="password" v-model="password"
            class="mt-1 p-2 w-full border border-gray-700 rounded-md bg-black text-white focus:border-green-500 focus:ring-green-500 transition duration-300"
            placeholder="******" required />
        </div>

        <div v-if="errorMsg" class="text-red-500 text-sm mb-4">
          {{ errorMsg }}
        </div>

        <button type="submit"
          class="w-full bg-green-500 text-black py-2 rounded-md hover:bg-green-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500">
          Iniciar Sesión
        </button>
      </form>

      <!-- Sección para redirigir al registro -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-400">
          ¿No tienes una cuenta?
          <button @click="irASignup"
            class="ml-2 text-green-500 hover:text-green-400 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500">
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

async function signIn() {
  try {
    const { error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;
    const user = useSupabaseUser();
    const newUser = user.value;
    await fetch(`/api/user/loginsignup?uuid=${newUser.id}&name=${newUser.user_metadata.display_name}`);
    router.push("/about"); // Redirige a la página "about" después del login exitoso
  } catch (error) {
    errorMsg.value = error.message; // Muestra el mensaje de error si la autenticación falla
  }
}

const signInWithOAuth = async () => {
  const { error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:3000/confirm',
    },
  })
  if (error) console.log(error)
}

function irASignup() {
  router.push('/signup'); // Ajusta la ruta a tu página de registro
}
const signInWithTwitterAuth = async () => {
  const { error } = await client.auth.signInWithOAuth({
    provider: 'twitter',
    options: {
      redirectTo: 'http://localhost:3000/confirm',
    },
  })
  if (error) console.log(error)
}
const signInWithFacebookAuth = async () => {
  const { error } = await client.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: 'http://localhost:3000/confirm',
    },
  });
  if (error) console.log(error);
};

</script>

<style scoped>
/* Animación en el logo */
img[alt="Logo Pizzería"] {
  transition: transform 0.3s;
}

img[alt="Logo Pizzería"]:hover {
  transform: rotate(360deg);
}
</style>
