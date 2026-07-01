//Gestión de la petición
import {getMessageServices} from '../services/products.services.js';

export const getMessageControl = (req,res) =>{
   
   const data = getMessageServices();
   
    res.json(data);
}