import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .tc-dash { display: flex; min-height: 100vh; background: #f8fafc; font-family: 'Manrope', sans-serif; }

  .tc-sidebar {
    width: 240px; background: #0d1117; padding: 1.5rem 1rem;
    display: flex; flex-direction: column; gap: 0.25rem;
    position: fixed; top: 0; left: 0; bottom: 0; z-index: 50;
  }
  .tc-sidebar-logo { display: flex; align-items: center; gap: 8px; padding: 0.5rem 0.75rem; margin-bottom: 1.5rem; }
  .tc-logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg,#f59e0b,#d97706); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .tc-logo-text { font-size: 1rem; font-weight: 800; color: #fff; }
  .tc-logo-text span { color: #fbbf24; }
  .tc-logo-sub { font-size: 0.65rem; color: #fbbf24; font-weight: 600; margin-top: 1px; }

  .tc-section { font-size: 0.62rem; font-weight: 700; color: #60501a; text-transform: uppercase; letter-spacing: 0.12em; padding: 0.75rem 0.75rem 0.25rem; }
  .tc-nav { display: flex; flex-direction: column; gap: 2px; padding: 0 0.5rem; }
  .tc-item { display: flex; align-items: center; gap: 10px; padding: 0.65rem 0.75rem; border-radius: 10px; cursor: pointer; border: none; background: none; width: 100%; text-align: left; font-size: 0.88rem; font-weight: 600; color: #9ca3af; transition: all 0.15s; font-family: 'Manrope', sans-serif; }
  .tc-item:hover { background: rgba(255,255,255,0.06); color: #d1d5db; }
  .tc-item.active { background: rgba(245,158,11,0.18); color: #fbbf24; }
  .tc-item-icon { font-size: 16px; width: 20px; text-align: center; flex-shrink: 0; }

  .tc-foot { margin-top: auto; border-top: 1px solid rgba(255,255,255,0.07); padding: 1rem 0.75rem; display: flex; align-items: center; gap: 10px; }
  .tc-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg,#f59e0b,#d97706); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: #fff; flex-shrink: 0; }
  .tc-user-name { font-size: 0.82rem; font-weight: 700; color: #fff; }
  .tc-user-role { font-size: 0.68rem; color: #fbbf24; font-weight: 600; }

  .tc-main { margin-left: 240px; flex: 1; min-height: 100vh; }

  .tc-topbar { height: 64px; background: #fff; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; position: sticky; top: 0; z-index: 40; }
  .tc-topbar-left h2 { font-size: 1.1rem; font-weight: 800; color: #0d1f0f; }
  .tc-topbar-left p { font-size: 0.75rem; color: #9ca3af; }
  .tc-user-pill { display: flex; align-items: center; gap: 8px; padding: 4px 12px 4px 4px; border-radius: 50px; border: 1px solid #e5e7eb; }
  .tc-user-pill-av { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg,#f59e0b,#d97706); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: #fff; }
  .tc-user-pill-name { font-size: 0.82rem; font-weight: 700; color: #0d1f0f; }

  .tc-content { padding: 2rem; }
  .tc-page-title { font-size: 1.5rem; font-weight: 800; color: #0d1f0f; margin-bottom: 0.25rem; }
  .tc-page-sub { font-size: 0.85rem; color: #6b7280; margin-bottom: 1.75rem; }

  .tc-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
  .tc-kpi { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 1.25rem; }
  .tc-kpi-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
  .tc-kpi-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 19px; }
  .tc-kpi-icon.amber  { background: #fffbeb; }
  .tc-kpi-icon.green  { background: #f0fdf4; }
  .tc-kpi-icon.blue   { background: #eff6ff; }
  .tc-kpi-badge { font-size: 0.7rem; font-weight: 700; padding: 3px 8px; border-radius: 50px; }
  .tc-kpi-badge.up     { background: #dcfce7; color: #16a34a; }
  .tc-kpi-badge.urgent { background: #fef2f2; color: #dc2626; }
  .tc-kpi-val { font-size: 1.8rem; font-weight: 800; color: #0d1f0f; line-height: 1; }
  .tc-kpi-label { font-size: 0.78rem; color: #6b7280; margin-top: 4px; font-weight: 500; }

  .tc-section-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .tc-section-row h2 { font-size: 1rem; font-weight: 700; color: #0d1f0f; }
  .tc-btn-amber { padding: 7px 16px; border-radius: 50px; border: none; background: linear-gradient(135deg,#f59e0b,#d97706); color: #fff; font-size: 0.78rem; font-weight: 700; cursor: pointer; font-family: 'Manrope', sans-serif; }

  .tc-assignments { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
  .tc-assign-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 1.5rem; display: flex; gap: 1.25rem; align-items: flex-start; }
  .tc-assign-num { width: 44px; height: 44px; border-radius: 12px; background: #fffbeb; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 800; color: #92400e; flex-shrink: 0; }
  .tc-assign-body { flex: 1; }
  .tc-assign-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.4rem; flex-wrap: wrap; gap: 0.5rem; }
  .tc-assign-title { font-size: 0.95rem; font-weight: 700; color: #0d1f0f; }
  .tc-priority { font-size: 0.68rem; font-weight: 800; padding: 3px 8px; border-radius: 50px; text-transform: uppercase; }
  .tc-priority.high   { background: #fef2f2; color: #dc2626; }
  .tc-priority.medium { background: #fffbeb; color: #92400e; }
  .tc-priority.low    { background: #f0fdf4; color: #16a34a; }
  .tc-assign-meta { display: flex; gap: 1rem; font-size: 0.78rem; color: #9ca3af; margin-bottom: 0.5rem; flex-wrap: wrap; }
  .tc-assign-desc { font-size: 0.85rem; color: #4b5563; line-height: 1.5; margin-bottom: 0.75rem; }
  .tc-assign-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .tc-btn-action { padding: 5px 12px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; font-size: 0.75rem; font-weight: 600; cursor: pointer; color: #374151; font-family: 'Manrope', sans-serif; }
  .tc-btn-action.primary { background: #f59e0b; border-color: #f59e0b; color: #fff; }

  .tc-report-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 1.75rem; margin-bottom: 2rem; }
  .tc-report-card h3 { font-size: 1rem; font-weight: 700; color: #0d1f0f; margin-bottom: 0.25rem; }
  .tc-report-card > p { font-size: 0.82rem; color: #9ca3af; margin-bottom: 1.5rem; }
  .tc-form-group { margin-bottom: 1rem; }
  .tc-form-group label { display: block; font-size: 0.8rem; font-weight: 700; color: #374151; margin-bottom: 0.4rem; }
  .tc-form-group select, .tc-form-group input, .tc-form-group textarea { width: 100%; padding: 0.75rem 1rem; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 0.88rem; font-family: 'Manrope', sans-serif; background: #fafafa; color: #0d1f0f; outline: none; }
  .tc-form-group select:focus, .tc-form-group input:focus, .tc-form-group textarea:focus { border-color: #f59e0b; }
  .tc-form-group textarea { min-height: 100px; resize: vertical; }
  .tc-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .tc-status-opts { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  .tc-status-opt { padding: 7px 14px; border: 2px solid #e5e7eb; border-radius: 10px; font-size: 0.82rem; font-weight: 600; cursor: pointer; background: #fff; color: #374151; font-family: 'Manrope', sans-serif; }
  .tc-status-opt.sel { border-color: #f59e0b; background: #fffbeb; color: #92400e; }
  .tc-success { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 0.75rem 1rem; font-size: 0.85rem; color: #16a34a; font-weight: 600; margin-top: 0.75rem; }
`

const ASSIGNMENTS = [
  { num:'01', title:'Install AgroSense Pro — Farm1', priority:'high', farm:'f1', wilaya:'Sétif', date:'Today, 9:00 AM', desc:'Install 3× AgroSense Pro sensors in fields A, B, and C. Configure LoRa gateway and pair all devices to the farmer dashboard. Test readings before leaving.' },
  { num:'02', title:'Replace IrriBot sensor —  Farm2', priority:'medium', farm:'f2', wilaya:'Blida', date:'Tomorrow, 2:00 PM', desc:'Faulty pressure sensor needs replacement. Bring spare IrriBot valve + pressure module. Run full system diagnostics after swap.' },
  { num:'03', title:'Network setup —  Greenhouse', priority:'low', farm:'f3', wilaya:'Oran', date:'Dec 18, 10:00 AM', desc:'New greenhouse installation. Set up SolarHub gateway on roof, run sensor cables through irrigation trenches, calibrate all 6 climate sensors.' },
]

const STATUS_OPTS = ['Completed ✅','In Progress 🔧','Pending ⏳','Blocked ❌']

export default function TechnicianDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('assignments')
  const [reportStatus, setReportStatus] = useState('Completed ✅')
  const [sent, setSent] = useState(false)

  const firstName = user?.firstName || 'technician'
  const lastName  = user?.lastName  || ''
  const initials  = `${firstName[0]}${lastName[0]}`
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-GB', { weekday:'short', month:'short', day:'numeric' }) + ' · ' + now.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' })

  const navItems = [
    { key:'assignments', icon:'🗓️', label:'Assignments' },
    { key:'report',      icon:'📋', label:'Send Report' },
    { key:'history',     icon:'📁', label:'History' },
  ]

  const kpis = [
    { icon:'🗓️', cls:'amber', val:'3',  label:'Active Assignments',   badge:'1 urgent', badgeCls:'urgent' },
    { icon:'✅', cls:'green', val:'28', label:'Completed This Month', badge:'+4',       badgeCls:'up'     },
    { icon:'📋', cls:'blue',  val:'12', label:'Reports Sent',         badge:'On track', badgeCls:'up'     },
    { icon:'⭐', cls:'amber', val:'4.9',label:'Farmer Rating',        badge:'Excellent',badgeCls:'up'     },
  ]

  return (
    <>
      <style>{styles}</style>
      <div className="tc-dash">

        <aside className="tc-sidebar">
          <div className="tc-sidebar-logo">
            <div className="tc-logo-icon">🔧</div>
            <div>
              <div className="tc-logo-text">Agri<span>Sense</span></div>
              <div className="tc-logo-sub">Technician Panel</div>
            </div>
          </div>

          <div className="tc-section">Technician Menu</div>
          <div className="tc-nav">
            {navItems.map(n => (
              <button key={n.key} className={`tc-item ${tab === n.key ? 'active' : ''}`} onClick={() => setTab(n.key)}>
                <span className="tc-item-icon">{n.icon}</span>{n.label}
              </button>
            ))}
          </div>

          <div className="tc-section" style={{marginTop:'1rem'}}>Navigation</div>
          <div className="tc-nav">
            <Link to="/" className="tc-item" style={{textDecoration:'none'}}>
              <span className="tc-item-icon">🌐</span>Website
            </Link>
          </div>

          <div className="tc-foot">
            <div className="tc-avatar">{initials}</div>
            <div>
              <div className="tc-user-name">{firstName} {lastName}</div>
              <div className="tc-user-role">Technician</div>
            </div>
          </div>
        </aside>

        <div className="tc-main">
          <div className="tc-topbar">
            <div className="tc-topbar-left">
              <h2>{navItems.find(n => n.key === tab)?.label || 'Dashboard'}</h2>
              <p>{dateStr}</p>
            </div>
            <div className="tc-user-pill">
              <div className="tc-user-pill-av">{initials}</div>
              <span className="tc-user-pill-name">{firstName}</span>
              <span style={{fontSize:'12px',color:'#9ca3af'}}>▾</span>
            </div>
          </div>

          <div className="tc-content">
            <h1 className="tc-page-title">Welcome back, {firstName} 🔧</h1>
            <p className="tc-page-sub">Your assigned installations and field reports.</p>

            <div className="tc-kpi-grid">
              {kpis.map((k,i) => (
                <div key={i} className="tc-kpi">
                  <div className="tc-kpi-top">
                    <div className={`tc-kpi-icon ${k.cls}`}>{k.icon}</div>
                    <span className={`tc-kpi-badge ${k.badgeCls}`}>{k.badge}</span>
                  </div>
                  <div className="tc-kpi-val">{k.val}</div>
                  <div className="tc-kpi-label">{k.label}</div>
                </div>
              ))}
            </div>

            {tab === 'assignments' && (
              <>
                <div className="tc-section-row"><h2>🗓️ Your Assignments</h2></div>
                <div className="tc-assignments">
                  {ASSIGNMENTS.map((a,i) => (
                    <div key={i} className="tc-assign-card">
                      <div className="tc-assign-num">{a.num}</div>
                      <div className="tc-assign-body">
                        <div className="tc-assign-top">
                          <span className="tc-assign-title">{a.title}</span>
                          <span className={`tc-priority ${a.priority}`}>{a.priority} priority</span>
                        </div>
                        <div className="tc-assign-meta">
                          <span>🧑‍🌾 {a.farm}</span><span>📍 {a.wilaya}</span><span>🕐 {a.date}</span>
                        </div>
                        <div className="tc-assign-desc">{a.desc}</div>
                        <div className="tc-assign-actions">
                          <button className="tc-btn-action primary" onClick={() => setTab('report')}>Send Report 📋</button>
                          <button className="tc-btn-action">View Map 🗺️</button>
                          <button className="tc-btn-action">Call Farmer 📞</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {tab === 'report' && (
              <div className="tc-report-card">
                <h3>📋 Send Installation Report</h3>
                <p>Fill in details about the completed or in-progress installation.</p>
                <div className="tc-form-row">
                  <div className="tc-form-group">
                    <label>Assignment</label>
                    <select>{ASSIGNMENTS.map(a => <option key={a.num}>{a.num}. {a.title}</option>)}</select>
                  </div>
                  <div className="tc-form-group">
                    <label>Visit Date</label>
                    <input type="date" defaultValue={new Date().toISOString().split('T')[0]}/>
                  </div>
                </div>
                <div className="tc-form-group">
                  <label>Installation Status</label>
                  <div className="tc-status-opts">
                    {STATUS_OPTS.map(s => (
                      <div key={s} className={`tc-status-opt ${reportStatus===s?'sel':''}`} onClick={() => setReportStatus(s)}>{s}</div>
                    ))}
                  </div>
                </div>
                <div className="tc-form-row">
                  <div className="tc-form-group"><label>Devices Installed</label><input placeholder="e.g. 3× AgroSense Pro, 1× Gateway"/></div>
                  <div className="tc-form-group"><label>Time Spent (hours)</label><input type="number" placeholder="e.g. 3.5" min="0" step="0.5"/></div>
                </div>
                <div className="tc-form-group">
                  <label>Field Notes</label>
                  <textarea placeholder="Describe what was done, any issues, and recommendations..."/>
                </div>
                <div className="tc-form-group">
                  <label>Issues / Follow-up Needed</label>
                  <textarea placeholder="Leave blank if none..." style={{minHeight:'60px'}}/>
                </div>
                <button className="tc-btn-amber" style={{width:'100%',padding:'0.85rem',fontSize:'0.95rem',borderRadius:'12px',fontFamily:'Manrope,sans-serif'}}
                  onClick={() => { setSent(true); setTimeout(()=>setSent(false),3000) }}>
                  Submit Report →
                </button>
                {sent && <div className="tc-success">✅ Report submitted! The farmer has been notified.</div>}
              </div>
            )}

            {tab === 'history' && (
              <>
                <div className="tc-section-row"><h2>📁 Past Installations</h2></div>
                <div className="tc-assignments">
                  {[...ASSIGNMENTS].reverse().map((a,i) => (
                    <div key={i} className="tc-assign-card" style={{opacity:0.75}}>
                      <div className="tc-assign-num" style={{background:'#f0fdf4',color:'#16a34a'}}>✓</div>
                      <div className="tc-assign-body">
                        <div className="tc-assign-top">
                          <span className="tc-assign-title">{a.title}</span>
                          <span className="tc-priority low">Completed</span>
                        </div>
                        <div className="tc-assign-meta"><span>🧑‍🌾 {a.farm}</span><span>📍 {a.wilaya}</span></div>
                        <div className="tc-assign-actions">
                          <button className="tc-btn-action">View Report 📋</button>
                        </div>
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