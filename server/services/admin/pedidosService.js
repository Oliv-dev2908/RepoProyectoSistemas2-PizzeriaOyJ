import { obtenerPedidoPorId } from '~/server/repositories/admin/pedidos.js';

export const getPedidoPorId = async (idPedido) => {
  return await obtenerPedidoPorId(idPedido);
};
