var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
});

// var newTodo = new Todo({
//   text: 'Cook dinner'
// });
//
// newTodo.save().then((doc)=> {
//   console.log('Saved todo', doc);
// }, (err) => {
//   console.log('Unable to save todo');
// });
//
//
// var otherTodo = new Todo({
//   text: 'Feed the cat',
//   completed: true,
//   completedAt: 123
// });
//
// otherTodo.save().then((doc)=> {
//   console.log('Saved todo', doc);
// }, (err) => {
//   console.log('Unable to save todo');
// });

var newUser = new User({
  email: 'test@test.com'
});

newUser.save().then((doc)=> {
  console.log('Saved user', doc);
}, (err) => {
  console.log('Unable to save user');
});
