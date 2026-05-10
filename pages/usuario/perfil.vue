<template>
  <center>
    <el-card style="width: 75vh; padding: 2rem;">
      <!-- Header con perfil -->
      <div class="flex items-center gap-6 mb-8">
        <img
          :src="fotoPerfil"
          alt="Foto de perfil"
          style="max-width: 10vh; max-height: 10vh; width: 10vh; height: 10vh;"
          class="rounded-full border-4 border-theme shadow-md object-cover"
        />
        <div class="text-left">
          <h1 class="text-xl font-semibold text-theme-text">{{ nombreCompleto }}</h1>
          <p class="text-theme-secondary">{{ user?.email }}</p>
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
          <p class="text-theme-secondary text-center">Cargando...</p>
        </template>

        <template v-else>
          <!-- Sección: Información -->
          <template v-if="seccionActiva === 'info'">
            <div class="text-left">
              <p class="mt-2 text-sm text-theme-bg inline-block bg-ctp-mauve px-3 py-1 rounded-full shadow font-bold">
                Rol: {{ rol }}
              </p>
            </div>
            <div class="mt-6 text-left space-y-2 text-theme-text">
              <p><strong>Nickname:</strong> {{ nickname }}</p>
              <p><strong>Slug:</strong> {{ slug }}</p>
              <p><strong>Proveedor:</strong> {{ proveedor }}</p>
              <p><strong>Último ingreso:</strong> {{ ultimoIngreso }}</p>
            </div>
          </template>

          <!-- Sección: Actualizar -->
          <template v-else-if="seccionActiva === 'editar'">
            <h2 class="text-lg font-semibold text-theme-text mb-4 text-left">Actualizar Perfil</h2>
            <p class="text-theme-secondary text-left">Funcionalidad próximamente disponible.</p>
          </template>

          <!-- Sección: Cuentas -->
          <template v-else-if="seccionActiva === 'cuentas'">
            <h2 class="text-lg font-semibold text-theme-text mb-4 text-left">Cuentas Vinculadas</h2>
            <div class="text-left space-y-2 text-theme-text">
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
  return isProviderLinked(provider) ? 'text-ctp-green font-bold' : 'text-ctp-overlay0'
}

function estadoTexto(provider: string) {
  return isProviderLinked(provider) ? 'Conectado' : 'No conectado'
}

// Clases para los botones activos
function botonClase(tipo: string) {
  return [
    'btn-ctp transition',
    seccionActiva.value === tipo
      ? 'btn-ctp-primary shadow-lg'
      : 'btn-ctp-ghost'
  ].join(' ')
}
</script>
