const express = require("express");
const app = express();

require("dotenv").config();

const listEditRouter = require("./list-edit-router");
const listViewRouter = require("./list-view-router");


app.use(express.json());


app.get("/", function (req, res) {
  res.send("Welcome to my TaskList \u{1F4D3}");
});

app.use("/api/tasklist", listViewRouter);
app.use("/api/tasklist", listEditRouter);

app.listen(process.env.port, () => {
  console.log(`Server started on port: ${process.env.port}`);
});
