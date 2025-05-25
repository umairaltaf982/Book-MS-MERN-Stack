import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Register from './pages/Register'
import BookDetails from './pages/BookDetails'
import Cart from './pages/Cart'
import Bookstores from './pages/Bookstores'
import Wishlist from './pages/Wishlist'
import AdminDashboard from './pages/admin/Dashboard'
import AdminLogin from './pages/admin/Login'
import AdminRegister from './pages/admin/Register'
import Navbar from './components/Navbar'
import SideMenuScroll from './components/sideMenuScroll'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <Navbar />
      <SideMenuScroll />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/bookstores" element={<Bookstores />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
