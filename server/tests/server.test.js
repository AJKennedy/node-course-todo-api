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
  text: 'second test tedo',
  completed: true,
  completedAt: '12345'
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

describe('DELETE /todos/:id', () => {
  it('should delete todo with valid id', (done)=> {
    var hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if(err)
        {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((err) => done(err));
      });
      
     
  });

  it('should return not found for todo with invalid id', (done)=> {
    request(app)
      .delete('/todos/123')
      .expect(404)
      .expect((res) => {
        expect(res.body.todo).toBe();
      })
      .end(done);
  });

  it('should return not found for todo when id not found', (done)=> {
    var hexId = new ObjectId().toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .expect((res) => {
        expect(res.body.todo).toBe();
      })
      .end(done);
  
  });
})

describe('Patch /todos/:id', () => {
  it('should update todo', (done)=> {
    var hexId = todos[0]._id.toHexString();
    var completed = true;
    var text = "UpdatedText";

    request(app)
      .patch(`/todos/${hexId}`)
      .send({completed, text})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completedAt).toExist();
      })
      .end(done); 
  });

  it('it should clear completedAt when todo is not completed', (done)=> {
    var hexId = todos[1]._id.toHexString();
    var completed = false;

    request(app)
      .patch(`/todos/${hexId}`)
      .send({completed})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done); 
    });
})
