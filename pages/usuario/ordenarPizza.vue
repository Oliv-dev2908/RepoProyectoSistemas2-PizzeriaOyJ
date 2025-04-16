<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Realizar nuevo pedido</h1>

    <div v-if="loading" class="text-center">Cargando...</div>

    <div v-else class="space-y-4">
      <!-- Pizza -->
      <div>
        <label class="block font-semibold mb-1">Selecciona una Pizza:</label>
        <select v-model="selectedPizza" class="w-full border p-2 rounded">
          <option disabled value="">-- Selecciona una pizza --</option>
          <option v-for="pizza in pizzas" :key="pizza.id_pizza" :value="pizza.id_pizza">
            {{ pizza.nombre }}
          </option>
        </select>
      </div>

      <!-- Tamaño -->
      <div>
        <label class="block font-semibold mb-1">Selecciona un Tamaño:</label>
        <select v-model="selectedTamano" class="w-full border p-2 rounded">
          <option disabled value="">-- Selecciona un tamaño --</option>
          <option v-for="tam in tamanos" :key="tam.id_tamano" :value="tam.id_tamano">
            {{ tam.nombre }}
          </option>
        </select>
      </div>

      <!-- Producto -->
      <div>
        <label class="block font-semibold mb-1">Selecciona un Producto (opcional):</label>
        <select v-model="selectedProducto" class="w-full border p-2 rounded">
          <option disabled value="">-- Selecciona un producto --</option>
          <option v-for="producto in productos" :key="producto.id_producto" :value="producto.id_producto">
            {{ producto.nombre }}
          </option>
        </select>
      </div>

      <!-- Cantidad producto -->
      <div v-if="selectedProducto">
        <label class="block font-semibold mb-1">Cantidad de Producto:</label>
        <input v-model.number="cantidadProducto" type="number" min="1" class="w-full border p-2 rounded" />
      </div>

      <!-- Cantidad -->
      <div>
        <label class="block font-semibold mb-1">Cantidad:</label>
        <input v-model.number="cantidad" type="number" min="1" class="w-full border p-2 rounded" />
      </div>

      <!-- Confirmación -->
      <div>
        <button @click="realizarPedido" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          Confirmar Pedido
        </button>
      </div>

      <div v-if="mensaje" class="mt-4 p-3 bg-blue-100 border border-blue-300 rounded">
        {{ mensaje }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSupabaseUser } from '#imports'

const user = useSupabaseUser(); // Obtener el usuario actual de Supabase

const pizzas = ref([]);
const tamanos = ref([]);
const productos = ref([]);
const selectedPizza = ref('');
const selectedTamano = ref('');
const cantidad = ref(1);
const selectedProducto = ref('');
const cantidadProducto = ref(1);
const mensaje = ref('');
const loading = ref(true);

// Obtener todas las pizzas
const cargarPizzas = async () => {
  const res = await fetch('/api/products/pizza');
  pizzas.value = await res.json();
};

// Obtener todos los tamaños
const cargarTamanos = async () => {
  const res = await fetch('/api/products/tamano');
  tamanos.value = await res.json();
};

// Obtener todos los productos
const cargarProductos = async () => {
  const res = await fetch('/api/products/producto');
  productos.value = await res.json();
};

// Realizar pedido
const realizarPedido = async () => {
  if (!selectedPizza.value || !selectedTamano.value || cantidad.value < 1) {
    alert("Por favor selecciona todos los campos.");
    return;
  }

  const tamanoSeleccionado = tamanos.value.find(t => t.id_tamano === selectedTamano.value);
  const precioUnitario = 100;
  
  // Obtener el id_cliente desde el usuario de Supabase
  const id_cliente = user.value?.identities?.[0]?.user_id;

  console.log("ID Cliente:", id_cliente);

  console.log({
  id_cliente,
  id_pizza: selectedPizza.value,
  id_tamano: selectedTamano.value,
  cantidad: cantidad.value,
  precio_unitario: precioUnitario,
  id_producto: selectedProducto.value || null,
  cantidad_producto: selectedProducto.value ? cantidadProducto.value : 0,
  fecha: new Date().toISOString(),
});

  try {
    const res = await fetch('/api/usuario/pedirPizza', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_cliente, // Enviar el id_cliente en el body
        id_pizza: selectedPizza.value,
        id_tamano: selectedTamano.value,
        cantidad: cantidad.value,
        precio_unitario: precioUnitario,
        id_producto: selectedProducto.value || null,
        cantidad_producto: selectedProducto.value ? cantidadProducto.value : 0,
        fecha: new Date().toISOString()
      }),
    });

    const resultado = await res.json();

    if (res.ok) {
      mensaje.value = 'Pedido realizado con éxito.';
      selectedPizza.value = '';
      selectedTamano.value = '';
      selectedProducto.value = '';
      cantidad.value = 1;
      cantidadProducto.value = 1;
    } else {
      mensaje.value = resultado.message || 'Hubo un error al realizar el pedido.';
    }
  } catch (error) {
    console.error(error);
    mensaje.value = 'Hubo un error al realizar el pedido.';
  }
};

onMounted(async () => {
  await cargarPizzas();
  await cargarTamanos();
  await cargarProductos();
  loading.value = false;
});
</script>
