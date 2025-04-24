const express = require("express");
const { getAllCustomerProducts} = require("../controllers/customerproductController");   

const router = express.Router();

router.get("/get", getAllCustomerProducts)


module.exports = router;