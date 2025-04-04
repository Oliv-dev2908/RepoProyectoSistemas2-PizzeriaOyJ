<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Agregar Categoría</h1>
      <form @submit.prevent="submitForm" class="space-y-4">
        <input v-model="categoria.nombre" placeholder="Nombre" required class="border p-2 rounded w-full" />
        <input v-model="categoria.precio_extra" placeholder="Precio Extra" type="number" required class="border p-2 rounded w-full" />
        <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Agregar</button>
      </form>
    </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const categoria = ref({
    nombre: '',
    precio_extra: 0, // Cambiado a 0 como valor por defecto
  });

  const submitForm = async () => {
    try {
      const response = await fetch('/api/products/categoria', { // Cambiado a /categorias
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoria.value),
      });

      if (!response.ok) {
        throw new Error('Error al agregar categoría');
      }

      await response.json();
      router.push('/products/categoria'); // Redirige a la lista de categorías
    } catch (error) {
      console.error(error.message);
    }
  };
</script>