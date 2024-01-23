const express = require('express');
const route = express.Router();




const {registerSeller, loginSeller} = require('../controllers/authenticate')

route.post('/register' ,registerSeller);
route.get('/login', loginSeller );









module.exports = route;