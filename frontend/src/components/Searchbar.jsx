import { Link } from 'react-router-dom'
import { useState } from 'react'
import { bookService } from '../services/api'

function Searchbar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await bookService.searchBooks(query);
      setResults(response.data.books);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search books');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }

  return (
    <div className="searchbar">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search for books..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      {error && <div className="search-error">{error}</div>}
      
      {results.length > 0 && (
        <div className="search-results">
          {results.map(book => (
            <Link key={book._id} to={`/book/${book._id}`} className="search-result-item">
              <div className="book-title">{book.title}</div>
              <div className="book-author">by {book.author}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Searchbar
