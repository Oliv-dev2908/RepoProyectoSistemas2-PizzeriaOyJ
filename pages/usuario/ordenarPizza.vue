<template>
  <div class="container mx-auto p-4 sm:p-6 text-theme-text min-h-screen">
    <h1 class="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 font-pizza-title text-center sm:text-left">¿Qué quieres agregar?</h1>

    <!-- Cartas para elegir -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
      <div @click="abrirModal('pizza')"
        class="cursor-pointer bg-theme-card border-2 border-ctp-yellow p-6 sm:p-8 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all group">
        <h2 class="text-xl sm:text-2xl font-bold text-center text-ctp-yellow group-hover:drop-shadow-sm">🍕 Pizza</h2>
        <p class="text-center text-theme-secondary text-sm mt-2">Arma tu pizza ideal</p>
      </div>

      <div @click="abrirModal('producto')"
        class="cursor-pointer bg-theme-card border-2 border-ctp-green p-6 sm:p-8 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all group">
        <h2 class="text-xl sm:text-2xl font-bold text-center text-ctp-green group-hover:drop-shadow-sm">🛒 Complementos</h2>
        <p class="text-center text-theme-secondary text-sm mt-2">Bebidas y snacks</p>
      </div>
    </div>

    <!-- Carrito -->
    <div v-if="carrito.length > 0" class="mt-10 sm:mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl sm:text-2xl font-bold border-l-4 border-ctp-mauve pl-3">Tu Pedido</h2>
        <span class="text-xs font-bold bg-ctp-mauve/10 text-ctp-mauve px-2 py-1 rounded">{{ carrito.length }} items</span>
      </div>
      
      <ul class="space-y-3">
        <li v-for="(item, index) in carrito" :key="index" 
          class="border border-theme p-3 sm:p-4 rounded-xl flex justify-between items-center bg-theme-card shadow-sm">
          <div class="flex-1">
            <div v-if="item.tipo === 'pizza'" class="text-sm sm:text-base">
              <span class="text-lg mr-1">🍕</span> 
              <span class="font-bold">{{ item.pizzaNombre }}</span> 
              <span class="text-xs sm:text-sm text-theme-secondary ml-1">({{ item.tamanoNombre }})</span>
              <div class="mt-1 flex items-center gap-2">
                <span class="text-xs bg-theme-surface px-2 py-0.5 rounded border border-theme">x{{ item.cantidad }}</span>
                <span class="text-ctp-peach font-bold">${{ (item.precioUnitario * item.cantidad).toFixed(2) }}</span>
              </div>
            </div>
            <div v-else-if="item.tipo === 'producto'" class="text-sm sm:text-base">
              <span class="text-lg mr-1">🛒</span> 
              <span class="font-bold">{{ item.productoNombre }}</span>
              <div class="mt-1 flex items-center gap-2">
                <span class="text-xs bg-theme-surface px-2 py-0.5 rounded border border-theme">x{{ item.cantidadProducto }}</span>
                <span class="text-ctp-peach font-bold">${{ (item.precioUnitario * item.cantidadProducto).toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <button @click="eliminarDelCarrito(index)" 
            class="ml-2 p-2 text-ctp-red hover:bg-ctp-red/10 rounded-full transition-colors"
            title="Eliminar">
            <el-icon class="text-xl"><ElementPlusIcons.Delete /></el-icon>
          </button>
        </li>
      </ul>

      <div class="mt-6 p-4 bg-theme-surface rounded-xl border border-theme flex justify-between items-center">
        <span class="font-bold text-theme-secondary">Total Estimado</span>
        <span class="text-2xl font-bold text-ctp-peach">${{ calcularTotal().toFixed(2) }}</span>
      </div>

      <div class="mt-6">
        <el-button type="primary" size="large" @click="finalizarPedido" class="pulse-button w-full h-12 text-lg">
          Confirmar y Finalizar
        </el-button>
      </div>
    </div>

    <!-- Modales Responsivos con el-select -->
    <el-dialog v-model="modalPizza" title="🍕 Agregar Pizza" width="90%" class="max-w-[500px]">
      <div class="space-y-5">
        <div>
          <label class="block text-xs font-bold text-theme-secondary uppercase mb-2 ml-1">Selecciona Variedad</label>
          <el-select v-model="selectedPizza" placeholder="Elige una pizza" class="w-full" size="large">
            <el-option 
              v-for="pizza in pizzas" 
              :key="pizza.id_pizza" 
              :label="pizza.nombre + (obtenerTextoOfertaParaPizza(pizza.id_pizza) ? ` (${obtenerTextoOfertaParaPizza(pizza.id_pizza)})` : '')"
              :value="pizza.id_pizza" 
            />
          </el-select>
        </div>

        <div>
          <label class="block text-xs font-bold text-theme-secondary uppercase mb-2 ml-1">Tamaño</label>
          <el-select v-model="selectedTamano" placeholder="Elige el tamaño" class="w-full" size="large">
            <el-option v-for="tam in tamanos" :key="tam.id_tamano" :label="tam.nombre" :value="tam.id_tamano" />
          </el-select>
        </div>

        <div>
          <label class="block text-xs font-bold text-theme-secondary uppercase mb-2 ml-1">Cantidad</label>
          <el-input-number v-model="cantidad" :min="1" :max="100" class="!w-full" size="large" />
        </div>

        <div v-if="mensajeError" class="p-3 bg-ctp-red/10 text-ctp-red text-xs font-bold rounded-lg border border-ctp-red/20">
          ⚠️ {{ mensajeError }}
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3">
          <el-button @click="modalPizza = false" class="flex-1">Cancelar</el-button>
          <el-button type="primary" @click="agregarPizza" class="flex-1">Agregar</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Modal de Producto con el-select -->
    <el-dialog v-model="modalProducto" title="🛒 Agregar Complemento" width="90%" class="max-w-[500px]">
      <div class="space-y-5">
        <div>
          <label class="block text-xs font-bold text-theme-secondary uppercase mb-2 ml-1">Producto</label>
          <el-select v-model="selectedProducto" placeholder="Selecciona un producto" class="w-full" size="large">
            <el-option 
              v-for="producto in productos" 
              :key="producto.id_producto" 
              :label="`${producto.nombre} - $${parseFloat(producto.precio).toFixed(2)}`" 
              :value="producto.id_producto" 
            />
          </el-select>
        </div>

        <div>
          <label class="block text-xs font-bold text-theme-secondary uppercase mb-2 ml-1">Cantidad</label>
          <el-input-number v-model="cantidadProducto" :min="1" :max="100" class="!w-full" size="large" />
        </div>

        <div v-if="mensajeError" class="p-3 bg-ctp-red/10 text-ctp-red text-xs font-bold rounded-lg border border-ctp-red/20">
          ⚠️ {{ mensajeError }}
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3">
          <el-button @click="modalProducto = false" class="flex-1">Cancelar</el-button>
          <el-button type="primary" @click="agregarProducto" class="flex-1">Agregar</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Modal de Confirmación Final -->
    <el-dialog v-model="dialogVisible" title="Confirmar Pedido" width="90%" class="max-w-[600px]">
      <div class="text-theme-text max-h-[60vh] overflow-y-auto pr-2">
        <h3 class="font-bold mb-4 text-theme-secondary uppercase text-xs tracking-widest">Resumen de tu pedido</h3>
        <ul class="divide-y divide-theme">
          <li v-for="(item, index) in carrito" :key="index" class="py-3">
            <div class="flex justify-between items-center">
              <span class="text-sm font-semibold">
                {{ item.tipo === 'pizza' ? `🍕 ${item.pizzaNombre}` : `🛒 ${item.productoNombre}` }}
                <span class="text-xs opacity-70 block sm:inline"> (x{{ item.tipo === 'pizza' ? item.cantidad : item.cantidadProducto }})</span>
              </span>
              <span class="text-ctp-peach font-bold">${{ (item.precioUnitario * (item.tipo === 'pizza' ? item.cantidad : item.cantidadProducto)).toFixed(2) }}</span>
            </div>
          </li>
        </ul>

        <div class="mt-6 pt-4 border-t-2 border-theme text-right">
          <p class="text-sm text-theme-secondary">Total a Pagar</p>
          <p class="text-2xl font-bold text-ctp-peach">${{ calcularTotal().toFixed(2) }}</p>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3 justify-end">
          <el-button @click="dialogVisible = false" class="flex-1 sm:flex-none">Volver</el-button>
          <el-button type="primary" @click="confirmarPedido" class="flex-1 sm:flex-none">Confirmar</el-button>
        </div>
      </template>
    </el-dialog>

    <div v-if="mensaje" class="mt-4 p-3 bg-ctp-surface0 border border-ctp-blue text-ctp-blue rounded-xl font-bold text-center">
      {{ mensaje }}
    </div>

    <div v-if="loading" class="flex justify-center items-center mt-4">
      <el-loading :loading="loading" text="Cargando..." spinner-size="50"></el-loading>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSupabaseUser } from '#imports'
import { ElDialog, ElButton, ElLoading, ElSelect, ElOption, ElInputNumber } from 'element-plus';
import * as ElementPlusIcons from '@element-plus/icons-vue';

const user = useSupabaseUser();
const dialogVisible = ref(false);

const pizzas = ref([]);
const tamanos = ref([]);
const productos = ref([]);
const carrito = ref([]);
const ofertas = ref([]);

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
  mensajeError.value = '';
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

const cargarOfertas = async () => {
  try {
    const res = await fetch('/api/ofertas');
    if (!res.ok) throw new Error('No se pudieron cargar las ofertas');
    const data = await res.json();
    ofertas.value = data;
  } catch {
    ofertas.value = [];
  }
};

const obtenerTextoOfertaParaPizza = (id_pizza) => {
  const ahora = new Date();
  const ofertasParaPizza = ofertas.value.filter(oferta => {
    if (!oferta.activo) return false;
    const inicio = new Date(oferta.fecha_inicio);
    const fin = new Date(oferta.fecha_fin);
    if (ahora < inicio || ahora > fin) return false;
    return oferta.pizzas.includes(id_pizza);
  });
  if (ofertasParaPizza.length === 0) return '';

  const oferta = ofertasParaPizza[0];

  if (oferta.tipo === 'descuento') {
    const porcentaje = (oferta.descuento ?? 0) * 100;
    return `${porcentaje}% OFF`;
  } else if (oferta.tipo === 'n_x_m') {
    return `${oferta.n_cantidad}x${oferta.m_paga}`;
  }
  return '';
};

const agregarAlCarrito = () => {
  mensajeError.value = '';

  if (!selectedPizza.value && !selectedProducto.value) {
    mensajeError.value = "Por favor selecciona al menos una pizza o un producto.";
    return false;
  }

  const totalActual = obtenerTotalUnidades();
  const nuevaCantidad = selectedPizza.value ? cantidad.value : cantidadProducto.value;

  if (totalActual + nuevaCantidad > 100) {
    mensajeError.value = "No puedes agregar más de 100 unidades al carrito.";
    return false;
  }

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

const finalizarPedido = () => {
  if (carrito.value.length === 0) return;
  dialogVisible.value = true;
};

const confirmarPedido = async () => {
  const id_cliente = user.value?.id;
  const total = calcularTotal();

  loading.value = true;
  try {
    const res = await fetch('/api/usuario/pedirPizza', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_cliente,
        pedido: carrito.value,
        fecha: new Date().toISOString(),
        total
      }),
    });

    const resultado = await res.json();

    if (res.ok) {
      mensaje.value = '¡Pedido realizado con éxito! 🍕';
      carrito.value = [];
      dialogVisible.value = false;
    } else {
      mensaje.value = resultado.message || 'Error al realizar el pedido.';
    }
  } catch (error) {
    console.error(error);
    mensaje.value = 'Error al realizar el pedido.';
  } finally {
    loading.value = false;
  }
};

const calcularTotal = () => {
  let total = 0;
  carrito.value.forEach(item => {
    if (item.tipo === 'pizza') {
      total += item.precioUnitario * item.cantidad;
    } else {
      total += item.precioUnitario * item.cantidadProducto;
    }
  });
  return total;
};

const eliminarDelCarrito = (index) => {
  carrito.value.splice(index, 1);
};

onMounted(async () => {
  await cargarPizzas();
  await cargarTamanos();
  await cargarProductos();
  await cargarOfertas();
  loading.value = false;
});
</script>
