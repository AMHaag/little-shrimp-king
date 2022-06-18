const fs = require("fs");
const path = require("path");
const express = require("express");
const { db } = require("./db/db.json");

// server variables //
const PORT = process.env.PORT || 1217;
const app = express();

//* Data Parsing *//
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//* Query and Param filtering *//

//* GET routes *//
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});


//* POST routes *//

//* Port Listener *//
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
