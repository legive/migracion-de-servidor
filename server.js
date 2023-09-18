const express = require('express')
const app = express()
const port = 3000
const jwt=require("jsonwebtoken");
const dotenv=require("dotenv");
const SECRET_KEY="HS256";
dotenv.config();

const listEditRouter =require("./list-edit-router");
const listViewRouter =require("./list-view-router");

//Implementa la creación de un JWT en la ruta /login para una serie de usuarios predefinidos en un array dentro de tu servidor
const users = [
  { email: "leylagisela@gmail.com", user: "legive", password:"1234", rol: "admin" },
  { email: "interra_2012@yahoo.com", user: "interra", password:"12345", rol: "user" },
];


app.use(express.json());

app.get("/", function (req, res) {
  res.send("Bienvenido a Organiza tu día \u{1F4D3}");
});


app.use('/tareas', listViewRouter);
app.use('/tareas', listEditRouter);

//Crea una ruta protegida que haga la validación de un token JWT recibido dentro de un header de autorización que esté en la petición.
const JWTValidation =(req, res, next)=>{
  const headerToken=req.headers.authorization;

 try
 {
 const decoded=jwt.verify(headerToken, SECRET_KEY);
 console.log("---->", decoded);
 req.user=decoded; 
 next();
 }catch(error){
  res.status(400).send("Token incorrecto");
 }

 
}


//Crea una ruta /login con el método POST para hacer el proceso de autenticación
app.post("/login",(req,res)=>{ 
 const userName=req.body.user;
  const userPass=req.body.password;

  const user=users.find((user)=>user.user===userName)
console.log(user)
console.log(userPass)
console.log(user.password)
  if(user){
if(userPass===user.password){
  const payload={
          email:user.email,
          rol:user.rol,
          name:user.name,
          password:user.password
      }
     
      const token=jwt.sign(payload, SECRET_KEY);
     
      res.status(200).send({mensaje:"Bienvenido a la plataforma",token})
    }
    else{
      return res.status(401).send({ error: "Invalid user name or password" });
    }
    }
    else
    {
      return res.status(401).send({ error: "Invalid user name or password" });
    }
    next();
})

app.get("/rutaAdmin",JWTValidation,(req,res)=>{
  res.send({mensaje:"Bienvenido admin", user:req.user})
})

  app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto: ${port}`)
  })