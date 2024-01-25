
const dbPool = require("../database/sqlConnection");
const fsPromises = require('fs').promises;



let workdir = __dirname;
const indexTemp = workdir.lastIndexOf('/');
workdir = workdir.substring(0,indexTemp);


async function addProduct(req, res) {
  try {
    if (!req.params.id === res.locals.token.id) {
      return res.status(401).send("unauthorized");
    }

    if (!req.files) {
      return res.status(400).send("error while getting files");
    }
    let thumbnailPath = req.files.thumbnail[0].path;
    thumbnailPath = thumbnailPath.replace("public/", "");
    // Extracting relative path for thumbnail

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
    if (
      !idseller ||
      !name ||
      !category ||
      !subcategory ||
      !priceUP ||
      !priceLOW ||
      !brand ||
      !quantity ||
      !stock ||
      !description
    ) {
      return res.status(400).send("Missing required input values.");
    }

    // Extracting relative paths for productImage
    const productImageValues = req.files.productImage.map((imageObject) =>
      imageObject.path.replace("public/", "")
    );

    const sql =
      "INSERT INTO product (idseller, name, category, subcategory, thumbnail, productImage, priceUP, priceLOW, brand, quantity, stock, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

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
      description,
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
    const thumbnail =
      req.files.thumbnail && req.files.thumbnail[0]
        ? req.files.thumbnail[0]
        : null;
    const productImage = req.files.productImage || [];

    // Check if the product exists
    const existingProduct = await dbPool.query(
      "SELECT * FROM product WHERE idproduct = ?",
      [productId]
    );

    if (existingProduct[0].length === 0) {
      return res.status(404).send("Product not found");
    }

    if (!String(existingProduct[0][0].idseller) === res.locals.token.id) {
      res.status(401).send("unauthorized");
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

    const updateStatement = `UPDATE product SET ${updateFields.join(
      ", "
    )} WHERE idproduct = ?`;

    // Add productId to the values array
    values.push(productId);

    // Perform the database query
    const data = await dbPool.query(updateStatement, values);

    console.log("Product updated successfully");
    res.status(200).json({ "Product updated successfully": data });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Internal Server Error");
  }
}



async function deleteProduct(req, res) {
  const productId = req.params.id;

  try {
    // Check if the product exists
    const existingProduct = await dbPool.query(
      "SELECT * FROM product WHERE idproduct = ?",
      [productId]
    );

    if (existingProduct[0].length === 0) {
      return res.status(404).send("Product not found");
    }

    if (existingProduct[0][0].idseller === res.locals.token.id) {
      return res.status(401).send("unauthorized");
    }

    async function delFile(filepath) {
      try {
        
        await fsPromises.unlink(workdir + '/public/' + filepath);
        
      } catch (error) {
        console.error('Error deleting file:', error);
        throw error; // Re-throw the error to be caught in the calling function
      }
    }
    
    try {
      await delFile(existingProduct[0][0].thumbnail);
    
    
      // Convert productImage to an array if it's not already
      const productImages = Array.isArray(existingProduct[0][0].productImage)
        ? existingProduct[0][0].productImage
        : [existingProduct[0][0].productImage];
    
      // Create an array of promises for each delFile operation
      const delFilePromises = productImages.map(async (element) => {
        await delFile(element);
      });
    
      // Wait for all delFile promises to complete
      await Promise.all(delFilePromises);
    
      // Continue with the rest of the delete logic...
    } catch (error) {
      console.log(error);
      return res.status(500).send('Internal Server Error');
    }
    
    // Delete the product
    const deleteResult = await dbPool.query(
      "DELETE FROM product WHERE idproduct = ?",
      [productId]
    );

    if (deleteResult[0].affectedRows > 0) {
      res.status(200).send("Product deleted successfully");
    } else {
      res.status(500).send("failed to delete product");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function getProductOfSeller(req, res) {
  try {
    const data = await dbPool.query(
      "SELECT * FROM product WHERE idseller = ?",
      [req.params.id]
    );

    if (data[0].length === 0) {
      console.log("not found");
      return res.status(404).json({ error: "Products not found" });
    }

    return res.status(200).json({ products: data[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getProduct(req, res) {
  const id = req.params.id;
  try {
    const data = await dbPool.query(
      "SELECT * FROM product WHERE idproduct = ?",
      [id]
    );
    if (data[0].length === 0) {
      return res.status(404).send("product not found");
    }
    res.send(data[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error");
  }
}

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  getProductOfSeller,
  getProduct,
};
