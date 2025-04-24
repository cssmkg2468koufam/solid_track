const { getAdminByID } = require('../models/adminprofileModel');

const getadminProfile = async (req, res) => {
  try {

    const id = req.params.id; // Assuming the ID is passed as a query parameter
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
    const adminProfile = await getAdminByID(id);
    console.log("Admin Profile:", adminProfile); // Log the fetched admin profile

    if (!adminProfile) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json(adminProfile);
  } catch (err) {
    console.error("Error fetching admin profile:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getadminProfile };
