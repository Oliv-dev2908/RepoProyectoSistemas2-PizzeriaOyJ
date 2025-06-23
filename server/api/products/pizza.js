import {
  createPizza,
  modifyPizza,
  fetchPizza,
  deletePizza,
} from './../../services/products/pizzaService.js'; // Asegúrate de tener este servicio creado
import { usePostres } from '../../utils/postgres';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  switch (method) {
    case 'GET': {
      const query = getQuery(event);
      let id = 0;
      if (query.id) {
        id = parseInt(query.id);
      }

      try {
        if (id > 0) {
          return await fetchPizza(id); // Obtener pizza por ID
        } else {
          return await fetchPizza(); // Obtener todas las pizzas
        }
      } catch (error) {
        event.res.statusCode = 500;
        return { error: 'Error al obtener pizza(s)', details: error.message };
      }
    }

    case 'POST': {
      try {
        const pizza = await readBody(event);
        const result = await createPizza(pizza); // Crear pizza
        return { success: true, message: 'Pizza insertada correctamente', result };
      } catch (error) {
        event.res.statusCode = 500;
        return { error: 'Error al insertar pizza', details: error.message };
      }
    }

    case 'PUT': {
      try {
        const pizza = await readBody(event);
        const result = await modifyPizza(pizza); // Modificar pizza
        return { success: true, message: 'Pizza actualizada correctamente', result };
      } catch (error) {
        event.res.statusCode = 500;
        return { error: 'Error al actualizar pizza', details: error.message };
      }
    }

    case 'DELETE': {
      try {
        const query = getQuery(event);
        const id_pizza = parseInt(query.id);

        if (!id_pizza || isNaN(id_pizza)) {
          event.res.statusCode = 400;
          return { error: 'ID de pizza inválido' };
        }

        const result = await deletePizza({ id_pizza });
        return { success: true, message: 'Pizza eliminada correctamente', result };
      } catch (error) {
        console.error("Error en DELETE:", error);
        event.res.statusCode = 500;
        return { error: 'Error al eliminar pizza', details: error.message };
      }
    }


    default:
      event.res.statusCode = 405;
      return { error: 'Método no permitido' };
  }
});
