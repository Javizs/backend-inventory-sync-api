import express from 'express';

import router from './routes/products.routes.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Monta las rutas de productos bajo el prefijo principal de la API.
app.use('/api/products', router);

app.use(notFoundHandler);
app.use(errorHandler);

// Inicia el servidor HTTP en el puerto 3000.
app.listen(3000, () => {
  console.log('Servidor levantado en http://localhost:3000');
});
