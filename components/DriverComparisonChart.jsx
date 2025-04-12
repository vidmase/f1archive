import React, { useState, useEffect } from 'react';
import F1Select from './F1Select';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DriverComparisonChart = () => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver1, setSelectedDriver1] = useState('');
  const [selectedDriver2, setSelectedDriver2] = useState('');
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get('/api/drivers');
        setDrivers(response.data);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };

    fetchDrivers();
  }, []);

  const handleDriver1Change = (event) => {
    setSelectedDriver1(event.target.value);
  };

  const handleDriver2Change = (event) => {
    setSelectedDriver2(event.target.value);
  };

  const handleMetricChange = (event) => {
    const metric = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedMetrics([...selectedMetrics, metric]);
    } else {
      setSelectedMetrics(selectedMetrics.filter((m) => m !== metric));
    }
  };

  const metrics = ["Number of Wins", "Number of Podiums", "Total Points"];

  const fetchData = async () => {
    // Reset comparison data if drivers/metrics are cleared
    if (!selectedDriver1 || !selectedDriver2 || selectedMetrics.length === 0) {
      setComparisonData(null);
      return;
    }

    const driver1Data = {};
    const driver2Data = {};

    // Fetch data for all selected metrics concurrently
    const fetchPromises = selectedMetrics.map(async (metric) => {
      let endpoint = '';
      let dataKey = '';

      switch (metric) {
        case "Number of Wins":
          endpoint = 'driver-wins';
          dataKey = 'wins';
          break;
        case "Number of Podiums":
          endpoint = 'driver-podiums';
          dataKey = 'podiums';
          break;
        case "Total Points":
          endpoint = 'driver-points';
          dataKey = 'totalPoints';
          break;
        default:
          return; // Skip unknown metrics
      }

      try {
        const [response1, response2] = await Promise.all([
          axios.get(`/api/${endpoint}?driverId=${selectedDriver1}`),
          axios.get(`/api/${endpoint}?driverId=${selectedDriver2}`),
        ]);
        driver1Data[metric] = response1.data[dataKey];
        driver2Data[metric] = response2.data[dataKey];
      } catch (error) {
        console.error(`Error fetching ${metric}:`, error);
        // Set data to 0 or null if fetch fails to avoid chart errors
        driver1Data[metric] = 0;
        driver2Data[metric] = 0;
      }
    });

    await Promise.all(fetchPromises);

    const data = {
      driver1: driver1Data,
      driver2: driver2Data,
    };

    setComparisonData(data);
  };

  useEffect(() => {
    fetchData();
  }, [selectedDriver1, selectedDriver2, selectedMetrics]);

  // Chart.js configuration
  const chartData = {
    labels: selectedMetrics,
    datasets: [
      {
        label: drivers.find(driver => driver.driverId === selectedDriver1)?.familyName || 'Driver 1',
        data: selectedMetrics.map(metric => comparisonData?.driver1[metric] || 0),
        backgroundColor: '#DC2626', // Red-600
        borderColor: '#B91C1C', // Red-700
        borderWidth: 1,
      },
      {
        label: drivers.find(driver => driver.driverId === selectedDriver2)?.familyName || 'Driver 2',
        data: selectedMetrics.map(metric => comparisonData?.driver2[metric] || 0),
        backgroundColor: '#6B7280', // Gray-500
        borderColor: '#4B5563', // Gray-600
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#E5E7EB', // Gray-200 for legend text
        },
      },
      title: {
        display: true,
        text: 'Driver Career Comparison',
        color: '#F3F4F6', // Gray-100 for title text
        font: {
          size: 16,
        },
      },
      tooltip: {
        backgroundColor: '#1F2937', // Gray-800
        titleColor: '#F3F4F6', // Gray-100
        bodyColor: '#D1D5DB', // Gray-300
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#D1D5DB', // Gray-300 for x-axis labels
        },
        grid: {
          color: '#374151', // Gray-700 for x-axis grid lines
        },
      },
      y: {
        ticks: {
          color: '#D1D5DB', // Gray-300 for y-axis labels
        },
        grid: {
          color: '#374151', // Gray-700 for y-axis grid lines
        },
      },
    },
  };

  return (
    <div className="bg-gray-900 text-gray-200 p-4 md:p-6 rounded-lg shadow-xl max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-red-500">Driver Comparison</h2>

      {/* Driver Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <F1Select
          label="Select Driver 1"
          options={drivers
            .filter(driver => driver.driverId !== selectedDriver2) // Prevent selecting the same driver
            .map((driver) => ({
              value: driver.driverId,
              label: `${driver.givenName} ${driver.familyName}`,
          }))}
          value={selectedDriver1}
          onChange={handleDriver1Change}
        />
        <F1Select
          label="Select Driver 2"
          options={drivers
            .filter(driver => driver.driverId !== selectedDriver1) // Prevent selecting the same driver
            .map((driver) => ({
              value: driver.driverId,
              label: `${driver.givenName} ${driver.familyName}`,
          }))}
          value={selectedDriver2}
          onChange={handleDriver2Change}
        />
      </div>

      {/* Metric Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-300">Select Metrics to Compare:</h3>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {metrics.map((metric) => (
            <label key={metric} className="flex items-center space-x-2 cursor-pointer text-gray-300 hover:text-white">
              <input
                type="checkbox"
                value={metric}
                checked={selectedMetrics.includes(metric)}
                onChange={handleMetricChange}
                className="form-checkbox h-4 w-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
              />
              <span>{metric}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Chart Display */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-inner min-h-[400px]">
        {comparisonData && selectedDriver1 && selectedDriver2 && selectedMetrics.length > 0 ? (
          <div className="h-[400px]">
            <Bar options={chartOptions} data={chartData} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-[400px] text-gray-500">
            {selectedDriver1 && selectedDriver2 ? "Select metrics to compare" : "Select two drivers to compare"}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverComparisonChart;
