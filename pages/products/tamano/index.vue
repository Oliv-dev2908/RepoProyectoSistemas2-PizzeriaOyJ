<template>
  <div class="container mx-auto p-6 bg-pizza-bg rounded-lg shadow-lg">
    <h1 class="text-4xl font-bold mb-6 text-pizza-red font-pizza-title drop-shadow-lg">
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
        <el-button class="pulse-button" type="danger" :icon="Plus" @click="redirectToInsert"
          style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;">
          Agregar Tamaño
        </el-button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <el-card v-for="tam in pagedTamanos" :key="tam.id_tamano" shadow="hover"
          class="pizza-card flex flex-col justify-between rounded-xl border-2 border-pizza-red bg-pizza-card p-5 hover:scale-[1.03] transition-transform duration-300">
          <div>
            <h2 class="text-2xl font-pizza-title mb-2 text-pizza-red drop-shadow-md">
              {{ tam.nombre }}
            </h2>
            <p class="text-pizza-cream font-semibold">
              Precio añadido: <span class="text-pizza-orange">${{ tam.precio_base }}</span>
            </p>
            <p class="text-pizza-cream font-semibold">
              Descripción: <span class="text-pizza-orange"> {{ tam.descripcion }}</span>
            </p>
          </div>

          <div class="flex justify-end mt-4">
            <el-dropdown trigger="click">
              <el-button type="text" :icon="MoreFilled" class="text-pizza-red" />
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
          class="col-span-full text-center text-pizza-red font-semibold text-lg mt-10">
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
