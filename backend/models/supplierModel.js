const pool = require('../config/db');

const getSuppliers = async () => {    
    const query = "SELECT supplier_id, supplier_name, raw_material, mobile FROM supplier";      
    const [rows] = await pool.query(query);      
    return rows;    
}

const addSupplierModel = async (supplier_id, supplier_name, raw_material, mobile) => {
    const query = "INSERT INTO supplier (supplier_id, supplier_name, raw_material, mobile) VALUES (?, ?, ?, ?)";
    const [result] = await pool.query(query, [supplier_id, supplier_name, raw_material, mobile]);
    return { supplier_id, supplier_name, raw_material, mobile };
}

const deleteSupplierModel = async (supplier_id) => {
    const query = "DELETE FROM supplier WHERE supplier_id = ?";
    const [result] = await pool.query(query, [supplier_id]);
    return result.affectedRows > 0;
};

module .exports = { getSuppliers, addSupplierModel, deleteSupplierModel };