import { Link, useLocation, useNavigate } from 'react-router-dom'
import logoo from '../assets/logoo.png'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const navStyles = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

*{
  box-sizing:border-box;
}

.navbar{
  position:fixed;
  top:0;
  left:0;
  right:0;
  z-index:200;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 2rem;
  height:70px;
  background:transparent;
  transition:0.3s ease;
  font-family:'Manrope',sans-serif;
}

.navbar.scrolled{
  background:#fff;
  box-shadow:0 4px 20px rgba(0,0,0,0.05);
}

.nav-logo{
  display:flex;
  align-items:center;
  gap:10px;
  text-decoration:none;
}

.logo-img{
  height:46px;
  width:auto;
}

.logo-text{
  font-size:1.1rem;
  font-weight:800;
  color:white;
}

.navbar.scrolled .logo-text{
  color:#111;
}

.green{
  color:#22c55e;
}

.logo-dz{
  font-size:.7rem;
  color:#9ca3af;
}

.nav-links{
  display:flex;
  align-items:center;
  gap:2rem;
  list-style:none;
}

.nav-links a{
  text-decoration:none;
  color:white;
  font-weight:600;
  font-size:.95rem;
}

.navbar.scrolled .nav-links a{
  color:#111;
}

.nav-links a:hover,
.nav-links a.active{
  color:#22c55e;
}

.nav-right{
  display:flex;
  align-items:center;
  gap:1rem;
}

.nav-login{
  color:white;
  text-decoration:none;
  font-weight:600;
}

.navbar.scrolled .nav-login{
  color:#111;
}

.nav-cta{
  background:#22c55e;
  color:white;
  padding:.65rem 1.3rem;
  border-radius:40px;
  text-decoration:none;
  font-weight:700;
}

.user-pill{
  display:flex;
  align-items:center;
  gap:10px;
  cursor:pointer;
}

.user-avatar{
  width:32px;
  height:32px;
  border-radius:50%;
  background:#22c55e;
  color:white;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:700;
}

.user-name{
  color:white;
}

.navbar.scrolled .user-name{
  color:#111;
}

.btn-logout{
  border:none;
  background:transparent;
  color:white;
  cursor:pointer;
  font-weight:600;
}

.navbar.scrolled .btn-logout{
  color:#111;
}

/* hamburger */
.hamburger{
  display:none;
  flex-direction:column;
  gap:5px;
  border:none;
  background:none;
  cursor:pointer;
}

.hamburger span{
  width:26px;
  height:3px;
  border-radius:10px;
  background:white;
  transition:.3s;
}

.navbar.scrolled .hamburger span{
  background:#111;
}

.hamburger.open span:nth-child(1){
  transform:translateY(8px) rotate(45deg);
}

.hamburger.open span:nth-child(2){
  opacity:0;
}

.hamburger.open span:nth-child(3){
  transform:translateY(-8px) rotate(-45deg);
}

/* mobile menu */
.mobile-menu{
  position:fixed;
  top:70px;
  left:-100%;
  width:100%;
  height:calc(100vh - 70px);
  background:#0d1f0f;
  transition:.35s ease;
  z-index:150;
  padding:2rem;
  overflow-y:auto;
}

.mobile-menu.open{
  left:0;
}

.mobile-menu li{
  list-style:none;
  margin-bottom:1rem;
}

.mobile-menu a{
  text-decoration:none;
  color:white;
  font-size:1.1rem;
  font-weight:700;
}

.mobile-menu a.active{
  color:#22c55e;
}

.mobile-menu-footer{
  margin-top:2rem;
  display:flex;
  flex-direction:column;
  gap:1rem;
}

.mobile-login,
.mobile-cta{
  text-align:center;
  padding:.9rem;
  border-radius:12px;
  text-decoration:none;
  font-weight:700;
}

.mobile-login{
  border:1px solid rgba(255,255,255,.2);
  color:white;
}

.mobile-cta{
  background:#22c55e;
  color:white;
}

/* responsive */
@media(max-width:900px){
  .nav-links,
  .nav-right{
    display:none;
  }

  .hamburger{
    display:flex;
  }
}

@media(max-width:600px){
  .navbar{
    padding:0 1rem;
  }

  .logo-img{
    height:38px;
  }

  .logo-text{
    font-size:.95rem;
  }
}
`

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const links = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/solutions', label: 'Solutions' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  const initials = user ? user.firstName[0] + user.lastName[0] : ''

  return (
    <>
      <style>{navStyles}</style>

      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-logo">
          <img src={logoo} className="logo-img" alt="logo" />
          <span className="logo-text">
            Agri<span className="green">Sense</span>
            <span className="logo-dz"> DZ</span>
          </span>
        </Link>

        <ul className="nav-links">
          {links.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={pathname === link.to ? 'active' : ''}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          {user ? (
            <>
              <div
                className="user-pill"
                onClick={() => navigate('/dashboard')}
              >
                <div className="user-avatar">{initials}</div>
                <span className="user-name">{user.firstName}</span>
              </div>

              <button
                className="btn-logout"
                onClick={() => {
                  logout()
                  navigate('/')
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-login">
                Login
              </Link>

              <Link to="/signup" className="nav-cta">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {links.map(link => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={pathname === link.to ? 'active' : ''}
            >
              {link.label}
            </Link>
          </li>
        ))}

        <div className="mobile-menu-footer">
          {user ? (
            <button
              className="mobile-cta"
              onClick={() => {
                logout()
                navigate('/')
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="mobile-login">
                Login
              </Link>

              <Link to="/signup" className="mobile-cta">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}
