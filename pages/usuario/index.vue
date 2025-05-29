<template>
  <div class="min-h-screen py-10 px-4 flex justify-center items-start bg-[var(--el-bg-color)] transition-colors duration-300">
    <el-card
      class="w-full max-w-2xl shadow-xl border-none"
      :body-style="{ padding: '2rem' }"
    >
      <!-- Header de usuario -->
      <div class="flex items-center gap-6 mb-4">
        <el-avatar
          :src="fotoPerfil"
          size="large"
          class="!w-24 !h-24 !rounded-full shadow-lg object-cover border-4"
          style="border-color: var(--el-color-danger-light-3);"
        />
        <div class="flex flex-col justify-center">
          <h1 class="text-2xl font-bold text-[var(--el-color-danger)]">
            {{ nombreCompleto }}
          </h1>
          <p class="text-[var(--el-text-color-secondary)] italic">
            {{ user?.email }}
          </p>
        </div>
      </div>

      <!-- Divider visual -->
      <el-divider />

      <!-- Botones de navegación -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <el-button
          @click="irAPerfil"
          type="danger"
          round
          class="w-full"
        >
          👤 Perfil
        </el-button>
        <el-button
          @click="irAOrdenarPizza"
          type="warning"
          round
          class="w-full"
        >
          🍕 Ordenar Pizza
        </el-button>
        <el-button
          @click="irAMisPedidos"
          type="info"
          round
          class="w-full"
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
