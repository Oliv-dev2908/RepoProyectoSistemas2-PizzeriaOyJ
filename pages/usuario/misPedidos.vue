<template>
  <div class="container mx-auto p-4 sm:p-6 text-theme-text min-h-screen">
    <el-card class="shadow-xl border-theme !bg-theme-card">
        <!-- Título -->
        <h1 class="text-2xl sm:text-3xl font-bold mb-6 font-pizza-title">Mis Pedidos</h1>

        <!-- Filtro por estado -->
        <div class="mb-6 flex flex-wrap items-center gap-3">
            <span class="text-sm font-bold text-theme-secondary uppercase">Filtrar:</span>
            <el-select v-model="filtroEstado" placeholder="Estado del pedido" clearable @change="filtrarPedidos" class="w-full sm:w-64">
                <el-option label="Aprobado" value="Aprobado" />
                <el-option label="Pendiente" value="Pendiente" />
                <el-option label="Cancelado por el Cliente" value="Cancelado por el Cliente" />
                <el-option label="Cancelado por el Administrador" value="Cancelado por el Administrador" />
            </el-select>
        </div>

        <!-- Listado de pedidos -->
        <div v-if="pedidosFiltrados.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <el-card v-for="pedido in pedidosFiltrados" :key="pedido.id_pedido"
                class="!rounded-2xl !p-0 shadow-md hover:shadow-lg transition-shadow border-theme bg-theme-surface">
                <div class="p-4 sm:p-5 flex flex-col h-full">
                    <div class="flex justify-between items-start mb-4">
                      <div>
                        <p class="text-xs font-bold text-theme-secondary uppercase">Pedido #{{ pedido.id_pedido }}</p>
                        <p class="text-sm font-semibold">{{ formatearFecha(pedido.fecha) }}</p>
                      </div>
                      <el-tag :type="statusType(pedido.estado)" effect="dark" size="small" class="capitalize">
                        {{ pedido.estado }}
                      </el-tag>
                    </div>

                    <div class="flex-grow space-y-1 mb-6">
                        <p class="text-xl font-bold text-ctp-peach">${{ parseFloat(pedido.total).toFixed(2) }}</p>
                    </div>

                    <div class="flex flex-col gap-2 mt-auto">
                        <el-button 
                            v-if="canCancel(pedido.estado)"
                            type="danger"
                            plain
                            size="default"
                            class="w-full"
                            @click="cancelarPedido(pedido)">
                            Cancelar Pedido
                        </el-button>

                        <el-button type="primary" size="default" class="w-full"
                            @click="verDetallesPedido(pedido.id_pedido)">
                            Ver Detalles
                        </el-button>
                    </div>
                </div>
            </el-card>
        </div>

        <div v-else class="text-center py-12">
            <el-empty description="No tienes pedidos con este filtro" />
        </div>
    </el-card>

    <!-- Modal para agregar comentario -->
    <el-dialog title="💬 Cancelar Pedido" v-model="isModalVisible" width="90%" class="max-w-[500px]" @close="clearComentario">
        <div class="mb-4">
          <p class="text-sm text-theme-secondary mb-3">Por favor, cuéntanos el motivo de la cancelación:</p>
          <el-input v-model="comentario" type="textarea" rows="4" placeholder="Escribe tu motivo aquí..." resize="none"></el-input>
        </div>

        <template #footer>
          <div class="flex gap-3">
            <el-button @click="isModalVisible = false" class="flex-1">Volver</el-button>
            <el-button type="danger" @click="guardarComentario" :disabled="!comentario" class="flex-1">Confirmar Cancelación</el-button>
          </div>
        </template>
    </el-dialog>

    <!-- Modal de ver detalles-->
    <el-dialog title="📋 Detalles del Pedido" v-model="isDetallesVisible" width="90%" class="max-w-[600px]">
        <div v-if="pedidoSeleccionado" class="space-y-6">
            <!-- Sección de Pizzas -->
            <div>
              <h2 class="text-lg font-bold mb-3 flex items-center gap-2 border-b border-theme pb-2">
                <span class="text-xl">🍕</span> Pizzas
              </h2>
              <ul v-if="pedidoSeleccionado.pizzas.length > 0" class="space-y-2">
                  <li v-for="pizza in pedidoSeleccionado.pizzas" :key="pizza.id_pizza" class="flex justify-between items-center text-sm p-2 bg-theme-surface rounded-lg">
                      <span><span class="font-bold">{{ pizza.nombre }}</span> ({{ pizza.tamaño }})</span>
                      <span class="font-bold bg-ctp-mauve/10 text-ctp-mauve px-2 py-0.5 rounded">x{{ pizza.cantidad }}</span>
                  </li>
              </ul>
              <p v-else class="text-theme-secondary italic text-sm">No hay pizzas en este pedido.</p>
            </div>

            <!-- Sección de Productos -->
            <div>
              <h2 class="text-lg font-bold mb-3 flex items-center gap-2 border-b border-theme pb-2">
                <span class="text-xl">🛒</span> Complementos
              </h2>
              <ul v-if="pedidoSeleccionado.productos.length > 0" class="space-y-2">
                  <li v-for="producto in pedidoSeleccionado.productos" :key="producto.id_producto" class="flex justify-between items-center text-sm p-2 bg-theme-surface rounded-lg">
                      <span class="font-bold">{{ producto.nombre }}</span>
                      <span class="font-bold bg-ctp-green/10 text-ctp-green px-2 py-0.5 rounded">x{{ producto.cantidad }}</span>
                  </li>
              </ul>
              <p v-else class="text-theme-secondary italic text-sm">No hay productos en este pedido.</p>
            </div>
        </div>

        <template #footer>
            <el-button @click="isDetallesVisible = false" class="w-full sm:w-auto">Cerrar</el-button>
        </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

// Lista de pedidos
const pedidos = ref([])

// Variables para el modal
const isModalVisible = ref(false)
const comentario = ref('')
const isDetallesVisible = ref(false)
const pedidoSeleccionado = ref(null)
let idPedidoSeleccionado = null // Variable para almacenar el id del pedido seleccionado

const filtroEstado = ref(null)
const pedidosFiltrados = ref([])

const statusType = (status) => {
  if (status === 'Aprobado') return 'success';
  if (status === 'Pendiente') return 'warning';
  if (status.includes('Cancelado')) return 'danger';
  return 'info';
};

const canCancel = (status) => {
  return !status.includes('Cancelado') && status !== 'Aprobado';
};

// Traer los pedidos del usuario
async function cargarPedidos() {
    const id_cliente = user.value?.id;

    try {
        const res = await $fetch('/api/usuario/obtenerDetalles', {
            method: 'POST',
            body: { id_cliente },
        })

        if (res?.success) {
            pedidos.value = res.pedidos || []
            pedidosFiltrados.value = pedidos.value
        } else {
            console.error('Error al traer pedidos', res)
        }
    } catch (error) {
        console.error('Error llamando a la API', error)
    }
}

// Función para cancelar un pedido
function cancelarPedido(pedido) {
    idPedidoSeleccionado = pedido.id_pedido
    isModalVisible.value = true
    comentario.value = ''
}

// Función para guardar el comentario y actualizar el estado
async function guardarComentario() {
    const id_cliente = user.value?.id
    const id_pedido = idPedidoSeleccionado

    if (!id_cliente || !id_pedido || !comentario.value) {
        return
    }

    try {
        const res = await $fetch('/api/usuario/obtenerDetalles', {
            method: 'POST',
            body: {
                id_cliente,
                id_pedido,
                comentario: comentario.value,
            },
        })

        if (res.success) {
            const pedido = pedidos.value.find(p => p.id_pedido === id_pedido)
            if (pedido) pedido.estado = 'Cancelado por el Cliente'
            isModalVisible.value = false
        }
    } catch (error) {
        console.error('Error al cancelar', error)
    }
}

function clearComentario() {
    comentario.value = ''
}

function verDetallesPedido(idPedido) {
    const pedido = pedidos.value.find(p => p.id_pedido === idPedido)
    if (pedido) {
        pedidoSeleccionado.value = pedido
        isDetallesVisible.value = true
    }
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
}

function filtrarPedidos() {
    if (!filtroEstado.value) {
        pedidosFiltrados.value = pedidos.value
    } else {
        pedidosFiltrados.value = pedidos.value.filter(p => p.estado === filtroEstado.value)
    }
}

onMounted(() => {
    cargarPedidos()
})
</script>
