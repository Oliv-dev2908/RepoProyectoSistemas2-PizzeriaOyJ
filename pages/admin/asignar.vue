<template>
  <div class="p-6 container mx-auto">
    <h1 class="text-2xl font-semibold mb-6 font-pizza-title">Gestión de Administradores</h1>

    <!-- Buscador -->
    <el-input v-model="filtro" placeholder="Buscar por nombre o correo..." clearable class="mb-6"
      prefix-icon="el-icon-search" />

    <div v-if="cargando" class="flex justify-center items-center h-40">
      <el-spinner />
    </div>

    <div v-else>
      <div v-if="usuariosFiltrados.length === 0" class="text-center text-pizza-red font-semibold">
        No se encontraron usuarios.
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" v-else>
        <el-card v-for="usuario in usuariosPagina" :key="usuario.id" shadow="hover"
          class="pizza-card rounded-2xl border border-gray-200">
          <div class="text-lg font-semibold mb-2 truncate">{{ usuario.name }}</div>
          <div class="text-sm text-gray-600 mb-4 truncate">{{ usuario.email }}</div>

          <el-button size="small" type="primary" :disabled="usuario.rol === 'admin'" class="w-full"
            :class="{ 'pulse-button': usuario.rol !== 'admin' }" @click="confirmarAgregar(usuario)">
            <template v-if="usuario.rol === 'admin'">Esta cuenta ya es administrador</template>
            <template v-else>Agregar como Admin</template>
          </el-button>

        </el-card>
      </div>

      <!-- Paginación -->
      <div class="flex justify-center mt-8">
        <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="usuariosFiltrados.length"
          v-model:current-page="paginaActual" class="pizza-pagination" />
      </div>
    </div>

    <!-- Modal de Confirmación -->
    <el-dialog title="Confirmar Acción" v-model="modalVisible" width="30%" :before-close="resetModal">
      <span>¿Estás seguro de que deseas hacer administrador a <b>{{ usuarioSeleccionado?.name }}</b>?</span>
      <template #footer>
        <el-button @click="resetModal">Cancelar</el-button>
        <el-button type="primary" @click="hacerAdmin" :loading="confirmando">
          Confirmar
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'

const usuarios = ref([])
const cargando = ref(false)
const confirmando = ref(false)

const modalVisible = ref(false)
const usuarioSeleccionado = ref(null)

const filtro = ref('')
const paginaActual = ref(1)
const pageSize = 9

const obtenerUsuarios = async () => {
  try {
    cargando.value = true
    usuarios.value = await $fetch('/api/admin/admins')
  } catch (error) {
    ElMessage.error('Error al cargar usuarios')
  } finally {
    cargando.value = false
  }
}

const confirmarAgregar = (usuario) => {
  usuarioSeleccionado.value = usuario
  modalVisible.value = true
}

const resetModal = () => {
  modalVisible.value = false
  usuarioSeleccionado.value = null
  confirmando.value = false
}

const hacerAdmin = async () => {
  if (!usuarioSeleccionado.value) return

  confirmando.value = true
  try {
    await $fetch('/api/admin/admins', {
      method: 'POST',
      body: { id: usuarioSeleccionado.value.id }
    })

    ElMessage.success(`${usuarioSeleccionado.value.name} ahora es administrador`)
    await obtenerUsuarios()
  } catch (error) {
    ElMessage.error('No se pudo actualizar el rol del usuario')
  } finally {
    resetModal()
  }
}

// Computed para filtrar usuarios según filtro (nombre o email)
const usuariosFiltrados = computed(() => {
  if (!filtro.value.trim()) return usuarios.value
  const term = filtro.value.toLowerCase()
  return usuarios.value.filter(
    u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
  )
})

// Computed para obtener solo los usuarios visibles en la página actual
const usuariosPagina = computed(() => {
  const start = (paginaActual.value - 1) * pageSize
  const slice = usuariosFiltrados.value.slice(start, start + pageSize)
  console.log('usuariosPagina', slice.length)
  return slice
})



// Resetear página actual cuando cambia el filtro
watch(filtro, () => {
  paginaActual.value = 1
})

onMounted(() => {
  obtenerUsuarios()
})
</script>
