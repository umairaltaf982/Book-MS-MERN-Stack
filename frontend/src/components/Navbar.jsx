import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Searchbar from './Searchbar'

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)

    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken')
    setIsAdminLoggedIn(!!adminToken)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    // Redirect to home page
    window.location.href = '/'
  }

  return (
    <nav className="navbar">
      <div>
      </div>
      <div className="navbar-brand">
        <Link to="/">Book Management System</Link>
      </div>
      <div className="navbar-menu">
        <Searchbar />
        <Link to="/">Home</Link>
        <Link to="/bookstores">Bookstores</Link>

        {isAdminLoggedIn ? (
          <Link to="/admin/dashboard" className="admin-link">Admin Dashboard</Link>
        ) : (
          <Link to="/admin/login" className="admin-link">Admin</Link>
        )}

        {isLoggedIn ? (
          <>
            <Link to="/cart">Cart</Link>
            <Link to="/wishlist">Wishlist</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
