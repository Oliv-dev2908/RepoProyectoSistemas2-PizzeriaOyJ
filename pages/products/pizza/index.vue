<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Pizzas</h1>
    <div v-if="loading" class="text-center">
      Cargando....
    </div>
    <div v-else>
      <button @click="redirectToInsert" class="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Agregar Pizza
      </button>
      <ul class="space-y-2 mt-4">
        <li v-for="pizza in pizzas" :key="pizza.id_pizza"
          class="flex justify-between items-center border p-4 rounded shadow">
          <div>
            <h2 class="text-lg font-semibold">{{ pizza.nombre }}</h2>
            <p class="text-gray-600">Descripción: {{ pizza.descripcion }}</p>
            <p class="text-gray-800 font-medium">Precio base: ${{ pizza.precio_base }}</p>
          </div>
          <div>
            <button @click="redirectToDetalles(pizza.id_pizza)"
              class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
              Detalles
            </button>
            <button @click="redirectToIngredientes(pizza.id_pizza)"
              class="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Agregar/Eliminar Ingredientes
            </button>
            <button @click="redirectToUpdate(pizza.id_pizza)"
              class="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Actualizar
            </button>
            <button @click="deletePizza(pizza.id_pizza)"
              class="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Eliminar
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const pizzas = ref([]);
const loading = ref(true);

const loadPizzas = async () => {
  try {
    const response = await fetch('/api/products/pizza');
    if (!response.ok) {
      throw new Error('Error al obtener las pizzas');
    }
    pizzas.value = await response.json();
  } catch (error) {
    console.error(error.message);
  } finally {
    loading.value = false;
  }
};

const redirectToUpdate = (id) => {
  router.push(`/products/pizza/update?id=${id}`);
};

const redirectToInsert = () => {
  router.push('/products/pizza/insert');
};

const redirectToDetalles = (id) => {
  router.push(`/products/pizza/details?id=${id}`);
};

const redirectToIngredientes = (id) => {
  router.push(`/products/pizza/ingredientes?id=${id}`);
};

const deletePizza = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta pizza?')) {
    try {
      const response = await fetch(`/api/products/pizza`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_pizza: id }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la pizza');
      }

      await response.json();
      loadPizzas();
    } catch (error) {
      console.error(error.message);
    }
  }
};

onMounted(loadPizzas);
</script>
