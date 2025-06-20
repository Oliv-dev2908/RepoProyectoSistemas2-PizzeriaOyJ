import { actualizarEstado} from '~/server/repositories/admin/actualizarPedido.js';

// Servicio para actualizar el estado de un pedido
export const actualizarEstadoPedidoAdmin = async (id_pedido, nuevo_estado) => {
  if (!id_pedido || !nuevo_estado) {
    throw new Error('Faltan parámetros obligatorios para actualizar el estado del pedido');
  }

  const pedidoActualizado = await actualizarEstado(id_pedido, nuevo_estado);
  return pedidoActualizado;
};
