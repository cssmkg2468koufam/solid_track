const { getSuppliers, addSupplierModel, deleteSupplierModel } = require('../models/supplierModel');

const getAllSupplier = async (req, res) => {
    try {
        const supplier = await getSuppliers();
        res.status(200).json(supplier);
        console.log(supplier);
    } catch (err) {
        console.error('Error getting materials:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const addSupplier = async (req, res) => {
    const { supplier_id, supplier_name, raw_material, mobile } = req.body;
    try {
        const newSupplier = await addSupplierModel(supplier_id, supplier_name, raw_material, mobile);
        res.status(201).json(newSupplier);
    } catch (err) {
        console.error('Error adding supplier:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteSupplier = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedSupplier = await deleteSupplierModel(id);
        if (deletedSupplier) {
            res.status(200).json({ message: 'Supplier deleted successfully' });
        } else {
            res.status(404).json({ error: 'Supplier not found' });
        }
    } catch (err) {
        console.error('Error deleting supplier:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getAllSupplier, addSupplier, deleteSupplier };