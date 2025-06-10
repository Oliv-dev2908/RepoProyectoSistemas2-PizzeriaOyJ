import { usePostres } from '~/server/utils/postgres.js';

export const obtenerPedidos = async () => {
  const sql = usePostres();
  return await sql`
    SELECT 
  p.id_pedido,
  p.fecha,
  p.estado,
  p.total,
  u.email,
  u.raw_user_meta_data ->> 'full_name' AS nombre
FROM "Pedido" AS p
LEFT JOIN auth.users AS u ON p.id_cliente::uuid = u.id
ORDER BY p.fecha DESC;
  `;
};
