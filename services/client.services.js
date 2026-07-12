import { pool } from '../config/db.js';

// Obtiene todos los clientes activos.
export async function findAllClients() {
  const [rows] = await pool.execute(
    'SELECT id, name, email, phone FROM customers WHERE active = TRUE'
  );

  return rows;
}

// Obtiene un cliente activo por su id.
export async function findClientById(id) {
  const [rows] = await pool.execute(
    'SELECT id, name, email, phone FROM customers WHERE id = ? AND active = TRUE LIMIT 1',
    [id]
  );

  return rows[0];
}

// Busca un cliente activo por email para evitar duplicados.
export async function findClientByEmail(email) {
  const [rows] = await pool.execute(
    'SELECT id, name, email, phone FROM customers WHERE email = ? AND active = TRUE LIMIT 1',
    [email]
  );

  return rows[0];
}

// Crea un nuevo cliente y devuelve su id.
export async function insertClient(client) {
  const [result] = await pool.execute(
    'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)',
    [client.name, client.email, client.phone]
  );

  return result.insertId;
}

// Actualiza un cliente activo por su id.
export async function updateClientById(id, client) {
  const [result] = await pool.execute(
    'UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ? AND active = TRUE',
    [client.name, client.email, client.phone, id]
  );

  return result.affectedRows;
}

// Desactiva un cliente sin borrarlo fisicamente.
export async function deactivateClientById(id) {
  const [result] = await pool.execute(
    'UPDATE customers SET active = FALSE WHERE id = ? AND active = TRUE',
    [id]
  );

  return result.affectedRows;
}
