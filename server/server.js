var express = require('express');
var bodyParser = require('body-parser')

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
const {ObjectId} = require('mongodb');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then( (doc)=> {
    res.send(doc);
  }, (err) => {
    res.send(err);
  });

});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos})
  }, (err) => {
    res.send(err);
  });
});

//Get /todos/12345
app.get('/todos/:id', (req, res) => {

  var id = req.params.id;

  if(!ObjectId.isValid(id))
  {
      return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if(todo)
    {
      return res.send({todo});
    }

  res.status(404).send();

  }, (err) => {
    res.status(400).send();
  });

});

app.listen(3000, () => {
  console.log('Started on port 3000');
});


module.exports = {
  app
}
