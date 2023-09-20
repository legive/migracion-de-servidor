const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Importa los middlewares
const { validateMethodHttp, validateErrors } = require("./middlewares/validationsMiddlewares");


// Usa los middlewares en tus rutas
router.use(validateMethodHttp);

const users = [
  {
    email: "leylagisela@gmail.com",
    user: "legive",
    password: "1234",
    rol: "admin",
  },
  {
    email: "interra_2012@yahoo.com",
    user: "interra",
    password: "12345",
    rol: "user",
  },
];

// Mi lista de tareas
const taskList = require("./data");

router.use(express.json());



router.use(validateMethodHttp);



router.post("/", validateErrors, (req, res) => {
  const newTask = req.body;
  console.log(newTask);

  taskList.push(newTask);
  res.status(201).json({ message: "Task added successfully." });
});

const validateTask = (req, res, next) => {
  const idpar = parseInt(req.params.id);
  console.log(idpar);
  const index = taskList.findIndex((task) => task.id === idpar);
  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }
  next();
};

router.delete("/:id", validateTask, (req, res) => {
  const idpar = parseInt(req.params.id);
  console.log(idpar);
  const index = taskList.findIndex((task) => task.id === idpar);

  taskList.splice(index, 1);
  res.status(201).json({ mensaje: "Task deleted successfully." });
  res.json(taskList);
  console.log(taskList);
});

router.put("/:id", validateErrors, validateTask, (req, res) => {
  const idpar = parseInt(req.params.id);
  console.log(idpar);
  const index = taskList.findIndex((task) => task.id === idpar);
  const tarea = req.body;
  taskList[index] = { ...taskList[index], ...tarea };
  res.status(201).json({ mensaje: "Task updated successfully." });
  res.json(taskList[index]);
  console.log(taskList);
});

//Crea una ruta /login con el método POST para hacer el proceso de autenticación
router.post("/login", (req, res) => {
  const userName = req.body.user;
  const userPass = req.body.password;

  const user = users.find((user) => user.user === userName); 
  
  if (user) {
    if (userPass === user.password) {
      const payload = {
        email: user.email,
        rol: user.rol,
        user: user.user,
        password: user.password,
      };
      
      const token = jwt.sign(payload, process.env.SECRET_KEY );

      res.status(200).send({ mensaje: "Welcome to the platform", token });
  
    } else {
      return res.status(401).send({ error: "Invalid user name or password" });
    }
  } else {
    return res.status(401).send({ error: "Invalid user name or password" });
  }
 
});


module.exports = router;
