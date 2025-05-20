const express = require('express');
const { getCounts, getChartData } = require('../controllers/dashboardController');
const router = express.Router();

router.get('/counts', getCounts);
router.get('/charts', getChartData);

module.exports = router;