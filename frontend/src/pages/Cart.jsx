import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { userService } from '../services/api'

function Cart() {
  const [cartItems, setCartItems] = useState([])
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

    // Fetch cart items
    const fetchCartItems = async () => {
      try {
        const response = await userService.getCart()
        setCartItems(response.data.cart)
        setLoading(false)
      } catch (err) {
        console.error('Cart error:', err)

        // Handle authentication errors
        if (err.response && err.response.status === 401) {
          setIsLoggedIn(false)
          localStorage.removeItem('token') // Clear invalid token
          setError('Your session has expired. Please log in again.')
        } else {
          setError('Failed to fetch cart items. Please try again later.')
        }
        setLoading(false)
      }
    }

    fetchCartItems()
  }, [])

  const handleRemoveFromCart = async (bookId) => {
    try {
      await userService.removeFromCart(bookId)
      // Update cart items after removal
      setCartItems(cartItems.filter(item => item._id !== bookId))
      setMessage('Book removed from cart')
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setIsLoggedIn(false)
        localStorage.removeItem('token')
        setError('Your session has expired. Please log in again.')
      } else {
        setError('Failed to remove book from cart')
      }
      console.error(err)
    }
  }

  const handleBuyBook = async (bookId) => {
    try {
      await userService.buyBook(bookId)
      // Remove from cart after purchase
      setCartItems(cartItems.filter(item => item._id !== bookId))
      setMessage('Book purchased successfully!')
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setIsLoggedIn(false)
        localStorage.removeItem('token')
        setError('Your session has expired. Please log in again.')
      } else {
        setError('Failed to purchase book')
      }
      console.error(err)
    }
  }

  // Redirect if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  if (loading) return <div>Loading cart...</div>
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>

      {message && <div className="success-message">{message}</div>}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/" className="shop-link">Browse Books</Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(book => (
              <div key={book._id} className="cart-item">
                <div className="cart-item-info">
                  <h3>{book.title}</h3>
                  <p>By: {book.author}</p>
                  <p className="price">${book.price}</p>
                </div>
                <div className="cart-item-actions">
                  <button
                    className="buy-button"
                    onClick={() => handleBuyBook(book._id)}
                  >
                    Buy Now
                  </button>
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveFromCart(book._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <p>Total Items: {cartItems.length}</p>
            <p className="total-price">
              Total: ${cartItems.reduce((total, book) => total + book.price, 0).toFixed(2)}
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart
