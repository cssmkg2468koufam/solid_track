const express = require("express");
const { 
  getAllProducts, 
  getProductById, 
  createNewProduct, 
  getProductsByCategory, 
  editAllProduct, 
  deleteAllProduct, 
  addProductMaterial,
  upload
} = require("../controllers/productController");
const router = express.Router();

router.get("/get", getAllProducts);
router.get("/get/:id", getProductById); 
router.post("/add", upload.single('image'), createNewProduct);
router.post("/addMaterial", addProductMaterial);
router.get("/type/:category", getProductsByCategory);
router.put("/edit/:id", upload.single('image'), editAllProduct);
router.delete("/delete/:id", deleteAllProduct);

module.exports = router;