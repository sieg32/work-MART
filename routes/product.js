const express = require('express');
const route = express.Router();
const {uploadProductImage} = require('../multer/multerConfig');


const addProduct = require('../controllers/products')

route.post('/addProduct/:id',uploadProductImage.fields([{name:'thumbnail', maxCount:1}, {name: 'productImage', maxCount: 5}]), addProduct);


module.exports = route;