import { usePostres } from '~/server/utils/postgres';

// Obtener pedido básico
export const obtenerPedidoPorId = async (idPedido) => {
  const sql = usePostres();
  const pedido = await sql`
    SELECT * FROM "Pedido"
    WHERE id_pedido = ${idPedido}
  `;

  if (!pedido.length) return null;

  // Obtener pizzas del pedido
  const pizzas = await sql`
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
    WHERE pp.id_pedido = ${idPedido}
  `;

  // Obtener productos del pedido
  const productos = await sql`
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
    WHERE pp.id_pedido = ${idPedido}
  `;

  return {
    ...pedido[0],
    pizzas,
    productos
  };
};
