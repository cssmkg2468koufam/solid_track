const express = require("express");
const { getAllOrders, deleteOrder } = require("../controllers/orderController");

const router = express.Router();

router.get("/get", getAllOrders);
router.delete("/delete/:id", deleteOrder);

module.exports = router;