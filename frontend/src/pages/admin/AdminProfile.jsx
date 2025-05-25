import { useState } from 'react'

function AdminProfile() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  const handlePasswordChange = async (e) => {
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
    
    // This is a placeholder - you would need to implement the actual API call
    // to change the admin password
    setTimeout(() => {
      setMessage('Password changed successfully')
      setPassword('')
      setConfirmPassword('')
      setCurrentPassword('')
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="admin-profile">
      <h1>Admin Profile</h1>
      
      <div className="profile-section">
        <h2>Change Password</h2>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handlePasswordChange} className="password-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </div>
      
      <div className="profile-section">
        <h2>Admin Information</h2>
        <p>This section would display admin information such as email, role, etc.</p>
      </div>
    </div>
  )
}

export default AdminProfile
