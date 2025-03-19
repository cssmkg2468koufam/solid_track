const express = require("express");
const { registerCustomer, loginCustomer } = require("../controllers/userController");

const router = express.Router();

router.post("/register/customer", registerCustomer);
router.post("/login", loginCustomer);


module.exports = router;
