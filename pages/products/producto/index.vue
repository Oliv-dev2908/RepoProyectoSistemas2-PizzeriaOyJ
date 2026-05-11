<template>
  <div class="container mx-auto p-6 bg-theme-bg rounded-lg shadow-lg">
    <h1 class="text-4xl font-bold mb-6 text-ctp-red font-pizza-title drop-shadow-lg">
      Productos
    </h1>

    <!-- Cargando -->
    <div v-if="loading" class="flex justify-center items-center h-60">
      <el-skeleton :rows="4" animated />
    </div>

    <div v-else>
      <!-- Buscador y botón -->
      <div class="flex justify-between mb-6 items-center">
        <el-input v-model="searchTerm" placeholder="Buscar producto..." clearable
          class="max-w-xs shadow-inner rounded-lg" @clear="currentPage = 1" @input="currentPage = 1"
          :prefix-icon="Search" />
        <el-button class="pulse-button" type="danger" :icon="Plus" @click="redirectToInsert">
          Agregar Producto
        </el-button>
      </div>

      <!-- Tarjetas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <el-card v-for="prod in pagedProductos" :key="prod.id_producto" shadow="hover"
          class="pizza-card flex flex-col justify-between rounded-xl border-2 border-ctp-red bg-theme-card p-5 hover:scale-[1.03] transition-transform duration-300">
          <div>
            <h2 class="text-2xl font-pizza-title mb-2 text-ctp-red drop-shadow-md">
              {{ prod.nombre }}
            </h2>
            <p class="text-theme-secondary font-semibold">
              Descripción: <span class="text-ctp-peach">{{ prod.descripcion }}</span>
            </p>
            <p class="text-theme-secondary font-semibold">
              Categoría:
              <el-tag class="category-tag" type="warning" effect="light">{{ prod.categoria_nombre || 'Sin categoría'
                }}</el-tag>
            </p>
            <p class="text-theme-secondary font-semibold">
              Precio:
              <el-tag class="price-tag" type="success" effect="light">${{ prod.precio }}</el-tag>
            </p>
          </div>

          <div class="flex justify-end mt-4">
            <el-dropdown trigger="click">
              <el-button type="text" :icon="MoreFilled" class="text-ctp-red" />
              <template #dropdown>
                <el-dropdown-menu class="pizza-dropdown-menu">
                  <el-dropdown-item @click="redirectToUpdate(prod.id_producto)">
                    ✏️ Actualizar
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="() => confirmDelete(prod.id_producto)">
                    🗑️ Eliminar
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-card>

        <!-- Sin productos -->
        <div v-if="!loading && filteredProductos.length === 0"
          class="col-span-full text-center text-ctp-red font-semibold text-lg mt-10">
          No se encontró el producto 🍕
        </div>
      </div>

      <!-- Paginación -->
      <div class="mt-8 flex justify-center" v-if="filteredProductos.length > pageSize">
        <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="filteredProductos.length"
          v-model:current-page="currentPage" class="pizza-pagination" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, MoreFilled } from '@element-plus/icons-vue';

const router = useRouter();
const productos = ref([]);
const loading = ref(true);
const searchTerm = ref('');
const currentPage = ref(1);
const pageSize = 9;

const loadProductos = async () => {
  try {
    const response = await fetch('/api/products/producto');
    if (!response.ok) throw new Error('Error al obtener los productos');
    productos.value = await response.json();
  } catch (error) {
    ElMessage.error(error.message);
  } finally {
    loading.value = false;
  }
};

const filteredProductos = computed(() => {
  if (!searchTerm.value.trim()) return productos.value;
  return productos.value.filter(prod =>
    prod.nombre.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const pagedProductos = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredProductos.value.slice(start, start + pageSize);
});

const redirectToInsert = () => {
  router.push('/products/producto/insert');
};

const redirectToUpdate = (id) => {
  router.push(`/products/producto/update?id=${id}`);
};

const confirmDelete = async (id) => {
  try {
    await ElMessageBox.confirm(
      '¿Estás seguro de eliminar este producto?',
      'Confirmar eliminación',
      {
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
        type: 'warning',
      }
    );
    await deleteProducto(id);
  } catch { }
};

const deleteProducto = async (id) => {
  try {
    const response = await fetch('/api/products/producto', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_producto: id }),
    });

    if (!response.ok) throw new Error('Error al eliminar el producto');

    ElMessage.success('Producto eliminado correctamente');
    currentPage.value = 1;
    loadProductos();
  } catch (error) {
    ElMessage.error(error.message);
  }
};

onMounted(loadProductos);
</script>


