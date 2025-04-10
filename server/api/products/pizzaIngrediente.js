import { 
    addIngredienteToPizza, 
    removeIngredienteFromPizza, 
    fetchPizzaIngredientes 
  } from './../../services/products/pizzaIngredienteService.js'; // Asegúrate de tener este servicio creado
  import { usePostres } from '../../utils/postgres';
  
  export default defineEventHandler(async (event) => {
    const method = event.node.req.method;
    
    switch (method) {
      case 'GET': {
        const query = getQuery(event);
        let idPizza = 0;
        if (query.id_pizza) {
          idPizza = parseInt(query.id_pizza);
        }
  
        try {
          if (idPizza > 0) {
            return await fetchPizzaIngredientes(idPizza); // Obtener ingredientes de una pizza por ID
          } else {
            return { error: 'ID de pizza no proporcionado' }; // Mensaje si no se pasa un ID de pizza
          }
        } catch (error) {
          event.res.statusCode = 500;
          return { error: 'Error al obtener los ingredientes de la pizza', details: error.message };
        }
      }
  
      case 'POST': {
        try {
          const { id_pizza, id_ingrediente, cantidad } = await readBody(event);
          if (!id_pizza || !id_ingrediente || !cantidad) {
            event.res.statusCode = 400;
            return { error: 'Faltan datos necesarios para agregar ingrediente' };
          }
          const result = await addIngredienteToPizza(id_pizza, id_ingrediente, cantidad); // Agregar ingrediente a la pizza
          return { success: true, message: 'Ingrediente agregado correctamente', result };
        } catch (error) {
          event.res.statusCode = 500;
          return { error: 'Error al agregar ingrediente a la pizza', details: error.message };
        }
      }
  
      case 'DELETE': {
        try {
          const { id_pizza, id_ingrediente } = await readBody(event);
          if (!id_pizza || !id_ingrediente) {
            event.res.statusCode = 400;
            return { error: 'Faltan datos necesarios para eliminar ingrediente' };
          }
          const result = await removeIngredienteFromPizza(id_pizza, id_ingrediente); // Eliminar ingrediente de la pizza
          return { success: true, message: 'Ingrediente eliminado correctamente', result };
        } catch (error) {
          event.res.statusCode = 500;
          return { error: 'Error al eliminar ingrediente de la pizza', details: error.message };
        }
      }
  
      default:
        event.res.statusCode = 405;
        return { error: 'Método no permitido' };
    }
  });
  