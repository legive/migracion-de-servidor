
const jwt = require("jsonwebtoken");
require("dotenv").config();

const users=require("../data2")
const administradores=['legive', 'admin2'];
// Mi lista de tareas
const taskList = require("../data");
//Crea un middleware a nivel de aplicación para gestionar que solo llegen solicitudes por métodos http validos dentro del servidor, de lo contrario debe devolver el error.

const validateMethodHttp = (req, res, next) => {
    const method = req.method;
  
    if (
      !(method === "POST") &&
      !(method === "PUT") &&
      !(method === "DELETE") &&
      !(method === "GET")
    ) {
      return res.status(405).json({ error: "HTTP method not allowed" });
    }
  
    next();
  };

  //Middleware para validar errores
  const validateErrors = (req, res, next) => {
    const newTask = req.body;
    const method = req.method;
  
    if ((method === "POST" || method === "PUT") && !req.body) {
      return res.status(400).send("Empty data");
    }
    if (method === "POST") {
      if (!newTask || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Empty Task" });
      }
  
      const keys = Object.keys(newTask);
  
      if (keys.length !== 4) {
        return res
          .status(400)
          .json({ error: "Enter the 4 attributes of the task" });
      }
    }
  
    if (method === "PUT") {
      if (!newTask || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Empty Task" });
      } else {
        next();
      }
    }
  
    next();
  };
  
  const validarRuta = (req, res, next) => {
    const metodo = req.method;
    const ruta = req.originalUrl;// Define una expresión regular para validar rutas que comienzan con "/tareas/" seguidas por un número (parámetro).
    const tareaPattern = /^\/api\/tasklist\/\d+$/;

    if (metodo === "GET") {
      if (
        ruta != "/api/tasklist" &&
        ruta != "/api/tasklist/completed" &&
        ruta != "/api/tasklist/notCompleted" &&
        ruta != "/api/tasklist/routeAdmin" &&
        !tareaPattern.test(ruta)
       
      ) {
        res.status(404).send("Page not found");
      }
    }
    next();
  };

 
//Implementa la creación de un JWT en la ruta /login para una serie de usuarios predefinidos en un array dentro de tu servidor

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
      return res.status(400).send("Access denied for your user role")
    }
    
  } catch (error) {
    console.log("entro")
    return res.status(400).send("Wrong token");

  }
};


  module.exports = {
    validateMethodHttp,
    validateErrors,
    validarRuta,
    JWTValidation,
  };