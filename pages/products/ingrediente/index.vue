<template>
  <div class="container mx-auto p-6 bg-pizza-bg rounded-lg shadow-lg">
    <h1 class="text-4xl font-bold mb-6 text-pizza-red font-pizza-title drop-shadow-lg">
      Ingredientes 🧑‍🍳
    </h1>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center h-60">
      <el-skeleton :rows="4" animated />
    </div>

    <div v-else>
      <div class="flex justify-between mb-6 items-center">
        <el-input v-model="searchTerm" placeholder="Buscar categoría..." clearable
          class="max-w-xs shadow-inner rounded-lg" @clear="currentPage = 1" @input="currentPage = 1"
          prefix-icon="el-icon-search" />

        <el-select v-model="selectedTipo" placeholder="Filtrar por tipo" clearable
          class="max-w-xs shadow-inner rounded-lg mr-4" @clear="currentPage = 1" @change="currentPage = 1">
          <el-option label="Salsas" value="Salsas" />
          <el-option label="Cárnico" value="Cárnico" />
          <el-option label="Lácteo" value="Lácteo" />
          <el-option label="Mariscos" value="Mariscos" />
          <el-option label="Frutas" value="Frutas" />
          <el-option label="Vegetal" value="Vegetal" />
          <el-option label="Otro" value="Otro" />
        </el-select>

        <el-button class="pulse-button" type="danger" :icon="Plus" @click="redirectToInsert"
          style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;">
          Agregar Ingrediente
        </el-button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <el-card v-for="ing in pagedIngredientes" :key="ing.id_ingrediente" shadow="hover"
          class="pizza-card flex flex-col justify-between rounded-2xl border-4 border-pizza-red bg-pizza-card p-5 hover:scale-[1.03] transition-transform duration-300 shadow-xl">
          <div>
            <h2 class="text-2xl font-pizza-title mb-2 text-pizza-red drop-shadow-md">
              {{ ing.nombre }}
            </h2>
            <p class="text-pizza-cream font-semibold">
              Costo Unitario:
              <span class="text-pizza-orange">${{ ing.costo_unitario }}</span>
            </p>
            <p class="text-pizza-cream font-semibold mb-1">
              Tipo:
              <el-tag type="warning" effect="dark" class="ml-1">{{ ing.tipo }}</el-tag>
            </p>
          </div>

          <div class="flex justify-end mt-4">
            <el-tooltip content="Opciones" placement="top">
              <el-dropdown trigger="click">
                <el-button type="text" :icon="MoreFilled" class="text-pizza-red" />
                <template #dropdown>
                  <el-dropdown-menu class="pizza-dropdown-menu">
                    <el-dropdown-item @click="redirectToUpdate(ing.id_ingrediente)">
                      ✏️ Actualizar
                    </el-dropdown-item>
                    <el-dropdown-item divided @click="() => confirmDelete(ing.id_ingrediente)">
                      🗑️ Eliminar
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-tooltip>
          </div>

          <div v-if="!loading && filteredIngredientes.length === 0"
            class="col-span-full text-center text-pizza-red font-bold text-xl mt-10 border-2 border-pizza-red rounded-xl p-4 bg-white">
            No se encontró el ingrediente 🧑‍🍳
          </div>
        </el-card>

        <!-- Mensaje si no hay ingredientes -->
        <div v-if="!loading && filteredIngredientes.length === 0"
          class="col-span-full text-center text-pizza-red font-semibold text-lg mt-10">
          No se encontró el ingrediente 🧑‍🍳
        </div>
      </div>

      <!-- Paginación -->
      <div class="mt-8 flex justify-center" v-if="filteredIngredientes.length > pageSize">
        <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="filteredIngredientes.length"
          v-model:current-page="currentPage" class="pizza-pagination" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { MoreFilled, Plus } from '@element-plus/icons-vue'

const ingredientes = ref([])
const loading = ref(true)
const searchTerm = ref('')
const currentPage = ref(1)
const pageSize = 9
const router = useRouter()
const selectedTipo = ref('')

const loadIngredientes = async () => {
  try {
    const res = await fetch('/api/products/ingrediente')
    if (!res.ok) throw new Error('Error al cargar ingredientes')
    ingredientes.value = await res.json()
  } catch (err) {
    ElMessage.error(err.message)
  } finally {
    loading.value = false
  }
}

const filteredIngredientes = computed(() => {
  return ingredientes.value.filter(ing => {
    const matchesSearch = ing.nombre.toLowerCase().includes(searchTerm.value.toLowerCase())

    const tiposDefinidos = ["Salsas", "Cárnico", "Lácteo", "Mariscos", "Frutas", "Vegetal"]
    const matchesTipo = !selectedTipo.value ||
      (selectedTipo.value === "Otro"
        ? !tiposDefinidos.includes(ing.tipo)
        : ing.tipo === selectedTipo.value)

    return matchesSearch && matchesTipo
  })
})

const pagedIngredientes = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredIngredientes.value.slice(start, start + pageSize)
})

const redirectToInsert = () => {
  router.push('/products/ingrediente/insert')
}

const redirectToUpdate = (id) => {
  router.push(`/products/ingrediente/update?id=${id}`)
}

const confirmDelete = async (id) => {
  try {
    await ElMessageBox.confirm(
      '¿Estás seguro de eliminar este ingrediente?',
      'Confirmar eliminación',
      {
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
        type: 'warning',
      }
    )
    await deleteIngrediente(id)
  } catch { }
}

const deleteIngrediente = async (id) => {
  try {
    const res = await fetch('/api/products/ingrediente', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_ingrediente: id })
    })
    if (!res.ok) throw new Error('Error al eliminar ingrediente')
    ElMessage.success('Ingrediente eliminado correctamente')
    currentPage.value = 1
    loadIngredientes()
  } catch (err) {
    ElMessage.error(err.message)
  }
}



onMounted(loadIngredientes)
</script>


