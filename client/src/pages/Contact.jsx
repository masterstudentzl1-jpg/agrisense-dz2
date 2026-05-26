import { useEffect, useState } from "react";
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'

// ─── SVG ICON SYSTEM ──────────────────────────────────────────────────────────
const Icons = {
  location: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
  phone:    'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z',
  email:    'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
  clock:    'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
  chat:     'M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z',
  headset:  ['M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155'],
  clipboard:['M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'],
  handshake:'M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z',
  send:     'M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5',
  mapPin:   ['M15 10.5a3 3 0 11-6 0 3 3 0 016 0z', 'M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z'],
  externalLink: ['M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'],
}

const Ic = ({ name, size = 18, style = {}, className = '' }) => {
  const d = Icons[name]
  if (!d) return null
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={style} className={className}>
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  )
}

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
    background: linear-gradient(160deg, rgba(0,60,20,0.75) 0%, rgba(5,100,40,0.55) 100%);
    z-index: 1;
  }
  .contact-hero * { position: relative; z-index: 1; }
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

  /* reveal */
  .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .reveal.visible { opacity: 1; transform: none; }

  /* ── CONTACT TYPE CARDS ── */
  .contact-types {
    max-width: 1200px; margin: 0 auto; padding: 3.5rem 2rem 0;
    display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }
  .contact-type {
    text-align: center; padding: 2rem 1.25rem;
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
    margin: 0 auto 1rem;
  }
  .type-icon.green { background: #f0fdf4; color: #16a34a; }
  .type-icon.blue  { background: #eff6ff; color: #2563eb; }
  .type-icon.purple{ background: #faf5ff; color: #7c3aed; }
  .contact-type h3 { font-size: 1rem; font-weight: 700; color: #0d1f0f; margin-bottom: 0.4rem; }
  .contact-type p  { font-size: 0.83rem; color: #6b7280; line-height: 1.5; margin-bottom: 0.75rem; }
  .contact-type a  { font-size: 0.82rem; font-weight: 700; color: #22c55e; text-decoration: none; }
  .contact-type a:hover { text-decoration: underline; }

  /* ── MAIN CONTENT ── */
  .contact-main {
    max-width: 1200px; margin: 0 auto;
    padding: 4rem 2rem 5rem;
    display: grid; grid-template-columns: 1fr 1.2fr;
    gap: 4rem; align-items: start;
  }
  @media (max-width: 768px) { .contact-main { grid-template-columns: 1fr; gap: 2rem; } }

  /* Info side */
  .contact-info h2 {
    font-size: 1.6rem; font-weight: 800; color: #0d1f0f;
    margin-bottom: 0.75rem; letter-spacing: -0.02em;
  }
  .contact-info > p { font-size: 0.92rem; color: #4b5563; line-height: 1.8; margin-bottom: 2rem; }

  .info-item { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 1.25rem; }
  .info-icon {
    width: 42px; height: 42px; border-radius: 12px;
    background: #f0fdf4; border: 1px solid #bbf7d0;
    display: flex; align-items: center; justify-content: center;
    color: #16a34a; flex-shrink: 0;
  }
  .info-text .label { font-size: 0.75rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 2px; }
  .info-text .value { font-size: 0.92rem; color: #0d1f0f; font-weight: 600; }
  .info-text .sub   { font-size: 0.82rem; color: #6b7280; }

  /* ── MAP BLOCK (like screenshot) ── */
  .map-block {
    margin-top: 2rem;
    border: 1px solid #e5e7eb;
    border-radius: 20px;
    overflow: hidden;
  }
  .map-visual {
    position: relative;
    height: 180px;
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 40%, #a5d6a7 100%);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  .map-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(34,197,94,0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(34,197,94,0.08) 1px, transparent 1px);
    background-size: 28px 28px;
  }
  .map-roads {
    position: absolute; inset: 0;
  }
  .map-pin-wrap {
    position: relative; z-index: 2;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
  }
  .map-pin-circle {
    width: 56px; height: 56px; border-radius: 50%;
    background: #22c55e;
    display: flex; align-items: center; justify-content: center;
    color: #fff;
    box-shadow: 0 0 0 10px rgba(34,197,94,0.15), 0 0 0 20px rgba(34,197,94,0.07);
    animation: mapPulse 2.5s ease-in-out infinite;
  }
  @keyframes mapPulse {
    0%, 100% { box-shadow: 0 0 0 10px rgba(34,197,94,0.15), 0 0 0 20px rgba(34,197,94,0.07); }
    50%       { box-shadow: 0 0 0 14px rgba(34,197,94,0.2),  0 0 0 28px rgba(34,197,94,0.05); }
  }

  .map-footer {
    padding: 1rem 1.25rem;
    display: flex; align-items: center; justify-content: space-between;
    background: #fff;
    border-top: 1px solid #f3f4f6;
  }
  .map-footer-info {}
  .map-footer-info .map-name { font-size: 0.9rem; font-weight: 700; color: #0d1f0f; }
  .map-footer-info .map-sub  { font-size: 0.78rem; color: #6b7280; margin-top: 1px; }
  .map-open-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 50px;
    border: 1.5px solid #22c55e;
    background: transparent; color: #16a34a;
    font-size: 0.78rem; font-weight: 700;
    font-family: 'Manrope', sans-serif;
    cursor: pointer; text-decoration: none;
    transition: background 0.2s, color 0.2s;
  }
  .map-open-btn:hover { background: #22c55e; color: #fff; }

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
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(34,197,94,0.45); }
  .success-msg {
    background: #f0fdf4; border: 1px solid #bbf7d0;
    border-radius: 12px; padding: 1rem 1.25rem;
    font-size: 0.88rem; color: #16a34a; font-weight: 600;
    text-align: center; margin-top: 1rem;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
`

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ fname: '', lname: '', email: '', phone: '', type: '', wilaya: '', message: '' })

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })
const submit = async e => {
  e.preventDefault()
  try {
    await addDoc(collection(db, 'contacts'), {
      firstName: form.fname,
      lastName:  form.lname,
      email:     form.email,
      phone:     form.phone,
      type:      form.type,
      wilaya:    form.wilaya,
      message:   form.message,
      createdAt: new Date()
    })
    setSent(true)
    setForm({ fname: '', lname: '', email: '', phone: '', type: '', wilaya: '', message: '' })
    setTimeout(() => setSent(false), 4000)
  } catch (err) {
    console.error('Error sending message:', err)
  }
}

  useEffect(() => {
    const els = document.querySelectorAll(".reveal")
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible") })
    }, { threshold: 0.12 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const contactTypes = [
    { iconName: 'chat',      iconClass: 'green',  title: 'Sales Inquiry',       desc: 'Get pricing, bulk quotes, or schedule a farm visit from our team.', link: 'sales@agrisense-dz.com' },
    { iconName: 'headset',   iconClass: 'blue',   title: 'Technical Support',   desc: 'Having issues with a device? Our support engineers are on standby.', link: 'support@agrisense-dz.com' },
    { iconName: 'handshake', iconClass: 'purple', title: 'Partnership',         desc: 'Looking to distribute or integrate with AgriSense? Lets talk.', link: 'partners@agrisense-dz.com' },
  ]

  const infoItems = [
    { iconName: 'mapPin',  label: 'Address', value: 'Incubateur Bouira UAMO', sub: 'Bouira, Algérie' },
    { iconName: 'phone',   label: 'Phone',   value: '+213 0781092285',          sub: 'Mon–Sat, 8h–18h' },
    { iconName: 'email',   label: 'Email',   value: 'masterstudentzl1@gmail.com', sub: 'We reply within 24h' },
    { iconName: 'clock',   label: 'Hours',   value: 'Monday – Saturday',        sub: '8:00 – 18:00' },
  ]

  return (
    <>
      <style>{styles}</style>
      <div className="contact-page">

        {/* Hero */}
        <section
          className="contact-hero"
          style={{
            backgroundImage: `url(https://plus.unsplash.com/premium_photo-1664476842335-abe84418c76d?fm=jpg&q=60&w=3000&auto=format&fit=crop)`,
          }}
        >
          <div className="section-header reveal">
            <div className="tag">Contact</div>
            <h1>Let's Talk Agriculture</h1>
            <p>Whether you want a product demo, a custom quote, or just have questions — our team of agronomy experts is here to help.</p>
          </div>
        </section>

        {/* Contact type cards */}
        <div className="contact-types">
          {contactTypes.map(ct => (
            <div key={ct.title} className="contact-type reveal">
              <div className={`type-icon ${ct.iconClass}`}>
                <Ic name={ct.iconName} size={24} />
              </div>
              <h3>{ct.title}</h3>
              <p>{ct.desc}</p>
              <a href={`mailto:${ct.link}`}>{ct.link}</a>
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="contact-main">

          {/* Info */}
          <div className="contact-info reveal">
            <h2>Reach us directly</h2>
            <p>We're based in Bouira and serve farms across all 58 wilayas. Our team speaks Arabic, French, and English.</p>

            {infoItems.map(item => (
              <div key={item.label} className="info-item">
                <div className="info-icon">
                  <Ic name={item.iconName} size={18} />
                </div>
                <div className="info-text">
                  <div className="label">{item.label}</div>
                  <div className="value">{item.value}</div>
                  <div className="sub">{item.sub}</div>
                </div>
              </div>
            ))}

            {/* Map block styled like screenshot */}
            <div className="map-block">
              <div className="map-visual">
                <div className="map-grid" />
                {/* decorative road lines */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 180" preserveAspectRatio="xMidYMid slice">
                  <line x1="0" y1="90" x2="400" y2="90" stroke="rgba(255,255,255,0.5)" strokeWidth="3" />
                  <line x1="200" y1="0" x2="200" y2="180" stroke="rgba(255,255,255,0.5)" strokeWidth="3" />
                  <line x1="0" y1="40" x2="150" y2="90" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                  <line x1="250" y1="90" x2="400" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                  <line x1="80" y1="0" x2="80" y2="90" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                  <line x1="320" y1="90" x2="320" y2="180" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                </svg>
                <div className="map-pin-wrap">
                  <div className="map-pin-circle">
                    <Ic name="mapPin" size={26} style={{ fill: 'none' }} />
                  </div>
                </div>
              </div>
              <div className="map-footer">
                <div className="map-footer-info">
                  <div className="map-name">Incubateur Bouira UAMO</div>
                  <div className="map-sub">Bouira, Algérie</div>
                </div>
                <a
                  className="map-open-btn"
                  href="https://maps.google.com/?q=Bouira,Algérie"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Ic name="externalLink" size={13} />
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="contact-form reveal">
            <h3>Send us a message</h3>
            <p className="sub">Fill out the form and we'll get back to you within one business day.</p>
            <form onSubmit={submit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input name="fname" placeholder="First name" value={form.fname} onChange={handle} required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input name="lname" placeholder="Last name" value={form.lname} onChange={handle} required />
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
                    {['Bouira','Alger','Oran','Constantine','Annaba','Blida','Sétif','Biskra','Tizi Ouzou','Batna','Other'].map(w => (
                      <option key={w}>{w}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" placeholder="Tell us about your farm and what you need..." value={form.message} onChange={handle} required />
              </div>
              <button className="btn-submit" type="submit">
                <Ic name="send" size={16} style={{ color: '#fff' }} />
                Send Message
              </button>
              {sent && (
                <div className="success-msg">
                  <Ic name="email" size={16} />
                  Message sent! We'll reply within 24 hours.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  )
}