const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const users=require("./data2")

// Mi lista de tareas
const taskList = require("./data");

router.use(express.json());

const validarRuta = (req, res, next) => {
  const metodo = req.method;
  const ruta = req.originalUrl;// Define una expresión regular para validar rutas que comienzan con "/tareas/" seguidas por un número (parámetro).
  const tareaPattern = /^\/tareas\/\d+$/;
  if (metodo === "GET") {
    if (
      ruta != "/tareas" &&
      ruta != "/tareas/completadas" &&
      ruta != "/tareas/pendientes" &&
      ruta != "/tareas/rutaAdmin" &&
      !tareaPattern.test(ruta)
     
    ) {
      res.status(404).send("Pagina no encontrada");
    }
  }
  next();
};
router.use(validarRuta);
const administradores=['legive', 'admin2'];

//Crea una ruta protegida que haga la validación de un token JWT recibido dentro de un header de autorización que esté en la petición.
const JWTValidation = (req, res, next) => {
  console.log("entro")
  const headerToken = req.headers.authorization;
  const user=req.headers.user;
console.log(user)

  try {
    
    const decoded = jwt.verify(headerToken, process.env.SECRET_KEY);
    console.log(process.env.SECRET_KEY)
    console.log("---->", decoded);
    req.user = decoded;
    if (administradores.includes(user))

    {next();
    }
    else{
      return res.status(400).send("Acceso denegado para su rol de usuario")
    }
    
  } catch (error) {
    console.log("entro")
    return res.status(400).send("Token incorrecto");

  }
};
//Implementa la creación de un JWT en la ruta /login para una serie de usuarios predefinidos en un array dentro de tu servidor


router.get("/rutaAdmin",JWTValidation, (req, res) => {
  console.log("entro")
  res.send({ mensaje: "Bienvenido admin", user: req.user });
});

router.get("/", (req, res) => {
  res.json(taskList);
  res.status(404).send("Not found");
});

// Ruta para listar tareas completas (GET /tasks/completed)
router.get("/completadas", (req, res) => {
  const tareasCompletas = taskList.filter((task) => task.isCompleted == true);
  res.json(tareasCompletas);
});

// Ruta para listar tareas incompletas (GET /tasks/incomplete)
router.get("/pendientes", (req, res) => {
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
  res.json(task);
});



module.exports = router;

