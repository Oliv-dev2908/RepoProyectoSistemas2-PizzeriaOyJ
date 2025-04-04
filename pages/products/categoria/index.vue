<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Categorías</h1>
    <div v-if="loading" class="text-center">
      Cargando....
    </div>
    <div v-else>
      <button @click="redirectToInsert" class="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Agregar Categoría
      </button>
      <ul class="space-y-2 mt-4">
        <li v-for="cat in categorias" :key="cat.id_categoria" class="flex justify-between items-center border p-4 rounded shadow">
          <div>
            <h2 class="text-lg font-semibold">{{ cat.nombre }}</h2>
            <p class="text-gray-600">Precio Extra: {{ cat.precio_extra }}</p>
          </div>
          <div>
            <button @click="redirectToUpdate(cat.id_categoria)" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Actualizar
            </button>
            <button @click="deleteCategoria(cat.id_categoria)" class="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
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
const categorias = ref([]);
const loading = ref(true);

const loadCats = async () => {
  try {
    const response = await fetch('/api/products/categoria');
    if (!response.ok) {
      throw new Error('Error fetching categories');
    }
    categorias.value = await response.json();
  } catch (error) {
    console.error(error.message);
  } finally {
    loading.value = false;
  }
};

const redirectToUpdate = (id) => {
  router.push(`/products/categoria/update?id=${id}`);
};

const redirectToInsert = () => {
  router.push('/products/categoria/insert');
};

const deleteCategoria = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
    try {
      const response = await fetch(`/api/products/categoria`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_categoria: id }), // Enviamos el ID de la categoría a eliminar
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la categoría');
      }

      await response.json();
      // Recargar la lista de categorías después de eliminar
      loadCats();
    } catch (error) {
      console.error(error.message);
    }
  }
};

onMounted(loadCats);
</script>