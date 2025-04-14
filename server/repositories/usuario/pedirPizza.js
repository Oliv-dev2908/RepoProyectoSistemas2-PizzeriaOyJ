import { usePostres } from '../../utils/postgres.js';

export const crearPedido = async ({ id_cliente, total }) => {
  const sql = usePostres();
  const result = await sql`
    INSERT INTO "pedido" (id_cliente, estado, total)
    VALUES (${id_cliente}, 'Pendiente', ${total})
    RETURNING id_pedido
  `;
  return result[0];
};

export const agregarDetallePizza = async ({ id_pedido, id_pizza, id_tamano, cantidad, precio_unitario }) => {
  const sql = usePostres();
  await sql`
    INSERT INTO "PedidoPizza" (id_pedido, id_pizza, id_tamano, cantidad, precio_unitario)
    VALUES (${id_pedido}, ${id_pizza}, ${id_tamano}, ${cantidad}, ${precio_unitario})
  `;
};

export const getPedidosPorCliente = async (id_cliente) => {
  const sql = usePostres();
  return await sql`
    SELECT * FROM "pedido" WHERE id_cliente = ${id_cliente} ORDER BY fecha DESC
  `;
};
