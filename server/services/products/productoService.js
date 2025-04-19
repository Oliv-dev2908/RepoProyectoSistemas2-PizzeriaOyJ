import {
    fetchProducto as getAllProductos,
    createProducto as insertProducto,
    modifyProducto as updateProducto,
    deleteProducto as deleteLogicProducto
  } from "../../repositories/products/producto.js";
  
  // Obtener uno o todos los productos
  export const fetchProducto = async (producto) => {
    try {
      const productos = await getAllProductos(producto);
      return productos;
    } catch (error) {
      console.error("Error fetching productos:", error);
      throw error;
    }
  };
  
  // Crear nuevo producto
  export const createProducto = async (producto) => {
    try {
      const result = await insertProducto(producto);
      return result;
    } catch (error) {
      console.error("Error inserting producto:", error);
      throw error;
    }
  };
  
  // Actualizar producto
  export const modifyProducto = async (producto) => {
    try {
      const result = await updateProducto(producto);
      return result;
    } catch (error) {
      console.error("Error updating producto:", error);
      throw error;
    }
  };
  
  // Eliminar producto lógicamente
  export const deleteProducto = async (producto) => {
    try {
      const result = await deleteLogicProducto(producto);
      return result;
    } catch (error) {
      console.error("Error deleting producto:", error);
      throw error;
    }
  };
  