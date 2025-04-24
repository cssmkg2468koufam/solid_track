const express = require("express");
const { registerCustomer, loginUser, checkEmailExists } = require("../controllers/userController");

const router = express.Router();

router.post("/register/customer", registerCustomer);
router.post("/login", loginUser);
router.get("/check-email", checkEmailExists); 

module.exports = router;
