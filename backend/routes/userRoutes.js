const express = require("express");
const { registerCustomer, loginUser , getCurrentUser, updateCurrentUser } = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware"); // Import the token verification middleware

const router = express.Router();

router.post("/register/customer", registerCustomer);
router.post("/login", loginUser);
router.get("/profile", protect, getCurrentUser); // Get current user's profile
router.put("/profile", protect, updateCurrentUser); // Update current user's profile



module.exports = router;
