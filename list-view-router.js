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
  const ruta = req.originalUrl;
  if (metodo === "GET") {
    if (
      ruta != "/tareas" &&
      ruta != "/tareas/completadas" &&
      ruta != "/tareas/pendientes" &&
      ruta != "/tareas/rutaAdmin"
    ) {
      res.status(404).send("Pagina no encontrada");
    }
  }
  next();
};
router.use(validarRuta);


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

//Crea una ruta protegida que haga la validación de un token JWT recibido dentro de un header de autorización que esté en la petición.
const JWTValidation = (req, res, next) => {
  const headerToken = req.headers.authorization;
console.log("HeaderToken", headerToken)
  try {
    const decoded = jwt.verify(headerToken, process.env.SECRET_KEY);
    console.log("---->", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).send("Token incorrecto");
  }
};
//Implementa la creación de un JWT en la ruta /login para una serie de usuarios predefinidos en un array dentro de tu servidor

router.get("/rutaAdmin", JWTValidation, (req, res) => {
  res.send({ mensaje: "Bienvenido admin", user: req.user });
});

module.exports = router;

