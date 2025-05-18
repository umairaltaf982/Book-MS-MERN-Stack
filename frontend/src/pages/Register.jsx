import { useState } from 'react'
import { Link } from 'react-router-dom'
import { userService } from '../services/api'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      const response = await userService.register({ name, email, password })
      localStorage.setItem('token', response.data.token)
      window.location.href = '/'
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-container">
      <h1>Create Account</h1>
      <form className="login-form" onSubmit={handleRegister}>
        <p>Enter your details to create a new account</p>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={isSubmitting}
          minLength="6"
        />
        <button 
          className="login-button" 
          type="submit"
          disabled={isSubmitting || !name || !email || !password}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
        {error && <div className="login-error">{error}</div>}
      </form>
      <p className="login-register-link">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  )
}

export default Register
