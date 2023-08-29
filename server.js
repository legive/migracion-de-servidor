const express = require('express')
const app = express()
const port = 3000
const tareas=[
    {
        "id":"123456",
        "isCompleted":false,
        "description":"Walk the dog",
    }
]

app.use(express.json());
app.get('/', (req, res) => {
    res.send(tareas)
  })
  app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto${port}`)
  })