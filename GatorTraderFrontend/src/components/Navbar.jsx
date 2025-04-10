import React from 'react'
import{ Link } from 'react-router-dom';

function Navbar() {
  return (
    
<nav className="navbar">
            <div className="navbar__container">
                <h1 className="navbar__logo">GatorTrader</h1>
                <ul className="navbar__menu">
                    <li className="navbar_item">
                        <Link to="/TrackedStocks" className="navbar__links">Tracked Stocks</Link>
                    </li>
                    <li className="navbar_item">
                        <Link to="/About" className="navbar__links">About</Link>
                    </li>
                    <li className="navbar_item">
                        <Link to="/Learn" className="navbar__links">Learn</Link>
                    </li>
                    <li className="navbar_item">
                        <Link to="/MyProfile" className="navbar__links">My Profile</Link>
                    </li>
                    
                </ul>
            </div>
        </nav>
  )
}

export default Navbar