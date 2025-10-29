import React, { useEffect, useState } from "react";

export default function AirQuality() {
  const [data, setData] = useState([]);
  const [loading,setLoading]=useState(true);
  const [activeTab,setActiveTab]=useState("table");



  const fetchAirQualityData = () => {
    fetch("http://127.0.0.1:5000/airquality/") // Flask API endpoint
      .then(res => res.json())
      .then(json =>{
        console.log("received data",json)
        if(Array.isArray(json)) setData(json);
        else if(json.data) setData(json.data);
        else setData([]);
  })
      .catch(err => console.error("error fetching airquality data",err))
      .finally(()=> setLoading(false));
  }

  useEffect(()=>{
    fetchAirQualityData();
    const interval = setInterval(fetchAirQualityData,60000); // refresh every 60s
    return ()=> clearInterval(interval);
  },[]);

  const displayedColumns = ["Time", "PM2.5", "PM10", "NO2","Temperature","Wind Speed"];


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
  
      <h2 style={{textAlign:"centre",marginButtom:"20px"}}> AirQuality Monitoring DrashBoard</h2>

      <div style={{
        display:"flex",
        justifyContent:"center",
        marginBottom:"10px",
        borderRadius:"10px",
        overflow:"hidden",
        boxShadow:"0 0 10px rgba(0,0,0,0.15)",
      }}>
        <button onClick={()=> setActiveTab("table")}
          style={{
            flex:1,
            padding:"10px 20px",
            border:"none",
            backgroundColor: activeTab==="table" ? "#007bff" : "#ccc",
            color:"white",
            fontWeight:"bold",
            transition:"background 0.3s",
          }}
          > AirQuality Table </button>
          <button
            onClick={() => setActiveTab("Graph")}
            style={{
              flex: 1,
              padding: "10px 20px",
              border: "none",
              backgroundColor: activeTab === "Graph" ? "#007bff" : "#ccc",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
          >
            Graph
          </button>
      </div>
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
            <p>Loading data...</p>
          ): data.length === 0?(
            <p>No air quality data available.</p>
          ):(
            <div 
            style={{
              width:"100%",
              height:"100%",
              overflowY:"auto",
            }} >
              <table style={{width:"100%",borderCollapse:"collapse",textAlign:"left"}}>
                <thead 
                style={{
                  backgroundColor:"#212529",
                  color:"white",
                  position:"sticky",
                  top:0,
                  zIndex:1,
                }} >
                  <tr>
                    {displayedColumns.map((col)=>(
                      <th
                        key={col}
                        style={{
                          padding:"10px",
                          border:"1px solid #ccc"
                        }}
                      >{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row,i)=>(
                    <tr 
                     key={i}
                     style={{
                      backgroundColor: i%2===0? "#2978c7" : "#b03232",
                      transition:"background 0.2s",
                      color:"white",     
                     }} 
                     onMouseEnter={(e)=>(e.currentTarget.style.background="#072646")}
                     onMouseLeave={(e)=>(e.currentTarget.style.background=
                      i%2===0 ? "#2978c7" : "#b03232")}
                     >
                      {displayedColumns.map((col)=>(
                        <td 
                          key={col}
                          style={{padding:"8px",border:"1px solid #ccc"}}>
                          {row[col] ?? "-"}
                          </td>
                      ))}
                      </tr>
                  ))}
                </tbody>


                </table>
               </div>
          )
        ):(
          <p>Graph view coming soon...</p>
        )}


      </div>
     
    </div>
  );
}