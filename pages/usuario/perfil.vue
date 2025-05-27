<template>
  <center>
    <el-card style="width: 75vh; padding: 2rem;">
      <!-- Header con perfil -->
      <div class="flex items-center gap-6 mb-8">
        <img
          :src="fotoPerfil"
          alt="Foto de perfil"
          style="max-width: 10vh; max-height: 10vh; width: 10vh; height: 10vh;"
          class="rounded-full border-4 border-indigo-200 shadow-md object-cover"
        />
        <div>
          <h1 class="text-xl font-semibold text-gray-800">{{ nombreCompleto }}</h1>
          <p class="text-gray-500">{{ user?.email }}</p>
        </div>
      </div>

      <!-- Botones de navegación -->
      <div class="flex gap-4 justify-center mb-8">
        <button @click="cambiarSeccion('info')"
          :class="botonClase('info')">Ver Información</button>
        <button @click="cambiarSeccion('editar')"
          :class="botonClase('editar')">Actualizar Perfil</button>
        <button @click="cambiarSeccion('cuentas')"
          :class="botonClase('cuentas')">Cuentas Vinculadas</button>
      </div>

      <!-- Contenido dinámico -->
      <div>
        <template v-if="cargando">
          <p class="text-gray-500 text-center">Cargando...</p>
        </template>

        <template v-else>
          <!-- Sección: Información -->
          <template v-if="seccionActiva === 'info'">
            <p class="mt-2 text-sm text-white inline-block bg-indigo-500 px-3 py-1 rounded-full shadow">
              Rol: {{ rol }}
            </p>
            <div class="mt-6 text-left space-y-2 text-gray-700">
              <p><strong>Nickname:</strong> {{ nickname }}</p>
              <p><strong>Slug:</strong> {{ slug }}</p>
              <p><strong>Proveedor:</strong> {{ proveedor }}</p>
              <p><strong>Último ingreso:</strong> {{ ultimoIngreso }}</p>
            </div>
          </template>

          <!-- Sección: Actualizar -->
          <template v-else-if="seccionActiva === 'editar'">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Actualizar Perfil</h2>
            <p class="text-gray-600">Funcionalidad próximamente disponible.</p>
          </template>

          <!-- Sección: Cuentas -->
          <template v-else-if="seccionActiva === 'cuentas'">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Cuentas Vinculadas</h2>
            <div class="text-left space-y-2 text-gray-700">
              <p>
                <strong>Google:</strong>
                <span class="ml-2" :class="estadoProveedor('google')">{{ estadoTexto('google') }}</span>
              </p>
              <p>
                <strong>Facebook:</strong>
                <span class="ml-2" :class="estadoProveedor('facebook')">{{ estadoTexto('facebook') }}</span>
              </p>
              <p>
                <strong>Twitter:</strong>
                <span class="ml-2" :class="estadoProveedor('twitter')">{{ estadoTexto('twitter') }}</span>
              </p>
              <p>
                <strong>Email:</strong>
                <span class="ml-2" :class="estadoProveedor('email')">{{ estadoTexto('email') }}</span>
              </p>
            </div>
          </template>
        </template>
      </div>
    </el-card>
  </center>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSupabaseUser } from '#imports'

const user = useSupabaseUser()

const nombreCompleto = user.value?.user_metadata?.full_name || user.value?.user_metadata?.name || 'Usuario'
const fotoPerfil = user.value?.user_metadata?.avatar_url || user.value?.user_metadata?.picture || 'https://via.placeholder.com/96'
const rol = user.value?.user_metadata?.role || user.value?.role || 'Desconocido'
const nickname = user.value?.user_metadata?.nickname || 'Sin nickname'
const slug = user.value?.user_metadata?.slug || 'Sin slug'
const proveedor = user.value?.app_metadata?.provider || 'Desconocido'
const ultimoIngreso = user.value?.last_sign_in_at
  ? new Date(user.value.last_sign_in_at).toLocaleString()
  : 'Desconocido'

const seccionActiva = ref('info')
const cargando = ref(false)

function cambiarSeccion(seccion: string) {
  cargando.value = true
  setTimeout(() => {
    seccionActiva.value = seccion
    cargando.value = false
  }, 400)
}

function isProviderLinked(provider: string) {
  return user.value?.app_metadata?.providers.includes(provider)
}

function estadoProveedor(provider: string) {
  return isProviderLinked(provider) ? 'text-green-600' : 'text-gray-500'
}

function estadoTexto(provider: string) {
  return isProviderLinked(provider) ? 'Conectado' : 'No conectado'
}

// Clases para los botones activos
function botonClase(tipo: string) {
  return [
    'px-4 py-2 rounded-lg shadow transition',
    seccionActiva.value === tipo
      ? 'bg-indigo-500 text-white'
      : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
  ].join(' ')
}
</script>
