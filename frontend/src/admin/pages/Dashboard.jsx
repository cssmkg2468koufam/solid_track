import React, { useState, useEffect } from 'react';
import './AppAdmin.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { chartConfigs } from '../components/ChartConfiguration';
import { 
  BsFillArchiveFill, 
  BsFillGrid3X3GapFill, 
  BsPeopleFill, 
  BsListCheck 
} from 'react-icons/bs';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js';



const Dashboard = () => {
  const [counts, setCounts] = useState({
    products: 0,
    materials: 0,
    customers: 0,
    orders: 0
  });
  const [chartData, setChartData] = useState({
    orders: [],
    products: [],
    customers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const [countsResponse, chartsResponse] = await Promise.all([
        fetch('http://localhost:5001/routes/dashboardRoutes/counts', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('http://localhost:5001/routes/dashboardRoutes/charts', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (!countsResponse.ok || !chartsResponse.ok) {
        throw new Error(`HTTP error! status: ${!countsResponse.ok ? 'counts' : 'charts'} endpoint`);
      }

      const countsData = await countsResponse.json();
      const chartsData = await chartsResponse.json();
      
      setCounts(countsData);
      setChartData(chartsData);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="grid-container">
        <Header />
        <Sidebar />
        <main className='main-container'>
          <div className="error-message">
            <h3>Error loading dashboard</h3>
            <p>{error}</p>
            <button onClick={fetchDashboardData}>Retry</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="grid-container">
      <Header />
      <Sidebar />
      <main className='main-container'>
        <div className='main-title'>
          <h3>DASHBOARD</h3>
        </div>
        
        <div className='main-cards'>
          <DashboardCard 
            title="PRODUCTS" 
            count={counts.products} 
            loading={loading}
            icon={<BsFillArchiveFill className='card_icon'/>}
          />
          <DashboardCard 
            title="MATERIALS" 
            count={counts.materials} 
            loading={loading}
            icon={<BsFillGrid3X3GapFill className='card_icon'/>}
          />
          <DashboardCard 
            title="CUSTOMERS" 
            count={counts.customers} 
            loading={loading}
            icon={<BsPeopleFill className='card_icon'/>}
          />
          <DashboardCard 
            title="ORDERS" 
            count={counts.orders} 
            loading={loading}
            icon={<BsListCheck className='card_icon'/>}
          />
        </div>

        <div className="charts-vertical">
          <div className="chart-section">
            <h3>Orders by Month</h3>
            <div className="chart-wrapper">
              {loading ? (
                <div className="loading-bar" />
              ) : (
                <Bar 
                  data={chartConfigs.enhanceOrdersChart(chartData.orders)} 
                  options={chartConfigs.options.bar}
                />
              )}
            </div>
          </div>

          <div className="chart-section">
            <h3>Products by Category</h3>
            <div className="chart-wrapper">
              {loading ? (
                <div className="loading-bar" />
              ) : (
                <Pie 
                  data={chartConfigs.enhanceProductsChart(chartData.products)} 
                  options={chartConfigs.options.pie}
                />
              )}
            </div>
          </div>

          <div className="chart-section">
            <h3>Customer Growth</h3>
            <div className="chart-wrapper">
              {loading ? (
                <div className="loading-bar" />
              ) : (
                <Line 
                  data={chartConfigs.enhanceCustomersChart(chartData.customers)} 
                  options={chartConfigs.options.line}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const DashboardCard = ({ title, count, loading, icon }) => (
  <div className="card">
    <div className='card-inner'>
      <h3>{title}</h3>
      {icon}
    </div>
    <h1>{loading ? <div className="loading-bar" /> : count}</h1>
  </div>
);

export default Dashboard;