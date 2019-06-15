const express = require("express");
const app = express();

const {mongoose} = require('./db/mongoose');

const bodyParser = require('body-parser');

app.use(bodyParser.json());

// Load in the mongoose models
const { List, Task } = require("./db/Models/index");    
   
// Route Handlers

//List Routes

app.get('/lists', (req, res) => {
    List.find({}).then((lists) => {
        res.send(lists);
    }).catch((e) => {
        res.send(e);
    });
})

app.post('/lists', (req, res) => {
    // We want to create a new list and return the new list document back to the user (which includes the id)
    // The list information (fields) will be passed in via the JSON request body
    let title = req.body.title;

    let newList = new List({
        title,
        _userId: req.user_id
    });
    newList.save().then((listDoc) => {
        // the full list document is returned (incl. id)
        res.send(listDoc);
    })
});

app.patch('/lists/:id', (req, res) => {

})

app.delete('/lists/:id', (req,res) => {

})

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})

