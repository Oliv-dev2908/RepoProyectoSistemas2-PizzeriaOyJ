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


export const cancelarPedidoConComentario = async (id_pedido, supabase_uuid, comentario) => {
  const sql = usePostres();

  try {
    const result = await sql`
      SELECT public.get_client_by_user(${supabase_uuid}) AS id_cliente
    `;
    const id_cliente = result[0]?.id_cliente;

    if (!id_cliente) {
      return { success: false, error: 'No se encontró un cliente con ese UUID' };
    }

    await sql`
      UPDATE "Pedido"
      SET estado = 'Cancelado por el Cliente'
      WHERE id_pedido = ${id_pedido}
    `;

    await sql`
      INSERT INTO "Comentario" (id_cliente, id_pedido, texto)
      VALUES (${id_cliente}, ${id_pedido}, ${comentario})
    `;

    return { success: true };
  } catch (error) {
    console.error('Error en cancelarPedidoConComentario:', error);
    return { success: false, error: 'Error al cancelar y comentar el pedido' };
  }
};

