import { Link } from "react-router-dom";
import ContactInput from "./ContactInput";

function Footer(){
    const currentYear = new Date().getFullYear();
    
    return(
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3>About Us</h3>
                    <p>Your trusted online bookstore providing quality books for all readers.</p>
                </div>
                
                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/books">Books</Link></li>
                        <li><Link to="/categories">Categories</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>
                
                <div className="footer-section">
                    <h3>Contact Info</h3>
                    <p>Email: info@bookstore.com</p>
                    <p>Phone: +1 234 567 8900</p>
                    <p>Address: 123 Book Street, Reading City</p>
                </div>
                
                <div className="footer-section">
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                        <a href="www.facebook.com" aria-label="Facebook">FB</a>
                        <a href="www.twitter.com" aria-label="Twitter">TW</a>
                        <a href="www.instagram.com" aria-label="Instagram">IG</a>
                        <a href="www.linkedin.com" aria-label="LinkedIn">LI</a>
                    </div>
                </div>
                <ContactInput />
            </div>
            
            <div className="footer-bottom">
                <p>&copy; {currentYear} Book Store. All rights reserved.</p>
                <div className="footer-bottom-links">
                    <Link to="/privacy">Privacy Policy</Link>
                    <Link to="/terms">Terms of Service</Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer;