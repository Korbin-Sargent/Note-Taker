// const { randomUUID } = require("crypto");
const express = require("express");
const fs = require("fs");
const util = require("util");
const app = express();
const PORT = process.env.PORT || 3001;
const path = require("path");
// const noteData = require("./db.json")
const uuid = require("./helpers/uuid");

const readFromFile = util.promisify(fs.readFile);

//sets up server to handle requests coming in the way we want them to
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//gives access to public folder
app.use(express.static("public"));

//define different routes
//Route sends file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

// /**
//  *  Function to write data to the JSON file given a destination and some content
//  *  @param {string} destination The file you want to write to.
//  *  @param {object} content The content you want to write to the file.
//  *  @returns {void} Nothing
//  */

app.get("/api/notes", (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile("./db.json").then((data) => res.json(JSON.parse(data)));
});
//define routes using (network tab, inside index.js)

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

const readAndAppend = (content, file) => {
  fs.readFile(file, "utf8", (err, data) => {
    console.log(data);
    if (err) {
      console.error(err);
    } else {
      const parsedData = JSON.parse(data);
      console.log(parsedData);
      parsedData.push(content);
      writeToFile(file, parsedData);
    }
  });
};

//responds to saveNotes POST request
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };
    readAndAppend(newNote, "./db.json");
    res.json(`Note added successfully 🚀`);
  } else {
    res.error("Error in adding tip");
  }
});

app.listen(PORT, () => {
  console.log("server is listening on port", PORT);
});

// app.get("/api/notes/:id", (req,res) => {
// console.info(`${req.method} request received to delete note`);
//   readFromFile('./db.json').then((data) => res.json(JSON.parse(data)));

// });

app.delete("/api/notes/:id", function (req, res) {
  fs.readFile("./db.json", "utf8", (err, data) => {
    if (err) {
      //sends back to front end, displays in network tab
      res.sendStatus(500);
      console.error(err);
    }
    var notes = JSON.parse(data);
    console.log(notes);
    const noteID = notes.findIndex((note) => note.id === req.params.id);
    notes.splice(noteID, 1);
    writeToFile("./db.json", notes);
    console.log("delete note successful");
    res.sendStatus(200);
  });
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

//read from db file (get an array), write to the file for post,
//define routes as needed to update json file
//don't need to modify package
