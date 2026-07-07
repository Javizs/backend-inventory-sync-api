import { pool } from '../config/db.js';

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
