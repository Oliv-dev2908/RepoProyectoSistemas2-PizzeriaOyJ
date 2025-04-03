<template>        
    <div v-if="loading">
        Cargando . . .
    </div>
    <div v-else class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Actualizar Tamaño</h1>
      <form @submit.prevent="submitForm" class="space-y-4">        <input v-model="tamano[0].nombre" placeholder="Nombre" required class="border p-2 rounded w-full" />
        <input v-model="tamano[0].descripcion" placeholder="Descripción" required class="border p-2 rounded w-full" />
        <input v-model="tamano[0].precio_base" placeholder="Precio Base" type="number" required class="border p-2 rounded w-full" />
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Actualizar</button>
      </form>
    </div>
</template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';

  const loading = ref(true);
  const router = useRouter();
  const tamano = ref({
    id: null,
    nombre: '',
    descripcion: '',
    precio_base: 0,
  });
  
  const loadTamaño = async (id) => {
    try {
      const response = await fetch(`/api/products/tamano?id=${id}`);
      console.log(response);
      if (!response.ok) {
        throw new Error('Error fetching tamaño');
      }
      tamano.value = await response.json();
      console.log(tamano.value);
    } catch (error) {
      console.error(error.message);
    } finally{
        loading.value = false;
    }
  };
  
  const submitForm = async () => {
    try {
      const response = await fetch(`/api/products/tamano`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tamano.value),
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar tamaño');
      }
  
      await response.json();
      router.push('/products/tamano'); // Redirige a la lista de tamaños
    } catch (error) {
      console.error(error.message);
    }
  };
  
  onMounted(() => {
    const id = new URLSearchParams(window.location.search).get('id');
    loadTamaño(id);
  });
  </script>