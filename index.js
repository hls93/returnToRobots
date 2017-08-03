const db = require('./db');
const express = require('express');
const exphbs =  require('express-handlebars');
const homeRoutes = require('./routers/home');

const app = express();

app.use(express.static('public'));

let url = 'mongodb://localhost:27017/newdb';

app.engine('handlebars', exphbs());
app.set('views', './views');
app.set('view engine', 'handlebars');


app.use('/', homeRoutes);


db.connect(url, (err, connection) => {
  if (!err) console.log('connected to mongo');

  app.listen(3000, () => console.log('up and running'));
});
