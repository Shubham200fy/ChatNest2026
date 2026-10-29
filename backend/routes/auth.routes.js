const express = require('express');
const { signUp, login, logOut } = require('../controllers/auth.controllers');
const route = express.Router();

route.post('/signup', signUp)
route.post('/login', login)
route.get('/logout',logOut)

module.exports = route;