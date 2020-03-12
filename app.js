const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = 3000;
const app = express();

const MongoClient = require('mongodb').MongoClient;
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
