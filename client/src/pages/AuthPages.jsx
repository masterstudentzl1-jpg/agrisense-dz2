import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logoo from '../assets/logoo.png'

// ─── SVG ICON SYSTEM ──────────────────────────────────────────────────────────
const Icons = {
  email:      'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
  lock:       'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
  eyeOn:      ['M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z', 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'],
  eyeOff:     ['M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'],
  user:       ['M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'],
  mapPin:     ['M15 10.5a3 3 0 11-6 0 3 3 0 016 0z', 'M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z'],
  check:      'M4.5 12.75l6 6 9-13.5',
  arrowLeft:  'M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18',
  tractor:    ['M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12'],
  chart:      ['M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z'],
  wifi:       ['M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z'],
  truck:      ['M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12'],
  wrench:     ['M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z'],
  warning:    'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
  shield:     'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
}

const Ic = ({ name, size = 16, style = {} }) => {
  const d = Icons[name]
  if (!d) return null
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  )
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .auth-page {
    min-height: 100vh; width: 100%;
    font-family: 'Manrope', sans-serif;
    position: relative; display: flex; flex-direction: column;
  }
  .auth-bg {
    position: fixed; inset: 0; z-index: 0;
    background-size: cover; background-position: center;
  }
  .auth-bg::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(5,46,22,0.82) 0%, rgba(20,83,45,0.70) 100%);
  }
  .auth-topbar {
    position: relative; z-index: 10;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.25rem 2rem;
  }
  .auth-topbar-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .auth-topbar-icon-img { width: 48px; height: 48px; object-fit: contain; }
  .auth-topbar-name { font-size: 1.1rem; font-weight: 800; color: #fff; }
  .auth-topbar-name span { color: #4ade80; }
  .auth-topbar-name small { font-size: 0.65rem; color: #86efac; font-weight: 600; margin-left: 3px; }
  .auth-back {
    display: flex; align-items: center; gap: 6px;
    color: #d1fae5; font-size: 0.88rem; font-weight: 600;
    text-decoration: none; transition: color 0.2s;
  }
  .auth-back:hover { color: #fff; }
  .auth-body {
    position: relative; z-index: 10; flex: 1;
    display: flex; align-items: center; padding: 2rem; gap: 3rem;
    max-width: 1200px; margin: 0 auto; width: 100%;
  }
  .auth-left { flex: 1; color: #fff; padding-right: 2rem; }
  .auth-left-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.12); border: 1px solid rgba(74,222,128,0.3);
    color: #4ade80; font-size: 0.78rem; font-weight: 700;
    padding: 6px 14px; border-radius: 50px; margin-bottom: 1.75rem;
    backdrop-filter: blur(4px);
  }
  .auth-left h1 {
    font-size: clamp(2rem, 4vw, 3rem); font-weight: 800;
    line-height: 1.15; letter-spacing: -0.03em; margin-bottom: 1.25rem;
  }
  .auth-left h1 .accent { color: #4ade80; }
  .auth-left p { font-size: 1rem; color: #d1fae5; line-height: 1.7; margin-bottom: 2rem; max-width: 420px; }
  .auth-checklist { display: flex; flex-direction: column; gap: 0.75rem; }
  .auth-check-item { display: flex; align-items: center; gap: 10px; }
  .check-icon {
    width: 24px; height: 24px; border-radius: 50%;
    background: rgba(34,197,94,0.2); border: 1.5px solid #4ade80;
    display: flex; align-items: center; justify-content: center;
    color: #4ade80; flex-shrink: 0;
  }
  .auth-check-item span { font-size: 0.9rem; color: #d1fae5; font-weight: 500; }
  .auth-stats { display: flex; gap: 1rem; margin-top: 2.5rem; flex-wrap: wrap; }
  .auth-stat {
    background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px; padding: 1rem 1.25rem;
    backdrop-filter: blur(6px); min-width: 100px;
  }
  .auth-stat .num { font-size: 1.6rem; font-weight: 800; color: #fff; line-height: 1; }
  .auth-stat .lbl { font-size: 0.72rem; color: #86efac; font-weight: 500; margin-top: 3px; }

  /* Card */
  .auth-card {
    width: 100%; max-width: 460px; background: #fff;
    border-radius: 24px; padding: 2.5rem;
    box-shadow: 0 24px 60px rgba(0,0,0,0.35); flex-shrink: 0;
  }
  .card-icon-img { width: 40px; height: 40px; object-fit: contain; margin-bottom: 1.5rem; }
  .auth-card h2 {
    font-size: 1.75rem; font-weight: 800; color: #0d1f0f;
    margin-bottom: 0.35rem; letter-spacing: -0.02em;
  }
  .auth-card .card-sub { font-size: 0.88rem; color: #6b7280; margin-bottom: 1.75rem; }
  .auth-card .card-sub a { color: #22c55e; font-weight: 700; text-decoration: none; }
  .auth-card .card-sub a:hover { text-decoration: underline; }

  /* Form */
  .form-group { margin-bottom: 1rem; }
  .form-label {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 0.82rem; font-weight: 700; color: #374151; margin-bottom: 0.4rem;
  }
  .form-label a { font-size: 0.78rem; color: #22c55e; font-weight: 700; text-decoration: none; }
  .form-label a:hover { text-decoration: underline; }
  .input-wrap { position: relative; display: flex; align-items: center; }
  .input-icon {
    position: absolute; left: 13px;
    display: flex; align-items: center;
    color: #9ca3af; pointer-events: none;
  }
  .input-wrap input {
    width: 100%; padding: 0.78rem 1rem 0.78rem 2.6rem;
    border: 1.5px solid #e5e7eb; border-radius: 12px;
    font-size: 0.9rem; font-family: 'Manrope', sans-serif;
    color: #0d1f0f; background: #f9fafb; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .input-wrap input:focus {
    border-color: #22c55e; background: #fff;
    box-shadow: 0 0 0 3px rgba(34,197,94,0.12);
  }
  .input-wrap input::placeholder { color: #9ca3af; }
  .input-eye {
    position: absolute; right: 12px; background: none; border: none;
    cursor: pointer; color: #9ca3af; padding: 4px;
    display: flex; align-items: center;
    transition: color 0.2s;
  }
  .input-eye:hover { color: #374151; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .form-group select {
    width: 100%; padding: 0.78rem 1rem;
    border: 1.5px solid #e5e7eb; border-radius: 12px;
    font-size: 0.9rem; font-family: 'Manrope', sans-serif;
    color: #0d1f0f; background: #f9fafb; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .form-group select:focus {
    border-color: #22c55e; background: #fff;
    box-shadow: 0 0 0 3px rgba(34,197,94,0.12);
  }

  /* Role cards */
  .role-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; }
  .role-card {
    border: 2px solid #e5e7eb; border-radius: 12px;
    padding: 0.75rem 0.4rem; text-align: center;
    cursor: pointer; transition: all 0.2s; background: #f9fafb;
  }
  .role-card:hover { border-color: #22c55e; }
  .role-card.selected { border-color: #22c55e; background: #f0fdf4; }
  .role-icon { display: flex; justify-content: center; align-items: center; margin-bottom: 4px; color: #9ca3af; }
  .role-card.selected .role-icon { color: #16a34a; }
  .role-card .rn { font-size: 0.7rem; font-weight: 700; color: #374151; }
  .role-card.selected .rn { color: #16a34a; }

  /* Remember */
  .remember-row { display: flex; align-items: center; gap: 8px; margin-bottom: 1.25rem; }
  .remember-row input[type="checkbox"] { width: 16px; height: 16px; accent-color: #22c55e; cursor: pointer; }
  .remember-row label { font-size: 0.82rem; color: #6b7280; cursor: pointer; }

  /* Submit */
  .btn-submit {
    width: 100%; padding: 0.88rem; border: none; border-radius: 12px;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: #fff; font-size: 0.95rem; font-weight: 700;
    font-family: 'Manrope', sans-serif; cursor: pointer;
    box-shadow: 0 6px 20px rgba(34,197,94,0.35);
    transition: transform 0.2s, box-shadow 0.2s;
    margin-top: 0.25rem; margin-bottom: 1rem;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(34,197,94,0.45); }
  .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* Error */
  .error-msg {
    background: #fef2f2; border: 1px solid #fecaca;
    border-radius: 10px; padding: 0.7rem 1rem;
    font-size: 0.83rem; color: #dc2626; margin-bottom: 1rem;
    display: flex; align-items: center; gap: 8px;
  }

  /* Test hint */
  .test-hint {
    background: #f0fdf4; border: 1px solid #bbf7d0;
    border-radius: 10px; padding: 0.75rem 1rem; margin-bottom: 1.25rem;
  }
  .test-hint p { font-size: 0.72rem; font-weight: 700; color: #16a34a; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
  .test-hint div { font-size: 0.75rem; color: #374151; }
  .test-hint span { color: #16a34a; font-weight: 600; }

  @media (max-width: 768px) {
    .auth-left { display: none; }
    .auth-body { justify-content: center; }
    .auth-card { max-width: 100%; }
  }
`

const WILAYAS = ['Bouira','Alger','Oran','Constantine','Annaba','Blida','Sétif','Biskra','Tizi Ouzou','Batna','Béjaïa','Médéa','Mostaganem','Tlemcen','Other']

// ── LOGIN ─────────────────────────────────────────────────────────────────────
export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = e => setForm({
    ...form,
    [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
  })

  const submit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(form.email, form.password)
    setLoading(false)
    if (result.success) navigate('/dashboard')
    else setError(result.error)
  }

  return (
    <>
      <style>{styles}</style>
      <div className="auth-page">
        <div className="auth-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1800&q=80')" }} />

        <div className="auth-topbar">
          <Link to="/" className="auth-topbar-logo">
            <img src={logoo} alt="logo" className="auth-topbar-icon-img" />
            <span className="auth-topbar-name">Agri<span>Sense</span><small> DZ</small></span>
          </Link>
          <Link to="/" className="auth-back">
            <Ic name="arrowLeft" size={14} /> Back to home
          </Link>
        </div>

        <div className="auth-body">
          <div className="auth-left">
            <div className="auth-left-badge">
              <Ic name="shield" size={13} /> Smart Farming Platform
            </div>
            <h1>Welcome back<br /><span className="accent">to smarter</span> farming.</h1>
            <p>Sign in to access your AgriSense dashboard and stay connected to your IoT sensors across Algeria's 58 wilayas.</p>
            <div className="auth-checklist">
              {[
                { icon: 'chart',   text: 'Real-time crop monitoring dashboard' },
                { icon: 'wifi',    text: 'Personalized alerts for your farm' },
                { icon: 'tractor', text: 'AI-powered yield forecasts' },
              ].map((item, i) => (
                <div key={i} className="auth-check-item">
                  <div className="check-icon"><Ic name="check" size={11} /></div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="auth-card">
            <img src={logoo} alt="logo" className="card-icon-img" />
            <h2>Sign in</h2>
            <p className="card-sub">No account yet? <Link to="/signup">Create one free →</Link></p>

            <div className="test-hint">
              <p>Test accounts — password: 123</p>
              {['farmer@test.com','supplier@test.com','technician@test.com'].map(e => (
                <div key={e}><span>{e}</span></div>
              ))}
            </div>

            {error && (
              <div className="error-msg">
                <Ic name="warning" size={15} /> {error}
              </div>
            )}

            <form onSubmit={submit}>
              <div className="form-group">
                <div className="form-label"><span>Email address</span></div>
                <div className="input-wrap">
                  <span className="input-icon"><Ic name="email" size={15} /></span>
                  <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} required />
                </div>
              </div>

              <div className="form-group">
                <div className="form-label">
                  <span>Password</span>
                  <a href="#">Forgot password?</a>
                </div>
                <div className="input-wrap">
                  <span className="input-icon"><Ic name="lock" size={15} /></span>
                  <input name="password" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={handle} required />
                  <button type="button" className="input-eye" onClick={() => setShowPass(!showPass)}>
                    <Ic name={showPass ? 'eyeOff' : 'eyeOn'} size={15} />
                  </button>
                </div>
              </div>

              <div className="remember-row">
                <input type="checkbox" id="remember" name="remember" checked={form.remember} onChange={handle} />
                <label htmlFor="remember">Remember me for 30 days</label>
              </div>

              <button className="btn-submit" type="submit" disabled={loading}>
                {loading ? 'Signing in...' : (
                  <><Ic name="shield" size={15} style={{ color: '#fff' }} /> Sign in</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

// ── SIGNUP ────────────────────────────────────────────────────────────────────
export function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState('farmer')
  const [form, setForm] = useState({ fullName: '', email: '', wilaya: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    const [firstName, ...rest] = form.fullName.trim().split(' ')
    await signup({ ...form, firstName, lastName: rest.join(' ') || '-', role })
    setLoading(false)
    navigate('/dashboard')
  }

  const roles = [
    { key: 'farmer',     iconName: 'tractor', label: 'Farmer' },
    { key: 'supplier',   iconName: 'truck',   label: 'Supplier' },
    { key: 'technician', iconName: 'wrench',  label: 'Technician' },
  ]

  return (
    <>
      <style>{styles}</style>
      <div className="auth-page">
        <div className="auth-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1800&q=80')" }} />

        <div className="auth-topbar">
          <Link to="/" className="auth-topbar-logo">
            <img src={logoo} alt="logo" className="auth-topbar-icon-img" />
            <span className="auth-topbar-name">Agri<span>Sense</span><small> DZ</small></span>
          </Link>
          <Link to="/" className="auth-back">
            <Ic name="arrowLeft" size={14} /> Back to home
          </Link>
        </div>

        <div className="auth-body">
          <div className="auth-left">
            <div className="auth-left-badge">
              <Ic name="tractor" size={13} /> Join Algeria's #1 AgriTech Platform
            </div>
            <h1>Grow smarter.<br /><span className="accent">Farm better.</span></h1>
            <p>Join hundreds of Algerian farmers and agribusinesses using real-time IoT data to protect their crops, cut costs, and increase yields.</p>
            <div className="auth-stats">
              {[
                { num: '58',    lbl: 'Wilayas covered' },
                { num: '2,400+', lbl: 'Active sensors' },
                { num: '850+',  lbl: 'Farmers' },
              ].map(s => (
                <div key={s.num} className="auth-stat">
                  <div className="num">{s.num}</div>
                  <div className="lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="auth-card">
            <img src={logoo} alt="logo" className="card-icon-img" />
            <h2>Create your account</h2>
            <p className="card-sub">Already registered? <Link to="/login">Sign in →</Link></p>

            <form onSubmit={submit}>
              <div className="form-group">
                <div className="form-label"><span>Full name</span></div>
                <div className="input-wrap">
                  <span className="input-icon"><Ic name="user" size={15} /></span>
                  <input name="fullName" placeholder="Your full name" value={form.fullName} onChange={handle} required />
                </div>
              </div>

              <div className="form-group">
                <div className="form-label"><span>Email address</span></div>
                <div className="input-wrap">
                  <span className="input-icon"><Ic name="email" size={15} /></span>
                  <input name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handle} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <div className="form-label"><span>Wilaya</span></div>
                  <select name="wilaya" value={form.wilaya} onChange={handle} required>
                    <option value="">Select</option>
                    {WILAYAS.map(w => <option key={w}>{w}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <div className="form-label"><span>I am a...</span></div>
                  <div className="role-grid">
                    {roles.map(r => (
                      <div key={r.key} className={`role-card ${role === r.key ? 'selected' : ''}`} onClick={() => setRole(r.key)}>
                        <div className="role-icon"><Ic name={r.iconName} size={20} /></div>
                        <div className="rn">{r.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div className="form-label"><span>Password</span></div>
                <div className="input-wrap">
                  <span className="input-icon"><Ic name="lock" size={15} /></span>
                  <input name="password" type="password" placeholder="Min 8 characters" value={form.password} onChange={handle} required minLength={8} />
                </div>
              </div>

              <button className="btn-submit" type="submit" disabled={loading}>
                {loading ? 'Creating account...' : (
                  <><Ic name="check" size={15} style={{ color: '#fff' }} /> Create account</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}