const express = require("express");
const { getAllOrders, deleteOrder,addFullOrder, getCustomerOrder, updateOrderStatus , getOrderDetailsForInvoice , cancelOrder,
  checkOrderInventory } = require("../controllers/orderController");


const router = express.Router();

router.post("/addFullOrder", addFullOrder);
router.get("/get", getAllOrders);
router.delete("/delete/:id", deleteOrder);
router.get("/customer/:customer_id", getCustomerOrder);
router.put("/updateStatus/:order_id", updateOrderStatus);
router.get("/:order_id", getOrderDetailsForInvoice);
router.put("/cancel/:orderid", cancelOrder);
router.get("/checkInventory/:order_id", checkOrderInventory);
module.exports = router;