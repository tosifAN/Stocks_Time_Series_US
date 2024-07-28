import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './App.css';

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [formData, setFormData] = useState({
    funct: 'TIME_SERIES_INTRADAY',
    interval: '5min'
  });

  const [symbol, setSymbol] = useState('');
  const [chartData, setChartData] = useState(null);

  // List of company symbols
  const companySymbols = [
    { name: 'Apple Inc.', symbol: 'AAPL' },
    { name: 'Microsoft Corporation', symbol: 'MSFT' },
    { name: 'Amazon.com, Inc.', symbol: 'AMZN' },
    { name: 'Alphabet Inc. (Class A)', symbol: 'GOOGL' },
    { name: 'Alphabet Inc. (Class C)', symbol: 'GOOG' },
    { name: 'Facebook, Inc. (Meta Platforms Inc.)', symbol: 'META' },
    { name: 'Tesla, Inc.', symbol: 'TSLA' },
    { name: 'NVIDIA Corporation', symbol: 'NVDA' },
    { name: 'Berkshire Hathaway Inc. (Class A)', symbol: 'BRK.A' },
    { name: 'Berkshire Hathaway Inc. (Class B)', symbol: 'BRK.B' },
    { name: 'Johnson & Johnson', symbol: 'JNJ' },
    { name: 'Visa Inc.', symbol: 'V' },
    { name: 'Walmart Inc.', symbol: 'WMT' },
    { name: 'Procter & Gamble Co.', symbol: 'PG' },
    { name: 'Mastercard Incorporated', symbol: 'MA' },
    { name: 'UnitedHealth Group Incorporated', symbol: 'UNH' },
    { name: 'JPMorgan Chase & Co.', symbol: 'JPM' },
    { name: 'Home Depot, Inc.', symbol: 'HD' },
    { name: 'Samsung Electronics Co., Ltd.', symbol: 'SSNLF' },
    { name: 'Alibaba Group Holding Limited', symbol: 'BABA' }
  ];

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSymbolChange = (e) => {
    setSymbol(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { funct, interval } = formData;
    const apiKey = '1OQW6ED7M11BYNDR'; // Replace with your actual API key

    try {
      const url = `https://www.alphavantage.co/query?function=${funct}&symbol=${symbol}&interval=${interval}&apikey=${apiKey}`;
      const response = await axios.get(url);

      // Log response to verify structure
      console.log(response.data);

      // Ensure timeSeries exists
      const timeSeries = response.data[`Time Series (${interval})`];
      if (!timeSeries) {
        console.error('No time series data found.');
        setChartData(null);
        return;
      }

      const labels = Object.keys(timeSeries).reverse();
      const data = Object.values(timeSeries).map(item => parseFloat(item['4. close'])).reverse();

      setChartData({
        labels,
        datasets: [
          {
            label: `Stock Prices for ${symbol}`,
            data,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false,
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setChartData(null); // Clear chartData if there was an error
    }
  };

  return (
    <div className="App">
      <div className="form-container">
        <h1>Time Series Stock Selection</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Select Company:
              <select value={symbol} onChange={handleSymbolChange} required>
                <option value="">Select a symbol</option>
                {companySymbols.map((company, index) => (
                  <option key={index} value={company.symbol}>
                    {company.name}: {company.symbol}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label>
              Interval:
              <select name="interval" value={formData.interval} onChange={handleFormChange} required>
                <option value="1min">1min</option>
                <option value="5min">5min</option>
                <option value="15min">15min</option>
                <option value="30min">30min</option>
                <option value="60min">60min</option>
              </select>
            </label>
          </div>
          <button type="submit">Show</button>
        </form>
      </div>
      {chartData && (
        <div className="chart-container">
          <h2>Stock Price Chart</h2>
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
}

export default App;
