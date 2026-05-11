<template>
  <div class="flex justify-center p-4 sm:p-8">
    <el-card class="w-full max-w-2xl !p-2 sm:!p-6 shadow-xl border-theme">
      <!-- Header con perfil -->
      <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8 text-center sm:text-left">
        <img
          :src="fotoPerfil"
          alt="Foto de perfil"
          class="w-24 h-24 rounded-full border-4 border-theme shadow-md object-cover"
        />
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-theme-text">{{ nombreCompleto }}</h1>
          <p class="text-theme-secondary text-sm">{{ user?.email }}</p>
          <div class="mt-2">
            <span class="text-xs text-theme-bg bg-ctp-mauve px-3 py-1 rounded-full shadow font-bold">
              {{ rol }}
            </span>
          </div>
        </div>
      </div>

      <!-- Botones de navegación -->
      <div class="flex flex-wrap gap-2 justify-center sm:justify-start mb-8 border-b border-theme pb-4">
        <button v-for="tab in tabs" :key="tab.id" @click="cambiarSeccion(tab.id)"
          :class="botonClase(tab.id)" class="flex-1 sm:flex-none min-w-[120px]">
          {{ tab.label }}
        </button>
      </div>

      <!-- Contenido dinámico -->
      <div class="min-h-[200px]">
        <template v-if="cargando">
          <div class="flex flex-col items-center justify-center py-10 gap-3">
             <el-icon class="is-loading text-3xl text-ctp-mauve"><ElementPlusIcons.Loading /></el-icon>
             <p class="text-theme-secondary animate-pulse">Actualizando...</p>
          </div>
        </template>

        <template v-else>
          <!-- Sección: Información -->
          <transition name="fade" mode="out-in">
            <div v-if="seccionActiva === 'info'" class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="p-4 bg-theme-surface rounded-xl border border-theme">
                  <p class="text-xs text-theme-secondary uppercase font-bold mb-1">Nickname</p>
                  <p class="text-theme-text font-semibold">{{ nickname }}</p>
                </div>
                <div class="p-4 bg-theme-surface rounded-xl border border-theme">
                  <p class="text-xs text-theme-secondary uppercase font-bold mb-1">Proveedor</p>
                  <p class="text-theme-text font-semibold capitalize">{{ proveedor }}</p>
                </div>
                <div class="p-4 bg-theme-surface rounded-xl border border-theme sm:col-span-2">
                  <p class="text-xs text-theme-secondary uppercase font-bold mb-1">Último Ingreso</p>
                  <p class="text-theme-text font-semibold">{{ ultimoIngreso }}</p>
                </div>
              </div>
            </div>

            <!-- Sección: Actualizar -->
            <div v-else-if="seccionActiva === 'editar'" class="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 class="text-lg font-bold text-theme-text mb-4 flex items-center gap-2">
                <el-icon><ElementPlusIcons.Edit /></el-icon>
                Editar Información Personal
              </h2>
              
              <el-form label-position="top" class="max-w-md mx-auto sm:mx-0">
                <el-form-item label="Nombre Completo">
                  <el-input v-model="editForm.full_name" placeholder="Tu nombre real" />
                </el-form-item>
                <el-form-item label="Nombre de Usuario (Nickname)">
                  <el-input v-model="editForm.nickname" placeholder="Tu alias" />
                </el-form-item>
                
                <div class="flex justify-end gap-3 mt-8">
                  <el-button @click="resetForm" :disabled="actualizando">Cancelar</el-button>
                  <el-button type="primary" @click="handleUpdateProfile" :loading="actualizando" class="pulse-button">
                    Guardar Cambios
                  </el-button>
                </div>
              </el-form>
            </div>

            <!-- Sección: Cuentas -->
            <div v-else-if="seccionActiva === 'cuentas'" class="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 class="text-lg font-bold text-theme-text mb-4">Cuentas Conectadas</h2>
              <div class="space-y-3">
                <div v-for="p in ['google', 'facebook', 'twitter', 'email']" :key="p" 
                  class="flex items-center justify-between p-3 bg-theme-surface rounded-lg border border-theme">
                  <span class="font-semibold capitalize text-theme-text">{{ p }}</span>
                  <span :class="estadoProveedor(p)" class="text-sm px-3 py-1 rounded-full bg-theme-bg border border-theme">
                    {{ estadoTexto(p) }}
                  </span>
                </div>
              </div>
            </div>
          </transition>
        </template>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useSupabaseUser, useSupabaseClient } from '#imports'
import { ElMessage } from 'element-plus'
import * as ElementPlusIcons from '@element-plus/icons-vue'

const user = useSupabaseUser()
const client = useSupabaseClient()

const tabs = [
  { id: 'info', label: 'Información' },
  { id: 'editar', label: 'Editar Perfil' },
  { id: 'cuentas', label: 'Seguridad' }
]

// Datos del usuario
const nombreCompleto = computed(() => user.value?.user_metadata?.full_name || user.value?.user_metadata?.name || 'Usuario')
const fotoPerfil = computed(() => user.value?.user_metadata?.avatar_url || user.value?.user_metadata?.picture || 'https://via.placeholder.com/96')
const rol = computed(() => user.value?.user_metadata?.role || user.value?.role || 'Cliente')
const nickname = computed(() => user.value?.user_metadata?.nickname || 'Sin nickname')
const proveedor = computed(() => user.value?.app_metadata?.provider || 'Desconocido')
const ultimoIngreso = computed(() => user.value?.last_sign_in_at ? new Date(user.value.last_sign_in_at).toLocaleString() : 'Desconocido')

const seccionActiva = ref('info')
const cargando = ref(false)
const actualizando = ref(false)

const editForm = reactive({
  full_name: '',
  nickname: ''
})

onMounted(() => {
  resetForm()
})

function resetForm() {
  editForm.full_name = user.value?.user_metadata?.full_name || user.value?.user_metadata?.name || ''
  editForm.nickname = user.value?.user_metadata?.nickname || ''
}

function cambiarSeccion(seccion: string) {
  cargando.value = true
  setTimeout(() => {
    seccionActiva.value = seccion
    cargando.value = false
  }, 300)
}

async function handleUpdateProfile() {
  actualizando.value = true
  try {
    const { error } = await client.auth.updateUser({
      data: { 
        full_name: editForm.full_name,
        nickname: editForm.nickname
      }
    })
    
    if (error) throw error
    
    ElMessage.success('¡Perfil actualizado correctamente!')
    seccionActiva.value = 'info'
  } catch (error: any) {
    ElMessage.error('Error al actualizar: ' + error.message)
  } finally {
    actualizando.value = false
  }
}

function isProviderLinked(provider: string) {
  return user.value?.app_metadata?.providers?.includes(provider)
}

function estadoProveedor(provider: string) {
  return isProviderLinked(provider) ? 'text-ctp-green font-bold' : 'text-ctp-overlay0'
}

function estadoTexto(provider: string) {
  return isProviderLinked(provider) ? '● Conectado' : 'Desconectado'
}

function botonClase(tipo: string) {
  return [
    'btn-ctp text-sm transition-all duration-300',
    seccionActiva.value === tipo
      ? 'btn-ctp-primary shadow-lg scale-105'
      : 'btn-ctp-ghost opacity-70 hover:opacity-100'
  ].join(' ')
}
</script>
