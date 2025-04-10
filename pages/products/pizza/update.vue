<template>
  <div v-if="loading" class="text-center">
    Cargando . . .
  </div>
  <div v-else class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Actualizar Pizza</h1>
    <form @submit.prevent="submitForm" class="space-y-4">
      <input 
        v-model="pizza[0].nombre" 
        placeholder="Nombre de la Pizza" 
        required 
        class="border p-2 rounded w-full" 
      />
      <textarea 
        v-model="pizza[0].descripcion" 
        placeholder="Descripción" 
        required 
        class="border p-2 rounded w-full" 
      ></textarea>
      <button 
        type="submit" 
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Actualizar Pizza
      </button>
    </form>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';

  const loading = ref(true);
  const router = useRouter();
  const pizza = ref({
    id_pizza: null,
    nombre: '',
    descripcion: '',
  });

  // Cargar los datos de la pizza desde el servidor
  const loadPizza = async (id) => {
    try {
      const response = await fetch(`/api/products/pizza?id=${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener los detalles de la pizza');
      }
      pizza.value = await response.json();
    } catch (error) {
      console.error(error.message);
    } finally {
      loading.value = false;
    }
  };

  // Enviar los datos actualizados al servidor
  const submitForm = async () => {
    try {
      const response = await fetch(`/api/products/pizza`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pizza.value),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la pizza');
      }

      await response.json();
      router.push('/products/pizza'); // Redirige a la lista de pizzas
    } catch (error) {
      console.error(error.message);
    }
  };

  // Obtener el ID de la pizza desde la URL y cargar los datos
  onMounted(() => {
    const id = new URLSearchParams(window.location.search).get('id');
    loadPizza(id);
  });
</script>
