import GoogleMapComponent from '../components/GoogleMap'

function Bookstores() {
  return (
    <div className="bookstores-container">
      <h1>Bookstore Locations</h1>
      <p>Find physical bookstores where you can browse and purchase books in person.</p>
      
      <GoogleMapComponent />
      
      <div className="bookstore-list">
        <h2>Our Partner Bookstores</h2>
        <ul>
          <li>
            <h3>Main Street Books</h3>
            <p>123 Main St, New York, NY</p>
            <p>Open: 9am - 8pm (Mon-Sat), 10am - 6pm (Sun)</p>
          </li>
          <li>
            <h3>Central Book Shop</h3>
            <p>456 Central Ave, New York, NY</p>
            <p>Open: 10am - 9pm (Mon-Fri), 11am - 7pm (Sat-Sun)</p>
          </li>
          <li>
            <h3>Harbor Books</h3>
            <p>789 Harbor Blvd, New York, NY</p>
            <p>Open: 8am - 7pm (Mon-Sat), Closed (Sun)</p>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Bookstores