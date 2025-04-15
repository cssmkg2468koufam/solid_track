const { createCustomer, getCustomerByEmail } = require("../models/userModel");

const registerCustomer = async (req, res) => {
    const { fullName, email, phone, password, confirmPassword } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !password || !confirmPassword) {
        return res.status(400).json({ error: "Please fill all fields" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    try {
        // Create the customer with plain text password
        await createCustomer(fullName, email, phone, password);

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

        // Compare plain text passwords
        if (password !== customer.password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        res.status(200).json({ 
            message: "Login successful", 
            user: { 
                id: customer.customer_id, 
                fullName: customer.full_name, 
                email: customer.email 
            } 
        });

    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { registerCustomer, loginCustomer };