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
          // 1. Actualizar el estado del pedido
          const { error: updateError } = await supabase
            .from('pedidos')
            .update({ estado: 'Cancelado por el Cliente' })
            .eq('id_pedido', id_pedido);

          if (updateError) {
            event.res.statusCode = 500;
            return { error: 'Error al actualizar el estado del pedido', details: updateError.message };
          }

          // 2. Insertar el comentario en la base de datos
          const { data, error: insertError } = await supabase
            .from('comentarios')
            .insert([
              {
                id_cliente,
                id_pedido,
                texto: comentario,
                fecha: new Date().toISOString(),
              },
            ]);

          if (insertError) {
            event.res.statusCode = 500;
            return { error: 'Error al guardar el comentario', details: insertError.message };
          }

          return { success: true, message: 'Pedido cancelado y comentario guardado' };
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
