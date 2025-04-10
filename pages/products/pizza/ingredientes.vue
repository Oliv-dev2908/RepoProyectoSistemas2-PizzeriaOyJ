<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Ingredientes de la Pizza</h1>

    <div v-if="loading" class="text-center">
      Cargando...
    </div>

    <div v-else>
      <!-- Pizza seleccionada -->
      <div class="mb-4">
        <label class="font-semibold">Pizza seleccionada:</label>
        <select disabled class="w-full p-2 border rounded mt-1 bg-gray-100">
          <option :value="pizzaActual[0].id_pizza" v-if="pizzaActual">
            {{ pizzaActual[0].nombre }}
          </option>
        </select>
      </div>

      <!-- Ingredientes actuales -->
      <div v-if="ingredientes.length === 0">
        <p>Aún no se agregaron ingredientes a esta pizza.</p>
      </div>
      <div v-else>
        <h3 class="text-lg font-semibold">Ingredientes Actuales:</h3>
        <ul class="space-y-2 mt-2">
          <li v-for="ingrediente in ingredientes" :key="ingrediente.id_ingrediente"
              class="flex justify-between items-center border p-2 rounded shadow">
            <p>{{ ingrediente.nombre }} - Cantidad: {{ ingrediente.cantidad }}</p>
            <button @click="removeIngrediente(ingrediente.id_ingrediente)"
                    class="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
              Eliminar
            </button>
          </li>
        </ul>
      </div>

      <!-- Agregar ingrediente -->
      <div class="mt-4">
        <h3 class="text-lg font-semibold">Agregar Ingredientes:</h3>
        <select v-model="selectedIngrediente" class="mt-2 p-2 border rounded w-full">
          <option v-for="ingrediente in allIngredientes"
                  :key="ingrediente.id_ingrediente"
                  :value="ingrediente.id_ingrediente">
            {{ ingrediente.nombre }}
          </option>
        </select>
        <input v-model="cantidad" type="number" placeholder="Cantidad"
               class="mt-2 p-2 border rounded w-full" />
        <button @click="addIngrediente"
                class="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Agregar Ingrediente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const pizzaId = route.query.id;

const loading = ref(true);
const pizzaActual = ref(null); // Nueva variable
const ingredientes = ref([]);
const allIngredientes = ref([]);
const selectedIngrediente = ref(null);
const cantidad = ref(0);

// Obtener información de la pizza seleccionada
const loadPizzaInfo = async (id) => {
    try {
      const response = await fetch(`/api/products/pizza?id=${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener los detalles de la pizza');
      }
      pizzaActual.value = await response.json();
    } catch (error) {
      console.error(error.message);
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
  if (!selectedIngrediente.value || cantidad.value <= 0) {
    alert('Selecciona un ingrediente y una cantidad válida.');
    return;
  }
  try {
    const response = await fetch("/api/products/pizzaIngrediente", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_pizza: pizzaId,
        id_ingrediente: selectedIngrediente.value,
        cantidad: cantidad.value
      }),
    });
    if (!response.ok) throw new Error("Error al agregar ingrediente");
    await loadIngredientes();
    cantidad.value = 0;
    selectedIngrediente.value = null;
  } catch (error) {
    console.error(error.message);
  }
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
});
</script>
