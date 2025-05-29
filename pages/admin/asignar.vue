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

<style scoped>
/* Paleta de colores pizza */
:root {
  --pizza-red: #e63946;
  --pizza-orange: #f4a261;
  --pizza-cream: #f1faee;
  --pizza-brown: #6d4c41;
  --pizza-bg: #fff8f0;
  --pizza-card: #fff1e6;
}

/* Container con fondo y borde suave */
.container {
  max-width: 1200px;
  background-color: var(--pizza-bg);
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgb(230 57 70 / 0.3);
  font-family: 'Comic Sans MS', cursive, sans-serif;
  color: var(--pizza-brown);
}

/* Títulos estilo pizzería */
.font-pizza-title {
  font-family: 'Pacifico', cursive, 'Comic Sans MS', cursive;
  color: var(--pizza-red);
}

/* Colores usados */
.text-pizza-red {
  color: var(--pizza-red);
}

.text-pizza-orange {
  color: var(--pizza-orange);
}

.text-pizza-cream {
  color: var(--pizza-cream);
}

.pizza-card {
  background-color: var(--pizza-card);
  border-color: var(--pizza-red);
  font-weight: 600;
  box-shadow: 0 5px 15px rgb(230 57 70 / 0.15);
}

/* Dropdown menú personalizado */
.pizza-dropdown-menu {
  background-color: var(--pizza-bg);
  border-radius: 8px;
  box-shadow: 0 6px 18px rgb(230 57 70 / 0.25);
  font-weight: 600;
  color: var(--pizza-brown);
}

/* Paginación */
.pizza-pagination {
  font-family: 'Comic Sans MS', cursive, sans-serif;
  user-select: none;
}

.pizza-pagination .el-pager li {
  width: 36px;
  height: 36px;
  line-height: 36px;
  margin: 0 6px;
  border-radius: 50%;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--pizza-brown);
  background: var(--pizza-cream);
  box-shadow: 0 3px 6px rgba(109, 76, 65, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.pizza-pagination .el-pager li:hover:not(.active) {
  background-color: var(--pizza-orange);
  color: white;
  box-shadow: 0 4px 12px rgba(244, 162, 97, 0.7);
  border-color: var(--pizza-orange);
}

.pizza-pagination .el-pager li.active {
  background-color: var(--pizza-red);
  color: white;
  box-shadow: 0 6px 20px rgba(230, 57, 70, 0.8);
  border-color: var(--pizza-red);
  transform: scale(1.1);
  cursor: default;
}

.pizza-pagination .el-pager li.disabled {
  color: #ccc;
  cursor: not-allowed;
  background: var(--pizza-cream);
  box-shadow: none;
  border-color: transparent;
}

/* Botones prev y next estilo pizza */
.pizza-pagination .el-pager li.prev,
.pizza-pagination .el-pager li.next {
  width: 40px;
  height: 40px;
  font-weight: 900;
  font-size: 1.3rem;
  color: var(--pizza-red);
  background: var(--pizza-cream);
  border: 2px solid var(--pizza-red);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(230, 57, 70, 0.3);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.pizza-pagination .el-pager li.prev:hover:not(.disabled),
.pizza-pagination .el-pager li.next:hover:not(.disabled) {
  background-color: var(--pizza-red);
  color: white;
  box-shadow: 0 6px 15px rgba(230, 57, 70, 0.7);
  cursor: pointer;
}


/* Animación de pulso para el botón */
@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(230, 57, 70, 0.7);
  }

  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(230, 57, 70, 0);
  }

  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(230, 57, 70, 0);
  }
}

.pulse-button {
  animation: pulse 2s infinite;
  transition: all 0.3s ease;
  font-weight: 700;
  box-shadow: 0 4px 8px rgba(230, 57, 70, 0.6);
  border-radius: 8px;
}

/* Ajustes input */
.el-input input {
  border-radius: 10px !important;
  font-weight: 600;
  color: var(--pizza-brown);
}

/* Hover para cartas */
.pizza-card:hover {
  box-shadow: 0 8px 20px rgba(230, 57, 70, 0.4);
}

/* Iconos y textos en dropdown */
.el-dropdown-menu__item {
  font-weight: 600;
  color: var(--pizza-brown);
  font-family: 'Comic Sans MS', cursive;
  transition: background-color 0.2s ease;
}

.el-dropdown-menu__item:hover {
  background-color: var(--pizza-orange);
  color: white;
  border-radius: 6px;
}
</style>