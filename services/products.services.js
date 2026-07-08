import { pool } from '../config/db.js';
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
  return data.products;
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
  const [rows] = await pool.execute(
    'SELECT external_id AS externalID, name, price, stock, category FROM products WHERE active = TRUE'
  );

  return rows;
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
  const [rows] = await pool.execute(
    'SELECT external_id AS externalID, name, price, stock, category FROM products WHERE external_id = ? AND active = TRUE LIMIT 1',
    [id]
  );

  return rows[0];
}


