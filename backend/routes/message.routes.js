const express = require('express');
const route = express.Router();
const isAuth = require('../middlewares/isAuth')
const upload = require('../middlewares/multer');
const { sendMessage, getMessages } = require('../controllers/message.controllers');

route.post('/send/:receiver',isAuth,upload.single('image'), sendMessage)
route.get('/get/:receiver',isAuth,getMessages)
module.exports = route;