const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = 3000;
const app = express();
// require('bootstrap');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const assert = require('assert');

// connection url
const url = 'mongodb://localhost:27017';

// db name
const dbName = 'todoapp';

// create new mongo client
const client = new MongoClient(url, { useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname + '/public')));

// VIEW SETUP
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Connect to mongodb
client.connect((err) => {
  assert.equal(null, err);
  console.log('MongoDB Connected Successfully...');
  const db = client.db(dbName);

  Todos = db.collection('todos');
  app.listen(port, () => {
    console.log(`Server Starts on ${port}`);
  });
})

app.get('/', (req, res, next) => {
  Todos.find({}).toArray((err, todos) => {
    if (err) {
      console.log(err);
    }
    console.log(todos);
    res.render('index', {todos: todos});
  })
});

app.post('/todo/add', (req, res, next) => {
  // CREATE TODO
  const todo = {
    task: req.body.todo,
    date: req.body.date
  };

  // INSERT TODO
  Todos.insertOne(todo, (err, result) => {
    if (err) {
      throw err;
      console.log(err);
    }
    console.log('Todo Added');
    res.redirect('/');
  })
});

app.delete('/todo/delete/:id', (req, res, next) => {
  const query = {_id: ObjectId(req.params.id)};
  Todos.deleteOne(query, (err, response) => {
    if (err) {
      return console.log(err);
    }
    console.log('Todo removed');
    res.send(200);
  })
});

app.get('/todo/edit/:id', (req, res, next) => {
  const query = {_id: ObjectId(req.params.id)};
  Todos.find(query).next((err, todo) => {
    if (err) {
      throw err
      console.log(err);
    }
    res.render('edit', { todo: todo });
  })
});

app.post('/todo/edit/:id', (req, res, next) => {
  const query = {_id: ObjectId(req.params.id)};
  const todo = {
    task: req.body.todo,
    date: req.body.date
  };

  Todos.updateOne(query, {$set: todo}, (err, result) => {
    if (err) {
      throw err;
      console.log(err);
    }
    console.log('Todo Updated');
    res.redirect('/');
  })
});
