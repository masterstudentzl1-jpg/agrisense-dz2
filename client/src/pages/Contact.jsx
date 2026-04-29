
import farmerImg from '../assets/farmer.jpg'
import { useEffect, useState } from "react";


const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Manrope', sans-serif; }

 

  .contact-hero {
  position: relative;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  padding: 5rem 2rem 4rem;
  text-align: center;
  color: white;
}

.contact-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, rgba(0,60,20,0.7) 0%, rgba(5,100,40,0.5) 100%);
    z-index: 1;
}
  
/*reveal animation*/
  .reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.visible {
  opacity: 1;
  transform: none;
}


.contact-hero * {
  position: relative;
  z-index: 1;
}
  .contact-hero .tag {
    font-size: 0.72rem; font-weight: 800; letter-spacing: 0.12em;
    color: #4ade80; text-transform: uppercase; margin-bottom: 1rem;
  }
  .contact-hero h1 {
    font-size: clamp(2rem, 5vw, 3rem); font-weight: 800;
    color: #f3f8f4; letter-spacing: -0.03em; margin-bottom: 1rem;
  }
  .contact-hero p {
    font-size: 1.05rem; color: #d1d5db; max-width: 560px;
    margin: 0 auto; line-height: 1.7;
  }

  /* ── CONTACT TYPES ── */
  .contact-types {
    max-width: 1200px; margin: 0 auto; padding: 3.5rem 2rem 0;
    display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }
  .contact-type {
    text-align: center; padding: 2rem 1rem;
    border: 1px solid #e5e7eb; border-radius: 20px;
    transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .contact-type:hover {
    border-color: #22c55e; transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(34,197,94,0.1);
  }
  .type-icon {
    width: 56px; height: 56px; border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; margin: 0 auto 1rem;
  }
  .type-icon.green { background: #f0fdf4; }
  .type-icon.blue { background: #eff6ff; }
  .type-icon.purple { background: #faf5ff; }
  .contact-type h3 { font-size: 1rem; font-weight: 700; color: #0d1f0f; margin-bottom: 0.4rem; }
  .contact-type p { font-size: 0.83rem; color: #6b7280; line-height: 1.5; margin-bottom: 0.75rem; }
  .contact-type a {
    font-size: 0.82rem; font-weight: 700; color: #22c55e; text-decoration: none;
  }
  .contact-type a:hover { text-decoration: underline; }

  /* ── MAIN CONTENT ── */
  .contact-main {
    max-width: 1200px; margin: 0 auto;
    padding: 4rem 2rem 5rem;
    display: grid; grid-template-columns: 1fr 1.2fr;
    gap: 4rem; align-items: start;
  }
  @media (max-width: 768px) { .contact-main { grid-template-columns: 1fr; } }

  /* Info side */
  .contact-info h2 {
    font-size: 1.6rem; font-weight: 800; color: #0d1f0f;
    margin-bottom: 0.75rem; letter-spacing: -0.02em;
  }
  .contact-info p { font-size: 0.92rem; color: #4b5563; line-height: 1.8; margin-bottom: 2rem; }
  .info-item { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 1.25rem; }
  .info-icon {
    width: 42px; height: 42px; border-radius: 12px;
    background: #f0fdf4; border: 1px solid #bbf7d0;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }
  .info-text .label { font-size: 0.75rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 2px; }
  .info-text .value { font-size: 0.92rem; color: #0d1f0f; font-weight: 600; }
  .info-text .sub { font-size: 0.82rem; color: #6b7280; }

  .map-placeholder {
    margin-top: 2rem; height: 200px; border-radius: 16px;
    background: linear-gradient(135deg, #e8f5e9, #bbf7d0);
    display: flex; align-items: center; justify-content: center;
    border: 1px solid #bbf7d0; font-size: 2rem; color: #16a34a;
    font-weight: 800;
  }

  /* Form side */
  .contact-form {
    background: #f9fafb; border: 1px solid #e5e7eb;
    border-radius: 24px; padding: 2.5rem;
  }
  .contact-form h3 { font-size: 1.2rem; font-weight: 800; color: #0d1f0f; margin-bottom: 0.4rem; }
  .contact-form .sub { font-size: 0.85rem; color: #6b7280; margin-bottom: 2rem; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
  @media (max-width: 500px) { .form-row { grid-template-columns: 1fr; } }
  .form-group { margin-bottom: 1rem; }
  .form-group label { display: block; font-size: 0.82rem; font-weight: 700; color: #374151; margin-bottom: 0.4rem; }
  .form-group input, .form-group select, .form-group textarea {
    width: 100%; padding: 0.75rem 1rem; border: 1.5px solid #e5e7eb;
    border-radius: 12px; font-size: 0.88rem; font-family: 'Manrope', sans-serif;
    background: #fff; color: #0d1f0f; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
    border-color: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,0.12);
  }
  .form-group textarea { resize: vertical; min-height: 120px; }
  .btn-submit {
    width: 100%; padding: 0.9rem; border: none; border-radius: 12px;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: #fff; font-size: 0.95rem; font-weight: 700;
    font-family: 'Manrope', sans-serif; cursor: pointer;
    box-shadow: 0 6px 20px rgba(34,197,94,0.35);
    transition: transform 0.2s, box-shadow 0.2s; margin-top: 0.5rem;
  }
  .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(34,197,94,0.45); }
  .success-msg {
    background: #f0fdf4; border: 1px solid #bbf7d0;
    border-radius: 12px; padding: 1rem 1.25rem;
    font-size: 0.88rem; color: #16a34a; font-weight: 600;
    text-align: center; margin-top: 1rem;
  }
`

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ fname: '', lname: '', email: '', phone: '', type: '', wilaya: '', message: '' })

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = e => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

    useEffect(() => {
    // Scroll reveal
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.12 });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{styles}</style>
    
      <div className="contact-page">

        {/* Hero */}
      <section
  className="contact-hero"
  style={{
    backgroundImage: `url(https://plus.unsplash.com/premium_photo-1664476842335-abe84418c76d?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHNtYXJ0JTIwZmFybWluZ3xlbnwwfHwwfHx8MA%3D%3D)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
>
  <div className="section-header reveal">
  <div className="tag">Contact</div>
  <h1>Let's Talk Agriculture</h1>
  <p>
    Whether you want a product demo, a custom quote, or just have questions —
    our team of agronomy experts is here to help.
  </p>
  </div>
</section>

        {/* Contact type cards */}
        <div className="contact-types">
          <div className="contact-type">
            <div className="type-icon green">💬</div>
            <h3>Sales Inquiry</h3>
            <p>Get pricing, bulk quotes, or schedule a farm visit from our team.</p>
            <a href="mailto:sales@agrisense-dz.com">sales@agrisense-dz.com</a>
          </div>
          <div className="contact-type">
            <div className="type-icon blue">🎧</div>
            <h3>Technical Support</h3>
            <p>Having issues with a device? Our support engineers are on standby.</p>
            <a href="mailto:support@agrisense-dz.com">support@agrisense-dz.com</a>
          </div>
          <div className="contact-type">
            <div className="type-icon purple">📋</div>
            <h3>Partnership</h3>
            <p>Looking to distribute or integrate with AgriSense? Let's talk.</p>
            <a href="mailto:partners@agrisense-dz.com">partners@agrisense-dz.com</a>
          </div>
        </div>

        {/* Main */}
        <div className="contact-main">

          {/* Info */}
          <div className="contact-info">
            <h2>Reach us directly</h2>
            <p>We're based in Algiers and serve farms across all 58 wilayas. Our team speaks Arabic, French, and English.</p>
            {[
              { icon: '📍', label: 'Address', value: 'Incubateur Bouira UMAO', sub: 'Bouira, Algérie' },
              { icon: '📞', label: 'Phone', value: '+213 0781092285', sub: 'Mon–Sat, 8h–18h' },
              { icon: '✉️', label: 'Email', value: 'masterstudentzl1@gmail.com', sub: 'We reply within 24h' },
              { icon: '🕐', label: 'Hours', value: 'Monday – Saturday', sub: '8:00 – 18:00 ' },
            ].map(item => (
              <div key={item.label} className="info-item">
                <div className="info-icon">{item.icon}</div>
                <div className="info-text">
                  <div className="label">{item.label}</div>
                  <div className="value">{item.value}</div>
                  <div className="sub">{item.sub}</div>
                </div>
              </div>
            ))}
            <div className="map-placeholder">📍 Incubateur Bouira UAMO, Bouira</div>
          </div>

          {/* Form */}
          <div className="contact-form">
            <h3>Send us a message</h3>
            <p className="sub">Fill out the form and we'll get back to you within one business day.</p>
            <form onSubmit={submit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input name="fname" placeholder="first name" value={form.fname} onChange={handle} required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input name="lname" placeholder="lastname" value={form.lname} onChange={handle} required />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input name="email" type="email" placeholder="email@example.com" value={form.email} onChange={handle} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input name="phone" placeholder="+213 XXX XXX XXX" value={form.phone} onChange={handle} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Inquiry Type</label>
                  <select name="type" value={form.type} onChange={handle} required>
                    <option value="">Select type</option>
                    <option>Sales Inquiry</option>
                    <option>Technical Support</option>
                    <option>Partnership</option>
                    <option>General Question</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Wilaya</label>
                  <select name="wilaya" value={form.wilaya} onChange={handle}>
                    <option value="">Select wilaya</option>
                    {['Bouira','Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Sétif', 'Biskra', 'Tizi Ouzou', 'Batna', 'Other'].map(w => (
                      <option key={w}>{w}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" placeholder="Tell us about your farm and what you need..." value={form.message} onChange={handle} required />
              </div>
              <button className="btn-submit" type="submit">Send Message →</button>
              {sent && <div className="success-msg">✅ Message sent! We'll reply within 24 hours.</div>}
            </form>
          </div>
        </div>
      </div>
    
    </>
  )
}
