import { useState, useEffect } from 'react'
import { bookService } from '../services/api'
import { Link, useLocation } from 'react-router-dom'

function Home() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const location = useLocation()

  useEffect(() => {
    // Check for token in URL (from Google OAuth redirect)
    const query = new URLSearchParams(location.search)
    const token = query.get('token')
    
    if (token) {
      // Save token to localStorage
      localStorage.setItem('token', token)
      // Remove token from URL
      window.history.replaceState({}, document.title, '/')
      // Refresh the page to update auth state
      window.location.reload()
    }
  }, [location])

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await bookService.getAllBooks()
        setBooks(response.data.books)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch books')
        setLoading(false)
        console.error(err)
      }
    }

    fetchBooks()
  }, [])

  if (loading) return <div>Loading books...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1>Book Collection</h1>
      <div className="books-grid">
        {books.length > 0 ? (
          books.map(book => (
            <div key={book._id} className="book-card">
              <h3>{book.title}</h3>
              <p>By: {book.author}</p>
              <p>${book.price}</p>
              <Link to={`/book/${book._id}`}>View Details</Link>
            </div>
          ))
        ) : (
          <p>No books available</p>
        )}
      </div>
    </div>
  )
}

export default Home
