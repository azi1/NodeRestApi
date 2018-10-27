
require('../config/config');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID}  = require('mongodb');
const _ = require('lodash');
const { todo } = require('./models/todo');
const {user} = require('./models/user');
const {authenticate} = require('./Authenticate/authenticate');


var app = express();
app.use(bodyParser.json()); // middle ware to send and accept json data

var port = process.env.PORT;


app.post('/todo', authenticate, (req,res)=>{
var newTodo = new todo({
    text: req.body.text,
    creator: req.user._id,
});
newTodo.save().then((doc)=> {
    res.send(doc);
},(err) => {
    res.status(400).send(err);
});
});

app.get('/todos', authenticate, (req, res) => {
   todo.find({
       creator: req.user._id
   }).then((todos) => {
    res.send({todos});
   }, (err) => {
    res.status(400).send();
   });
});

app.get('/todo/:id', authenticate,(req,res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) { 
        console.log('is not valid');
       return res.status(404).send({message: "not a valid id"})
    }
    todo.findOne({
        _id: id,
        creator: req.user._id
    
    }).then((todo) =>
    {   
        if(!todo) {
          return res.status(404).send({});

        }

        res.send({todo});
    }).catch((e)=> {
        res.status(400).send({message: 'user not found'});
    });
});

app.delete('/todo/:id', authenticate, (req, res) => {
    if(!ObjectID.isValid(req.params.id)) {

      return  res.status(404).send({message: "ID is not valid"});
    }
    todo.findOneAndRemove({
        _id: req.params.id,
        creator: req.user._id
    
    }).then((todo) => {
        if(todo) {       
           return  res.send({todo});
         }
         res.status(404).send();

    }).catch((err) => {
        res.status(404).send({message: "ID nOT FOUND"})
    })

});
app.patch('/todo/:id', authenticate, async(req,res) =>{
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
    try{

    const updatedTodo = await todo.findOneAndUpdate({
        _id: id,
        creator: req.user._id
    }, {$set: body}, {new: true});

  
        if(!updatedTodo) {
            res.send({message:"to do not found"});
        }
        res.send({updatedTodo})
    } catch(e){
        res.status(400).send(e);
    }
  

});


// app.patch('/todo/:id', authenticate, (req,res) =>{
//     var id = req.params.id;
//     var body = _.pick(req.body, ['text', 'completed']);
//     if(!ObjectID.isValid(id)) {
//       return res.send({message:"id not valid"});
//     }
//     if(_.isBoolean(body.completed) && body.completed) {
//         body.completedAt = new Date().getTime();
//     }
//     else {
//         body.completed = false;
//         body.completedAt = null
//     }

//     todo.findOneAndUpdate({
//         _id: id,
//         creator: req.user._id
//     }, {$set: body}, {new: true}).then((updatedTodo)=>{
    
//         if(!updatedTodo) {
//             res.send({message:"to do not found"});
//         }
//         res.send({updatedTodo})
//     }).catch((e) => {
//         res.status(400).send(e);
//     });

// });

app.post('/addUser', async(req, res) => {
    var body = _.pick(req.body,['email', 'password']);
    var newUser = new user(body);
    try{
    await newUser.save();
    const token  = newUser.generateAuthToken();
     res.header('x-auth', token).send(newUser);
    } catch(e) {
        res.status(400).send(e);
    }

});

// app.post('/addUser', (req, res) => {
//     var body = _.pick(req.body,['email', 'password']);
//     var newUser = new user(body);
//     newUser.save().then(() => {
//         return newUser.generateAuthToken()
//     }).then((token)=>{
//         res.header('x-auth', token).send(newUser)
//     }).catch((err) => {
//         res.status(400).send(err)
//     });

// });


app.get('/users/me',authenticate,(req, res) => {
res.send(req.user);
});

app.post('/user/login', async(req,res) => {
    var body = _.pick(req.body,['email', 'password']);
    try {
    const data  =  await user.userLogin(body.email,body.password);
    const token = await data.generateAuthToken();
    res.header('x-auth', token).send(data);
    } catch(e) {
        res.status(400).send();
    }

});

// app.post('/user/login',(req,res) => {
//     var body = _.pick(req.body,['email', 'password']);
//     user.userLogin(body.email,body.password).then((data) =>{
//        return data.generateAuthToken().then((token) => {
//             res.header('x-auth', token).send(data);
//         });
//     }).catch((e)=>{
//         res.status(400).send();
// });
// });

app.delete('/user/me/delete',authenticate, async(req,res) => {
   try{
    await req.user.removeToken(req.token);
    res.send();
   } catch(e) {
    res.status(400).send();
   }
});



// app.delete('/user/me/delete',authenticate, (req,res) => {
//     req.user.removeToken(req.token).then(() => {
//         res.send();
//     }).catch((e) =>{
//         res.status(400).send();
//     });

// });
  
app.listen(port,()=>{
    console.log(`listeining to ${port}`);
});

module.exports = { app };
