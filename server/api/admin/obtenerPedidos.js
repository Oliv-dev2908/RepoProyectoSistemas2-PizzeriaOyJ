import { obtenerPedidosAdmin } from '~/server/services/admin/obtenerPedidoService';

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'GET') {
    event.res.statusCode = 405;
    return { error: 'Método no permitido' };
  }

  try {
    const pedidos = await obtenerPedidosAdmin();

    return {
      success: true,
      pedidos,
    };
  } catch (error) {
    console.error(error);
    event.res.statusCode = 500;
    return {
      error: 'Error al recuperar los pedidos',
      details: error.message,
    };
  }
});
