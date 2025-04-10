import {
    createIngrediente,
    modifyIngrediente,
    fetchIngrediente,
    deleteIngrediente,
  } from './../../services/products/ingredienteService.js';
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
            return await fetchIngrediente(id);
          } else {
            return await fetchIngrediente(); // Todas las entradas
          }
        } catch (error) {
          event.res.statusCode = 500;
          return { error: 'Error al obtener ingrediente(s)', details: error.message };
        }
      }
  
      case 'POST': {
        try {
          const ingrediente = await readBody(event);
          const result = await createIngrediente(ingrediente);
          return { success: true, message: 'Ingrediente insertado correctamente', result };
        } catch (error) {
          event.res.statusCode = 500;
          return { error: 'Error al insertar ingrediente', details: error.message };
        }
      }
  
      case 'PUT': {
        try {
          const ingrediente = await readBody(event);
          const result = await modifyIngrediente(ingrediente);
          return { success: true, message: 'Ingrediente actualizado correctamente', result };
        } catch (error) {
          event.res.statusCode = 500;
          return { error: 'Error al actualizar ingrediente', details: error.message };
        }
      }
  
      case 'DELETE': {
        try {
          const { id_ingrediente } = await readBody(event);
          const result = await deleteIngrediente({ id_ingrediente, activo: 0 });
          return { success: true, message: 'Ingrediente eliminado correctamente', result };
        } catch (error) {
          event.res.statusCode = 500;
          return { error: 'Error al eliminar ingrediente', details: error.message };
        }
      }
  
      default:
        event.res.statusCode = 405;
        return { error: 'Método no permitido' };
    }
  });
  