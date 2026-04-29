import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import Solutions from './pages/Solutions'
import About from './pages/About'
import Contact from './pages/Contact'
import { Login, Signup } from './pages/AuthPages'
import Dashboard from './pages/Dashboard'
import ScrollToTop from './components/ScrollToTop'

// Pages that should NOT show Navbar or Footer
const AUTH_ROUTES = ['/login', '/signup', '/dashboard']

function Layout() {
  const { pathname } = useLocation()
  const isAuthPage = AUTH_ROUTES.some(r => pathname.startsWith(r))

  return (
    <>
      <ScrollToTop />
      {!isAuthPage && <Navbar />}

      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/products"  element={<Products />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/about"     element={<About />} />
        <Route path="/contact"   element={<Contact />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/signup"    element={<Signup />} />
       <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      {!isAuthPage && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  )
}