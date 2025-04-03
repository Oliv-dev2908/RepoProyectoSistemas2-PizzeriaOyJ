import { getAllExample } from '../repositories/example';

export const fetchExample = async () => {
    const products = await getAllExample();
    return products;
}