import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logoo from '../assets/logoo.png'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .auth-page {
    min-height: 100vh;
    width: 100%;
    font-family: 'Manrope', sans-serif;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  /* ── Full-screen background image ── */
  .auth-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    background-size: cover;
    background-position: center;
  }
  .auth-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(5,46,22,0.82) 0%, rgba(20,83,45,0.70) 100%);
  }

  /* ── Top bar (logo + back link) ── */
  .auth-topbar {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 2rem;
  }
  .auth-topbar-logo {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none;
  }
.auth-topbar-icon-img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}
  .auth-topbar-name {
    font-size: 1.1rem; font-weight: 800; color: #fff;
  }
  .auth-topbar-name span { color: #4ade80; }
  .auth-topbar-name small { font-size: 0.65rem; color: #86efac; font-weight: 600; margin-left: 3px; }
  .auth-back {
    display: flex; align-items: center; gap: 6px;
    color: #d1fae5; font-size: 0.88rem; font-weight: 600;
    text-decoration: none; transition: color 0.2s;
  }
  .auth-back:hover { color: #fff; }

  /* ── Main content row ── */
  .auth-body {
    position: relative;
    z-index: 10;
    flex: 1;
    display: flex;
    align-items: center;
    padding: 2rem;
    gap: 3rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }

  /* ── Left side text ── */
  .auth-left {
    flex: 1;
    color: #fff;
    padding-right: 2rem;
  }
  .auth-left-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(74,222,128,0.3);
    color: #4ade80;
    font-size: 0.78rem; font-weight: 700;
    padding: 6px 14px; border-radius: 50px;
    margin-bottom: 1.75rem;
    backdrop-filter: blur(4px);
  }
  .auth-left h1 {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.03em;
    margin-bottom: 1.25rem;
  }
  .auth-left h1 .accent { color: #4ade80; }
  .auth-left p {
    font-size: 1rem; color: #d1fae5;
    line-height: 1.7; margin-bottom: 2rem;
    max-width: 420px;
  }
  .auth-checklist { display: flex; flex-direction: column; gap: 0.75rem; }
  .auth-check-item { display: flex; align-items: center; gap: 10px; }
  .check-icon {
    width: 24px; height: 24px; border-radius: 50%;
    background: rgba(34,197,94,0.2);
    border: 1.5px solid #4ade80;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; color: #4ade80; flex-shrink: 0;
  }
  .auth-check-item span { font-size: 0.9rem; color: #d1fae5; font-weight: 500; }

  /* Stats row (signup page) */
  .auth-stats { display: flex; gap: 1rem; margin-top: 2.5rem; flex-wrap: wrap; }
  .auth-stat {
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px; padding: 1rem 1.25rem;
    backdrop-filter: blur(6px); min-width: 100px;
  }
  .auth-stat .num { font-size: 1.6rem; font-weight: 800; color: #fff; line-height: 1; }
  .auth-stat .lbl { font-size: 0.72rem; color: #86efac; font-weight: 500; margin-top: 3px; }

  /* ── Right side card ── */
  .auth-card {
    width: 100%;
    max-width: 460px;
    background: #fff;
    border-radius: 24px;
    padding: 2.5rem;
    box-shadow: 0 24px 60px rgba(0,0,0,0.35);
    flex-shrink: 0;
  }
.card-icon-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin-bottom: 1.5rem;
}
  .auth-card h2 {
    font-size: 1.75rem; font-weight: 800;
    color: #0d1f0f; margin-bottom: 0.35rem;
    letter-spacing: -0.02em;
  }
  .auth-card .card-sub {
    font-size: 0.88rem; color: #6b7280; margin-bottom: 1.75rem;
  }
  .auth-card .card-sub a { color: #22c55e; font-weight: 700; text-decoration: none; }
  .auth-card .card-sub a:hover { text-decoration: underline; }

  /* Form elements */
  .form-group { margin-bottom: 1rem; }
  .form-label {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 0.82rem; font-weight: 700; color: #374151; margin-bottom: 0.4rem;
  }
  .form-label a { font-size: 0.78rem; color: #22c55e; font-weight: 700; text-decoration: none; }
  .form-label a:hover { text-decoration: underline; }

  .input-wrap {
    position: relative; display: flex; align-items: center;
  }
  .input-icon {
    position: absolute; left: 14px;
    font-size: 15px; color: #9ca3af; pointer-events: none;
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
    position: absolute; right: 14px;
    background: none; border: none; cursor: pointer;
    font-size: 15px; color: #9ca3af; padding: 0;
  }

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
  .role-card .re { font-size: 1.3rem; margin-bottom: 3px; }
  .role-card .rn { font-size: 0.7rem; font-weight: 700; color: #374151; }
  .role-card.selected .rn { color: #16a34a; }

  /* Remember me */
  .remember-row {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 1.25rem;
  }
  .remember-row input[type="checkbox"] {
    width: 16px; height: 16px; accent-color: #22c55e; cursor: pointer;
  }
  .remember-row label { font-size: 0.82rem; color: #6b7280; cursor: pointer; }

  /* Submit button */
  .btn-submit {
    width: 100%; padding: 0.88rem; border: none; border-radius: 12px;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: #fff; font-size: 0.95rem; font-weight: 700;
    font-family: 'Manrope', sans-serif; cursor: pointer;
    box-shadow: 0 6px 20px rgba(34,197,94,0.35);
    transition: transform 0.2s, box-shadow 0.2s;
    margin-top: 0.25rem; margin-bottom: 1rem;
  }
  .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(34,197,94,0.45); }
  .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* Error */
  .error-msg {
    background: #fef2f2; border: 1px solid #fecaca;
    border-radius: 10px; padding: 0.7rem 1rem;
    font-size: 0.83rem; color: #dc2626; margin-bottom: 1rem;
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
        {/* Background */}
        <div className="auth-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1800&q=80')" }} />

        {/* Top bar */}
        <div className="auth-topbar">
          <Link to="/" className="auth-topbar-logo">
            <img src={logoo} alt="logo" className="auth-topbar-icon-img" />
            <span className="auth-topbar-name">
              Agri<span>Sense</span><small> DZ</small>
            </span>
          </Link>
          <Link to="/" className="auth-back">← Back to home</Link>
        </div>

        {/* Body */}
        <div className="auth-body">
          {/* Left */}
          <div className="auth-left">
            <div className="auth-left-badge">🌿 Smart Farming Platform</div>
            <h1>
              Welcome back<br />
              <span className="accent">to smarter</span> farming.
            </h1>
            <p>Sign in to access your AgriSense dashboard and stay connected to your IoT sensors across Algeria's 48 wilayas.</p>
            <div className="auth-checklist">
              {[
                'Real-time crop monitoring dashboard',
                'Personalized alerts for your farm',
                'AI-powered yield forecasts',
              ].map((item, i) => (
                <div key={i} className="auth-check-item">
                  <div className="check-icon">✓</div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card */}
          <div className="auth-card">
            <img src={logoo} alt="logo" className="card-icon-img" />
            <h2>Sign in</h2>
            <p className="card-sub">
              No account yet? <Link to="/signup">Create one free →</Link>
            </p>

            <div className="test-hint">
              <p>🧪 Test accounts — password: password123</p>
              {['farmer@test.com','supplier@test.com','technician@test.com'].map(e => (
                <div key={e}><span>{e}</span></div>
              ))}
            </div>

            {error && <div className="error-msg">⚠️ {error}</div>}

            <form onSubmit={submit}>
              <div className="form-group">
                <div className="form-label"><span>Email address</span></div>
                <div className="input-wrap">
                  <span className="input-icon">✉</span>
                  <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} required />
                </div>
              </div>

              <div className="form-group">
                <div className="form-label">
                  <span>Password</span>
                  <a href="#">Forgot password?</a>
                </div>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input name="password" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={handle} required />
                  <button type="button" className="input-eye" onClick={() => setShowPass(!showPass)}>
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <div className="remember-row">
                <input type="checkbox" id="remember" name="remember" checked={form.remember} onChange={handle} />
                <label htmlFor="remember">Remember me for 30 days</label>
              </div>

              <button className="btn-submit" type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in →'}
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
    { key: 'farmer',     emoji: '🌾', label: 'Farmer' },
    { key: 'supplier',   emoji: '🏭',   label: 'Supplier' },
    { key: 'technician', emoji: '🔧',   label: 'Technician' },
  ]

  return (
    <>
      <style>{styles}</style>
      <div className="auth-page">
        {/* Background */}
        <div className="auth-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1800&q=80')" }} />

        {/* Top bar */}
        <div className="auth-topbar">
          <Link to="/" className="auth-topbar-logo">
           <img src={logoo} alt="logo" className="auth-topbar-icon-img" />
            <span className="auth-topbar-name">
              Agri<span>Sense</span><small> DZ</small>
            </span>
          </Link>
          <Link to="/" className="auth-back">← Back to home</Link>
        </div>

        {/* Body */}
        <div className="auth-body">
          {/* Left */}
          <div className="auth-left">
            <div className="auth-left-badge">🌿 Join Algeria's #1 AgriTech Platform</div>
            <h1>
              Grow smarter.<br />
              <span className="accent">Farm better.</span>
            </h1>
            <p>Join hundreds of Algerian farmers and agribusinesses using real-time IoT data to protect their crops, cut costs, and increase yields.</p>

            <div className="auth-stats">
              {[
                { num: '69',    lbl: 'Wilayas covered' },
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

          {/* Card */}
          <div className="auth-card">
            <img src={logoo} alt="logo" className="card-icon-img" />
            <h2>Create your account</h2>
            <p className="card-sub">
              Already registered? <Link to="/login">Sign in →</Link>
            </p>

            <form onSubmit={submit}>
              <div className="form-group">
                <div className="form-label"><span>Full name</span></div>
                <div className="input-wrap">
                  <span className="input-icon"></span>
                  <input name="fullName" placeholder="full name" value={form.fullName} onChange={handle} required />
                </div>
              </div>

              <div className="form-group">
                <div className="form-label"><span>Email address</span></div>
                <div className="input-wrap">
                  <span className="input-icon">✉</span>
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
                        <div className="re">{r.emoji}</div>
                        <div className="rn">{r.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div className="form-label"><span>Password</span></div>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input name="password" type="password" placeholder="Min 8 characters" value={form.password} onChange={handle} required minLength={8} />
                </div>
              </div>

              <button className="btn-submit" type="submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Create account →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
