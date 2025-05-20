import React, { useState, useEffect, useRef } from 'react';
import { FaFileExport, FaSortAmountDown, FaSortAmountUp, FaSpinner } from 'react-icons/fa';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { Select } from 'antd';
import moment from 'moment';
import "./Reports.css"
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
// import './Reports.css';

const OrderReports = () => {
  const [selectedReports, setSelectedReports] = useState({
    orders: true  // Set default to true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: 'created_at',
    direction: 'desc'
  });
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const pdfRef = useRef(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { Option } = Select;

  // Status options
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "advanced-paid", label: "Advanced Paid" },
    { value: "approved", label: "Approved" },
    { value: "cancelled", label: "Cancelled" }
  ];

  // Month options
  const monthOptions = [
    { value: null, label: "All Months" },
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" }
  ];

  useEffect(() => {
    fetchOrderData();
  }, []);

  useEffect(() => {
    // Apply filters whenever data changes or filters are updated
    applyFilters();
  }, [orderData, selectedMonth, selectedStatus]);

  useEffect(() => {
    if (filteredData.length > 0 && Object.values(selectedReports).some(value => value)) {
      generatePDFPreview();
    } else {
      setPdfPreviewUrl(null);
    }
  }, [filteredData, sortConfig, selectedReports]);

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const url = 'http://localhost:5001/routes/orderRoutes/get';
      
      console.log('Fetching from URL:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch order data: ${response.statusText}`);
      }

      const data = await response.json();
      setOrderData(data);
      setFilteredData(data); // Initially set filtered data to all data
      console.log('Fetched order data:', data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load order data');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...orderData];
    
    // Filter by month if selected
    if (selectedMonth !== null) {
      result = result.filter(order => {
        const orderDate = moment(order.created_at);
        return orderDate.month() === selectedMonth;
      });
    }
    
    // Filter by status if not "all"
    if (selectedStatus !== "all") {
      result = result.filter(order => order.status === selectedStatus);
    }
    
    // Sort the filtered data
    result = sortData(result, sortConfig.key, sortConfig.direction);
    
    setFilteredData(result);
  };

  const handleCheckboxChange = (reportType) => {
    setSelectedReports(prev => ({
      ...prev,
      [reportType]: !prev[reportType]
    }));
  };

  const sortData = (data, key, direction) => {
    return [...data].sort((a, b) => {
      if (key === 'delivery_date' || key === 'created_at') {
        return direction === 'asc' 
          ? new Date(a[key]) - new Date(b[key])
          : new Date(b[key]) - new Date(a[key]);
      }
      if (key === 'total_amount' || key === 'remain_balance') {
        // Parse as float for proper numeric comparison
        const valueA = parseFloat(a[key] || 0);
        const valueB = parseFloat(b[key] || 0);
        return direction === 'asc' 
          ? valueA - valueB
          : valueB - valueA;
      }
      // For strings (customer_name, status)
      return direction === 'asc'
        ? (a[key] || '').localeCompare(b[key] || '')
        : (b[key] || '').localeCompare(a[key] || '');
    });
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    
    // Re-sort filtered data
    setFilteredData(prev => sortData(prev, key, 
      sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />;
  };

  const formatDate = (dateString) => {
    return dateString ? moment(dateString).format('YYYY-MM-DD') : 'N/A';
  };

  const generatePDF = async () => {
    try {
      if (!filteredData || filteredData.length === 0) {
        setError('No data available to generate report');
        return null;
      }

      const doc = new jsPDF();

      // Add header with branding
      doc.setFontSize(24);
      doc.setTextColor(20, 80, 200); // Green color
      doc.text('SOLIDTRACK', 15, 15);

      // Add subtitle
      doc.setFontSize(16);
      doc.setTextColor(0); // Black
      doc.text('Order Report', 15, 25);
      
      // Add metadata
      doc.setFontSize(10);
      doc.setTextColor(100); // Gray
      doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 32);
      doc.text(`Sorted by: ${sortConfig.key} (${sortConfig.direction === 'asc' ? 'Ascending' : 'Descending'})`, 15, 37);
      
      // Add filters in the metadata
      let yPos = 42;
      
      // Add month filter if selected
      if (selectedMonth !== null) {
        const monthName = monthOptions.find(m => m.value === selectedMonth)?.label;
        doc.text(`Month: ${monthName}`, 15, yPos);
        yPos += 5;
      }
      
      // Add status filter if not all
      if (selectedStatus !== "all") {
        doc.text(`Status: ${selectedStatus}`, 15, yPos);
        yPos += 5;
      }

      let yOffset = yPos + 8;

      if (selectedReports.orders) {
        const headers = [['Order ID', 'Customer', 'Status',  'Order Date', 'Total Amount', 'Remaining Balance']];
        const data = filteredData.map(order => [
          `#${order.order_id}`,
          order.customer_name || 'N/A',
          order.status || 'N/A',
          
          formatDate(order.created_at),
          `Rs. ${parseFloat(order.total_amount || 0).toFixed(2)}`,
          `Rs. ${parseFloat(order.remain_balance/100 || 0).toFixed(2)}`
        ]);

        autoTable(doc, {
          startY: yOffset,
          head: headers,
          body: data,
          theme: 'grid',
          styles: { 
            fontSize: 8, // Smaller font size to fit more columns
            cellPadding: 2
          },
          headStyles: { 
            fillColor:  [20, 80, 200],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [240, 248, 240]
          },
          columnStyles: {
            0: { cellWidth: 15 }, // Order ID
            1: { cellWidth: 30 }, // Customer
            2: { cellWidth: 20 }, // Status
            3: { cellWidth: 25 }, // Delivery Date
            4: { cellWidth: 25 }, // Order Date
            5: { cellWidth: 25 }, // Total Amount
            6: { cellWidth: 25 }  // Remaining Balance
          }
        });

        yOffset = doc.lastAutoTable.finalY + 15;
        
        // Add summary
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Total Orders: ${data.length}`, 15, yOffset);
        
        // Calculate total revenue properly
        const totalRevenue = filteredData.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
        doc.text(`Total Revenue: Rs. ${totalRevenue.toFixed(2)}`, 15, yOffset + 7);
        
        // Add footer with page numbers
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(100);
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.text(
            `Page ${i} of ${pageCount}`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
          );
        }
      }

      // For preview, return the doc object
      if (pdfRef.current) {
        return doc;
      }
      
      // For download
      const fileName = `SOLIDTRACK-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      return doc;
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF: ' + err.message);
      return null;
    }
  };

  const generatePDFPreview = async () => {
    try {
      pdfRef.current = true;
      const doc = await generatePDF();
      pdfRef.current = null;
      
      if (doc) {
        const pdfData = doc.output('datauristring');
        setPdfPreviewUrl(pdfData);
      }
    } catch (err) {
      console.error('Error generating PDF preview:', err);
    }
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
  };
  
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  const handleClearFilters = () => {
    setSelectedMonth(null);
    setSelectedStatus("all");
  };

  return (
    <div className="grid-container">
      <Header />
      <Sidebar />
    <div className="reports-container">
      <h2 className="reports-header">Order Reports</h2>

      <div className="reports-options">
        <h3 className="section-title">Select Reports to Export</h3>
        <div className="checkbox-group">
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={selectedReports.orders}
              onChange={() => handleCheckboxChange('orders')}
            />
            Order Report
          </label>
        </div>

        <div className="filter-section">
          <h4>Filter Options:</h4>
          
          <div className="filter-row">
            <div className="filter-column">
              <label>Month:</label>
              <Select
                style={{ width: 150, marginRight: '10px' }}
                placeholder="Select Month"
                value={selectedMonth}
                onChange={handleMonthChange}
              >
                {monthOptions.map(option => (
                  <Option key={option.value !== null ? option.value : 'all'} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>
            
            <div className="filter-column">
              <label>Order Status:</label>
              <Select
                style={{ width: 150, marginRight: '10px' }}
                value={selectedStatus}
                onChange={handleStatusChange}
              >
                {statusOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
          
          <button 
            className="clear-filter-btn"
            onClick={handleClearFilters}
          >
            Clear All Filters
          </button>
        </div>

        <div className="sort-options">
          <h4>Sort by:</h4>
          <button
            className={`sort-button ${sortConfig.key === 'customer_name' ? 'active' : ''}`}
            onClick={() => handleSort('customer_name')}
          >
            Customer {getSortIcon('customer_name')}
          </button>
          <button
            className={`sort-button ${sortConfig.key === 'status' ? 'active' : ''}`}
            onClick={() => handleSort('status')}
          >
            Status {getSortIcon('status')}
          </button>
          <button
            className={`sort-button ${sortConfig.key === 'delivery_date' ? 'active' : ''}`}
            onClick={() => handleSort('delivery_date')}
          >
            Delivery Date {getSortIcon('delivery_date')}
          </button>
          <button
            className={`sort-button ${sortConfig.key === 'created_at' ? 'active' : ''}`}
            onClick={() => handleSort('created_at')}
          >
            Order Date {getSortIcon('created_at')}
          </button>
          <button
            className={`sort-button ${sortConfig.key === 'total_amount' ? 'active' : ''}`}
            onClick={() => handleSort('total_amount')}
          >
            Total Amount {getSortIcon('total_amount')}
          </button>
          <button
            className={`sort-button ${sortConfig.key === 'remain_balance' ? 'active' : ''}`}
            onClick={() => handleSort('remain_balance')}
          >
            Remaining Balance {getSortIcon('remain_balance')}
          </button>
        </div>

        {filteredData.length > 0 && Object.values(selectedReports).some(value => value) && (
          <div className="preview-section">
            <h3 className="section-title">Preview</h3>
            
            <div className="table-wrapper">
              <table className="preview-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Order Date</th>
                    <th>Total Amount</th>
                    <th>Remaining Balance</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((order) => (
                    <tr key={order.order_id}>
                      <td>#{order.order_id}</td>
                      <td>{order.customer_name || 'N/A'}</td>
                      <td>{order.status || 'N/A'}</td>
                      <td>{formatDate(order.created_at)}</td>
                      <td>Rs. {parseFloat(order.total_amount || 0).toFixed(2)}</td>
                      <td>Rs. {parseFloat(order.remain_balance/100 || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredData.length === 0 && (
              <div className="no-data-message">
                No orders match the selected filters. Try adjusting your filter criteria.
              </div>
            )}
            
            {pdfPreviewUrl && (
              <div className="pdf-preview-container">
                <h4>PDF Preview</h4>
                <iframe 
                  src={pdfPreviewUrl} 
                  className="pdf-preview"
                  title="PDF Preview"
                />
              </div>
            )}
          </div>
        )}

        <div className="action-buttons">
          <button
            className="export-button"
            onClick={() => {
              pdfRef.current = false;
              generatePDF();
            }}
            disabled={loading || !Object.values(selectedReports).some(value => value) || filteredData.length === 0}
          >
            {loading ? <FaSpinner className="spinner" /> : <FaFileExport />} Download PDF
          </button>
        </div>
      </div>

      {loading && <div className="loading">Loading report data...</div>}
      {error && <div className="error">{error}</div>}
    </div>
    </div>
  );
};

export default OrderReports;