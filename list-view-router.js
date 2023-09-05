const express = require('express');
const router = express.Router();

// Mi lista de tareas
const taskList=require('./data')

router.use(express.json());

router.get('/', (req, res) => {
   
    res.json(taskList);
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
