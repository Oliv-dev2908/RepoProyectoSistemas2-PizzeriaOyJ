import { crearPedidoConDetalles, obtenerPedidosDeCliente } from '~/server/services/usuario/pedirPizzaService';
import { getQuery, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  switch (method) {
    case 'GET': {
      try {
        const query = getQuery(event);
        const id_cliente = query.id_cliente ? parseInt(query.id_cliente) : null;

        if (!id_cliente) {
          event.res.statusCode = 400;
          return { error: 'Falta el id_cliente' };
        }

        const pedidos = await obtenerPedidosDeCliente(id_cliente);
        return pedidos;
      } catch (error) {
        event.res.statusCode = 500;
        return { error: 'Error al obtener pedidos', details: error.message };
      }
    }

    case 'POST': {
      try {
        const body = await readBody(event);
        const { id_cliente, id_pizza, id_tamano, cantidad, precio_unitario } = body;

        if (!id_cliente || !id_pizza || !id_tamano || !cantidad || !precio_unitario) {
          event.res.statusCode = 400;
          return { error: 'Faltan datos para crear el pedido' };
        }

        const result = await crearPedidoConDetalles({
          id_cliente,
          id_pizza,
          id_tamano,
          cantidad,
          precio_unitario
        });

        return { success: true, message: 'Pedido creado correctamente', result };
      } catch (error) {
        event.res.statusCode = 500;
        return { error: 'Error al crear el pedido', details: error.message };
      }
    }

    default:
      event.res.statusCode = 405;
      return { error: 'Método no permitido' };
  }
});
