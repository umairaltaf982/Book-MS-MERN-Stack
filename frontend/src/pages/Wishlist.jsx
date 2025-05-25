import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { userService } from '../services/api'

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    console.log('Token in localStorage:', token ? 'Token exists' : 'No token found')
    
    if (!token) {
      setIsLoggedIn(false)
      setLoading(false)
      return
    }
    
    // Fetch wishlist items
    const fetchWishlistItems = async () => {
      try {
        const response = await userService.getWishlist()
        setWishlistItems(response.data.wishlist)
        setLoading(false)
      } catch (err) {
        console.error('Wishlist error:', err)
        
        // Handle authentication errors
        if (err.response && err.response.status === 401) {
          setIsLoggedIn(false)
          localStorage.removeItem('token') // Clear invalid token
          setError('Your session has expired. Please log in again.')
        } else {
          setError('Failed to fetch wishlist items. Please try again later.')
        }
        setLoading(false)
      }
    }

    fetchWishlistItems()
  }, [])

  const handleRemoveFromWishlist = async (bookId) => {
    try {
      await userService.removeFromWishlist(bookId)
      // Update wishlist items after removal
      setWishlistItems(wishlistItems.filter(item => item._id !== bookId))
      setMessage('Book removed from wishlist')
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setIsLoggedIn(false)
        localStorage.removeItem('token')
        setError('Your session has expired. Please log in again.')
      } else {
        setError('Failed to remove book from wishlist')
      }
      console.error(err)
    }
  }

  const handleAddToCart = async (bookId) => {
    try {
      await userService.addToCart(bookId)
      setMessage('Book added to cart')
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setIsLoggedIn(false)
        localStorage.removeItem('token')
        setError('Your session has expired. Please log in again.')
      } else {
        setError('Failed to add book to cart')
      }
      console.error(err)
    }
  }

  // Redirect if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  if (loading) return <div>Loading wishlist...</div>
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="wishlist-container">
      <h1>Your Wishlist</h1>
      
      {message && <div className="success-message">{message}</div>}
      
      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <p>Your wishlist is empty</p>
          <Link to="/" className="shop-link">Browse Books</Link>
        </div>
      ) : (
        <>
          <div className="wishlist-items">
            {wishlistItems.map(book => (
              <div key={book._id} className="wishlist-item">
                <div className="wishlist-item-info">
                  <h3>{book.title}</h3>
                  <p>By: {book.author}</p>
                  <p className="price">${book.price}</p>
                </div>
                <div className="wishlist-item-actions">
                  <button 
                    className="add-to-cart-button"
                    onClick={() => handleAddToCart(book._id)}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="remove-button"
                    onClick={() => handleRemoveFromWishlist(book._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Wishlist
