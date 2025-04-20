const express = require("express");
const { registerCustomer, loginCustomer, checkEmailExists } = require("../controllers/userController");

const router = express.Router();

router.post("/register/customer", registerCustomer);
router.post("/login", loginCustomer);
router.get("/check-email", checkEmailExists); 

module.exports = router;
