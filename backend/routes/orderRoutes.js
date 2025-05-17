const express = require("express");
const { 
  getAllOrders, 
  deleteOrder,
  addFullOrder, 
  getCustomerOrder,
  updateOrderStatus ,
   getOrderDetailsForInvoice ,

} = require("../controllers/orderController");

const router = express.Router();

router.post("/addFullOrder", addFullOrder);
router.get("/get", getAllOrders);
router.delete("/delete/:id", deleteOrder);
router.get("/customer/:customer_id", getCustomerOrder);
router.put("/updateStatus/:order_id", updateOrderStatus);
router.get("/:order_id", getOrderDetailsForInvoice);


module.exports = router;