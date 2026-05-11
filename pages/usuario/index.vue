<template>
  <div class="min-h-screen py-6 sm:py-10 px-4 flex justify-center items-start bg-theme-bg transition-colors duration-300">
    <el-card
      class="w-full max-w-2xl shadow-xl border-theme"
      :body-style="{ padding: '1.5rem' }"
    >
      <!-- Header de usuario -->
      <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-4 text-center sm:text-left">
        <el-avatar
          :src="fotoPerfil"
          size="large"
          class="!w-24 !h-24 !rounded-full shadow-lg object-cover border-4 border-ctp-red"
        />
        <div class="flex flex-col justify-center">
          <h1 class="text-2xl font-bold text-ctp-red font-pizza-title">
            {{ nombreCompleto }}
          </h1>
          <p class="text-theme-secondary italic text-sm">
            {{ user?.email }}
          </p>
        </div>
      </div>

      <!-- Divider visual -->
      <el-divider class="!my-4 sm:!my-6" />

      <!-- Botones de navegación -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
        <el-button
          @click="irAPerfil"
          type="danger"
          round
          class="w-full h-11 sm:h-auto"
        >
          👤 Perfil
        </el-button>
        <el-button
          @click="irAOrdenarPizza"
          type="warning"
          round
          class="w-full h-11 sm:h-auto"
        >
          🍕 Ordenar Pizza
        </el-button>
        <el-button
          @click="irAMisPedidos"
          type="info"
          round
          class="w-full h-11 sm:h-auto"
        >
          📦 Mis Pedidos
        </el-button>
      </div>
    </el-card>
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
  router.push('perfil')
}

function irAOrdenarPizza() {
  router.push('ordenarPizza')
}

function irAMisPedidos() {
  router.push('misPedidos')
}
</script>
