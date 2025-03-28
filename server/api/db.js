import { usePostres } from './../utils/postgres';
export default eventHandler(async event => {
        const sql = usePostres()

        const products = await sql`SELECT * FROM products`
        event.waitUntil(sql.end())
        return products;
    }
)