<template>
  <div class="container mx-auto p-6 bg-pizza-bg rounded-lg shadow-lg">
    <h1 class="text-4xl font-bold mb-6 text-pizza-red font-pizza-title drop-shadow-lg">Pizzas🍕</h1>
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center h-60">
      <el-skeleton :rows="4" animated />
    </div>
    <div v-else>
      <div class="flex justify-between mb-6 items-center">
        <!-- Para Buscar-->
        <el-input v-model="searchTerm" placeholder="Buscar Pizza..." clearable class="max-w-xs shadow-inner rounded-lg"
          @clear="currentPage = 1" @input="currentPage = 1" prefix-icon="el-icon-search" />
        <el-button class="pulse-button" type="danger" :icon="Plus" @click="redirectToInsert"
          style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;">
          Agregar Pizza
        </el-button>
      </div>


      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <el-card v-for="pizza in pagedCategorias" :key="pizza.id_pizza" shadow="hover"
          class="pizza-card flex flex-col justify-between rounded-xl border-2 border-pizza-red bg-pizza-card p-5 hover:scale-[1.03] transition-transform duration-300">
          <div>
            <h2 class="text-2xl font-pizza-title mb-2 text-pizza-red drop-shadow-md">
              {{ pizza.nombre }}
            </h2>
            <p class="text-pizza-cream font-semibold">
              Descripción: <span class="text-pizza-orange">{{ pizza.descripcion }}</span>
            </p>
            <p class="text-pizza-cream font-semibold">
              Precio Base: <span class="text-pizza-orange">${{ pizza.precio_base }}</span>
            </p>
          </div>

          <div class="flex justify-end mt-4">
            <el-dropdown trigger="click">
              <el-button type="text" :icon="MoreFilled" class="text-pizza-red" />
              <template #dropdown>
                <el-dropdown-menu class="pizza-dropdown-menu">
                  <el-dropdown-item @click="redirectToUpdate(pizza.id_pizza)">
                    ✏️ Actualizar
                  </el-dropdown-item>
                  <el-dropdown-item @click="openIngredientesModal(pizza.id_pizza)">
                    🔗 Detalles
                  </el-dropdown-item>
                  <el-dropdown-item @click="redirectToIngredientes(pizza.id_pizza)">
                    ➕ Agregar Ingredientes
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="() => confirmDelete(pizza.id_pizza)">
                    🗑️ Eliminar
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-card>

        <!-- Mensaje si no hay pizza -->
        <div v-if="!loading && filteredPizza.length === 0"
          class="col-span-full text-center text-pizza-red font-semibold text-lg mt-10">
          No se encontró la Pizza🧑‍🍳
        </div>
      </div>

      <!-- Paginación -->
      <div class="mt-8 flex justify-center" v-if="filteredPizza.length > pageSize">
        <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="filteredPizza.length"
          v-model:current-page="currentPage" class="pizza-pagination" />
      </div>


    </div>
    <!-- Modal para mostrar ingredientes -->
    <el-dialog v-model="isModalVisible" title="Ingredientes de la Pizza" width="500px">
      <div v-if="ingredientes.length === 0" class="text-center text-pizza-red font-semibold">
        Esta pizza no tiene ingredientes asignados.
      </div>
      <ul v-else class="list-disc list-inside text-pizza-brown">
        <li v-for="ingrediente in ingredientes" :key="ingrediente.id_ingrediente">
          {{ ingrediente.nombre }}
        </li>
      </ul>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isModalVisible = false">Cerrar</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { MoreFilled, Plus } from '@element-plus/icons-vue';

const router = useRouter();
const pizzas = ref([]);
const loading = ref(true);

const searchTerm = ref('');
const currentPage = ref(1);
const pageSize = 9;
const isModalVisible = ref(false);

const selectedPizzaId = ref(null);
const ingredientes = ref([]);

// Cargar pizzas
const loadPizzas = async () => {
  try {
    const response = await fetch('/api/products/pizza');
    if (!response.ok) {
      throw new Error('Error al obtener las pizzas');
    }
    pizzas.value = await response.json();
  } catch (error) {
    console.error(error.message);
    ElMessage.error(error.message);
  } finally {
    loading.value = false;
  }
};

// Filtrar pizzas según búsqueda
const filteredPizza = computed(() => {
  if (!searchTerm.value.trim()) return pizzas.value;
  return pizzas.value.filter(pizza =>
    pizza.nombre.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Paginación: pizzas visibles en la página actual
const pagedCategorias = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredPizza.value.slice(start, start + pageSize);
});

// Abrir modal y cargar ingredientes
const openIngredientesModal = async (idPizza) => {
  console.log("ID de pizza seleccionada:", idPizza); // Verifica el ID
  selectedPizzaId.value = idPizza;
  isModalVisible.value = true;

  // Cargar ingredientes para la pizza seleccionada
  try {
    const response = await fetch(`/api/products/pizzaIngrediente?id_pizza=${idPizza}`);
    if (!response.ok) throw new Error('Error al cargar ingredientes');
    ingredientes.value = await response.json();
    console.log("Ingredientes cargados:", ingredientes.value); // Verifica los ingredientes
  } catch (error) {
    console.error(error.message);
    ElMessage.error('No se pudieron cargar los ingredientes');
    ingredientes.value = [];
  }
};


// Redirecciones para botones (puedes ajustar las rutas)
const redirectToInsert = () => {
  router.push('/products/pizza/insert');
};
const redirectToUpdate = (id) => {
  router.push(`/products/pizza/update?id=${id}`);
};
const redirectToIngredientes = (id) => {
  router.push(`/products/pizza/ingredientes?id=${id}`);
};

// Confirmar eliminación (ejemplo con Element Plus MessageBox)
const confirmDelete = (id) => {
  ElMessageBox.confirm(
    '¿Seguro que quieres eliminar esta pizza?',
    'Confirmar eliminación',
    {
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      type: 'warning',
    }
  ).then(async () => {
    try {
      const response = await fetch(`/api/products/pizza?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar pizza');
      ElMessage.success('Pizza eliminada correctamente');
      await loadPizzas();
    } catch (error) {
      ElMessage.error(error.message);
    }
  }).catch(() => {
    // Cancelado
  });
};

const handleClose = () => {
  isModalVisible.value = false;
  ingredientes.value = [];
};

onMounted(async () => {
  await loadPizzas();
});
</script>




