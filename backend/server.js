const express = require("express");
const cors = require("cors");
const path = require('path');
require("dotenv").config(); 
const userRoutes = require("./routes/userRoutes");
const materialRoutes = require("./routes/materialRoutes");
const productRoutes = require("./routes/productRoutes");
const customerRoutes = require("./routes/customerRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const adminprofileRoutes = require("./routes/adminprofileRoutes"); // Import the admin profile routes
const cartRoutes = require("./routes/cartRoutes"); // Import the cart routes
const orderRoutes = require("./routes/orderRoutes"); // Import the order routes
const paymentRoutes = require("./routes/paymentRoutes"); // Import the payment routes
const dashboardRoutes = require("./routes/dashboardRoutes"); // Import the dashboard routes
const app = express();

app.use(cors());
app.use(express.json());

app.use("/routes/userRoutes", userRoutes);
app.use("/routes/materialRoutes", materialRoutes);
app.use("/routes/productRoutes", productRoutes);
app.use("/routes/orderRoutes", orderRoutes); // Import the order routes
app.use("/routes/customerRoutes", customerRoutes);
app.use("/routes/supplierRoutes", supplierRoutes);
app.use("/routes/adminprofileRoutes", adminprofileRoutes); // Use the admin profile routes
app.use("/routes/cartRoutes",cartRoutes); // Import and use the cart routes
app.use("/routes/paymentRoutes", paymentRoutes); // Import and use the payment routes
app.use("/routes/dashboardRoutes", dashboardRoutes); // Import and use the dashboard routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get("/", (req, res) => {
  res.send("Server is running");
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // Export the app for testing purposes