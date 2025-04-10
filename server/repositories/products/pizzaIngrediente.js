import { usePostres } from './../../utils/postgres';

// Obtener ingredientes de una pizza específica
export const fetchPizzaIngredientes = async (idPizza) => {
  const sql = usePostres();
  const ingredientes = await sql`
    SELECT i.id_ingrediente, i.nombre, pi.cantidad
    FROM "PizzaIngrediente" pi
    JOIN "Ingrediente" i ON pi.id_ingrediente = i.id_ingrediente
    WHERE pi.id_pizza = ${idPizza} 
  `;
  return ingredientes;
};

// Agregar un ingrediente a una pizza
export const addIngredienteToPizza = async (idPizza, idIngrediente, cantidad) => {
  const sql = usePostres();
  
  // Verificamos si el ingrediente ya existe para esta pizza
  const existingIngredient = await sql`
    SELECT 1 FROM "PizzaIngrediente" 
    WHERE id_pizza = ${idPizza} AND id_ingrediente = ${idIngrediente}
  `;
  
  if (existingIngredient.length > 0) {
    // Si el ingrediente ya existe, actualizamos la cantidad
    const result = await sql`
      UPDATE "PizzaIngrediente"
      SET cantidad = ${cantidad}
      WHERE id_pizza = ${idPizza} AND id_ingrediente = ${idIngrediente}
    `;
    return result;
  } else {
    // Si el ingrediente no existe, lo agregamos
    const result = await sql`
      INSERT INTO "PizzaIngrediente" (id_pizza, id_ingrediente, cantidad)
      VALUES (${idPizza}, ${idIngrediente}, ${cantidad})
    `;
    return result;
  }
};

// Eliminar un ingrediente de una pizza
export const removeIngredienteFromPizza = async (idPizza, idIngrediente) => {
  const sql = usePostres();
  
  // Eliminación lógica del ingrediente (activo = 0)
  const result = await sql`
    DELETE FROM "PizzaIngrediente"
    WHERE id_pizza = ${idPizza} AND id_ingrediente = ${idIngrediente};
  `;
  return result;
};
