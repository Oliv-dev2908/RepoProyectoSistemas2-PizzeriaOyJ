import { usePostres } from '../../utils/postgres.js';

// Obtener todos los pedidos de un cliente
export const getPedidosPorCliente = async (id_cliente) => {
    const sql = usePostres();
    return await sql`
    SELECT id_pedido, fecha, estado, total
    FROM "Pedido"
    WHERE id_cliente = ${id_cliente}
    ORDER BY fecha DESC
  `;
};

// Obtener los detalles de pizzas de un pedido
export const getDetallesPizzasPorPedidos = async (pedidosIds) => {
    const sql = usePostres();
    return await sql`
      SELECT 
        pp.id_pedido,
        pp.id_pizza, 
        pp.id_tamano, 
        pp.cantidad, 
        pp.precio_unitario,
        p.nombre, 
        p.descripcion, 
        p.precio_base
      FROM "PedidoPizza" pp
      INNER JOIN "Pizza" p ON pp.id_pizza = p.id_pizza
      WHERE pp.id_pedido IN ${sql(pedidosIds)}
    `;
};

// Obtener los detalles de productos de un pedido
export const getDetallesProductosPorPedidos = async (pedidosIds) => {
    const sql = usePostres();
    return await sql`
      SELECT 
        pp.id_pedido,
        pp.id_producto, 
        pp.cantidad, 
        pp.precio_unitario,
        p.nombre, 
        p.descripcion, 
        p.precio
      FROM "PedidoProducto" pp
      INNER JOIN "Producto" p ON pp.id_producto = p.id_producto
      WHERE pp.id_pedido IN ${sql(pedidosIds)}
    `;
};


// Función para cancelar un pedido y agregar un comentario
export const cancelarPedidoConComentario = async (id_pedido, comentario) => {
    const sql = usePostres();

    try {
        // Iniciar la transacción
        await sql.begin();

        // Actualizar el estado del pedido
        await sql`
        UPDATE "Pedido"
        SET estado = 'Cancelado por el Cliente'
        WHERE id_pedido = ${id_pedido}
      `;

        // Insertar el comentario en la tabla de comentarios del pedido
        await sql`
        INSERT INTO "ComentarioPedido" (id_pedido, comentario)
        VALUES (${id_pedido}, ${comentario})
      `;

        // Confirmar la transacción
        await sql.commit();

        return { success: true };
    } catch (error) {
        // Si hay algún error, revertir la transacción
        await sql.rollback();
        console.error('Error al cancelar el pedido o guardar el comentario:', error);
        return { success: false, error: error.message };
    }
};