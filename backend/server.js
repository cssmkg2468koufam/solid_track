const express = require("express");
const cors = require("cors");
require("dotenv").config(); 
const userRoutes = require("./routes/userRoutes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/routes/userRoutes", userRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

