const pool = require('../config/db');

const getAdminByID = async (id) => {  
    const query = "SELECT * FROM admin WHERE id = ?";
    const [rows] = await pool.query(query, [id]);
    return rows.length >= 0 ? rows[0] : null;
  };

module.exports = { getAdminByID };
