import { usePostres } from '~/server/utils/postgres.js';

export const actualizarEstado = async (id_pedido, nuevo_estado) => {
  const sql = usePostres();
  const result = await sql`
    UPDATE "Pedido"
    SET estado = ${nuevo_estado}
    WHERE id_pedido = ${id_pedido}
  `;
  return result[0]; // Devuelve el pedido actualizado
};
