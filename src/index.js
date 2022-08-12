const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

 //Midleware para testar se o usuário do qual se está tentando executar alguma ação existe.
function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers;

  const user = users.find(item => item.username == username)

  if(!user){
    return response.status(400).json("User is not registered");
  }else{
    request.user = user;
  }

  return next();
}

function checksCreateTodosUserAvailability(request, response, next){
  const { user } = request;

  const leng = user.todos.length;

  if(user.pro == true || leng < 10){
    return next()
  }else{
    return response.send(400).json("You reached your limit with a free account")
  }
}

//Função para criação de um usuário
app.post('/users', (request, response) => {
  const {name, username} = request.body;
  
  const existUser = users.some((element) => element.username == username);

  if(!existUser){
    const user = {
      id: uuidv4(),
      name,
      username,
      pro: false,
      todos: []
    }

    users.push(user);
    return response.status(201).json(user);
  
  }else{
    
    return response.status(400).json("User already exists!");
  }

});

//Função para retornar os to-dos registrados para um determinado usuário 
app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request;

  return response.status(200).json(user.todos);
});

//Criação de um to-do para um determinado usuário
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

  return response.status(201).json(newTodo);
});

//Alterando um to-do em específico de um usuário determinado
app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request;
  const {id} = request.params; //Pegando o parametro passado na rota
  const {title, deadline} = request.body;

  const toDoObject = user.todos.find((element) => element.id == id);

  if(!toDoObject){
    response.status(400).json("To-do is not resgistred");
  }else{
    toDoObject.title = title;
    toDoObject.deadline = deadline;  
  }

    return response.status(200).json(toDoObject);
});

//Alterando um campo em específico do to-do, setando o done para true
app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const toDoDone = user.todos.find((element) => element.id == id);

  if(!toDoDone){
    return response.status(400).json("To-do is not resgistred");
  }else{
    toDoDone.done = true;
    return response.status(200).json("Task concluded");
  }

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const toDoDelete = user.todos.find((element)=>element.id === id);

  if(!toDoDelete){
    return response.status(400).json("To-Do is not registred");
  }else{
    user.todos.splice(user.todos.indexOf(toDoDelete), 1);
    return response.status(200).send();
  }

});

module.exports = app;