import { usePostres } from './../utils/postgres';

export const getConfiguracion = async () => {
    const sql = usePostres();
    
    // Auto-migración: Crear tabla si no existe
    await sql`
        CREATE TABLE IF NOT EXISTS "Configuracion" (
            id SERIAL PRIMARY KEY,
            nombre_pizzeria TEXT DEFAULT 'Pizzería OyJ',
            logo_url TEXT DEFAULT 'https://via.placeholder.com/96',
            theme_flavor TEXT DEFAULT 'mocha'
        )
    `;

    // Verificar si hay registros, si no, insertar uno por defecto
    const config = await sql`SELECT * FROM "Configuracion" LIMIT 1`;
    
    if (config.length === 0) {
        const insertDefault = await sql`
            INSERT INTO "Configuracion" (nombre_pizzeria, logo_url, theme_flavor)
            VALUES ('Pizzería OyJ', 'https://via.placeholder.com/96', 'mocha')
            RETURNING *
        `;
        return insertDefault[0];
    }
    
    return config[0];
};

export const updateConfiguracion = async (config) => {
    const { nombre_pizzeria, logo_url, theme_flavor } = config;
    const sql = usePostres();
    
    const result = await sql`
        UPDATE "Configuracion"
        SET 
            nombre_pizzeria = ${nombre_pizzeria},
            logo_url = ${logo_url},
            theme_flavor = ${theme_flavor}
        WHERE id = (SELECT id FROM "Configuracion" LIMIT 1)
        RETURNING *
    `;
    
    return result[0];
};
