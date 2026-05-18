import { useState, useEffect, useRef, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import logoo from '../assets/logoo.png'

// ─── ICON LIBRARY ────────────────────────────────────────────────────────────
const Icons = {
  dashboard:   'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  sensors:     'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0',
  irrigation:  ['M12 2.69l5.66 5.66a8 8 0 11-11.31 0z'],
  alerts:      'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  statistics:  ['M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'],
  fieldMap:    'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
  history:     'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
  settings:    ['M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'],
  moisture:    ['M12 2.69l5.66 5.66a8 8 0 11-11.31 0z'],
  temp:        'M14.5 10V5.5a2.5 2.5 0 00-5 0V10a5 5 0 105 0z',
  humidity:    ['M12 2.69l5.66 5.66a8 8 0 11-11.31 0z'],
  weather:     'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z',
  wind:        ['M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2'],
  auto:        ['M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z'],
  warning:     'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
  check:       'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  info:        'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z',
  bell:        'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
  search:      'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z',
  logout:      'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75',
  menu:        ['M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'],
  close:       'M6 18L18 6M6 6l12 12',
  mapPin:      ['M15 10.5a3 3 0 11-6 0 3 3 0 016 0z', 'M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z'],
  clock:       'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
  battery:     ['M6.5 10h11v4h-11z', 'M3 10h3.5m11 0H21m-1.5-2v8'],
  arrowUp:     'M4.5 10.5l7.5-7.5 7.5 7.5M12 3v18',
  arrowDown:   'M19.5 13.5l-7.5 7.5-7.5-7.5M12 21V3',
  user:        ['M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'],
  plus:        'M12 4.5v15m7.5-7.5h-15',
  edit:        'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125',
  chevronDown: 'M19.5 8.25l-7.5 7.5-7.5-7.5',
  chevronUp:   'M4.5 15.75l7.5-7.5 7.5 7.5',
  home:        ['M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'],
  refresh:     'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  download:    'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3',
  shield:      'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
}

const Ic = ({ name, size = 16, color = 'currentColor', style = {} }) => {
  const d = Icons[name]
  if (!d) return null
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  )
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Manrope',sans-serif;overflow-x:hidden}

/* Layout */
.db{display:flex;min-height:100vh;background:#f0f4f0;font-family:'Manrope',sans-serif}
.sb{width:220px;background:#1a3a1f;display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:200;transition:transform 0.3s ease;overflow-y:auto;overflow-x:hidden}
.sb-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:199}
.db-main{margin-left:220px;flex:1;display:flex;flex-direction:column;min-height:100vh;transition:margin-left 0.3s}

/* Topbar */
.topbar{height:58px;background:#fff;border-bottom:1px solid #e0e8e0;display:flex;align-items:center;justify-content:space-between;padding:0 1.5rem;position:sticky;top:0;z-index:100;gap:1rem}
.tb-hamburger{display:none;background:none;border:none;cursor:pointer;padding:6px;border-radius:8px;color:#4b7a55;flex-shrink:0}
.tb-title{font-size:1.1rem;font-weight:800;color:#1a3a1f;flex-shrink:0}
.tb-subtitle{font-size:0.8rem;color:#6b9475;font-weight:500;margin-top:1px}
.tb-center{flex:1;display:flex;justify-content:center}
.tb-search{display:flex;align-items:center;gap:8px;background:#f5f8f5;border:1.5px solid #d4e4d4;border-radius:50px;padding:0.4rem 1rem;max-width:300px;width:100%}
.tb-search input{border:none;outline:none;background:none;font-size:0.84rem;font-family:'Manrope',sans-serif;color:#374151;width:100%}
.tb-search input::placeholder{color:#9ca3af}
.tb-right{display:flex;align-items:center;gap:0.6rem;flex-shrink:0}
.tb-datetime{display:flex;align-items:center;gap:12px;font-size:0.78rem;color:#6b7280;font-weight:600}
.tb-datetime-item{display:flex;align-items:center;gap:5px}
.tb-icon-btn{width:34px;height:34px;border-radius:50%;border:1.5px solid #e0e8e0;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;position:relative;color:#6b9475;transition:all 0.15s}
.tb-icon-btn:hover{background:#f0f4f0;border-color:#c0d4c0}
.tb-notif-dot{position:absolute;top:4px;right:4px;width:8px;height:8px;border-radius:50%;background:#ef4444;border:2px solid #fff}
.tb-user{display:flex;align-items:center;gap:8px;cursor:pointer;padding:5px 10px;border-radius:50px;border:1.5px solid #e0e8e0;background:#fff;transition:all 0.15s;position:relative}
.tb-user:hover{background:#f0f4f0}
.tb-user-av{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#22c55e,#16a34a);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:#fff}
.tb-user-name{font-size:0.8rem;font-weight:700;color:#1a3a1f}
.user-dropdown{position:absolute;top:calc(100%+8px);right:0;background:#fff;border:1px solid #e0e8e0;border-radius:14px;padding:0.4rem;min-width:200px;box-shadow:0 8px 30px rgba(0,0,0,0.1);z-index:500}
.ud-header{padding:0.65rem 0.75rem 0.5rem;border-bottom:1px solid #f0f4f0;margin-bottom:0.2rem}
.ud-name{font-size:0.88rem;font-weight:800;color:#1a3a1f}
.ud-role{font-size:0.72rem;color:#6b9475}
.ud-item{display:flex;align-items:center;gap:8px;padding:0.6rem 0.75rem;border-radius:8px;cursor:pointer;font-size:0.83rem;font-weight:600;color:#374151;border:none;background:none;width:100%;text-align:left;font-family:'Manrope',sans-serif;transition:background 0.15s}
.ud-item:hover{background:#f5f8f5}
.ud-item.danger{color:#ef4444}
.ud-item.danger:hover{background:#fef2f2}
.ud-sep{height:1px;background:#f0f4f0;margin:0.2rem 0}

/* Sidebar */
.sb-header{padding:1.25rem 1rem 0.75rem;display:flex;align-items:center;gap:10px}
.sb-logo{width:34px;height:34px;object-fit:contain;border-radius:8px}
.sb-name{font-size:0.95rem;font-weight:800;color:#fff}
.sb-name span{color:#4ade80}
.sb-sub{font-size:0.6rem;color:#4ade80;font-weight:600;text-transform:uppercase;letter-spacing:0.1em}
.sb-divider{height:1px;background:rgba(255,255,255,0.08);margin:0 1rem}
.sb-nav{padding:0.5rem 0.6rem;display:flex;flex-direction:column;gap:2px}
.sb-item{display:flex;align-items:center;gap:9px;padding:0.6rem 0.7rem;border-radius:9px;cursor:pointer;border:none;background:none;width:100%;text-align:left;transition:all 0.15s;color:#8dbe9d}
.sb-item:hover{background:rgba(255,255,255,0.07);color:#c8ecd0}
.sb-item.active{background:rgba(34,197,94,0.2);color:#4ade80}
.sb-item-label{font-size:0.85rem;font-weight:600}
.sb-item-badge{margin-left:auto;background:#ef4444;color:#fff;font-size:0.6rem;font-weight:800;padding:2px 6px;border-radius:50px}
.sb-section{font-size:0.58rem;font-weight:700;color:#4a7c5a;text-transform:uppercase;letter-spacing:0.14em;padding:0.7rem 1rem 0.2rem}
.sb-close-btn{display:none;background:rgba(255,255,255,0.08);border:none;cursor:pointer;width:28px;height:28px;border-radius:7px;align-items:center;justify-content:center;color:#8dbe9d;margin-left:auto;flex-shrink:0}

/* Sidebar footer - weather */
.sb-weather{margin:auto 0.75rem 0.75rem;background:rgba(34,197,94,0.12);border:1px solid rgba(74,222,128,0.2);border-radius:12px;padding:0.85rem}
.sb-weather-top{display:flex;align-items:center;gap:8px;margin-bottom:0.5rem}
.sb-weather-temp{font-size:1.4rem;font-weight:800;color:#fff}
.sb-weather-desc{font-size:0.72rem;color:#86efac;font-weight:500}
.sb-weather-loc{font-size:0.65rem;color:#4ade80;display:flex;align-items:center;gap:3px}
.sb-weather-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem;margin-top:0.6rem}
.sb-weather-item{display:flex;flex-direction:column;gap:1px}
.sb-weather-key{font-size:0.6rem;color:#4a7c5a;text-transform:uppercase;letter-spacing:0.06em}
.sb-weather-val{font-size:0.75rem;font-weight:700;color:#86efac}
.sb-foot{border-top:1px solid rgba(255,255,255,0.07);padding:0.75rem 1rem;display:flex;align-items:center;gap:8px}
.sb-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#22c55e,#16a34a);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;flex-shrink:0}
.sb-user-name{font-size:0.82rem;font-weight:700;color:#fff}
.sb-user-role{font-size:0.62rem;color:#4ade80}
.sb-logout{margin-left:auto;background:none;border:none;cursor:pointer;color:#6b9e7a;padding:4px;display:flex;align-items:center;transition:color 0.2s}
.sb-logout:hover{color:#ef4444}

/* Content */
.db-content{flex:1;padding:1.25rem 1.5rem;overflow-y:auto}

/* Page header */
.page-hdr{margin-bottom:1.25rem}
.page-hdr h1{font-size:1.4rem;font-weight:800;color:#1a3a1f}
.page-hdr p{font-size:0.82rem;color:#6b9475;margin-top:2px}

/* ─── DASHBOARD GRID ─── */
.dash-grid{display:grid;grid-template-columns:1fr 300px;gap:1rem;align-items:start}
.dash-left{display:flex;flex-direction:column;gap:1rem}
.dash-right{display:flex;flex-direction:column;gap:1rem;position:sticky;top:70px}

/* KPI row - 6 cards */
.kpi-row{display:grid;grid-template-columns:repeat(6,1fr);gap:0.75rem}
.kpi-card{background:#fff;border:1px solid #e0e8e0;border-radius:14px;padding:1rem 1rem 0.9rem;position:relative;overflow:hidden;transition:box-shadow 0.2s,transform 0.2s;cursor:default}
.kpi-card:hover{box-shadow:0 4px 18px rgba(0,0,0,0.07);transform:translateY(-1px)}
.kpi-top-bar{position:absolute;top:0;left:0;right:0;height:3px;border-radius:14px 14px 0 0}
.kpi-icon-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.6rem;margin-top:0.25rem}
.kpi-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.kpi-trend{font-size:0.7rem;font-weight:700;display:flex;align-items:center;gap:2px}
.kpi-trend.up{color:#16a34a}
.kpi-trend.down{color:#ef4444}
.kpi-val{font-size:1.35rem;font-weight:800;color:#1a3a1f;line-height:1;margin-bottom:2px}
.kpi-label{font-size:0.7rem;font-weight:700;color:#374151;margin-bottom:1px}
.kpi-sub{font-size:0.65rem;color:#9ca3af}
.kpi-badge{display:inline-flex;align-items:center;padding:1px 7px;border-radius:50px;font-size:0.65rem;font-weight:700;margin-top:2px}
.kpi-badge.good{background:#dcfce7;color:#16a34a}
.kpi-badge.normal{background:#e0f2fe;color:#0369a1}
.kpi-badge.warning{background:#fef3c7;color:#d97706}

/* Environmental Trends Chart */
.chart-card{background:#fff;border:1px solid #e0e8e0;border-radius:14px;padding:1.25rem}
.chart-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem}
.chart-title{font-size:0.95rem;font-weight:700;color:#1a3a1f}
.chart-legend{display:flex;gap:1rem;flex-wrap:wrap}
.legend-item{display:flex;align-items:center;gap:5px;font-size:0.72rem;color:#6b7280;font-weight:500}
.legend-dot{width:14px;height:3px;border-radius:2px}
.chart-time-sel{padding:5px 12px;border-radius:50px;border:1.5px solid #e0e8e0;background:#fff;font-size:0.75rem;font-weight:600;color:#374151;cursor:pointer;font-family:'Manrope',sans-serif}

/* Bottom sections row */
.dash-bottom-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem}

/* Irrigation overview card */
.irr-card{background:#fff;border:1px solid #e0e8e0;border-radius:14px;padding:1.25rem}
.irr-card h3{font-size:0.88rem;font-weight:700;color:#1a3a1f;margin-bottom:0.9rem}
.irr-donut-wrap{display:flex;align-items:center;gap:1rem;margin-bottom:0.9rem}
.irr-donut{position:relative;flex-shrink:0}
.irr-donut-pct{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:800;color:#1a3a1f}
.irr-info{flex:1}
.irr-row{display:flex;align-items:center;gap:7px;margin-bottom:0.4rem;font-size:0.78rem;color:#374151}
.irr-row-icon{display:flex;align-items:center;color:#16a34a}
.irr-row-label{color:#6b9475;flex-shrink:0}
.irr-row-val{font-weight:700;color:#1a3a1f}
.irr-water{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;font-size:0.78rem}
.irr-water-label{color:#6b9475}
.irr-water-val{font-weight:700;color:#1a3a1f}
.irr-water-bar{height:6px;background:#e0e8e0;border-radius:50px;overflow:hidden;margin-bottom:0.9rem}
.irr-water-fill{height:100%;background:linear-gradient(90deg,#22c55e,#16a34a);border-radius:50px}
.btn-irrigate{width:100%;padding:0.65rem;border:none;border-radius:50px;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-size:0.82rem;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif;display:flex;align-items:center;justify-content:center;gap:7px;box-shadow:0 4px 12px rgba(34,197,94,0.3)}

/* Sensor status card */
.sensor-status-card{background:#fff;border:1px solid #e0e8e0;border-radius:14px;padding:1.25rem}
.sensor-status-card h3{font-size:0.88rem;font-weight:700;color:#1a3a1f;margin-bottom:0.9rem}
.ss-big-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5rem;margin-bottom:0.9rem}
.ss-big{text-align:center;padding:0.75rem 0.4rem;border-radius:12px}
.ss-big.total{background:#f5f8f5;border:1px solid #e0e8e0}
.ss-big.active{background:#f0fdf4;border:1px solid #bbf7d0}
.ss-big.inactive{background:#fff7ed;border:1px solid #fed7aa}
.ss-big.batt{background:#fef2f2;border:1px solid #fecaca}
.ss-big-num{font-size:1.5rem;font-weight:800}
.ss-big.total .ss-big-num{color:#374151}
.ss-big.active .ss-big-num{color:#16a34a}
.ss-big.inactive .ss-big-num{color:#ea580c}
.ss-big.batt .ss-big-num{color:#dc2626}
.ss-big-label{font-size:0.62rem;color:#9ca3af;font-weight:600;margin-top:1px}
.ss-types-title{font-size:0.72rem;font-weight:700;color:#374151;margin-bottom:0.5rem}
.ss-type-row{display:flex;align-items:center;justify-content:space-between;padding:0.3rem 0}
.ss-type-name{font-size:0.78rem;color:#374151;display:flex;align-items:center;gap:6px}
.ss-type-count{font-size:0.78rem;font-weight:700;color:#16a34a}
.ss-type-count.warn{color:#ea580c}

/* Moisture distribution chart */
.moist-card{background:#fff;border:1px solid #e0e8e0;border-radius:14px;padding:1.25rem}
.moist-card h3{font-size:0.88rem;font-weight:700;color:#1a3a1f;margin-bottom:0.9rem}

/* Alerts panel (right column) */
.alerts-panel{background:#fff;border:1px solid #e0e8e0;border-radius:14px;padding:1.25rem}
.alerts-panel-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.9rem}
.alerts-panel-hdr h3{font-size:0.88rem;font-weight:700;color:#1a3a1f}
.alerts-panel-hdr a{font-size:0.75rem;color:#22c55e;font-weight:700;cursor:pointer;text-decoration:none}
.alert-item{display:flex;align-items:flex-start;gap:9px;padding:0.65rem 0;border-bottom:1px solid #f5f8f5}
.alert-item:last-child{border-bottom:none;padding-bottom:0}
.alert-icon-wrap{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
.alert-icon-wrap.crit{background:#fef2f2;color:#dc2626}
.alert-icon-wrap.warn{background:#fff7ed;color:#ea580c}
.alert-icon-wrap.info{background:#f0fdf4;color:#16a34a}
.alert-text-block{flex:1;min-width:0}
.alert-name{font-size:0.8rem;font-weight:700;color:#1a3a1f;line-height:1.3;margin-bottom:1px}
.alert-sub{font-size:0.7rem;color:#9ca3af}
.alert-time{font-size:0.65rem;color:#9ca3af;flex-shrink:0;margin-top:2px}

/* Irrigation control panel */
.irr-control-panel{background:#fff;border:1px solid #e0e8e0;border-radius:14px;padding:1.25rem}
.irr-control-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem}
.irr-control-hdr h3{font-size:0.88rem;font-weight:700;color:#1a3a1f}
.irr-mode{font-size:0.68rem;color:#6b9475;font-weight:500;margin-bottom:0.75rem}
.toggle-wrap{width:36px;height:20px;border-radius:50px;background:#22c55e;position:relative;cursor:pointer;flex-shrink:0}
.toggle-knob{position:absolute;width:16px;height:16px;border-radius:50%;background:#fff;top:2px;right:2px;transition:right 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.2)}
.irr-rule{display:flex;align-items:flex-start;gap:8px;padding:0.5rem 0;border-bottom:1px solid #f5f8f5}
.irr-rule:last-child{border-bottom:none;padding-bottom:0}
.irr-rule-icon{width:26px;height:26px;border-radius:7px;background:#f0fdf4;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#16a34a}
.irr-rule-text{flex:1;min-width:0}
.irr-rule-title{font-size:0.75rem;font-weight:700;color:#1a3a1f;line-height:1.3}
.irr-rule-sub{font-size:0.68rem;color:#9ca3af}
.btn-edit-rules{width:100%;margin-top:0.75rem;padding:0.55rem;border:1.5px solid #e0e8e0;border-radius:50px;background:#fff;font-size:0.78rem;font-weight:600;cursor:pointer;font-family:'Manrope',sans-serif;color:#374151;display:flex;align-items:center;justify-content:center;gap:5px;transition:all 0.15s}
.btn-edit-rules:hover{border-color:#22c55e;color:#16a34a}

/* Sensors table */
.table-card{background:#fff;border:1px solid #e0e8e0;border-radius:14px;overflow:hidden}
.table-card-hdr{display:flex;align-items:center;justify-content:space-between;padding:1.1rem 1.25rem 0.85rem}
.table-card-hdr h3{font-size:0.88rem;font-weight:700;color:#1a3a1f}
.table-card-hdr a{font-size:0.75rem;color:#22c55e;font-weight:700;cursor:pointer;text-decoration:none}
.data-table{width:100%;border-collapse:collapse}
.data-table th{font-size:0.62rem;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;padding:0.5rem 1.25rem;text-align:left;border-bottom:1px solid #f0f4f0;background:#fafcfa}
.data-table td{padding:0.65rem 1.25rem;font-size:0.82rem;color:#374151;border-bottom:1px solid #f5f8f5}
.data-table tr:last-child td{border-bottom:none}
.status-pill{display:inline-flex;align-items:center;gap:5px;padding:2px 9px;border-radius:50px;font-size:0.68rem;font-weight:700}
.status-pill.active{background:#f0fdf4;color:#16a34a}
.status-pill.inactive{background:#fef2f2;color:#dc2626}
.status-pill-dot{width:5px;height:5px;border-radius:50%;background:currentColor}
.battery-indicator{display:flex;align-items:center;gap:6px}
.battery-bar{width:28px;height:10px;border-radius:2px;background:#f0f4f0;overflow:hidden;position:relative}
.battery-bar::after{content:'';position:absolute;right:-3px;top:3px;width:3px;height:4px;background:#9ca3af;border-radius:0 1px 1px 0}
.battery-fill{height:100%;border-radius:2px;transition:width 0.3s}

/* Field Map */
.field-map-card{background:#fff;border:1px solid #e0e8e0;border-radius:14px;overflow:hidden}
.field-map-hdr{display:flex;align-items:center;justify-content:space-between;padding:1.1rem 1.25rem 0.85rem}
.field-map-hdr h3{font-size:0.88rem;font-weight:700;color:#1a3a1f}
.field-map-svg-wrap{padding:0 1.25rem 1.25rem}

/* Activity Log */
.activity-card{background:#fff;border:1px solid #e0e8e0;border-radius:14px;padding:1.25rem}
.activity-card-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.9rem}
.activity-card-hdr h3{font-size:0.88rem;font-weight:700;color:#1a3a1f}
.activity-card-hdr a{font-size:0.75rem;color:#22c55e;font-weight:700;cursor:pointer;text-decoration:none}
.activity-item{display:flex;align-items:flex-start;gap:8px;padding:0.5rem 0;border-bottom:1px solid #f5f8f5}
.activity-item:last-child{border-bottom:none;padding-bottom:0}
.activity-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:4px}
.activity-text{flex:1;font-size:0.78rem;color:#374151;line-height:1.4}
.activity-time{font-size:0.68rem;color:#9ca3af;flex-shrink:0}

/* Bottom two-col */
.dash-bottom-2col{display:grid;grid-template-columns:1fr 1fr;gap:1rem}

/* Toast */
.db-toast{position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);background:#1a3a1f;color:#4ade80;padding:0.65rem 1.5rem;border-radius:50px;font-size:0.82rem;font-weight:700;z-index:700;box-shadow:0 8px 24px rgba(0,0,0,0.2);white-space:nowrap}

/* ── RESPONSIVE ───────────────────────────────────────────────────────────── */
@media(max-width:1200px){
  .kpi-row{grid-template-columns:repeat(3,1fr)}
  .dash-grid{grid-template-columns:1fr}
  .dash-right{position:static;display:grid;grid-template-columns:1fr 1fr;gap:1rem}
  .dash-bottom-row{grid-template-columns:1fr 1fr}
}
@media(max-width:900px){
  .sb{width:220px}
  .db-main{margin-left:220px}
  .dash-bottom-row{grid-template-columns:1fr}
  .dash-right{grid-template-columns:1fr}
  .dash-bottom-2col{grid-template-columns:1fr}
}
@media(max-width:768px){
  .sb{transform:translateX(-100%);width:240px;z-index:300}
  .sb.mobile-open{transform:translateX(0)}
  .sb-overlay{display:block}
  .sb-overlay.hidden{display:none}
  .sb-close-btn{display:flex!important}
  .db-main{margin-left:0!important}
  .tb-hamburger{display:flex}
  .tb-search{display:none}
  .tb-datetime{display:none}
  .topbar{padding:0 0.875rem}
  .db-content{padding:0.875rem}
  .page-hdr h1{font-size:1.15rem}
  .kpi-row{grid-template-columns:repeat(2,1fr);gap:0.5rem}
  .kpi-card{padding:0.75rem}
  .kpi-val{font-size:1.1rem}
  .chart-legend{gap:0.5rem}
  .dash-right{grid-template-columns:1fr}
  .dash-bottom-row{grid-template-columns:1fr}
  .dash-bottom-2col{grid-template-columns:1fr}
  .ss-big-row{grid-template-columns:1fr 1fr}
  .data-table th,.data-table td{padding:0.5rem 0.75rem;font-size:0.75rem}
  .db-toast{font-size:0.75rem;padding:0.55rem 1rem;max-width:88vw;white-space:normal;text-align:center}
  .tb-user-name{display:none}
}
@media(max-width:480px){
  .kpi-row{grid-template-columns:repeat(2,1fr)}
  .ss-big-row{grid-template-columns:1fr 1fr}
  .irr-donut-wrap{flex-direction:column;align-items:flex-start}
}

/* Pulse animation */
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
.pulse{animation:pulse 2s infinite}
`

// ─── CHARTS ──────────────────────────────────────────────────────────────────
function MultiLineChart({ datasets, labels, height = 190 }) {
  const W=700, H=height, PL=44, PR=14, PT=10, PB=28
  const cw=W-PL-PR, ch=H-PT-PB
  const allVals = datasets.flatMap(d=>d.data)
  const lo = Math.floor(Math.min(...allVals)/10)*10
  const hi = Math.ceil(Math.max(...allVals)/10)*10
  const range = hi - lo || 1
  const xs = labels.map((_,i)=>PL+(i/(labels.length-1))*cw)
  const ys = (data)=>data.map(v=>PT+(1-(v-lo)/range)*ch)
  const pathStr = (data)=>xs.map((x,i)=>`${i===0?'M':'L'}${x},${ys(data)[i]}`).join(' ')
  const yTicks = [0,25,50,75,100].map(p=>lo+(p/100)*range)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height}}>
      <defs>
        {datasets.map((d,i)=>(
          <linearGradient key={i} id={`mlg${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={d.color} stopOpacity="0.12"/>
            <stop offset="100%" stopColor={d.color} stopOpacity="0"/>
          </linearGradient>
        ))}
      </defs>
      {yTicks.map((t,i)=>{
        const y=PT+(1-(t-lo)/range)*ch
        return <g key={i}><line x1={PL} y1={y} x2={W-PR} y2={y} stroke="#f0f4f0" strokeWidth="1"/><text x={PL-5} y={y+4} fontSize="9.5" fill="#9ca3af" textAnchor="end">{Math.round(t)}</text></g>
      })}
      {labels.map((l,i)=><text key={i} x={xs[i]} y={H-4} fontSize="9.5" fill="#9ca3af" textAnchor="middle">{l}</text>)}
      {datasets.map((d,i)=>{
        const yv=ys(d.data)
        const area=`${xs.map((x,j)=>`${j===0?'M':'L'}${x},${yv[j]}`).join(' ')} L${xs[xs.length-1]},${PT+ch} L${xs[0]},${PT+ch} Z`
        return(
          <g key={i}>
            <path d={area} fill={`url(#mlg${i})`}/>
            <path d={pathStr(d.data)} fill="none" stroke={d.color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            {d.data.map((v,j)=><circle key={j} cx={xs[j]} cy={yv[j]} r="3" fill={d.color} stroke="#fff" strokeWidth="1.5"/>)}
          </g>
        )
      })}
    </svg>
  )
}

function BarChart({ fields, height = 130 }) {
  const W=320, H=height, PL=10, PR=10, PT=10, PB=28
  const cw=W-PL-PR, ch=H-PT-PB
  const n=fields.length, barW=cw/n*0.5, gap=cw/n
  const colors=['#22c55e','#f59e0b','#3b82f6','#10b981']
  return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height}}>
      {fields.map((f,i)=>{
        const bh=(f.val/100)*ch
        const x=PL+gap*i+(gap-barW)/2
        const y=PT+ch-bh
        return(
          <g key={i}>
            <rect x={x} y={y} width={barW} height={bh} rx="5" fill={colors[i%colors.length]} fillOpacity="0.85"/>
            <text x={x+barW/2} y={y-4} fontSize="9.5" fill={colors[i%colors.length]} textAnchor="middle" fontWeight="700">{f.val}%</text>
            <text x={x+barW/2} y={PT+ch+16} fontSize="9" fill="#9ca3af" textAnchor="middle">{f.label}</text>
          </g>
        )
      })}
      <line x1={PL} y1={PT+ch} x2={W-PR} y2={PT+ch} stroke="#e0e8e0" strokeWidth="1"/>
    </svg>
  )
}

function DonutChart({ pct, size=90, color='#22c55e' }) {
  const r=35, cx=size/2, cy=size/2
  const circ=2*Math.PI*r
  const dash=circ*(pct/100)
  return(
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e0e8e0" strokeWidth="8"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}/>
    </svg>
  )
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const DAYS_7 = ['21 May','22 May','23 May','24 May','25 May','26 May','27 May']
const ENV_DATA = {
  moisture:  [65, 68, 62, 70, 66, 72, 68],
  temp:      [38, 40, 42, 44, 40, 36, 38],
  humidity:  [55, 52, 50, 48, 52, 58, 55],
  wind:      [18, 22, 16, 20, 24, 18, 14],
}

const SENSOR_TABLE = [
  {name:'Sensor 1',field:'Field 1 - Zone A',type:'Soil Moisture',status:'active',updated:'10:29 AM',battery:85},
  {name:'Sensor 2',field:'Field 1 - Zone B',type:'Temperature',status:'active',updated:'10:29 AM',battery:78},
  {name:'Sensor 3',field:'Field 2 - Zone A',type:'Humidity',status:'active',updated:'10:29 AM',battery:90},
  {name:'Sensor 4',field:'Field 2 - Zone B',type:'Weather',status:'active',updated:'10:29 AM',battery:65},
  {name:'Sensor 5',field:'Field 3 - Zone A',type:'Wind Speed',status:'active',updated:'10:29 AM',battery:65},
  {name:'Sensor 6',field:'Field 3 - Zone B',type:'Soil Moisture',status:'inactive',updated:'—',battery:null},
]

const ALERTS_DATA = [
  {type:'crit',icon:'warning',name:'Low Soil Moisture',sub:'Field 2 - Zone A',time:'10:15 AM'},
  {type:'warn',icon:'temp',name:'High Temperature',sub:'Field 4 - Greenhouse',time:'09:50 AM'},
  {type:'warn',icon:'wind',name:'High Wind Speed',sub:'Outdoor',time:'09:30 AM'},
  {type:'info',icon:'check',name:'Irrigation Completed',sub:'Field 1 - Zone B',time:'Yesterday, 06:30 PM'},
  {type:'warn',icon:'sensors',name:'Sensor Offline',sub:'Field 3 - Sensor 2',time:'Yesterday, 11:20 AM'},
]

const ACTIVITY_DATA = [
  {dot:'#22c55e',text:'Irrigation started - Field 1',time:'10:00 AM'},
  {dot:'#22c55e',text:'Irrigation completed - Field 1',time:'10:30 AM'},
  {dot:'#f59e0b',text:'Sensor 2 (Field 3) went offline',time:'09:15 AM'},
  {dot:'#ef4444',text:'Low moisture alert - Field 2',time:'08:45 AM'},
  {dot:'#22c55e',text:'Temperature normal - Field 4',time:'08:20 AM'},
]

const IRR_RULES = [
  {icon:'clock',title:'If Soil Moisture < 30%',sub:'Irrigate for 30 minutes'},
  {icon:'clock',title:'Active Time: 06:00 AM – 08:00 PM',sub:''},
  {icon:'refresh',title:'Repeat Every Day',sub:''},
]

const FIELD_MAP_FIELDS = [
  {label:'Field 1',val:55,x:60,y:40,w:140,h:110,color:'#22c55e'},
  {label:'Field 2',val:28,x:210,y:40,w:100,h:110,color:'#f59e0b'},
  {label:'Field 3',val:43,x:60,y:160,w:120,h:100,color:'#3b82f6'},
  {label:'Field 4',val:63,x:190,y:160,w:120,h:100,color:'#10b981'},
]

const navSections = [
  {label:'Main',items:[
    {key:'dashboard',icon:'dashboard',label:'Dashboard'},
    {key:'sensors',icon:'sensors',label:'Sensors'},
    {key:'irrigation',icon:'irrigation',label:'Irrigation'},
    {key:'alerts',icon:'alerts',label:'Alerts',badge:2},
  ]},
  {label:'Analytics',items:[
    {key:'statistics',icon:'statistics',label:'Statistics'},
    {key:'fieldmap',icon:'fieldMap',label:'Field Map'},
    {key:'history',icon:'history',label:'History'},
  ]},
  {label:'System',items:[
    {key:'settings',icon:'settings',label:'Settings'},
  ]},
]

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function FarmerDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userDropOpen, setUserDropOpen] = useState(false)
  const [irrigationOn, setIrrigationOn] = useState(true)
  const [toast, setToast] = useState('')
  const [now, setNow] = useState(new Date())
  const dropRef = useRef(null)

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(''), 2500) }

  useEffect(()=>{
    const id = setInterval(()=>setNow(new Date()), 30000)
    return ()=>clearInterval(id)
  },[])

  useEffect(()=>{
    const h = (e)=>{ if(dropRef.current && !dropRef.current.contains(e.target)) setUserDropOpen(false) }
    document.addEventListener('mousedown', h)
    return ()=>document.removeEventListener('mousedown', h)
  },[])

  const firstName = user?.firstName || 'Mohamed'
  const lastName  = user?.lastName  || ''
  const initials  = `${firstName[0]}${lastName[0]||''}`
  const dateStr   = now.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})
  const timeStr   = now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})

  const handleNav = (key) => {
    setTab(key)
    if(window.innerWidth <= 768) setSidebarOpen(false)
  }

  const currentLabel = navSections.flatMap(s=>s.items).find(i=>i.key===tab)?.label || 'Dashboard'

  return (
    <>
      <style>{S}</style>
      <div className="db">
        {/* Overlay */}
        <div className={`sb-overlay${sidebarOpen?'':' hidden'}`} onClick={()=>setSidebarOpen(false)}/>

        {/* ── SIDEBAR ── */}
        <aside className={`sb${sidebarOpen?' mobile-open':''}`}>
          <div className="sb-header">
            <img src={logoo} alt="logo" className="sb-logo"/>
            <div>
              <div className="sb-name">Agri<span>Sens</span></div>
              <div className="sb-sub">Smart Farming</div>
            </div>
            <button className="sb-close-btn" onClick={()=>setSidebarOpen(false)}><Ic name="close" size={13}/></button>
          </div>
          <div className="sb-divider"/>

          {navSections.map(sec=>(
            <div key={sec.label}>
              <div className="sb-section">{sec.label}</div>
              <div className="sb-nav">
                {sec.items.map(n=>(
                  <button key={n.key} className={`sb-item${tab===n.key?' active':''}`} onClick={()=>handleNav(n.key)}>
                    <Ic name={n.icon} size={15}/>
                    <span className="sb-item-label">{n.label}</span>
                    {n.badge && <span className="sb-item-badge">{n.badge}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Weather widget in sidebar */}
          <div className="sb-weather">
            <div className="sb-weather-top">
              <Ic name="weather" size={24} color="#4ade80"/>
              <div>
                <div className="sb-weather-temp">25°C</div>
                <div className="sb-weather-desc">Partly Cloudy</div>
                <div className="sb-weather-loc"><Ic name="mapPin" size={10}/>Blida, Algérie</div>
              </div>
            </div>
            <div className="sb-weather-grid">
              <div className="sb-weather-item"><span className="sb-weather-key">Humidity</span><span className="sb-weather-val">58%</span></div>
              <div className="sb-weather-item"><span className="sb-weather-key">Wind</span><span className="sb-weather-val">12 km/h</span></div>
              <div className="sb-weather-item"><span className="sb-weather-key">Rain</span><span className="sb-weather-val">0%</span></div>
              <div className="sb-weather-item"><span className="sb-weather-key">Pressure</span><span className="sb-weather-val">1012 hPa</span></div>
            </div>
          </div>

          <div className="sb-foot">
            <div className="sb-avatar">{initials}</div>
            <div>
              <div className="sb-user-name">{firstName} {lastName}</div>
              <div className="sb-user-role">Farmer Pro</div>
            </div>
            <button className="sb-logout" onClick={()=>{logout();navigate('/')}}><Ic name="logout" size={16}/></button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="db-main">
          {/* Topbar */}
          <div className="topbar">
            <div style={{display:'flex',alignItems:'center',gap:'10px',minWidth:0}}>
              <button className="tb-hamburger" onClick={()=>setSidebarOpen(o=>!o)}><Ic name="menu" size={20}/></button>
              <div>
                <div className="tb-title">{currentLabel}</div>
                {tab==='dashboard' && <div className="tb-subtitle">Welcome back, {firstName}!</div>}
              </div>
            </div>
            <div className="tb-center">
              <div className="tb-search">
                <Ic name="search" size={14} color="#9ca3af"/>
                <input placeholder="Search sensors, fields, alerts..."/>
              </div>
            </div>
            <div className="tb-right">
              <div className="tb-datetime">
                <div className="tb-datetime-item"><Ic name="clock" size={13}/> {dateStr}</div>
                <div className="tb-datetime-item"><Ic name="history" size={13}/> {timeStr}</div>
              </div>
              <button className="tb-icon-btn" onClick={()=>handleNav('alerts')}>
                <Ic name="bell" size={15}/>
                <span className="tb-notif-dot"/>
              </button>
              <div style={{position:'relative'}} ref={dropRef}>
                <div className="tb-user" onClick={()=>setUserDropOpen(o=>!o)}>
                  <div className="tb-user-av">{initials}</div>
                  <span className="tb-user-name">{firstName}</span>
                  <Ic name={userDropOpen?'chevronUp':'chevronDown'} size={10} color="#6b9475"/>
                </div>
                {userDropOpen&&(
                  <div className="user-dropdown">
                    <div className="ud-header">
                      <div className="ud-name">{firstName} {lastName}</div>
                      <div className="ud-role">Farmer Pro · Blida</div>
                    </div>
                    <button className="ud-item" onClick={()=>{setTab('settings');setUserDropOpen(false)}}><Ic name="user" size={14}/>Profile & Settings</button>
                    <button className="ud-item" onClick={()=>navigate('/')}><Ic name="home" size={14}/>Back to Home</button>
                    <div className="ud-sep"/>
                    <button className="ud-item danger" onClick={()=>{logout();navigate('/')}}><Ic name="logout" size={14}/>Sign out</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── CONTENT ── */}
          <div className="db-content">

            {/* ══ DASHBOARD ══ */}
            {tab==='dashboard'&&(<>
              {/* KPI Row - 6 cards */}
              <div className="kpi-row" style={{marginBottom:'1rem'}}>
                {[
                  {icon:'moisture',iconBg:'#eff6ff',iconColor:'#2563eb',topColor:'#3b82f6',val:'42%',label:'Average Soil Moisture',sub:'5% from yesterday',badge:'Good',badgeClass:'good',trend:'+5%',trendDir:'up'},
                  {icon:'temp',iconBg:'#fff7ed',iconColor:'#ea580c',topColor:'#f97316',val:'26.7°C',label:'Average Temperature',sub:'1.3°C from yesterday',badge:'Normal',badgeClass:'normal',trend:'+1.3°C',trendDir:'up'},
                  {icon:'moisture',iconBg:'#eff6ff',iconColor:'#2563eb',topColor:'#06b6d4',val:'58%',label:'Average Humidity',sub:'3% from yesterday',badge:'Normal',badgeClass:'normal',trend:'+3%',trendDir:'up'},
                  {icon:'weather',iconBg:'#f5f8f5',iconColor:'#6b9475',topColor:'#22c55e',val:'Partly Cloudy',label:'Weather Status',sub:'Feels like 26°C',badge:null,trendDir:'up'},
                  {icon:'wind',iconBg:'#faf5ff',iconColor:'#7c3aed',topColor:'#8b5cf6',val:'12 km/h',label:'Wind Speed',sub:'NW Direction',badge:'Moderate',badgeClass:'warning',trend:'',trendDir:'up'},
                  {icon:'auto',iconBg:'#f0fdf4',iconColor:'#16a34a',topColor:'#22c55e',val:'Automated',label:'Irrigation Status',sub:'Next: 11:00 AM',badge:null,trendDir:'up'},
                ].map((k,i)=>(
                  <div key={i} className="kpi-card">
                    <div className="kpi-top-bar" style={{background:k.topColor}}/>
                    <div className="kpi-icon-row">
                      <div className="kpi-icon" style={{background:k.iconBg}}><Ic name={k.icon} size={18} color={k.iconColor}/></div>
                      {k.trend && <span className={`kpi-trend ${k.trendDir}`}><Ic name={k.trendDir==='up'?'arrowUp':'arrowDown'} size={10}/>{k.trend}</span>}
                    </div>
                    <div className="kpi-val">{k.val}</div>
                    <div className="kpi-label">{k.label}</div>
                    {k.badge
                      ? <span className={`kpi-badge ${k.badgeClass}`}>{k.badge}</span>
                      : <div className="kpi-sub">{k.sub}</div>
                    }
                  </div>
                ))}
              </div>

              {/* Main grid: left + right panel */}
              <div className="dash-grid">
                <div className="dash-left">

                  {/* Environmental Trends */}
                  <div className="chart-card">
                    <div className="chart-hdr">
                      <div>
                        <div className="chart-title">Environmental Trends <span style={{fontSize:'0.75rem',color:'#9ca3af',fontWeight:500}}>(Last 7 Days)</span></div>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:'0.75rem',flexWrap:'wrap'}}>
                        <div className="chart-legend">
                          {[{c:'#3b82f6',l:'Soil Moisture (%)'},{c:'#f97316',l:'Temperature (°C)'},{c:'#06b6d4',l:'Humidity (%)'},{c:'#8b5cf6',l:'Wind Speed (km/h)'}].map(d=>(
                            <div key={d.l} className="legend-item">
                              <div className="legend-dot" style={{background:d.c}}/>
                              {d.l}
                            </div>
                          ))}
                        </div>
                        <select className="chart-time-sel">
                          <option>Last 7 Days</option>
                          <option>Last 30 Days</option>
                        </select>
                      </div>
                    </div>
                    <MultiLineChart
                      datasets={[
                        {data:ENV_DATA.moisture,color:'#3b82f6'},
                        {data:ENV_DATA.temp,color:'#f97316'},
                        {data:ENV_DATA.humidity,color:'#06b6d4'},
                        {data:ENV_DATA.wind,color:'#8b5cf6'},
                      ]}
                      labels={DAYS_7}
                      height={195}
                    />
                  </div>

                  {/* Bottom row: irrigation + sensor status + moisture dist */}
                  <div className="dash-bottom-row">
                    {/* Irrigation Overview */}
                    <div className="irr-card">
                      <h3>Irrigation Overview</h3>
                      <div className="irr-donut-wrap">
                        <div className="irr-donut">
                          <DonutChart pct={60} size={90} color="#22c55e"/>
                          <div className="irr-donut-pct">60%</div>
                        </div>
                        <div className="irr-info">
                          {[['Next Irrigation','11:00 AM'],['Duration','30 min'],['Estimated Water','12.5 L']].map(([l,v])=>(
                            <div key={l} className="irr-row">
                              <span className="irr-row-icon"><Ic name="irrigation" size={11}/></span>
                              <span className="irr-row-label">{l}</span>
                              <span className="irr-row-val" style={{marginLeft:'auto'}}>{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="irr-water">
                        <span className="irr-water-label">Today's Water Usage</span>
                        <span className="irr-water-val" style={{color:'#22c55e'}}>24.5 / 40 L</span>
                      </div>
                      <div className="irr-water-bar"><div className="irr-water-fill" style={{width:'61%'}}/></div>
                      <button className="btn-irrigate" onClick={()=>showToast('Irrigation started!')}>
                        <Ic name="irrigation" size={13}/>Start Irrigation Now
                      </button>
                    </div>

                    {/* Sensor Status Overview */}
                    <div className="sensor-status-card">
                      <h3>Sensor Status Overview</h3>
                      <div className="ss-big-row">
                        {[{cls:'total',num:14,label:'Total Sensors'},{cls:'active',num:11,label:'Active'},{cls:'inactive',num:3,label:'Inactive'},{cls:'batt',num:2,label:'Battery Low'}].map(s=>(
                          <div key={s.label} className={`ss-big ${s.cls}`}>
                            <div className="ss-big-num">{s.num}</div>
                            <div className="ss-big-label">{s.label}</div>
                          </div>
                        ))}
                      </div>
                      <div className="ss-types-title">Sensor Types</div>
                      {[{icon:'moisture',name:'Soil Moisture',cnt:'4/5'},{icon:'temp',name:'Temperature',cnt:'4/5'},{icon:'humidity',name:'Humidity',cnt:'2/2'},{icon:'weather',name:'Weather',cnt:'2/2'},{icon:'wind',name:'Wind',cnt:'2/2'}].map(t=>(
                        <div key={t.name} className="ss-type-row">
                          <span className="ss-type-name"><Ic name={t.icon} size={13} color="#6b9475"/>{t.name}</span>
                          <span className={`ss-type-count${t.cnt.startsWith('3')?' warn':''}`}>{t.cnt}</span>
                        </div>
                      ))}
                    </div>

                    {/* Moisture Distribution */}
                    <div className="moist-card">
                      <h3>Moisture Distribution Across Fields</h3>
                      <BarChart
                        fields={[{label:'Field 1',val:55},{label:'Field 2',val:28},{label:'Field 3',val:43},{label:'Field 4',val:63}]}
                        height={130}
                      />
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.35rem',marginTop:'0.75rem'}}>
                        {[{l:'Field 1',v:55,c:'#22c55e'},{l:'Field 2',v:28,c:'#f59e0b'},{l:'Field 3',v:43,c:'#3b82f6'},{l:'Field 4',v:63,c:'#10b981'}].map(f=>(
                          <div key={f.l} style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'0.72rem',color:'#6b7280'}}>
                            <div style={{width:8,height:8,borderRadius:'50%',background:f.c,flexShrink:0}}/>
                            {f.l}: <strong style={{color:f.c}}>{f.v}%</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sensors Table */}
                  <div className="table-card">
                    <div className="table-card-hdr">
                      <h3>Sensors Status</h3>
                      <a onClick={()=>handleNav('sensors')}>View all sensors →</a>
                    </div>
                    <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
                      <table className="data-table" style={{minWidth:520}}>
                        <thead>
                          <tr>
                            <th>Sensor Name</th>
                            <th>Field / Zone</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Last Update</th>
                            <th>Battery</th>
                          </tr>
                        </thead>
                        <tbody>
                          {SENSOR_TABLE.map(s=>(
                            <tr key={s.name}>
                              <td style={{fontWeight:600,color:'#1a3a1f'}}>{s.name}</td>
                              <td style={{color:'#6b9475'}}>{s.field}</td>
                              <td>{s.type}</td>
                              <td>
                                <span className={`status-pill ${s.status}`}>
                                  <span className="status-pill-dot"/>
                                  {s.status.charAt(0).toUpperCase()+s.status.slice(1)}
                                </span>
                              </td>
                              <td style={{color:'#9ca3af'}}>{s.updated}</td>
                              <td>
                                {s.battery!=null?(
                                  <div className="battery-indicator">
                                    <div className="battery-bar">
                                      <div className="battery-fill" style={{width:`${s.battery}%`,background:s.battery>50?'#22c55e':s.battery>20?'#f59e0b':'#ef4444'}}/>
                                    </div>
                                    <span style={{fontSize:'0.72rem',color:'#6b7280'}}>{s.battery}%</span>
                                  </div>
                                ):(<span style={{color:'#d1d5db'}}>—</span>)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Bottom: Field Map + Activity Log */}
                  <div className="dash-bottom-2col">
                    {/* Field Map */}
                    <div className="field-map-card">
                      <div className="field-map-hdr">
                        <h3>Field Map</h3>
                        <button style={{width:26,height:26,border:'1.5px solid #e0e8e0',borderRadius:6,background:'#fff',cursor:'pointer',fontSize:'16px',display:'flex',alignItems:'center',justifyContent:'center',color:'#374151'}}>+</button>
                      </div>
                      <div className="field-map-svg-wrap">
                        <svg viewBox="0 0 330 280" style={{width:'100%',borderRadius:10,overflow:'hidden'}}>
                          {/* Satellite-style bg */}
                          <rect width="330" height="280" fill="#4a6741" rx="8"/>
                          <rect width="330" height="280" fill="url(#satbg)" rx="8"/>
                          <defs>
                            <pattern id="satbg" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                              <rect width="40" height="40" fill="#3d5c35"/>
                              <rect x="0" y="0" width="20" height="20" fill="#4a6741" opacity="0.5"/>
                              <rect x="20" y="20" width="20" height="20" fill="#405d37" opacity="0.5"/>
                            </pattern>
                          </defs>
                          {FIELD_MAP_FIELDS.map((f,i)=>(
                            <g key={i}>
                              <rect x={f.x} y={f.y} width={f.w} height={f.h} rx="6" fill={f.color} fillOpacity="0.75" stroke={f.color} strokeWidth="2"/>
                              <text x={f.x+f.w/2} y={f.y+f.h/2-10} fontSize="13" fontWeight="700" fill="#fff" textAnchor="middle" style={{fontFamily:'Manrope,sans-serif'}}>{f.label}</text>
                              <text x={f.x+f.w/2} y={f.y+f.h/2+8} fontSize="11" fill="rgba(255,255,255,0.9)" textAnchor="middle" style={{fontFamily:'Manrope,sans-serif'}}>💧 {f.val}%</text>
                            </g>
                          ))}
                          <text x="165" y="265" fontSize="9" fill="rgba(255,255,255,0.5)" textAnchor="middle">© AgriSense DZ Map</text>
                        </svg>
                      </div>
                    </div>

                    {/* Activity Log */}
                    <div className="activity-card">
                      <div className="activity-card-hdr">
                        <h3>Activity Log</h3>
                        <a>View all →</a>
                      </div>
                      {ACTIVITY_DATA.map((a,i)=>(
                        <div key={i} className="activity-item">
                          <div className="activity-dot" style={{background:a.dot}}/>
                          <span className="activity-text">{a.text}</span>
                          <span className="activity-time">{a.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>{/* /dash-left */}

                {/* ── RIGHT PANEL ── */}
                <div className="dash-right">
                  {/* Alerts */}
                  <div className="alerts-panel">
                    <div className="alerts-panel-hdr">
                      <h3>Alerts</h3>
                      <a onClick={()=>handleNav('alerts')}>View all</a>
                    </div>
                    {ALERTS_DATA.map((a,i)=>(
                      <div key={i} className="alert-item">
                        <div className={`alert-icon-wrap ${a.type}`}>
                          <Ic name={a.icon} size={14}/>
                        </div>
                        <div className="alert-text-block">
                          <div className="alert-name">{a.name}</div>
                          <div className="alert-sub">{a.sub}</div>
                        </div>
                        <div className="alert-time">{a.time}</div>
                      </div>
                    ))}
                  </div>

                  {/* Irrigation Control */}
                  <div className="irr-control-panel">
                    <div className="irr-control-hdr">
                      <h3>Irrigation Control</h3>
                      <div className="toggle-wrap" onClick={()=>setIrrigationOn(o=>!o)} style={{background:irrigationOn?'#22c55e':'#d1d5db'}}>
                        <div className="toggle-knob" style={{right:irrigationOn?2:undefined,left:irrigationOn?undefined:2}}/>
                      </div>
                    </div>
                    <div className="irr-mode">Automatic Mode</div>
                    <div style={{fontWeight:700,fontSize:'0.75rem',color:'#374151',marginBottom:'0.5rem'}}>Rules</div>
                    {IRR_RULES.map((r,i)=>(
                      <div key={i} className="irr-rule">
                        <div className="irr-rule-icon"><Ic name={r.icon} size={13}/></div>
                        <div className="irr-rule-text">
                          <div className="irr-rule-title">{r.title}</div>
                          {r.sub&&<div className="irr-rule-sub">{r.sub}</div>}
                        </div>
                      </div>
                    ))}
                    <button className="btn-edit-rules" onClick={()=>showToast('Edit irrigation rules')}>
                      <Ic name="edit" size={13}/>Edit Irrigation Rules
                    </button>
                  </div>
                </div>
              </div>
            </>)}

            {/* ══ OTHER TABS (placeholder) ══ */}
            {tab!=='dashboard'&&(
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'40vh',color:'#6b9475',gap:'0.75rem'}}>
                <div style={{fontSize:'3.5rem'}}></div>
                <h2 style={{fontSize:'1.2rem',fontWeight:800,color:'#1a3a1f'}}>{currentLabel}</h2>
                <p style={{fontSize:'0.85rem',color:'#9ca3af'}}>This section is coming soon.</p>
                <button onClick={()=>setTab('dashboard')} style={{marginTop:'0.5rem',padding:'8px 20px',border:'none',borderRadius:'50px',background:'linear-gradient(135deg,#22c55e,#16a34a)',color:'#fff',fontWeight:700,cursor:'pointer',fontFamily:'Manrope,sans-serif',fontSize:'0.85rem'}}>← Back to Dashboard</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && <div className="db-toast">{toast}</div>}
    </>
  )
}