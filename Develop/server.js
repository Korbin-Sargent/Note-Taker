const express = require("express");
const app = express();
const PORT = 3001;
const path = require("path");

//sets up server to handle requests coming in the way we want them to
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//gives access to public folder
app.use(express.static("public"));

//define different routes
//Route sends file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "notes.html"))
})

app.ge("/api/notes")

//define routes using (network tab, inside index.js)

app.listen(PORT, () => {
    console.log("server is listening on port", PORT)
});

//read from db file (get an array), write to the file for post,
//define routes as needed to update json file
//don't need to modify package 