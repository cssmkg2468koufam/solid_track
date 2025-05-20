const {getProductCount,getMaterialCountModel,getCustomerCountModel,getOrderCountModel,getOrdersByMonth, getProductsByCategory, getCustomerGrowth} = require('../models/dashboardModel');


const  getCounts=async(req, res) =>{
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Authorization token required' });
      }

      const [products, materials, customers, orders] = await Promise.all([
        getProductCount(),
        getMaterialCountModel(),
        getCustomerCountModel(),
        getOrderCountModel()
      ]);

      res.json({
        products,
        materials,
        customers,
        orders
      });
    } catch (error) {
      console.error('Error in getCounts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  const getChartData = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const [orders, products, customers] = await Promise.all([
      getOrdersByMonth(),
      getProductsByCategory(),
      getCustomerGrowth()
    ]);

    res.json({
      orders,
      products,
      customers
    });
  } catch (error) {
    console.error('Error in getChartData:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {getCounts, getChartData};