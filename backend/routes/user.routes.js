const express = require('express');
const route = express.Router();
const isAuth = require('../middlewares/isAuth')
const { getCurrentUser, editProfile, getOtherUsers, search } = require('../controllers/user.controllers');
const upload = require('../middlewares/multer');

route.get('/current',isAuth, getCurrentUser)
route.put('/profile',isAuth,upload.single('image'), editProfile)
route.get('/others', isAuth, getOtherUsers)
route.get('/search', isAuth,search)

module.exports = route;