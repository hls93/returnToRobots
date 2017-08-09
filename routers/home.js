const express = require('express');
const routes = express.Router();
const db = require('../db');


routes.get('/', (req, res) => {
  let coll = db.get().collection('userDirectory');

  coll.find({}).toArray((err, userDirectory) => {
    res.render('home', {users: userDirectory})
  })
})

routes.get('/login', function(req, res){
  res.render('login')
})

routes.get('/looking', (req, res) => {
  let coll = db.get().collection('userDirectory');

  coll.find({job: null}).toArray((err, userDirectory) => {
    res.render('looking', {users: userDirectory})
  })
})

routes.get('/working', (req, res) => {
  let coll = db.get().collection('userDirectory');

  coll.find({job: {$nin: [null]}}).toArray((err, userDirectory) => {
    res.render('working', {users: userDirectory})
  })
})

routes.get('/:user', function(req, res){
  let coll = db.get().collection('userDirectory');
  let person = req.params.user;

  coll.find({username: person}).toArray((err, userDirectory) => {
    res.render('user', {users: userDirectory})
  })
});






module.exports = routes;
