import express from 'express';
import { registerOrder, getOrderById } from '../controllers/orders.controllers.js';

const router = express.Router();

router.post('/', registerOrder);
router.get('/:id', getOrderById);

export default router;