<template>
  <div class="min-h-screen bg-gradient-to-tr from-slate-100 to-slate-200 p-6">
    <div class="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-xl">

      <!-- Header de usuario -->
      <div class="flex items-center gap-6 mb-8">
        <img
          :src="fotoPerfil"
          alt="Foto de perfil"
          class="w-24 h-24 rounded-full border-4 border-indigo-200 shadow-md object-cover"
        />
        <div>
          <h1 class="text-3xl font-bold text-gray-800">{{ nombreCompleto }}</h1>
          <p class="text-gray-600">{{ user?.email }}</p>
        </div>
      </div>

      <!-- Navbar simple -->
      <div class="flex gap-4">
        <button @click="irAPerfil" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow">
         Perfil
        </button>
        <button @click="irAOrdenarPizza" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow">
          Ordenar Pizza
       </button>
        <button @click="irASugerencia" class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow">
          Enviar Sugerencia
       </button>
       </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { useSupabaseUser } from '#imports'
import { useRouter } from 'vue-router'

const user = useSupabaseUser()
const router = useRouter()

const nombreCompleto = user.value?.user_metadata?.full_name || user.value?.user_metadata?.name || 'Usuario'
const fotoPerfil = user.value?.user_metadata?.avatar_url || user.value?.user_metadata?.picture || 'https://via.placeholder.com/96'

function irAPerfil() {
  router.push('usuario/perfil')
}

function irAOrdenarPizza() {
  router.push('usuario/ordenarPizza')
}

function irASugerencia() {
  router.push('/sugerencia')
}
</script>