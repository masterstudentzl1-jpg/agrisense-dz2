import { useState, useEffect, useRef, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import logoo from '../assets/logoo.png'

// ─── SVG ICON LIBRARY ────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, stroke = 'currentColor', fill = 'none', strokeWidth = 1.5, viewBox = '0 0 24 24', style = {} }) => (
  <svg width={size} height={size} viewBox={viewBox} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
)

const Icons = {
  dashboard:   'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  fields:      'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
  sensors:     'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0',
  analytics:   ['M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'],
  alerts:      'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  settings:    ['M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'],
  sensor_kpi:  ['M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0'],
  moisture:    ['M12 2.69l5.66 5.66a8 8 0 11-11.31 0z'],
  temp:        ['M14.5 10V5.5a2.5 2.5 0 00-5 0V10', 'M9 10a5 5 0 105 0'],
  warning:     'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
  check:       'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  search:      'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z',
  refresh:     'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  bell:        'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
  chevronDown: 'M19.5 8.25l-7.5 7.5-7.5-7.5',
  chevronUp:   'M4.5 15.75l7.5-7.5 7.5 7.5',
  logout:      'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75',
  menu:        ['M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'],
  close:       'M6 18L18 6M6 6l12 12',
  home:        ['M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'],
  user:        ['M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'],
  plus:        'M12 4.5v15m7.5-7.5h-15',
  dots:        ['M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'],
  mapPin:      ['M15 10.5a3 3 0 11-6 0 3 3 0 016 0z', 'M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z'],
  clock:       'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
  battery:     ['M6.5 10h11v4h-11z', 'M3 10h3.5m11 0H21m-1.5-2v8'],
  signal:      ['M1.5 8.5a13 13 0 0121 0M5.5 12.5a8 8 0 0113 0M9.5 16.5a3 3 0 015 0M12 20.25h.008'],
  download:    'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3',
  edit:        'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125',
  trash:       ['M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'],
  star:        'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
  shield:      'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
  phone:       'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z',
}

const Ic = ({ name, size = 16, style = {} }) => {
  const d = Icons[name]
  if (!d) return null
  return <Icon d={d} size={size} style={style} />
}

const S = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Manrope',sans-serif;overflow-x:hidden}
.db{display:flex;min-height:100vh;background:#f4f6f8;font-family:'Manrope',sans-serif;position:relative}
.sb{width:280px;background:#0d2818;display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:200;transition:transform 0.3s ease;overflow-y:auto;overflow-x:hidden;}
.sb-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:199;}
.db-main{margin-left:280px;flex:1;display:flex;flex-direction:column;min-height:100vh;transition:margin-left 0.3s ease;}
.topbar{height:60px;background:#fff;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;justify-content:space-between;padding:0 1.25rem;position:sticky;top:0;z-index:100;gap:0.75rem;}
.tb-hamburger{display:none;background:none;border:none;cursor:pointer;padding:6px;border-radius:8px;color:#6b7280;flex-shrink:0;transition:background 0.15s;}
.tb-hamburger:hover{background:#f3f4f6}
.tb-breadcrumb{display:flex;align-items:center;gap:6px;font-size:0.88rem;color:#9ca3af;font-weight:500;flex-shrink:0;min-width:0;}
.tb-breadcrumb .tb-brand{color:#374151;font-weight:600;white-space:nowrap}
.tb-breadcrumb .tb-sep{color:#d1d5db;flex-shrink:0}
.tb-breadcrumb .tb-page{color:#0d1f0f;font-weight:800;font-size:0.95rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tb-search{flex:1;max-width:360px;display:flex;align-items:center;gap:8px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:50px;padding:0.45rem 1rem;}
.tb-search input{border:none;outline:none;background:none;font-size:0.85rem;font-family:'Manrope',sans-serif;color:#374151;width:100%;}
.tb-search input::placeholder{color:#9ca3af}
.tb-actions{display:flex;align-items:center;gap:0.5rem;flex-shrink:0}
.tb-time{font-size:0.82rem;font-weight:700;color:#374151;white-space:nowrap}
.tb-icon-btn{width:36px;height:36px;border-radius:50%;border:1px solid #e5e7eb;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;position:relative;transition:background 0.15s;flex-shrink:0;color:#6b7280;}
.tb-icon-btn:hover{background:#f9fafb}
.tb-notif-dot{position:absolute;top:5px;right:5px;width:8px;height:8px;border-radius:50%;background:#ef4444;border:2px solid #fff;}
.tb-user-btn{display:flex;align-items:center;gap:8px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:50px;padding:5px 12px 5px 5px;cursor:pointer;transition:background 0.2s;position:relative;flex-shrink:0;}
.tb-user-btn:hover{background:#dcfce7}
.tb-user-av{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#22c55e,#16a34a);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;flex-shrink:0;}
.tb-user-name{font-size:0.82rem;font-weight:700;color:#16a34a}
.user-dropdown{position:absolute;top:calc(100% + 8px);right:0;background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:0.5rem;min-width:220px;box-shadow:0 8px 30px rgba(0,0,0,0.12);z-index:500;}
.ud-header{padding:0.75rem 0.75rem 0.5rem;border-bottom:1px solid #f3f4f6;margin-bottom:0.25rem}
.ud-name{font-size:0.92rem;font-weight:800;color:#0d1f0f}
.ud-role{font-size:0.75rem;color:#6b7280;margin-top:2px}
.ud-item{display:flex;align-items:center;gap:10px;padding:0.65rem 0.75rem;border-radius:10px;cursor:pointer;font-size:0.85rem;font-weight:600;color:#374151;transition:background 0.15s;border:none;background:none;width:100%;text-align:left;font-family:'Manrope',sans-serif;}
.ud-item:hover{background:#f9fafb}
.ud-item.danger{color:#ef4444}
.ud-item.danger:hover{background:#fef2f2}
.ud-sep{height:1px;background:#f3f4f6;margin:0.25rem 0}
.tb-live{display:flex;align-items:center;gap:6px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:50px;padding:5px 12px;font-size:0.72rem;font-weight:700;color:#16a34a;white-space:nowrap;flex-shrink:0;}
.tb-live-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
.sb-header{padding:1.25rem 1.25rem 0.5rem;display:flex;align-items:center;justify-content:space-between;}
.sb-brand-row{display:flex;align-items:center;gap:10px}
.sb-logo-img{width:36px;height:36px;object-fit:contain;border-radius:8px}
.sb-brand-text .sb-name{font-size:1rem;font-weight:800;color:#fff}
.sb-brand-text .sb-name span{color:#4ade80}
.sb-brand-text .sb-sub{font-size:0.65rem;color:#4ade80;font-weight:600;text-transform:uppercase;letter-spacing:0.08em}
.sb-close-btn{background:rgba(255,255,255,0.08);border:none;cursor:pointer;width:32px;height:32px;border-radius:8px;display:none;align-items:center;justify-content:center;color:#9dc9ad;transition:background 0.15s;flex-shrink:0;}
.sb-close-btn:hover{background:rgba(255,255,255,0.15)}
.sb-system{margin:0.75rem 1.25rem 1rem;background:rgba(34,197,94,0.15);border:1px solid rgba(74,222,128,0.25);border-radius:12px;padding:0.75rem 1rem;display:flex;align-items:center;gap:10px;}
.sb-sys-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 8px rgba(34,197,94,0.5);flex-shrink:0}
.sb-sys-info .sb-sys-title{font-size:0.82rem;font-weight:700;color:#4ade80}
.sb-sys-info .sb-sys-sub{font-size:0.68rem;color:#86efac;margin-top:1px}
.sb-section-label{font-size:0.6rem;font-weight:700;color:#4a7c5a;text-transform:uppercase;letter-spacing:0.14em;padding:0.75rem 1.25rem 0.3rem;}
.sb-nav-group{display:flex;flex-direction:column;gap:2px;padding:0 0.75rem;margin-bottom:0.5rem}
.sb-item{display:flex;align-items:center;gap:10px;padding:0.65rem 0.75rem;border-radius:10px;cursor:pointer;border:none;background:none;width:100%;text-align:left;transition:all 0.15s;}
.sb-item:hover{background:rgba(255,255,255,0.06)}
.sb-item.active{background:rgba(34,197,94,0.18);border-left:3px solid #22c55e}
.sb-item-icon{width:20px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#9dc9ad}
.sb-item-label{font-size:0.88rem;font-weight:600;color:#9dc9ad}
.sb-item.active .sb-item-icon{color:#4ade80}
.sb-item.active .sb-item-label{color:#4ade80}
.sb-item:hover .sb-item-icon{color:#d1fae5}
.sb-item:hover .sb-item-label{color:#d1fae5}
.sb-badge{margin-left:auto;background:#ef4444;color:#fff;font-size:0.62rem;font-weight:800;padding:2px 7px;border-radius:50px}
.sb-foot{margin-top:auto;border-top:1px solid rgba(255,255,255,0.08);padding:1rem 1.25rem;display:flex;align-items:center;gap:10px;}
.sb-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#22c55e,#16a34a);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;flex-shrink:0}
.sb-user-info .sb-user-name{font-size:0.85rem;font-weight:700;color:#fff}
.sb-user-info .sb-user-role{font-size:0.68rem;color:#4ade80;font-weight:500}
.sb-logout-btn{margin-left:auto;background:none;border:none;cursor:pointer;color:#6b9e7a;transition:color 0.2s;padding:4px;display:flex;align-items:center}
.sb-logout-btn:hover{color:#ef4444}
.db-content{flex:1;padding:1.5rem 2rem;overflow-y:auto}
.page-header{margin-bottom:1.5rem}
.page-header h1{font-size:1.5rem;font-weight:800;color:#0d1f0f}
.page-header p{font-size:0.85rem;color:#6b7280;margin-top:3px}
.page-header-row{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem}
.live-badge{display:flex;align-items:center;gap:6px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:50px;padding:6px 14px;font-size:0.75rem;font-weight:700;color:#16a34a;white-space:nowrap;flex-shrink:0}
.live-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;animation:pulse 2s infinite}

/* ─── KPI GRID (desktop) ─────────────────────────────────────────────────── */
.kpi-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-bottom:1.5rem}
.kpi-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.5rem;position:relative;overflow:hidden;transition:box-shadow 0.2s}
.kpi-card:hover{box-shadow:0 4px 20px rgba(0,0,0,0.07)}
.kpi-accent{position:absolute;top:0;left:0;right:0;height:3px;border-radius:16px 16px 0 0}
.kpi-accent.green{background:#22c55e}
.kpi-accent.blue{background:#3b82f6}
.kpi-accent.amber{background:#f59e0b}
.kpi-accent.red{background:#ef4444}
.kpi-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;margin-top:0.5rem}
.kpi-icon-wrap{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;}
.kpi-icon-wrap.blue{background:#eff6ff;color:#2563eb}
.kpi-icon-wrap.green{background:#f0fdf4;color:#16a34a}
.kpi-icon-wrap.amber{background:#fffbeb;color:#d97706}
.kpi-icon-wrap.red{background:#fef2f2;color:#dc2626}
.kpi-trend{font-size:0.75rem;font-weight:700}
.kpi-trend.up{color:#16a34a}
.kpi-trend.down{color:#ef4444}
.kpi-value{font-size:2rem;font-weight:800;color:#0d1f0f;line-height:1;margin-bottom:0.25rem}
.kpi-label{font-size:0.82rem;font-weight:600;color:#374151;margin-bottom:2px}
.kpi-sub{font-size:0.72rem;color:#9ca3af}

/* ─── MOBILE KPI CARDS — screenshot style ─────────────────────────────────── */
/* These classes are used only on mobile, applied via the .mobile-kpi-grid wrapper */
.mobile-kpi-grid{display:none}

.chart-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.5rem;margin-bottom:1.25rem}
.chart-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1.25rem}
.chart-head-left h3{font-size:1rem;font-weight:700;color:#0d1f0f}
.chart-head-left p{font-size:0.75rem;color:#9ca3af;margin-top:2px}
.chart-icon{display:flex;align-items:center;color:#9ca3af}
.chart-legend{display:flex;gap:1.25rem;justify-content:center;margin-top:0.75rem;flex-wrap:wrap}
.legend-item{display:flex;align-items:center;gap:5px;font-size:0.75rem;color:#6b7280;font-weight:500}
.legend-dot{width:8px;height:8px;border-radius:50%}
.chart-svg{width:100%;overflow:visible}
.alerts-section{margin-bottom:1.25rem}
.alerts-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem}
.alerts-header h3{font-size:1rem;font-weight:700;color:#0d1f0f}
.alerts-header a{font-size:0.82rem;color:#22c55e;font-weight:700;text-decoration:none;cursor:pointer}
.alert-item{border-radius:14px;padding:1rem 1.25rem;margin-bottom:0.6rem;display:flex;align-items:flex-start;gap:12px;border:1px solid transparent;cursor:pointer;}
.alert-item.critical{background:#fef2f2;border-color:#fecaca}
.alert-item.warning{background:#fffbeb;border-color:#fde68a}
.alert-item.info{background:#f0fdf4;border-color:#bbf7d0}
.alert-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.alert-item.critical .alert-icon{background:#fee2e2;color:#dc2626}
.alert-item.warning .alert-icon{background:#fef3c7;color:#d97706}
.alert-item.info .alert-icon{background:#dcfce7;color:#16a34a}
.alert-text{flex:1;min-width:0}
.alert-title{font-size:0.88rem;font-weight:700;margin-bottom:2px}
.alert-item.critical .alert-title{color:#dc2626}
.alert-item.warning .alert-title{color:#d97706}
.alert-item.info .alert-title{color:#16a34a}
.alert-desc{font-size:0.78rem;color:#6b7280;line-height:1.5;margin-bottom:4px}
.alert-meta{font-size:0.7rem;color:#9ca3af;display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.alert-meta-icon{display:flex;align-items:center;gap:3px}
.alert-badge{font-size:0.72rem;font-weight:700;padding:3px 10px;border-radius:50px;white-space:nowrap;flex-shrink:0;display:flex;align-items:center;gap:4px}
.alert-badge.critical{background:#fee2e2;color:#dc2626}
.alert-badge.warning{background:#fef3c7;color:#d97706}
.alert-badge.info{background:#dcfce7;color:#16a34a}
.alert-expand{padding:0.75rem 1.25rem;border-radius:0 0 12px 12px;margin-top:-0.6rem;margin-bottom:0.6rem}
.alert-expand.warning{background:#fffbeb;border:1px solid #fde68a;border-top:none}
.alert-expand.critical{background:#fef2f2;border:1px solid #fecaca;border-top:none}
.alert-expand.info{background:#f0fdf4;border:1px solid #bbf7d0;border-top:none}
.alert-expand-text{font-size:0.82rem;color:#d97706;margin-bottom:0.75rem;font-weight:500}
.alert-expand-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1rem}
.aeg-label{font-size:0.65rem;color:#9ca3af;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:2px}
.aeg-val{font-size:0.82rem;font-weight:700;color:#d97706}
.alert-actions{display:flex;gap:0.5rem;flex-wrap:wrap}
.btn-take-action{padding:8px 18px;border-radius:50px;border:none;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-size:0.82rem;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif}
.btn-dismiss{padding:8px 18px;border-radius:50px;border:1.5px solid #d1d5db;background:#fff;color:#374151;font-size:0.82rem;font-weight:600;cursor:pointer;font-family:'Manrope',sans-serif}
.sensors-section{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.5rem;margin-bottom:1.25rem}
.sensors-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem}
.sensors-head h3{font-size:1rem;font-weight:700;color:#0d1f0f}
.sensors-head a{font-size:0.82rem;color:#22c55e;font-weight:700;text-decoration:none;cursor:pointer}
.sensor-row{display:flex;align-items:center;padding:0.7rem 0;border-bottom:1px solid #f3f4f6;cursor:pointer}
.sensor-row:last-child{border-bottom:none}
.sensor-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;margin-right:12px}
.sensor-dot.online{background:#22c55e;box-shadow:0 0 6px rgba(34,197,94,0.5)}
.sensor-dot.warning{background:#f59e0b}
.sensor-dot.offline{background:#9ca3af}
.sensor-info{flex:1;min-width:0}
.sensor-name{font-size:0.88rem;font-weight:700;color:#0d1f0f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sensor-loc{font-size:0.72rem;color:#9ca3af;display:flex;align-items:center;gap:3px;margin-top:1px}
.sensor-val{font-size:0.95rem;font-weight:800;color:#374151;flex-shrink:0;margin-left:0.5rem}
.fields-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem}
.field-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden}
.field-card-accent{height:4px}
.field-card-accent.green{background:#22c55e}
.field-card-accent.blue{background:#3b82f6}
.field-card-accent.red{background:#ef4444}
.field-card-accent.amber{background:#f59e0b}
.field-card-body{padding:1.25rem}
.field-card-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:0.75rem}
.field-card-icon-wrap{width:44px;height:44px;border-radius:12px;background:#f0fdf4;display:flex;align-items:center;justify-content:center;color:#16a34a;flex-shrink:0}
.field-card-meta{flex:1;margin-left:10px;min-width:0}
.field-name{font-size:1rem;font-weight:700;color:#0d1f0f}
.field-loc{font-size:0.72rem;color:#9ca3af;display:flex;align-items:center;gap:3px;margin-top:1px}
.field-more{background:none;border:none;cursor:pointer;color:#9ca3af;display:flex;align-items:center;padding:0;flex-shrink:0}
.field-tags{display:flex;gap:0.5rem;margin-bottom:1rem;flex-wrap:wrap}
.field-tag{font-size:0.72rem;font-weight:700;padding:3px 10px;border-radius:50px;border:1.5px solid}
.field-tag.healthy{background:#f0fdf4;color:#16a34a;border-color:#bbf7d0}
.field-tag.needs-water{background:#eff6ff;color:#2563eb;border-color:#bfdbfe}
.field-tag.at-risk{background:#fef2f2;color:#dc2626;border-color:#fecaca}
.field-tag.crop{background:#f9fafb;color:#374151;border-color:#e5e7eb}
.field-tag.area{background:#f5f3ff;color:#7c3aed;border-color:#ddd6fe}
.field-readings{display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin-bottom:1rem}
.field-reading{background:#f9fafb;border-radius:10px;padding:0.6rem;text-align:center}
.field-reading-icon{display:flex;justify-content:center;margin-bottom:3px}
.field-reading-val{font-size:0.92rem;font-weight:800}
.field-reading-val.blue{color:#2563eb}
.field-reading-val.amber{color:#d97706}
.field-reading-val.green{color:#16a34a}
.field-reading-key{font-size:0.65rem;color:#9ca3af;margin-top:1px}
.field-health-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.4rem}
.field-health-label{font-size:0.75rem;color:#6b7280;font-weight:500}
.field-health-pct{font-size:0.82rem;font-weight:800;color:#374151}
.field-bar{height:6px;background:#f3f4f6;border-radius:50px;overflow:hidden}
.field-bar-fill{height:100%;border-radius:50px;transition:width 0.5s ease}
.btn-add-field{display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:50px;border:none;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-size:0.82rem;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif;box-shadow:0 4px 12px rgba(34,197,94,0.3)}
.sensors-status-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.25rem}
.status-card{border-radius:14px;padding:1.25rem;display:flex;align-items:center;gap:12px}
.status-card.online-card{background:#f0fdf4;border:1px solid #bbf7d0}
.status-card.warning-card{background:#fffbeb;border:1px solid #fde68a}
.status-card.offline-card{background:#f9fafb;border:1px solid #e5e7eb}
.status-card-icon{display:flex;align-items:center;justify-content:center}
.status-card-num{font-size:1.8rem;font-weight:800}
.status-card.online-card .status-card-icon{color:#16a34a}
.status-card.online-card .status-card-num{color:#16a34a}
.status-card.warning-card .status-card-icon{color:#d97706}
.status-card.warning-card .status-card-num{color:#d97706}
.status-card.offline-card .status-card-icon{color:#6b7280}
.status-card.offline-card .status-card-num{color:#6b7280}
.status-card-label{font-size:0.78rem;font-weight:600;color:#6b7280}
.search-filter-row{display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:0.75rem 1rem;flex-wrap:wrap}
.search-input-wrap{flex:1;min-width:140px;display:flex;align-items:center;gap:8px}
.search-input-wrap input{border:none;outline:none;font-size:0.88rem;font-family:'Manrope',sans-serif;color:#374151;background:none;width:100%}
.search-input-wrap input::placeholder{color:#9ca3af}
.filter-divider{width:1px;height:24px;background:#e5e7eb}
.filter-btns{display:flex;gap:0.5rem;flex-wrap:wrap}
.filter-btn{padding:5px 12px;border-radius:50px;border:1.5px solid #e5e7eb;background:#fff;font-size:0.78rem;font-weight:600;cursor:pointer;color:#6b7280;font-family:'Manrope',sans-serif;transition:all 0.15s}
.filter-btn.active{background:#22c55e;border-color:#22c55e;color:#fff}
.type-filter-row{display:flex;gap:0.5rem;margin-bottom:1.25rem;flex-wrap:wrap}
.type-btn{padding:6px 14px;border-radius:50px;border:1.5px solid #e5e7eb;background:#fff;font-size:0.78rem;font-weight:600;cursor:pointer;color:#374151;font-family:'Manrope',sans-serif;transition:all 0.15s}
.type-btn.active{border-color:#22c55e;color:#22c55e;background:#f0fdf4}
.sensors-cards-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem}
.sensor-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.25rem;cursor:pointer}
.sensor-card-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:0.75rem}
.sensor-card-icon{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;}
.sensor-card-icon.blue{background:#eff6ff;color:#2563eb}
.sensor-card-icon.amber{background:#fffbeb;color:#d97706}
.sensor-card-icon.teal{background:#f0fdfa;color:#0d9488}
.sensor-card-icon.purple{background:#faf5ff;color:#7c3aed}
.sensor-status-badge{font-size:0.7rem;font-weight:700;padding:3px 10px;border-radius:50px;display:flex;align-items:center;gap:4px}
.sensor-status-badge.online{background:#f0fdf4;color:#16a34a}
.sensor-status-badge.warning{background:#fffbeb;color:#d97706}
.sensor-status-badge.offline{background:#f9fafb;color:#6b7280}
.sensor-status-dot{width:6px;height:6px;border-radius:50%}
.sensor-status-badge.online .sensor-status-dot{background:#22c55e}
.sensor-status-badge.warning .sensor-status-dot{background:#f59e0b}
.sensor-status-badge.offline .sensor-status-dot{background:#9ca3af}
.sensor-card-name{font-size:0.95rem;font-weight:700;color:#0d1f0f;margin-bottom:1px}
.sensor-card-id{font-size:0.7rem;color:#9ca3af;font-weight:500}
.sensor-card-val{font-size:1.75rem;font-weight:800;color:#0d1f0f;margin:0.5rem 0 0.1rem}
.sensor-card-type{font-size:0.78rem;font-weight:600}
.sensor-card-type.blue{color:#2563eb}
.sensor-card-type.amber{color:#d97706}
.sensor-card-type.teal{color:#0d9488}
.sensor-card-foot{display:flex;align-items:center;justify-content:space-between;margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid #f3f4f6;flex-wrap:wrap;gap:0.25rem}
.sensor-foot-item{display:flex;align-items:center;gap:4px;font-size:0.72rem;color:#6b7280}
.analytics-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1.5rem;gap:1rem;flex-wrap:wrap}
.time-btns{display:flex;gap:0.4rem;flex-wrap:wrap}
.time-btn{padding:6px 12px;border-radius:50px;border:1.5px solid #e5e7eb;background:#fff;font-size:0.75rem;font-weight:600;cursor:pointer;color:#6b7280;font-family:'Manrope',sans-serif;transition:all 0.15s}
.time-btn.active{background:#22c55e;border-color:#22c55e;color:#fff}
.export-btn{display:flex;align-items:center;gap:6px;padding:6px 14px;border-radius:50px;border:1.5px solid #e5e7eb;background:#fff;font-size:0.78rem;font-weight:600;cursor:pointer;color:#374151;font-family:'Manrope',sans-serif;transition:all 0.15s}
.export-btn:hover{border-color:#22c55e;color:#16a34a}
.analytics-kpi-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-bottom:1.25rem}
.a-kpi{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:1.25rem 1.5rem}
.a-kpi-head{display:flex;align-items:center;gap:8px;margin-bottom:0.75rem;color:#6b7280}
.a-kpi-name{font-size:0.82rem;font-weight:600;color:#6b7280}
.a-kpi-val{font-size:1.8rem;font-weight:800;color:#0d1f0f;margin-bottom:2px}
.a-kpi-change{font-size:0.75rem;font-weight:600}
.a-kpi-change.pos{color:#16a34a}
.a-kpi-change.neg{color:#ef4444}
.data-table{width:100%;border-collapse:collapse}
.data-table th{font-size:0.7rem;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;padding:0.6rem 0.75rem;text-align:left;border-bottom:1px solid #f3f4f6}
.data-table td{padding:0.85rem 0.75rem;font-size:0.88rem;color:#374151;border-bottom:1px solid #f9fafb}
.data-table tr:last-child td{border-bottom:none}
.td-moisture{color:#16a34a;font-weight:700}
.td-temp{color:#d97706;font-weight:700}
.td-rain{color:#7c3aed;font-weight:700}
.td-zero{color:#d1d5db}
.alert-tab-row{display:flex;gap:0.5rem;margin-bottom:1.25rem;flex-wrap:wrap}
.alert-tab{padding:6px 14px;border-radius:50px;border:1.5px solid #e5e7eb;background:#fff;font-size:0.78rem;font-weight:700;cursor:pointer;color:#374151;font-family:'Manrope',sans-serif;display:flex;align-items:center;gap:5px;transition:all 0.15s}
.alert-tab.active{background:#22c55e;border-color:#22c55e;color:#fff}
.alert-tab-count{font-size:0.7rem;font-weight:800}
.settings-layout{display:grid;grid-template-columns:200px 1fr;gap:1.5rem}
.settings-nav{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:0.75rem;height:fit-content}
.settings-nav-item{display:flex;align-items:center;gap:8px;padding:0.65rem 0.75rem;border-radius:10px;cursor:pointer;font-size:0.85rem;font-weight:600;color:#6b7280;transition:all 0.15s;border:none;background:none;width:100%;text-align:left}
.settings-nav-item:hover{background:#f9fafb;color:#0d1f0f}
.settings-nav-item.active{background:#f0fdf4;color:#16a34a}
.settings-nav-item-icon{display:flex;align-items:center;flex-shrink:0}
.settings-panel{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.75rem}
.settings-profile-head{display:flex;align-items:center;gap:1rem;margin-bottom:2rem}
.settings-avatar{width:72px;height:72px;border-radius:20px;background:linear-gradient(135deg,#22c55e,#16a34a);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:#fff;flex-shrink:0}
.settings-avatar-info h3{font-size:1rem;font-weight:800;color:#0d1f0f}
.settings-avatar-info p{font-size:0.78rem;color:#6b7280}
.settings-avatar-info a{font-size:0.78rem;color:#22c55e;font-weight:700;text-decoration:none;cursor:pointer}
.settings-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.settings-field label{display:block;font-size:0.78rem;font-weight:700;color:#374151;margin-bottom:0.4rem}
.settings-field input,.settings-field select{width:100%;padding:0.7rem 1rem;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.88rem;font-family:'Manrope',sans-serif;color:#0d1f0f;background:#fafafa;outline:none;transition:border-color 0.2s}
.settings-field input:focus,.settings-field select:focus{border-color:#22c55e;background:#fff}
.btn-save{padding:10px 24px;border:none;border-radius:10px;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-size:0.88rem;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif;margin-top:1.25rem;box-shadow:0 4px 14px rgba(34,197,94,0.3)}
.save-success{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:8px 14px;font-size:0.82rem;color:#16a34a;font-weight:600;margin-top:0.75rem;display:inline-block}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:600;display:flex;align-items:center;justify-content:center;padding:1rem;}
.modal-box{background:#fff;border-radius:20px;width:100%;max-width:480px;padding:1.75rem;box-shadow:0 20px 50px rgba(0,0,0,0.25);animation:modalIn 0.25s ease;max-height:90vh;overflow-y:auto;}
@keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(16px)}to{opacity:1;transform:none}}
.modal-title{font-size:1.1rem;font-weight:800;color:#0d1f0f;margin-bottom:1.25rem;display:flex;align-items:center;justify-content:space-between}
.modal-close{background:none;border:1px solid #e5e7eb;border-radius:50%;width:30px;height:30px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;color:#6b7280;flex-shrink:0}
.modal-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem}
.modal-field label{display:block;font-size:0.75rem;font-weight:700;color:#374151;margin-bottom:0.3rem}
.modal-field input,.modal-field select{width:100%;padding:0.65rem 0.85rem;border:1.5px solid #e5e7eb;border-radius:9px;font-size:0.85rem;font-family:'Manrope',sans-serif;background:#fafafa;outline:none}
.modal-field input:focus,.modal-field select:focus{border-color:#22c55e}
.modal-actions{display:flex;gap:0.6rem;margin-top:1rem}
.btn-modal-cancel{flex:1;padding:0.8rem;border:1.5px solid #e5e7eb;border-radius:10px;background:#fff;font-size:0.88rem;font-weight:600;cursor:pointer;font-family:'Manrope',sans-serif}
.btn-modal-save{flex:2;padding:0.8rem;border:none;border-radius:10px;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-size:0.88rem;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif}
.sensor-detail-modal{background:#fff;border-radius:20px;width:100%;max-width:420px;padding:1.75rem;box-shadow:0 20px 50px rgba(0,0,0,0.25);animation:modalIn 0.25s ease;max-height:90vh;overflow-y:auto;}
.db-toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#0d1f0f;color:#4ade80;padding:0.75rem 1.5rem;border-radius:50px;font-size:0.85rem;font-weight:700;z-index:700;box-shadow:0 8px 24px rgba(0,0,0,0.3);animation:toastIn 0.3s ease;white-space:nowrap}
@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%)}}
.no-results{text-align:center;padding:2.5rem;color:#9ca3af;font-size:0.9rem}

/* ─── TABLET ─────────────────────────────────────────────────────────────── */
@media(max-width:900px){
  .kpi-grid{grid-template-columns:repeat(2,1fr)}
  .fields-grid{grid-template-columns:1fr}
  .sensors-cards-grid{grid-template-columns:1fr}
  .analytics-kpi-grid{grid-template-columns:1fr}
  .settings-layout{grid-template-columns:1fr}
  .settings-form-grid{grid-template-columns:1fr}
  .alert-expand-grid{grid-template-columns:1fr}
}

/* ─── MOBILE ─────────────────────────────────────────────────────────────── */
@media(max-width:768px){
  /* Sidebar */
  .sb{transform:translateX(-100%);width:280px;box-shadow:4px 0 30px rgba(0,0,0,0.2);z-index:300}
  .sb.mobile-open{transform:translateX(0)}
  .sb-overlay{display:block}
  .sb-overlay.hidden{display:none}
  .sb-close-btn{display:flex!important}

  /* Main layout */
  .db-main{margin-left:0!important}
  .tb-hamburger{display:flex}
  .tb-search{display:none}
  .tb-time{display:none}
  .tb-live{display:none}
  .tb-user-name{display:none}

  /* Topbar slim */
  .topbar{padding:0 0.875rem;height:56px}

  /* Content */
  .db-content{padding:0.875rem}

  /* Page header */
  .page-header h1{font-size:1.2rem}
  .page-header-row{flex-direction:column;gap:0.5rem}
  .live-badge{align-self:flex-start}

  /* ── Screenshot-style KPI: hide desktop grid, show mobile cards ── */
  .kpi-grid{display:none}
  .mobile-kpi-grid{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:0.75rem;
    margin-bottom:1rem;
  }
  .m-kpi-card{
    border-radius:20px;
    padding:1rem 1rem 0.875rem;
    display:flex;
    align-items:center;
    gap:12px;
    position:relative;
    overflow:hidden;
    box-shadow:0 2px 12px rgba(0,0,0,0.06);
    border:1px solid transparent;
    min-height:90px;
  }
  .m-kpi-card.card-temp{background:#fff8f0;border-color:#fed7aa}
  .m-kpi-card.card-moisture{background:#f0f7ff;border-color:#bfdbfe}
  .m-kpi-card.card-sensors{background:#f0fdf4;border-color:#bbf7d0}
  .m-kpi-card.card-alerts{background:#fff5f5;border-color:#fecaca}
  .m-kpi-icon{
    width:44px;height:44px;border-radius:14px;
    display:flex;align-items:center;justify-content:center;flex-shrink:0;
  }
  .m-kpi-card.card-temp .m-kpi-icon{background:#fff;color:#f97316}
  .m-kpi-card.card-moisture .m-kpi-icon{background:#fff;color:#3b82f6}
  .m-kpi-card.card-sensors .m-kpi-icon{background:#fff;color:#22c55e}
  .m-kpi-card.card-alerts .m-kpi-icon{background:#fff;color:#ef4444}
  .m-kpi-body{flex:1;min-width:0}
  .m-kpi-value{font-size:1.35rem;font-weight:800;line-height:1;margin-bottom:3px}
  .m-kpi-card.card-temp .m-kpi-value{color:#ea580c}
  .m-kpi-card.card-moisture .m-kpi-value{color:#2563eb}
  .m-kpi-card.card-sensors .m-kpi-value{color:#16a34a}
  .m-kpi-card.card-alerts .m-kpi-value{color:#dc2626}
  .m-kpi-label{font-size:0.68rem;font-weight:600;color:#6b7280;line-height:1.3}
  .m-kpi-trend{font-size:0.62rem;font-weight:700;margin-top:3px}
  .m-kpi-trend.up{color:#16a34a}
  .m-kpi-trend.down{color:#ef4444}

  /* Charts */
  .chart-card{padding:1rem;border-radius:14px}
  .chart-head-left h3{font-size:0.92rem}
  .chart-head-left p{font-size:0.7rem}

  /* Sensor status: 3 cols compact */
  .sensors-status-grid{grid-template-columns:repeat(3,1fr);gap:0.625rem}
  .status-card{padding:0.75rem 0.5rem;flex-direction:column;text-align:center;gap:4px}
  .status-card-num{font-size:1.4rem}
  .status-card-label{font-size:0.68rem}

  /* Fields grid: 1 col */
  .fields-grid{grid-template-columns:1fr}

  /* Sensor cards: 1 col */
  .sensors-cards-grid{grid-template-columns:1fr}

  /* Analytics KPI */
  .analytics-kpi-grid{grid-template-columns:repeat(2,1fr)}

  /* Settings */
  .settings-layout{grid-template-columns:1fr}
  .settings-form-grid{grid-template-columns:1fr}

  /* Alert expand grid */
  .alert-expand-grid{grid-template-columns:1fr}

  /* Table */
  .data-table th,.data-table td{padding:0.5rem;font-size:0.75rem}

  /* Modals — bottom sheet */
  .modal-box,.sensor-detail-modal{
    max-width:100%;border-radius:20px 20px 0 0;
    position:fixed;bottom:0;left:0;right:0;
    padding:1.25rem;
    animation:sheetIn 0.3s ease
  }
  @keyframes sheetIn{from{transform:translateY(100%)}to{transform:none}}
  .modal-overlay{align-items:flex-end;padding:0}
  .modal-form-grid{grid-template-columns:1fr}

  /* Filter row compact */
  .search-filter-row{padding:0.6rem 0.75rem;gap:0.5rem}
  .filter-divider{display:none}
  .filter-btns{width:100%}

  /* Alert items */
  .alert-item{padding:0.875rem}
  .alert-badge{display:none}

  /* Toast */
  .db-toast{bottom:1rem;font-size:0.78rem;padding:0.6rem 1.1rem;max-width:90vw;white-space:normal;text-align:center}

  /* Sensors section bottom on overview */
  .sensors-section{border-radius:14px;padding:1rem}
  .alerts-section .alert-item{border-radius:12px}
}

/* ─── SMALL PHONE ─────────────────────────────────────────────────────────── */
@media(max-width:480px){
  .mobile-kpi-grid{grid-template-columns:1fr 1fr;gap:0.5rem}
  .m-kpi-card{min-height:80px;padding:0.875rem 0.75rem}
  .m-kpi-value{font-size:1.2rem}
  .m-kpi-icon{width:38px;height:38px;border-radius:12px}
  .sensors-status-grid{grid-template-columns:repeat(3,1fr)}
  .analytics-kpi-grid{grid-template-columns:1fr}
  .alert-expand-grid{grid-template-columns:1fr}
  .sensor-card-val{font-size:1.4rem}
  .time-btns{gap:0.25rem}
  .time-btn{padding:5px 10px;font-size:0.7rem}
  .field-readings{grid-template-columns:repeat(3,1fr);gap:0.35rem}
  .field-reading{padding:0.45rem}
  .field-reading-val{font-size:0.82rem}
}
`

// ─── CHART COMPONENTS ────────────────────────────────────────────────────────
function LineChart({ datasets, labels, height = 160, yMin, yMax }) {
  const W=700,H=height,PL=40,PR=10,PT=10,PB=30
  const cw=W-PL-PR,ch=H-PT-PB
  const lo=yMin??Math.min(...datasets.flatMap(d=>d.data))
  const hi=yMax??Math.max(...datasets.flatMap(d=>d.data))
  const range=hi-lo||1
  const xs=labels.map((_,i)=>PL+(i/(labels.length-1))*cw)
  const ys=(data)=>data.map(v=>PT+(1-(v-lo)/range)*ch)
  const path=(data)=>xs.map((x,i)=>`${i===0?'M':'L'}${x},${ys(data)[i]}`).join(' ')
  const area=(data)=>{const y=ys(data);return `${xs.map((x,i)=>`${i===0?'M':'L'}${x},${y[i]}`).join(' ')} L${xs[xs.length-1]},${PT+ch} L${xs[0]},${PT+ch} Z`}
  const yTicks=[lo,lo+range*.25,lo+range*.5,lo+range*.75,hi].map(v=>Math.round(v))
  return(
    <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" style={{height}}>
      <defs>{datasets.map((d,i)=><linearGradient key={i} id={`lg${i}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={d.color} stopOpacity="0.15"/><stop offset="100%" stopColor={d.color} stopOpacity="0"/></linearGradient>)}</defs>
      {yTicks.map((t,i)=>{const y=PT+(1-(t-lo)/range)*ch;return<g key={i}><line x1={PL} y1={y} x2={W-PR} y2={y} stroke="#f3f4f6" strokeWidth="1"/><text x={PL-5} y={y+4} fontSize="10" fill="#9ca3af" textAnchor="end">{t}</text></g>})}
      {labels.map((l,i)=><text key={i} x={xs[i]} y={H-5} fontSize="10" fill="#9ca3af" textAnchor="middle">{l}</text>)}
      {datasets.map((d,i)=><g key={i}><path d={area(d.data)} fill={`url(#lg${i})`}/><path d={path(d.data)} fill="none" stroke={d.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={d.dashed?'6,4':undefined}/>{d.data.map((v,j)=>j%2===0&&<circle key={j} cx={xs[j]} cy={ys(d.data)[j]} r="3.5" fill={d.color}/>)}</g>)}
    </svg>
  )
}

function RadarChart({ datasets, labels }) {
  const cx=200,cy=200,R=140,N=labels.length
  const angle=(i)=>(i/N)*2*Math.PI-Math.PI/2
  const pt=(i,r)=>[cx+r*Math.cos(angle(i)),cy+r*Math.sin(angle(i))]
  const poly=(vals)=>vals.map((v,i)=>pt(i,(v/100)*R).join(',')).join(' ')
  return(
    <svg viewBox="0 0 400 400" style={{width:'100%',maxWidth:360,margin:'0 auto',display:'block'}}>
      {[.2,.4,.6,.8,1].map((r,i)=><polygon key={i} points={labels.map((_,j)=>pt(j,r*R).join(',')).join(' ')} fill="none" stroke="#e5e7eb" strokeWidth="1"/>)}
      {labels.map((_,i)=>{const[x2,y2]=pt(i,R);return<line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke="#e5e7eb" strokeWidth="1"/>})}
      {datasets.map((d,di)=><polygon key={di} points={poly(d.data)} fill={d.color} fillOpacity="0.15" stroke={d.color} strokeWidth="2"/>)}
      {labels.map((l,i)=>{const[x,y]=pt(i,R+20);return<text key={i} x={x} y={y} fontSize="11" fill="#6b7280" textAnchor="middle" dominantBaseline="middle">{l}</text>})}
    </svg>
  )
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const moistureData={blida:[45,44,43,42,41,43,44],setif:[38,37,36,34,35,37,38],tiaret:[50,51,49,48,50,52,51]}
const logData=[{d:'Mon',m:45,t:28,h:64,r:0},{d:'Tue',m:42,t:30,h:60,r:0},{d:'Wed',m:38,t:33,h:55,r:0},{d:'Thu',m:35,t:31,h:58,r:2.4},{d:'Fri',m:40,t:29,h:62,r:0},{d:'Sat',m:44,t:27,h:67,r:0.8},{d:'Sun',m:42,t:28,h:65,r:0}]

const ALL_ALERTS=[
  {id:1,type:'critical',iconName:'moisture',title:'Critical: Soil Moisture Too Low',desc:'Soil moisture has dropped to 18% — well below the minimum threshold of 30%. Immediate irrigation required.',loc:'Sétif · Field Beta',time:'12 min ago',sensor:'S006 – Thermo Node T07',location:'Field Theta · Biskra',ts:'Today, 08:50 AM'},
  {id:2,type:'warning',iconName:'temp',title:'High Temperature Alert',desc:'Temperature sensor T-07 is reading 38.5°C, exceeding the safe threshold of 36°C.',loc:'Biskra · Field Theta',time:'45 min ago',sensor:'S006 – Thermo Node T07',location:'Field Theta · Biskra',ts:'Today, 08:50 AM'},
  {id:3,type:'warning',iconName:'battery',title:'Sensor S-12 battery below 20%',desc:'Sensor battery is critically low and may disconnect soon.',loc:'Tiaret',time:'1 hr ago',sensor:'S012',location:'Tiaret · Field Zeta',ts:'Today, 08:15 AM'},
  {id:4,type:'info',iconName:'check',title:'Irrigation cycle completed — Field Alpha, Blida',desc:'Scheduled irrigation ran successfully. Field moisture up to 45%.',loc:'Blida · Field Alpha',time:'2 hrs ago',sensor:'S002',location:'Blida · Field Alpha',ts:'Today, 07:00 AM'},
]

const ALL_SENSORS=[
  {id:'S001',name:'Soil Probe A1',type:'Moisture',val:'42%',loc:'Bouira',status:'online',iconName:'moisture',iconClass:'blue',valColor:'blue',battery:87,signal:95},
  {id:'S002',name:'Thermo Node B3',type:'Temperature',val:'31.4°C',loc:'Blida',status:'online',iconName:'temp',iconClass:'amber',valColor:'amber',battery:62,signal:88},
  {id:'S003',name:'Hygro Sensor C2',type:'Humidity',val:'68%',loc:'Tizi Ouzou',status:'warning',iconName:'sensors',iconClass:'teal',valColor:'teal',battery:21,signal:70},
  {id:'S004',name:'Rain Gauge D1',type:'Rainfall',val:'0 mm',loc:'Biskra',status:'online',iconName:'moisture',iconClass:'purple',valColor:'blue',battery:95,signal:91},
  {id:'S005',name:'Wind Sensor E2',type:'Wind',val:'14 km/h',loc:'Sétif',status:'online',iconName:'sensors',iconClass:'teal',valColor:'teal',battery:78,signal:85},
  {id:'S006',name:'Thermo Node T07',type:'Temperature',val:'38.5°C',loc:'Biskra',status:'warning',iconName:'temp',iconClass:'amber',valColor:'amber',battery:45,signal:72},
]

const ALL_FIELDS=[
  {name:'Field Alpha',loc:'Bouira',accent:'green',status:'healthy',crop:'Wheat',area:'24 ha',moisture:{v:'42%',c:'blue'},temp:{v:'28°C',c:'amber'},sensors:{v:'5',c:'green'},health:72},
  {name:'Field Beta',loc:'Blida',accent:'blue',status:'needs-water',crop:'Barley',area:'18 ha',moisture:{v:'30%',c:'blue'},temp:{v:'31°C',c:'amber'},sensors:{v:'4',c:'green'},health:55},
  {name:'Field Gamma',loc:'Biskra',accent:'red',status:'at-risk',crop:'Dates',area:'12 ha',moisture:{v:'18%',c:'blue'},temp:{v:'38°C',c:'amber'},sensors:{v:'3',c:'green'},health:32},
  {name:'Field Delta',loc:'Tiaret',accent:'amber',status:'healthy',crop:'Olive',area:'30 ha',moisture:{v:'55%',c:'blue'},temp:{v:'24°C',c:'amber'},sensors:{v:'6',c:'green'},health:88},
]

const navSectionsConfig = [
  {label:'Overview',items:[{key:'overview',iconName:'dashboard',label:'Dashboard'},{key:'fields',iconName:'fields',label:'My Fields'}]},
  {label:'Monitoring',items:[{key:'sensors',iconName:'sensors',label:'Sensors'},{key:'analytics',iconName:'analytics',label:'Analytics'}]},
  {label:'Manage',items:[{key:'alerts',iconName:'alerts',label:'Alerts'},{key:'settings',iconName:'settings',label:'Settings'}]},
]

const settingsNavConfig = [
  {key:'Profile',iconName:'user'},
  {key:'Notifications',iconName:'bell'},
  {key:'Security',iconName:'shield'},
  {key:'Devices & App',iconName:'sensors'},
  {key:'Preferences',iconName:'settings'},
]

export default function FarmerDashboard() {
  const {user,logout}=useAuth()
  const navigate=useNavigate()
  const [tab,setTab]=useState('overview')
  const [sidebarOpen,setSidebarOpen]=useState(false)
  const [userDropOpen,setUserDropOpen]=useState(false)
  const [now,setNow]=useState(new Date())
  const [alertFilter,setAlertFilter]=useState('All')
  const [expandedAlert,setExpandedAlert]=useState(null)
  const [dismissedAlerts,setDismissedAlerts]=useState([])
  const [sensorFilter,setSensorFilter]=useState('All')
  const [sensorType,setSensorType]=useState('All Types')
  const [sensorSearch,setSensorSearch]=useState('')
  const [globalSearch,setGlobalSearch]=useState('')
  const [analyticsTime,setAnalyticsTime]=useState('7 Days')
  const [settingsTab,setSettingsTab]=useState('Profile')
  const [savedSettings,setSavedSettings]=useState(false)
  const [refreshing,setRefreshing]=useState(false)
  const [lastRefreshed,setLastRefreshed]=useState(new Date())
  const [showAddField,setShowAddField]=useState(false)
  const [fields,setFields]=useState(ALL_FIELDS)
  const [newField,setNewField]=useState({name:'',loc:'',crop:'',area:''})
  const [fieldSearch,setFieldSearch]=useState('')
  const [selectedSensor,setSelectedSensor]=useState(null)
  const [toast,setToast]=useState('')
  const dropRef=useRef(null)

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(''),2500) }

  useEffect(()=>{const id=setInterval(()=>setNow(new Date()),60000);return()=>clearInterval(id)},[])
  useEffect(()=>{
    const handler=(e)=>{if(dropRef.current&&!dropRef.current.contains(e.target))setUserDropOpen(false)}
    document.addEventListener('mousedown',handler)
    return()=>document.removeEventListener('mousedown',handler)
  },[])

  const handleTabChange=(key)=>{setTab(key);if(window.innerWidth<=768)setSidebarOpen(false)}
  const handleRefresh=()=>{
    setRefreshing(true)
    setTimeout(()=>{setLastRefreshed(new Date());setRefreshing(false);showToast('✅ Dashboard refreshed')},800)
  }
  const handleExport=()=>{
    const rows=[['Day','Moisture (%)','Temp (°C)','Humidity (%)','Rainfall (mm)'],...logData.map(r=>[r.d,r.m,r.t,r.h,r.r])]
    const csv=rows.map(r=>r.join(',')).join('\n')
    const blob=new Blob([csv],{type:'text/csv'})
    const url=URL.createObjectURL(blob)
    const a=document.createElement('a');a.href=url;a.download='agrisense-data.csv';a.click()
    showToast('✅ Data exported as CSV')
  }
  const handleDismissAlert=(id,e)=>{e.stopPropagation();setDismissedAlerts(d=>[...d,id]);showToast('Alert dismissed')}
  const handleTakeAction=(alert,e)=>{e.stopPropagation();showToast(`Action taken for: ${alert.title.slice(0,30)}…`)}
  const addField=()=>{
    if(!newField.name||!newField.loc) return
    const f={name:newField.name,loc:newField.loc,accent:'green',status:'healthy',crop:newField.crop||'—',area:newField.area||'0 ha',moisture:{v:'N/A',c:'blue'},temp:{v:'N/A',c:'amber'},sensors:{v:'0',c:'green'},health:50}
    setFields(prev=>[...prev,f]);setNewField({name:'',loc:'',crop:'',area:''});setShowAddField(false);showToast(`✅ Field "${f.name}" added`)
  }

  const firstName=user?.firstName||'Farmer'
  const lastName=user?.lastName||''
  const initials=`${firstName[0]}${lastName[0]||''}`
  const hour=now.getHours()
  const greeting=hour<12?'Good morning':hour<18?'Good afternoon':'Good evening'
  const timeStr=now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})

  const activeAlerts=ALL_ALERTS.filter(a=>!dismissedAlerts.includes(a.id))
  const alertTabs=['All','Critical','Warning','Info']
  const alertCounts={All:activeAlerts.length,Critical:activeAlerts.filter(a=>a.type==='critical').length,Warning:activeAlerts.filter(a=>a.type==='warning').length,Info:activeAlerts.filter(a=>a.type==='info').length}

  const filteredSensors=useMemo(()=>{
    let s=ALL_SENSORS
    if(sensorFilter!=='All') s=s.filter(x=>x.status===sensorFilter.toLowerCase())
    if(sensorType!=='All Types') s=s.filter(x=>x.type===sensorType)
    if(sensorSearch) s=s.filter(x=>x.name.toLowerCase().includes(sensorSearch.toLowerCase())||x.loc.toLowerCase().includes(sensorSearch.toLowerCase())||x.id.toLowerCase().includes(sensorSearch.toLowerCase()))
    return s
  },[sensorFilter,sensorType,sensorSearch])

  const filteredFields=useMemo(()=>{
    if(!fieldSearch) return fields
    return fields.filter(f=>f.name.toLowerCase().includes(fieldSearch.toLowerCase())||f.loc.toLowerCase().includes(fieldSearch.toLowerCase())||f.crop.toLowerCase().includes(fieldSearch.toLowerCase()))
  },[fields,fieldSearch])

  const filteredAlerts=useMemo(()=>{
    let a=activeAlerts
    if(alertFilter!=='All') a=a.filter(x=>x.type===alertFilter.toLowerCase())
    return a
  },[activeAlerts,alertFilter])

  const handleGlobalSearch=(e)=>{
    const v=e.target.value;setGlobalSearch(v)
    if(!v) return
    const lower=v.toLowerCase()
    if(['sensor','moisture','temp','humidity','rain','wind'].some(k=>lower.includes(k))) setTab('sensors')
    else if(['field','wheat','barley','olive','date'].some(k=>lower.includes(k))) setTab('fields')
    else if(['alert','critical','warning'].some(k=>lower.includes(k))) setTab('alerts')
    else if(['analytics','chart','data'].some(k=>lower.includes(k))) setTab('analytics')
  }

  const [settingsForm,setSettingsForm]=useState({
    fullName:`${firstName} ${lastName}`,
    email:`${firstName.toLowerCase()}@farm.dz`,
    phone:'+213 XXX XXX XXX',
    farmName:'Ferme',
    farmSize:'80',
    wilaya:'10 – Bouira'
  })

  const currentPageLabel=navSectionsConfig.flatMap(s=>s.items).find(i=>i.key===tab)?.label||'Dashboard'
  const criticalBadge=activeAlerts.filter(a=>a.type==='critical').length||undefined

  // Mobile KPI data (same content as desktop, just restructured for mobile cards)
  const mobileKpiCards = [
    {cls:'card-temp',iconName:'temp',val:'31.4°C',label:'Avg. Temperature',trend:'↗ 2%',dir:'up'},
    {cls:'card-moisture',iconName:'moisture',val:'43%',label:'Avg. Soil Moisture',trend:'↘ 3%',dir:'down'},
    {cls:'card-sensors',iconName:'sensor_kpi',val:ALL_SENSORS.length,label:'Active Sensors',trend:'↗ 8%',dir:'up'},
    {cls:'card-alerts',iconName:'warning',val:activeAlerts.filter(a=>a.type==='critical').length,label:'Active Alerts',trend:'↘ 1%',dir:'down'},
  ]

  return(
    <>
      <style>{S}</style>
      <div className="db">
        <div className={`sb-overlay${sidebarOpen?'':' hidden'}`} onClick={()=>setSidebarOpen(false)}/>

        <aside className={`sb${sidebarOpen?' mobile-open':''}`}>
          <div className="sb-header">
            <div className="sb-brand-row">
              <img src={logoo} alt="logo" className="sb-logo-img"/>
              <div className="sb-brand-text">
                <div className="sb-name">Agri<span>Sense</span></div>
                <div className="sb-sub">DZ Platform</div>
              </div>
            </div>
            <button className="sb-close-btn" onClick={()=>setSidebarOpen(false)}><Ic name="close" size={14}/></button>
          </div>
          <div className="sb-system">
            <div className="sb-sys-dot"/>
            <div className="sb-sys-info">
              <div className="sb-sys-title">System Live</div>
              <div className="sb-sys-sub">{ALL_SENSORS.filter(s=>s.status==='online').length}/{ALL_SENSORS.length} sensors active</div>
            </div>
          </div>
          {navSectionsConfig.map(section=>(
            <div key={section.label}>
              <div className="sb-section-label">{section.label}</div>
              <div className="sb-nav-group">
                {section.items.map(n=>(
                  <button key={n.key} className={`sb-item${tab===n.key?' active':''}`} onClick={()=>handleTabChange(n.key)}>
                    <span className="sb-item-icon"><Ic name={n.iconName} size={16}/></span>
                    <span className="sb-item-label">{n.label}</span>
                    {n.key==='alerts'&&criticalBadge>0&&<span className="sb-badge">{criticalBadge}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="sb-foot">
            <div className="sb-avatar">{initials}</div>
            <div className="sb-user-info">
              <div className="sb-user-name">{firstName} {lastName}</div>
              <div className="sb-user-role">Farmer Pro</div>
            </div>
            <button className="sb-logout-btn" title="Logout" onClick={()=>{logout();navigate('/')}}><Ic name="logout" size={18}/></button>
          </div>
        </aside>

        <div className="db-main">
          <div className="topbar">
            <div style={{display:'flex',alignItems:'center',gap:'10px',minWidth:0,flex:1}}>
              <button className="tb-hamburger" onClick={()=>setSidebarOpen(o=>!o)}><Ic name="menu" size={20}/></button>
              <div className="tb-breadcrumb" style={{minWidth:0}}>
                <span className="tb-brand">AgriSense DZ</span>
                <span className="tb-sep">›</span>
                <span className="tb-page">{currentPageLabel}</span>
              </div>
            </div>
            <div className="tb-search">
              <Ic name="search" size={14} style={{color:'#9ca3af',flexShrink:0}}/>
              <input placeholder="Search sensors, fields, alerts..." value={globalSearch} onChange={handleGlobalSearch} onKeyDown={e=>{if(e.key==='Escape')setGlobalSearch('')}}/>
            </div>
            <div className="tb-actions">
              <span className="tb-time">{timeStr}</span>
              <button className="tb-icon-btn" title="Refresh" onClick={handleRefresh}
                style={{transform:refreshing?'rotate(360deg)':'none',transition:'transform 0.5s ease'}} disabled={refreshing}>
                <Ic name="refresh" size={16}/>
              </button>
              <button className="tb-icon-btn" title="Notifications" onClick={()=>handleTabChange('alerts')}>
                <Ic name="bell" size={16}/>
                {activeAlerts.filter(a=>a.type==='critical').length>0&&<span className="tb-notif-dot"/>}
              </button>
              {tab==='overview'&&(
                <div className="tb-live">
                  <span className="tb-live-dot"/>Live
                </div>
              )}
              <div style={{position:'relative'}} ref={dropRef}>
                <button className="tb-user-btn" onClick={()=>setUserDropOpen(o=>!o)}>
                  <div className="tb-user-av">{initials}</div>
                  <span className="tb-user-name">{firstName}</span>
                  <Ic name={userDropOpen?'chevronUp':'chevronDown'} size={10} style={{color:'#16a34a'}}/>
                </button>
                {userDropOpen&&(
                  <div className="user-dropdown">
                    <div className="ud-header">
                      <div className="ud-name">{firstName} {lastName}</div>
                      <div className="ud-role">Farmer Pro · {user?.wilaya||'Bouira'}</div>
                    </div>
                    <button className="ud-item" onClick={()=>{setTab('settings');setUserDropOpen(false)}}><Ic name="user" size={15}/>Profile &amp; Settings</button>
                    <button className="ud-item" onClick={()=>navigate('/')}><Ic name="home" size={15}/>Back to Home</button>
                    <div className="ud-sep"/>
                    <button className="ud-item danger" onClick={()=>{logout();navigate('/')}}><Ic name="logout" size={15}/>Sign out</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="db-content">

            {/* OVERVIEW */}
            {tab==='overview'&&(<>
              <div className="page-header-row">
                <div className="page-header">
                  <h1>{greeting}, {firstName} </h1>
                  <p>Here's a summary of your farm operations today.</p>
                </div>
                <div className="live-badge"><span className="live-dot"/>Live</div>
              </div>

              {/* DESKTOP KPI GRID */}
              <div className="kpi-grid">
                {[
                  {iconName:'sensor_kpi',iconClass:'blue',accent:'green',val:ALL_SENSORS.length,label:'Active Sensors',sub:`${ALL_SENSORS.filter(s=>s.status==='online').length} online · ${ALL_SENSORS.filter(s=>s.status==='offline').length} offline`,trend:'↗ 8%',dir:'up'},
                  {iconName:'moisture',iconClass:'blue',accent:'blue',val:'43%',label:'Avg. Soil Moisture',sub:'Optimal: 35–60%',trend:'↘ 3%',dir:'down'},
                  {iconName:'temp',iconClass:'amber',accent:'amber',val:'31.4°C',label:'Avg. Temperature',sub:'Across all field nodes',trend:'↗ 2%',dir:'up'},
                  {iconName:'warning',iconClass:'red',accent:'red',val:activeAlerts.filter(a=>a.type==='critical').length,label:'Active Alerts',sub:`${activeAlerts.filter(a=>a.type==='warning').length} warnings`,trend:'↘ 1%',dir:'down'},
                ].map((k,i)=>(
                  <div key={i} className="kpi-card">
                    <div className={`kpi-accent ${k.accent}`}/>
                    <div className="kpi-top">
                      <div className={`kpi-icon-wrap ${k.iconClass}`}><Ic name={k.iconName} size={20}/></div>
                      <span className={`kpi-trend ${k.dir}`}>{k.trend}</span>
                    </div>
                    <div className="kpi-value">{k.val}</div>
                    <div className="kpi-label">{k.label}</div>
                    <div className="kpi-sub">{k.sub}</div>
                  </div>
                ))}
              </div>

              {/* MOBILE KPI GRID — screenshot style */}
              <div className="mobile-kpi-grid">
                {mobileKpiCards.map((k,i)=>(
                  <div key={i} className={`m-kpi-card ${k.cls}`}>
                    <div className="m-kpi-icon"><Ic name={k.iconName} size={22}/></div>
                    <div className="m-kpi-body">
                      <div className="m-kpi-value">{k.val}</div>
                      <div className="m-kpi-label">{k.label}</div>
                      <div className={`m-kpi-trend ${k.dir}`}>{k.trend}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="chart-card">
                <div className="chart-head"><div className="chart-head-left"><h3>Soil Moisture — 7 Days</h3><p>By field region (%)</p></div><span className="chart-icon"><Ic name="moisture" size={20}/></span></div>
                <LineChart datasets={[{data:moistureData.blida,color:'#16a34a'},{data:moistureData.setif,color:'#06b6d4'},{data:moistureData.tiaret,color:'#8b5cf6'}]} labels={DAYS} height={160} yMin={20} yMax={65}/>
                <div className="chart-legend">{[{c:'#16a34a',l:'Blida'},{c:'#06b6d4',l:'Sétif'},{c:'#8b5cf6',l:'Tiaret'}].map(d=>(<div key={d.l} className="legend-item"><span className="legend-dot" style={{background:d.c}}/>{d.l}</div>))}</div>
              </div>
              <div className="alerts-section">
                <div className="alerts-header"><h3>Recent Alerts</h3><a onClick={()=>handleTabChange('alerts')}>View all →</a></div>
                {activeAlerts.slice(0,3).map(a=>(
                  <div key={a.id}>
                    <div className={`alert-item ${a.type}`} onClick={()=>setExpandedAlert(expandedAlert===a.id?null:a.id)}>
                      <div className="alert-icon"><Ic name={a.iconName} size={17}/></div>
                      <div className="alert-text">
                        <div className="alert-title">{a.title}</div>
                        <div className="alert-meta">
                          <span className="alert-meta-icon"><Ic name="mapPin" size={11}/> {a.loc}</span>
                          <span className="alert-meta-icon"><Ic name="clock" size={11}/> {a.time}</span>
                        </div>
                      </div>
                      <span className={`alert-badge ${a.type}`}><span style={{width:6,height:6,borderRadius:'50%',background:'currentColor',display:'inline-block'}}/> {a.type.charAt(0).toUpperCase()+a.type.slice(1)}</span>
                    </div>
                    {expandedAlert===a.id&&(
                      <div className={`alert-expand ${a.type}`}>
                        <p className="alert-expand-text">{a.desc}</p>
                        {a.sensor&&<div className="alert-expand-grid">
                          <div><div className="aeg-label">Sensor</div><div className="aeg-val">{a.sensor}</div></div>
                          <div><div className="aeg-label">Location</div><div className="aeg-val">{a.location}</div></div>
                          <div><div className="aeg-label">Timestamp</div><div className="aeg-val">{a.ts}</div></div>
                        </div>}
                        <div className="alert-actions">
                          <button className="btn-take-action" onClick={(e)=>handleTakeAction(a,e)}>Take Action</button>
                          <button className="btn-dismiss" onClick={(e)=>handleDismissAlert(a.id,e)}>Dismiss</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="sensors-section">
                <div className="sensors-head"><h3>Sensors</h3><a onClick={()=>handleTabChange('sensors')}>All →</a></div>
                {ALL_SENSORS.slice(0,4).map(s=>(
                  <div key={s.id} className="sensor-row" onClick={()=>{setSelectedSensor(s);handleTabChange('sensors')}}>
                    <span className={`sensor-dot ${s.status}`}/>
                    <div className="sensor-info">
                      <div className="sensor-name">{s.name}</div>
                      <div className="sensor-loc"><Ic name="mapPin" size={10}/> {s.loc}</div>
                    </div>
                    <span className="sensor-val">{s.val}</span>
                  </div>
                ))}
              </div>
            </>)}

            {/* MY FIELDS */}
            {tab==='fields'&&(<>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem',flexWrap:'wrap',gap:'0.75rem'}}>
                <div><h1 style={{fontSize:'1.25rem',fontWeight:800,color:'#0d1f0f'}}>My Fields</h1><p style={{fontSize:'0.82rem',color:'#6b7280'}}>{fields.length} fields · {fields.reduce((s,f)=>s+parseInt(f.area)||0,0)} ha monitored</p></div>
                <button className="btn-add-field" onClick={()=>setShowAddField(true)}><Ic name="plus" size={14}/>Add Field</button>
              </div>
              <div className="search-filter-row" style={{marginBottom:'1rem'}}>
                <div className="search-input-wrap">
                  <Ic name="search" size={15} style={{color:'#9ca3af'}}/>
                  <input placeholder="Search by field name, location, crop..." value={fieldSearch} onChange={e=>setFieldSearch(e.target.value)}/>
                  {fieldSearch&&<button onClick={()=>setFieldSearch('')} style={{background:'none',border:'none',cursor:'pointer',color:'#9ca3af',display:'flex',alignItems:'center'}}><Ic name="close" size={14}/></button>}
                </div>
              </div>
              <div style={{background:'#fff',borderRadius:'16px',border:'1px solid #e5e7eb',padding:'1.25rem',marginBottom:'1.25rem',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0.75rem'}}>
                <div><div style={{fontSize:'1.4rem',fontWeight:800,color:'#16a34a'}}>{fields.reduce((s,f)=>s+parseInt(f.area)||0,0)} ha</div><div style={{fontSize:'0.72rem',color:'#9ca3af'}}>Total Area</div></div>
                <div style={{borderLeft:'1px solid #e5e7eb',paddingLeft:'1rem'}}><div style={{fontSize:'1.4rem',fontWeight:800,color:'#2563eb'}}>{ALL_SENSORS.length}</div><div style={{fontSize:'0.72rem',color:'#9ca3af'}}>Total Sensors</div></div>
                <div style={{borderLeft:'1px solid #e5e7eb',paddingLeft:'1rem'}}><div style={{fontSize:'1.4rem',fontWeight:800,color:'#7c3aed'}}>{Math.round(fields.reduce((s,f)=>s+f.health,0)/Math.max(fields.length,1))}%</div><div style={{fontSize:'0.72rem',color:'#9ca3af'}}>Avg. Health</div></div>
              </div>
              {filteredFields.length===0?<div className="no-results">No fields match "{fieldSearch}"</div>:(
              <div className="fields-grid">
                {filteredFields.map((f,i)=>(
                  <div key={i} className="field-card">
                    <div className={`field-card-accent ${f.accent}`}/>
                    <div className="field-card-body">
                      <div className="field-card-head">
                        <div style={{display:'flex',alignItems:'center',gap:'10px',minWidth:0}}>
                          <div className="field-card-icon-wrap"><Ic name="fields" size={22}/></div>
                          <div className="field-card-meta"><div className="field-name">{f.name}</div><div className="field-loc"><Ic name="mapPin" size={10}/> {f.loc}</div></div>
                        </div>
                        <button className="field-more" onClick={()=>showToast(`${f.name} details`)}><Ic name="dots" size={18}/></button>
                      </div>
                      <div className="field-tags">
                        <span className={`field-tag ${f.status}`}>{f.status==='healthy'?'● Healthy':f.status==='needs-water'?'● Needs Water':'● At Risk'}</span>
                        <span className="field-tag crop">{f.crop}</span>
                        <span className="field-tag area">{f.area}</span>
                      </div>
                      <div className="field-readings">
                        <div className="field-reading"><div className="field-reading-icon"><Ic name="moisture" size={16} style={{color:'#2563eb'}}/></div><div className={`field-reading-val ${f.moisture.c}`}>{f.moisture.v}</div><div className="field-reading-key">Moisture</div></div>
                        <div className="field-reading"><div className="field-reading-icon"><Ic name="temp" size={16} style={{color:'#d97706'}}/></div><div className={`field-reading-val ${f.temp.c}`}>{f.temp.v}</div><div className="field-reading-key">Temp.</div></div>
                        <div className="field-reading"><div className="field-reading-icon"><Ic name="sensors" size={16} style={{color:'#16a34a'}}/></div><div className={`field-reading-val ${f.sensors.c}`}>{f.sensors.v}</div><div className="field-reading-key">Sensors</div></div>
                      </div>
                      <div className="field-health-row"><span className="field-health-label">Field Health</span><span className="field-health-pct">{f.health}%</span></div>
                      <div className="field-bar"><div className="field-bar-fill" style={{width:`${f.health}%`,background:f.health>70?'#22c55e':f.health>50?'#3b82f6':'#ef4444'}}/></div>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </>)}

            {/* SENSORS */}
            {tab==='sensors'&&(<>
              <div className="page-header"><h1>Sensors</h1><p>{ALL_SENSORS.length} sensors across 10 wilayas</p></div>
              <div className="sensors-status-grid">
                {[{cls:'online-card',iconName:'check',num:ALL_SENSORS.filter(s=>s.status==='online').length,label:'Online'},
                  {cls:'warning-card',iconName:'warning',num:ALL_SENSORS.filter(s=>s.status==='warning').length,label:'Warning'},
                  {cls:'offline-card',iconName:'sensor_kpi',num:ALL_SENSORS.filter(s=>s.status==='offline').length,label:'Offline'}].map((s,i)=>(
                  <div key={i} className={`status-card ${s.cls}`} style={{cursor:'pointer'}} onClick={()=>setSensorFilter(s.label)}>
                    <span className="status-card-icon"><Ic name={s.iconName} size={20}/></span>
                    <div><div className="status-card-num">{s.num}</div><div className="status-card-label">{s.label}</div></div>
                  </div>
                ))}
              </div>
              <div className="search-filter-row">
                <div className="search-input-wrap">
                  <Ic name="search" size={15} style={{color:'#9ca3af'}}/>
                  <input placeholder="Search by name, wilaya, or ID..." value={sensorSearch} onChange={e=>setSensorSearch(e.target.value)}/>
                  {sensorSearch&&<button onClick={()=>setSensorSearch('')} style={{background:'none',border:'none',cursor:'pointer',color:'#9ca3af',display:'flex',alignItems:'center'}}><Ic name="close" size={14}/></button>}
                </div>
                <div className="filter-divider"/>
                <div className="filter-btns">
                  {['All','Online','Warning','Offline'].map(f=>(<button key={f} className={`filter-btn${sensorFilter===f?' active':''}`} onClick={()=>setSensorFilter(f)}>{f}</button>))}
                </div>
              </div>
              <div className="type-filter-row">
                {['All Types','Moisture','Temperature','Humidity','Rainfall','Wind'].map(t=>(<button key={t} className={`type-btn${sensorType===t?' active':''}`} onClick={()=>setSensorType(t)}>{t}</button>))}
              </div>
              {filteredSensors.length===0?<div className="no-results">No sensors match your filters</div>:(
              <div className="sensors-cards-grid">
                {filteredSensors.map(s=>(
                  <div key={s.id} className="sensor-card" onClick={()=>setSelectedSensor(s)}>
                    <div className="sensor-card-head">
                      <div className={`sensor-card-icon ${s.iconClass}`}><Ic name={s.iconName} size={20}/></div>
                      <div className={`sensor-status-badge ${s.status}`}><span className="sensor-status-dot"/>{s.status.charAt(0).toUpperCase()+s.status.slice(1)}</div>
                    </div>
                    <div className="sensor-card-name">{s.name}</div>
                    <div className="sensor-card-id">{s.id}</div>
                    <div className="sensor-card-val">{s.val}</div>
                    <div className={`sensor-card-type ${s.valColor}`}>{s.type}</div>
                    <div className="sensor-card-foot">
                      <div className="sensor-foot-item"><Ic name="mapPin" size={11}/> {s.loc}</div>
                      <div className="sensor-foot-item"><Ic name="battery" size={11}/> {s.battery}%</div>
                      <div className="sensor-foot-item"><Ic name="signal" size={11}/> {s.signal}%</div>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </>)}

            {/* ANALYTICS */}
            {tab==='analytics'&&(<>
              <div className="analytics-header">
                <div><h1 style={{fontSize:'1.25rem',fontWeight:800,color:'#0d1f0f'}}>Analytics</h1><p style={{fontSize:'0.82rem',color:'#6b7280'}}>Deep insights across all your fields and sensors</p></div>
                <div style={{display:'flex',gap:'0.5rem',alignItems:'center',flexWrap:'wrap'}}>
                  <div className="time-btns">{['24 Hours','7 Days','30 Days','3 Months'].map(t=>(<button key={t} className={`time-btn${analyticsTime===t?' active':''}`} onClick={()=>setAnalyticsTime(t)}>{t}</button>))}</div>
                  <button className="export-btn" onClick={handleExport}><Ic name="download" size={13}/>Export</button>
                </div>
              </div>
              <div className="analytics-kpi-grid">
                {[
                  {iconName:'moisture',name:'Avg. Soil Moisture',val:'41%',change:'-4% vs last period',pos:false},
                  {iconName:'temp',name:'Peak Temperature',val:'35.2°C',change:'+2.1°C vs last period',pos:false},
                  {iconName:'analytics',name:'Yield Improvement',val:'+18%',change:'vs same period 2024',pos:true},
                  {iconName:'moisture',name:'Total Rainfall',val:'12.4 mm',change:'-8 mm vs last period',pos:false}
                ].map((k,i)=>(
                  <div key={i} className="a-kpi">
                    <div className="a-kpi-head"><Ic name={k.iconName} size={18}/><span className="a-kpi-name">{k.name}</span></div>
                    <div className="a-kpi-val">{k.val}</div>
                    <div className={`a-kpi-change ${k.pos?'pos':'neg'}`}>{k.change}</div>
                  </div>
                ))}
              </div>
              <div className="chart-card">
                <div className="chart-head"><div className="chart-head-left"><h3>Soil Moisture — {analyticsTime}</h3><p>By region (%)</p></div><Ic name="moisture" size={20} style={{color:'#9ca3af'}}/></div>
                <LineChart datasets={[{data:moistureData.blida,color:'#16a34a'},{data:moistureData.setif,color:'#06b6d4'},{data:moistureData.tiaret,color:'#8b5cf6'}]} labels={DAYS} height={160} yMin={20} yMax={65}/>
                <div className="chart-legend">{[{c:'#16a34a',l:'Blida'},{c:'#06b6d4',l:'Sétif'},{c:'#8b5cf6',l:'Tiaret'}].map(d=>(<div key={d.l} className="legend-item"><span className="legend-dot" style={{background:d.c}}/>{d.l}</div>))}</div>
              </div>
              <div className="chart-card">
                <div className="chart-head"><div className="chart-head-left"><h3>Field Health Score</h3><p>Radar — by region</p></div></div>
                <RadarChart datasets={[{data:[72,80,65,70,75,68],color:'#16a34a'},{data:[60,55,70,65,60,55],color:'#06b6d4'}]} labels={['Moisture','Temp Ctrl','Humidity','Yield','Sensor Up.','Irrigation']}/>
              </div>
              <div className="chart-card">
                <div className="chart-head"><div className="chart-head-left"><h3>Data Log — {analyticsTime}</h3></div><span style={{fontSize:'0.78rem',color:'#9ca3af'}}>{logData.length} records</span></div>
                <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
                  <table className="data-table" style={{width:'100%',minWidth:'380px'}}>
                    <thead><tr><th>TIME</th><th>MOIST (%)</th><th>TEMP (°C)</th><th>HUM (%)</th><th style={{textAlign:'right'}}>RAIN (MM)</th></tr></thead>
                    <tbody>{logData.map(r=>(<tr key={r.d}><td>{r.d}</td><td className="td-moisture">{r.m}</td><td className="td-temp">{r.t}</td><td>{r.h}</td><td style={{textAlign:'right'}} className={r.r>0?'td-rain':'td-zero'}>{r.r>0?r.r:0}</td></tr>))}</tbody>
                  </table>
                </div>
              </div>
            </>)}

            {/* ALERTS */}
            {tab==='alerts'&&(<>
              <div className="page-header"><h1>Alerts</h1><p>{activeAlerts.length} active · {dismissedAlerts.length} dismissed</p></div>
              <div className="alert-tab-row">
                {alertTabs.map(t=>(<button key={t} className={`alert-tab${alertFilter===t?' active':''}`} onClick={()=>setAlertFilter(t)}>{t} <span className="alert-tab-count">{alertCounts[t]||0}</span></button>))}
              </div>
              {filteredAlerts.length===0?<div className="no-results">No {alertFilter!=='All'?alertFilter.toLowerCase()+' ':''} alerts right now</div>:
                filteredAlerts.map(a=>(
                  <div key={a.id}>
                    <div className={`alert-item ${a.type}`} onClick={()=>setExpandedAlert(expandedAlert===a.id?null:a.id)}>
                      <div className="alert-icon"><Ic name={a.iconName} size={17}/></div>
                      <div className="alert-text">
                        <div className="alert-title">{a.title}</div>
                        <div className="alert-desc">{a.desc}</div>
                        <div className="alert-meta">
                          <span className="alert-meta-icon"><Ic name="mapPin" size={11}/> {a.loc}</span>
                          <span className="alert-meta-icon"><Ic name="clock" size={11}/> {a.time}</span>
                        </div>
                      </div>
                      <span className={`alert-badge ${a.type}`}><span style={{width:6,height:6,borderRadius:'50%',background:'currentColor',display:'inline-block'}}/> {a.type.charAt(0).toUpperCase()+a.type.slice(1)}</span>
                    </div>
                    {expandedAlert===a.id&&(
                      <div className={`alert-expand ${a.type}`}>
                        <p className="alert-expand-text">{a.desc}</p>
                        {a.sensor&&<div className="alert-expand-grid">
                          <div><div className="aeg-label">Sensor</div><div className="aeg-val">{a.sensor}</div></div>
                          <div><div className="aeg-label">Location</div><div className="aeg-val">{a.location}</div></div>
                          <div><div className="aeg-label">Timestamp</div><div className="aeg-val">{a.ts}</div></div>
                        </div>}
                        <div className="alert-actions">
                          <button className="btn-take-action" onClick={(e)=>handleTakeAction(a,e)}>Take Action</button>
                          <button className="btn-dismiss" onClick={(e)=>handleDismissAlert(a.id,e)}>Dismiss</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              }
            </>)}

            {/* SETTINGS */}
            {tab==='settings'&&(<>
              <div className="page-header"><h1>Settings</h1><p>Manage your account, notifications, and preferences</p></div>
              <div className="settings-layout">
                <div className="settings-nav">
                  {settingsNavConfig.map(s=>(
                    <button key={s.key} className={`settings-nav-item${settingsTab===s.key?' active':''}`} onClick={()=>setSettingsTab(s.key)}>
                      <span className="settings-nav-item-icon"><Ic name={s.iconName} size={15}/></span> {s.key}
                    </button>
                  ))}
                </div>
                <div className="settings-panel">
                  {settingsTab==='Profile'&&(<>
                    <div className="settings-profile-head">
                      <div className="settings-avatar">{initials}</div>
                      <div className="settings-avatar-info">
                        <h3>{settingsForm.fullName}</h3>
                        <p>Farmer · {settingsForm.wilaya}</p>
                        <a>Change photo</a>
                      </div>
                    </div>
                    <div className="settings-form-grid">
                      {Object.entries(settingsForm).map(([key,val])=>(
                        <div key={key} className="settings-field">
                          <label>{key.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase())}</label>
                          <input value={val} onChange={e=>setSettingsForm(f=>({...f,[key]:e.target.value}))}/>
                        </div>
                      ))}
                    </div>
                    <button className="btn-save" onClick={()=>{setSavedSettings(true);setTimeout(()=>setSavedSettings(false),2500);showToast('✅ Settings saved')}}>Save Changes</button>
                    {savedSettings&&<div className="save-success">✅ Profile saved successfully!</div>}
                  </>)}
                  {settingsTab!=='Profile'&&(
                    <div style={{color:'#9ca3af',fontSize:'0.9rem',padding:'2rem',textAlign:'center'}}>
                      <div style={{fontSize:'3rem',marginBottom:'1rem'}}>🔧</div>
                      <p><strong>{settingsTab}</strong> settings coming soon.</p>
                    </div>
                  )}
                </div>
              </div>
            </>)}

          </div>
        </div>
      </div>

      {/* Add Field Modal */}
      {showAddField&&(
        <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setShowAddField(false)}}>
          <div className="modal-box">
            <div className="modal-title">
              Add New Field
              <button className="modal-close" onClick={()=>setShowAddField(false)}><Ic name="close" size={14}/></button>
            </div>
            <div className="modal-form-grid">
              {[{label:'Field Name *',key:'name',placeholder:'e.g. Field Epsilon'},{label:'Location / Wilaya *',key:'loc',placeholder:'e.g. Béjaïa'},{label:'Crop Type',key:'crop',placeholder:'e.g. Barley'},{label:'Area (ha)',key:'area',placeholder:'e.g. 15 ha'}].map(f=>(
                <div key={f.key} className="modal-field">
                  <label>{f.label}</label>
                  <input placeholder={f.placeholder} value={newField[f.key]} onChange={e=>setNewField(n=>({...n,[f.key]:e.target.value}))}/>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn-modal-cancel" onClick={()=>setShowAddField(false)}>Cancel</button>
              <button className="btn-modal-save" onClick={addField}>Add Field ✓</button>
            </div>
          </div>
        </div>
      )}

      {/* Sensor Detail Modal */}
      {selectedSensor&&(
        <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setSelectedSensor(null)}}>
          <div className="sensor-detail-modal">
            <div className="modal-title">
              {selectedSensor.name}
              <button className="modal-close" onClick={()=>setSelectedSensor(null)}><Ic name="close" size={14}/></button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem',marginBottom:'1rem'}}>
              {[['ID',selectedSensor.id],['Type',selectedSensor.type],['Status',selectedSensor.status.toUpperCase()],['Location',selectedSensor.loc],['Current Reading',selectedSensor.val],['Battery',`${selectedSensor.battery}%`],['Signal',`${selectedSensor.signal}%`],['Last Seen','Just now']].map(([k,v])=>(
                <div key={k} style={{background:'#f9fafb',borderRadius:10,padding:'0.75rem'}}>
                  <div style={{fontSize:'0.7rem',color:'#9ca3af',marginBottom:3}}>{k}</div>
                  <div style={{fontSize:'0.9rem',fontWeight:700,color:'#0d1f0f'}}>{v}</div>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn-modal-cancel" onClick={()=>setSelectedSensor(null)}>Close</button>
              <button className="btn-modal-save" onClick={()=>{showToast(`Calibrating ${selectedSensor.name}…`);setSelectedSensor(null)}}>Calibrate Sensor</button>
            </div>
          </div>
        </div>
      )}

      {toast&&<div className="db-toast">{toast}</div>}
    </>
  )
}