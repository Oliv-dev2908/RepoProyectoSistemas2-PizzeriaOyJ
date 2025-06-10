import { obtenerPedidos } from '~/server/repositories/admin/obtenerPedido.js';

// Servicio para obtener todos los pedidos (modo admin)
export const obtenerPedidosAdmin = async () => {
  const pedidos = await obtenerPedidos();
  return pedidos;
};
