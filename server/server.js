
require('../config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID}  = require('mongodb');
const _ = require('lodash');
const { todo } = require('./models/todo');
const {user} = require('./models/user');


var app = express();
app.use(bodyParser.json()); // middle ware to send and accept json data

var port = process.env.PORT;


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

app.delete('/todo/:id',(req, res) => {
    if(!ObjectID.isValid(req.params.id)) {

      return  res.status(404).send({message: "ID is not valid"});
    }
    todo.findByIdAndRemove(req.params.id).then((todo) => {
        if(todo) {       
           return  res.send({todo});
         }
         res.status(404).send();

    }).catch((err) => {
        res.status(404).send({message: "ID nOT FOUND"})
    })

});

app.patch('/todo/:id', (req,res) =>{
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if(!ObjectID.isValid(id)) {
      return res.send({message:"id not valid"});
    }
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }
    else {
        body.completed = false;
        body.completedAt = null
    }

    todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((updatedTodo)=>{
    
        if(!updatedTodo) {
            res.send({message:"to do not found"});
        }
        res.send({updatedTodo})
    }).catch((e) => {
        res.status(400).send(e);
    });

});
  
app.listen(port,()=>{
    console.log(`listeining to ${port}`);
});

module.exports = { app };
