<template>
  <div class="container mx-auto p-6 bg-pizza-bg rounded-lg shadow-lg">
    <h1 class="text-4xl font-bold mb-6 text-pizza-red font-pizza-title drop-shadow-lg">
      Categorías
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
        <el-button class="pulse-button" type="danger" :icon="Plus" @click="redirectToInsert"
          style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;">
           Agregar Categoría
        </el-button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <el-card v-for="cat in pagedCategorias" :key="cat.id_categoria" shadow="hover"
          class="pizza-card flex flex-col justify-between rounded-xl border-2 border-pizza-red bg-pizza-card p-5 hover:scale-[1.03] transition-transform duration-300">
          <div>
            <h2 class="text-2xl font-pizza-title mb-2 text-pizza-red drop-shadow-md">
              {{ cat.nombre }}
            </h2>
            <p class="text-pizza-cream font-semibold">
              Precio Extra: <span class="text-pizza-orange">${{ cat.precio_extra }}</span>
            </p>
          </div>

          <div class="flex justify-end mt-4">
            <el-dropdown trigger="click">
              <el-button type="text" :icon="MoreFilled" class="text-pizza-red" />
              <template #dropdown>
                <el-dropdown-menu class="pizza-dropdown-menu">
                  <el-dropdown-item @click="redirectToUpdate(cat.id_categoria)">
                    ✏️ Actualizar
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="() => confirmDelete(cat.id_categoria)">
                    🗑️ Eliminar
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-card>

        <!-- Mensaje si no hay categorías -->
        <div v-if="!loading && filteredCategorias.length === 0"
          class="col-span-full text-center text-pizza-red font-semibold text-lg mt-10">
          No se encontró la categoría🧑‍🍳
        </div>
      </div>

      <!-- Paginación -->
      <div class="mt-8 flex justify-center" v-if="filteredCategorias.length > pageSize">
        <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="filteredCategorias.length"
          v-model:current-page="currentPage" class="pizza-pagination" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { MoreFilled, Plus } from '@element-plus/icons-vue';

const router = useRouter();
const categorias = ref([]);
const loading = ref(true);

const searchTerm = ref('');
const currentPage = ref(1);
const pageSize = 9;

const loadCats = async () => {
  try {
    const response = await fetch('/api/products/categoria');
    if (!response.ok) throw new Error('Error al cargar categorías');
    categorias.value = await response.json();
  } catch (error) {
    ElMessage.error(error.message);
  } finally {
    loading.value = false;
  }
};

const filteredCategorias = computed(() => {
  if (!searchTerm.value.trim()) return categorias.value;
  return categorias.value.filter(cat =>
    cat.nombre.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const pagedCategorias = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredCategorias.value.slice(start, start + pageSize);
});

const redirectToUpdate = (id) => {
  router.push(`/products/categoria/update?id=${id}`);
};

const redirectToInsert = () => {
  router.push('/products/categoria/insert');
};

const confirmDelete = async (id) => {
  try {
    await ElMessageBox.confirm(
      '¿Estás seguro de eliminar esta categoría?',
      'Confirmar eliminación',
      {
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
        type: 'warning',
      }
    );
    await deleteCategoria(id);
  } catch { }
};

const deleteCategoria = async (id) => {
  try {
    const response = await fetch('/api/products/categoria', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_categoria: id }),
    });

    if (!response.ok) throw new Error('Error al eliminar la categoría');

    ElMessage.success('Categoría eliminada correctamente');
    currentPage.value = 1;
    loadCats();
  } catch (error) {
    ElMessage.error(error.message);
  }
};

onMounted(loadCats);
</script>


