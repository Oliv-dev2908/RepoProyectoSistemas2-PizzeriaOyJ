<template>
  <div v-if="loading">
    Cargando . . .
  </div>
  <div v-else class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Actualizar Ingrediente</h1>
    <form @submit.prevent="submitForm" class="space-y-4">
      <input
        v-model="ingrediente[0].nombre"
        placeholder="Nombre del ingrediente"
        required
        class="border p-2 rounded w-full"
      />
      <input
        v-model="ingrediente[0].costo_unitario"
        placeholder="Costo unitario"
        type="number"
        step="0.01"
        required
        class="border p-2 rounded w-full"
      />
      <input
        v-model="ingrediente[0].tipo"
        placeholder="Tipo (ej. vegetal, cárnico, etc.)"
        required
        class="border p-2 rounded w-full"
      />
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Actualizar
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const loading = ref(true);
const router = useRouter();
const ingrediente = ref({
  id_ingrediente: null,
  nombre: '',
  costo_unitario: 0.0,
  tipo: '',
});

const loadIngrediente = async (id) => {
  try {
    const response = await fetch(`/api/products/ingrediente?id=${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener ingrediente');
    }
    ingrediente.value = await response.json();
  } catch (error) {
    console.error(error.message);
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  try {
    const response = await fetch(`/api/products/ingrediente`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ingrediente.value),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar ingrediente');
    }

    await response.json();
    router.push('/products/ingrediente');
  } catch (error) {
    console.error(error.message);
  }
};

onMounted(() => {
  const id = new URLSearchParams(window.location.search).get('id');
  loadIngrediente(id);
});
</script>
