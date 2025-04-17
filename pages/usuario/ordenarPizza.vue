<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Realizar nuevo pedido</h1>

    <div v-if="loading" class="text-center">Cargando...</div>

    <div v-else class="space-y-4">
      <!-- Selección Pizza -->
      <div>
        <label class="block font-semibold mb-1">Selecciona una Pizza:</label>
        <select v-model="selectedPizza" class="w-full border p-2 rounded">
          <option disabled value="">-- Selecciona una pizza --</option>
          <option v-for="pizza in pizzas" :key="pizza.id_pizza" :value="pizza.id_pizza">
            {{ pizza.nombre }}
          </option>
        </select>
      </div>

      <!-- Selección Tamaño -->
      <div>
        <label class="block font-semibold mb-1">Selecciona un Tamaño:</label>
        <select v-model="selectedTamano" class="w-full border p-2 rounded">
          <option disabled value="">-- Selecciona un tamaño --</option>
          <option v-for="tam in tamanos" :key="tam.id_tamano" :value="tam.id_tamano">
            {{ tam.nombre }}
          </option>
        </select>
      </div>

      <!-- Selección Producto -->
      <div>
        <label class="block font-semibold mb-1">Selecciona un Producto (opcional):</label>
        <select v-model="selectedProducto" class="w-full border p-2 rounded">
          <option disabled value="">-- Selecciona un producto --</option>
          <option v-for="producto in productos" :key="producto.id_producto" :value="producto.id_producto">
            {{ producto.nombre }}
          </option>
        </select>
      </div>

      <!-- Cantidad Producto -->
      <div v-if="selectedProducto">
        <label class="block font-semibold mb-1">Cantidad de Producto:</label>
        <input v-model.number="cantidadProducto" type="number" min="1" class="w-full border p-2 rounded" />
      </div>

      <!-- Cantidad de Pizzas -->
      <div>
        <label class="block font-semibold mb-1">Cantidad de Pizzas:</label>
        <input v-model.number="cantidad" type="number" min="1" class="w-full border p-2 rounded" />
      </div>

      <!-- Botones de acción -->
      <div class="flex space-x-4">
        <button @click="agregarAlCarrito" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Agregar al carrito
        </button>
        <button @click="finalizarPedido" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          Finalizar Pedido
        </button>
      </div>

      <!-- Carrito -->
      <div v-if="carrito.length > 0" class="mt-8">
        <h2 class="text-xl font-bold mb-2">Carrito</h2>
        <ul class="space-y-2">
          <li v-for="(item, index) in carrito" :key="index" class="border p-2 rounded">
            <div v-if="item.tipo === 'pizza'">
              🍕 {{ item.pizzaNombre }} ({{ item.tamanoNombre }}) x{{ item.cantidad }} -
              ${{ (item.precioUnitario * item.cantidad).toFixed(2) }}
            </div>
            <div v-else-if="item.tipo === 'producto'">
              🛒 Producto: {{ item.productoNombre }} x{{ item.cantidadProducto }} -
              ${{ (item.precioUnitario * item.cantidadProducto).toFixed(2) }}
            </div>
          </li>

        </ul>

        <div class="mt-4 font-bold text-right">
          Total: ${{ calcularTotal().toFixed(2) }}
        </div>
      </div>

      <!-- Mensaje de confirmación -->
      <div v-if="mensaje" class="mt-4 p-3 bg-blue-100 border border-blue-300 rounded">
        {{ mensaje }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSupabaseUser } from '#imports'

const user = useSupabaseUser();

const pizzas = ref([]);
const tamanos = ref([]);
const productos = ref([]);
const carrito = ref([]);

const selectedPizza = ref('');
const selectedTamano = ref('');
const cantidad = ref(1);
const selectedProducto = ref('');
const cantidadProducto = ref(1);
const mensaje = ref('');
const loading = ref(true);

// Cargar datos
const cargarPizzas = async () => {
  const res = await fetch('/api/products/pizza');
  pizzas.value = await res.json();
};

const cargarTamanos = async () => {
  const res = await fetch('/api/products/tamano');
  tamanos.value = await res.json();
};

const cargarProductos = async () => {
  const res = await fetch('/api/products/producto');
  const data = await res.json();
  productos.value = Array.isArray(data) ? data : (data.data ?? []);
};

// Agregar al carrito
const agregarAlCarrito = () => {
  if (!selectedPizza.value && !selectedProducto.value) {
    alert("Por favor selecciona al menos una pizza o un producto.");
    return;
  }

  // Agregar pizza si se seleccionó
  if (selectedPizza.value && selectedTamano.value) {
    const pizza = pizzas.value.find(p => p.id_pizza === selectedPizza.value);
    const tamano = tamanos.value.find(t => t.id_tamano === selectedTamano.value);

    if (!pizza || !tamano) {
      alert("Pizza o tamaño inválido.");
      return;
    }

    // Cambiamos la multiplicación por la suma:
    const precioCalculo = parseFloat(pizza.precio_base) + parseFloat(tamano.precio_base);
    console.log(pizza.precio_base);
    console.log(tamano.precio_base);
    console.log(precioCalculo);
    const precioFinal = precioCalculo;

    carrito.value.push({
      tipo: 'pizza',
      id_pizza: selectedPizza.value,
      pizzaNombre: pizza.nombre,
      id_tamano: selectedTamano.value,
      tamanoNombre: tamano.nombre,
      cantidad: cantidad.value,
      precioUnitario: precioFinal,
      id_producto: null,
      productoNombre: null,
      cantidadProducto: 0,
    });
  }

  // Agregar producto si se seleccionó
  if (selectedProducto.value) {
    const producto = productos.value.find(p => p.id_producto === selectedProducto.value);

    if (!producto) {
      alert("Producto inválido.");
      return;
    }

    carrito.value.push({
      tipo: 'producto',
      id_producto: selectedProducto.value,
      productoNombre: producto.nombre,
      cantidadProducto: cantidadProducto.value,
      precioUnitario: producto.precio, // Aquí debes asegurarte de que tu producto tenga `precio`
      id_pizza: null,
      pizzaNombre: null,
      id_tamano: null,
      tamanoNombre: null,
      cantidad: 0,
    });
  }

  // Reset campos
  selectedPizza.value = '';
  selectedTamano.value = '';
  cantidad.value = 1;
  selectedProducto.value = '';
  cantidadProducto.value = 1;
};

// Finalizar pedido (enviar todo el carrito)
const finalizarPedido = async () => {
  if (carrito.value.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  const id_cliente = user.value?.identities?.[0]?.user_id;

  try {
    const res = await fetch('/api/usuario/pedirPizza', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_cliente,
        pedido: carrito.value,
        fecha: new Date().toISOString()
      }),
    });

    const resultado = await res.json();

    if (res.ok) {
      mensaje.value = 'Pedido realizado con éxito.';
      carrito.value = []; // Limpiar carrito
    } else {
      mensaje.value = resultado.message || 'Hubo un error al realizar el pedido.';
    }
  } catch (error) {
    console.error(error);
    mensaje.value = 'Hubo un error al realizar el pedido.';
  }
};

// Calcular total
const calcularTotal = () => {
  return carrito.value.reduce((total, item) => {
    return total + (item.precioUnitario * (item.tipo === 'pizza' ? item.cantidad : item.cantidadProducto));
  }, 0);
};

onMounted(async () => {
  await cargarPizzas();
  await cargarTamanos();
  await cargarProductos();
  loading.value = false;
});
</script>
