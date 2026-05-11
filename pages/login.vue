<template>
  <div class="min-h-screen flex items-center justify-center bg-theme-bg transition-colors duration-300">
    <div class="bg-theme-card p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-theme">
      <!-- Sección de encabezado con logo y título pizzería -->
      <div class="text-center mb-6">
        <img
          :src="configuracion.logo_url"
          alt="Logo Pizzería" class="mx-auto mb-4 w-20 h-20 object-contain rounded-full border-4 border-ctp-red shadow-lg" />
        <h2 class="text-3xl font-bold text-theme-text font-pizza-title">{{ configuracion.nombre_pizzeria }}</h2>
        <p class="text-theme-secondary mt-1">¡Bienvenido de nuevo!</p>
      </div>

      <!-- Botones de login social -->
      <div class="space-y-3 mb-6">
        <button
          class="w-full btn-ctp !bg-theme-text !text-theme-bg flex items-center justify-center border border-theme hover:opacity-90 shadow-sm"
          @click="signInWithOAuth">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
            alt="Google" class="w-5 h-5 mr-3" />
          Continuar con Google
        </button>

        <button
          class="w-full btn-ctp bg-[#1877F2] !text-white flex items-center justify-center hover:opacity-90 shadow-sm"
          @click="signInWithFacebookAuth">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/2048px-2023_Facebook_icon.svg.png"
            alt="Facebook" class="w-5 h-5 mr-3" />
          Facebook
        </button>
      </div>

      <!-- Separador -->
      <div class="flex items-center my-6">
        <hr class="flex-grow border-t border-theme" />
        <span class="px-3 text-theme-secondary text-xs uppercase font-bold tracking-wider">o</span>
        <hr class="flex-grow border-t border-theme" />
      </div>

      <!-- Formulario de login -->
      <form @submit.prevent="signIn" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-semibold text-theme-text mb-1">
            Correo electrónico
          </label>
          <el-input v-model="email" id="email" type="email" placeholder="tu@correo.com" required />
        </div>

        <div>
          <label for="password" class="block text-sm font-semibold text-theme-text mb-1">
            Contraseña
          </label>
          <el-input v-model="password" id="password" type="password" placeholder="••••••••" show-password required />
        </div>

        <div v-if="errorMsg" class="text-ctp-red text-xs font-bold text-center">
          {{ errorMsg }}
        </div>

        <el-button type="primary" native-type="submit" class="w-full h-12 text-lg font-bold" :loading="loading">
          Iniciar Sesión
        </el-button>
      </form>

      <!-- Sección para redirigir al registro -->
      <div class="mt-8 text-center border-t border-theme pt-4">
        <p class="text-sm text-theme-secondary">
          ¿No tienes una cuenta?
          <button @click="irASignup"
            class="ml-1 text-ctp-blue hover:underline font-bold transition duration-200">
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'nuxt/app';
import { ref, onMounted } from 'vue';
import { useConfiguracion } from '@/client/compossables/useConfiguracion';

const { configuracion, fetchConfig } = useConfiguracion();
const client = useSupabaseClient();
const router = useRouter();
const email = ref("");
const password = ref(null);
const errorMsg = ref(null);
const loading = ref(false);

onMounted(async () => {
  await fetchConfig();
});

async function signIn() {
  loading.value = true;
  errorMsg.value = null;
  try {
    const { error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;
    const user = useSupabaseUser();
    const newUser = user.value;
    await fetch(`/api/user/loginsignup?uuid=${newUser.id}&name=${newUser.user_metadata.display_name}`);
    router.push("/about"); 
  } catch (error) {
    errorMsg.value = error.message;
  } finally {
    loading.value = false;
  }
}

const signInWithOAuth = async () => {
  const { error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/confirm`,
    },
  })
  if (error) console.log(error)
}

function irASignup() {
  router.push('/signup');
}

const signInWithFacebookAuth = async () => {
  const { error } = await client.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${window.location.origin}/confirm`,
    },
  });
  if (error) console.log(error);
};
</script>
