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

// Agregar o actualizar un ingrediente en una pizza
export const addIngredienteToPizza = async (idPizza, idIngrediente, cantidad) => {
  const sql = usePostres();

  const existingIngredient = await sql`
    SELECT 1 FROM "PizzaIngrediente" 
    WHERE id_pizza = ${idPizza} AND id_ingrediente = ${idIngrediente}
  `;

  if (existingIngredient.length > 0) {
    await sql`
      UPDATE "PizzaIngrediente"
      SET cantidad = ${cantidad}
      WHERE id_pizza = ${idPizza} AND id_ingrediente = ${idIngrediente}
    `;
  } else {
    await sql`
      INSERT INTO "PizzaIngrediente" (id_pizza, id_ingrediente, cantidad)
      VALUES (${idPizza}, ${idIngrediente}, ${cantidad})
    `;
  }

  // Recalcular precio total
  await actualizarPrecioPizza(idPizza);
};

// Eliminar ingrediente
export const removeIngredienteFromPizza = async (idPizza, idIngrediente) => {
  const sql = usePostres();

  await sql`
    DELETE FROM "PizzaIngrediente"
    WHERE id_pizza = ${idPizza} AND id_ingrediente = ${idIngrediente};
  `;

  // Recalcular precio total
  await actualizarPrecioPizza(idPizza);
};


const actualizarPrecioPizza = async (idPizza) => {
  const sql = usePostres();

  const result = await sql`
    SELECT 
      SUM(pi.cantidad * i.costo_unitario) AS nuevo_precio
    FROM "PizzaIngrediente" pi
    JOIN "Ingrediente" i ON pi.id_ingrediente = i.id_ingrediente
    WHERE pi.id_pizza = ${idPizza}
  `;

  const nuevoPrecio = result[0].nuevo_precio ?? 0;

  await sql`
    UPDATE "Pizza"
    SET precio_base = ${nuevoPrecio}
    WHERE id_pizza = ${idPizza}
  `;
};
