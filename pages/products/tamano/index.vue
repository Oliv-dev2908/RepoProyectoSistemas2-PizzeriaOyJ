<template>
  <div class="container mx-auto p-6 bg-theme-bg rounded-lg shadow-lg">
    <h1 class="text-4xl font-bold mb-6 text-ctp-red font-pizza-title drop-shadow-lg">
      Tamaños
    </h1>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center h-60">
      <el-skeleton :rows="4" animated />
    </div>

    <div v-else>
      <div class="flex justify-between mb-6 items-center">
        <el-input v-model="searchTerm" placeholder="Buscar tamaño..." clearable
          class="max-w-xs shadow-inner rounded-lg" @clear="currentPage = 1" @input="currentPage = 1"
          prefix-icon="el-icon-search" />
        <el-button class="pulse-button" type="danger" :icon="Plus" @click="redirectToInsert">
          Agregar Tamaño
        </el-button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <el-card v-for="tam in pagedTamanos" :key="tam.id_tamano" shadow="hover"
          class="pizza-card flex flex-col justify-between rounded-xl border-2 border-ctp-red bg-theme-card p-5 hover:scale-[1.03] transition-transform duration-300">
          <div>
            <h2 class="text-2xl font-pizza-title mb-2 text-ctp-red drop-shadow-md">
              {{ tam.nombre }}
            </h2>
            <p class="text-theme-secondary font-semibold">
              Precio añadido: <span class="text-ctp-peach">${{ tam.precio_base }}</span>
            </p>
            <p class="text-theme-secondary font-semibold">
              Descripción: <span class="text-ctp-peach"> {{ tam.descripcion }}</span>
            </p>
          </div>

          <div class="flex justify-end mt-4">
            <el-dropdown trigger="click">
              <el-button type="text" :icon="MoreFilled" class="text-ctp-red" />
              <template #dropdown>
                <el-dropdown-menu class="pizza-dropdown-menu">
                  <el-dropdown-item @click="redirectToUpdate(tam.id_tamano)">
                    ✏️ Actualizar
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="() => confirmDelete(tam.id_tamano)">
                    🗑️ Eliminar
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-card>

        <!-- Mensaje si no hay tamaños -->
        <div v-if="!loading && filteredTamanos.length === 0"
          class="col-span-full text-center text-ctp-red font-semibold text-lg mt-10">
          No se encontró ningún tamaño 🍕
        </div>
      </div>

      <!-- Paginación -->
      <div class="mt-8 flex justify-center" v-if="filteredTamanos.length > pageSize">
        <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="filteredTamanos.length"
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
const tamanos = ref([]);
const loading = ref(true);

const searchTerm = ref('');
const currentPage = ref(1);
const pageSize = 9;

const loadTams = async () => {
  try {
    const response = await fetch('/api/products/tamano');
    if (!response.ok) throw new Error('Error al cargar los tamaños');
    tamanos.value = await response.json();
  } catch (error) {
    ElMessage.error(error.message);
  } finally {
    loading.value = false;
  }
};

const filteredTamanos = computed(() => {
  if (!searchTerm.value.trim()) return tamanos.value;
  return tamanos.value.filter(tam =>
    tam.nombre.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const pagedTamanos = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredTamanos.value.slice(start, start + pageSize);
});

const redirectToUpdate = (id) => {
  router.push(`/products/tamano/update?id=${id}`);
};

const redirectToInsert = () => {
  router.push('/products/tamano/insert');
};

const confirmDelete = async (id) => {
  try {
    await ElMessageBox.confirm(
      '¿Estás seguro de eliminar este tamaño?',
      'Confirmar eliminación',
      {
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
        type: 'warning',
      }
    );
    await deleteTamano(id);
  } catch { }
};

const deleteTamano = async (id) => {
  try {
    const response = await fetch('/api/products/tamano', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_tamano: id }),
    });

    if (!response.ok) throw new Error('Error al eliminar el tamaño');

    ElMessage.success('Tamaño eliminado correctamente');
    currentPage.value = 1;
    loadTams();
  } catch (error) {
    ElMessage.error(error.message);
  }
};

onMounted(loadTams);
</script>



