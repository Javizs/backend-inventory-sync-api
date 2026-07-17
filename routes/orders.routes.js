import express from 'express';
import { registerOrder, getOrderById, updateOrderStatus } from '../controllers/orders.controllers.js';

const router = express.Router();

router.post('/', registerOrder);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);

export default router;