<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Agregar Ingrediente</h1>
    <form @submit.prevent="submitForm" class="space-y-4">
      <input
        v-model="ingrediente.nombre"
        placeholder="Nombre del ingrediente"
        required
        class="border p-2 rounded w-full"
      />
      <input
        v-model="ingrediente.costo_unitario"
        placeholder="Costo unitario"
        type="number"
        step="0.01"
        required
        class="border p-2 rounded w-full"
      />
      <input
        v-model="ingrediente.tipo"
        placeholder="Tipo (ej. vegetal, cárnico, etc.)"
        required
        class="border p-2 rounded w-full"
      />
      <button
        type="submit"
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Agregar
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const ingrediente = ref({
  nombre: '',
  costo_unitario: 0.00,
  tipo: '',
});

const submitForm = async () => {
  try {
    const response = await fetch('/api/products/ingrediente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ingrediente.value),
    });

    if (!response.ok) {
      throw new Error('Error al agregar ingrediente');
    }

    await response.json();
    router.push('/products/ingrediente');
  } catch (error) {
    console.error(error.message);
  }
};
</script>
