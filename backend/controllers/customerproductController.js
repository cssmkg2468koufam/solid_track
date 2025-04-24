const {getCustomerProducts} = require("../models/customerproductModel");

const getAllCustomerProducts = async (req, res) => {
    try {
        const customerProducts = await getCustomerProducts();
        res.status(200).json(customerProducts);
    } catch (err) {
        console.error("Error fetching customer products:", err);
        res.status(500).json({ message: "Error fetching customer products" });
    }
    }

module.exports = { getAllCustomerProducts };