const { getMaterials, createMaterialModel, deleteMaterialModel, editMaterialModel } = require('../models/materialModel');

const getAllMaterials = async (req, res) => { 
    try {
        const materials = await getMaterials();
        res.status(200).json(materials);
    } catch (err) {
        console.error('Error getting materials:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const CreateMaterial = async (req, res) => {
    const { name, supplier, quantity, unit, price, purchase_date, stock } = req.body;

    if (!name || !supplier || !quantity || !unit || !price || !purchase_date || !stock) {
        return res.status(400).json({ error: 'Please fill all fields' });
    }

    try {
        await createMaterialModel(name, supplier, quantity, unit, price, purchase_date, stock);
        res.status(201).json({ message: 'Material created successfully' });
    } catch (err) {
        console.error('Error creating material:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteMaterial = async (req, res) => {
    const { id } = req.params;
    try {
        await deleteMaterialModel(id);
        res.status(200).json({ message: 'Material deleted successfully' });
    } catch (err) {
        console.error('Error deleting material:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const editMaterial = async (req, res) => {
    const { id } = req.params;
    const { name, supplier, quantity, unit, price } = req.body;

    if (!name || !supplier || !quantity || !unit || !price) {
        return res.status(400).json({ error: 'Please fill all required fields' });
    }

    try {
        await editMaterialModel(id, name, supplier, quantity, unit, price);
        res.status(200).json({ message: 'Material updated successfully' });
    } catch (err) {
        console.error('Error updating material:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getAllMaterials, CreateMaterial, deleteMaterial, editMaterial };