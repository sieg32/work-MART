const express = require("express");
const search = require("../controllers/searchController");
const route = express.Router();





route.get('/', search);





module.exports = route;