const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {ObjectId} = require('mongodb');

//var id = '6a4c285e5f51d50949c3fe015';

var id = '5a46d2da6e7408b03d6d7ee8';

if(!ObjectId.isValid(id))
{
    return console.log('Invalid Id');
}


User.findById(id).then((user) => {
    if(!user)
    {
        return console.log('Id not found');
    }
    console.log('User', user)
}).catch((e) => console.log(e)); 

// Todo.find({
//     _id:id
// }).then((todos) => {
//     console.log('Todos', todos)
// });

// Todo.findOne({
//     _id:id
// }).then((todo) => {
//     console.log('Todo', todo)
// });

// Todo.findById(id).then((todo) => {
//     if(!todo)
//     {
//         return console.log('Id not found');
//     }
//     console.log('Todo', todo)
// }).catch((e) => console.log(e)); 