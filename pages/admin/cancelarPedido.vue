<template>
    <div class="container mx-auto p-6 bg-pizza-bg rounded-lg shadow-lg">
        <!-- Título -->
        <h1 class="text-4xl font-bold mb-6 text-pizza-red font-pizza-title drop-shadow-lg">
            Gestión de Pedidos
        </h1>

        <!-- Filtros -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <el-select v-model="filtroEstado" placeholder="Estado" clearable
                class="shadow-inner rounded-lg font-semibold text-pizza-brown" />
            <el-input v-model="filtroNombre" placeholder="Nombre del cliente" clearable
                class="shadow-inner rounded-lg font-semibold text-pizza-brown" />
            <el-input-number v-model="precioMin" :min="0" placeholder="Precio mínimo" class="w-full rounded-lg" />
            <el-input-number v-model="precioMax" :min="0" placeholder="Precio máximo" class="w-full rounded-lg" />
        </div>

        <!-- Buscador general -->
        <el-input v-model="busquedaGeneral" placeholder="Buscar por ID, cliente, comentario..." clearable
            class="mb-6 shadow-inner rounded-lg font-semibold text-pizza-brown" />

        <!-- Listado de pedidos -->
        <div v-if="pedidosFiltrados.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <el-card v-for="pedido in pedidosPaginados" :key="pedido.id_pedido" shadow="hover"
                class="pizza-card flex flex-col justify-between rounded-xl border-2 border-pizza-red bg-pizza-card p-5 hover:scale-[1.03] transition-transform duration-300">
                <div>
                    <p class="text-pizza-cream font-semibold">ID Pedido: <span class="text-pizza-orange">{{
                        pedido.id_pedido }}</span></p>
                    <p class="text-pizza-cream font-semibold">Cliente: <span class="text-pizza-orange">{{ pedido.nombre
                        || 'Desconocido' }}</span></p>
                    <p class="text-pizza-cream font-semibold">Fecha: <span class="text-pizza-orange">{{
                        formatearFecha(pedido.fecha) }}</span></p>
                    <p class="text-pizza-cream font-semibold">Estado: <span class="text-pizza-orange">{{ pedido.estado
                            }}</span></p>
                    <p class="text-pizza-cream font-semibold">Total: <span class="text-pizza-orange">${{ pedido.total
                            }}</span></p>
                    <p v-if="pedido.comentario" class="text-pizza-cream font-semibold">Comentario: <span
                            class="text-pizza-orange">{{ pedido.comentario }}</span></p>
                </div>

                <div class="flex flex-wrap justify-end items-center gap-2 mt-4 pt-4 border-t border-pizza-red">
                    <el-button v-if="pedido.estado === 'Pendiente'" type="success" size="small"
                        @click="abrirModalConfirmacion(pedido, 'aprobar')">
                        Aprobar
                    </el-button>

                    <el-button
                        v-if="pedido.estado !== 'Cancelado por el Cliente' && pedido.estado !== 'Cancelado por el Administrador' && pedido.estado !== 'Aprobado'"
                        type="danger" size="small" @click="abrirModalConfirmacion(pedido, 'cancelar')">
                        Cancelar
                    </el-button>

                    <el-button type="primary" size="small" @click="verDetallesPedido(pedido.id_pedido)">Ver Detalles
                    </el-button>
                </div>

            </el-card>
        </div>

        <!-- Sin resultados -->
        <div v-else class="col-span-full text-center text-pizza-red font-semibold text-lg mt-10">
            No hay pedidos que coincidan con el filtro 🔎
        </div>

        <!-- Paginación -->
        <div v-if="totalPaginas > 1" class="mt-8 flex justify-center">
            <el-pagination background layout="prev, pager, next" :current-page="paginaActual"
                :page-size="pedidosPorPagina" :total="pedidosFiltrados.length" @current-change="paginaActual = $event"
                class="pizza-pagination" />
        </div>
    </div>

    <!-- Modal de ver detalles-->
    <el-dialog title="Detalles del Pedido" v-model="isDetallesVisible" width="600px">
        <div v-if="pedidoSeleccionado">
            <h2>Pizzas</h2>
            <ul v-if="pedidoSeleccionado.pizzas.length > 0">
                <li v-for="pizza in pedidoSeleccionado.pizzas" :key="pizza.id_pizza">
                    {{ pizza.nombre }} - Tamaño: {{ pizza.id_tamano }} - Cantidad: {{ pizza.cantidad }}
                </li>
            </ul>
            <p v-else>No hay pizzas en este pedido.</p>

            <h2>Productos</h2>
            <ul v-if="pedidoSeleccionado.productos.length > 0">
                <li v-for="producto in pedidoSeleccionado.productos" :key="producto.id_producto">
                    {{ producto.nombre }} - Cantidad: {{ producto.cantidad }}
                </li>
            </ul>
            <p v-else>No hay productos en este pedido.</p>
        </div>

        <template #footer>
            <el-button @click="isDetallesVisible = false">Cerrar</el-button>
        </template>
    </el-dialog>

    <el-dialog v-model="isConfirmModalVisible"
        :title="accionModal === 'aprobar' ? 'Confirmar Aprobación' : 'Confirmar Cancelación'" width="400px">
        <div v-if="pedidoEnProceso">
            <p>
                ¿Estás seguro que deseas
                <strong>{{ accionModal === 'aprobar' ? 'aprobar' : 'cancelar' }}</strong>
                el pedido <strong>{{ pedidoEnProceso.id_pedido }}</strong>?
            </p>
        </div>

        <template #footer>
            <el-button @click="isConfirmModalVisible = false">Cancelar</el-button>
            <el-button type="primary" :class="accionModal === 'aprobar' ? 'bg-green-600' : 'bg-red-600'"
                @click="confirmarAccion">
                Confirmar
            </el-button>
        </template>
    </el-dialog>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabaseClient } from '#imports'

const pedidos = ref([])
const pedidosFiltrados = ref([])
// Filtros
const filtroEstado = ref(null)
const filtroNombre = ref('')
const precioMin = ref(null)
const precioMax = ref(null)
const busquedaGeneral = ref('')

const isDetallesVisible = ref(false)
const pedidoSeleccionado = ref(null)
const isConfirmModalVisible = ref(false)
const accionModal = ref(null) // 'aprobar' o 'cancelar'
const pedidoEnProceso = ref(null)

const paginaActual = ref(1)
const pedidosPorPagina = 9

const totalPaginas = computed(() => {
    return Math.ceil(pedidosFiltrados.value.length / pedidosPorPagina)
})

const pedidosPaginados = computed(() => {
    const inicio = (paginaActual.value - 1) * pedidosPorPagina
    return pedidosFiltrados.value.slice(inicio, inicio + pedidosPorPagina)
})


watch([filtroEstado, filtroNombre, precioMin, precioMax, busquedaGeneral], filtrarPedidos, { immediate: true })

function filtrarPedidos() {
    pedidosFiltrados.value = pedidos.value.filter(pedido => {
        const coincideEstado = !filtroEstado.value || pedido.estado === filtroEstado.value
        const coincideNombre = !filtroNombre.value || pedido.nombre?.toLowerCase().includes(filtroNombre.value.toLowerCase())
        const coincidePrecioMin = precioMin.value === null || pedido.total >= precioMin.value
        const coincidePrecioMax = precioMax.value === null || pedido.total <= precioMax.value
        const coincideBusqueda = !busquedaGeneral.value || [
            pedido.id_pedido,
            pedido.nombre,
            pedido.estado,
            pedido.comentario,
        ].some(campo =>
            campo?.toString().toLowerCase().includes(busquedaGeneral.value.toLowerCase())
        )

        return coincideEstado && coincideNombre && coincidePrecioMin && coincidePrecioMax && coincideBusqueda
    })

    paginaActual.value = 1
}

function abrirModalConfirmacion(pedido, accion) {
    pedidoEnProceso.value = pedido
    accionModal.value = accion
    isConfirmModalVisible.value = true
}

async function confirmarAccion() {
    if (!pedidoEnProceso.value || !accionModal.value) return

    if (accionModal.value === 'aprobar') {
        await aprobarPedido(pedidoEnProceso.value)
    } else if (accionModal.value === 'cancelar') {
        await cancelarPedidoAdmin(pedidoEnProceso.value)
    }

    isConfirmModalVisible.value = false
    pedidoEnProceso.value = null
    accionModal.value = null
}

// Cargar todos los pedidos
async function cargarPedidos() {
    try {
        const res = await $fetch('/api/admin/obtenerPedidos')
        if (res?.success) {
            pedidos.value = res.pedidos || []
            pedidosFiltrados.value = pedidos.value
        } else {
            console.error('Error al obtener pedidos', res)
        }
    } catch (error) {
        console.error('Error llamando a la API', error)
    }
}

// Cancelar un pedido sin comentario
async function cancelarPedidoAdmin(pedido) {
    try {
        const res = await $fetch('/api/admin/actualizarPedido', {
            method: 'PUT',
            body: {
                id_pedido: pedido.id_pedido,
                nuevo_estado: 'Cancelado por el Administrador'
            }
        })

        if (res?.success) {
            pedido.estado = 'Cancelado por el Administrador'
        } else {
            console.error('Error al cancelar pedido', res)
        }
    } catch (error) {
        console.error('Error al cancelar pedido', error)
    }
}

// Aprobar pedido
async function aprobarPedido(pedido) {
    try {
        const res = await $fetch('/api/admin/actualizarPedido', {
            method: 'PUT',
            body: {
                id_pedido: pedido.id_pedido,
                nuevo_estado: 'Aprobado'
            }
        })

        if (res?.success) {
            pedido.estado = 'Aprobado'
        } else {
            console.error('Error al aprobar pedido', res)
        }
    } catch (error) {
        console.error('Error al aprobar pedido', error)
    }
}

async function verDetallesPedido(idPedido) {
    try {
        const response = await $fetch(`/api/admin/pedidos/${idPedido}`);

        if (response?.success && response.pedido) {
            pedidoSeleccionado.value = response.pedido;
            isDetallesVisible.value = true;
        } else {
            const mensajeError = response?.error || 'Respuesta inválida del servidor.';
            console.error('No se pudo obtener el pedido:', mensajeError);
            ElMessage.error(mensajeError);
        }
    } catch (error) {
        console.error('Error al obtener los detalles del pedido:', error);
        ElMessage.error('Error del servidor al obtener los detalles del pedido.');
    }
}


function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString()
}



onMounted(() => {
    cargarPedidos()
})
</script>


