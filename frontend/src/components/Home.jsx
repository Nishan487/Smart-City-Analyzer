import React from 'react'
import DataCard from './DataCard'
import { FaTrafficLight } from "react-icons/fa";
import { TbWind } from "react-icons/tb";
import { SlEnergy } from "react-icons/sl";
import './Home.css';

const Home = () => {
  return (
    <div className='home'>
      <h2>Smart City Analytics DrashBoard</h2>
      <p>Welcome! Track key metrics in real-time</p>
      <div className='traffic'>
      <DataCard 
      title="Traffic"
      latestValue="20"
      latestTime='8. pm'
      icon={<FaTrafficLight style={{color:'yellow'}}/>}
      color='yellow'
      />
      </div>
      <div className='airquality'>
      <DataCard 
      title="AirQuality"
      latestValue="25"
      latestTime='8:30 pm'
      icon={<TbWind style={{color:'Green'}}/>}
      color="green"
      />
      </div>

      <div className='airquality'>
      <DataCard 
      title="EnergyConsumption"
      latestValue="50kw"
      latestTime='10:pm'
      icon={<SlEnergy style={{color:'blue'}}/>}
      color="blue"
      />
      </div>


      <div >
        <button 
          onClick={() => handleNavigation("/traffic")}
        >
          Traffic Page
        </button>
        <button 
          onClick={() => handleNavigation("/airquality")}
          
        >
          AirQuality Page
        </button>
        <button 
          onClick={() => handleNavigation("/energy")}
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