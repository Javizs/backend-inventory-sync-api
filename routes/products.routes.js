import express from 'express';
import {
  getProducts,
  getProductsid,
  importProducts,
  createProduct,
  updateProduct,
  deleteProduct,
   searchProducts,
  getDummyProducts
} from '../controllers/products.controller.js';

const router = express.Router();

// Expone el endpoint que obtiene productos desde la fuente externa.
router.get('/external',getProducts);
router.get('/', getProducts);
router.post('/import',importProducts);
router.post('/', createProduct);
router.get('/dummyjson',getDummyProducts);
router.get('/search', searchProducts);
router.get('/:id',getProductsid);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
export default router;
