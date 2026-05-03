import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import logoo from '../assets/logoo.png'

// ─── Shared styles ────────────────────────────────────────────────────────────

const S = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Manrope',sans-serif;overflow-x:hidden}

/* ── LAYOUT ── */
.db{display:flex;min-height:100vh;background:#f4f6f8;font-family:'Manrope',sans-serif;position:relative}

/* ── SIDEBAR ── */
.sb{
  width:300px;background:#0d1117;
  display:flex;flex-direction:column;
  position:fixed;top:0;left:0;bottom:0;z-index:200;
  transition:transform 0.3s ease;
  overflow-y:auto;overflow-x:hidden;
}

/* ── SIDEBAR OVERLAY (mobile only) ── */
.sb-overlay{
  display:none;
  position:fixed;inset:0;
  background:rgba(0,0,0,0.3);
  z-index:199;
}

/* ── MAIN ── */
.db-main{
  margin-left:300px;
  flex:1;display:flex;flex-direction:column;min-height:100vh;
  transition:margin-left 0.3s ease;
}

/* ── TOPBAR ── */
.topbar{
  height:64px;background:#fff;
  border-bottom:1px solid #e5e7eb;
  display:flex;align-items:center;
  justify-content:space-between;
  padding:0 1.5rem;
  position:sticky;top:0;z-index:100;
  gap:1rem;
}

/* Hamburger */
.tb-hamburger{
  display:none;
  background:none;border:none;cursor:pointer;
  padding:6px;border-radius:8px;
  color:#6b7280;font-size:20px;
  flex-shrink:0;
  transition:background 0.15s;
}
.tb-hamburger:hover{background:#f3f4f6}

/* Breadcrumb */
.tb-breadcrumb{
  display:flex;align-items:center;gap:6px;
  font-size:0.88rem;color:#9ca3af;font-weight:500;
  flex-shrink:0;
}
.tb-breadcrumb .tb-brand{color:#374151;font-weight:600}
.tb-breadcrumb .tb-sep{color:#d1d5db}
.tb-breadcrumb .tb-page{color:#0d1f0f;font-weight:800;font-size:0.95rem}

/* Search */
.tb-search{
  flex:1;max-width:360px;
  display:flex;align-items:center;gap:8px;
  background:#f9fafb;border:1px solid #e5e7eb;
  border-radius:50px;padding:0.45rem 1rem;
}
.tb-search input{
  border:none;outline:none;background:none;
  font-size:0.85rem;font-family:'Manrope',sans-serif;
  color:#374151;width:100%;
}
.tb-search input::placeholder{color:#9ca3af}
.tb-search-icon{font-size:14px;color:#9ca3af;flex-shrink:0}

/* Right actions */
.tb-actions{display:flex;align-items:center;gap:0.6rem;flex-shrink:0}
.tb-time{font-size:0.82rem;font-weight:700;color:#374151;white-space:nowrap}
.tb-icon-btn{
  width:36px;height:36px;border-radius:50%;
  border:1px solid #e5e7eb;background:#fff;
  cursor:pointer;display:flex;align-items:center;
  justify-content:center;font-size:16px;
  position:relative;transition:background 0.15s;
  flex-shrink:0;
}
.tb-icon-btn:hover{background:#f9fafb}
.tb-notif-dot{
  position:absolute;top:5px;right:5px;
  width:8px;height:8px;border-radius:50%;
  background:#ef4444;border:2px solid #fff;
}

/* User pill */
.tb-user-btn{
  display:flex;align-items:center;gap:8px;
  background:#fffbeb;border:1px solid #fde68a;
  border-radius:50px;padding:5px 12px 5px 5px;
  cursor:pointer;transition:background 0.2s;
  position:relative;flex-shrink:0;
}
.tb-user-btn:hover{background:#fef3c7}
.tb-user-av{
  width:28px;height:28px;border-radius:50%;
  background:linear-gradient(135deg,#f59e0b,#d97706);
  display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:800;color:#fff;flex-shrink:0;
}
.tb-user-name{font-size:0.82rem;font-weight:700;color:#d97706}
.tb-chevron{font-size:10px;color:#d97706}

/* User dropdown */
.user-dropdown{
  position:absolute;top:calc(100% + 8px);right:0;
  background:#fff;border:1px solid #e5e7eb;
  border-radius:16px;padding:0.5rem;
  min-width:220px;
  box-shadow:0 8px 30px rgba(0,0,0,0.12);
  z-index:500;
}
.ud-header{padding:0.75rem 0.75rem 0.5rem;border-bottom:1px solid #f3f4f6;margin-bottom:0.25rem}
.ud-name{font-size:0.92rem;font-weight:800;color:#0d1f0f}
.ud-role{font-size:0.75rem;color:#6b7280;margin-top:2px}
.ud-item{
  display:flex;align-items:center;gap:10px;
  padding:0.65rem 0.75rem;border-radius:10px;
  cursor:pointer;font-size:0.85rem;font-weight:600;
  color:#374151;transition:background 0.15s;
  border:none;background:none;width:100%;text-align:left;
  font-family:'Manrope',sans-serif;
}
.ud-item:hover{background:#f9fafb}
.ud-item.danger{color:#ef4444}
.ud-item.danger:hover{background:#fef2f2}
.ud-sep{height:1px;background:#f3f4f6;margin:0.25rem 0}

/* Live badge */
.tb-live{
  display:flex;align-items:center;gap:6px;
  background:#fffbeb;border:1px solid #fde68a;
  border-radius:50px;padding:5px 12px;
  font-size:0.72rem;font-weight:700;color:#d97706;
  white-space:nowrap;flex-shrink:0;
}
.tb-live-dot{width:7px;height:7px;border-radius:50%;background:#f59e0b;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}

/* ── SIDEBAR INTERNALS ── */
.sb-header{
  padding:1.25rem 1.25rem 0.5rem;
  display:flex;align-items:center;justify-content:space-between;
}
.sb-brand-row{display:flex;align-items:center;gap:10px}
.sb-logo-img{width:36px;height:36px;object-fit:contain;border-radius:8px}
.sb-brand-text .sb-name{font-size:1rem;font-weight:800;color:#fff}
.sb-brand-text .sb-name span{color:#fbbf24}
.sb-brand-text .sb-sub{font-size:0.65rem;color:#fbbf24;font-weight:600;text-transform:uppercase;letter-spacing:0.08em}
.sb-close-btn{
  background:rgba(255,255,255,0.08);border:none;cursor:pointer;
  width:28px;height:28px;border-radius:8px;
  display:flex;align-items:center;justify-content:center;
  color:#9ca3af;font-size:16px;transition:background 0.15s;
  display:none;
}
.sb-close-btn:hover{background:rgba(255,255,255,0.15)}

.sb-system{
  margin:0.75rem 1.25rem 1rem;
  background:rgba(245,158,11,0.15);border:1px solid rgba(251,191,36,0.25);
  border-radius:12px;padding:0.75rem 1rem;
  display:flex;align-items:center;gap:10px;
}
.sb-sys-dot{width:8px;height:8px;border-radius:50%;background:#f59e0b;box-shadow:0 0 8px rgba(245,158,11,0.5);flex-shrink:0}
.sb-sys-info .sb-sys-title{font-size:0.82rem;font-weight:700;color:#fbbf24}
.sb-sys-info .sb-sys-sub{font-size:0.68rem;color:#fcd34d;margin-top:1px}

.sb-section-label{
  font-size:0.6rem;font-weight:700;color:#60501a;
  text-transform:uppercase;letter-spacing:0.14em;
  padding:0.75rem 1.25rem 0.3rem;
}
.sb-nav-group{display:flex;flex-direction:column;gap:2px;padding:0 0.75rem;margin-bottom:0.5rem}
.sb-item{
  display:flex;align-items:center;gap:10px;
  padding:0.65rem 0.75rem;border-radius:10px;
  cursor:pointer;border:none;background:none;
  width:100%;text-align:left;transition:all 0.15s;
}
.sb-item:hover{background:rgba(255,255,255,0.06)}
.sb-item.active{background:rgba(245,158,11,0.18);border-left:3px solid #f59e0b}
.sb-item-icon{font-size:16px;width:20px;text-align:center;flex-shrink:0}
.sb-item-label{font-size:0.88rem;font-weight:600;color:#9ca3af}
.sb-item.active .sb-item-label{color:#fbbf24}
.sb-item:hover .sb-item-label{color:#d1d5db}
.sb-badge{margin-left:auto;background:#ef4444;color:#fff;font-size:0.62rem;font-weight:800;padding:2px 7px;border-radius:50px}

.sb-foot{
  margin-top:auto;border-top:1px solid rgba(255,255,255,0.08);
  padding:1rem 1.25rem;display:flex;align-items:center;gap:10px;
}
.sb-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#d97706);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;flex-shrink:0}
.sb-user-info .sb-user-name{font-size:0.85rem;font-weight:700;color:#fff}
.sb-user-info .sb-user-role{font-size:0.68rem;color:#fbbf24;font-weight:500}
.sb-logout-btn{margin-left:auto;background:none;border:none;cursor:pointer;font-size:18px;color:#6b7280;transition:color 0.2s;padding:4px}
.sb-logout-btn:hover{color:#ef4444}

/* ── CONTENT ── */
.db-content{flex:1;padding:1.5rem 2rem;overflow-y:auto}

/* ── PAGE HEADER ── */
.page-header{margin-bottom:1.5rem}
.page-header h1{font-size:1.5rem;font-weight:800;color:#0d1f0f}
.page-header p{font-size:0.85rem;color:#6b7280;margin-top:3px}
.page-header-row{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem}
.live-badge{display:flex;align-items:center;gap:6px;background:#fffbeb;border:1px solid #fde68a;border-radius:50px;padding:6px 14px;font-size:0.75rem;font-weight:700;color:#d97706;white-space:nowrap;flex-shrink:0}
.live-dot{width:7px;height:7px;border-radius:50%;background:#f59e0b;animation:pulse 2s infinite}

/* ── KPI ── */
.kpi-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-bottom:1.5rem}
.kpi-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.5rem;position:relative;overflow:hidden;transition:box-shadow 0.2s}
.kpi-card:hover{box-shadow:0 4px 20px rgba(0,0,0,0.07)}
.kpi-accent{position:absolute;top:0;left:0;right:0;height:3px;border-radius:16px 16px 0 0}
.kpi-accent.amber{background:#f59e0b}
.kpi-accent.green{background:#22c55e}
.kpi-accent.blue{background:#3b82f6}
.kpi-accent.red{background:#ef4444}
.kpi-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;margin-top:0.5rem}
.kpi-icon-wrap{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:20px}
.kpi-icon-wrap.amber{background:#fffbeb}
.kpi-icon-wrap.green{background:#f0fdf4}
.kpi-icon-wrap.blue{background:#eff6ff}
.kpi-icon-wrap.red{background:#fef2f2}
.kpi-trend{font-size:0.75rem;font-weight:700}
.kpi-trend.up{color:#16a34a}
.kpi-trend.down{color:#ef4444}
.kpi-value{font-size:2rem;font-weight:800;color:#0d1f0f;line-height:1;margin-bottom:0.25rem}
.kpi-label{font-size:0.82rem;font-weight:600;color:#374151;margin-bottom:2px}
.kpi-sub{font-size:0.72rem;color:#9ca3af}

/* ── ASSIGNMENTS ── */
.assignments-section{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.5rem;margin-bottom:1.25rem}
.assignments-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem}
.assignments-head h3{font-size:1rem;font-weight:700;color:#0d1f0f}
.assignments-head a{font-size:0.82rem;color:#f59e0b;font-weight:700;text-decoration:none;cursor:pointer}

.assignment-card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:1.25rem;margin-bottom:1rem;transition:all 0.2s}
.assignment-card:hover{box-shadow:0 4px 12px rgba(0,0,0,0.05);border-color:#fde68a}
.assignment-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:0.75rem}
.assignment-num{font-size:0.78rem;color:#9ca3af;font-weight:600}
.assignment-priority{font-size:0.72rem;font-weight:700;padding:3px 10px;border-radius:50px}
.assignment-priority.high{background:#fef2f2;color:#dc2626}
.assignment-priority.medium{background:#fffbeb;color:#d97706}
.assignment-priority.low{background:#f0fdf4;color:#16a34a}
.assignment-title{font-size:0.95rem;font-weight:700;color:#0d1f0f;margin-bottom:4px}
.assignment-meta{font-size:0.75rem;color:#9ca3af;margin-bottom:0.75rem;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.assignment-desc{font-size:0.82rem;color:#6b7280;margin-bottom:0.75rem;padding-bottom:0.75rem;border-bottom:1px solid #f3f4f6}
.assignment-footer{display:flex;align-items:center;justify-content:flex-end;gap:8px}
.assignment-btn{padding:6px 14px;border-radius:50px;border:1.5px solid #e5e7eb;background:#fff;font-size:0.75rem;font-weight:600;cursor:pointer;color:#374151;transition:all 0.15s}
.assignment-btn.primary{background:linear-gradient(135deg,#f59e0b,#d97706);border-color:#f59e0b;color:#fff}
.assignment-btn.primary:hover{background:#d97706}
.assignment-btn:hover{border-color:#f59e0b;color:#d97706}

/* ── REPORT FORM ── */
.report-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.75rem;margin-bottom:1.25rem}
.report-card h3{font-size:1rem;font-weight:700;color:#0d1f0f;margin-bottom:0.25rem}
.report-card > p{font-size:0.82rem;color:#9ca3af;margin-bottom:1.5rem}
.form-group{margin-bottom:1rem}
.form-group label{display:block;font-size:0.78rem;font-weight:700;color:#374151;margin-bottom:0.4rem}
.form-group select,.form-group input,.form-group textarea{width:100%;padding:0.7rem 1rem;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.88rem;font-family:'Manrope',sans-serif;background:#fafafa;color:#0d1f0f;outline:none}
.form-group select:focus,.form-group input:focus,.form-group textarea:focus{border-color:#f59e0b;background:#fff}
.form-group textarea{min-height:100px;resize:vertical}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem}
.status-opts{display:flex;gap:0.75rem;flex-wrap:wrap}
.status-opt{padding:7px 14px;border:2px solid #e5e7eb;border-radius:10px;font-size:0.82rem;font-weight:600;cursor:pointer;background:#fff;color:#374151;font-family:'Manrope',sans-serif;transition:all 0.15s}
.status-opt.sel{border-color:#f59e0b;background:#fffbeb;color:#d97706}
.btn-submit{width:100%;padding:0.85rem;border-radius:12px;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;font-size:0.95rem;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif;margin-top:0.5rem}
.btn-submit:hover{background:#d97706}
.submit-success{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:0.75rem 1rem;font-size:0.85rem;color:#16a34a;font-weight:600;margin-top:0.75rem}

/* History card */
.history-card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:1.25rem;margin-bottom:1rem;opacity:0.85}
.history-check{width:44px;height:44px;border-radius:12px;background:#f0fdf4;display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:800;color:#16a34a;flex-shrink:0}
.history-title{font-size:0.95rem;font-weight:700;color:#0d1f0f;margin-bottom:4px}
.history-meta{font-size:0.75rem;color:#9ca3af;display:flex;gap:12px;flex-wrap:wrap;margin-bottom:0.75rem}

/* ══ RESPONSIVE ══ */
@media (max-width: 900px) {
  .kpi-grid { grid-template-columns: repeat(2,1fr); }
  .form-row { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .sb {
    transform: translateX(-100%);
    box-shadow: 4px 0 30px rgba(0,0,0,0.2);
    z-index:300;
  }
  .sb.mobile-open {
    transform: translateX(0);
  }
  .sb-overlay {
    display: block;
  }
  .sb-overlay.hidden {
    display: none;
  }
  .sb-close-btn {
    display: flex;
  }
  .db-main {
    margin-left: 0 !important;
  }
  .tb-hamburger {
    display: flex;
  }
  .tb-search {
    display: none;
  }
  .db-content {
    padding: 1rem 1rem;
  }
  .topbar {
    padding: 0 1rem;
  }
  .kpi-grid { grid-template-columns: 1fr; gap: 0.75rem; }
  .assignment-header { flex-direction: column; gap: 0.5rem; }
  .assignment-footer { justify-content: flex-start; }
  .assignment-meta { gap: 8px; }
}

@media (max-width: 480px) {
  .kpi-value { font-size: 1.6rem; }
  .assignment-card { padding: 1rem; }
  .status-opts { gap: 0.5rem; }
  .status-opt { padding: 5px 10px; font-size: 0.75rem; }
}
`

// ─── DATA ────────────────────────────────────────────────────────────────────

const ASSIGNMENTS_DATA = [
  { id:1, num:'01', title:'Install AgroSense Pro — Farm1', priority:'high', farm:'Farm1 · Ahmed', wilaya:'Sétif', date:'Today, 9:00 AM', desc:'Install 3× AgroSense Pro sensors in fields A, B, and C. Configure LoRa gateway and pair all devices to the farmer dashboard. Test readings before leaving.' },
  { id:2, num:'02', title:'Replace IrriBot sensor — Farm2', priority:'medium', farm:'Farm2 · Fatima', wilaya:'Blida', date:'Tomorrow, 2:00 PM', desc:'Faulty pressure sensor needs replacement. Bring spare IrriBot valve + pressure module. Run full system diagnostics after swap.' },
  { id:3, num:'03', title:'Network setup — Greenhouse', priority:'low', farm:'Farm3 · Mohamed', wilaya:'Oran', date:'Dec 18, 10:00 AM', desc:'New greenhouse installation. Set up SolarHub gateway on roof, run sensor cables through irrigation trenches, calibrate all 6 climate sensors.' },
]

const STATUS_OPTS = ['Completed ✅', 'In Progress 🔧', 'Pending ⏳', 'Blocked ❌']

export default function TechnicianDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('assignments')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userDropOpen, setUserDropOpen] = useState(false)
  const [now, setNow] = useState(new Date())
  const [reportStatus, setReportStatus] = useState('Completed ✅')
  const [sent, setSent] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const handler = (e) => { if(dropRef.current && !dropRef.current.contains(e.target)) setUserDropOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleTabChange = (key) => {
    setTab(key)
    if(window.innerWidth <= 768) setSidebarOpen(false)
  }
const handleNotifications = () => {
  setTab('assignments')
  setUserDropOpen(false)
  if(window.innerWidth <= 768) setSidebarOpen(false)
}
  const firstName = user?.firstName || 'Technician'
  const lastName = user?.lastName || ''
  const initials = `${firstName[0]}${lastName[0] || ''}`
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const timeStr = now.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' })

  const navSections = [
    { label: 'Technician Menu', items: [
      { key: 'assignments', icon: '🗓️', label: 'Assignments' },
      { key: 'report', icon: '📋', label: 'Send Report' },
      { key: 'history', icon: '📁', label: 'History' },
    ]},
    { label: 'Manage', items: [
      { key: 'analytics', icon: '📊', label: 'Analytics' },
      { key: 'settings', icon: '⚙', label: 'Settings' },
    ]},
  ]

  const currentPageLabel = navSections.flatMap(s => s.items).find(i => i.key === tab)?.label || 'Dashboard'

  const activeAssignments = ASSIGNMENTS_DATA.length
  const urgentCount = ASSIGNMENTS_DATA.filter(a => a.priority === 'high').length
  const completedThisMonth = 28
  const farmerRating = 4.9

  return (
    <>
      <style>{S}</style>
      <div className="db">

        {/* Sidebar Overlay */}
        <div
          className={`sb-overlay${sidebarOpen ? '' : ' hidden'}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside className={`sb${sidebarOpen ? ' mobile-open' : ''}`}>
          <div className="sb-header">
            <div className="sb-brand-row">
              <img src={logoo} alt="logo" className="sb-logo-img"/>
              <div className="sb-brand-text">
                <div className="sb-name">Agri<span>Sense</span></div>
                <div className="sb-sub">Technician Panel</div>
              </div>
            </div>
            <button className="sb-close-btn" onClick={() => setSidebarOpen(false)}>✕</button>
          </div>

          <div className="sb-system">
            <div className="sb-sys-dot"/>
            <div className="sb-sys-info">
              <div className="sb-sys-title">Active Duty</div>
              <div className="sb-sys-sub">{activeAssignments} assignments · On track</div>
            </div>
          </div>

          {navSections.map(section => (
            <div key={section.label}>
              <div className="sb-section-label">{section.label}</div>
              <div className="sb-nav-group">
                {section.items.map(n => (
                  <button key={n.key} className={`sb-item${tab === n.key ? ' active' : ''}`} onClick={() => handleTabChange(n.key)}>
                    <span className="sb-item-icon">{n.icon}</span>
                    <span className="sb-item-label">{n.label}</span>
                    {n.key === 'assignments' && urgentCount > 0 && <span className="sb-badge">{urgentCount}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="sb-foot">
            <div className="sb-avatar">{initials}</div>
            <div className="sb-user-info">
              <div className="sb-user-name">{firstName} {lastName}</div>
              <div className="sb-user-role">Technician</div>
            </div>
            <button className="sb-logout-btn" title="Logout" onClick={() => { logout(); navigate('/') }}>⇥</button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="db-main" style={{marginLeft: sidebarOpen && window.innerWidth > 768 ? '300px' : ''}}>

          {/* Topbar */}
          <div className="topbar">
            <div style={{display:'flex', alignItems:'center', gap:'10px', minWidth:0}}>
              <button className="tb-hamburger" onClick={() => setSidebarOpen(o => !o)}>☰</button>
              <div className="tb-breadcrumb">
                <span className="tb-brand">AgriSense DZ</span>
                <span className="tb-sep">›</span>
                <span className="tb-page">{currentPageLabel}</span>
              </div>
            </div>

            <div className="tb-search">
              <span className="tb-search-icon">🔍</span>
              <input placeholder="Search assignments, reports..."/>
            </div>

            <div className="tb-actions">
              <span className="tb-time">{timeStr}</span>
              <button className="tb-icon-btn" title="Refresh">↻</button>
             <button className="tb-icon-btn" title="Notifications" onClick={handleNotifications}>
  🔔<span className="tb-notif-dot"/>
</button>
              {tab === 'assignments' && (
                <div className="tb-live"><span className="tb-live-dot"/>Live · updated now</div>
              )}
              <div style={{position:'relative'}} ref={dropRef}>
                <button className="tb-user-btn" onClick={() => setUserDropOpen(o => !o)}>
                  <div className="tb-user-av">{initials}</div>
                  <span className="tb-user-name">{firstName}</span>
                  <span className="tb-chevron">{userDropOpen ? '▲' : '▼'}</span>
                </button>
                {userDropOpen && (
                  <div className="user-dropdown">
                    <div className="ud-header">
                      <div className="ud-name">{firstName} {lastName}</div>
                      <div className="ud-role">Technician · {user?.wilaya || 'Algiers'}</div>
                    </div>
                    <button className="ud-item" onClick={() => { setTab('settings'); setUserDropOpen(false) }}>
                      👤 Profile &amp; Settings
                    </button>
                    <button className="ud-item" onClick={() => navigate('/')}>
                      🏠 Back to Home
                    </button>
                    <div className="ud-sep"/>
                    <button className="ud-item danger" onClick={() => { logout(); navigate('/') }}>
                      ⇥ Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="db-content">

            {/* Overview / Assignments Tab */}
            {tab === 'assignments' && (
              <>
                <div className="page-header-row">
                  <div className="page-header">
                    <h1>{greeting}, {firstName} 🔧</h1>
                    <p>Your assigned installations and field reports.</p>
                  </div>
                  <div className="live-badge"><span className="live-dot"/>Live · updated now</div>
                </div>

                <div className="kpi-grid">
                  {[
                    { icon:'🗓️', iconClass:'amber', accent:'amber', val:activeAssignments, label:'Active Assignments', sub:`${urgentCount} urgent`, trend:'↗ 2', dir:'up' },
                    { icon:'✅', iconClass:'green', accent:'green', val:completedThisMonth, label:'Completed This Month', sub:'+4 vs last month', trend:'↗ 12%', dir:'up' },
                    { icon:'📋', iconClass:'blue', accent:'blue', val:'12', label:'Reports Sent', sub:'This quarter', trend:'On track', dir:'up' },
                    { icon:'⭐', iconClass:'amber', accent:'amber', val:farmerRating, label:'Farmer Rating', sub:'From 45 reviews', trend:'Excellent', dir:'up' },
                  ].map((k, i) => (
                    <div key={i} className="kpi-card">
                      <div className={`kpi-accent ${k.accent}`}/>
                      <div className="kpi-top">
                        <div className={`kpi-icon-wrap ${k.iconClass}`}>{k.icon}</div>
                        <span className={`kpi-trend ${k.dir}`}>{k.trend}</span>
                      </div>
                      <div className="kpi-value">{k.val}</div>
                      <div className="kpi-label">{k.label}</div>
                      <div className="kpi-sub">{k.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="assignments-section">
                  <div className="assignments-head">
                    <h3>🗓️ Your Assignments ({activeAssignments})</h3>
                  </div>
                  {ASSIGNMENTS_DATA.map(a => (
                    <div key={a.id} className="assignment-card">
                      <div className="assignment-header">
                        <span className="assignment-num">#{a.num}</span>
                        <span className={`assignment-priority ${a.priority}`}>{a.priority.toUpperCase()} priority</span>
                      </div>
                      <div className="assignment-title">{a.title}</div>
                      <div className="assignment-meta">
                        <span>🧑‍🌾 {a.farm}</span>
                        <span>📍 {a.wilaya}</span>
                        <span>🕐 {a.date}</span>
                      </div>
                      <div className="assignment-desc">{a.desc}</div>
                      <div className="assignment-footer">
                        <button className="assignment-btn primary" onClick={() => setTab('report')}>Send Report 📋</button>
                        <button className="assignment-btn">View Map 🗺️</button>
                        <button className="assignment-btn">Call Farmer 📞</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Report Tab */}
            {tab === 'report' && (
              <>
                <div className="page-header">
                  <h1>Send Installation Report</h1>
                  <p>Fill in details about the completed or in-progress installation.</p>
                </div>

                <div className="report-card">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Assignment</label>
                      <select>
                        {ASSIGNMENTS_DATA.map(a => (
                          <option key={a.id}>#{a.num}. {a.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Visit Date</label>
                      <input type="date" defaultValue={new Date().toISOString().split('T')[0]}/>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Installation Status</label>
                    <div className="status-opts">
                      {STATUS_OPTS.map(s => (
                        <div key={s} className={`status-opt ${reportStatus === s ? 'sel' : ''}`} onClick={() => setReportStatus(s)}>
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Devices Installed</label>
                      <input placeholder="e.g. 3× AgroSense Pro, 1× Gateway"/>
                    </div>
                    <div className="form-group">
                      <label>Time Spent (hours)</label>
                      <input type="number" placeholder="e.g. 3.5" min="0" step="0.5"/>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Field Notes</label>
                    <textarea placeholder="Describe what was done, any issues, and recommendations..."/>
                  </div>

                  <div className="form-group">
                    <label>Issues / Follow-up Needed</label>
                    <textarea placeholder="Leave blank if none..." style={{minHeight:'60px'}}/>
                  </div>

                  <button className="btn-submit" onClick={() => { setSent(true); setTimeout(() => setSent(false), 3000) }}>
                    Submit Report →
                  </button>
                  {sent && <div className="submit-success">✅ Report submitted! The farmer has been notified.</div>}
                </div>
              </>
            )}

            {/* History Tab */}
            {tab === 'history' && (
              <>
                <div className="page-header">
                  <h1>Past Installations</h1>
                  <p>View your completed assignment history</p>
                </div>

                <div className="assignments-section">
                  <div className="assignments-head">
                    <h3>📁 Completed Installations (24)</h3>
                  </div>
                  {[...ASSIGNMENTS_DATA].reverse().map(a => (
                    <div key={a.id} className="assignment-card" style={{opacity:0.85}}>
                      <div style={{display:'flex', gap:'1rem', alignItems:'flex-start'}}>
                        <div className="history-check">✓</div>
                        <div style={{flex:1}}>
                          <div className="assignment-header">
                            <span className="assignment-title">{a.title}</span>
                            <span className="assignment-priority low">COMPLETED</span>
                          </div>
                          <div className="history-meta">
                            <span>🧑‍🌾 {a.farm}</span>
                            <span>📍 {a.wilaya}</span>
                            <span>✅ Completed Dec 15, 2024</span>
                          </div>
                          <div className="assignment-footer" style={{justifyContent:'flex-start'}}>
                            <button className="assignment-btn">View Report 📋</button>
                            <button className="assignment-btn">Download PDF 📄</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Analytics Tab */}
            {tab === 'analytics' && (
              <>
                <div className="page-header">
                  <h1>Analytics</h1>
                  <p>Track your performance and installation metrics</p>
                </div>

                <div className="kpi-grid">
                  {[
                    { icon:'✅', iconClass:'green', accent:'green', val:'124', label:'Total Installations', sub:'Year to date' },
                    { icon:'⭐', iconClass:'amber', accent:'amber', val:'4.9', label:'Avg Rating', sub:'From 45 farmers' },
                    { icon:'⏱️', iconClass:'blue', accent:'blue', val:'2.4h', label:'Avg Installation Time', sub:'Per site' },
                    { icon:'🎯', iconClass:'amber', accent:'amber', val:'98%', label:'Completion Rate', sub:'On-time delivery' },
                  ].map((k, i) => (
                    <div key={i} className="kpi-card">
                      <div className={`kpi-accent ${k.accent}`}/>
                      <div className="kpi-top">
                        <div className={`kpi-icon-wrap ${k.iconClass}`}>{k.icon}</div>
                      </div>
                      <div className="kpi-value">{k.val}</div>
                      <div className="kpi-label">{k.label}</div>
                      <div className="kpi-sub">{k.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="report-card">
                  <div className="chart-head">
                    <div className="chart-head-left">
                      <h3>Monthly Installations</h3>
                      <p>Number of completed installations per month</p>
                    </div>
                  </div>
                  <div style={{textAlign:'center', padding:'3rem', color:'#9ca3af'}}>
                    📊 Chart would appear here
                    <div className="chart-legend" style={{marginTop:'1rem', display:'flex', gap:'1.25rem', justifyContent:'center'}}>
                      <div className="legend-item"><span className="legend-dot" style={{background:'#f59e0b'}}/> Installations</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Settings Tab */}
            {tab === 'settings' && (
              <>
                <div className="page-header">
                  <h1>Settings</h1>
                  <p>Manage your account and preferences</p>
                </div>

                <div className="settings-layout" style={{display:'grid', gridTemplateColumns:'240px 1fr', gap:'1.5rem'}}>
                  <div className="settings-nav" style={{background:'#fff', border:'1px solid #e5e7eb', borderRadius:'16px', padding:'0.75rem', height:'fit-content'}}>
                    {['Profile', 'Availability', 'Notifications', 'Tools', 'Security'].map(s => (
                      <button key={s} className="settings-nav-item" style={{display:'flex', alignItems:'center', gap:'8px', padding:'0.65rem 0.75rem', borderRadius:'10px', width:'100%', background:'none', border:'none', cursor:'pointer', fontSize:'0.85rem', fontWeight:600, color:'#6b7280', textAlign:'left'}}>
                        {s === 'Profile' ? '👤' : s === 'Availability' ? '⏰' : s === 'Notifications' ? '🔔' : s === 'Tools' ? '🔧' : '🛡'} {s}
                      </button>
                    ))}
                  </div>
                  <div className="settings-panel" style={{background:'#fff', border:'1px solid #e5e7eb', borderRadius:'16px', padding:'1.75rem'}}>
                    <div className="settings-profile-head" style={{display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem'}}>
                      <div className="settings-avatar" style={{width:'72px', height:'72px', borderRadius:'20px', background:'linear-gradient(135deg,#f59e0b,#d97706)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', fontWeight:800, color:'#fff', flexShrink:0}}>{initials}</div>
                      <div className="settings-avatar-info">
                        <h3 style={{fontSize:'1rem', fontWeight:800, color:'#0d1f0f'}}>{firstName} {lastName}</h3>
                        <p style={{fontSize:'0.78rem', color:'#6b7280'}}>Senior Field Technician · Since 2024</p>
                      </div>
                    </div>
                    <div className="settings-form-grid" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
                      {['Full Name', 'Email', 'Phone', 'Specialization', 'Preferred Wilaya', 'Emergency Contact'].map(f => (
                        <div key={f} className="settings-field">
                          <label style={{display:'block', fontSize:'0.78rem', fontWeight:700, color:'#374151', marginBottom:'0.4rem'}}>{f}</label>
                          <input style={{width:'100%', padding:'0.7rem 1rem', border:'1.5px solid #e5e7eb', borderRadius:'10px'}} placeholder={`Enter ${f.toLowerCase()}`}/>
                        </div>
                      ))}
                    </div>
                    <button className="btn-save" style={{padding:'10px 24px', background:'linear-gradient(135deg,#f59e0b,#d97706)', color:'#fff', border:'none', borderRadius:'10px', fontSize:'0.88rem', fontWeight:700, cursor:'pointer', marginTop:'1.25rem'}}>Save Changes</button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  )
}