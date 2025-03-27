// server/api/products.js

export default defineEventHandler((event) => {
    return [
      {
        id: 1,
        name: 'Pizza Margarita',
        price: 10.99,
      },
      {
        id: 2,
        name: 'Pizza Pepperoni',
        price: 12.99,
      },
      {
        id: 3,
        name: 'Pizza Vegetariana',
        price: 11.99,
      },
    ];
  });
  