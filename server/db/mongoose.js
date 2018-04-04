var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let db = {
  localhost: 'mongodb://localhost:27017/TodoApp',
  mlab: 'mongodb://appUser:TestPassword@ds233739.mlab.com:33739/todo-app-api'
};

mongoose.connect( db.localhost || db.mlab);

module.exports = {
  mongoose
}
