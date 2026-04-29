import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .sp-dash { display: flex; min-height: 100vh; background: #f8fafc; font-family: 'Manrope', sans-serif; }

  .sp-sidebar {
    width: 240px; background: #0d1117; padding: 1.5rem 1rem;
    display: flex; flex-direction: column; gap: 0.25rem;
    position: fixed; top: 0; left: 0; bottom: 0; z-index: 50;
  }
  .sp-sidebar-logo { display: flex; align-items: center; gap: 8px; padding: 0.5rem 0.75rem; margin-bottom: 1.5rem; }
  .sp-logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg,#3b82f6,#1d4ed8); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .sp-logo-text { font-size: 1rem; font-weight: 800; color: #fff; }
  .sp-logo-text span { color: #60a5fa; }
  .sp-logo-sub { font-size: 0.65rem; color: #60a5fa; font-weight: 600; margin-top: 1px; }

  .sp-section { font-size: 0.62rem; font-weight: 700; color: #4a6080; text-transform: uppercase; letter-spacing: 0.12em; padding: 0.75rem 0.75rem 0.25rem; }
  .sp-nav { display: flex; flex-direction: column; gap: 2px; padding: 0 0.5rem; }
  .sp-item { display: flex; align-items: center; gap: 10px; padding: 0.65rem 0.75rem; border-radius: 10px; cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-size: 0.88rem; font-weight: 600; color: #9ca3af; transition: all 0.15s; font-family: 'Manrope', sans-serif; }
  .sp-item:hover { background: rgba(255,255,255,0.06); color: #d1d5db; }
  .sp-item.active { background: rgba(59,130,246,0.18); color: #60a5fa; }
  .sp-item-icon { font-size: 16px; width: 20px; text-align: center; flex-shrink: 0; }

  .sp-foot { margin-top: auto; border-top: 1px solid rgba(255,255,255,0.07); padding: 1rem 0.75rem; display: flex; align-items: center; gap: 10px; }
  .sp-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg,#3b82f6,#1d4ed8); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: #fff; flex-shrink: 0; }
  .sp-user-name { font-size: 0.82rem; font-weight: 700; color: #fff; }
  .sp-user-role { font-size: 0.68rem; color: #60a5fa; font-weight: 600; }

  .sp-main { margin-left: 240px; flex: 1; min-height: 100vh; }

  .sp-topbar { height: 64px; background: #fff; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; position: sticky; top: 0; z-index: 40; }
  .sp-topbar-left h2 { font-size: 1.1rem; font-weight: 800; color: #0d1f0f; }
  .sp-topbar-left p { font-size: 0.75rem; color: #9ca3af; }
  .sp-topbar-right { display: flex; align-items: center; gap: 0.75rem; }
  .sp-user-pill { display: flex; align-items: center; gap: 8px; padding: 4px 12px 4px 4px; border-radius: 50px; border: 1px solid #e5e7eb; cursor: pointer; }
  .sp-user-pill-av { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg,#3b82f6,#1d4ed8); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: #fff; }
  .sp-user-pill-name { font-size: 0.82rem; font-weight: 700; color: #0d1f0f; }

  .sp-content { padding: 2rem; }

  .sp-page-title { font-size: 1.5rem; font-weight: 800; color: #0d1f0f; margin-bottom: 0.25rem; }
  .sp-page-sub { font-size: 0.85rem; color: #6b7280; margin-bottom: 1.75rem; }

  .sp-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
  .sp-kpi { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 1.25rem; }
  .sp-kpi-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
  .sp-kpi-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 19px; }
  .sp-kpi-icon.blue { background: #eff6ff; }
  .sp-kpi-icon.green { background: #f0fdf4; }
  .sp-kpi-icon.amber { background: #fffbeb; }
  .sp-kpi-icon.purple { background: #faf5ff; }
  .sp-kpi-badge { font-size: 0.7rem; font-weight: 700; padding: 3px 8px; border-radius: 50px; }
  .sp-kpi-badge.up { background: #dcfce7; color: #16a34a; }
  .sp-kpi-badge.warn { background: #fffbeb; color: #92400e; }
  .sp-kpi-val { font-size: 1.8rem; font-weight: 800; color: #0d1f0f; line-height: 1; }
  .sp-kpi-label { font-size: 0.78rem; color: #6b7280; margin-top: 4px; font-weight: 500; }

  .sp-section-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .sp-section-row h2 { font-size: 1rem; font-weight: 700; color: #0d1f0f; }
  .sp-btn-blue { padding: 7px 16px; border-radius: 50px; border: none; background: linear-gradient(135deg,#3b82f6,#1d4ed8); color: #fff; font-size: 0.78rem; font-weight: 700; cursor: pointer; font-family: 'Manrope', sans-serif; }

  /* Orders grid */
  .sp-orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
  .sp-order-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 1.25rem; }
  .sp-order-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
  .sp-order-id { font-size: 0.72rem; color: #9ca3af; font-weight: 600; }
  .sp-order-status { font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 50px; }
  .sp-order-status.new    { background: #eff6ff; color: #1d4ed8; }
  .sp-order-status.packed { background: #fffbeb; color: #92400e; }
  .sp-order-status.shipped{ background: #dcfce7; color: #16a34a; }
  .sp-order-farmer { font-size: 0.9rem; font-weight: 700; color: #0d1f0f; margin-bottom: 2px; }
  .sp-order-loc { font-size: 0.75rem; color: #9ca3af; margin-bottom: 0.75rem; }
  .sp-order-items { font-size: 0.82rem; color: #374151; margin-bottom: 0.75rem; line-height: 1.5; }
  .sp-order-foot { display: flex; justify-content: space-between; align-items: center; }
  .sp-order-total { font-size: 1rem; font-weight: 800; color: #1d4ed8; }
  .sp-order-btn { padding: 5px 12px; border-radius: 50px; border: none; background: #eff6ff; color: #1d4ed8; font-size: 0.75rem; font-weight: 700; cursor: pointer; }

  /* Products table */
  .sp-table-wrap { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; margin-bottom: 2rem; }
  .sp-table { width: 100%; border-collapse: collapse; }
  .sp-table th { background: #f9fafb; padding: 0.75rem 1rem; text-align: left; font-size: 0.72rem; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #e5e7eb; }
  .sp-table td { padding: 0.9rem 1rem; font-size: 0.88rem; color: #374151; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
  .sp-table tr:last-child td { border-bottom: none; }
  .sp-table tr:hover td { background: #fafafa; }
  .sp-prod-cell { display: flex; align-items: center; gap: 10px; }
  .sp-prod-icon { width: 32px; height: 32px; border-radius: 8px; background: #f0fdf4; display: flex; align-items: center; justify-content: center; font-size: 15px; }
  .sp-prod-name { font-weight: 700; color: #0d1f0f; }
  .sp-prod-cat { font-size: 0.72rem; color: #9ca3af; }
  .sp-pill { display: inline-block; padding: 3px 10px; border-radius: 50px; font-size: 0.72rem; font-weight: 700; }
  .sp-pill.active { background: #dcfce7; color: #16a34a; }
  .sp-pill.draft  { background: #f3f4f6; color: #6b7280; }
  .sp-action-btn { padding: 4px 10px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; font-size: 0.75rem; cursor: pointer; color: #374151; margin-right: 4px; font-family: 'Manrope', sans-serif; }
  .sp-action-btn:hover { border-color: #3b82f6; color: #3b82f6; }
`

const PRODUCTS = [
  { emoji:'🌿', name:'AgroSense Pro', cat:'Sensor', price:'12,900', stock:48, status:'active', sales:124 },
  { emoji:'💧', name:'IrriBot Controller', cat:'Irrigation', price:'8,500', stock:23, status:'active', sales:89 },
  { emoji:'📡', name:'SolarHub Gateway', cat:'Network', price:'6,200', stock:5, status:'active', sales:67 },
  { emoji:'📷', name:'CropCam AI', cat:'Camera', price:'19,900', stock:0, status:'draft', sales:12 },
  { emoji:'🌦️', name:'WeatherNode', cat:'Monitoring', price:'9,400', stock:31, status:'active', sales:45 },
]

const ORDERS = [
  { id:'ORD-2401', farmer:'Ahmed Benali', loc:'Sétif', items:'2× AgroSense Pro, 1× Gateway', total:'32,000 DZD', status:'new', date:'Today' },
  { id:'ORD-2400', farmer:'Fatima Ouali', loc:'Blida', items:'1× IrriBot Controller', total:'8,500 DZD', status:'packed', date:'Yesterday' },
  { id:'ORD-2399', farmer:'Karim Meziane', loc:'Oran', items:'3× AgroSense Pro, 2× WeatherNode', total:'57,500 DZD', status:'shipped', date:'2 days ago' },
]

export default function SupplierDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('overview')

  const firstName = user?.firstName || 'Karima'
  const lastName  = user?.lastName  || 'Ouali'
  const initials  = `${firstName[0]}${lastName[0]}`
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-GB', { weekday:'short', month:'short', day:'numeric' }) + ' · ' + now.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' })

  const navItems = [
    { key:'overview', icon:'🏠', label:'Overview' },
    { key:'products', icon:'📦', label:'My Products' },
    { key:'orders',   icon:'🛒', label:'Orders' },
  ]

  const kpis = [
    { icon:'💰', cls:'blue',   val:'487,200', label:'Revenue (DZD)',   badge:'+12%',      badgeCls:'up'   },
    { icon:'📦', cls:'purple', val:'5',       label:'Listed Products', badge:'Active',    badgeCls:'up'   },
    { icon:'🛒', cls:'green',  val:'3',       label:'Pending Orders',  badge:'Review',    badgeCls:'warn' },
    { icon:'⭐', cls:'amber',  val:'4.8',     label:'Avg Rating',      badge:'Top seller',badgeCls:'up'   },
  ]

  return (
    <>
      <style>{styles}</style>
      <div className="sp-dash">

        <aside className="sp-sidebar">
          <div className="sp-sidebar-logo">
            <div className="sp-logo-icon">🏭</div>
            <div>
              <div className="sp-logo-text">Agri<span>Sense</span></div>
              <div className="sp-logo-sub">Supplier Portal</div>
            </div>
          </div>

          <div className="sp-section">Supplier Menu</div>
          <div className="sp-nav">
            {navItems.map(n => (
              <button key={n.key} className={`sp-item ${tab === n.key ? 'active' : ''}`} onClick={() => setTab(n.key)}>
                <span className="sp-item-icon">{n.icon}</span>{n.label}
              </button>
            ))}
          </div>

          <div className="sp-section" style={{marginTop:'1rem'}}>Navigation</div>
          <div className="sp-nav">
            <Link to="/" className="sp-item" style={{textDecoration:'none'}}>
              <span className="sp-item-icon">🌐</span>Website
            </Link>
          </div>

          <div className="sp-foot">
            <div className="sp-avatar">{initials}</div>
            <div>
              <div className="sp-user-name">{firstName} {lastName}</div>
              <div className="sp-user-role">Supplier</div>
            </div>
          </div>
        </aside>

        <div className="sp-main">
          <div className="sp-topbar">
            <div className="sp-topbar-left">
              <h2>{navItems.find(n => n.key === tab)?.label || 'Dashboard'}</h2>
              <p>{dateStr}</p>
            </div>
            <div className="sp-topbar-right">
              <div className="sp-user-pill">
                <div className="sp-user-pill-av">{initials}</div>
                <span className="sp-user-pill-name">{firstName}</span>
                <span style={{fontSize:'12px',color:'#9ca3af'}}>▾</span>
              </div>
            </div>
          </div>

          <div className="sp-content">
            <h1 className="sp-page-title">Welcome back, {firstName} 🏭</h1>
            <p className="sp-page-sub">Manage your products, track orders, and grow your B2B sales.</p>

            <div className="sp-kpi-grid">
              {kpis.map((k,i) => (
                <div key={i} className="sp-kpi">
                  <div className="sp-kpi-top">
                    <div className={`sp-kpi-icon ${k.cls}`}>{k.icon}</div>
                    <span className={`sp-kpi-badge ${k.badgeCls}`}>{k.badge}</span>
                  </div>
                  <div className="sp-kpi-val">{k.val}</div>
                  <div className="sp-kpi-label">{k.label}</div>
                </div>
              ))}
            </div>

            {tab === 'overview' && (
              <>
                <div className="sp-section-row"><h2>📦 Recent Orders</h2></div>
                <div className="sp-orders-grid">
                  {ORDERS.map((o,i) => (
                    <div key={i} className="sp-order-card">
                      <div className="sp-order-top">
                        <span className="sp-order-id">{o.id} · {o.date}</span>
                        <span className={`sp-order-status ${o.status}`}>{o.status.toUpperCase()}</span>
                      </div>
                      <div className="sp-order-farmer">{o.farmer}</div>
                      <div className="sp-order-loc">📍 {o.loc}</div>
                      <div className="sp-order-items">{o.items}</div>
                      <div className="sp-order-foot">
                        <span className="sp-order-total">{o.total}</span>
                        <button className="sp-order-btn">View →</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {tab === 'products' && (
              <>
                <div className="sp-section-row">
                  <h2>📦 My Products</h2>
                  <button className="sp-btn-blue">+ List New Product</button>
                </div>
                <div className="sp-table-wrap">
                  <table className="sp-table">
                    <thead>
                      <tr><th>Product</th><th>Category</th><th>Price (DZD)</th><th>Stock</th><th>Sales</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {PRODUCTS.map((p,i) => (
                        <tr key={i}>
                          <td>
                            <div className="sp-prod-cell">
                              <div className="sp-prod-icon">{p.emoji}</div>
                              <div><div className="sp-prod-name">{p.name}</div><div className="sp-prod-cat">{p.cat}</div></div>
                            </div>
                          </td>
                          <td>{p.cat}</td>
                          <td style={{fontWeight:700}}>{p.price}</td>
                          <td style={{color: p.stock===0?'#dc2626':p.stock<10?'#f59e0b':'#16a34a', fontWeight:700}}>{p.stock}</td>
                          <td>{p.sales}</td>
                          <td><span className={`sp-pill ${p.status}`}>{p.status}</span></td>
                          <td>
                            <button className="sp-action-btn">Edit</button>
                            <button className="sp-action-btn">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {tab === 'orders' && (
              <>
                <div className="sp-section-row"><h2>🛒 All Orders</h2></div>
                <div className="sp-orders-grid">
                  {[...ORDERS, ...ORDERS].map((o,i) => (
                    <div key={i} className="sp-order-card">
                      <div className="sp-order-top">
                        <span className="sp-order-id">{o.id} · {o.date}</span>
                        <span className={`sp-order-status ${o.status}`}>{o.status.toUpperCase()}</span>
                      </div>
                      <div className="sp-order-farmer">{o.farmer}</div>
                      <div className="sp-order-loc">📍 {o.loc}</div>
                      <div className="sp-order-items">{o.items}</div>
                      <div className="sp-order-foot">
                        <span className="sp-order-total">{o.total}</span>
                        <button className="sp-order-btn">Manage →</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}