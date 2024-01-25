const express = require("express");
const { getUser , updateUser} = require("../controllers/userController");
const authorize = require('../middlewares/authorization')
const route = express.Router();


route.get('/:id', getUser );



route.post('/:id', authorize, updateUser);






module.exports = route;