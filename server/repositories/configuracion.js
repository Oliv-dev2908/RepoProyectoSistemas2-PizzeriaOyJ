import { usePostres } from './../utils/postgres';

export const getConfiguracion = async () => {
    const sql = usePostres();
    
    // Auto-migración: Crear tabla si no existe
    await sql`
        CREATE TABLE IF NOT EXISTS "Configuracion" (
            id SERIAL PRIMARY KEY,
            nombre_pizzeria TEXT DEFAULT 'Pizzería OyJ',
            logo_url TEXT DEFAULT 'https://via.placeholder.com/96',
            theme_flavor TEXT DEFAULT 'mocha',
            custom_colors_light JSONB DEFAULT '{}',
            custom_colors_dark JSONB DEFAULT '{}'
        )
    `;

    // Asegurar que las columnas nuevas existan si la tabla ya fue creada previamente
    await sql`ALTER TABLE "Configuracion" ADD COLUMN IF NOT EXISTS custom_colors_light JSONB DEFAULT '{}'`;
    await sql`ALTER TABLE "Configuracion" ADD COLUMN IF NOT EXISTS custom_colors_dark JSONB DEFAULT '{}'`;

    // Verificar si hay registros, si no, insertar uno por defecto
    const config = await sql`SELECT * FROM "Configuracion" LIMIT 1`;
    
    if (config.length === 0) {
        const insertDefault = await sql`
            INSERT INTO "Configuracion" (nombre_pizzeria, logo_url, theme_flavor, custom_colors_light, custom_colors_dark)
            VALUES ('Pizzería OyJ', 'https://via.placeholder.com/96', 'mocha', '{}', '{}')
            RETURNING *
        `;
        return insertDefault[0];
    }
    
    return config[0];
};

export const updateConfiguracion = async (config) => {
    const { nombre_pizzeria, logo_url, theme_flavor, custom_colors_light, custom_colors_dark } = config;
    const sql = usePostres();
    
    const result = await sql`
        UPDATE "Configuracion"
        SET 
            nombre_pizzeria = ${nombre_pizzeria},
            logo_url = ${logo_url},
            theme_flavor = ${theme_flavor},
            custom_colors_light = ${JSON.stringify(custom_colors_light || {})},
            custom_colors_dark = ${JSON.stringify(custom_colors_dark || {})}
        WHERE id = (SELECT id FROM "Configuracion" LIMIT 1)
        RETURNING *
    `;
    
    return result[0];
};
