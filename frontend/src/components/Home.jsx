import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataCard from './DataCard';
import { FaTrafficLight } from "react-icons/fa";
import { TbWind } from "react-icons/tb";
import { SlEnergy } from "react-icons/sl";
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const handleNavigation = (path) => navigate(path);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [energyConsumption, setEnergyConsumption] = useState("N/A");
  const [airQuality,setAirQuality]=useState("N/A");
  const [traffic,setTraffic]=useState("N/A");

  const fetchData = (url,setter,key) => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log("Full API response:", data);

        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          const latest = data.data[data.data.length - 1];
          setter(latest[key] ?? "N/A");
        } else {
          console.warn("⚠ No energy data found in response");
          setter("N/A");
        }
      })
      .catch(err => {
        console.error("❌ Error fetching energy consumption:", err);
        setter("N/A");
      });
  };

  useEffect(() => {
    fetchData("http://127.0.0.1:5000/energyconsumption/",setEnergyConsumption,"biofuel_electricity");
    fetchData("http://127.0.0.1:5000/airquality/", setAirQuality, "PM2.5"); 
    fetchData("http://127.0.0.1:5000/traffic/", setTraffic, "Total"); 

    const interval = setInterval(() => {
      setCurrentTime(new Date());

      fetchData("http://127.0.0.1:5000/energyconsumption/",setEnergyConsumption,"biofuel_electricity");
      fetchData("http://127.0.0.1:5000/airquality/", setAirQuality, "PM2.5"); 
      fetchData("http://127.0.0.1:5000/traffic/", setTraffic, "Total"); 

    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString();

  return (
    <div className='home'>
      <h2>Smart City Analytics Dashboard</h2>
      <p>Welcome! Track key metrics in real-time</p>

      <div className='traffic'>
        <DataCard 
          title="Traffic"
          latestValue={traffic+" vehicles"}
          latestTime={formattedTime}
          icon={<FaTrafficLight style={{color:'yellow'}} />}
          color="yellow"
        />
      </div>

      <div className='airquality'>
        <DataCard 
          title="AirQuality"
          latestValue={airQuality+" µg/m³"}
          latestTime={formattedTime}
          icon={<TbWind style={{color:'green'}} />}
          color="green"
        />
      </div>

      <div className='airquality'>
        <DataCard 
          title="EnergyConsumption"
          latestValue={energyConsumption+" kWh"}
          latestTime={formattedTime}
          icon={<SlEnergy style={{color:'blue'}} />}
          color="blue"
        />
      </div>

      <div className='navigation-buttons'>
        <button onClick={() => handleNavigation("/traffic/")}>Traffic Page</button>
        <button onClick={() => handleNavigation("/airquality/")}>AirQuality Page</button>
        <button onClick={() => handleNavigation("/energyconsumption/")}>Energy Page</button>
      </div>

      <footer>
        <p>Showing mock data due to server connection issues.</p>
        <p>Run backend at 127.0.0.1:5000 to get live data.</p>
      </footer>
    </div>
  );
};

export default Home;
