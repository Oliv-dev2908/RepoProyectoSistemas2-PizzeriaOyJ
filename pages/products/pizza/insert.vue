<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Agregar Pizza</h1>
    <form @submit.prevent="submitForm" class="space-y-4">
      <input 
        v-model="pizza.nombre" 
        placeholder="Nombre de la Pizza" 
        required 
        class="border p-2 rounded w-full" 
      />
      <textarea 
        v-model="pizza.descripcion" 
        placeholder="Descripción" 
        required 
        class="border p-2 rounded w-full" 
      ></textarea>
      <button 
        type="submit" 
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Agregar Pizza
      </button>
    </form>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const pizza = ref({
    nombre: '',
    descripcion: '',
  });

  const submitForm = async () => {
    try {
      const response = await fetch('/api/products/pizza', { // Endpoint para agregar pizza
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pizza.value),
      });

      if (!response.ok) {
        throw new Error('Error al agregar pizza');
      }

      await response.json();
      router.push('/products/pizza'); // Redirige a la lista de pizzas
    } catch (error) {
      console.error(error.message);
    }
  };
</script>
