const express = require("express");
const { getUser , updateUser, updateProfile} = require("../controllers/userController");
const authorize = require('../middlewares/authorization')
const { uploadProfile } = require("../multer/multerConfig");
const route = express.Router();


route.get('/:id', getUser );



route.post('/:id', authorize, updateUser);

route.put('/:id/profile', [authorize,uploadProfile.single('profile'), updateProfile]);






module.exports = route;