<template>
  <center>
    
    <el-card 
    style="width: 75vh">

      <!-- Header de usuario -->
      <div class="flex items-center gap-6 mb-8">
        <img
          :src="fotoPerfil"
          alt="Foto de perfil"
          style="max-width: 10vh; max-height: 10vh; width: 10vh; height: 10vh;"
          class="rounded-full border-4 border-indigo-200 shadow-md object-cover"
        />
        <div>
          <h1>{{ nombreCompleto }}</h1>
          <p>{{ user?.email }}</p>
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
        <button @click="irAMisPedidos" class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow">
          Mis Pedidos
       </button>
      </div>
    </el-card>
  </center>
</template>

<script setup lang="ts">
import { useSupabaseUser } from '#imports'
import { useRouter } from 'vue-router'

const user = useSupabaseUser()
const router = useRouter()

const nombreCompleto = user.value?.user_metadata?.full_name || user.value?.user_metadata?.name || 'Usuario'
const fotoPerfil = user.value?.user_metadata?.avatar_url || user.value?.user_metadata?.picture || 'https://via.placeholder.com/96'

function irAPerfil() {
  router.push('perfil')
}

function irAOrdenarPizza() {
  router.push('ordenarPizza')
}

function irAMisPedidos() {
  router.push('misPedidos')
}
</script>