import express from 'express';
import {getProducts, getProductsid} from '../controllers/products.controller.js';

const router = express.Router();

// Expone el endpoint que obtiene productos desde la fuente externa.
router.get('/external',getProducts);
router.get('/', getProducts);
router.get('/:id',getProductsid);
export default router;
