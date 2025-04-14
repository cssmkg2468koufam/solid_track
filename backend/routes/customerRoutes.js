const express = require("express");
const { getAllCustomers, deleteCustomer } = require("../controllers/customerController");

const router = express.Router();

router.get("/get", getAllCustomers);
router.delete("/delete/:id", deleteCustomer);

module.exports = router;