const express = require('express')
const app = express()
const port = 3000

const listEditRouter =require("./list-edit-router");
const listViewRouter =require("./list-view-router");




app.use(express.json());

app.get("/", function (req, res) {
  res.send("Bienvenido a Organiza tu día \u{1F4D3}");
});

app.use('/tareas', listViewRouter);
app.use('/tareas', listEditRouter);

// //Crea un middleware para tu direccionador list-view-router, que gestione qué los parámetros seán correctos de lo contrario debe devolver el error.
// app.use((req, res) => {
//   res.status(404).send("ruta no encontrada");
// });

  app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto: ${port}`)
  })