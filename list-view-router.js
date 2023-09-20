const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const users=require("./data2")

// Mi lista de tareas
const taskList = require("./data");
const { validarRuta, JWTValidation } = require("./middlewares/validationsMiddlewares");
router.use(express.json());

router.use(validarRuta);




 //Crea una ruta protegida que haga la validación de un token JWT recibido dentro de un header de autorización que esté en la petición.
router.get("/routeAdmin",JWTValidation, (req, res) => {
  console.log("entro")
  res.send({ mensaje: "Welcome admin", user: req.user });
});

router.get("/", (req, res) => {
  res.json(taskList);
  res.status(404).send("Not found");
});

// Ruta para listar tareas completas (GET /tasks/completed)
router.get("/completed", (req, res) => {
  const tareasCompletas = taskList.filter((task) => task.isCompleted == true);
  res.json(tareasCompletas);
});

// Ruta para listar tareas incompletas (GET /tasks/incomplete)
router.get("/notCompleted", (req, res) => {
  const tareasIncompletas = taskList.filter(
    (task) => task.isCompleted == false
  );
  console.log(tareasIncompletas);
  res.json(tareasIncompletas);
});

// Obtener una sola tarea
router.get("/:id", (req, res) => {
  const idTask=req.params.id
  const task = taskList.filter(
    (task) => task.id == idTask
  );
  console.log(task);
  if(task=="")
  {res.status(404).send({error:"Task not found"});}
  else
  {res.json(task);}
  


});



module.exports = router;

