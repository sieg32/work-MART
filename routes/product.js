const express = require("express");
const route = express.Router();
const { uploadProductImage } = require("../multer/multerConfig");

const { addProduct, updateProduct, deleteProduct } = require("../controllers/products");

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

module.exports = route;
