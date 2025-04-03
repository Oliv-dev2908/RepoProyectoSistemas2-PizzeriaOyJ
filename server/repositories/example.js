import { usePostres } from './../utils/postgres';
export const getAllExample = async event => {
        const sql = usePostres()

        const products = await sql`SELECT * FROM products`
        event.waitUntil(sql.end())
        return products;
    };