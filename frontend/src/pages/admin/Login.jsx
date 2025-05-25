import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { adminService } from '../../services/api'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [redirect, setRedirect] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const response = await adminService.login({ email, password })
      console.log('Login response:', response.data)
      
      // Make sure the token exists in the response
      if (response.data && response.data.token) {
        localStorage.setItem('adminToken', response.data.token)
        setRedirect(true)
      } else {
        setError('Invalid response from server. Please try again.')
        console.error('No token in response:', response.data)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (redirect) {
    return <Navigate to="/admin/dashboard" />
  }

  return (
    <div className="login-container">
      <h1>Admin Login</h1>
      
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button 
          className="login-button" 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <div className="login-error">{error}</div>}
      </form>
      <p className="login-register-link">
        Don't have an admin account? <Link to="/admin/register">Register</Link>
      </p>
      <p className="login-register-link">
        <Link to="/">Back to Home</Link>
      </p>
    </div>
  )
}

export default AdminLogin
