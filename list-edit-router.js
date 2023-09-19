const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const users = require("./data2");
// Mi lista de tareas
const taskList = require("./data");

router.use(express.json());

//Crea un middleware a nivel de aplicación para gestionar que solo llegen solicitudes por métodos http validos dentro del servidor, de lo contrario debe devolver el error.

const validateMethodHttp = (req, res, next) => {
  const metodo = req.method;

  if (
    !(metodo === "POST") &&
    !(metodo === "PUT") &&
    !(metodo === "DELETE") &&
    !(metodo === "GET")
  ) {
    return res.status(405).json({ error: "Método HTTP no permitido." });
  }

  next();
};
router.use(validateMethodHttp);

const validateErrors = (req, res, next) => {
  const newTask = req.body;
  const method = req.method;

  if ((method === "POST" || method === "PUT") && !req.body) {
    return res.status(400).send("No envío datos");
  }
  if (method === "POST") {
    if (!newTask || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Empty Task" });
    }

    const keys = Object.keys(newTask);

    if (keys.length !== 4) {
      return res
        .status(400)
        .json({ error: "ingrese los 4 atributos de la tarea" });
    }
  }

  if (metodo === "PUT") {
    if (!newTask || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "Tarea vacia" });
    } else {
      next();
    }
  }

  next();
};

router.post("/", validateErrors, (req, res) => {
  const newTask = req.body;
  console.log(newTask);

  taskList.push(newTask);
  res.status(201).json({ mensaje: "Tarea agregada con éxito." });
});

const validateTask = (req, res, next) => {
  const idpar = parseInt(req.params.id);
  console.log(idpar);
  const index = taskList.findIndex((task) => task.id === idpar);
  if (index === -1) {
    return res.status(404).json({ error: "Tarea no encontrada." });
  }
  next();
};

router.delete("/:id", validateTask, (req, res) => {
  const idpar = parseInt(req.params.id);
  console.log(idpar);
  const index = taskList.findIndex((task) => task.id === idpar);

  taskList.splice(index, 1);
  res.status(201).json({ mensaje: "Tarea eliminada con éxito." });
  res.json(taskList);
  console.log(taskList);
});

router.put("/:id", validateErrors, validateTask, (req, res) => {
  const idpar = parseInt(req.params.id);
  console.log(idpar);
  const index = taskList.findIndex((task) => task.id === idpar);
  const tarea = req.body;
  taskList[index] = { ...taskList[index], ...tarea };
  res.status(201).json({ mensaje: "Tarea actualizada con éxito." });
  res.json(taskList[index]);
  console.log(taskList);
});

//Crea una ruta /login con el método POST para hacer el proceso de autenticación
router.post("/login", (req, res) => {
  const userName = req.body.user;
  const userPass = req.body.password;

  const user = users.find((user) => user.user === userName);
  console.log(user);
  console.log(userPass);
  console.log(user.password);
  if (user) {
    if (userPass === user.password) {
      const payload = {
        email: user.email,
        rol: user.rol,
        name: user.name,
        password: user.password,
      };

      const token = jwt.sign(payload, process.env.SECRET_KEY );

      res.status(200).send({ mensaje: "Bienvenido a la plataforma", token });
    } else {
      return res.status(401).send({ error: "Invalid user name or password" });
    }
  } else {
    return res.status(401).send({ error: "Invalid user name or password" });
  }
  next();
});


module.exports = router;
