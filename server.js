const fs = require("fs");
const path = require("path");
const express = require("express");
const { tasks } = require("./db/db");

function deleteTask(id, tasksArray) {
  const isSameId = (element) => element.id == id;
  let idIndex = tasksArray.findIndex(isSameId);
  let updatedArray = tasksArray.splice(idIndex, 1);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify({ tasks: tasksArray}, null, 2)
  );
}
// deleteTask(5, tasks);

const {a} = tasks
console.log(tasks[0].id)


//* server variables *//
const PORT = process.env.PORT || 1217;
const app = express();

//* Data Parsing *//
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//* Data Persistence *//
function createNewTask(body, tasksArray) {
  const task = body;
  tasksArray.push(task);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify({ tasks: tasksArray }, null, 2)
  );
  return task;
}

//* Data Validation *//
function validateTask(task) {
  if (!task.title || typeof task.title !== "string") {
    return false;
  }
  if (!task.text || typeof task.text !== "string") {
    return false;
  }
  if(task.id)
  return true;
}

//* Query and Param filtering *//

//* GET routes *//

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});
app.get("/api/notes", (req, res) => {
  res.json(tasks);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

//* POST routes *//
app.post("/api/notes", (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = tasks.length.toString();

  if (!validateTask(req.body)) {
    res.status(400).send("Something went wrong!");
  } else {
    const task = createNewTask(req.body, tasks);
    res.json(task);
  }
});

//* DELETE routes *//
app.delete("/api/notes/delete:id", (req, res) => {});
//* Port Listener *//
// app.listen(PORT, () => {
//   console.log(`API server now on port ${PORT}!`);
// });
