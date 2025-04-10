<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Ingredientes</h1>
    <div v-if="loading" class="text-center">
      Cargando....
    </div>
    <div v-else>
      <button @click="redirectToInsert" class="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Agregar Ingrediente
      </button>
      <ul class="space-y-2 mt-4">
        <li v-for="ing in ingredientes" :key="ing.id_ingrediente" class="flex justify-between items-center border p-4 rounded shadow">
          <div>
            <h2 class="text-lg font-semibold">{{ ing.nombre }}</h2>
            <p class="text-gray-600">Costo Unitario: ${{ ing.costo_unitario }}</p>
            <p class="text-gray-600">Tipo: {{ ing.tipo }}</p>
          </div>
          <div>
            <button @click="redirectToUpdate(ing.id_ingrediente)" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Actualizar
            </button>
            <button @click="deleteIngrediente(ing.id_ingrediente)" class="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
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
const ingredientes = ref([]);
const loading = ref(true);

const loadIngredientes = async () => {
  try {
    const response = await fetch('/api/products/ingrediente');
    if (!response.ok) {
      throw new Error('Error al obtener los ingredientes');
    }
    ingredientes.value = await response.json();
  } catch (error) {
    console.error(error.message);
  } finally {
    loading.value = false;
  }
};

const redirectToUpdate = (id) => {
  router.push(`/products/ingrediente/update?id=${id}`);
};

const redirectToInsert = () => {
  router.push('/products/ingrediente/insert');
};

const deleteIngrediente = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este ingrediente?')) {
    try {
      const response = await fetch(`/api/products/ingrediente`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_ingrediente: id }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el ingrediente');
      }

      await response.json();
      loadIngredientes();
    } catch (error) {
      console.error(error.message);
    }
  }
};

onMounted(loadIngredientes);
</script>
