var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID}  = require('mongodb');
var { todo } = require('./models/todo');
var {user} = require('./models/user');


var app = express();
app.use(bodyParser.json()); // middle ware to send and accept json data

var port = process.env.PORT || 3000;


app.post('/todo',(req,res)=>{
var newTodo = new todo({
    text: req.body.text,
});
newTodo.save().then((doc)=> {
    res.send(doc);
},(err) => {
    res.status(400).send(err);
});
});

app.get('/todos', (req, res) => {
   todo.find().then((todos) => {
    res.send({todos});
   }, (err) => {
    res.status(400).send();
   });
});

app.get('/todo/:id',(req,res) => {
    var id = req.params.id;
    console.log(id, ObjectID.isValid(id))
    if(!ObjectID.isValid(id)) { 
        console.log('is not valid');
       return res.status(404).send({message: "not a valid id"})
    }
    todo.findById(req.params.id).then((todo) =>
    {   
        if(!todo) {
            res.status(404).send({});

        }

        res.send({todo});
    }).catch((e)=> {
        res.status(400).send({message: 'user not found'});
    });
});

  
app.listen(port,()=>{
    console.log(`listeining to ${port}`);
});

module.exports = { app };
