// Dentro de tu componente o página (por ejemplo, index.vue)
<script setup>
const products = await $fetch('/api/products');
</script>

<template>
  <h1>Lista de Pizzas</h1>
  <ul>
    <li v-for="product in products" :key="product.id">
      {{ product.name }} - ${{ product.price }}
    </li>
  </ul>
</template>
