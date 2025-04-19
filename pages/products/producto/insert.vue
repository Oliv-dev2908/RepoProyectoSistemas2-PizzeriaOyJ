<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">{{ isUpdate ? 'Actualizar' : 'Agregar' }} Producto</h1>

    <el-form :model="producto" label-width="120px" @submit.native.prevent="saveProducto">
      <el-form-item label="Nombre">
        <el-input v-model="producto.nombre" />
      </el-form-item>

      <el-form-item label="Descripción">
        <el-input type="textarea" v-model="producto.descripcion" />
      </el-form-item>

      <el-form-item label="Precio">
        <el-input v-model.number="producto.precio" type="number" />
      </el-form-item>

      <el-form-item label="Categoría">
        <el-select v-model="producto.id_categoria" placeholder="Seleccione categoría">
          <el-option
            v-for="categoria in categorias"
            :key="categoria.id_categoria"
            :label="categoria.nombre"
            :value="categoria.id_categoria"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveProducto">{{ isUpdate ? 'Actualizar' : 'Guardar' }}</el-button>
        <el-button @click="cancelar">Cancelar</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const producto = ref({
  id_producto: null,
  nombre: '',
  descripcion: '',
  precio: null,              // 👉 añadimos precio aquí
  id_categoria: null,
});

const categorias = ref([]);
const isUpdate = ref(false);

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
    producto.value = await response.json();
  } catch (error) {
    console.error('Error al cargar producto', error);
  }
};

const saveProducto = async () => {
  try {
    const method = isUpdate.value ? 'PUT' : 'POST';
    const url = '/api/products/producto';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(producto.value),
    });

    if (!response.ok) {
      throw new Error('Error al guardar el producto');
    }

    router.push('/products/producto');
  } catch (error) {
    console.error(error.message);
  }
};

const cancelar = () => {
  router.push('/products/producto');
};

onMounted(async () => {
  await loadCategorias();

  const id = route.query.id;
  if (id) {
    isUpdate.value = true;
    await loadProducto(id);
  }
});
</script>
