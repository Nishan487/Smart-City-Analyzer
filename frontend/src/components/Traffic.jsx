import React, { useEffect, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import "./Traffic.css";

// Register Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

const parseTime = (timeString) => new Date(timeString);

export default function Traffic() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("graph");

  // 🔹 Fetch traffic data from backend
  const fetchTrafficData = () => {
    fetch("http://127.0.0.1:5000/traffic/")
      .then((res) => res.json())
      .then((json) => {
        const fetchedData = Array.isArray(json) ? json : json.data || [];
        setData(fetchedData);
      })
      .catch((err) => console.error("❌ Error fetching traffic data:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTrafficData();
    const interval = setInterval(fetchTrafficData, 60000); // refresh every 1 minute
    return () => clearInterval(interval);
  }, []);

  // 🔹 Filter data for last 8 hours
  const filteredData = useMemo(() => {
    if (data.length === 0) return [];
    const now = new Date();
    const eightHoursAgo = new Date(now.getTime() - 8 * 60 * 60 * 1000);
    return data.filter((row) => parseTime(row.Time) >= eightHoursAgo);
  }, [data]);

  // 🔹 Split actual and predicted data
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

  const displayedColumns = ["Time", "Total", "Traffic Situation"];

  // 🧠 Prepare chart data
  const chartData = {
    labels: filteredData.map((row) => parseTime(row.Time)),
    datasets: [
      {
        label: "Actual Vehicle Count",
        data: actualData.map((row) => row.Total),
        borderColor: "green",
        backgroundColor: "rgba(0, 128, 0, 0.1)",
        pointBackgroundColor: "green",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Predicted Vehicle Count (Next 3 Hours)",
        data: predictedData.map((row) => row.Total),
        borderColor: "orange",
        backgroundColor: "rgba(255, 165, 0, 0.1)",
        borderDash: [6, 6],
        pointBackgroundColor: "orange",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // 🎨 Chart styling and scaling
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    animation: {
      duration: 800,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: { color: "#333", font: { size: 14 } },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => `Total: ${context.parsed.y} vehicles`,
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "hour",
          displayFormats: {
            hour: "h:mm a",
          },
          tooltipFormat: "MMM d, h:mm a",
        },
        grid: { color: "rgba(0,0,0,0.1)" },
        ticks: { color: "#444", font: { size: 12 } },
        title: {
          display: true,
          text: "Time (Last 8 Hours)",
          color: "#222",
          font: { weight: "bold" },
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { color: "#444" },
        title: {
          display: true,
          text: "Total Vehicles",
          color: "#222",
          font: { weight: "bold" },
        },
      },
    },
  };

  return (
    <div className="traffic-container">
      <h2 className="traffic-title">🚦 Live Traffic Monitoring (Last 8 Hours)</h2>

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

      <div className="traffic-content">
        {activeTab === "table" ? (
          loading ? (
            <p>Loading traffic data...</p>
          ) : filteredData.length === 0 ? (
            <p>No recent traffic data.</p>
          ) : (
            <div className="table-wrapper">
              <table className="traffic-table">
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
