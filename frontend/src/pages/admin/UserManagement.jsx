import { useState, useEffect } from 'react'
import { adminService } from '../../services/api'

function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await adminService.getAllUsers()
      setUsers(response.data.users)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch users')
      setLoading(false)
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }
    
    try {
      await adminService.deleteUser(id)
      setMessage('User deleted successfully')
      // Refresh the user list
      fetchUsers()
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setError('Failed to delete user')
      console.error(err)
    }
  }

  const handleEdit = (user) => {
    setEditingUser({
      ...user,
      password: '' // Don't include password in the form
    })
  }

  const handleCancelEdit = () => {
    setEditingUser(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditingUser(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Remove empty password field if not changed
      const userData = { ...editingUser }
      if (!userData.password) {
        delete userData.password
      }
      
      await adminService.updateUser(editingUser._id, userData)
      setMessage('User updated successfully')
      setEditingUser(null)
      fetchUsers()
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setError('Failed to update user')
      console.error(err)
    }
  }

  if (loading) return <div>Loading users...</div>
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="user-management">
      <h1>User Management</h1>
      
      {message && <div className="success-message">{message}</div>}
      
      {editingUser ? (
        <div className="edit-user-form">
          <h2>Edit User</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editingUser.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={editingUser.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password (leave blank to keep current)</label>
              <input
                type="password"
                id="password"
                name="password"
                value={editingUser.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-btn">Update User</button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {users.length === 0 ? (
            <p>No users found</p>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="user-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  )
}

export default UserManagement
