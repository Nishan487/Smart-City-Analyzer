import React from 'react'
import { useState,useEffect } from 'react';
import DataCard from './DataCard'
import { FaTrafficLight } from "react-icons/fa";
import { TbWind } from "react-icons/tb";
import { SlEnergy } from "react-icons/sl";
import './Home.css';

const Home = () => {

//   const [traffic, setTraffic] = useState({});
//   const [airQuality, setAirQuality] = useState({});
//   const [energy, setEnergy] = useState({});

//   useEffect(() => {
//   const fetchData = async () => {
//     const [a, t, e] = await Promise.all([
//       fetch("http://127.0.0.1:5000/airquality/").then(r => r.json()),
//       fetch("http://127.0.0.1:5000/traffic/").then(r => r.json()),
//       fetch("http://127.0.0.1:5000/energyconsumption/").then(r => r.json())
//     ]);
//     setAirQuality(a);
//     setTraffic(t);
//     setEnergy(e);
//   };

//   fetchData();
//   const interval = setInterval(fetchData, 5000);
//   return () => clearInterval(interval);
// }, []);
  return (
    <div className='home'>
      <h2>Smart City Analytics DrashBoard</h2>
      <p>Welcome! Track key metrics in real-time</p>
      <div className='traffic'>
      <DataCard 
      title="Traffic"
      latestValue="0"
      latestTime="0"
      icon={<FaTrafficLight style={{color:'yellow'}}/>}
      color='yellow'
      />
      </div>
      <div className='airquality'>
      <DataCard 
      title="AirQuality"
      latestValue="0"
      latestTime="0"
      icon={<TbWind style={{color:'Green'}}/>}
      color="green"
      />
      </div>

      <div className='airquality'>
      <DataCard 
      title="EnergyConsumption"
      latestValue="0"
      latestTime="0"
      icon={<SlEnergy style={{color:'blue'}}/>}
      color="blue"
      />
      </div>


      <div >
        <button 
          onClick={() => handleNavigation("/traffic/")}
        >
          Traffic Page
        </button>
        <button 
          onClick={() => handleNavigation("/airquality/")}
          
        >
          AirQuality Page
        </button>
        <button 
          onClick={() => handleNavigation("/energyconsumption/")}
        >
          Energy Page
        </button>
      </div>

      {/* Footer / Mock Status */}
      <footer>
        <p>Showing mock data due to server connection issues.</p>
        <p>If you run this application outside of this environment with the correct server running at `http://127.0.0.1:5000/`, it will use the live data.</p>
      </footer>




    </div>

    
  )
}

export default Home