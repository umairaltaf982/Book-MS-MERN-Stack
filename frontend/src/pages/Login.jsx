import { useState } from 'react'
import { Link } from 'react-router-dom'
import { userService } from '../services/api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await userService.login({ email, password })
      console.log('Login response:', response.data)

      // Make sure the token exists in the response
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token)
        window.location.href = '/'
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

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
  }

  return (
    <div className="login-container">
      <h1>Login</h1>
      <button className="google-login-button" onClick={handleGoogleLogin}>
        Continue with Google
      </button>

      <div className="login-divider">
        <span>OR</span>
      </div>

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
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      <p className="login-register-link">
        Forgot Password? <Link to="/forgot-password">Click Here</Link>
      </p>
    </div>
  )
}

export default Login
