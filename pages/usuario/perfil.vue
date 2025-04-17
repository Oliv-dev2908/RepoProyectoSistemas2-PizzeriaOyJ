<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
      <div class="bg-white shadow-2xl rounded-xl flex w-full max-w-5xl">
        <!-- Sidebar -->
        <div class="w-64 bg-indigo-100 rounded-l-xl p-6 space-y-4">
          <h2 class="text-lg font-semibold text-indigo-700 mb-4">Opciones</h2>
          <button
            @click="cambiarSeccion('info')"
            :class="[ 
              'w-full text-left px-4 py-2 rounded-lg',
              seccionActiva === 'info' ? 'bg-indigo-500 text-white' : 'hover:bg-indigo-200 text-indigo-800'
            ]"
          >
            Ver más información
          </button>
          <button
            @click="cambiarSeccion('editar')"
            :class="[ 
              'w-full text-left px-4 py-2 rounded-lg',
              seccionActiva === 'editar' ? 'bg-indigo-500 text-white' : 'hover:bg-indigo-200 text-indigo-800'
            ]"
          >
            Actualizar perfil
          </button>
          <button
            @click="cambiarSeccion('cuentas')"
            :class="[ 
              'w-full text-left px-4 py-2 rounded-lg',
              seccionActiva === 'cuentas' ? 'bg-indigo-500 text-white' : 'hover:bg-indigo-200 text-indigo-800'
            ]"
          >
            Ver cuentas vinculadas
          </button>

          <button
            :class="[ 
              'w-full text-left px-4 py-2 rounded-lg', 'hover:bg-indigo-200 text-indigo-800'
            ]"
          >
            Cerrar Sesion
          </button>
        </div>
  
        <!-- Contenido dinámico -->
        <div class="flex-1 p-8 text-center">
          <template v-if="cargando">
            <div class="text-gray-500 flex flex-col items-center justify-center h-full">
              <!-- Icono de carga eliminado -->
              <p>Espere por favor...</p>
            </div>
          </template>
  
          <template v-else>
            <template v-if="seccionActiva === 'info'">
              <!-- Avatar -->
              <img
                :src="fotoPerfil"
                alt="Foto de perfil"
                class="w-32 h-32 mx-auto rounded-full border-4 border-indigo-500 shadow-lg object-cover"
              />
              <!-- Nombre -->
              <h1 class="text-2xl font-bold mt-4 text-gray-800">{{ nombreCompleto }}</h1>
              <!-- Correo -->
              <p class="text-gray-600 mt-1">{{ user?.email }}</p>
              <!-- Rol -->
              <p class="mt-2 text-sm text-white inline-block bg-indigo-500 px-3 py-1 rounded-full shadow">
                Rol: {{ rol }}
              </p>
              <!-- Detalles adicionales -->
              <div class="mt-6 text-left space-y-2 text-gray-700">
                <p><strong>Nickname:</strong> {{ nickname }}</p>
                <p><strong>Slug:</strong> {{ slug }}</p>
                <p><strong>Proveedor:</strong> {{ proveedor }}</p>
                <p><strong>Último ingreso:</strong> {{ ultimoIngreso }}</p>
              </div>
            </template>
  
            <template v-else-if="seccionActiva === 'editar'">
              <h2 class="text-xl font-semibold text-gray-800 mb-4">Actualizar perfil</h2>
              <p class="text-gray-600">Esta funcionalidad estará disponible pronto.</p>
            </template>
  
            <template v-else-if="seccionActiva === 'cuentas'">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Cuentas vinculadas</h2>
            <div class="text-left space-y-3 text-gray-700">
              <p>
                <strong>Google:</strong>
                <span class="ml-2" :class="isProviderLinked('google') ? 'text-green-600' : 'text-gray-500'">
                  {{ isProviderLinked('google') ? 'Conectado' : 'No conectado' }}
                </span>
              </p>
              <p>
                <strong>Facebook:</strong>
                <span class="ml-2" :class="isProviderLinked('facebook') ? 'text-green-600' : 'text-gray-500'">
                  {{ isProviderLinked('facebook') ? 'Conectado' : 'No conectado' }}
                </span>
              </p>
              <p>
                <strong>Correo electrónico:</strong>
                <span class="ml-2" :class="isProviderLinked('email') ? 'text-green-600' : 'text-gray-500'">
                  {{ isProviderLinked('email') ? 'Conectado' : 'No conectado' }}
                </span>
              </p>
            </div>
          </template>
          </template>
        </div>
      </div>
    </div>
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

// Estado
const seccionActiva = ref('info')
const cargando = ref(false)

// Función para verificar si un proveedor está vinculado
function isProviderLinked(provider: string) {
  return user.value?.app_metadata?.providers.includes(provider)
}

// Cambiar sección sin animación de carga
async function cambiarSeccion(nuevaSeccion: string) {
  console.log('Cambiando a:', nuevaSeccion)
  cargando.value = true
  setTimeout(() => {
    seccionActiva.value = nuevaSeccion
    cargando.value = false
  }, 600)
  console.log(seccionActiva.value)
}

// Cerrar sesión

</script>