import {getExternalProducts} from '../services/products.services.js';

export async function getProducts(req,res){

    // Pide los productos al servicio y los devuelve como JSON.
    const products  = await getExternalProducts();
    res.json(products);

}; 
