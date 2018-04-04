var express = require('express');
var bodyParser = require('body-parser')

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
const {ObjectId} = require('mongodb');

var app = express();
const port = process.env.PORT || 3000;

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

//Delete /todos/12345
app.delete('/todos/:id', (req, res) => {

  var id = req.params.id;

  if(!ObjectId.isValid(id))
  {
      return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if(todo)
    {
      return res.send({todo});
    }

  res.status(404).send();

  }).catch((er) => {
    res.status(400).send();
  });

});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});


module.exports = {
  app
}
