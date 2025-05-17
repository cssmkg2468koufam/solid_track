const pool = require("../config/db");

const getMaterials = async () => {      
    const query = "SELECT * FROM materials";      
    const [rows] = await pool.query(query);      
    return rows;    
}

const createMaterialModel = async (material_id, name, supplier, quantity, unit, price, purchase_date, stock) => {
    const query = `INSERT INTO materials 
        (material_id, name, supplier, quantity, unit, price, purchase_date, stock) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    return pool.query(query, [material_id, name, supplier, quantity, unit, price, purchase_date, stock]);
}

const deleteMaterialModel = async (material_id) => {
    const query = "DELETE FROM materials WHERE material_id = ?";
    return pool.query(query, [material_id]);
}

const editMaterialModel = async (material_id, name, supplier, quantity, unit, price) => {
    const query = `UPDATE materials SET 
        name = ?, 
        supplier = ?, 
        quantity = ?, 
        unit = ?, 
        price = ? 
        WHERE material_id = ?`;
    return pool.query(query, [name, supplier, quantity, unit, price, material_id]);
}

module.exports = { getMaterials, createMaterialModel, deleteMaterialModel, editMaterialModel };