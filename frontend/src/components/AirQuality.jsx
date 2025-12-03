import React, { useEffect, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  TimeScale,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "chartjs-adapter-date-fns";
import "./AirQuality.css";

// Register Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  TimeScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

const parseTime = (timeString) => new Date(timeString);

export default function AirQuality() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("table");

  const fetchAirQualityData = () => {
    fetch("http://127.0.0.1:5000/airquality/")
      .then((res) => res.json())
      .then((json) => {
        const fetchedData = Array.isArray(json) ? json : json.data || [];
        setData(fetchedData);
      })
      .catch((err) => console.error("❌ Error fetching airquality data:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAirQualityData();
    const interval = setInterval(fetchAirQualityData, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredData = useMemo(() => {
    if (data.length === 0) return [];
    const now = new Date();
    const eightHoursAgo = new Date(now.getTime() - 8 * 60 * 60 * 1000);
    return data.filter((row) => parseTime(row.Time) >= eightHoursAgo);
  }, [data]);

  const actualData = useMemo(() => {
    const now = new Date();
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    return filteredData.filter((row) => parseTime(row.Time) < threeHoursAgo);
  }, [filteredData]);

  const predictedData = useMemo(() => {
    const now = new Date();
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    return filteredData.filter((row) => parseTime(row.Time) >= threeHoursAgo);
  }, [filteredData]);

  const displayedColumns = [
    "Time",
    "PM2.5",
    "PM10",
    "NO2",
    "Temperature",
    "Wind Speed",
  ];

  const chartData = {
    labels: filteredData.map((row) => parseTime(row.Time)),
    datasets: [
      {
        label: "PM10 Actual",
        data: actualData.map((row) => row.PM10),
        borderColor: "green",
        backgroundColor: "rgba(0, 128, 0, 0.1)",
        pointBackgroundColor: "green",
        tension: 0.3,
        fill: true,
      },
      {
        label: "PM10 Predicted",
        data: predictedData.map((row) => row.PM10),
        borderColor: "orange",
        backgroundColor: "rgba(255,165,0,0.1)",
        pointBackgroundColor: "orange",
        tension: 0.3,
        fill: true,
        borderDash: [6, 6],
      },
      {
        label: "PM2.5 Actual",
        data: actualData.map((row) => row["PM2.5"]),
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.1)",
        pointBackgroundColor: "blue",
        tension: 0.3,
        fill: true,
      },
      {
        label: "PM2.5 Predicted",
        data: predictedData.map((row) => row["PM2.5"]),
        borderColor: "purple",
        backgroundColor: "rgba(128,0,128,0.1)",
        pointBackgroundColor: "purple",
        tension: 0.3,
        fill: true,
        borderDash: [6, 6],
      },
      {
        label: "NO2 Actual",
        data: actualData.map((row) => row.NO2),
        borderColor: "red",
        backgroundColor: "rgba(255,0,0,0.1)",
        pointBackgroundColor: "red",
        tension: 0.3,
        fill: true,

      },
      {
        label: "NO2 Predicted",
        data: predictedData.map((row) => row.NO2),
        borderColor: "brown",
        backgroundColor: "rgba(165,42,42,0.1)",
        pointBackgroundColor: "brown",
        tension: 0.3,
        fill: true,
        borderDash: [6, 6],

      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    animation: { duration: 800, easing: "easeOutQuart" },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: { color: "#333", font: { size: 14 } },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => `Value: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "hour",
          displayFormats: { hour: "h:mm a" },
          tooltipFormat: "MMM d, h:mm a",
        },
        ticks: { color: "#444" },
        grid: { color: "rgba(0,0,0,0.1)" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#444" },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
    },
  };

  return (
    <div className="air-container">
      <h2 className="air-title">🌫️ Air Quality Monitoring Dashboard</h2>

      <div className="tab-buttons">
        <button
          className={activeTab === "table" ? "active" : ""}
          onClick={() => setActiveTab("table")}
        >
          Table
        </button>

        <button
          className={activeTab === "graph" ? "active" : ""}
          onClick={() => setActiveTab("graph")}
        >
          Graph
        </button>
      </div>

      <div className="air-content">
        {activeTab === "table" ? (
          loading ? (
            <p>Loading data...</p>
          ) : filteredData.length === 0 ? (
            <p>No air quality data available.</p>
          ) : (
            <div className="table-wrapper">
              <table className="air-table">
                <thead>
                  <tr>
                    {displayedColumns.map((col) => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, i) => (
                    <tr key={i}>
                      {displayedColumns.map((col) => (
                        <td key={col}>{row[col] ?? "-"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="chart-wrapper">
            {loading ? (
              <p>Loading chart...</p>
            ) : filteredData.length === 0 ? (
              <p>No data available for chart.</p>
            ) : (
              <Line data={chartData} options={chartOptions} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
