const express = require("express");
const route = express.Router();
const { uploadProductImage } = require("../multer/multerConfig");

const { addProduct, updateProduct, deleteProduct, getProductOfSeller, getProductById } = require("../controllers/products");
const authorize = require('../middlewares/authorization');
route.post(
  "/:id",[authorize,
  uploadProductImage.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "productImage", maxCount: 5 },
  ]),
  addProduct]
);

route.patch(
  "/:id",[authorize,
  uploadProductImage.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "productImage", maxCount: 5 },
  ]),
  updateProduct]
);

route.delete('/:id',authorize,deleteProduct);

route.get('/user/:id', getProductOfSeller);

route.get('/:id', getProductById);

module.exports = route;
