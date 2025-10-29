import React from 'react'
import './NavBar.css'
import {NavLink} from 'react-router-dom'
import { FaCity } from "react-icons/fa";

const NavBar = () => {
  return (
    <div className='navbar'>
      <FaCity className='logo'/>
      <a href='/' className='logos'>Smart City Analytics</a>
        <nav>
          <NavLink to="/" className='NavLink'>Home</NavLink>
          
        <NavLink to="/traffic/" className='NavLink'>
            {/* <a href='/traffic/'>Traffic Data</a>
            <a href='/airquality/'>Air Quality </a>
            <a href='/energyconsumption/'>Energy-Consumption</a> */}
          Traffic Page
        </NavLink>
        <NavLink to="/airquality/" className='NavLink'>Air Quality</NavLink>
        <NavLink to="/energyconsumption/" className='NavLink'> Energy-Consumption</NavLink>
        </nav>
    </div>
  )
}

export default NavBar