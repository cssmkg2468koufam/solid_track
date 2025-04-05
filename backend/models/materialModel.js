const pool = require("../config/db");

const getMaterials = async () => {      
    const query = "SELECT * FROM materials";      
    const [rows] = await pool.query(query);      
    return rows;    
}

const createMaterialModel = async (name, supplier, quantity, unit, price, purchase_date, stock) => {
    // Get the highest existing material_id
    const [result] = await pool.query("SELECT MAX(material_id) as maxId FROM materials");
    let nextNumber = 1;
    
    // Extract number from the highest ID if exists
    if (result[0].maxId) {
        const maxId = result[0].maxId;
        const currentNumber = parseInt(maxId.replace('MT0', ''));
        nextNumber = currentNumber + 1;
    }
    
    const nextId = `MT0${nextNumber}`;
    
    const query = `INSERT INTO materials 
        (material_id, name, supplier, quantity, unit, price, purchase_date, stock) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    return pool.query(query, [nextId, name, supplier, quantity, unit, price, purchase_date, stock]);
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