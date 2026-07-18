import { createOrder, findOrderById, updateOrderStatusById } from '../services/orders.services.js';

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
        Number.isNaN(item.productId) || Number.isNaN(item.quantity) || item.quantity <= 0
    );

    if (hasInvalidItem) {
      const error = new Error('Productos del pedido invalidos');
      error.status = 400;
      return next(error);
    }

const productIds = formattedItems.map((item) => item.productId);
const hasDuplicatedProducts = new Set(productIds).size !== productIds.length;
if (hasDuplicatedProducts){
  const error = new Error('No se permiten duplicados')
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

export async function getOrderById(req,res,next){
  try{
  const id = Number(req.params.id);
  if(Number.isNaN(id)){
    const error = new Error('No se encuentra')
    error.status = 400;
    return next(error);
  }
  const FindId =  await findOrderById(id);
  if(FindId === null){
    const  error = new Error('NotFound');
    error.status = 404;
    return next(error);

  }else{
    res.status(200).json(
{ ok: true,
  data:FindId}    )
  }
  }catch(error){
    next (error);
  }
}
export async function updateOrderStatus(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (Number.isNaN(id)) {
      const error = new Error('El id debe ser numero');
      error.status = 400;
      return next(error);
    }

    const validStatuses = ['pendiente', 'pagado', 'enviado', 'cancelado'];

    if (!status || !validStatuses.includes(status)) {
      const error = new Error('Estado de pedido invalido');
      error.status = 400;
      return next(error);
    }

    const order = await updateOrderStatusById(id, status);

    res.status(200).json({
      ok: true,
      message: 'Estado del pedido actualizado correctamente',
      data: order,
    });
  } catch (error) {
    next(error);
  }
}