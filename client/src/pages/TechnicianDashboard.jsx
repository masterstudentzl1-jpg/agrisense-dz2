import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import logoo from '../assets/logoo.png'

// ─── SVG ICON SYSTEM ─────────────────────────────────────────────────────────
const Icons = {
  assignments: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z',
  report:      ['M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'],
  history:     ['M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z'],
  analytics:   ['M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'],
  settings:    ['M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'],
  // KPI
  check:       'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  star:        'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
  clock_kpi:   'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
  target:      ['M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008H12v-.008z'],
  // Meta icons for assignment cards
  user:        ['M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'],
  mapPin:      ['M15 10.5a3 3 0 11-6 0 3 3 0 016 0z', 'M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z'],
  clock:       'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
  phone:       'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z',
  map:         ['M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z'],
  send:        'M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5',
  download:    'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3',
  // Topbar
  search:      'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z',
  refresh:     'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  bell:        'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
  chevronDown: 'M19.5 8.25l-7.5 7.5-7.5-7.5',
  chevronUp:   'M4.5 15.75l7.5-7.5 7.5 7.5',
  logout:      'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75',
  menu:        ['M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'],
  close:       'M6 18L18 6M6 6l12 12',
  home:        ['M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75'],
  // Settings
  shield:      'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
  availability:'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
  tools:       ['M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z'],
  profile:     ['M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'],
  notifications: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
}

const Ic = ({ name, size = 16, style = {} }) => {
  const d = Icons[name]
  if (!d) return null
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  )
}

const S = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Manrope',sans-serif;overflow-x:hidden}
.db{display:flex;min-height:100vh;background:#f4f6f8;font-family:'Manrope',sans-serif;position:relative}
.sb{width:300px;background:#0d1117;display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:200;transition:transform 0.3s ease;overflow-y:auto;overflow-x:hidden;}
.sb-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.3);z-index:199;}
.db-main{margin-left:300px;flex:1;display:flex;flex-direction:column;min-height:100vh;transition:margin-left 0.3s ease;}
.topbar{height:64px;background:#fff;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;justify-content:space-between;padding:0 1.5rem;position:sticky;top:0;z-index:100;gap:1rem;}
.tb-hamburger{display:none;background:none;border:none;cursor:pointer;padding:6px;border-radius:8px;color:#6b7280;flex-shrink:0;transition:background 0.15s;}
.tb-hamburger:hover{background:#f3f4f6}
.tb-breadcrumb{display:flex;align-items:center;gap:6px;font-size:0.88rem;color:#9ca3af;font-weight:500;flex-shrink:0;}
.tb-breadcrumb .tb-brand{color:#374151;font-weight:600}
.tb-breadcrumb .tb-sep{color:#d1d5db}
.tb-breadcrumb .tb-page{color:#0d1f0f;font-weight:800;font-size:0.95rem}
.tb-search{flex:1;max-width:360px;display:flex;align-items:center;gap:8px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:50px;padding:0.45rem 1rem;}
.tb-search input{border:none;outline:none;background:none;font-size:0.85rem;font-family:'Manrope',sans-serif;color:#374151;width:100%;}
.tb-search input::placeholder{color:#9ca3af}
.tb-actions{display:flex;align-items:center;gap:0.6rem;flex-shrink:0}
.tb-time{font-size:0.82rem;font-weight:700;color:#374151;white-space:nowrap}
.tb-icon-btn{width:36px;height:36px;border-radius:50%;border:1px solid #e5e7eb;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;position:relative;transition:background 0.15s;flex-shrink:0;color:#6b7280;}
.tb-icon-btn:hover{background:#f9fafb}
.tb-notif-dot{position:absolute;top:5px;right:5px;width:8px;height:8px;border-radius:50%;background:#ef4444;border:2px solid #fff;}
.tb-user-btn{display:flex;align-items:center;gap:8px;background:#fffbeb;border:1px solid #fde68a;border-radius:50px;padding:5px 12px 5px 5px;cursor:pointer;transition:background 0.2s;position:relative;flex-shrink:0;}
.tb-user-btn:hover{background:#fef3c7}
.tb-user-av{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#d97706);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;flex-shrink:0;}
.tb-user-name{font-size:0.82rem;font-weight:700;color:#d97706}
.user-dropdown{position:absolute;top:calc(100% + 8px);right:0;background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:0.5rem;min-width:220px;box-shadow:0 8px 30px rgba(0,0,0,0.12);z-index:500;}
.ud-header{padding:0.75rem 0.75rem 0.5rem;border-bottom:1px solid #f3f4f6;margin-bottom:0.25rem}
.ud-name{font-size:0.92rem;font-weight:800;color:#0d1f0f}
.ud-role{font-size:0.75rem;color:#6b7280;margin-top:2px}
.ud-item{display:flex;align-items:center;gap:10px;padding:0.65rem 0.75rem;border-radius:10px;cursor:pointer;font-size:0.85rem;font-weight:600;color:#374151;transition:background 0.15s;border:none;background:none;width:100%;text-align:left;font-family:'Manrope',sans-serif;}
.ud-item:hover{background:#f9fafb}
.ud-item.danger{color:#ef4444}
.ud-item.danger:hover{background:#fef2f2}
.ud-sep{height:1px;background:#f3f4f6;margin:0.25rem 0}
.tb-live{display:flex;align-items:center;gap:6px;background:#fffbeb;border:1px solid #fde68a;border-radius:50px;padding:5px 12px;font-size:0.72rem;font-weight:700;color:#d97706;white-space:nowrap;flex-shrink:0;}
.tb-live-dot{width:7px;height:7px;border-radius:50%;background:#f59e0b;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
.sb-header{padding:1.25rem 1.25rem 0.5rem;display:flex;align-items:center;justify-content:space-between;}
.sb-brand-row{display:flex;align-items:center;gap:10px}
.sb-logo-img{width:36px;height:36px;object-fit:contain;border-radius:8px}
.sb-brand-text .sb-name{font-size:1rem;font-weight:800;color:#fff}
.sb-brand-text .sb-name span{color:#fbbf24}
.sb-brand-text .sb-sub{font-size:0.65rem;color:#fbbf24;font-weight:600;text-transform:uppercase;letter-spacing:0.08em}
.sb-close-btn{background:rgba(255,255,255,0.08);border:none;cursor:pointer;width:28px;height:28px;border-radius:8px;display:none;align-items:center;justify-content:center;color:#9ca3af;transition:background 0.15s;}
.sb-close-btn:hover{background:rgba(255,255,255,0.15)}
.sb-system{margin:0.75rem 1.25rem 1rem;background:rgba(245,158,11,0.15);border:1px solid rgba(251,191,36,0.25);border-radius:12px;padding:0.75rem 1rem;display:flex;align-items:center;gap:10px;}
.sb-sys-dot{width:8px;height:8px;border-radius:50%;background:#f59e0b;box-shadow:0 0 8px rgba(245,158,11,0.5);flex-shrink:0}
.sb-sys-info .sb-sys-title{font-size:0.82rem;font-weight:700;color:#fbbf24}
.sb-sys-info .sb-sys-sub{font-size:0.68rem;color:#fcd34d;margin-top:1px}
.sb-section-label{font-size:0.6rem;font-weight:700;color:#60501a;text-transform:uppercase;letter-spacing:0.14em;padding:0.75rem 1.25rem 0.3rem;}
.sb-nav-group{display:flex;flex-direction:column;gap:2px;padding:0 0.75rem;margin-bottom:0.5rem}
.sb-item{display:flex;align-items:center;gap:10px;padding:0.65rem 0.75rem;border-radius:10px;cursor:pointer;border:none;background:none;width:100%;text-align:left;transition:all 0.15s;}
.sb-item:hover{background:rgba(255,255,255,0.06)}
.sb-item.active{background:rgba(245,158,11,0.18);border-left:3px solid #f59e0b}
.sb-item-icon{width:20px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#9ca3af}
.sb-item-label{font-size:0.88rem;font-weight:600;color:#9ca3af}
.sb-item.active .sb-item-icon,.sb-item.active .sb-item-label{color:#fbbf24}
.sb-item:hover .sb-item-icon,.sb-item:hover .sb-item-label{color:#d1d5db}
.sb-badge{margin-left:auto;background:#ef4444;color:#fff;font-size:0.62rem;font-weight:800;padding:2px 7px;border-radius:50px}
.sb-foot{margin-top:auto;border-top:1px solid rgba(255,255,255,0.08);padding:1rem 1.25rem;display:flex;align-items:center;gap:10px;}
.sb-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#f59e0b,#d97706);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;flex-shrink:0}
.sb-user-info .sb-user-name{font-size:0.85rem;font-weight:700;color:#fff}
.sb-user-info .sb-user-role{font-size:0.68rem;color:#fbbf24;font-weight:500}
.sb-logout-btn{margin-left:auto;background:none;border:none;cursor:pointer;color:#6b7280;transition:color 0.2s;padding:4px;display:flex;align-items:center}
.sb-logout-btn:hover{color:#ef4444}
.db-content{flex:1;padding:1.5rem 2rem;overflow-y:auto}
.page-header{margin-bottom:1.5rem}
.page-header h1{font-size:1.5rem;font-weight:800;color:#0d1f0f}
.page-header p{font-size:0.85rem;color:#6b7280;margin-top:3px}
.page-header-row{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem}
.live-badge{display:flex;align-items:center;gap:6px;background:#fffbeb;border:1px solid #fde68a;border-radius:50px;padding:6px 14px;font-size:0.75rem;font-weight:700;color:#d97706;white-space:nowrap;flex-shrink:0}
.live-dot{width:7px;height:7px;border-radius:50%;background:#f59e0b;animation:pulse 2s infinite}
.kpi-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-bottom:1.5rem}
.kpi-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.5rem;position:relative;overflow:hidden;transition:box-shadow 0.2s}
.kpi-card:hover{box-shadow:0 4px 20px rgba(0,0,0,0.07)}
.kpi-accent{position:absolute;top:0;left:0;right:0;height:3px;border-radius:16px 16px 0 0}
.kpi-accent.amber{background:#f59e0b}.kpi-accent.green{background:#22c55e}.kpi-accent.blue{background:#3b82f6}.kpi-accent.red{background:#ef4444}
.kpi-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;margin-top:0.5rem}
.kpi-icon-wrap{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;}
.kpi-icon-wrap.amber{background:#fffbeb;color:#d97706}.kpi-icon-wrap.green{background:#f0fdf4;color:#16a34a}.kpi-icon-wrap.blue{background:#eff6ff;color:#2563eb}.kpi-icon-wrap.red{background:#fef2f2;color:#dc2626}
.kpi-trend{font-size:0.75rem;font-weight:700}
.kpi-trend.up{color:#16a34a}.kpi-trend.down{color:#ef4444}
.kpi-value{font-size:2rem;font-weight:800;color:#0d1f0f;line-height:1;margin-bottom:0.25rem}
.kpi-label{font-size:0.82rem;font-weight:600;color:#374151;margin-bottom:2px}
.kpi-sub{font-size:0.72rem;color:#9ca3af}
.assignments-section{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.5rem;margin-bottom:1.25rem}
.assignments-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem}
.assignments-head h3{font-size:1rem;font-weight:700;color:#0d1f0f}
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
.assignment-meta-item{display:flex;align-items:center;gap:4px}
.assignment-desc{font-size:0.82rem;color:#6b7280;margin-bottom:0.75rem;padding-bottom:0.75rem;border-bottom:1px solid #f3f4f6}
.assignment-footer{display:flex;align-items:center;justify-content:flex-end;gap:8px}
.assignment-btn{display:flex;align-items:center;gap:5px;padding:7px 14px;border-radius:50px;border:1.5px solid #e5e7eb;background:#fff;font-size:0.75rem;font-weight:600;cursor:pointer;color:#374151;transition:all 0.15s;font-family:'Manrope',sans-serif}
.assignment-btn.primary{background:linear-gradient(135deg,#f59e0b,#d97706);border-color:#f59e0b;color:#fff}
.assignment-btn.primary:hover{background:#d97706}
.assignment-btn:hover{border-color:#f59e0b;color:#d97706}
.report-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.75rem;margin-bottom:1.25rem}
.form-group{margin-bottom:1rem}
.form-group label{display:block;font-size:0.78rem;font-weight:700;color:#374151;margin-bottom:0.4rem}
.form-group select,.form-group input,.form-group textarea{width:100%;padding:0.7rem 1rem;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.88rem;font-family:'Manrope',sans-serif;background:#fafafa;color:#0d1f0f;outline:none}
.form-group select:focus,.form-group input:focus,.form-group textarea:focus{border-color:#f59e0b;background:#fff}
.form-group textarea{min-height:100px;resize:vertical}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem}
.status-opts{display:flex;gap:0.75rem;flex-wrap:wrap}
.status-opt{padding:7px 14px;border:2px solid #e5e7eb;border-radius:10px;font-size:0.82rem;font-weight:600;cursor:pointer;background:#fff;color:#374151;font-family:'Manrope',sans-serif;transition:all 0.15s}
.status-opt.sel{border-color:#f59e0b;background:#fffbeb;color:#d97706}
.btn-submit{width:100%;padding:0.85rem;border-radius:12px;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;font-size:0.95rem;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif;margin-top:0.5rem;display:flex;align-items:center;justify-content:center;gap:8px}
.submit-success{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:0.75rem 1rem;font-size:0.85rem;color:#16a34a;font-weight:600;margin-top:0.75rem;display:flex;align-items:center;gap:8px}
.history-check{width:44px;height:44px;border-radius:12px;background:#f0fdf4;display:flex;align-items:center;justify-content:center;color:#16a34a;flex-shrink:0}
.settings-nav-item{display:flex;align-items:center;gap:8px;padding:0.65rem 0.75rem;border-radius:10px;cursor:pointer;font-size:0.85rem;font-weight:600;color:#6b7280;transition:all 0.15s;border:none;background:none;width:100%;text-align:left}
.settings-nav-item:hover{background:#f9fafb;color:#0d1f0f}
.settings-nav-item.active{background:#fffbeb;color:#d97706}
.chart-head-left h3{font-size:1rem;font-weight:700;color:#0d1f0f}
.chart-head-left p{font-size:0.75rem;color:#9ca3af;margin-top:2px}
.legend-item{display:flex;align-items:center;gap:5px;font-size:0.75rem;color:#6b7280;font-weight:500}
.legend-dot{width:8px;height:8px;border-radius:50%}
@media(max-width:900px){.kpi-grid{grid-template-columns:repeat(2,1fr)}.form-row{grid-template-columns:1fr}}
@media(max-width:768px){.sb{transform:translateX(-100%);box-shadow:4px 0 30px rgba(0,0,0,0.2);z-index:300}.sb.mobile-open{transform:translateX(0)}.sb-overlay{display:block}.sb-overlay.hidden{display:none}.sb-close-btn{display:flex!important}.db-main{margin-left:0!important}.tb-hamburger{display:flex}.tb-search{display:none}.db-content{padding:1rem}.topbar{padding:0 1rem}.kpi-grid{grid-template-columns:1fr;gap:0.75rem}.assignment-header{flex-direction:column;gap:0.5rem}.assignment-footer{justify-content:flex-start}.assignment-meta{gap:8px}}
@media(max-width:480px){.kpi-value{font-size:1.6rem}.assignment-card{padding:1rem}.status-opts{gap:0.5rem}.status-opt{padding:5px 10px;font-size:0.75rem}}
`

const ASSIGNMENTS_DATA = [
  { id:1, num:'01', title:'Install AgroSense Pro — Farm1', priority:'high', farm:'Farm1 · Ahmed', wilaya:'Sétif', date:'Today, 9:00 AM', desc:'Install 3× AgroSense Pro sensors in fields A, B, and C. Configure LoRa gateway and pair all devices to the farmer dashboard. Test readings before leaving.' },
  { id:2, num:'02', title:'Replace IrriBot sensor — Farm2', priority:'medium', farm:'Farm2 · Fatima', wilaya:'Blida', date:'Tomorrow, 2:00 PM', desc:'Faulty pressure sensor needs replacement. Bring spare IrriBot valve + pressure module. Run full system diagnostics after swap.' },
  { id:3, num:'03', title:'Network setup — Greenhouse', priority:'low', farm:'Farm3 · Mohamed', wilaya:'Oran', date:'Dec 18, 10:00 AM', desc:'New greenhouse installation. Set up SolarHub gateway on roof, run sensor cables through irrigation trenches, calibrate all 6 climate sensors.' },
]

const STATUS_OPTS = ['Completed', 'In Progress', 'Pending', 'Blocked']

const navSectionsConfig = [
  { label: 'Technician Menu', items: [
    { key: 'assignments', iconName: 'assignments', label: 'Assignments' },
    { key: 'report',      iconName: 'report',      label: 'Send Report' },
    { key: 'history',     iconName: 'history',     label: 'History' },
  ]},
  { label: 'Manage', items: [
    { key: 'analytics', iconName: 'analytics', label: 'Analytics' },
    { key: 'settings',  iconName: 'settings',  label: 'Settings' },
  ]},
]

const settingsNavConfig = [
  { key: 'Profile',       iconName: 'profile' },
  { key: 'Availability',  iconName: 'availability' },
  { key: 'Notifications', iconName: 'notifications' },
  { key: 'Tools',         iconName: 'tools' },
  { key: 'Security',      iconName: 'shield' },
]

export default function TechnicianDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('assignments')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userDropOpen, setUserDropOpen] = useState(false)
  const [now, setNow] = useState(new Date())
  const [reportStatus, setReportStatus] = useState('Completed')
  const [sent, setSent] = useState(false)
  const [settingsTab, setSettingsTab] = useState('Profile')
  const dropRef = useRef(null)

  useEffect(() => { const id = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(id) }, [])
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setUserDropOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleTabChange = (key) => { setTab(key); if (window.innerWidth <= 768) setSidebarOpen(false) }

  const firstName = user?.firstName || 'Technician'
  const lastName = user?.lastName || ''
  const initials = `${firstName[0]}${lastName[0] || ''}`
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

  const currentPageLabel = navSectionsConfig.flatMap(s => s.items).find(i => i.key === tab)?.label || 'Dashboard'
  const activeAssignments = ASSIGNMENTS_DATA.length
  const urgentCount = ASSIGNMENTS_DATA.filter(a => a.priority === 'high').length
  const completedThisMonth = 28
  const farmerRating = 4.9

  return (
    <>
      <style>{S}</style>
      <div className="db">
        <div className={`sb-overlay${sidebarOpen ? '' : ' hidden'}`} onClick={() => setSidebarOpen(false)} />

        <aside className={`sb${sidebarOpen ? ' mobile-open' : ''}`}>
          <div className="sb-header">
            <div className="sb-brand-row">
              <img src={logoo} alt="logo" className="sb-logo-img" />
              <div className="sb-brand-text">
                <div className="sb-name">Agri<span>Sense</span></div>
                <div className="sb-sub">Technician Panel</div>
              </div>
            </div>
            <button className="sb-close-btn" onClick={() => setSidebarOpen(false)}><Ic name="close" size={14} /></button>
          </div>

          <div className="sb-system">
            <div className="sb-sys-dot" />
            <div className="sb-sys-info">
              <div className="sb-sys-title">Active Duty</div>
              <div className="sb-sys-sub">{activeAssignments} assignments · On track</div>
            </div>
          </div>

          {navSectionsConfig.map(section => (
            <div key={section.label}>
              <div className="sb-section-label">{section.label}</div>
              <div className="sb-nav-group">
                {section.items.map(n => (
                  <button key={n.key} className={`sb-item${tab === n.key ? ' active' : ''}`} onClick={() => handleTabChange(n.key)}>
                    <span className="sb-item-icon"><Ic name={n.iconName} size={16} /></span>
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
            <button className="sb-logout-btn" onClick={() => { logout(); navigate('/') }}><Ic name="logout" size={18} /></button>
          </div>
        </aside>

        <div className="db-main">
          <div className="topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <button className="tb-hamburger" onClick={() => setSidebarOpen(o => !o)}><Ic name="menu" size={20} /></button>
              <div className="tb-breadcrumb">
                <span className="tb-brand">AgriSense DZ</span>
                <span className="tb-sep">›</span>
                <span className="tb-page">{currentPageLabel}</span>
              </div>
            </div>
            <div className="tb-search">
              <Ic name="search" size={14} style={{ color: '#9ca3af', flexShrink: 0 }} />
              <input placeholder="Search assignments, reports..." />
            </div>
            <div className="tb-actions">
              <span className="tb-time">{timeStr}</span>
              <button className="tb-icon-btn"><Ic name="refresh" size={16} /></button>
              <button className="tb-icon-btn" onClick={() => handleTabChange('assignments')}>
                <Ic name="bell" size={16} />
                <span className="tb-notif-dot" />
              </button>
              {tab === 'assignments' && (
                <div className="tb-live"><span className="tb-live-dot" />Live · updated now</div>
              )}
              <div style={{ position: 'relative' }} ref={dropRef}>
                <button className="tb-user-btn" onClick={() => setUserDropOpen(o => !o)}>
                  <div className="tb-user-av">{initials}</div>
                  <span className="tb-user-name">{firstName}</span>
                  <Ic name={userDropOpen ? 'chevronUp' : 'chevronDown'} size={10} style={{ color: '#d97706' }} />
                </button>
                {userDropOpen && (
                  <div className="user-dropdown">
                    <div className="ud-header">
                      <div className="ud-name">{firstName} {lastName}</div>
                      <div className="ud-role">Technician · {user?.wilaya || 'Algiers'}</div>
                    </div>
                    <button className="ud-item" onClick={() => { setTab('settings'); setUserDropOpen(false) }}>
                      <Ic name="profile" size={15} /> Profile &amp; Settings
                    </button>
                    <button className="ud-item" onClick={() => navigate('/')}>
                      <Ic name="home" size={15} /> Back to Home
                    </button>
                    <div className="ud-sep" />
                    <button className="ud-item danger" onClick={() => { logout(); navigate('/') }}>
                      <Ic name="logout" size={15} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="db-content">

            {/* ASSIGNMENTS TAB */}
            {tab === 'assignments' && (<>
              <div className="page-header-row">
                <div className="page-header">
                  <h1>{greeting}, {firstName} 🔧</h1>
                  <p>Your assigned installations and field reports.</p>
                </div>
                <div className="live-badge"><span className="live-dot" />Live · updated now</div>
              </div>

              <div className="kpi-grid">
                {[
                  { iconName: 'assignments', iconClass: 'amber', accent: 'amber', val: activeAssignments, label: 'Active Assignments', sub: `${urgentCount} urgent`, trend: '↗ 2', dir: 'up' },
                  { iconName: 'check', iconClass: 'green', accent: 'green', val: completedThisMonth, label: 'Completed This Month', sub: '+4 vs last month', trend: '↗ 12%', dir: 'up' },
                  { iconName: 'report', iconClass: 'blue', accent: 'blue', val: '12', label: 'Reports Sent', sub: 'This quarter', trend: 'On track', dir: 'up' },
                  { iconName: 'star', iconClass: 'amber', accent: 'amber', val: farmerRating, label: 'Farmer Rating', sub: 'From 45 reviews', trend: 'Excellent', dir: 'up' },
                ].map((k, i) => (
                  <div key={i} className="kpi-card">
                    <div className={`kpi-accent ${k.accent}`} />
                    <div className="kpi-top">
                      <div className={`kpi-icon-wrap ${k.iconClass}`}><Ic name={k.iconName} size={20} /></div>
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
                  <h3>Your Assignments ({activeAssignments})</h3>
                </div>
                {ASSIGNMENTS_DATA.map(a => (
                  <div key={a.id} className="assignment-card">
                    <div className="assignment-header">
                      <span className="assignment-num">#{a.num}</span>
                      <span className={`assignment-priority ${a.priority}`}>{a.priority.toUpperCase()} priority</span>
                    </div>
                    <div className="assignment-title">{a.title}</div>
                    <div className="assignment-meta">
                      <span className="assignment-meta-item"><Ic name="user" size={12} /> {a.farm}</span>
                      <span className="assignment-meta-item"><Ic name="mapPin" size={12} /> {a.wilaya}</span>
                      <span className="assignment-meta-item"><Ic name="clock" size={12} /> {a.date}</span>
                    </div>
                    <div className="assignment-desc">{a.desc}</div>
                    <div className="assignment-footer">
                      <button className="assignment-btn primary" onClick={() => setTab('report')}>
                        <Ic name="send" size={13} /> Send Report
                      </button>
                      <button className="assignment-btn">
                        <Ic name="map" size={13} /> View Map
                      </button>
                      <button className="assignment-btn">
                        <Ic name="phone" size={13} /> Call Farmer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>)}

            {/* REPORT TAB */}
            {tab === 'report' && (<>
              <div className="page-header">
                <h1>Send Installation Report</h1>
                <p>Fill in details about the completed or in-progress installation.</p>
              </div>
              <div className="report-card">
                <div className="form-row">
                  <div className="form-group">
                    <label>Assignment</label>
                    <select>
                      {ASSIGNMENTS_DATA.map(a => (<option key={a.id}>#{a.num}. {a.title}</option>))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Visit Date</label>
                    <input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Installation Status</label>
                  <div className="status-opts">
                    {STATUS_OPTS.map(s => (
                      <div key={s} className={`status-opt ${reportStatus === s ? 'sel' : ''}`} onClick={() => setReportStatus(s)}>{s}</div>
                    ))}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Devices Installed</label>
                    <input placeholder="e.g. 3× AgroSense Pro, 1× Gateway" />
                  </div>
                  <div className="form-group">
                    <label>Time Spent (hours)</label>
                    <input type="number" placeholder="e.g. 3.5" min="0" step="0.5" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Field Notes</label>
                  <textarea placeholder="Describe what was done, any issues, and recommendations..." />
                </div>
                <div className="form-group">
                  <label>Issues / Follow-up Needed</label>
                  <textarea placeholder="Leave blank if none..." style={{ minHeight: '60px' }} />
                </div>
                <button className="btn-submit" onClick={() => { setSent(true); setTimeout(() => setSent(false), 3000) }}>
                  <Ic name="send" size={16} /> Submit Report
                </button>
                {sent && (
                  <div className="submit-success">
                    <Ic name="check" size={16} /> Report submitted! The farmer has been notified.
                  </div>
                )}
              </div>
            </>)}

            {/* HISTORY TAB */}
            {tab === 'history' && (<>
              <div className="page-header">
                <h1>Past Installations</h1>
                <p>View your completed assignment history</p>
              </div>
              <div className="assignments-section">
                <div className="assignments-head"><h3>Completed Installations (24)</h3></div>
                {[...ASSIGNMENTS_DATA].reverse().map(a => (
                  <div key={a.id} className="assignment-card" style={{ opacity: 0.85 }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div className="history-check"><Ic name="check" size={20} /></div>
                      <div style={{ flex: 1 }}>
                        <div className="assignment-header">
                          <span className="assignment-title">{a.title}</span>
                          <span className="assignment-priority low">COMPLETED</span>
                        </div>
                        <div className="assignment-meta">
                          <span className="assignment-meta-item"><Ic name="user" size={12} /> {a.farm}</span>
                          <span className="assignment-meta-item"><Ic name="mapPin" size={12} /> {a.wilaya}</span>
                          <span className="assignment-meta-item"><Ic name="check" size={12} /> Completed Dec 15, 2024</span>
                        </div>
                        <div className="assignment-footer" style={{ justifyContent: 'flex-start' }}>
                          <button className="assignment-btn"><Ic name="report" size={13} /> View Report</button>
                          <button className="assignment-btn"><Ic name="download" size={13} /> Download PDF</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>)}

            {/* ANALYTICS TAB */}
            {tab === 'analytics' && (<>
              <div className="page-header">
                <h1>Analytics</h1>
                <p>Track your performance and installation metrics</p>
              </div>
              <div className="kpi-grid">
                {[
                  { iconName: 'check',      iconClass: 'green', accent: 'green', val: '124', label: 'Total Installations', sub: 'Year to date' },
                  { iconName: 'star',       iconClass: 'amber', accent: 'amber', val: '4.9', label: 'Avg Rating',           sub: 'From 45 farmers' },
                  { iconName: 'clock_kpi',  iconClass: 'blue',  accent: 'blue',  val: '2.4h', label: 'Avg Install Time',   sub: 'Per site' },
                  { iconName: 'target',     iconClass: 'amber', accent: 'amber', val: '98%',  label: 'Completion Rate',    sub: 'On-time delivery' },
                ].map((k, i) => (
                  <div key={i} className="kpi-card">
                    <div className={`kpi-accent ${k.accent}`} />
                    <div className="kpi-top"><div className={`kpi-icon-wrap ${k.iconClass}`}><Ic name={k.iconName} size={20} /></div></div>
                    <div className="kpi-value">{k.val}</div>
                    <div className="kpi-label">{k.label}</div>
                    <div className="kpi-sub">{k.sub}</div>
                  </div>
                ))}
              </div>
              <div className="report-card">
                <div className="chart-head-left" style={{ marginBottom: '0.75rem' }}>
                  <h3>Monthly Installations</h3>
                  <p>Number of completed installations per month</p>
                </div>
                <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                  <Ic name="analytics" size={48} style={{ opacity: 0.3, margin: '0 auto 1rem', display: 'block' }} />
                  Chart coming soon
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
                    <div className="legend-item"><span className="legend-dot" style={{ background: '#f59e0b' }} /> Installations</div>
                  </div>
                </div>
              </div>
            </>)}

            {/* SETTINGS TAB */}
            {tab === 'settings' && (<>
              <div className="page-header">
                <h1>Settings</h1>
                <p>Manage your account and preferences</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.5rem' }}>
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '0.75rem', height: 'fit-content' }}>
                  {settingsNavConfig.map(s => (
                    <button key={s.key} className={`settings-nav-item${settingsTab === s.key ? ' active' : ''}`} onClick={() => setSettingsTab(s.key)}>
                      <Ic name={s.iconName} size={15} /> {s.key}
                    </button>
                  ))}
                </div>
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '1.75rem' }}>
                  {settingsTab === 'Profile' ? (<>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                      <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{initials}</div>
                      <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0d1f0f' }}>{firstName} {lastName}</h3>
                        <p style={{ fontSize: '0.78rem', color: '#6b7280' }}>Senior Field Technician · Since 2024</p>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      {['Full Name', 'Email', 'Phone', 'Specialization', 'Preferred Wilaya', 'Emergency Contact'].map(f => (
                        <div key={f}>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem' }}>{f}</label>
                          <input style={{ width: '100%', padding: '0.7rem 1rem', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontFamily: 'Manrope,sans-serif', fontSize: '0.88rem' }} placeholder={`Enter ${f.toLowerCase()}`} />
                        </div>
                      ))}
                    </div>
                    <button style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', marginTop: '1.25rem', fontFamily: 'Manrope,sans-serif' }}>Save Changes</button>
                  </>) : (
                    <div style={{ color: '#9ca3af', fontSize: '0.9rem', padding: '2rem', textAlign: 'center' }}>
                      <Ic name={settingsNavConfig.find(s => s.key === settingsTab)?.iconName || 'settings'} size={48} style={{ opacity: 0.3, margin: '0 auto 1rem', display: 'block' }} />
                      <p><strong>{settingsTab}</strong> settings coming soon.</p>
                    </div>
                  )}
                </div>
              </div>
            </>)}

          </div>
        </div>
      </div>
    </>
  )
}