<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Agregar Tamaño</h1>
      <form @submit.prevent="submitForm" class="space-y-4">
        <input v-model="tamaño.nombre" placeholder="Nombre" required class="border p-2 rounded w-full" />
        <input v-model="tamaño.descripcion" placeholder="Descripción" required class="border p-2 rounded w-full" />
        <input v-model="tamaño.precio_base" placeholder="Precio Base" type="number" required class="border p-2 rounded w-full" />
        <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Agregar</button>
      </form>
    </div>
  </template>
  
<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  

  const router = useRouter();
  const tamaño = ref({
    nombre: '',
    descripcion: '',
    precio_base: 100,
  });
  
  const submitForm = async () => {
    try {
      const response = await fetch('/api/products/tamano', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tamaño.value),
      });
  
      if (!response.ok) {
        throw new Error('Error al agregar tamaño');
      }
  
      await response.json();
      router.push('/products/tamano'); // Redirige a la lista de tamaños
    } catch (error) {
      console.error(error.message);
    }
  };
</script>