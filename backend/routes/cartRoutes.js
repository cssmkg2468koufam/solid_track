const express = require("express");
const {addToCart, getCartItems, deleteCartItem, updateCartItem} = require("../controllers/cartController");

const router = express.Router();
const { protect } = require("../middleware/authMiddleware"); // Import the protect middleware

router.post("/add",protect, addToCart);

router.get("/get/:customer_id", getCartItems);
router.delete("/delete/:id", protect, deleteCartItem);

router.put("/update/:id", updateCartItem);

module.exports = router;