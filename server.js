const fs = require("fs");
const path = require("path");
const express = require("express");
const { tasks } = require("./db/db");

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
function testId(idArg) {
  let idList = tasks.map(({ id }) => id);
  for (i = 0; i < idList.length; i++) {
    if (idArg === parseInt(idList[i])) {
      console.log(`id ${idList[i]} is in use`);
      return false;
    } else {
      console.log(`id ${idList[i]} is available!`);
    }
  }
  return true;
}
function validateTask(task) {
  if (!task.title || typeof task.title !== "string") {
    return false;
  }
  if (!task.text || typeof task.text !== "string") {
    return false;
  }
  if (!testId(task.id)) {
    task.id++;
    validateTask(task);
  }
  return true;
}

//* Queries and the Delete function *//
function deleteTask(id, tasksArray) {
  const isSameId = (element) => element.id == id;
  let idIndex = tasksArray.findIndex(isSameId);
  let updatedArray = tasksArray.splice(idIndex, 1);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify({ tasks: tasksArray }, null, 2)
  );
}
function findById(id, tasksArray) {
  const result = tasksArray.filter((task) => task.id === id)[0];
  return result;
}
//* GET routes *//

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});
app.get("/api/notes", (req, res) => {
  res.json(tasks);
});
app.get("/api/notes/:id", (req, res) => {
  const result = findById(req.params.id, tasks);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
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
app.delete("/api/notes/delete/:id", (req, res) => {
  deleteTask(req.params.id, tasks);
  console.log("note deleted");
  res.end();
});
//* Port Listener *//
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
