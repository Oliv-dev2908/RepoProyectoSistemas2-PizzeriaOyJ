<template>
  <h1 class="text-4xl font-pizza-title mb-8 text-pizza-red text-center drop-shadow-lg">
    Ingredientes de la Pizza
  </h1>

  <el-button type="info" class="absolute top-4 left-4 pizza-button-back" size="small" @click="goBack">
    ←Volver
  </el-button>

  <el-card class="pizza-card p-6 max-w-lg mx-auto" v-if="!loading">
    <!-- Pizza seleccionada -->
    <el-form label-position="top" class="space-y-4">
      <el-form-item label="Pizza Seleccionada">
        <el-input v-model="pizzaActual.nombre" disabled />

      </el-form-item>


      <!-- Ingredientes actuales -->
      <div v-if="ingredientes.length === 0" class="text-center text-gray-600">
        <p>Aún no se agregaron ingredientes a esta pizza.</p>
      </div>
      <div v-else>
        <h3 class="text-lg font-semibold mb-2">Ingredientes Actuales:</h3>
        <ul class="space-y-2">
          <li v-for="ingrediente in ingredientes" :key="ingrediente.id_ingrediente"
            class="flex justify-between items-center border p-2 rounded shadow-inner bg-white">
            <span class="font-medium text-pizza-brown">
              {{ ingrediente.nombre }} - Cantidad: {{ ingrediente.cantidad }}
            </span>
            <el-button type="danger" size="small" @click="removeIngrediente(ingrediente.id_ingrediente)">
              Eliminar
            </el-button>
          </li>
        </ul>
      </div>

      <!-- Agregar ingrediente -->
      <div class="mt-4">
        <h3 class="text-lg font-semibold mb-2">Agregar Ingredientes:</h3>
        <el-form-item label="Ingrediente">
          <el-select v-model="selectedIngrediente" placeholder="Seleccionar ingrediente" class="w-full">
            <el-option v-for="ingrediente in allIngredientes" :key="ingrediente.id_ingrediente"
              :label="ingrediente.nombre" :value="ingrediente.id_ingrediente" />
          </el-select>
        </el-form-item>

        <el-form-item label="Cantidad">
          <div class="flex items-center gap-2 w-full">
            <el-input-number v-model="cantidad" :min="5" :max="1300" class="flex-grow" placeholder="Cantidad"
              :controls="false" />
            <span class="text-gray-600 font-semibold">gramos</span>
          </div>
        </el-form-item>


        <el-button type="success" class="w-full pulse-button"
          style="background: linear-gradient(45deg, #e63946, #f1faee); color: #7f1d1d; font-weight: 700;"
          @click="addIngrediente">
          Agregar Ingrediente
        </el-button>
      </div>
    </el-form>
  </el-card>

  <div v-else class="text-center text-gray-600">Cargando...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();
const pizzaId = route.query.id;

const loading = ref(true);
const pizzaActual = ref({});
const ingredientes = ref([]);
const allIngredientes = ref([]);
const selectedIngrediente = ref(null);
const cantidad = ref(0);

// Obtener información de la pizza seleccionada
const loadPizzaInfo = async () => {
  try {
    const response = await fetch(`/api/products/pizza?id=${pizzaId}`);
    if (!response.ok) throw new Error('Error al obtener los detalles de la pizza');

    const data = await response.json(); // Esto es un array
    const encontrada = data.find(p => String(p.id_pizza) === String(pizzaId)); // ¡Compara como string para evitar bugs!
    
    if (!encontrada) throw new Error('Pizza no encontrada');

    pizzaActual.value = encontrada;
  } catch (error) {
    console.error(error.message);
    ElMessage.error(error.message);
  } finally {
    loading.value = false;
  }
};


// Cargar ingredientes actuales de la pizza
const loadIngredientes = async () => {
  try {
    const response = await fetch(`/api/products/pizzaIngrediente?id_pizza=${pizzaId}`);
    if (!response.ok) throw new Error("Error al obtener los ingredientes");
    ingredientes.value = await response.json();
  } catch (error) {
    console.error(error.message);
  }
};

// Cargar todos los ingredientes disponibles
const loadAllIngredientes = async () => {
  try {
    const response = await fetch('/api/products/ingrediente');
    if (!response.ok) throw new Error("Error al obtener ingredientes disponibles");
    allIngredientes.value = await response.json();
  } catch (error) {
    console.error(error.message);
  }
};

// Agregar ingrediente
const addIngrediente = async () => {
  const cantidadNum = Number(cantidad.value);

  if (!selectedIngrediente.value) {
    ElMessage.error('Selecciona un ingrediente.');
    return;
  }

  if (isNaN(cantidadNum) || cantidadNum < 5 || cantidadNum > 1300) {
    ElMessage.error('La cantidad debe estar entre 5 y 1300 gramos.');
    return;
  }

  try {
    const response = await fetch('/api/products/pizzaIngrediente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_pizza: pizzaActual.value.id_pizza,
        id_ingrediente: selectedIngrediente.value,
        cantidad: cantidadNum,
      }),
    });

    if (!response.ok) throw new Error('Error al agregar ingrediente.');

    ElMessage.success('Ingrediente agregado correctamente.');
    await loadIngredientes();
    cantidad.value = 0;
    selectedIngrediente.value = null;
  } catch (error) {
    ElMessage.error(error.message);
  }
};

const goBack = () => {
  router.push('/products/pizza');
};
// Eliminar ingrediente
const removeIngrediente = async (idIngrediente) => {
  try {
    const response = await fetch('/api/products/pizzaIngrediente', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_pizza: pizzaId,
        id_ingrediente: idIngrediente
      }),
    });
    if (!response.ok) throw new Error("Error al eliminar ingrediente");
    await loadIngredientes();
  } catch (error) {
    console.error(error.message);
  }
};

onMounted(async () => {
  await loadPizzaInfo();
  await loadIngredientes();
  await loadAllIngredientes();
  loading.value = false;
  console.log('Pizza cargada:', pizzaActual.value);
});


</script>
