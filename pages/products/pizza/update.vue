<template>        
  <div v-if="loading">
      Cargando . . .
  </div>
  <div v-else class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Actualizar Categoría</h1>
    <form @submit.prevent="submitForm" class="space-y-4">
      <input v-model="categoria.nombre" placeholder="Nombre" required class="border p-2 rounded w-full" />
      <input v-model="categoria.precio_extra" placeholder="Precio Extra" type="number" required class="border p-2 rounded w-full" />
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Actualizar</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const loading = ref(true);
const router = useRouter();
const categoria = ref({
id_categoria: null,
nombre: '',
precio_extra: 0,
});

const loadCategoria = async (id) => {
try {
  const response = await fetch(`/api/products/categoria?id=${id}`);
  if (!response.ok) {
    throw new Error('Error fetching categoría');
  }
  categoria.value = await response.json();
} catch (error) {
  console.error(error.message);
} finally {
  loading.value = false;
}
};

const submitForm = async () => {
try {
  const response = await fetch(`/api/products/categoria`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(categoria.value),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar categoría');
  }

  await response.json();
  router.push('/products/categoria'); // Redirige a la lista de categorías
} catch (error) {
  console.error(error.message);
}
};

onMounted(() => {
const id = new URLSearchParams(window.location.search).get('id');
loadCategoria(id);
});
</script>