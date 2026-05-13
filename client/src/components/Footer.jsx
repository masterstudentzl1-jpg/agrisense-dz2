import { Link } from 'react-router-dom'
import logoo from '../assets/logoo.png'

const footerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  .footer {
    background: #0d1117;
    font-family: 'Manrope', sans-serif;
    color: #d1d5db;
    padding: 4rem 2.5rem 0;
  }
  .footer-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
    gap: 3rem;
    max-width: 1200px;
    margin: 0 auto;
    padding-bottom: 3rem;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .footer-brand .logo-row {
    display: flex; align-items: center; gap: 10px; margin-bottom: 1rem;
  }
  .footer-logo-text { font-size: 1.1rem; font-weight: 700; color: #fff; }
  .footer-logo-text span { color: #22c55e; }
  .footer-logo-dz { font-size: 0.68rem; color: #9ca3af; margin-left: 3px; font-weight: 600; }
  .footer-brand p { font-size: 0.88rem; color: #9ca3af; line-height: 1.7; margin-bottom: 1.25rem; }
  .socials { display: flex; gap: 10px; }
  .social-btn {
    width: 36px; height: 36px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    text-decoration: none; color: #9ca3af;
  }
      footer span { color: #4ade80; }
  .social-btn:hover { border-color: #22c55e; background: rgba(34,197,94,0.1); color: #22c55e; }
  .social-btn svg { width: 16px; height: 16px; fill: currentColor; }
  .footer-col h4 { font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 1.25rem; }
  .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }
  .footer-col ul li a {
    text-decoration: none; font-size: 0.88rem; color: #9ca3af; transition: color 0.2s;
  }
  .footer-col ul li a:hover { color: #22c55e; }
  .contact-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 0.9rem; }
  .contact-icon { flex-shrink: 0; margin-top: 1px; color: #9ca3af; }
  .contact-icon svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
  .contact-item span { font-size: 0.88rem; color: #9ca3af; line-height: 1.5; }
  .footer-bottom {
    max-width: 1200px; margin: 0 auto;
    display: flex; justify-content: space-between; align-items: center;
    padding: 1.5rem 0;
    font-size: 0.82rem; color: #6b7280;
  }
  .footer-bottom-links { display: flex; gap: 1.5rem; }
  .footer-bottom-links a { text-decoration: none; color: #6b7280; transition: color 0.2s; }
  .footer-bottom-links a:hover { color: #22c55e; }
  @media (max-width: 768px) {
    .footer-grid { grid-template-columns: 1fr; }
    .footer-bottom { flex-direction: column; gap: 1rem; text-align: center; }
  }
`

// SVG Social Icons
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4l16 16M4 20L20 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M20 4L4 20M4 4l16 16" fill="none"/>
    <path d="M3 5h4l10 14h4L11 5H7z"/>
    <path d="M3 19l6-6M15 6l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
  </svg>
)

const XIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

// SVG Contact Icons
const MapPinIcon = () => (
  <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z"/></svg>
)

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25z"/></svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/></svg>
)

export default function Footer() {
  return (
    <>
      <style>{footerStyles}</style>
      <footer className="footer">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="logo-row">
              <img src={logoo} alt="AgriSense logo" style={{width:38,height:38,borderRadius:10,objectFit:'contain'}} />
              <span className="footer-logo-text">
                Agri<span>Sense</span>
                <span className="footer-logo-dz"> DZ</span>
              </span>
            </div>
            <p>
              Empowering Algerian farmers with cutting-edge IoT technology to
              modernize agriculture and maximize yields sustainably.
            </p>
            <div className="socials">
              <a className="social-btn" href="#" aria-label="Facebook"><FacebookIcon /></a>
              <a className="social-btn" href="#" aria-label="X (Twitter)"><XIcon /></a>
              <a className="social-btn" href="#" aria-label="LinkedIn"><LinkedInIcon /></a>
              <a className="social-btn" href="#" aria-label="Instagram"><InstagramIcon /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/solutions">Solutions</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div className="footer-col">
            <h4>Our Products</h4>
            <ul>
              <li><Link to="/products">Soil Monitoring Sensor</Link></li>
              <li><Link to="/products">Smart Irrigation System</Link></li>
              <li><Link to="/products">Weather Station</Link></li>
              <li><Link to="/products">Crop Health Camera</Link></li>
              <li><Link to="/products">GPS Field Tracker</Link></li>
              <li><Link to="/dashboard">AgriSense Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact Us</h4>
            <div className="contact-item">
              <span className="contact-icon"><MapPinIcon /></span>
              <span>Incubateur de Bouira UAMO, Bouira, Algérie</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon"><PhoneIcon /></span>
              <span>+213 0781092285</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon"><MailIcon /></span>
              <span>masterstudentzl1@gmail.com</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 AgriSense DZ. All rights reserved.</span>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </>
  )
}