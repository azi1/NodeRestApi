const  {MongoClient} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

if(err) {
   return console.log('unable to connect');
}
console.log('connected to mongodb');
db.collection('Todos').insertOne({
    text: "something to do",
    completed: false
}, (err,res) => {
    if(err) {
       return console.log(err);
    }
    console.log(JSON.stringify(res.ops))
})

// db.collection('Users').insertOne({
//     name: "Azhar",
//     age: "24"
// }, (err,res) => {
//     if(err) {
//        return console.log(err);
//     }
//     console.log(JSON.stringify(res.ops))
// })

db.close();
})