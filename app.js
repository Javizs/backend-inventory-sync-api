//Implementación de express
import express from 'express';
const app = express();
app.use(express.json());
import routes from './routes/products.routes.js'

//Estado de salud de la api 

app.use("/api/products",routes);


//Comprobación de estado de servidor 
app.listen(3000, () => {
  console.log("Servidor funcionando en http://localhost:3000");
});