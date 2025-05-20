const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const authenticate = require('../middleware/authenticate');
const pool = require('../config/db');

// Sales Report Endpoint
router.get('/sales', authenticate, async (req, res) => {
  try {
    const { startDate, endDate, reportType, groupBy } = req.query;
    
    // Validate parameters
    if (!['summary', 'detailed'].includes(reportType)) {
      return res.status(400).json({ error: 'Invalid report type' });
    }
    
    if (!['day', 'week', 'month', 'product'].includes(groupBy)) {
      return res.status(400).json({ error: 'Invalid group by parameter' });
    }
    
    // Build date condition
    let dateCondition = '';
    if (startDate && endDate) {
      dateCondition = `WHERE o.order_date BETWEEN '${startDate}' AND '${endDate}'`;
    } else if (startDate) {
      dateCondition = `WHERE o.order_date >= '${startDate}'`;
    } else if (endDate) {
      dateCondition = `WHERE o.order_date <= '${endDate}'`;
    }
    
    // Build group by clause
    let groupByClause = '';
    let selectField = '';
    
    switch(groupBy) {
      case 'day':
        selectField = "to_char(o.order_date, 'YYYY-MM-DD') as date";
        groupByClause = "GROUP BY to_char(o.order_date, 'YYYY-MM-DD')";
        break;
      case 'week':
        selectField = "to_char(o.order_date, 'YYYY-WW') as date";
        groupByClause = "GROUP BY to_char(o.order_date, 'YYYY-WW')";
        break;
      case 'month':
        selectField = "to_char(o.order_date, 'YYYY-MM') as date";
        groupByClause = "GROUP BY to_char(o.order_date, 'YYYY-MM')";
        break;
      case 'product':
        selectField = "p.name as product";
        groupByClause = "GROUP BY p.name";
        break;
    }
    
    // Main query to get sales data
    const salesQuery = `
      SELECT 
        ${selectField},
        COUNT(DISTINCT o.order_id) as orders,
        SUM(oi.quantity * oi.unit_price) as revenue
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      ${groupBy === 'product' ? 'JOIN products p ON oi.product_id = p.product_id' : ''}
      ${dateCondition}
      ${groupByClause}
      ORDER BY revenue DESC
    `;
    
    // Summary query
    const summaryQuery = `
      SELECT
        COUNT(DISTINCT o.order_id) as total_orders,
        SUM(oi.quantity * oi.unit_price) as total_sales,
        AVG(oi.quantity * oi.unit_price) as avg_order_value
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      ${dateCondition}
    `;
    
    // Execute queries
    const salesResult = await pool.query(salesQuery);
    const summaryResult = await pool.query(summaryQuery);
    
    // Calculate percentages
    const totalSales = parseFloat(summaryResult.rows[0]?.total_sales || 0);
    const dataWithPercentage = salesResult.rows.map(row => ({
      ...row,
      percentage: totalSales > 0 ? ((parseFloat(row.revenue) / totalSales * 100).toFixed(2) ): 0
    }));
    
    // Format response
    res.json({
      summary: {
        totalSales: parseFloat(summaryResult.rows[0]?.total_sales || 0),
        totalOrders: parseInt(summaryResult.rows[0]?.total_orders || 0),
        avgOrderValue: parseFloat(summaryResult.rows[0]?.avg_order_value || 0)
      },
      data: dataWithPercentage
    });
    
  } catch (error) {
    console.error('Error generating sales report:', error);
    res.status(500).json({ error: 'Failed to generate sales report' });
  }
});

module.exports = router;