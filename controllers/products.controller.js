import { getExternalProducts, getExternalProductid,importExternalProducts} from '../services/products.services.js';

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