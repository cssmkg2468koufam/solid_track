const express = require("express");
const { getAllProducts, createNewProduct} = require("../controllers/productController");

const router = express.Router();

router.get("/get", getAllProducts);
router.post("/add", createNewProduct);


module.exports = router;
