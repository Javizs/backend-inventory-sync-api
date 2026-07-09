import {
  getExternalProducts,
  getExternalProductid,
  importExternalProducts,
  createLocalProduct,
  updateLocalProduct,
  deleteLocalProduct,
} from '../services/products.services.js';

export async function getProducts(req, res, next) {
  try {
    const products = await getExternalProducts();
    res.status(200).json({
      ok: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductsid(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      const error = new Error('El id debe ser numero');
      error.status = 400;
      return next(error);
    }

    const product = await getExternalProductid(id);
    if (!product) {
      const error = new Error('Producto no encontrado');
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      ok: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
}
export async function importProducts(req,res,next){
  try{
    const result = await importExternalProducts();
    res.status(201).json({
      ok:true,
      message:'Correct Import',
      data:result,
    })

  }catch(error){
    next(error);
  }
}

//Funcion controller de create
export async function createProduct(req, res, next) {
  try {
    const { name, price, stock, category = 'local' } = req.body;

    const priceNumber = Number(price);
    const stockNumber = Number(stock);

    if (!name || Number.isNaN(priceNumber) || priceNumber <= 0 || Number.isNaN(stockNumber) || stockNumber < 0) {
      const error = new Error('Datos de producto invalidos');
      error.status = 400;
      return next(error);
    }

    const productId = await createLocalProduct({
      name,
      price: priceNumber,
      stock: stockNumber,
      category,
    });

    res.status(201).json({
      ok: true,
      message: 'Producto creado correctamente',
      data: {
        id: productId,
      },
    });
  } catch (error) {
    next(error);
  }
}
//Funcion controller de update
export async function updateProduct(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      const error = new Error('El id debe ser numero');
      error.status = 400;
      return next(error);
    }

    const { name, price, stock, category } = req.body;

    const priceNumber = Number(price);
    const stockNumber = Number(stock);

    if (!name || Number.isNaN(priceNumber) || priceNumber <= 0 || Number.isNaN(stockNumber) || stockNumber < 0) {
      const error = new Error('Datos de producto invalidos');
      error.status = 400;
      return next(error);
    }


    const affectedRows = await updateLocalProduct(id, {
      name,
      price: priceNumber,
      stock: stockNumber,
      category,
    });

    if (affectedRows === 0) {
      const error = new Error('Producto no encontrado');
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      ok: true,
      message: 'Producto actualizado correctamente',
    });
  } catch (error) {
    next(error);
  }
}
//Funcion controller de delete
export async function deleteProduct(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      const error = new Error('El id debe ser numero');
      error.status = 400;
      return next(error);
    }

    const affectedRows = await deleteLocalProduct(id);

    if (affectedRows === 0) {
      const error = new Error('Producto no encontrado');
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      ok: true,
      message: 'Producto eliminado correctamente',
    });
  } catch (error) {
    next(error);
  }
}