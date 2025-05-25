import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { adminService } from '../../services/api'

function BookManagement() {
  return (
    <div className="book-management">
      <h1>Book Management</h1>
      <Routes>
        <Route index element={<BookList />} />
        <Route path="add" element={<AddEditBook />} />
        <Route path="edit/:id" element={<AddEditBook />} />
      </Routes>
    </div>
  )
}

function BookList() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const response = await adminService.getAllBooks()
      setBooks(response.data.books)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch books')
      setLoading(false)
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return
    }
    
    try {
      await adminService.deleteBook(id)
      setMessage('Book deleted successfully')
      // Refresh the book list
      fetchBooks()
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setError('Failed to delete book')
      console.error(err)
    }
  }

  if (loading) return <div>Loading books...</div>
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="book-list">
      <div className="book-list-header">
        <h2>All Books</h2>
        <Link to="/admin/books/add" className="add-book-btn">Add New Book</Link>
      </div>
      
      {message && <div className="success-message">{message}</div>}
      
      {books.length === 0 ? (
        <p>No books found</p>
      ) : (
        <table className="book-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Price</th>
              <th>Category</th>
              <th>In Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book._id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>${book.price}</td>
                <td>{book.category || 'N/A'}</td>
                <td>{book.inStock ? 'Yes' : 'No'}</td>
                <td className="book-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => navigate(`/admin/books/edit/${book._id}`)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(book._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function AddEditBook() {
  const [book, setBook] = useState({
    title: '',
    author: '',
    price: '',
    description: '',
    category: '',
    inStock: true,
    ratings: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()
  
  const isEditMode = window.location.pathname.includes('edit')
  const bookId = isEditMode ? window.location.pathname.split('/').pop() : null

  useEffect(() => {
    if (isEditMode && bookId) {
      fetchBookDetails()
    }
  }, [isEditMode, bookId])

  const fetchBookDetails = async () => {
    try {
      setLoading(true)
      const response = await adminService.getAllBooks()
      const bookToEdit = response.data.books.find(b => b._id === bookId)
      
      if (bookToEdit) {
        setBook(bookToEdit)
      } else {
        setError('Book not found')
      }
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch book details')
      setLoading(false)
      console.error(err)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setBook(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // Validate price is a number
      const bookData = {
        ...book,
        price: parseFloat(book.price),
        ratings: parseFloat(book.ratings || 0)
      }
      
      let response
      if (isEditMode) {
        response = await adminService.updateBook(bookId, bookData)
      } else {
        response = await adminService.createBook(bookData)
      }
      
      setMessage(`Book ${isEditMode ? 'updated' : 'created'} successfully`)
      setTimeout(() => {
        navigate('/admin/books')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} book`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEditMode) return <div>Loading book details...</div>

  return (
    <div className="add-edit-book">
      <h2>{isEditMode ? 'Edit Book' : 'Add New Book'}</h2>
      
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={book.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={book.author}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            min="0"
            step="0.01"
            value={book.price}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={book.category || ''}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={book.description || ''}
            onChange={handleChange}
            rows="4"
          />
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="inStock"
              checked={book.inStock}
              onChange={handleChange}
            />
            In Stock
          </label>
        </div>
        
        <div className="form-group">
          <label htmlFor="ratings">Ratings (0-5)</label>
          <input
            type="number"
            id="ratings"
            name="ratings"
            min="0"
            max="5"
            step="0.1"
            value={book.ratings || 0}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : (isEditMode ? 'Update Book' : 'Add Book')}
          </button>
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/admin/books')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default BookManagement
