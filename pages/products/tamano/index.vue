<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Tamaños</h1>
    <div v-if="loading" class="text-center">
      Cargando....
    </div>
    <div v-else>
      <button @click="redirectToInsert" class="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Agregar Tamaño
      </button>
      <ul class="space-y-2 mt-4">
        <li v-for="tam in tamanos" :key="tam.id_tamano" class="flex justify-between items-center border p-4 rounded shadow">
          <div>
            <h2 class="text-lg font-semibold">{{ tam.nombre }}</h2>
            <p class="text-gray-600">Precio: {{ tam.precio_base }} - Descripción: {{ tam.descripcion }}</p>
          </div>
          <button @click="redirectToUpdate(tam.id_tamano)" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Actualizar
          </button>
          <button @click="deleteTamano(tam.id_tamano)" class="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Eliminar
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const tamanos = ref([]);
const loading = ref(true);

const loadTams = async () => {
  try {
    const response = await fetch('/api/products/tamano');
    if (!response.ok) {
      throw new Error('Error fetching products');
    }
    tamanos.value = await response.json();
  } catch (error) {
    console.error(error.message);
  } finally {
    loading.value = false;
  }
};

const redirectToUpdate = (id) => {
  router.push(`/products/tamano/update?id=${id}`);
};

const redirectToInsert = () => {
  router.push('/products/tamano/insert');
};

const deleteTamano = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este tamaño?')) {
    try {
      const response = await fetch(`/api/products/tamano`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_tamano: id }), // Enviamos el ID de la categoría a eliminar
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el tamaño');
      }

      await response.json();
      // Recargar la lista de categorías después de eliminar
      loadTams();
    } catch (error) {
      console.error(error.message);
    }
  }
};


onMounted(loadTams);
</script>