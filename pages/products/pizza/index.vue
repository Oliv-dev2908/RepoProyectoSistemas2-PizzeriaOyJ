<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Pizzas</h1>

    <div v-if="loading" class="text-center">
      Cargando...
    </div>

    <div v-else>
      <button @click="redirectToInsert" class="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Agregar Pizza
      </button>

      <ul class="space-y-2 mt-4">
        <li v-for="pizza in pizzas" :key="pizza.id_pizza" class="flex justify-between items-center border p-4 rounded shadow">
          <div>
            <h2 class="text-lg font-semibold">{{ pizza.nombre }} ({{ pizza.tamaño }})</h2>
            <p class="text-gray-600">Precio: ${{ pizza.precio }}</p>
            <p class="text-gray-500 text-sm mt-1">{{ pizza.descripcion }}</p>
          </div>
          <div>
            <button @click="redirectToUpdate(pizza.id_pizza)" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Actualizar
            </button>
            <button @click="deletePizza(pizza.id_pizza)" class="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
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
    const response = await fetch('/api/pizzas');
    if (!response.ok) {
      throw new Error('Error al cargar las pizzas');
    }
    pizzas.value = await response.json();
  } catch (error) {
    console.error(error.message);
  } finally {
    loading.value = false;
  }
};

const redirectToUpdate = (id) => {
  router.push(`products/pizza/update?id=${id}`);
};

const redirectToInsert = () => {
  router.push('products/pizza/insert');
};

const deletePizza = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta pizza?')) {
    try {
      const response = await fetch(`/api/pizzas`, {
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
      loadPizzas(); // Recargar la lista
    } catch (error) {
      console.error(error.message);
    }
  }
};

onMounted(loadPizzas);
</script>
