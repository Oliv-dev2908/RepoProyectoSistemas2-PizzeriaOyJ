import { usePostres } from './../../utils/postgres';

// Obtener todas las pizzas o una por ID
export const fetchPizza = async (pizzaId) => {
  const id = pizzaId;
  const sql = usePostres();
  let pizzas;
  
  if (id > 0) {
    pizzas = await sql`SELECT * FROM "Pizza" WHERE id_pizza = ${id}`;
  } else {
    pizzas = await sql`SELECT * FROM "Pizza" WHERE activo = 1`; // Solo pizzas activas
  }
  
  return pizzas;
};

// Insertar nueva pizza
export const createPizza = async (pizza) => {
  const { nombre, descripcion } = pizza;
  const sql = usePostres();
  const result = await sql`
    INSERT INTO "Pizza" (nombre, descripcion, activo)
    VALUES (${nombre}, ${descripcion}, 1)
  `;
  return result;
};

// Modificar pizza existente
export const modifyPizza = async (pizza) => {
  const { id_pizza, nombre, descripcion } = pizza[0];
  const sql = usePostres();
  const result = await sql`
    UPDATE "Pizza"
    SET nombre = ${nombre}, descripcion = ${descripcion}
    WHERE id_pizza = ${id_pizza}
  `;
  return result;
};

// Eliminación lógica de pizza
export const deletePizza = async (pizza) => {
  const { activo, id_pizza } = pizza;
  const sql = usePostres();
  const result = await sql`
    UPDATE "Pizza"
    SET activo = ${activo}
    WHERE id_pizza = ${id_pizza}
  `;
  return result;
};
