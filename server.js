const express = require('express');
const path = require('path')
const PORT = process.env.PORT || 3001;
const fs = require('fs');
const app = express();
const uuid = require('./helpers/uuid');
const notes = require('./db/db.json')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
const noteFile = './db/db.json'

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);
app.get('/api/notes', (req, res) => {
  fs.readFile(noteFile, 'utf8', (err, data) => {
    console.log(data)
    if (err) {
      console.error('Error reading notes:', err);
      res.status(500).json('Error reading notes');
      return;
    }

    else {

     const parsedNotes = JSON.parse(data);
      res.json(parsedNotes);
    } 
  });
});

app.delete("/api/notes/:id", function (req, res) {
  let noteFile = path.join(__dirname, "/db/db.json");
  for (let i = 0; i < notes.length; i++) {
      if (notes[i].id == req.params.id) { 
          notes.splice(i, 1);
          break;
      }
  }
  fs.writeFileSync(noteFile, JSON.stringify(notes), function (err) {
      if (err) {
          return console.log(err);
      } else {
          console.log("The note was deleted.");
      }
  });
  res.json(notes);
});

app.get('/api/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  res.status(200).json(notes);
});


app.post('/api/notes', (req, res) => {

  console.info(`${req.method} request received to add a note`);
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title, 
      text,
      id: uuid(),
    };
    notes.push(newNote)
    const noteString = JSON.stringify(notes, null, 2);
    fs.writeFile(`./db/db.json`, noteString, (err) =>
      err
        ? console.error(err)
        : console.log(
            `Note for ${noteString} has been written to JSON file`
          )
    );
    const response = {
      status: 'success',
      body: newNote,
    };
    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
});
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);