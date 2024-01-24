const dbPool = require("../database/sqlConnection");

async function addProduct(req, res) {
  try {
    console.log("files: ", req.files);

    // Extracting relative path for thumbnail
    let thumbnailPath = req.files.thumbnail[0].path;
    thumbnailPath = thumbnailPath.replace("public/", "");

    const idseller = req.params.id;
    let {
      name,
      category,
      subcategory,
      priceUP,
      priceLOW,
      brand,
      quantity,
      stock,
      description,
    } = req.body;

    // Basic input validation
    if (!idseller || !name || !category || !subcategory || !priceUP || !priceLOW || !brand || !quantity || !stock || !description) {
      return res.status(400).send("Missing required input values.");
    }

    // Extracting relative paths for productImage
    const productImageValues = req.files.productImage.map((imageObject) =>
      imageObject.path.replace("public/", "")
    );

    const sql = "INSERT INTO product (idseller, name, category, subcategory, thumbnail, productImage, priceUP, priceLOW, brand, quantity, stock, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const productImageValue = JSON.stringify(productImageValues);

    const values = [
      idseller,
      name,
      category,
      subcategory,
      thumbnailPath,
      productImageValue,
      priceUP,
      priceLOW,
      brand,
      quantity,
      stock,
      description
    ];

    // Perform the database query
    await dbPool.query(sql, values);

    console.log("Product inserted successfully");
    res.send("Product inserted successfully");
  } catch (error) {
    console.error("Error inserting into product:", error);
    res.status(500).send("Internal Server Error");
  }
}



async function updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const {
        name,
        category,
        subcategory,
        priceUP,
        priceLOW,
        brand,
        quantity,
        stock,
        description,
      } = req.body;
      console.log(req.files);
      const thumbnail = req.files.thumbnail && req.files.thumbnail[0] ? req.files.thumbnail[0] : null;
      const productImage = req.files.productImage || [];
  
      // Check if the product exists
      const existingProduct = await dbPool.query('SELECT * FROM product WHERE idproduct = ?', [productId]);
  
      if (existingProduct.length === 0) {
        return res.status(404).send("Product not found");
      }
  
      // Build the dynamic update statement
      const updateFields = [];
      const values = [];
  
      if (name) {
        updateFields.push("name = ?");
        values.push(name);
      }
  
      if (category) {
        updateFields.push("category = ?");
        values.push(category);
      }
  
      if (subcategory) {
        updateFields.push("subcategory = ?");
        values.push(subcategory);
      }
  
      if (thumbnail) {
        // Trim "public/" from the thumbnail path
        let thumbnailPath = thumbnail.path.replace("public/", "");
        updateFields.push("thumbnail = ?");
        values.push(thumbnailPath);
      }
  
      if (priceUP) {
        updateFields.push("priceUP = ?");
        values.push(priceUP);
      }
  
      if (priceLOW) {
        updateFields.push("priceLOW = ?");
        values.push(priceLOW);
      }
  
      if (brand) {
        updateFields.push("brand = ?");
        values.push(brand);
      }
  
      if (quantity) {
        updateFields.push("quantity = ?");
        values.push(quantity);
      }
  
      if (stock) {
        updateFields.push("stock = ?");
        values.push(stock);
      }
  
      if (description) {
        updateFields.push("description = ?");
        values.push(description);
      }
  
      if (productImage.length > 0) {
        // Assuming productImage is an array of file paths
        const productImageValues = productImage.map((imagePath) =>
          imagePath.path.replace("public/", "")
        );
        updateFields.push("productImage = ?");
        values.push(JSON.stringify(productImageValues));
      }
  
      const updateStatement = `UPDATE product SET ${updateFields.join(", ")} WHERE idproduct = ?`;
  
      // Add productId to the values array
      values.push(productId);
  
      // Perform the database query
     const data =  await dbPool.query(updateStatement, values);
  
      console.log("Product updated successfully");
      res.status(200).json({"Product updated successfully": data});
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).send("Internal Server Error");
    }
  }



async function deleteProduct(req,res){
    res.send('good');
}  
  
module.exports = { addProduct, updateProduct, deleteProduct };
