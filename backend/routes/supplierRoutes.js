const express = require("express");
const { getAllSupplier, addSupplier, deleteSupplier } = require("../controllers/supplierController");

const router = express.Router();

router.get("/get", getAllSupplier);
router.post("/add", addSupplier);
router.delete("/delete/:id", deleteSupplier);

module.exports = router;