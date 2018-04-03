const expect = require('expect');
const request = require('supertest');

const {ObjectId} = require('mongodb')
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectId(),
  text: 'first test todo'
},{
  _id: new ObjectId(),
  text: 'second test tedo'
}];



beforeEach((done) => {
  Todo.remove({}).then(() => {
  return Todo.insertMany(todos);
}).then(()=>done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
      var text = 'Test todo text';

      request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
          expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
          if(err)
          {
            return done(err);
          }

          Todo.find({text}).then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          }).catch((err) => done(err));
        });
  });

  it('should not create a new todo with invalid body data', (done) => {
      request(app)
        .post('/todos')
        .send({})
        .expect(400)


          Todo.find().then((todos) => {
            expect(todos.length).toBe(2);
            done();
          }).catch((err) => done(err));
      });
});

describe('GET /todos', () => {
  it('should get all todos', (done)=> {
    request(app)
      .get('/todos/')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
})

describe('GET /todos/:id', () => {
  it('should get todo with valid id', (done)=> {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return not found for todo with invalid id', (done)=> {
    request(app)
      .get('/todos/123')
      .expect(404)
      .expect((res) => {
        expect(res.body.todo).toBe();
      })
      .end(done);
  });

  it('should return not found for todo when id not found', (done)=> {
    var hexId = new ObjectId().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .expect((res) => {
        expect(res.body.todo).toBe();
      })
      .end(done);
  });
})
