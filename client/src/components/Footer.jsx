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
  .footer-logo-icon {
    width: 38px; height: 38px;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
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
    font-size: 14px; cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    text-decoration: none; color: #9ca3af;
  }
      footer span { color: #4ade80; }
  .social-btn:hover { border-color: #22c55e; background: rgba(34,197,94,0.1); color: #22c55e; }
  .footer-col h4 { font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 1.25rem; }
  .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }
  .footer-col ul li a {
    text-decoration: none; font-size: 0.88rem; color: #9ca3af; transition: color 0.2s;
  }
  .footer-col ul li a:hover { color: #22c55e; }
  .contact-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 0.9rem; }
  .contact-icon { font-size: 16px; margin-top: 1px; flex-shrink: 0; }
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


export default function Footer() {
  return (
    <>
      <style>{footerStyles}</style>

      <footer className="footer">
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <div className="logo-row">
              <img src={logoo} alt="AgriSense logo" className="logo-img" />
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
              <a className="social-btn" href="#" aria-label="Facebook">f</a>
              <a className="social-btn" href="#" aria-label="Twitter">𝕏</a>
              <a className="social-btn" href="#" aria-label="LinkedIn">in</a>
              <a className="social-btn" href="#" aria-label="Instagram">◎</a>
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
              <span className="contact-icon">📍</span>
              <span>Incubateur de Bouira UAMO, Bouira, Algérie</span>
            </div>

            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <span>+213 0781092285</span>
            </div>

            <div className="contact-item">
              <span className="contact-icon">✉️</span>
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