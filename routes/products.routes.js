import express from 'express';
import {getProducts} from '../controllers/products.controller.js';

const router = express.Router();

// Expone el endpoint que obtiene productos desde la fuente externa.
router.get('/external',getProducts);

export default router;
