import { pool } from '../config/db.js';

export async function createOrder({ customerId, items }) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Comprobar cliente
    const [customers] = await connection.execute(
      'SELECT id FROM customers WHERE id = ? AND active = TRUE LIMIT 1',
      [customerId]
    );

    if (customers.length === 0) {
      const error = new Error('Cliente no encontrado');
      error.status = 404;
      throw error;
    }

    // 2. Comprobar productos y calcular total
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const [products] = await connection.execute(
        'SELECT id, name, price, stock FROM products WHERE id = ? AND active = TRUE LIMIT 1',
        [item.productId]
      );

      if (products.length === 0) {
        const error = new Error(`Producto ${item.productId} no encontrado`);
        error.status = 404;
        throw error;
      }

      const product = products[0];

      if(product.stock < item.quantity){
  const error = new Error(`Stock insuficiente para el producto ${item.productId}`);
        error.status = 400;
        throw error; 
}
      if (item.quantity <= 0) {
        const error = new Error('La cantidad debe ser mayor que 0');
        error.status = 400;
        throw error;
      }

      const unitPrice = Number(product.price);
      const subtotal = unitPrice * item.quantity;

      total += subtotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice,
        subtotal,
      });
    }

    // 3. Guardar pedido
    const [orderResult] = await connection.execute(
      'INSERT INTO orders (customer_id, total) VALUES (?, ?)',
      [customerId, total]
    );

    const orderId = orderResult.insertId;

    // 4. Guardar líneas
    for (const item of orderItems) {
      await connection.execute(
        `INSERT INTO order_items 
         (order_id, product_id, quantity, unit_price, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [
          orderId,
          item.productId,
          item.quantity,
          item.unitPrice,
          item.subtotal,
        ]
      );

      const [stockResult] = await connection.execute(
        `UPDATE products
         SET stock = stock - ?
         WHERE id = ? AND stock >= ?`,
        [item.quantity, item.productId, item.quantity]
      );

      if (stockResult.affectedRows === 0) {
        const error = new Error(`Stock insuficiente para el producto ${item.productId}`);
        error.status = 409;
        throw error;
      }
    }

    await connection.commit();

    return {
      id: orderId,
      customerId,
      total,
      items: orderItems,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
