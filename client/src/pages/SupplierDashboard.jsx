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
  background:#eff6ff;border:1px solid #bfdbfe;
  border-radius:50px;padding:5px 12px 5px 5px;
  cursor:pointer;transition:background 0.2s;
  position:relative;flex-shrink:0;
}
.tb-user-btn:hover{background:#dbeafe}
.tb-user-av{
  width:28px;height:28px;border-radius:50%;
  background:linear-gradient(135deg,#3b82f6,#1d4ed8);
  display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:800;color:#fff;flex-shrink:0;
}
.tb-user-name{font-size:0.82rem;font-weight:700;color:#1d4ed8}
.tb-chevron{font-size:10px;color:#1d4ed8}

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
  background:#eff6ff;border:1px solid #bfdbfe;
  border-radius:50px;padding:5px 12px;
  font-size:0.72rem;font-weight:700;color:#1d4ed8;
  white-space:nowrap;flex-shrink:0;
}
.tb-live-dot{width:7px;height:7px;border-radius:50%;background:#3b82f6;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}

/* ── SIDEBAR INTERNALS ── */
.sb-header{
  padding:1.25rem 1.25rem 0.5rem;
  display:flex;align-items:center;justify-content:space-between;
}
.sb-brand-row{display:flex;align-items:center;gap:10px}
.sb-logo-img{width:36px;height:36px;object-fit:contain;border-radius:8px}
.sb-brand-text .sb-name{font-size:1rem;font-weight:800;color:#fff}
.sb-brand-text .sb-name span{color:#60a5fa}
.sb-brand-text .sb-sub{font-size:0.65rem;color:#60a5fa;font-weight:600;text-transform:uppercase;letter-spacing:0.08em}
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
  background:rgba(59,130,246,0.15);border:1px solid rgba(96,165,250,0.25);
  border-radius:12px;padding:0.75rem 1rem;
  display:flex;align-items:center;gap:10px;
}
.sb-sys-dot{width:8px;height:8px;border-radius:50%;background:#3b82f6;box-shadow:0 0 8px rgba(59,130,246,0.5);flex-shrink:0}
.sb-sys-info .sb-sys-title{font-size:0.82rem;font-weight:700;color:#60a5fa}
.sb-sys-info .sb-sys-sub{font-size:0.68rem;color:#93c5fd;margin-top:1px}

.sb-section-label{
  font-size:0.6rem;font-weight:700;color:#4a6080;
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
.sb-item.active{background:rgba(59,130,246,0.18);border-left:3px solid #3b82f6}
.sb-item-icon{font-size:16px;width:20px;text-align:center;flex-shrink:0}
.sb-item-label{font-size:0.88rem;font-weight:600;color:#9ca3af}
.sb-item.active .sb-item-label{color:#60a5fa}
.sb-item:hover .sb-item-label{color:#d1d5db}
.sb-badge{margin-left:auto;background:#ef4444;color:#fff;font-size:0.62rem;font-weight:800;padding:2px 7px;border-radius:50px}

.sb-foot{
  margin-top:auto;border-top:1px solid rgba(255,255,255,0.08);
  padding:1rem 1.25rem;display:flex;align-items:center;gap:10px;
}
.sb-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#1d4ed8);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;flex-shrink:0}
.sb-user-info .sb-user-name{font-size:0.85rem;font-weight:700;color:#fff}
.sb-user-info .sb-user-role{font-size:0.68rem;color:#60a5fa;font-weight:500}
.sb-logout-btn{margin-left:auto;background:none;border:none;cursor:pointer;font-size:18px;color:#6b7280;transition:color 0.2s;padding:4px}
.sb-logout-btn:hover{color:#ef4444}

/* ── CONTENT ── */
.db-content{flex:1;padding:1.5rem 2rem;overflow-y:auto}

/* ── PAGE HEADER ── */
.page-header{margin-bottom:1.5rem}
.page-header h1{font-size:1.5rem;font-weight:800;color:#0d1f0f}
.page-header p{font-size:0.85rem;color:#6b7280;margin-top:3px}
.page-header-row{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem}
.live-badge{display:flex;align-items:center;gap:6px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:50px;padding:6px 14px;font-size:0.75rem;font-weight:700;color:#1d4ed8;white-space:nowrap;flex-shrink:0}
.live-dot{width:7px;height:7px;border-radius:50%;background:#3b82f6;animation:pulse 2s infinite}

/* ── KPI ── */
.kpi-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-bottom:1.5rem}
.kpi-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.5rem;position:relative;overflow:hidden;transition:box-shadow 0.2s}
.kpi-card:hover{box-shadow:0 4px 20px rgba(0,0,0,0.07)}
.kpi-accent{position:absolute;top:0;left:0;right:0;height:3px;border-radius:16px 16px 0 0}
.kpi-accent.green{background:#3b82f6}
.kpi-accent.blue{background:#3b82f6}
.kpi-accent.amber{background:#f59e0b}
.kpi-accent.red{background:#ef4444}
.kpi-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;margin-top:0.5rem}
.kpi-icon-wrap{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:20px}
.kpi-icon-wrap.blue{background:#eff6ff}
.kpi-icon-wrap.green{background:#f0fdf4}
.kpi-icon-wrap.amber{background:#fffbeb}
.kpi-icon-wrap.red{background:#fef2f2}
.kpi-trend{font-size:0.75rem;font-weight:700}
.kpi-trend.up{color:#16a34a}
.kpi-trend.down{color:#ef4444}
.kpi-value{font-size:2rem;font-weight:800;color:#0d1f0f;line-height:1;margin-bottom:0.25rem}
.kpi-label{font-size:0.82rem;font-weight:600;color:#374151;margin-bottom:2px}
.kpi-sub{font-size:0.72rem;color:#9ca3af}

/* ── ORDERS SECTION ── */
.orders-section{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.5rem;margin-bottom:1.25rem}
.orders-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem}
.orders-head h3{font-size:1rem;font-weight:700;color:#0d1f0f}
.orders-head a{font-size:0.82rem;color:#3b82f6;font-weight:700;text-decoration:none;cursor:pointer}

.order-card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:1.25rem;margin-bottom:1rem;transition:all 0.2s}
.order-card:hover{box-shadow:0 4px 12px rgba(0,0,0,0.05);border-color:#bfdbfe}
.order-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:0.75rem}
.order-id{font-size:0.78rem;color:#9ca3af;font-weight:600}
.order-status{font-size:0.72rem;font-weight:700;padding:3px 10px;border-radius:50px}
.order-status.new{background:#eff6ff;color:#1d4ed8}
.order-status.packed{background:#fffbeb;color:#92400e}
.order-status.shipped{background:#dcfce7;color:#16a34a}
.order-farmer{font-size:0.95rem;font-weight:700;color:#0d1f0f;margin-bottom:4px}
.order-loc{font-size:0.75rem;color:#9ca3af;margin-bottom:0.75rem;display:flex;align-items:center;gap:4px}
.order-items{font-size:0.82rem;color:#6b7280;margin-bottom:0.75rem;padding-bottom:0.75rem;border-bottom:1px solid #f3f4f6}
.order-footer{display:flex;align-items:center;justify-content:space-between}
.order-total{font-size:1.1rem;font-weight:800;color:#1d4ed8}
.order-btn{padding:6px 14px;border-radius:50px;border:1.5px solid #e5e7eb;background:#fff;font-size:0.75rem;font-weight:600;cursor:pointer;color:#374151;transition:all 0.15s}
.order-btn:hover{border-color:#3b82f6;color:#1d4ed8;background:#eff6ff}

/* ── PRODUCTS TABLE ── */
.products-section{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.5rem;margin-bottom:1.25rem}
.products-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem}
.products-head h3{font-size:1rem;font-weight:700;color:#0d1f0f}
.btn-primary{background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:#fff;border:none;padding:8px 18px;border-radius:50px;font-size:0.82rem;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif}

.data-table{width:100%;border-collapse:collapse}
.data-table th{font-size:0.7rem;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;padding:0.75rem 1rem;text-align:left;border-bottom:1px solid #f3f4f6;background:#fafafa}
.data-table td{padding:1rem;font-size:0.88rem;color:#374151;border-bottom:1px solid #f3f4f6}
.data-table tr:last-child td{border-bottom:none}
.data-table tr:hover td{background:#fafafa}

.prod-cell{display:flex;align-items:center;gap:12px}
.prod-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px}
.prod-icon.green{background:#f0fdf4}
.prod-icon.blue{background:#eff6ff}
.prod-icon.purple{background:#faf5ff}
.prod-icon.amber{background:#fffbeb}
.prod-info .prod-name{font-size:0.9rem;font-weight:700;color:#0d1f0f}
.prod-info .prod-cat{font-size:0.72rem;color:#9ca3af}
.status-pill{display:inline-block;padding:3px 10px;border-radius:50px;font-size:0.72rem;font-weight:700}
.status-pill.active{background:#dcfce7;color:#16a34a}
.status-pill.draft{background:#f3f4f6;color:#6b7280}
.action-btns{display:flex;gap:6px}
.action-btn{padding:4px 10px;border-radius:8px;border:1px solid #e5e7eb;background:#fff;font-size:0.72rem;font-weight:600;cursor:pointer;color:#6b7280}
.action-btn:hover{border-color:#3b82f6;color:#1d4ed8}

/* ── SUPPLIER SPECIFIC ── */
.rating-stars{display:flex;align-items:center;gap:2px}
.star{font-size:12px;color:#fbbf24}
.supplier-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem;margin-bottom:1rem}
.supplier-stat{background:#f9fafb;border-radius:10px;padding:0.75rem;text-align:center}
.supplier-stat-val{font-size:1.1rem;font-weight:800;color:#0d1f0f}
.supplier-stat-label{font-size:0.68rem;color:#9ca3af;margin-top:2px}

/* Chart card for analytics */
.chart-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.5rem;margin-bottom:1.25rem}
.chart-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1.25rem}
.chart-head-left h3{font-size:1rem;font-weight:700;color:#0d1f0f}
.chart-head-left p{font-size:0.75rem;color:#9ca3af;margin-top:2px}
.chart-legend{display:flex;gap:1.25rem;justify-content:center;margin-top:0.75rem;flex-wrap:wrap}
.legend-item{display:flex;align-items:center;gap:5px;font-size:0.75rem;color:#6b7280;font-weight:500}
.legend-dot{width:8px;height:8px;border-radius:50%}

/* Settings layout */
.settings-layout{display:grid;grid-template-columns:240px 1fr;gap:1.5rem}
.settings-nav{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:0.75rem;height:fit-content}
.settings-nav-item{display:flex;align-items:center;gap:8px;padding:0.65rem 0.75rem;border-radius:10px;cursor:pointer;font-size:0.85rem;font-weight:600;color:#6b7280;transition:all 0.15s;border:none;background:none;width:100%;text-align:left}
.settings-nav-item:hover{background:#f9fafb;color:#0d1f0f}
.settings-nav-item.active{background:#eff6ff;color:#1d4ed8}
.settings-panel{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.75rem}
.settings-profile-head{display:flex;align-items:center;gap:1rem;margin-bottom:2rem}
.settings-avatar{width:72px;height:72px;border-radius:20px;background:linear-gradient(135deg,#3b82f6,#1d4ed8);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:#fff;flex-shrink:0}
.settings-avatar-info h3{font-size:1rem;font-weight:800;color:#0d1f0f}
.settings-avatar-info p{font-size:0.78rem;color:#6b7280}
.settings-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.settings-field label{display:block;font-size:0.78rem;font-weight:700;color:#374151;margin-bottom:0.4rem}
.settings-field input{width:100%;padding:0.7rem 1rem;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.88rem;font-family:'Manrope',sans-serif;color:#0d1f0f;background:#fafafa;outline:none}
.settings-field input:focus{border-color:#3b82f6;background:#fff}
.btn-save{padding:10px 24px;border:none;border-radius:10px;background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:#fff;font-size:0.88rem;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif;margin-top:1.25rem;box-shadow:0 4px 14px rgba(59,130,246,0.3)}

/* ══ RESPONSIVE ══ */
@media (max-width: 900px) {
  .kpi-grid { grid-template-columns: repeat(2,1fr); }
  .supplier-stats { grid-template-columns: repeat(3,1fr); }
  .settings-layout { grid-template-columns: 1fr; }
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
  .data-table th, .data-table td { padding: 0.75rem; font-size: 0.78rem; }
  .supplier-stats { grid-template-columns: 1fr; }
  .settings-form-grid { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .kpi-value { font-size: 1.6rem; }
  .order-card { padding: 1rem; }
  .action-btns { flex-direction: column; gap: 4px; }
}
`

// ─── DATA ────────────────────────────────────────────────────────────────────

const PRODUCTS_DATA = [
  { id:1, emoji:'🌿', name:'AgroSense Pro', cat:'Sensor', price:'12,900', stock:48, status:'active', sales:124, rating:4.8 },
  { id:2, emoji:'💧', name:'IrriBot Controller', cat:'Irrigation', price:'8,500', stock:23, status:'active', sales:89, rating:4.6 },
  { id:3, emoji:'📡', name:'SolarHub Gateway', cat:'Network', price:'6,200', stock:5, status:'active', sales:67, rating:4.9 },
  { id:4, emoji:'📷', name:'CropCam AI', cat:'Camera', price:'19,900', stock:0, status:'draft', sales:12, rating:4.5 },
  { id:5, emoji:'🌦️', name:'WeatherNode', cat:'Monitoring', price:'9,400', stock:31, status:'active', sales:45, rating:4.7 },
]

const ORDERS_DATA = [
  { id:'ORD-2401', farmer:'Ahmed Benali', loc:'Bouira', items:'2× AgroSense Pro, 1× SolarHub Gateway', total:'32,000', status:'new', date:'Today, 10:24 AM' },
  { id:'ORD-2400', farmer:'Fatima Zohra', loc:'Blida', items:'1× IrriBot Controller, 2× WeatherNode', total:'27,300', status:'packed', date:'Yesterday, 03:45 PM' },
  { id:'ORD-2399', farmer:'Mohamed Khaled', loc:'Tizi Ouzou', items:'3× AgroSense Pro', total:'38,700', status:'shipped', date:'2 days ago' },
  { id:'ORD-2398', farmer:'Nadia Lounis', loc:'Sétif', items:'1× CropCam AI, 2× WeatherNode', total:'38,700', status:'new', date:'3 days ago' },
]

export default function SupplierDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userDropOpen, setUserDropOpen] = useState(false)
  const [now, setNow] = useState(new Date())
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
  setTab('overview')
  setUserDropOpen(false)
  if(window.innerWidth <= 768) setSidebarOpen(false)
}

  const firstName = user?.firstName || 'Supplier'
  const lastName = user?.lastName || ''
  const initials = `${firstName[0]}${lastName[0] || ''}`
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const timeStr = now.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' })

  const navSections = [
    { label: 'Supplier Menu', items: [
      { key: 'overview', icon: '🏠', label: 'Overview' },
      { key: 'products', icon: '📦', label: 'My Products' },
      { key: 'orders', icon: '🛒', label: 'Orders' },
    ]},
    { label: 'Manage', items: [
      { key: 'analytics', icon: '📊', label: 'Analytics' },
      { key: 'settings', icon: '⚙', label: 'Settings' },
    ]},
  ]

  const currentPageLabel = navSections.flatMap(s => s.items).find(i => i.key === tab)?.label || 'Dashboard'

  const totalRevenue = 487200
  const totalProducts = PRODUCTS_DATA.length
  const pendingOrders = ORDERS_DATA.filter(o => o.status === 'new').length
  const avgRating = (PRODUCTS_DATA.reduce((sum, p) => sum + p.rating, 0) / PRODUCTS_DATA.length).toFixed(1)

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
                <div className="sb-sub">Supplier Portal</div>
              </div>
            </div>
            <button className="sb-close-btn" onClick={() => setSidebarOpen(false)}>✕</button>
          </div>

          <div className="sb-system">
            <div className="sb-sys-dot"/>
            <div className="sb-sys-info">
              <div className="sb-sys-title">Active Store</div>
              <div className="sb-sys-sub">Products live · Orders sync</div>
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
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="sb-foot">
            <div className="sb-avatar">{initials}</div>
            <div className="sb-user-info">
              <div className="sb-user-name">{firstName} {lastName}</div>
              <div className="sb-user-role">Supplier</div>
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
              <input placeholder="Search products, orders..."/>
            </div>

            <div className="tb-actions">
              <span className="tb-time">{timeStr}</span>
              <button className="tb-icon-btn" title="Refresh">↻</button>
              <button className="tb-icon-btn" title="Notifications" onClick={handleNotifications}>
  🔔<span className="tb-notif-dot"/>
</button>
              {tab === 'overview' && (
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
                      <div className="ud-role">Supplier · {user?.wilaya || 'Algiers'}</div>
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

            {/* Overview Tab */}
            {tab === 'overview' && (
              <>
                <div className="page-header-row">
                  <div className="page-header">
                    <h1>{greeting}, {firstName} 🏭</h1>
                    <p>Manage your products, track orders, and grow your B2B sales.</p>
                  </div>
                  <div className="live-badge"><span className="live-dot"/>Live · updated now</div>
                </div>

                <div className="kpi-grid">
                  {[
                    { icon:'💰', iconClass:'blue', accent:'green', val:`${totalRevenue.toLocaleString()}`, label:'Revenue (DZD)', sub:'This month', trend:'↗ 12%', dir:'up' },
                    { icon:'📦', iconClass:'purple', accent:'blue', val:totalProducts, label:'Listed Products', sub:'Active listings', trend:'Active', dir:'up' },
                    { icon:'🛒', iconClass:'amber', accent:'amber', val:pendingOrders, label:'Pending Orders', sub:'To be processed', trend:'↗ 2', dir:'up' },
                    { icon:'⭐', iconClass:'green', accent:'blue', val:avgRating, label:'Avg Rating', sub:'From 45 reviews', trend:'Top seller', dir:'up' },
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

                <div className="supplier-stats">
                  <div className="supplier-stat"><div className="supplier-stat-val">🏆 98%</div><div className="supplier-stat-label">Order fulfillment</div></div>
                  <div className="supplier-stat"><div className="supplier-stat-val">⏱️ 2.4 days</div><div className="supplier-stat-label">Avg delivery</div></div>
                  <div className="supplier-stat"><div className="supplier-stat-val">🔄 78%</div><div className="supplier-stat-label">Return customers</div></div>
                </div>

                <div className="orders-section">
                  <div className="orders-head">
                    <h3>🛒 Recent Orders</h3>
                    <a onClick={() => setTab('orders')}>View all →</a>
                  </div>
                  {ORDERS_DATA.slice(0, 3).map(o => (
                    <div key={o.id} className="order-card">
                      <div className="order-header">
                        <span className="order-id">{o.id} · {o.date}</span>
                        <span className={`order-status ${o.status}`}>{o.status.toUpperCase()}</span>
                      </div>
                      <div className="order-farmer">{o.farmer}</div>
                      <div className="order-loc">📍 {o.loc}</div>
                      <div className="order-items">{o.items}</div>
                      <div className="order-footer">
                        <span className="order-total">{o.total} DZD</span>
                        <button className="order-btn">View →</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="products-section">
                  <div className="products-head">
                    <h3>📦 Top Products</h3>
                    <a onClick={() => setTab('products')}>Manage all →</a>
                  </div>
                  <div style={{overflowX:'auto'}}>
                    <table className="data-table">
                      <thead>
                        <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Sales</th><th>Rating</th></tr>
                      </thead>
                      <tbody>
                        {PRODUCTS_DATA.slice(0, 3).map(p => (
                          <tr key={p.id}>
                            <td>
                              <div className="prod-cell">
                                <div className={`prod-icon ${p.cat === 'Sensor' ? 'green' : p.cat === 'Irrigation' ? 'blue' : 'purple'}`}>{p.emoji}</div>
                                <div className="prod-info"><div className="prod-name">{p.name}</div></div>
                              </div>
                            </td>
                            <td>{p.cat}</td>
                            <td style={{fontWeight:700}}>{p.price}</td>
                            <td style={{color: p.stock === 0 ? '#dc2626' : p.stock < 10 ? '#f59e0b' : '#16a34a', fontWeight:700}}>{p.stock}</td>
                            <td>{p.sales}</td>
                            <td><div className="rating-stars">{Array(5).fill().map((_, i) => <span key={i} className="star">{i < Math.floor(p.rating) ? '★' : '☆'}</span>)} {p.rating}</div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Products Tab */}
            {tab === 'products' && (
              <>
                <div className="page-header">
                  <h1>My Products</h1>
                  <p>Manage your product catalog and inventory</p>
                </div>

                <div className="products-section">
                  <div className="products-head">
                    <h3>📦 All Products ({PRODUCTS_DATA.length})</h3>
                    <button className="btn-primary">+ List New Product</button>
                  </div>
                  <div style={{overflowX:'auto'}}>
                    <table className="data-table">
                      <thead>
                        <tr><th>Product</th><th>Category</th><th>Price (DZD)</th><th>Stock</th><th>Sales</th><th>Rating</th><th>Status</th><th>Actions</th></tr>
                      </thead>
                      <tbody>
                        {PRODUCTS_DATA.map(p => (
                          <tr key={p.id}>
                            <td>
                              <div className="prod-cell">
                                <div className={`prod-icon ${p.cat === 'Sensor' ? 'green' : p.cat === 'Irrigation' ? 'blue' : p.cat === 'Camera' ? 'amber' : 'purple'}`}>{p.emoji}</div>
                                <div className="prod-info"><div className="prod-name">{p.name}</div><div className="prod-cat">{p.cat}</div></div>
                              </div>
                            </td>
                            <td>{p.cat}</td>
                            <td style={{fontWeight:700}}>{p.price}</td>
                            <td style={{color: p.stock === 0 ? '#dc2626' : p.stock < 10 ? '#f59e0b' : '#16a34a', fontWeight:700}}>{p.stock}</td>
                            <td>{p.sales}</td>
                            <td><div className="rating-stars">{Array(5).fill().map((_, i) => <span key={i} className="star">{i < Math.floor(p.rating) ? '★' : '☆'}</span>)}</div></td>
                            <td><span className={`status-pill ${p.status}`}>{p.status}</span></td>
                            <td><div className="action-btns"><button className="action-btn">Edit</button><button className="action-btn">View</button></div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Orders Tab */}
            {tab === 'orders' && (
              <>
                <div className="page-header">
                  <h1>Orders</h1>
                  <p>Track and manage incoming orders</p>
                </div>

                <div className="orders-section">
                  <div className="orders-head">
                    <h3>🛒 All Orders ({ORDERS_DATA.length})</h3>
                  </div>
                  {ORDERS_DATA.map(o => (
                    <div key={o.id} className="order-card">
                      <div className="order-header">
                        <span className="order-id">{o.id} · {o.date}</span>
                        <span className={`order-status ${o.status}`}>{o.status.toUpperCase()}</span>
                      </div>
                      <div className="order-farmer">{o.farmer}</div>
                      <div className="order-loc">📍 {o.loc}</div>
                      <div className="order-items">{o.items}</div>
                      <div className="order-footer">
                        <span className="order-total">{o.total} DZD</span>
                        <div className="action-btns">
                          <button className="action-btn">Process →</button>
                          <button className="action-btn">Track</button>
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
                  <p>Track your sales performance and business growth</p>
                </div>

                <div className="kpi-grid">
                  {[
                    { icon:'💰', iconClass:'blue', accent:'blue', val:'487,200', label:'Total Revenue', sub:'Last 30 days' },
                    { icon:'📈', iconClass:'green', accent:'green', val:'+18%', label:'Growth Rate', sub:'vs last month' },
                    { icon:'👥', iconClass:'amber', accent:'amber', val:'124', label:'Orders Completed', sub:'This quarter' },
                    { icon:'⭐', iconClass:'purple', accent:'blue', val:'4.7', label:'Avg Product Rating', sub:'From 45 reviews' },
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

                <div className="chart-card">
                  <div className="chart-head">
                    <div className="chart-head-left">
                      <h3>Sales Overview</h3>
                      <p>Monthly revenue trend (DZD)</p>
                    </div>
                  </div>
                  <div style={{textAlign:'center', padding:'3rem', color:'#9ca3af'}}>
                    📊 Sales chart would appear here
                    <div className="chart-legend" style={{marginTop:'1rem'}}>
                      <div className="legend-item"><span className="legend-dot" style={{background:'#3b82f6'}}/> Revenue</div>
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
                  <p>Manage your account, store, and preferences</p>
                </div>
                <div className="settings-layout">
                  <div className="settings-nav">
                    {['Profile', 'Store Settings', 'Payments', 'Notifications', 'Security'].map(s => (
                      <button key={s} className="settings-nav-item">
                        {s === 'Profile' ? '👤' : s === 'Store Settings' ? '🏪' : s === 'Payments' ? '💳' : s === 'Notifications' ? '🔔' : '🛡'} {s}
                      </button>
                    ))}
                  </div>
                  <div className="settings-panel">
                    <div className="settings-profile-head">
                      <div className="settings-avatar">{initials}</div>
                      <div className="settings-avatar-info">
                        <h3>{firstName} {lastName}</h3>
                        <p>Supplier since 2024</p>
                      </div>
                    </div>
                    <div className="settings-form-grid">
                      {['Business Name', 'Tax ID', 'Email', 'Phone', 'Address', 'Bank Account'].map(f => (
                        <div key={f} className="settings-field">
                          <label>{f}</label>
                          <input placeholder={`Enter ${f.toLowerCase()}`}/>
                        </div>
                      ))}
                    </div>
                    <button className="btn-save">Save Changes</button>
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