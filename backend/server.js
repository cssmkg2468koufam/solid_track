const express = require("express");
const cors = require("cors");
require("dotenv").config(); 
const userRoutes = require("./routes/userRoutes");
const materialRoutes = require("./routes/materialRoutes");
const productRoutes = require("./routes/productRoutes");
const customerRoutes = require("./routes/customerRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const adminprofileRoutes = require("./routes/adminprofileRoutes"); // Import the admin profile routes


const app = express();

app.use(cors());
app.use(express.json());

app.use("/routes/userRoutes", userRoutes);
app.use("/routes/materialRoutes", materialRoutes);
app.use("/routes/productRoutes", productRoutes);
app.use("/routes/customerRoutes", customerRoutes);
app.use("/routes/supplierRoutes", supplierRoutes);
app.use("/routes/adminprofileRoutes", adminprofileRoutes); // Use the admin profile routes

app.get("/", (req, res) => {
  res.send("Server is running");
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // Export the app for testing purposes