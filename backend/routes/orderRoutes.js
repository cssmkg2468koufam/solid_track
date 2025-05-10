const express = require("express");
const { getAllOrders, deleteOrder,addFullOrder, getCustomerOrder } = require("../controllers/orderController");

const router = express.Router();

router.post("/addFullOrder", addFullOrder); // Assuming you have an addOrder function in your controller
router.get("/get", getAllOrders);
router.delete("/delete/:id", deleteOrder);
router.get("/customer/:customer_id", getCustomerOrder); // Assuming you have a function to get orders by customer ID

module.exports = router;