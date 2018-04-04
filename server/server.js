require('./config/config');

const express = require('express');
const bodyParser = require('body-parser')
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {ObjectId} = require('mongodb');

var app = express();
const port = process.env.PORT;

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

//Patch /todos/12345
app.patch('/todos/:id', (req, res) => {

  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectId.isValid(id))
  {
      return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed)
  {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
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
