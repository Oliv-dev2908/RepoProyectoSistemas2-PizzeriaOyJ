import { createError } from 'h3';
import postgres from "postgres";

// 1. Creamos una variable fuera de la función para guardar la instancia
let sql;

export function usePostres(){
    if(!process.env.NUXT_POSTGRES_URL){
        throw createError('Missing NUXT_POSTGRES_URL');
    }

    // 2. Si la conexión no existe, la creamos UNA SOLA VEZ
    if (!sql) {
        sql = postgres(process.env.NUXT_POSTGRES_URL, {
            ssl: 'require',
            max: 10, // 3. IMPORTANTE: Limitamos a 10 conexiones para no saturar Supabase
            idle_timeout: 20, // 4. Cierra conexiones inactivas automáticamente
            connect_timeout: 10
        });
    }

    // 5. Devolvemos siempre la misma instancia 'sql'
    return sql;
}
