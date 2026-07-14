import { createOrder } from '../services/orders.services.js';

export async function registerOrder(req,res,next){
    try{
        const { customerId, items } = req.body;
        const customerIdNumber = Number(customerId);
        if (Number.isNaN(customerIdNumber) || !Array.isArray(items) || items.length === 0) {
                        const error = new Error('Datos invalidos');
                error.status = 400;
                return next(error);
        }
        const formattedItems = items.map((item) =>({
            productId:Number(item.productId),
         quantity: Number(item.quantity),
        }))
          const hasInvalidItem = formattedItems.some(
      (item) =>
        Number.isNaN(item.productId) ||
        Number.isNaN(item.quantity) ||
        item.quantity <= 0
    );

    if (hasInvalidItem) {
      const error = new Error('Productos del pedido invalidos');
      error.status = 400;
      return next(error);
    }

    const order = await createOrder({
      customerId: customerIdNumber,
      items: formattedItems,
    });

    res.status(201).json({
      ok: true,
      message: 'Pedido creado correctamente',
      data: order,
    });
    }catch (error) {
    next(error);
  }
}