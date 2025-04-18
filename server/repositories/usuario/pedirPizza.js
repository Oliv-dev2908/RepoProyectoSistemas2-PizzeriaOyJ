import { usePostres } from '../../utils/postgres.js';

// Función para crear un nuevo pedido
export const crearPedido = async ({ id_cliente, total }) => {
  const sql = usePostres();
  const result = await sql`
    INSERT INTO "Pedido" (id_cliente, estado, total)
    VALUES (${id_cliente}, 'Pendiente', ${total})
    RETURNING id_pedido
  `;
  return result[0];  // Retorna el id del pedido recién creado
};

// Función para agregar detalles de una pizza al pedido
export const agregarDetallePizza = async ({ id_pedido, id_pizza, id_tamano, cantidad, precio_unitario }) => {
  const sql = usePostres();
  await sql`
    INSERT INTO "PedidoPizza" (id_pedido, id_pizza, id_tamano, cantidad, precio_unitario)
    VALUES (${id_pedido}, ${id_pizza}, ${id_tamano}, ${cantidad}, ${precio_unitario})
  `;
};

// Función para obtener los pedidos de un cliente
export const getPedidosPorCliente = async (id_cliente) => {
  const sql = usePostres();
  return await sql`
    SELECT * FROM "pedido" WHERE id_cliente = ${id_cliente} ORDER BY fecha DESC
  `;
};

// Función para agregar detalles de un producto adicional al pedido
export const agregarDetalleProducto = async ({ id_pedido, id_producto, cantidad, precio_unitario }) => {
  const sql = usePostres();
  await sql`
    INSERT INTO "PedidoProducto" (id_pedido, id_producto, cantidad, precio_unitario)
    VALUES (${id_pedido}, ${id_producto}, ${cantidad}, ${precio_unitario})
  `;
};
