var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var { todo } = require('./models/todo');
var {user} = require('./models/user');


var app = express();
app.use(bodyParser.json()); // middle ware to send and accept json data



app.post('/todo',(req,res)=>{
var newTodo = new todo({
    text: req.body.text,
});
newTodo.save().then((doc)=> {
    res.send(doc);
},(err) => {
    res.status(400).send(err);
})
})



app.listen(3000,()=>{
    console.log("listeining to 3000");
});

module.exports = { app };
