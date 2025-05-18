import { useState } from 'react'
import { Link } from 'react-router-dom'
import { userService } from '../services/api'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [step, setStep] = useState(1) // 1: Email entry, 2: OTP verification
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const handleSendOtp = async () => {
    try {
      setError(null)
      const response = await userService.forgotPassword(email)
      setMessage(response.data.message)
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP')
      console.error(err)
    }
  }

  const handleResetPassword = async () => {
    try {
      setError(null)
      const response = await userService.resetPassword({
        email,
        otp,
        newPassword
      })
      setMessage(response.data.message)
      // Redirect to login after 3 seconds
      setTimeout(() => {
        window.location.href = '/login'
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password')
      console.error(err)
    }
  }

  return (
    <div className="login-container">
      <h1>Forgot Password</h1>
      
      {step === 1 ? (
        <div className="login-form">
          <p>Enter your email address to receive a password reset OTP</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button className="login-button" onClick={handleSendOtp}>Send OTP</button>
        </div>
      ) : (
        <div className="login-form">
          <p>Enter the OTP sent to your email and your new password</p>
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <button className="login-button" onClick={handleResetPassword}>Reset Password</button>
        </div>
      )}
      
      {error && <div className="login-error">{error}</div>}
      {message && <div className="login-message">{message}</div>}
      
      <p className="login-register-link">
        <Link to="/login">Back to Login</Link>
      </p>
    </div>
  )
}

export default ForgotPassword