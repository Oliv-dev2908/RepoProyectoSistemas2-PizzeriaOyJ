import { recuperarPedidosDeCliente } from '~/server/services/usuario/obtenerDetallesService';
import { cancelarPedido } from '~/server/services/usuario/obtenerDetallesService';
import { readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  switch (method) {
    case 'POST': {
      try {
        const body = await readBody(event);
        const { id_cliente, id_pedido, comentario } = body;

        // Verificar si es una solicitud para obtener detalles de pedidos
        if (id_cliente && !id_pedido) {
          // Obtener pedidos si solo se pasa el id_cliente
          const pedidos = await recuperarPedidosDeCliente(id_cliente);
          return { success: true, pedidos };
        }

        // Verificar si es una solicitud para cancelar un pedido
        if (id_cliente && id_pedido && comentario) {
          const result = await cancelarPedido(id_pedido, id_cliente, comentario);
        
          if (result.success) {
            return { success: true, message: result.message };
          } else {
            event.res.statusCode = 500;
            return { error: 'Error al cancelar el pedido', details: result.error };
          }
        }
        

        // Si no hay parámetros suficientes
        event.res.statusCode = 400;
        return { error: 'Faltan parámetros necesarios' };

      } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        event.res.statusCode = 500;
        return { error: 'Error interno al procesar la solicitud', details: error.message };
      }
    }

    default:
      event.res.statusCode = 405;
      return { error: 'Método no permitido' };
  }
});
