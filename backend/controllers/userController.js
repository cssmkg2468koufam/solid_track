const { createCustomer, getCustomerByEmail, getCustomerEmail,createNewAdmin , getAdminByEmail, getUserModel} = require("../models/userModel");
const jwt= require("jsonwebtoken");

const pool = require("../config/db");

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

        const token = jwt.sign(
  { id: user.customer_id || user.id, email: user.email, role },
  "your_jwt_secret",
  { expiresIn: "1h" }
);


        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.customer_id || user.id,
                fullName: user.full_name || user.email,
                email: user.email,
                phone: user.phone,
                role: role, // Include the role in the response
                token
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
};

const getCurrentUser = async (req, res) => {
  try {
    let user;
    if (req.user.role === 'customer') {
      user = await getCustomerByEmail(req.user.email);
    } else if (req.user.role === 'admin') {
      user = await getAdminByEmail(req.user.email);
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      id: user.customer_id || user.id,
      fullName: user.full_name || user.email,
      email: user.email,
      phone: user.phone,
      role: req.user.role
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCurrentUser = async (req, res) => {
  const { fullName, email, phone, currentPassword, newPassword } = req.body;

  try {
    // Validate required fields
    if (fullName === null || fullName === undefined || fullName.trim() === '') {
      return res.status(400).json({ error: "Full name is required" });
    }

    if (email === null || email === undefined || email.trim() === '') {
      return res.status(400).json({ error: "Email is required" });
    }

    let user;
    if (req.user.role === 'customer') {
      user = await getCustomerByEmail(req.user.email);
    } else if (req.user.role === 'admin') {
      user = await getAdminByEmail(req.user.email);
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if new email is already in use
    if (email && email !== req.user.email) {
      const emailExists = await getCustomerByEmail(email);
      if (emailExists) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }

    // Verify current password if changing email or password
    if ((email && email !== req.user.email) || newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ 
          error: "Current password is required to change email or password" 
        });
      }
      if (currentPassword !== user.password) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
    }

    // Update user data
    if (req.user.role === 'customer') {
      let updateQuery;
      let params;
      
      if (newPassword) {
        updateQuery = `
          UPDATE customer 
          SET full_name = ?, email = ?, phone = ?, password = ?
          WHERE email = ?
        `;
        params = [
          fullName.trim(), 
          email || req.user.email, 
          phone || user.phone, 
          newPassword, 
          req.user.email
        ];
      } else {
        updateQuery = `
          UPDATE customer 
          SET full_name = ?, email = ?, phone = ?
          WHERE email = ?
        `;
        params = [
          fullName.trim(), 
          email || req.user.email, 
          phone || user.phone, 
          req.user.email
        ];
      }

      await pool.query(updateQuery, params);

      // If email changed, update JWT
      if (email && email !== req.user.email) {
        const token = jwt.sign(
          { id: user.customer_id, email: email, role: req.user.role },
          "your_jwt_secret",
          { expiresIn: "1h" }
        );
        return res.status(200).json({ 
          message: "Profile updated successfully",
          token // Return new token if email changed
        });
      }
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ 
      error: "Internal Server Error",
      details: err.message
    });
  }
};


module.exports = { registerCustomer, loginUser, checkEmailExists, getCurrentUser, updateCurrentUser };