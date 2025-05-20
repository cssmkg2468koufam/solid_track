import React, { useState } from 'react';
import { DatePicker, Select, Button, Card, Spin } from 'antd';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaFilePdf, FaSearch } from 'react-icons/fa';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import './AppAdmin.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

const SalesReport = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState([null, null]);
  const [reportType, setReportType] = useState('summary');
  const [groupBy, setGroupBy] = useState('day');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const generateReport = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API call
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (dateRange[0]) params.append('startDate', dateRange[0].format('YYYY-MM-DD'));
      if (dateRange[1]) params.append('endDate', dateRange[1].format('YYYY-MM-DD'));
      params.append('reportType', reportType);
      params.append('groupBy', groupBy);

      const response = await fetch(`http://localhost:5001/routes/reportRoutes/sales?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch report data');
      
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!reportData) return;

    const doc = new jsPDF();
    
    // Report title
    doc.setFontSize(18);
    doc.text('Sales Report', 105, 20, { align: 'center' });
    
    // Report period
    doc.setFontSize(12);
    let periodText = 'All Time';
    if (dateRange[0] && dateRange[1]) {
      periodText = `${dateRange[0].format('MMM D, YYYY')} to ${dateRange[1].format('MMM D, YYYY')}`;
    }
    doc.text(`Period: ${periodText}`, 105, 30, { align: 'center' });
    
    // Report type
    doc.text(`Report Type: ${reportType === 'summary' ? 'Summary' : 'Detailed'}`, 20, 40);
    doc.text(`Group By: ${groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}`, 20, 48);
    
    // Summary statistics
    doc.setFontSize(14);
    doc.text('Summary Statistics', 20, 60);
    doc.setFontSize(12);
    doc.text(`Total Sales: Rs. ${reportData.summary.totalSales.toLocaleString()}`, 20, 70);
    doc.text(`Total Orders: ${reportData.summary.totalOrders}`, 20, 78);
    doc.text(`Average Order Value: Rs. ${reportData.summary.avgOrderValue.toLocaleString()}`, 20, 86);
    
    // Sales data table
    doc.setFontSize(14);
    doc.text('Sales Data', 20, 100);
    
    const tableData = reportData.data.map(item => [
      item.date || item.product || 'N/A',
      item.orders,
      `Rs. ${item.revenue.toLocaleString()}`,
      `${item.percentage || 0}%`
    ]);
    
    autoTable(doc, {
      startY: 105,
      head: [['Period', 'Orders', 'Revenue', 'Percentage']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      margin: { top: 105 }
    });
    
    doc.save(`Sales_Report_${moment().format('YYYYMMDD')}.pdf`);
  };

  return (
    <div className="grid-container">
      <Header />
      <Sidebar />
      <div className="sales-report-page">
        <div className="page-header">
          <h1>Sales Report</h1>
          <Button type="text" onClick={() => navigate('/reports-admin')}>
            ← Back to Reports
          </Button>
        </div>

        <Card className="filter-card">
          <div className="filter-row">
            <div className="filter-group">
              <label>Date Range</label>
              <RangePicker
                style={{ width: '100%' }}
                value={dateRange}
                onChange={setDateRange}
                disabledDate={current => current && current > moment().endOf('day')}
              />
            </div>

            <div className="filter-group">
              <label>Report Type</label>
              <Select
                style={{ width: '100%' }}
                value={reportType}
                onChange={setReportType}
              >
                <Option value="summary">Summary</Option>
                <Option value="detailed">Detailed</Option>
              </Select>
            </div>

            <div className="filter-group">
              <label>Group By</label>
              <Select
                style={{ width: '100%' }}
                value={groupBy}
                onChange={setGroupBy}
              >
                <Option value="day">Day</Option>
                <Option value="week">Week</Option>
                <Option value="month">Month</Option>
                <Option value="product">Product</Option>
              </Select>
            </div>
          </div>

          <div className="action-buttons">
            <Button
              type="primary"
              icon={<FaSearch />}
              onClick={generateReport}
              loading={loading}
            >
              Generate Report
            </Button>
          </div>
        </Card>

        {loading && (
          <div className="loading-container">
            <Spin size="large" />
            <p>Generating report...</p>
          </div>
        )}

        {reportData && !loading && (
          <Card className="report-results">
            <div className="report-header">
              <h2>Report Results</h2>
              <Button
                type="primary"
                icon={<FaFilePdf />}
                onClick={downloadPDF}
              >
                Download PDF
              </Button>
            </div>

            <div className="summary-stats">
              <div className="stat-card">
                <h3>Total Sales</h3>
                <p>Rs. {reportData.summary.totalSales.toLocaleString()}</p>
              </div>
              <div className="stat-card">
                <h3>Total Orders</h3>
                <p>{reportData.summary.totalOrders}</p>
              </div>
              <div className="stat-card">
                <h3>Avg. Order Value</h3>
                <p>Rs. {reportData.summary.avgOrderValue.toLocaleString()}</p>
              </div>
            </div>

            <div className="report-table">
              <table>
                <thead>
                  <tr>
                    <th>{groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}</th>
                    <th>Orders</th>
                    <th>Revenue</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.date || item.product || 'N/A'}</td>
                      <td>{item.orders}</td>
                      <td>Rs. {item.revenue.toLocaleString()}</td>
                      <td>{item.percentage || 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SalesReport;