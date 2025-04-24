const { createCustomer, getCustomerByEmail, getCustomerEmail,createNewAdmin , getAdminByEmail} = require("../models/userModel");

const createAdmin = async () => {
    const adminEmail = "admin@gmail.com"
    const adminPassword = "Admin123";

    try{
        const existingAdmin = await getAdminByEmail(adminEmail);
        if (existingAdmin) {
            console.log("Admin already exists in the database.");
            return;
        }

        // Create the admin with plain text password
        await createNewAdmin(adminEmail, adminPassword);
        console.log("Admin created successfully.");
    }
    catch (err) {
        console.error("Error creating admin:", err);
    }
}
createAdmin(); // Call the function to create the admin

const registerCustomer = async (req, res) => {
    const { fullName, email, phone, password, confirmPassword } = req.body;

    // Check if email already exists
    const existingCustomer = await getCustomerByEmail(email);
    if (existingCustomer) {
        return res.status(400).json({ error: "Email already in use" });
    }

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

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log("Login request received:", req.body); // Log the request body
    
    if (!email || !password) {
        return res.status(400).json({ error: "Please fill all fields" });
    }

    try{
        let user = await getCustomerByEmail(email);
        let role = 'customer'; // Default role
        if (!user) {
            user = await getAdminByEmail(email);
            role = 'admin'; // If user is not found, check if it's an admin
        }
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.customer_id || user.id,
                fullName: user.full_name || user.email,
                email: user.email,
                phone: user.phone,
                role: role, // Include the role in the response
            },
        });
        console.log("Logged in user:", user); // Log the logged-in user


    }   catch (err) {
        console.error("Error logging in user:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const checkEmailExists = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const customer = await getCustomerEmail(email);
        res.json({ exists: !!customer });
    } catch (err) {
        console.error("Error checking email:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { registerCustomer, loginUser, checkEmailExists };