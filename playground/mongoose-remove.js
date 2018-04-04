const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {ObjectId} = require('mongodb');


// Todo.remove({}).then((result) => {
//     console.log(result);
// })

Todo.findByIdAndRemove('12345').then((todo)=> {
    console.log(todo);
});