const express = require("express");
const cors = require("cors"); 
const path = require('path'); 
require("dotenv").config(); 

// Import route handlers
const userRoutes = require("./routes/userRoutes");
const materialRoutes = require("./routes/materialRoutes");
const productRoutes = require("./routes/productRoutes");
const customerRoutes = require("./routes/customerRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const adminprofileRoutes = require("./routes/adminprofileRoutes"); 
const cartRoutes = require("./routes/cartRoutes"); 
const orderRoutes = require("./routes/orderRoutes"); 
const paymentRoutes = require("./routes/paymentRoutes"); 
const dashboardRoutes = require("./routes/dashboardRoutes"); 

// Initialize Express application
const app = express();

// Middleware setup
app.use(cors()); //Cross-Origin Resource Sharing - 2 different ports for frontend and backend
app.use(express.json()); 

// Route handlers setup
app.use("/routes/userRoutes", userRoutes);
app.use("/routes/materialRoutes", materialRoutes);
app.use("/routes/productRoutes", productRoutes);
app.use("/routes/orderRoutes", orderRoutes); 
app.use("/routes/customerRoutes", customerRoutes);
app.use("/routes/supplierRoutes", supplierRoutes);
app.use("/routes/adminprofileRoutes", adminprofileRoutes);
app.use("/routes/cartRoutes", cartRoutes);
app.use("/routes/paymentRoutes", paymentRoutes);
app.use("/routes/dashboardRoutes", dashboardRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic route to check if server is running
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Set the port from environment variable or default to 5001
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


module.exports = app;