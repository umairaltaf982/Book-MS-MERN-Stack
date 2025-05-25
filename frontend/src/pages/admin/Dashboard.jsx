import { useState, useEffect } from 'react'
import { Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import BookManagement from './BookManagement'
import UserManagement from './UserManagement'
import AdminProfile from './AdminProfile'
import { adminService } from '../../services/api'

function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken')
    if (!token) {
      setIsAuthenticated(false)
      setLoading(false)
      return
    }

    // Verify token validity by making a test API call
    const verifyToken = async () => {
      try {
        // Make a test API call to verify the token
        await adminService.getAllBooks()
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Admin authentication failed:', error)
        // If the API call fails with 401, the token is invalid
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('adminToken')
          setIsAuthenticated(false)
        }
      } finally {
        setLoading(false)
      }
    }

    verifyToken()

    // Check if on mobile and close sidebar by default
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAuthenticated(false)
    navigate('/admin/login')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="admin-dashboard">
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
        ></div>
      )}

      <button
        className="sidebar-toggle-btn"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? '×' : '☰'}
      </button>

      <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="admin-nav">
          <Link
            to="/admin/dashboard"
            className={`admin-nav-item ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}
            onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/books"
            className={`admin-nav-item ${location.pathname.includes('/admin/books') ? 'active' : ''}`}
            onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
          >
            Books
          </Link>
          <Link
            to="/admin/users"
            className={`admin-nav-item ${location.pathname.includes('/admin/users') ? 'active' : ''}`}
            onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
          >
            Users
          </Link>
          <Link
            to="/admin/profile"
            className={`admin-nav-item ${location.pathname === '/admin/profile' ? 'active' : ''}`}
            onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
          >
            Profile
          </Link>
          <button onClick={handleLogout} className="admin-logout-btn">Logout</button>
        </nav>
      </div>

      <div className={`admin-content ${sidebarOpen ? 'with-sidebar' : 'full-width'}`}>
        <div className="admin-content-inner">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="books/*" element={<BookManagement />} />
            <Route path="users/*" element={<UserManagement />} />
            <Route path="profile" element={<AdminProfile />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

function DashboardHome() {
  return (
    <div className="dashboard-home">
      <h1>Welcome to Admin Dashboard</h1>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Books</h3>
          <p>Manage your book inventory</p>
          <Link to="/admin/books" className="stat-link">Manage Books</Link>
        </div>
        <div className="stat-card">
          <h3>Users</h3>
          <p>Manage user accounts</p>
          <Link to="/admin/users" className="stat-link">Manage Users</Link>
        </div>
        <div className="stat-card">
          <h3>Profile</h3>
          <p>Update your admin profile</p>
          <Link to="/admin/profile" className="stat-link">View Profile</Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
