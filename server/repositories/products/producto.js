import { usePostres } from './../../utils/postgres';

// Obtener todos los productos o uno por ID
export const fetchProducto = async (productoId) => {
    const id = productoId;
    const sql = usePostres();
    let productos;
  
    if (id > 0) {
      // Si se solicita un solo producto, también obtendremos el nombre de la categoría
      productos = await sql`
        SELECT p.*, c.nombre AS categoria_nombre
        FROM "Producto" p
        LEFT JOIN "Categoria" c ON p.id_categoria = c.id_categoria
        WHERE p.id_producto = ${id}
      `;
    } else {
      // Si se solicitan todos los productos activos, también traemos el nombre de la categoría
      productos = await sql`
        SELECT p.*, c.nombre AS categoria_nombre
        FROM "Producto" p
        LEFT JOIN "Categoria" c ON p.id_categoria = c.id_categoria
        WHERE p.activo = 1
      `;
    }
  
    return productos;
  };
  

// Insertar nuevo producto
export const createProducto = async (producto) => {
    const { nombre, descripcion, precio, id_categoria } = producto; // Asegúrate de que id_categoria esté incluido
    const sql = usePostres();
    const result = await sql`
      INSERT INTO "Producto" (nombre, descripcion, precio, id_categoria, activo)
      VALUES (${nombre}, ${descripcion}, ${precio}, ${id_categoria}, 1)
    `;
    return result;
  };

// Modificar producto existente
export const modifyProducto = async (producto) => {
    const { id_producto, nombre, descripcion, precio, id_categoria } = producto; // Incluir id_categoria
    const sql = usePostres();
    const result = await sql`
      UPDATE "Producto"
      SET nombre = ${nombre}, descripcion = ${descripcion}, precio = ${precio}, id_categoria = ${id_categoria}
      WHERE id_producto = ${id_producto}
    `;
    return result;
  };

// Eliminación lógica del producto
export const deleteProducto = async (producto) => {
  const { activo, id_producto } = producto;
  const sql = usePostres();
  const result = await sql`
    UPDATE "Producto"
    SET activo = ${activo}
    WHERE id_producto = ${id_producto}
  `;
  return result;
};
