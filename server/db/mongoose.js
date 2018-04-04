var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let db = {
  localhost: 'mongodb://localhost:27017/TodoApp',
  mlab: 'mongodb://appUser:TestPassword@ds149268.mlab.com:49268/todoapp'
};

mongoose.connect( db.mlab);

module.exports = {
  mongoose
}
