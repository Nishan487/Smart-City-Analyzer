import React from 'react'
import { useEffect,useState,useMemo } from 'react'
import {Line} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    TimeScale,
    CategoryScale,
    LinearScale,
    Legend,
    Tooltip,
    Filler,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import './Energy.css';
// Register Chart.js components
ChartJS.register(
    LineElement,
    PointElement,
    CategoryScale,
    TimeScale,
    LinearScale,
    Legend,
    Tooltip,
    Filler,
);
const parseTime=(timeString)=> new Date (timeString);

export default function Energy() {
    const [data,setData]=useState([]);
    const [loading,setLoading]=useState(true);
    const [activeTab,setActiveTab]=useState('table');

    

    const fetchEnergyData=()=>{
        fetch("http://127.0.0.1:5000/energyconsumption/")
        .then((res)=>res.json())
        .then(json=>{
            const fetchedData = Array.isArray(json)?json:json.data || [];
            setData(fetchedData);
        })
        .catch((err)=>console.error("❌ Error fetching energy consumption data:",err))
        .finally(()=>setLoading(false));
    }
    useEffect(()=>{
        fetchEnergyData();
        const interval= setInterval(fetchEnergyData,60000);
        return ()=> clearInterval(interval);

    },[])

    const filteredData = useMemo(()=>{
        if(data.length===0) return [];
        const now = new Date();
        const eightHoursAgo = new Date(now.getTime()-8*60*60*1000);
        return data.filter((row)=> parseTime (row.Time) >= eightHoursAgo);
    },[data]);

    const actualData = useMemo(()=>{
        const now = new Date();
        const threehourago = new Date(now.getTime()-3*60*60*1000);
        return filteredData.filter((row)=> parseTime (row.Time) < threehourago);
    },[filteredData]);

    const predictedData = useMemo(()=>{
        const now = new Date();
        const threehourago = new Date(now.getTime()-3*60*60*1000);
        return filteredData.filter((row)=> parseTime (row.Time) >= threehourago);
    },[filteredData]);

    const displayColumns=['Time','biofuel_electricity'];
    const chartData = {
    labels: filteredData.map((row) => parseTime(row.Time)),
    datasets: [
      {
        label: "Actual",
        data: actualData.map((row) => row.biofuel_electricity),
        borderColor: "green",
        backgroundColor: "rgba(0, 128, 0, 0.1)",
        pointBackgroundColor: "green",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Predicted ",
        data: predictedData.map((row) => row.biofuel_electricity),
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
          label: (context) => `value: ${context.parsed.y}`,
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
          text: "Energy Consumption (kWh)",
          color: "#222",
          font: { weight: "bold" },
        },
      },
    },
  };


  return (
    <div className="energy-container">
        <h2 className="energy-title">🚦 Live energy Monitoring (Last 8 Hours)</h2>
        <div className="tab-buttons">
        <button className={activeTab === "table" ? "active": ""} onClick={()=> setActiveTab ("table")}>
            Table
        </button>
        <button className={activeTab === "graph" ? "active": ""} onClick={()=> setActiveTab ("graph")}>
            Graph
        </button>
        </div>
        <div className="energy-content">
        {activeTab === "table" ? (
            loading ? (
                <p>Loading data...</p>
            ) : filteredData.length ===0 ? (
                <p>No energy consumption data available.</p>
            ) : (
                <div className="table-wrapper">
                    <table className="energy-table">
                        <thead>
                            <tr>
                                {displayColumns.map((col)=>(
                                    <th key={col}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((row,i)=>(
                                <tr key={i}>
                                {displayColumns.map((col)=>(
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
                ) : (
                    <Line data={chartData} options={chartOptions} />
                )}
            </div>
        )}
        </div>

    </div>
  )
}

