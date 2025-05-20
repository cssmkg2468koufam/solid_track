import React from 'react';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

// Enhanced chart configurations
const chartOptions = {
  // Bar chart options for Orders by Month
  bar: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 15,
          usePointStyle: true,
          font: {
            size: 12,
            family: "'Poppins', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 13,
          family: "'Poppins', sans-serif"
        },
        bodyFont: {
          size: 12,
          family: "'Poppins', sans-serif"
        },
        padding: 10,
        cornerRadius: 6,
        displayColors: true
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11,
            family: "'Poppins', sans-serif"
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11,
            family: "'Poppins', sans-serif"
          },
          maxTicksLimit: 5
        }
      }
    }
  },
  
  // Pie chart options for Products by Category
  pie: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          padding: 20,
          font: {
            size: 11,
            family: "'Poppins', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 13,
          family: "'Poppins', sans-serif"
        },
        bodyFont: {
          size: 12,
          family: "'Poppins', sans-serif"
        },
        padding: 10,
        cornerRadius: 6,
        displayColors: true
      }
    }
  },
  
  // Line chart options for Customer Growth
  line: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 15,
          usePointStyle: true,
          font: {
            size: 12,
            family: "'Poppins', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 13,
          family: "'Poppins', sans-serif"
        },
        bodyFont: {
          size: 12,
          family: "'Poppins', sans-serif"
        },
        padding: 10,
        cornerRadius: 6,
        displayColors: true
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11,
            family: "'Poppins', sans-serif"
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11,
            family: "'Poppins', sans-serif"
          },
          maxTicksLimit: 5
        },
        beginAtZero: true
      }
    }
  }
};

// Enhanced dataset styling for each chart type
const enhanceOrdersChart = (data) => {
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Orders',
        data: data,
        backgroundColor: 'rgba(66, 133, 244, 0.6)',
        borderColor: 'rgba(66, 133, 244, 1)',
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(66, 133, 244, 0.8)',
      },
    ],
  };
};

const enhanceProductsChart = (data) => {
  return {
    labels: data.map(item => item.category),
    datasets: [
      {
        label: 'Products by Category',
        data: data.map(item => item.count),
        backgroundColor: [
          'rgba(66, 133, 244, 0.7)',  // Blue
          'rgba(255, 153, 0, 0.7)',   // Orange
          'rgba(70, 189, 106, 0.7)',  // Green
          'rgba(235, 77, 75, 0.7)',   // Red
          'rgba(153, 102, 255, 0.7)', // Purple
        ],
        borderColor: [
          'rgba(66, 133, 244, 1)',
          'rgba(255, 153, 0, 1)',
          'rgba(70, 189, 106, 1)',
          'rgba(235, 77, 75, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
        hoverOffset: 6,
      },
    ],
  };
};

const enhanceCustomersChart = (data) => {
  return {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'New Customers',
        data: data,
        backgroundColor: 'rgba(70, 189, 106, 0.3)',
        borderColor: 'rgba(70, 189, 106, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(70, 189, 106, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: 'rgba(70, 189, 106, 1)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      },
    ],
  };
};

// Export enhanced chart configurations
export const chartConfigs = {
  options: chartOptions,
  enhanceOrdersChart,
  enhanceProductsChart,
  enhanceCustomersChart
};

export default chartConfigs;