import { usePostres } from './../../utils/postgres';

// Obtener todos los ingredientes o uno por ID
export const fetchIngrediente = async (ingredienteId) => {
  const id = ingredienteId;
  const sql = usePostres();
  let ingredientes;
  if (id > 0) {
    ingredientes = await sql`SELECT * FROM "Ingrediente" WHERE id_ingrediente = ${id}`;
  } else {
    ingredientes = await sql`SELECT * FROM "Ingrediente" WHERE activo = 1`; // Solo ingredientes activos
  }
  return ingredientes;
};

// Insertar nuevo ingrediente
export const createIngrediente = async (ingrediente) => {
  const { nombre, costo_unitario, tipo } = ingrediente;
  const sql = usePostres();
  const result = await sql`
    INSERT INTO "Ingrediente" (nombre, costo_unitario, tipo, activo)
    VALUES (${nombre}, ${costo_unitario}, ${tipo}, 1)
  `;
  return result;
};

// Modificar ingrediente existente
export const modifyIngrediente = async (ingrediente) => {
  const { id_ingrediente, nombre, costo_unitario, tipo } = ingrediente[0];
  console.log("Datos del ingrediente:", { id_ingrediente, nombre, costo_unitario, tipo });
  const sql = usePostres();
  const result = await sql`
    UPDATE "Ingrediente"
    SET nombre = ${nombre}, costo_unitario = ${costo_unitario}, tipo = ${tipo}
    WHERE id_ingrediente = ${id_ingrediente}
  `;
  return result;
};

// Eliminación lógica del ingrediente
export const deleteIngrediente = async (ingrediente) => {
  const { activo, id_ingrediente } = ingrediente;
  const sql = usePostres();
  const result = await sql`
    UPDATE "Ingrediente"
    SET activo = ${activo}
    WHERE id_ingrediente = ${id_ingrediente}
  `;
  return result;
};
