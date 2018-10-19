const {ObjectID} = require('mongodb');
const {todo} = require('../models/todo');
const {user} = require('../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: "azher_z@hotmaul.com",
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token:jwt.sign({'_id': userOneId ,'access':'auth'}, process.env.JWT_KEY).toString(), 
    }]
}, {
    _id: userTwoId,
    email: "azher1_z@hotmaul.com",
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token:jwt.sign({'_id': userTwoId ,'access':'auth'}, process.env.JWT_KEY).toString(), 
    }]    
}]



const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    creator: userOneId
  }, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333,
    creator: userTwoId

  }];


  const populateTodos = (done) => {
    todo.remove({}).then(() => {
        return todo.insertMany(todos);
      }).then(() => done());
  };

  const populateUsers = (done) => {
      user.remove({}).then(() => {
          var userOne = new user(users[0]).save();
          var userTwo  = new user(users[1]).save();
          return Promise.all([userOne, userTwo]);
      }).then(() => done());
    }

  module.exports = {
      todos,
      populateTodos,
      populateUsers,
      users
  }