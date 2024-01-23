const express = require('express');
const route = express.Router();
const {uploadProductImage} = require('../multer/multerConfig');
const fileErrorHandler = require('../middlewares/fileErrorHandler');

const {registerSeller, loginSeller} = require('../controllers/authenticate')

route.post('/register' ,registerSeller);
route.get('/login', loginSeller );


route.use(fileErrorHandler);




module.exports = route;