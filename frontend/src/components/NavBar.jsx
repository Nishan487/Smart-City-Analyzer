import React from 'react'
import './NavBar.css'
import Traffic from './Traffic'
import {NavLink} from 'react-router-dom'
const NavBar = () => {
  return (
    <div className='navbar'>
        <nav>
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