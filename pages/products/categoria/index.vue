<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Categorías</h1>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center h-60">
      <el-skeleton :rows="4" animated />
    </div>

    <!-- Contenido -->
    <div v-else>
      <div class="flex justify-start mb-4">
        <el-button class="pulse-button" type="success" :icon="Plus" @click="redirectToInsert">
          Agregar Categoría
        </el-button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <el-card v-for="cat in categorias" :key="cat.id_categoria" shadow="hover" class="flex flex-col justify-between">
          <div>
            <h2 class="text-xl font-semibold mb-2">{{ cat.nombre }}</h2>
            <p class="text-gray-500">Precio Extra: ${{ cat.precio_extra }}</p>
          </div>

          <div class="flex justify-end mt-4">
            <el-dropdown trigger="click">
              <el-button type="link" :icon="MoreFilled" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="redirectToUpdate(cat.id_categoria)">
                    Actualizar
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="() => confirmDelete(cat.id_categoria)">
                    Eliminar
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { MoreFilled, Plus } from '@element-plus/icons-vue'; // Agregado Plus aquí

const router = useRouter();
const categorias = ref([]);
const loading = ref(true);

// Cargar categorías
const loadCats = async () => {
  try {
    const response = await fetch('/api/products/categoria');
    if (!response.ok) {
      throw new Error('Error al cargar categorías');
    }
    categorias.value = await response.json();
  } catch (error) {
    ElMessage.error(error.message);
  } finally {
    loading.value = false;
  }
};

// Redirección a actualizar
const redirectToUpdate = (id) => {
  router.push(`/products/categoria/update?id=${id}`);
};

// Redirección a insertar
const redirectToInsert = () => {
  router.push('/products/categoria/insert');
};

// Confirmar y eliminar categoría
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
  } catch {
    // Cancelado, no hacer nada
  }
};

// Eliminar categoría
const deleteCategoria = async (id) => {
  try {
    const response = await fetch('/api/products/categoria', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_categoria: id }),
    });

    if (!response.ok) {
      throw new Error('Error al eliminar la categoría');
    }

    ElMessage.success('Categoría eliminada correctamente');
    loadCats();
  } catch (error) {
    ElMessage.error(error.message);
  }
};

onMounted(loadCats);
</script>

<style scoped>
.container {
  max-width: 1200px;
}

/*Animacion de pulsasion*/ 
@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); 
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

.pulse-button {
  animation: pulse 2s infinite;
  transition: all 0.3s ease;
}
</style>
