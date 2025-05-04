const express = require("express");
const { getAllProducts, getProductById, createNewProduct, getProductsByCategory, editAllProduct, deleteAllProduct } = require("../controllers/productController");

const router = express.Router();

router.get("/get", getAllProducts);
router.get("/get/:id", getProductById); 
router.post("/add", createNewProduct);
router.get("/type/:category", getProductsByCategory);
router.put("/edit/:id", editAllProduct);
router.delete("/delete/:id", deleteAllProduct);

module.exports = router;