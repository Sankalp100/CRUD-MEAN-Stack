const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db');
var employeeController = require('./controllerss/employeeController');

var app = express();
app.use(bodyParser.json());

app.listen(3000, () => console.log('Sever started at port : 3000'));

app.use('/employees', employeeController);