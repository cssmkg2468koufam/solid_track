const express = require("express");
const { CreateMaterial, getAllMaterials, deleteMaterial, editMaterial } = require("../controllers/materialController");

const router = express.Router();

router.post("/create", CreateMaterial);
router.get("/get", getAllMaterials);
router.delete("/delete/:id", deleteMaterial);
router.put("/update/:id", editMaterial);

module.exports = router;