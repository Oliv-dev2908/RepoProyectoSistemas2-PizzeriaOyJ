import { actualizarEstadoPedidoAdmin } from '~/server/services/admin/actualizarPedidoService';
import { readBody } from 'h3';

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'PUT') {
    event.res.statusCode = 405;
    return { error: 'Método no permitido' };
  }

  try {
    const body = await readBody(event);
    const { id_pedido, nuevo_estado } = body;

    if (!id_pedido || !nuevo_estado) {
      event.res.statusCode = 400;
      return { error: 'Faltan datos para actualizar el pedido' };
    }

    const result = await actualizarEstadoPedidoAdmin(id_pedido, nuevo_estado);

    return {
      success: true,
      message: 'Estado del pedido actualizado correctamente',
      result,
    };
  } catch (error) {
    console.error(error);
    event.res.statusCode = 500;
    return {
      error: 'Error al actualizar el pedido',
      details: error.message,
    };
  }
});
