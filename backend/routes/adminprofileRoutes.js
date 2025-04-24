const express = require('express');
const {getadminProfile, logoutAdmin} = require('../controllers/adminprofileController');

const router = express.Router();

router.get('/get/:id',getadminProfile);


module.exports = router;