const {ObjectID} = require('mongodb');

const {todo} = require('../server/models/todo');


var id = "5bbb754b94d9a59131fcd68a"
// todo.find({
//     _id: id
// }).then((res)=> console.log(res))


// todo.findOne({
//     completed: false
// }).then((res) => console.log(res))

if(ObjectID.isValid(id)) {
todo.findById(id).then((res) => {
    console.log(res,"res")

}).catch((err) => {console.log('error')});
}