<template>
    <el-card style="width: 80vh" class="p-6">
        <!-- Título -->
        <h1 class="text-2xl font-bold mb-6">Mis Pedidos</h1>

        <!-- Listado de pedidos -->
        <div v-if="pedidos.length > 0" class="space-y-4">
            <div v-for="pedido in pedidos" :key="pedido.id_pedido"
                class="border rounded-lg p-4 shadow-sm flex flex-col gap-2 bg-gray-50">
                <div class="flex justify-between">
                    <div>
                        <p><strong>ID Pedido:</strong> {{ pedido.id_pedido }}</p>
                        <p><strong>Fecha:</strong> {{ formatearFecha(pedido.fecha) }}</p>
                        <p><strong>Estado:</strong> {{ pedido.estado }}</p>
                        <p><strong>Total:</strong> ${{ pedido.total }}</p>
                    </div>

                    <div class="flex flex-col gap-2">
                        <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow"
                            @click="cancelarPedido(pedido)">
                            Cancelar Pedido
                        </button>

                        <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow"
                            @click="verDetallesPedido(pedido.id_pedido)">
                            Ver Detalles
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- No hay pedidos -->
        <div v-else class="text-gray-500">
            No tienes pedidos aún.
        </div>
    </el-card>

    <!-- Modal para agregar comentario -->
    <el-dialog title="Agregar Comentario" v-model="isModalVisible" @close="clearComentario">
        <el-input v-model="comentario" type="textarea" rows="4" placeholder="Escribe tu comentario..."></el-input>

        <template #footer>
            <el-button @click="isModalVisible = false">Cancelar</el-button>
            <el-button type="primary" @click="guardarComentario">Guardar</el-button>
        </template>
    </el-dialog>
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
let idPedidoSeleccionado = null // Variable para almacenar el id del pedido seleccionado

// Traer los pedidos del usuario
async function cargarPedidos() {
    const id_cliente = user.value?.id;

    try {
        const res = await $fetch('/api/usuario/obtenerDetalles', {
            method: 'POST',
            body: { id_cliente },
        })

        if (res.error) {
            console.error('Error cargando pedidos:', res.error)
        } else if (res?.success) {
            pedidos.value = res.pedidos || []
        } else {
            console.error('Error inesperado al traer pedidos', res)
        }
    } catch (error) {
        console.error('Error llamando a la API', error)
    }
}

// Función para cancelar un pedido
function cancelarPedido(pedido) {
    // Guardar el id del pedido seleccionado
    idPedidoSeleccionado = pedido.id_pedido
    // Abrir el modal para agregar un comentario
    isModalVisible.value = true

    // Limpiar el comentario
    comentario.value = ''
}

// Función para guardar el comentario y actualizar el estado
async function guardarComentario() {
    const id_cliente = user.value?.id
    const id_pedido = idPedidoSeleccionado

    if (!id_cliente || !id_pedido || !comentario.value) {
        console.error('Faltan datos para guardar el comentario')
        return
    }

    try {
        // Llamar a la API para actualizar el estado y registrar el comentario
        const res = await $fetch('/api/usuario/obtenerDetalles', {
            method: 'POST',
            body: {
                id_cliente,
                id_pedido,
                comentario: comentario.value,
            },
        })

        if (res.success) {
            // Actualizar el estado del pedido localmente
            const pedido = pedidos.value.find(p => p.id_pedido === id_pedido)
            if (pedido) pedido.estado = 'Cancelado por el Cliente'

            // Cerrar el modal
            isModalVisible.value = false
        } else {
            console.error('Error al cancelar el pedido y guardar el comentario', res)
        }
    } catch (error) {
        console.error('Error llamando a la API para cancelar el pedido', error)
    }
}

// Limpiar el comentario cuando el modal se cierra
function clearComentario() {
    comentario.value = ''
}

// Función para ver detalles (sin lógica todavía)
function verDetallesPedido(idPedido) {
    console.log('Ver detalles del pedido', idPedido)
    // Aquí podrías hacer router.push a /misPedidos/[id]
}

// Formatear fecha
function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString()
}

onMounted(() => {
    cargarPedidos()
})
</script>

<style scoped>
/* Puedes poner estilos extra aquí si quieres */
</style>