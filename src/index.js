const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers;

  const user = users.find(item => item.username == username)

  if(!user){
    return response.status(400).json("User is not registered");
  }else{
    request.user = user;
  }

  next();
}

app.post('/users', (request, response) => {
  const {name, username} = request.body;
  
  const existUser = users.some((element) => element.username == username);

  if(!existUser){
    const user = {
      id: uuidv4(),
      name,
      username,
      todos:[]
    }

    users.push(user);
    response.status(201).json(user);
  
  }else{
    
    response.status(400).json("User already exists!");

  }

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request;

  response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request;

  const { title, deadline } = request.body;

  newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(newTodo);

  response.status(201).json(newTodo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.query;
  const {title, deadline} = request.body;



  const toDoObject = user.todos.find((element) => element.id == id);
  
  if(!toDoObject){
    response.status(400).json("To-do is not resgistred");
  }else{
    toDoObject.title = title;
    toDoObject.deadline = deadline;  
  }

    response.status(200).json(toDoObject);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;