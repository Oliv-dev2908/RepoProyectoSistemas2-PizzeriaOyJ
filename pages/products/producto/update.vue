<template>
  <div v-if="loading">
    Cargando . . .
  </div>
  <div v-else class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Actualizar Producto</h1>

    <form @submit.prevent="submitForm" class="space-y-4">
      <input v-model="producto.nombre" placeholder="Nombre del producto" required class="border p-2 rounded w-full" />
      <textarea v-model="producto.descripcion" placeholder="Descripción del producto" required
        class="border p-2 rounded w-full"></textarea>
      <input v-model.number="producto.precio" type="number" placeholder="Precio del producto" required
        class="border p-2 rounded w-full" />

      <!-- Combo box de categorías -->
      <el-select v-model="producto.id_categoria" placeholder="Seleccione categoría">
        <el-option v-for="categoria in categorias" :key="categoria.id_categoria" :label="categoria.nombre"
          :value="categoria.id_categoria" />
      </el-select>

      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
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
const producto = ref({
  id_producto: null,
  nombre: '',
  descripcion: '',
  precio: null,
  id_categoria: null,
});
const categorias = ref([]);

const loadCategorias = async () => {
  try {
    const response = await fetch('/api/products/categoria');
    categorias.value = await response.json();
  } catch (error) {
    console.error('Error al cargar categorías', error);
  }
};

const loadProducto = async (id) => {
  try {
    const response = await fetch(`/api/products/producto?id=${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener el producto');
    }
    const data = await response.json();

    // Ajustamos si viene como array
    if (Array.isArray(data)) {
      producto.value = data[0];
    } else {
      producto.value = data;
    }
  } catch (error) {
    console.error(error.message);
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  try {
    const response = await fetch(`/api/products/producto`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(producto.value),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el producto');
    }

    await response.json();
    router.push('/products/producto');
  } catch (error) {
    console.error(error.message);
  }
};

onMounted(() => {
  const id = new URLSearchParams(window.location.search).get('id');
  loadProducto(id);
  loadCategorias();
});
</script>
