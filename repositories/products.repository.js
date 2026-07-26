import { pool } from '../config/db.js';

export async function findAllProducts() {
  const [rows] = await pool.execute(
    'SELECT external_id AS externalID, name, price, stock, category FROM products WHERE active = TRUE'
  );

  return rows;
}
export async function findProductsByCategory(category) {
  const [rows] = await pool.execute(
    `SELECT external_id AS externalID, name, price, stock, category
     FROM products
     WHERE active = TRUE AND category = ?`,
    [category]
  );

  return rows;
}

export async function findProductById(id) {
  const [rows] = await pool.execute(
    'SELECT id, external_id AS externalID, name, price, stock, category FROM products WHERE id = ? AND active = TRUE LIMIT 1',
    [id]
  );

  return rows[0];
}
