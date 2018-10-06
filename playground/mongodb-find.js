const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

if(err) {
   return console.log('unable to connect');
}

db.collection('Todos').find(
    {_id: new ObjectID('5bb8e4045d3a70298f2907f7')})
    
    .toArray().then((doc) =>{

    console.log(JSON.stringify(doc))
},err => {console.log(err)})



db.close();
})