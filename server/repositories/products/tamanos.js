import { usePostres } from './../../utils/postgres';

export const getAllTamanos = async (tamano) => {
    const id = tamano;
    const sql = usePostres()
    var tamanos;
    if( id > 0){
        tamanos = await sql`SELECT * FROM "Tamano" WHERE id_tamano = ${id}`;
    }
    else{
        tamanos = await sql`SELECT * FROM "Tamano"`;
    }
    return tamanos;
};

export const insertTamanos = async (tamano) => {
    const { nombre, descripcion, precio_base } = tamano;
    const sql = usePostres()
    const result = await sql`INSERT INTO "Tamano"  (nombre, descripcion, precio_base) VALUES (${nombre}, ${descripcion}, ${precio_base})`
    return result;
};

export const updateTamanos = async (tamano) => {
    const { id_tamano, nombre, descripcion, precio_base } = tamano[0];
    const sql = usePostres();
    const result = await sql`
        UPDATE "Tamano" 
        SET nombre = ${nombre}, descripcion = ${descripcion}, precio_base = ${precio_base} 
        WHERE id_tamano = ${id_tamano}`;
    return result;
};