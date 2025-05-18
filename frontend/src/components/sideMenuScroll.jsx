import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import menuIcon from '../assets/menu.png'

function SideMenuScroll() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    // Redirect to home page
    window.location.href = '/'
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="side-menu-scroll">
      <button onClick={handleToggle} className="menu-toggle-btn">
        <img src={menuIcon} alt="Menu" />
      </button>
      <div className={`side-menu ${isOpen ? 'open' : ''}`}>
        {(isLoggedIn ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/bookstores">Bookstores</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/wishlist">Wishlist</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/bookstores">Bookstores</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ))}
      </div>
    </div>
  )
}

export default SideMenuScroll
