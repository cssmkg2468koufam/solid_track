const bcrypt = require("bcryptjs");
const { createCustomer, getCustomerByEmail} = require("../models/userModel");

const registerCustomer = async (req, res) => {
    const { fullName, email, phone, password, confirmPassword } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !password || !confirmPassword) {
        return res.status(400).json({ error: "Please fill all fields" });
    }


    try {
        // Hash the password
        const password_hash = await bcrypt.hash(password, 10);

        // Create the customer
        await createCustomer(fullName, email, phone, password_hash);

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error("Error registering customer:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const loginCustomer = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: "Please fill all fields" });
    }

    try {
        const customer = await getCustomerByEmail(email);

        if (!customer) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, customer.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        res.status(200).json({ message: "Login successful", user: { id: customer.id, fullName: customer.full_name, email: customer.email } });

    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {registerCustomer, loginCustomer};