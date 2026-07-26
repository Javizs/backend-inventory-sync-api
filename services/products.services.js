import { pool } from '../config/db.js';
import {
  findAllProducts,
  findProductsByCategory,
  findProductById,
} from '../repositories/products.repository.js';
import { AppError } from '../errors/AppError.js';

const EXTERNAL_PRODUCTS_URL = 'https://dummyjson.com/products';

//FUNCION QUE PIDE DATOS EXTERNOS
async function fetchExternalProducts(){
  const response = await fetch(EXTERNAL_PRODUCTS_URL);
  if(!response.ok){
    const error = new Error('Error al obtener productos');
    error.status = 502;
    throw error;
  }
  const data = await response.json();
  return data?.products?? [];
}
function transformExternalProduct(product){
  return{
    externalID:product.id,
    name:product.title,
    price:product.price,
    stock:product.stock,
    category:product.category,
  };
}

//Comprobación de duplicados / evita sql.injection 
async function productsExistsByExternalId(externalID){
  const [rows] = await pool.execute(
    'SELECT id FROM products WHERE external_id = ? LIMIT 1',
    [externalID]
  );

  return rows.length > 0;
}
async function insertProduct(product){
  await pool.execute(
    `INSERT INTO products (external_id,name,price,stock,category) 
    VALUES(?,?,?,?,?)`,
    [
      product.externalID,
      product.name,
      product.price,
      product.stock,
      product.category,
    ]
  );
}
export async function importExternalProducts(){
  const externalProducts = await fetchExternalProducts();
  let imported = 0;
  let skipped = 0;
  const errors =[];
  for(const externalProduct of externalProducts){
    try{
      const product = transformExternalProduct(externalProduct);
      const exists = await productsExistsByExternalId(product.externalID);
      if(exists){
        skipped++;
        continue;

      }
      await insertProduct(product);
      imported++;
    }catch(error){
      errors.push({
        externalID:externalProduct.id,
        message: error.message,
      })
    }
  }
  return {
    imported,
    skipped,
    errorsCount:errors.length,
    errors,
  };
}
export async function getExternalProducts() {
  return findAllProducts();
}

export async function saveExternalProducts(products) {
  for (const product of products) {
    await pool.execute(
      `INSERT INTO products (external_id, name, price, stock, category)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         price = VALUES(price),
         stock = VALUES(stock),
         category = VALUES(category)`,
      [
        product.externalID,
        product.name,
        product.price,
        product.stock,
        product.category,
      ]
    );
  }
}

export async function getExternalProductid(id) {
  const productId = Number(id);

  if (Number.isNaN(productId)) {
    throw new AppError('El id debe ser numero', 400);
  }

  const product = await findProductById(productId);

  if (!product) {
    throw new AppError('Producto no encontrado', 404);
  }

  return product;
}

export async function createLocalProduct(product) {
  const [result] = await pool.execute(
    'INSERT INTO products (name, price, stock, category) VALUES (?, ?, ?, ?)',
    [
      product.name,
      product.price,
      product.stock,
      product.category,
    ]
  );

  return result.insertId;
}
export async function updateLocalProduct(id, product) {
  const [result] = await pool.execute(
    'UPDATE products SET name = ?, price = ?, stock = ?, category = ? WHERE id = ? AND active = TRUE',
    [
      product.name,
      product.price,
      product.stock,
      product.category,
      id,
    ]
  );

  return result.affectedRows;
}

export async function deleteLocalProduct(id) {
  const [result] = await pool.execute(
    'UPDATE products SET active = FALSE WHERE id = ? AND active = TRUE',
    [id]
  );

  return result.affectedRows;
}

export async function getExternalDummyProducts(){
   const products = await fetchExternalProducts();

  if (!products || products.length === 0) {
    return [];
  }
  const jsonproducts = products.map((product) => {
    const { id, title: name, price, stock } = product;
     return{
      id,
      name,
      price,
      available: stock > 0,
     }
  });
  return jsonproducts;
}

export async function searchProductsByCategory(category) {
  if (typeof category !== 'string' || category.trim() === '') {
    throw new AppError('La categoria es obligatoria', 400);
  }

  return findProductsByCategory(category.trim());
}

export async function createProductWithValidation(product) {
  const { name, price, stock, category = 'local' } = product || {};

  const priceNumber = Number(price);
  const stockNumber = Number(stock);

  if (
    !name ||
    Number.isNaN(priceNumber) ||
    priceNumber <= 0 ||
    Number.isNaN(stockNumber) ||
    stockNumber < 0
  ) {
    throw new AppError('Datos de producto invalidos', 400);
  }

  return createLocalProduct({
    name,
    price: priceNumber,
    stock: stockNumber,
    category,
  });
}
