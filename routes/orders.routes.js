import express from 'express';
import { registerOrder } from '../controllers/orders.controllers.js';

const router = express.Router();

router.post('/', registerOrder);

export default router;