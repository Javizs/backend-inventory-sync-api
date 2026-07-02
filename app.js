import express from 'express';

import router from './routes/products.routes.js';

const app = express();

// Monta las rutas de productos bajo el prefijo principal de la API.
app.use('/api/products',router);

// Inicia el servidor HTTP en el puerto 3000.
app.listen(3000,() => {
  console.log('Servidor levantado en http://localhost:3000');
})
