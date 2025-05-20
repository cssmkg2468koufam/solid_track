const express = require("express");
const { getAllCustomers, deleteCustomer, getCustomerCount } = require("../controllers/customerController");

const router = express.Router();

router.get("/get", getAllCustomers);
router.delete("/delete/:id", deleteCustomer);
router.get("/count", getCustomerCount);

module.exports = router;