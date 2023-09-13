const express = require('express');
const router = express.Router();

// Mi lista de tareas
const taskList=require('./data')

router.use(express.json());



const validarRuta=(req, res, next)=>{
  const metodo=req.method
const ruta=req.originalUrl
if (metodo==="GET"){
  if(ruta!="/tareas" && ruta!="/tareas/completadas" && ruta!="/tareas/pendientes"){

    res.status(404).send("Pagina no encontrada")
  }
  
}
next()
}
router.use(validarRuta);

router.get('/', (req, res) => {
   
    res.json(taskList);
    res.status(404).send("Not found")
  });
// Ruta para listar tareas completas (GET /tasks/completed)
router.get('/completadas', (req, res) => {
  const tareasCompletas = taskList.filter(task =>task.isCompleted== true);
  res.json(tareasCompletas);
});


// Ruta para listar tareas incompletas (GET /tasks/incomplete)
router.get('/pendientes', (req, res) => {
  const tareasIncompletas = taskList.filter(task =>task.isCompleted== false);
  console.log(tareasIncompletas)
  res.json(tareasIncompletas);
});





module.exports = router;
