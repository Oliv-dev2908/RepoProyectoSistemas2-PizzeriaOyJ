import { usePostres } from './../../utils/postgres';

export const getAllCategorias = async (categoriaId) => {
    const id = categoriaId;
    const sql = usePostres();
    let categorias;
    if (id > 0) {
        categorias = await sql`SELECT * FROM "Categoria" WHERE id_categoria = ${id}`;
    } else {
        categorias = await sql`SELECT * FROM "Categoria" WHERE activo = 1`; // Solo obtener categorías activas
    }
    return categorias;
};

export const insertCategorias = async (categoria) => {
    const { nombre, precio_extra } = categoria;
    const sql = usePostres();
    const result = await sql`INSERT INTO "Categoria" (nombre, precio_extra, activo) VALUES (${nombre}, ${precio_extra}, 1)`; // Se establece activo como true al insertar
    return result;
};

export const updateCategorias = async (categoria) => {
    const { id_categoria, nombre, precio_extra } = categoria[0];
    const sql = usePostres();
    const result = await sql`
        UPDATE "Categoria" 
        SET nombre = ${nombre}, precio_extra = ${precio_extra} 
        WHERE id_categoria = ${id_categoria}`;
    return result;
};

export const deleteLogicCategorias = async (categoria) => {
    const {activo, id_categoria} = categoria;
    console.log(activo);
    const sql = usePostres();
    const result = await sql`
        UPDATE "Categoria" 
        SET activo = ${activo}
        WHERE id_categoria = ${id_categoria}`;
    return result;
};