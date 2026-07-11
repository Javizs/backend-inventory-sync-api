import 'dotenv/config';
import express from 'express';

import router from './routes/products.routes.js';
import clientrouter from './routes/client.routes.js';
import { testDbConnection } from './config/db.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());
app.use('/api/products', router);
app.use('/api/clients', clientrouter);
app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  await testDbConnection();

  app.listen(port, () => {
    console.log(`Servidor levantado en http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error('No se pudo iniciar la aplicacion', error);
  process.exit(1);
});
