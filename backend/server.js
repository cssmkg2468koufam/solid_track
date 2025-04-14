const express = require("express");
const cors = require("cors");
require("dotenv").config(); 
const userRoutes = require("./routes/userRoutes");
const materialRoutes = require("./routes/materialRoutes");
const productRoutes = require("./routes/productRoutes");
const customerRoutes = require("./routes/customerRoutes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/routes/userRoutes", userRoutes);
app.use("/routes/materialRoutes", materialRoutes);
app.use("/routes/productRoutes", productRoutes);
app.use("/routes/customerRoutes", customerRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
