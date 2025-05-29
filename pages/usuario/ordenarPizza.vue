<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">¿Qué quieres agregar?</h1>

    <!-- Cartas para elegir -->
    <div class="grid grid-cols-2 gap-8">
      <div @click="abrirModal('pizza')"
        class="cursor-pointer bg-yellow-200 p-6 rounded-lg shadow hover:scale-105 transition">
        <h2 class="text-xl font-semibold text-center">🍕 Pizza</h2>
      </div>

      <div @click="abrirModal('producto')"
        class="cursor-pointer bg-green-200 p-6 rounded-lg shadow hover:scale-105 transition">
        <h2 class="text-xl font-semibold text-center">🛒 Producto</h2>
      </div>
    </div>

    <!-- Carrito -->
    <div v-if="carrito.length > 0" class="mt-8">
      <h2 class="text-xl font-bold mb-2">Carrito</h2>
      <ul class="space-y-2">
        <li v-for="(item, index) in carrito" :key="index" class="border p-2 rounded flex justify-between items-center">
          <div>
            <div v-if="item.tipo === 'pizza'">
              🍕 {{ item.pizzaNombre }} ({{ item.tamanoNombre }}) x{{ item.cantidad }} -
              ${{ (item.precioUnitario * item.cantidad).toFixed(2) }}
            </div>
            <div v-else-if="item.tipo === 'producto'">
              🛒 Producto: {{ item.productoNombre }} x{{ item.cantidadProducto }} -
              ${{ (item.precioUnitario * item.cantidadProducto).toFixed(2) }}
            </div>
          </div>

          <div class="flex space-x-2">
            <button @click="editarItem(item)" class="text-blue-600 hover:underline">Editar</button>
            <button @click="eliminarDelCarrito(index)" class="text-red-600 hover:underline">Eliminar</button>
          </div>
        </li>
      </ul>

      <div class="mt-4 font-bold text-right">
        Total: ${{ calcularTotal().toFixed(2) }}
      </div>
    </div>
    <div v-if="carrito.length > 0" class="mt-4 text-right">
      <el-button type="primary" @click="finalizarPedido">Finalizar Pedido</el-button>
    </div>

    <el-dialog v-model="dialogVisible" title="Confirmar Pedido" width="600px"
      :before-close="() => dialogVisible = false">
      <div>
        <h3 class="font-semibold mb-4">Resumen de tu pedido:</h3>
        <ul class="space-y-2">
          <li v-for="(item, index) in carrito" :key="index">
            <div v-if="item.tipo === 'pizza'">
              🍕 {{ item.pizzaNombre }} ({{ item.tamanoNombre }}) x{{ item.cantidad }} -
              ${{ (item.precioUnitario * item.cantidad).toFixed(2) }}
            </div>
            <div v-else-if="item.tipo === 'producto'">
              🛒 {{ item.productoNombre }} x{{ item.cantidadProducto }} -
              ${{ (item.precioUnitario * item.cantidadProducto).toFixed(2) }}
            </div>
          </li>
        </ul>

        <div class="mt-4 font-bold text-right">
          Total: ${{ calcularTotal().toFixed(2) }}
        </div>
      </div>

      <template #footer>
        <el-button @click="dialogVisible = false">Cancelar</el-button>
        <el-button type="primary" @click="confirmarPedido">Confirmar</el-button>
      </template>
    </el-dialog>


    <!-- Mensaje de confirmación -->
    <div v-if="mensaje" class="mt-4 p-3 bg-blue-100 border border-blue-300 rounded">
      {{ mensaje }}
    </div>

    <!-- Modal de Pizza -->
    <el-dialog v-model="modalPizza" title="Agregar Pizza" width="500px">
      <div class="space-y-4">
        <select v-model="selectedPizza" class="w-full p-2 border rounded">
          <option disabled value="">-- Selecciona una pizza --</option>
          <option v-for="pizza in pizzas" :key="pizza.id_pizza" :value="pizza.id_pizza">
            {{ pizza.nombre }}
          </option>
        </select>

        <select v-model="selectedTamano" class="w-full p-2 border rounded">
          <option disabled value="">-- Selecciona un tamaño --</option>
          <option v-for="tam in tamanos" :key="tam.id_tamano" :value="tam.id_tamano">
            {{ tam.nombre }}
          </option>
        </select>

        <input type="number" v-model.number="cantidad" min="1" class="w-full p-2 border rounded"
          placeholder="Cantidad" />
        <div v-if="mensajeError" class="text-red-600 text-sm">{{ mensajeError }}</div>
      </div>

      <template #footer>
        <el-button @click="modalPizza = false">Cancelar</el-button>
        <el-button type="primary" @click="agregarPizza">Agregar</el-button>
      </template>
    </el-dialog>

    <!-- Modal de Producto -->
    <el-dialog v-model="modalProducto" title="Agregar Producto" width="500px">
      <div class="space-y-4">
        <select v-model="selectedProducto" class="w-full p-2 border rounded">
          <option disabled value="">-- Selecciona un producto --</option>
          <option v-for="producto in productos" :key="producto.id_producto" :value="producto.id_producto">
            {{ producto.nombre }}
          </option>
        </select>

        <input type="number" v-model.number="cantidadProducto" min="1" class="w-full p-2 border rounded"
          placeholder="Cantidad" />
        <div v-if="mensajeError" class="text-red-600 text-sm">
          {{ mensajeError }}
        </div>
      </div>

      <template #footer>
        <el-button @click="modalProducto = false">Cancelar</el-button>
        <el-button type="primary" @click="agregarProducto">Agregar</el-button>
      </template>
    </el-dialog>



    <!-- Spinner de carga -->
    <div v-if="loading" class="flex justify-center items-center mt-4">
      <el-loading :loading="loading" text="Procesando tu pedido..." spinner-size="50"></el-loading>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSupabaseUser } from '#imports'
import { ElDialog, ElButton, ElLoading } from 'element-plus';

const user = useSupabaseUser();
const dialogVisible = ref(false); // controla si se muestra la ventana

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
const modalPizza = ref(false);
const modalProducto = ref(false);
const mensajeError = ref('');

const abrirModal = (tipo) => {
  mensajeError.value = ''; // limpiar cualquier error anterior
  if (tipo === 'pizza') {
    modalPizza.value = true;
  } else if (tipo === 'producto') {
    modalProducto.value = true;
  }
};


const agregarPizza = () => {
  const exito = agregarAlCarrito();
  if (exito) {
    modalPizza.value = false;
  }
};

const agregarProducto = () => {
  const exito = agregarAlCarrito();
  if (exito) {
    modalProducto.value = false;
  }
};


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
  mensajeError.value = ''; // Limpiar errores previos

  if (!selectedPizza.value && !selectedProducto.value) {
    mensajeError.value = "Por favor selecciona al menos una pizza o un producto.";
    return false;
  }

  const totalActual = obtenerTotalUnidades();
  const nuevaCantidad = selectedPizza.value ? cantidad.value : cantidadProducto.value;

  if (totalActual + nuevaCantidad > 100) {
    mensajeError.value = "No puedes agregar más de 100 unidades al carrito en total.";
    return false;
  }

  if ((cantidad.value <= 0 || cantidad.value > 100) && selectedPizza.value) {
    mensajeError.value = "La cantidad de pizzas debe ser entre 1 y 100.";
    return false;
  }

  if ((cantidadProducto.value <= 0 || cantidadProducto.value > 100) && selectedProducto.value) {
    mensajeError.value = "La cantidad de productos debe ser entre 1 y 100.";
    return false;
  }

  // Lógica de agregar pizza
  if (selectedPizza.value && selectedTamano.value) {
    const pizza = pizzas.value.find(p => p.id_pizza === selectedPizza.value);
    const tamano = tamanos.value.find(t => t.id_tamano === selectedTamano.value);

    if (!pizza || !tamano) {
      mensajeError.value = "Pizza o tamaño inválido.";
      return false;
    }

    const precioFinal = parseFloat(pizza.precio_base) + parseFloat(tamano.precio_base);

    const existente = carrito.value.find(item =>
      item.tipo === 'pizza' &&
      item.id_pizza === selectedPizza.value &&
      item.id_tamano === selectedTamano.value
    );

    if (existente) {
      existente.cantidad += cantidad.value;
    } else {
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
  }

  // Lógica de agregar producto
  if (selectedProducto.value) {
    const producto = productos.value.find(p => p.id_producto === selectedProducto.value);

    if (!producto) {
      mensajeError.value = "Producto inválido.";
      return false;
    }

    const existente = carrito.value.find(item =>
      item.tipo === 'producto' &&
      item.id_producto === selectedProducto.value
    );

    if (existente) {
      existente.cantidadProducto += cantidadProducto.value;
    } else {
      carrito.value.push({
        tipo: 'producto',
        id_producto: selectedProducto.value,
        productoNombre: producto.nombre,
        cantidadProducto: cantidadProducto.value,
        precioUnitario: parseFloat(producto.precio),
        id_pizza: null,
        pizzaNombre: null,
        cantidad: 0,
        tamanoNombre: null,
        id_tamano: null,
      });
    }
  }
  limpiarCampos();
  return true;
};



const obtenerTotalUnidades = () => {
  return carrito.value.reduce((total, item) => {
    if (item.tipo === 'pizza') {
      return total + item.cantidad;
    } else if (item.tipo === 'producto') {
      return total + item.cantidadProducto;
    }
    return total;
  }, 0);
};

const limpiarCampos = () => {
  selectedPizza.value = '';
  selectedTamano.value = '';
  cantidad.value = 1;

  selectedProducto.value = '';
  cantidadProducto.value = 1;

  mensajeError.value = '';
};



// Finalizar pedido (enviar todo el carrito)
const finalizarPedido = () => {
  if (carrito.value.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }
  loading.value = true;  // Activar carga
  dialogVisible.value = true; // abre la ventana de confirmación
};


const confirmarPedido = async () => {
  const id_cliente = user.value?.identities?.[0]?.user_id;
  const total = calcularTotal(); // Calculas el total aquí

  try {
    const res = await fetch('/api/usuario/pedirPizza', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_cliente,
        pedido: carrito.value,
        fecha: new Date().toISOString(),
        total // <-- Aquí estás enviando el total también
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
  } finally {
    loading.value = false;  // Desactivar carga
    dialogVisible.value = false; // cerrar el modal
  }
};

// Calcular total
const calcularTotal = () => {
  return carrito.value.reduce((total, item) => {
    return total + (item.precioUnitario * (item.tipo === 'pizza' ? item.cantidad : item.cantidadProducto));
  }, 0);
};

//Eliminar del carrito
const eliminarDelCarrito = (index) => {
  carrito.value.splice(index, 1);
};

//Editar articulo del carrito
const editarItem = (item) => {
  if (item.tipo === 'pizza') {
    selectedPizza.value = item.id_pizza;
    selectedTamano.value = item.id_tamano;
    cantidad.value = item.cantidad;
  } else if (item.tipo === 'producto') {
    selectedProducto.value = item.id_producto;
    cantidadProducto.value = item.cantidadProducto;
  }
};


onMounted(async () => {
  await cargarPizzas();
  await cargarTamanos();
  await cargarProductos();
  loading.value = false;
});
</script>
