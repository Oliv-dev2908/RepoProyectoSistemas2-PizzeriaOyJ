import { createError } from 'h3';
import postgres from "postgres";

export function usePostres(){
    if(!process.env.NUXT_POSTGRES_URL){
        throw createError('Missing NUXT_POSTGRES_URL');
    }
    return postgres(process.env.NUXT_POSTGRES_URL, {
        ssl: 'require'
    })
}