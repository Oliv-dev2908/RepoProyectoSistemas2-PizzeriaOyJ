<template>
  <div class="min-h-screen flex items-center justify-center bg-theme-bg transition-colors duration-300">
    <div class="bg-theme-card p-8 rounded-2xl shadow-2xl w-full max-w-md border border-theme">
      <div class="text-center mb-8">
        <img
          :src="configuracion.logo_url"
          alt="Logo Pizzería"
          class="mx-auto mb-4 w-20 h-20 object-contain rounded-full border-4 border-ctp-red shadow-lg"
        />
        <h2 class="text-3xl font-bold text-theme-text font-pizza-title">{{ configuracion.nombre_pizzeria }}</h2>
        <p class="text-theme-secondary mt-2">Crea tu cuenta y empieza a disfrutar</p>
      </div>

      <form @submit.prevent="signUp" class="space-y-5">
        <div>
          <label for="name" class="block text-sm font-semibold text-theme-text mb-1">Nombre de Usuario</label>
          <el-input
            id="name"
            v-model="name"
            placeholder="Tu nombre o apodo"
            required
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-semibold text-theme-text mb-1">Correo electrónico</label>
          <el-input
            type="email"
            id="email"
            v-model="email"
            placeholder="ejemplo@correo.com"
            required
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-semibold text-theme-text mb-1">Contraseña</label>
          <el-input
            type="password"
            id="password"
            v-model="password"
            placeholder="Mínimo 6 caracteres"
            show-password
            required
          />
        </div>

        <div v-if="errorMsg" class="text-ctp-red text-xs font-bold text-center bg-ctp-red/10 p-2 rounded">
          {{ errorMsg }}
        </div>

        <div v-if="succesMsg" class="text-ctp-green text-xs font-bold text-center bg-ctp-green/10 p-2 rounded">
          {{ succesMsg }}
        </div>

        <el-button
          type="primary"
          native-type="submit"
          class="w-full h-11 text-lg font-bold pulse-button"
          :loading="loading"
        >
          Crear Cuenta
        </el-button>
      </form>

      <div class="mt-8 text-center border-t border-theme pt-4">
        <p class="text-sm text-theme-secondary">
          ¿Ya tienes una cuenta?
          <button
            @click="irALogin"
            class="ml-1 text-ctp-blue hover:underline font-bold transition duration-200"
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'nuxt/app';
import { useConfiguracion } from '@/client/compossables/useConfiguracion';

const { configuracion, fetchConfig } = useConfiguracion();
const client = useSupabaseClient();
const router = useRouter();
const email = ref("");
const name = ref("");
const password = ref(null);
const errorMsg = ref(null);
const succesMsg = ref(null);
const loading = ref(false);

onMounted(async () => {
  await fetchConfig();
});

async function signUp(){
    loading.value = true;
    errorMsg.value = null;
    succesMsg.value = null;
    try {
        const { data, error } = await client.auth.signUp({
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
        succesMsg.value = "¡Registro exitoso! Revisa tu email para confirmar tu cuenta.";
    } catch (error) {
        errorMsg.value = error.message; 
    } finally {
        loading.value = false;
    }
}

function irALogin() {
  router.push('/login');
}
</script>
