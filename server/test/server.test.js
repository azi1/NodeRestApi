const expect  = require('expect');
const request =  require('supertest');


const {app} = require('../../server/server');
const {todo} = require('../models/todo');

const todos = [
    {
        text: "first todo",
    },
    {
        text: "second todo",
    }
]

beforeEach((done)=>{
    todo.remove({}).then(()=>{
       return todo.insertMany(todos).then(() => done());
     

    });
});

describe('post call /todo', ()=>{
 it('todo post call', (done)=>{
     var text = 'todo lets todo';
    request(app)
    .post('/todo')
    .send({text})
    .expect(200)
    .expect((res)=>{
       expect(res.body.text).toBe(text);
    })
    .end((err, res) => {
        if(err) {
            return done(err);
        }
        todo.find({text}).then((todos)=> {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
        }).catch((e)=> done(e))

    })
 })

});

describe('get all todos /todos', () =>{
    it('get all todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=> {
            console.log(res.body);
            expect(res.body.todos.length).toBe(2);
           
        })
        .end(done);
    })
})