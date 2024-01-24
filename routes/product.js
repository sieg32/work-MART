const express = require("express");
const route = express.Router();
const { uploadProductImage } = require("../multer/multerConfig");

const { addProduct, updateProduct, deleteProduct, getProductOfSeller, getProduct } = require("../controllers/products");

route.post(
  "/addProduct/:id",
  uploadProductImage.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "productImage", maxCount: 5 },
  ]),
  addProduct
);

route.patch(
  "/updateProduct/:id",
  uploadProductImage.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "productImage", maxCount: 5 },
  ]),
  updateProduct
);

route.delete('/deleteProduct/:id',deleteProduct);

route.get('/user/:id', getProductOfSeller);

route.get('/:id', getProduct);

module.exports = route;
