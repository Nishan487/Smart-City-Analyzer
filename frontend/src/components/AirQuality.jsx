import React, { useEffect, useState } from "react";

export default function AirQuality() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/airquality/") // Flask API endpoint
      .then(res => res.json())
      .then(json =>
        // console.log("received data",json)
        setData(json)
        )
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>AirQuality Data</h2>
      {data.length==0 ?( 
        <p> Loading or no dataFound</p>
       ):(
      <table border="1" cellPadding='5'>
        <thead>
          <tr>
            {data[0] && Object.keys(data[0]).map(col => <th key={col}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {Object.values(row).map((val, j) => <td key={j}>{val}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  );
}