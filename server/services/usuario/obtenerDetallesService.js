import {
    getPedidosPorCliente,
    getDetallesPizzasPorPedidos,
    getDetallesProductosPorPedidos,
    cancelarPedidoConComentario
} from '~/server/repositories/usuario/obtenerDetalles';

/**
 * Recupera todos los pedidos de un cliente junto con sus detalles de pizzas y productos.
 */
export const recuperarPedidosDeCliente = async (id_cliente) => {
    // 1. Traer todos los pedidos
    const pedidos = await getPedidosPorCliente(id_cliente);

    if (pedidos.length === 0) {
        return [];
    }

    // 2. Obtener IDs de todos los pedidos
    const pedidosIds = pedidos.map(p => p.id_pedido);

    // 3. Traer detalles de todos los pedidos de golpe
    const [detallesPizzas, detallesProductos] = await Promise.all([
        getDetallesPizzasPorPedidos(pedidosIds),
        getDetallesProductosPorPedidos(pedidosIds)
    ]);

    // 4. Agrupar detalles por id_pedido
    const pizzasPorPedido = groupBy(detallesPizzas, 'id_pedido');
    const productosPorPedido = groupBy(detallesProductos, 'id_pedido');

    // 5. Armar pedidos finales
    const pedidosConDetalles = pedidos.map(pedido => ({
        ...pedido,
        pizzas: pizzasPorPedido[pedido.id_pedido] || [],
        productos: productosPorPedido[pedido.id_pedido] || []
    }));

    return pedidosConDetalles;
};

/**
* Función para cancelar un pedido y agregar un comentario.
*/
export const cancelarPedido = async (id_pedido, comentario) => {
    try {
        // Llamar al repositorio para cancelar el pedido y guardar el comentario
        const result = await cancelarPedidoConComentario(id_pedido, comentario);

        if (result.success) {
            return { success: true, message: 'Pedido cancelado con éxito' };
        } else {
            return { success: false, error: result.error };
        }
    } catch (error) {
        console.error('Error al cancelar el pedido:', error);
        return { success: false, error: 'Error al cancelar el pedido' };
    }
};

// Helper para agrupar resultados
function groupBy(list, key) {
    return list.reduce((acc, item) => {
        const group = item[key];
        if (!acc[group]) acc[group] = [];
        acc[group].push(item);
        return acc;
    }, {});
}
