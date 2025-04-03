<template>
    <div>
      <h1>Products</h1>
      <ul>
        <li v-for="product in products" :key="product.id">{{ product.name }} - ${{ product.price }}</li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const products = ref([]);
  
  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products'); // Llama al endpoint de la API
      if (!response.ok) {
        throw new Error('Error fetching products');
      }
      products.value = await response.json(); // Asigna la lista de productos
    } catch (error) {
      console.error(error.message);
    }
  };
  
  onMounted(loadProducts); // Carga los productos al montar el componente
  </script>