const {MongoClient, ObjectID} = require('mongodb');


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

// db.collection('Todos').deleteMany({text: 'eat lunch'}).then((res)=> {
//      console.log(res)
//  });

// db.collection('Todos').findOneAndUpdate(
//     {_id: new ObjectID('5bb90e9f98f22b292f0859ae')},
//     {
//       $set:{
//           completed: true
//       }  
//     },{
//         returnOriginal: false
//     }
// ).then((res)=> console.log(res));


db.collection('Users').findOneAndUpdate(
    {_id: new ObjectID('5bb8e4fc5a516629955e005b')},
    {
      $set:{
          completed: true
      },
      $inc: {
          age: 5
      }

    },{
        returnOriginal: false
    }
).then((res)=> console.log(res));
db.close();
})