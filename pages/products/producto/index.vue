<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Productos</h1>

    <div v-if="loading" class="text-center">
      Cargando....
    </div>

    <div v-else>
      <button @click="redirectToInsert" class="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Agregar Producto
      </button>

      <ul class="space-y-2 mt-4">
        <li v-for="prod in productos" :key="prod.id_producto" class="flex justify-between items-center border p-4 rounded shadow">
          <div>
            <h2 class="text-lg font-semibold">{{ prod.nombre }}</h2> <!-- Nombre del producto -->
            <p class="text-gray-600">Descripción: {{ prod.descripcion }}</p>
            <p class="text-gray-600">Categoría: {{ prod.categoria_nombre || 'Sin categoría' }}</p> <!-- Aquí usamos categoria_nombre -->
            <p class="text-gray-600">Precio: ${{ prod.precio }}</p> <!-- 🔵 Nuevo campo para mostrar precio -->
          </div>
          <div>
            <button @click="redirectToUpdate(prod.id_producto)" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Actualizar
            </button>
            <button @click="deleteProducto(prod.id_producto)" class="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Eliminar
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const productos = ref([]);
const loading = ref(true);

const loadProductos = async () => {
  try {
    const response = await fetch('/api/products/producto');
    if (!response.ok) {
      throw new Error('Error al obtener los productos');
    }
    productos.value = await response.json();
  } catch (error) {
    console.error(error.message);
  } finally {
    loading.value = false;
  }
};

const redirectToUpdate = (id) => {
  router.push(`/products/producto/update?id=${id}`);
};

const redirectToInsert = () => {
  router.push('/products/producto/insert');
};

const deleteProducto = async (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    try {
      const response = await fetch(`/api/products/producto`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_producto: id }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }

      await response.json();
      loadProductos();
    } catch (error) {
      console.error(error.message);
    }
  }
};

onMounted(loadProductos);
</script>
