import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { bookService, userService } from '../services/api'

function BookDetails() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [actionMessage, setActionMessage] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await bookService.getBook(id)
        setBook(response.data.book)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch book details')
        setLoading(false)
        console.error(err)
      }
    }

    fetchBookDetails()
  }, [id])

  const handleAddToCart = async () => {
    try {
      await userService.addToCart(book._id)
      setActionMessage('Book added to cart successfully!')
      setTimeout(() => setActionMessage(null), 3000)
    } catch (err) {
      setError('Failed to add book to cart')
      console.error(err)
    }
  }

  const handleAddToWishlist = async () => {
    try {
      await userService.addToWishlist(book._id)
      setActionMessage('Book added to wishlist successfully!')
      setTimeout(() => setActionMessage(null), 3000)
    } catch (err) {
      setError('Failed to add book to wishlist')
      console.error(err)
    }
  }

  if (loading) return <div>Loading book details...</div>
  if (error) return <div className="error-message">{error}</div>
  if (!book) return <div>Book not found</div>

  return (
    <div className="book-details-container">
      <div className="book-details">
        <h1>{book.title}</h1>
        <div className="book-info">
          <p className="author">By: {book.author}</p>
          <p className="price">${book.price}</p>
          <p className="category">Category: {book.category || 'Not specified'}</p>
          <p className="status">{book.inStock ? 'In Stock' : 'Out of Stock'}</p>
          <p className="rating">Rating: {book.ratings}/5</p>
        </div>
        
        <div className="book-description">
          <h2>Description</h2>
          <p>{book.description || 'No description available'}</p>
        </div>
        
        {actionMessage && <div className="action-message">{actionMessage}</div>}
        
        {isLoggedIn && (
          <div className="book-actions">
            <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
            <button className="add-to-wishlist" onClick={handleAddToWishlist}>Add to Wishlist</button>
          </div>
        )}
        
        <Link to="/" className="back-link">Back to Books</Link>
      </div>
    </div>
  )
}

export default BookDetails
