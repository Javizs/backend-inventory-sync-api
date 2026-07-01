//Direccionamos la petición al controlador
import express from  'express';
import {getMessageControl} from '../controllers/products.controller.js';

const routes = express.Router();

routes.get("/external", getMessageControl);

export default routes;