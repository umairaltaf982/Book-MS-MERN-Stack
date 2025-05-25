import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { adminService } from '../../services/api'

function AdminRegister() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [redirect, setRedirect] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await adminService.register({ email, password })
      console.log('Register response:', response.data)
      
      if (response.data && response.data.success) {
        setRedirect(true)
      } else {
        setError('Registration failed. Please try again.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (redirect) {
    return <Navigate to="/admin/login" />
  }

  return (
    <div className="login-container">
      <h1>Admin Registration</h1>
      
      <form className="login-form" onSubmit={handleRegister}>
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button 
          className="login-button" 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        {error && <div className="login-error">{error}</div>}
      </form>
      <p className="login-register-link">
        Already have an admin account? <Link to="/admin/login">Login</Link>
      </p>
      <p className="login-register-link">
        <Link to="/">Back to Home</Link>
      </p>
    </div>
  )
}

export default AdminRegister
