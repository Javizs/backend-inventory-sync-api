//Direccionamos la petición al controlador
import express from  'express';
import {getMessageControl} from '../controllers/products.controller.js';

const routes = express.Router();

routes.get("/api/productos", getMessageControl);

export default routes;