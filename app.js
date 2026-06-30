//Implementación de express
const express = require("express");
const app = express();
app.use(express.json());

//Estado de salud de la api 

app.get("/api/health",(req,res) =>{
    res.json({
        status:"ok",
        mensaje: "Backend en funcionamiento"
    });
});


//Comprobación de estado de servidor 
app.listen(3000, () => {
  console.log("Servidor funcionando en http://localhost:3000");
});