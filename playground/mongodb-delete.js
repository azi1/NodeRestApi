const MongoClient = require('mongodb').MongoClient;


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

if(err) {
   return console.log('unable to connect');
}

// db.collection('Todos').deleteMany({text: 'eat lunch'}).then((res) => {
//     console.log(res);
// })

// db.collection('Todos').deleteOne({text: 'eat lunch'}).then((res) => {
//     console.log(res);
// })
// db.collection('Todos').findOneAndDelete({completed: false}).then((res)=> {
//     console.log(res)
// });

db.collection('Todos').deleteMany({text: 'eat lunch'}).then((res)=> {
     console.log(res)
 });
db.close();
})