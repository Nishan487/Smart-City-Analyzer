import React, { useEffect, useState } from "react";

export default function Traffic() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("table"); // "table" or "graph"

  const fetchTrafficData = () => {
    fetch("http://127.0.0.1:5000/traffic/") // Flask API endpoint
      .then((res) => res.json())
      .then((json) => {
        console.log("✅ Fetched Traffic Data:", json);
        if (Array.isArray(json)) setData(json);
        else if (json.data) setData(json.data);
        else setData([]);
      })
      .catch((err) => console.error("❌ Error fetching traffic data:", err))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchTrafficData();
    const interval = setInterval(fetchTrafficData, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  const displayedColumns = ["Time", "Total", "Traffic Situation"];

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        🚦 Traffic Monitoring Dashboard
      </h2>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 0 10px rgba(0,0,0,0.15)",
        }}
      >
        <button
          onClick={() => setActiveTab("table")}
          style={{
            flex: 1,
            padding: "10px 20px",
            border: "none",
            backgroundColor: activeTab === "table" ? "#007bff" : "#ccc",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
        >
          Traffic Table
        </button>
        <button
          onClick={() => setActiveTab("graph")}
          style={{
            flex: 1,
            padding: "10px 20px",
            border: "none",
            backgroundColor: activeTab === "graph" ? "#007bff" : "#ccc",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
        >
          Graph
        </button>
      </div>

      {/* Main Content */}
      <div
        style={{
          width: "90%",
          maxWidth: "900px",
          height: "60vh",
          border: "1px solid #ccc",
          borderRadius: "10px",
          backgroundColor: "#ede4e4",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {activeTab === "table" ? (
          loading ? (
            <p>Loading traffic data...</p>
          ) : data.length === 0 ? (
            <p>No traffic data available in the last 24 hours.</p>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                overflowY: "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                }}
              >
                <thead
                  style={{
                    backgroundColor: "#212529",
                    color: "white",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                  }}
                >
                  <tr>
                    {displayedColumns.map((col) => (
                      <th
                        key={col}
                        style={{
                          padding: "10px",
                          border: "1px solid #ccc",
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr
                      key={i}
                      style={{
                        backgroundColor: i % 2 === 0 ? "#2978c7" : "#b03232",
                        transition: "background 0.2s",
                        border: "1px solid #ccc",
                        color: "white",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#072646")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          i % 2 === 0 ? "#2978c7" : "#b03232")
                      }
                    >
                      {displayedColumns.map((col) => (
                        <td
                          key={col}
                          style={{ padding: "8px", border: "1px solid #ccc" }}
                        >
                          {row[col] ?? "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div style={{ textAlign: "center" }}>
            <h3>📊 Traffic Graph will appear here</h3>
            <p>(You’ll see a chart of total vehicles over time soon!)</p>
          </div>
        )}
      </div>
    </div>
  );
}
