const dbPool = require("../database/sqlConnection");


async function search(req, res) {
    const { query, category, subcategory, seller , priceMax, priceMin, idproduct, sort} = req.query;
  
    // Base query without any conditions
    let queryStr = "SELECT name, idproduct, thumbnail, category, subcategory, priceUP, priceLOW, postTime FROM product";
  
    // Arrays to store conditions and values for WHERE clause
    const conditions = [];
    const values = [];
  
    // Add conditions based on provided parameters
    if (query) {
      conditions.push("name LIKE ?");
      values.push(`%${query}%`);
    }
  
    if (category) {
      conditions.push("category = ?");
      values.push(category);
    }
  
    if (subcategory) {
      conditions.push("subcategory = ?");
      values.push(subcategory);
    }
    if(seller){
        conditions.push("idseller = ?");
        values.push(seller);
    }
    if(idproduct){
        conditions.push("idproduct = ?");
        values.push(idproduct);
    }

    
    if (priceMin) {
        conditions.push("priceUP >= ?");
        values.push(priceMin);
      }
    
     if (priceMax) {
        conditions.push("priceLOW <= ?");
        values.push(priceMax);
      }
  

    // If there are conditions, append WHERE clause to the base query
    if (conditions.length > 0) {
      queryStr += ` WHERE ${conditions.join(" AND ")}`;
    }

    switch (sort) {
        case "priceAscending":
          queryStr += " ORDER BY priceUP ASC";
          break;
        case "priceDescending":
          queryStr += " ORDER BY priceLOW DESC";
          break;
        case "alphabeticalAscending":
          queryStr += " ORDER BY name ASC";
          break;
        case "alphabeticalDescending":
          queryStr += " ORDER BY name DESC";
          break;
        case "timeAscending":
          queryStr += " ORDER BY postTime ASC";
          break;
        case "timeDescending":
          queryStr += " ORDER BY postTime DESC";
          break;
        default:
          // No sorting specified, use default ordering
          break;
      }
    
  
    try {
      const data = await dbPool.query(queryStr, values);
      res.send(data[0]);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
  




module.exports = search;