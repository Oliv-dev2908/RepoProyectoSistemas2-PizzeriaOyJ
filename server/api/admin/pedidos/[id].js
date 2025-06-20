import { getPedidoPorId } from '~/server/services/admin/pedidosService';

export default defineEventHandler(async (event) => {
  const idPedido = event.context.params.id;

  if (!idPedido) {
    event.res.statusCode = 400;
    return { error: 'ID de pedido no proporcionado' };
  }

  try {
    const pedido = await getPedidoPorId(idPedido);
    if (!pedido) {
      event.res.statusCode = 404;
      return { error: 'Pedido no encontrado' };
    }

    return { success: true, pedido };
  } catch (error) {
    event.res.statusCode = 500;
    return { error: 'Error al obtener el pedido', details: error.message };
  }
});

