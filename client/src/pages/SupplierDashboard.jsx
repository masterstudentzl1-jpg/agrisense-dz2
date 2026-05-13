import { useState, useEffect, useRef, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import logoo from '../assets/logoo.png'

// ─── SVG ICON SYSTEM ─────────────────────────────────────────────────────────
const Icons = {
  overview:    ['M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'],
  products:    ['M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z'],
  orders:      ['M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'],
  analytics:   ['M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'],
  settings:    ['M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'],
  revenue:     'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  package_kpi: ['M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z'],
  cart:        ['M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'],
  star:        'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
  trending:    'M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941',
  search:      'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z',
  refresh:     'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  bell:        'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0',
  chevronDown: 'M19.5 8.25l-7.5 7.5-7.5-7.5',
  chevronUp:   'M4.5 15.75l7.5-7.5 7.5 7.5',
  logout:      'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75',
  menu:        ['M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'],
  close:       'M6 18L18 6M6 6l12 12',
  home:        ['M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75'],
  user:        ['M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'],
  plus:        'M12 4.5v15m7.5-7.5h-15',
  edit:        'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125',
  trash:       ['M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'],
  check:       'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  shield:      'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
  store:       ['M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z'],
  payment:     ['M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z'],
  download:    'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3',
  mapPin:      ['M15 10.5a3 3 0 11-6 0 3 3 0 016 0z', 'M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z'],
  fulfill:     'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z',
  clock:       'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
  repeat:      'M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.657 48.657 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3',
}

const Ic = ({ name, size = 16, style = {} }) => {
  const d = Icons[name]
  if (!d) return null
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={style}>
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
.tb-user-btn{display:flex;align-items:center;gap:8px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:50px;padding:5px 12px 5px 5px;cursor:pointer;transition:background 0.2s;position:relative;flex-shrink:0;}
.tb-user-btn:hover{background:#dbeafe}
.tb-user-av{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#1d4ed8);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;flex-shrink:0;}
.tb-user-name{font-size:0.82rem;font-weight:700;color:#1d4ed8}
.user-dropdown{position:absolute;top:calc(100% + 8px);right:0;background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:0.5rem;min-width:220px;box-shadow:0 8px 30px rgba(0,0,0,0.12);z-index:500;}
.ud-header{padding:0.75rem 0.75rem 0.5rem;border-bottom:1px solid #f3f4f6;margin-bottom:0.25rem}
.ud-name{font-size:0.92rem;font-weight:800;color:#0d1f0f}
.ud-role{font-size:0.75rem;color:#6b7280;margin-top:2px}
.ud-item{display:flex;align-items:center;gap:10px;padding:0.65rem 0.75rem;border-radius:10px;cursor:pointer;font-size:0.85rem;font-weight:600;color:#374151;transition:background 0.15s;border:none;background:none;width:100%;text-align:left;font-family:'Manrope',sans-serif;}
.ud-item:hover{background:#f9fafb}
.ud-item.danger{color:#ef4444}
.ud-item.danger:hover{background:#fef2f2}
.ud-sep{height:1px;background:#f3f4f6;margin:0.25rem 0}
.tb-live{display:flex;align-items:center;gap:6px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:50px;padding:5px 12px;font-size:0.72rem;font-weight:700;color:#1d4ed8;white-space:nowrap;flex-shrink:0;}
.tb-live-dot{width:7px;height:7px;border-radius:50%;background:#3b82f6;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
.sb-header{padding:1.25rem 1.25rem 0.5rem;display:flex;align-items:center;justify-content:space-between;}
.sb-brand-row{display:flex;align-items:center;gap:10px}
.sb-logo-img{width:36px;height:36px;object-fit:contain;border-radius:8px}
.sb-brand-text .sb-name{font-size:1rem;font-weight:800;color:#fff}
.sb-brand-text .sb-name span{color:#60a5fa}
.sb-brand-text .sb-sub{font-size:0.65rem;color:#60a5fa;font-weight:600;text-transform:uppercase;letter-spacing:0.08em}
.sb-close-btn{background:rgba(255,255,255,0.08);border:none;cursor:pointer;width:28px;height:28px;border-radius:8px;display:none;align-items:center;justify-content:center;color:#9ca3af;transition:background 0.15s;}
.sb-close-btn:hover{background:rgba(255,255,255,0.15)}
.sb-system{margin:0.75rem 1.25rem 1rem;background:rgba(59,130,246,0.15);border:1px solid rgba(96,165,250,0.25);border-radius:12px;padding:0.75rem 1rem;display:flex;align-items:center;gap:10px;}
.sb-sys-dot{width:8px;height:8px;border-radius:50%;background:#3b82f6;box-shadow:0 0 8px rgba(59,130,246,0.5);flex-shrink:0}
.sb-sys-info .sb-sys-title{font-size:0.82rem;font-weight:700;color:#60a5fa}
.sb-sys-info .sb-sys-sub{font-size:0.68rem;color:#93c5fd;margin-top:1px}
.sb-section-label{font-size:0.6rem;font-weight:700;color:#4a6080;text-transform:uppercase;letter-spacing:0.14em;padding:0.75rem 1.25rem 0.3rem;}
.sb-nav-group{display:flex;flex-direction:column;gap:2px;padding:0 0.75rem;margin-bottom:0.5rem}
.sb-item{display:flex;align-items:center;gap:10px;padding:0.65rem 0.75rem;border-radius:10px;cursor:pointer;border:none;background:none;width:100%;text-align:left;transition:all 0.15s;}
.sb-item:hover{background:rgba(255,255,255,0.06)}
.sb-item.active{background:rgba(59,130,246,0.18);border-left:3px solid #3b82f6}
.sb-item-icon{width:20px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#9ca3af}
.sb-item-label{font-size:0.88rem;font-weight:600;color:#9ca3af}
.sb-item.active .sb-item-icon,.sb-item.active .sb-item-label{color:#60a5fa}
.sb-item:hover .sb-item-icon,.sb-item:hover .sb-item-label{color:#d1d5db}
.sb-badge{margin-left:auto;background:#ef4444;color:#fff;font-size:0.62rem;font-weight:800;padding:2px 7px;border-radius:50px}
.sb-foot{margin-top:auto;border-top:1px solid rgba(255,255,255,0.08);padding:1rem 1.25rem;display:flex;align-items:center;gap:10px;}
.sb-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#1d4ed8);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;flex-shrink:0}
.sb-user-info .sb-user-name{font-size:0.85rem;font-weight:700;color:#fff}
.sb-user-info .sb-user-role{font-size:0.68rem;color:#60a5fa;font-weight:500}
.sb-logout-btn{margin-left:auto;background:none;border:none;cursor:pointer;color:#6b7280;transition:color 0.2s;padding:4px;display:flex;align-items:center}
.sb-logout-btn:hover{color:#ef4444}
.db-content{flex:1;padding:1.5rem 2rem;overflow-y:auto}
.page-header{margin-bottom:1.5rem}
.page-header h1{font-size:1.5rem;font-weight:800;color:#0d1f0f}
.page-header p{font-size:0.85rem;color:#6b7280;margin-top:3px}
.page-header-row{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem}
.live-badge{display:flex;align-items:center;gap:6px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:50px;padding:6px 14px;font-size:0.75rem;font-weight:700;color:#1d4ed8;white-space:nowrap;flex-shrink:0}
.live-dot{width:7px;height:7px;border-radius:50%;background:#3b82f6;animation:pulse 2s infinite}
.kpi-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-bottom:1.5rem}
.kpi-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.5rem;position:relative;overflow:hidden;transition:box-shadow 0.2s}
.kpi-card:hover{box-shadow:0 4px 20px rgba(0,0,0,0.07)}
.kpi-accent{position:absolute;top:0;left:0;right:0;height:3px;border-radius:16px 16px 0 0}
.kpi-accent.blue{background:#3b82f6}.kpi-accent.green{background:#22c55e}.kpi-accent.amber{background:#f59e0b}.kpi-accent.red{background:#ef4444}.kpi-accent.purple{background:#7c3aed}
.kpi-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;margin-top:0.5rem}
.kpi-icon-wrap{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;}
.kpi-icon-wrap.blue{background:#eff6ff;color:#2563eb}.kpi-icon-wrap.green{background:#f0fdf4;color:#16a34a}.kpi-icon-wrap.amber{background:#fffbeb;color:#d97706}.kpi-icon-wrap.red{background:#fef2f2;color:#dc2626}.kpi-icon-wrap.purple{background:#faf5ff;color:#7c3aed}
.kpi-trend{font-size:0.75rem;font-weight:700}
.kpi-trend.up{color:#16a34a}.kpi-trend.down{color:#ef4444}.kpi-trend.neutral{color:#6b7280}
.kpi-value{font-size:2rem;font-weight:800;color:#0d1f0f;line-height:1;margin-bottom:0.25rem}
.kpi-label{font-size:0.82rem;font-weight:600;color:#374151;margin-bottom:2px}
.kpi-sub{font-size:0.72rem;color:#9ca3af}
.orders-section{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.5rem;margin-bottom:1.25rem}
.orders-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem}
.orders-head h3{font-size:1rem;font-weight:700;color:#0d1f0f}
.orders-head a{font-size:0.82rem;color:#3b82f6;font-weight:700;text-decoration:none;cursor:pointer}
.order-card{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:1.25rem;margin-bottom:1rem;transition:all 0.2s;cursor:pointer}
.order-card:hover{box-shadow:0 4px 12px rgba(0,0,0,0.05);border-color:#bfdbfe}
.order-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:0.75rem}
.order-id{font-size:0.78rem;color:#9ca3af;font-weight:600}
.order-status{font-size:0.72rem;font-weight:700;padding:3px 10px;border-radius:50px}
.order-status.new{background:#eff6ff;color:#1d4ed8}.order-status.packed{background:#fffbeb;color:#92400e}.order-status.shipped{background:#dcfce7;color:#16a34a}.order-status.cancelled{background:#fef2f2;color:#dc2626}
.order-farmer{font-size:0.95rem;font-weight:700;color:#0d1f0f;margin-bottom:4px}
.order-loc{font-size:0.75rem;color:#9ca3af;margin-bottom:0.75rem;display:flex;align-items:center;gap:4px}
.order-items-text{font-size:0.82rem;color:#6b7280;margin-bottom:0.75rem;padding-bottom:0.75rem;border-bottom:1px solid #f3f4f6}
.order-footer{display:flex;align-items:center;justify-content:space-between}
.order-total{font-size:1.1rem;font-weight:800;color:#1d4ed8}
.products-section{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.5rem;margin-bottom:1.25rem}
.products-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem}
.products-head h3{font-size:1rem;font-weight:700;color:#0d1f0f}
.btn-primary{background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:#fff;border:none;padding:8px 18px;border-radius:50px;font-size:0.82rem;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif;display:flex;align-items:center;gap:6px;transition:transform 0.15s}
.btn-primary:hover{transform:translateY(-1px)}
.data-table{width:100%;border-collapse:collapse}
.data-table th{font-size:0.7rem;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;padding:0.75rem 1rem;text-align:left;border-bottom:1px solid #f3f4f6;background:#fafafa}
.data-table td{padding:1rem;font-size:0.88rem;color:#374151;border-bottom:1px solid #f3f4f6}
.data-table tr:last-child td{border-bottom:none}
.data-table tr:hover td{background:#fafafa}
.prod-cell{display:flex;align-items:center;gap:12px}
.prod-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;}
.prod-icon.green{background:#f0fdf4;color:#16a34a}.prod-icon.blue{background:#eff6ff;color:#2563eb}.prod-icon.purple{background:#faf5ff;color:#7c3aed}.prod-icon.amber{background:#fffbeb;color:#d97706}
.prod-info .prod-name{font-size:0.9rem;font-weight:700;color:#0d1f0f}
.prod-info .prod-cat{font-size:0.72rem;color:#9ca3af}
.status-pill{display:inline-block;padding:3px 10px;border-radius:50px;font-size:0.72rem;font-weight:700;cursor:pointer}
.status-pill.active{background:#dcfce7;color:#16a34a}
.status-pill.draft{background:#f3f4f6;color:#6b7280}
.action-btns{display:flex;gap:6px}
.action-btn{display:flex;align-items:center;gap:4px;padding:5px 12px;border-radius:8px;border:1px solid #e5e7eb;background:#fff;font-size:0.75rem;font-weight:600;cursor:pointer;color:#6b7280;font-family:'Manrope',sans-serif;transition:all 0.15s}
.action-btn:hover{border-color:#3b82f6;color:#1d4ed8;background:#eff6ff}
.action-btn.danger:hover{border-color:#ef4444;color:#dc2626;background:#fef2f2}
.search-filter-row{display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:0.75rem 1rem;flex-wrap:wrap}
.search-input-wrap{flex:1;min-width:160px;display:flex;align-items:center;gap:8px}
.search-input-wrap input{border:none;outline:none;font-size:0.88rem;font-family:'Manrope',sans-serif;color:#374151;background:none;width:100%}
.search-input-wrap input::placeholder{color:#9ca3af}
.filter-divider{width:1px;height:24px;background:#e5e7eb}
.filter-btns{display:flex;gap:0.5rem;flex-wrap:wrap}
.filter-btn-s{padding:5px 12px;border-radius:50px;border:1.5px solid #e5e7eb;background:#fff;font-size:0.78rem;font-weight:600;cursor:pointer;color:#6b7280;font-family:'Manrope',sans-serif;transition:all 0.15s}
.filter-btn-s.active{background:#3b82f6;border-color:#3b82f6;color:#fff}
.supplier-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem;margin-bottom:1rem}
.supplier-stat{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:1.25rem;cursor:pointer;transition:box-shadow 0.2s;display:flex;align-items:center;gap:12px}
.supplier-stat:hover{box-shadow:0 4px 12px rgba(0,0,0,0.06)}
.supplier-stat-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.supplier-stat-val{font-size:1.1rem;font-weight:800;margin-bottom:2px}
.supplier-stat-label{font-size:0.68rem;color:#9ca3af}
.rating-stars{display:flex;align-items:center;gap:2px;color:#fbbf24}
.chart-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.5rem;margin-bottom:1.25rem}
.chart-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1.25rem}
.chart-head-left h3{font-size:1rem;font-weight:700;color:#0d1f0f}
.chart-head-left p{font-size:0.75rem;color:#9ca3af;margin-top:2px}
.chart-legend{display:flex;gap:1.25rem;justify-content:center;margin-top:0.75rem;flex-wrap:wrap}
.legend-item{display:flex;align-items:center;gap:5px;font-size:0.75rem;color:#6b7280;font-weight:500}
.legend-dot{width:8px;height:8px;border-radius:50%}
.chart-svg{width:100%;overflow:visible}
.settings-layout{display:grid;grid-template-columns:240px 1fr;gap:1.5rem}
.settings-nav{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:0.75rem;height:fit-content}
.settings-nav-item{display:flex;align-items:center;gap:8px;padding:0.65rem 0.75rem;border-radius:10px;cursor:pointer;font-size:0.85rem;font-weight:600;color:#6b7280;transition:all 0.15s;border:none;background:none;width:100%;text-align:left}
.settings-nav-item:hover{background:#f9fafb;color:#0d1f0f}
.settings-nav-item.active{background:#eff6ff;color:#1d4ed8}
.settings-panel{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.75rem}
.settings-profile-head{display:flex;align-items:center;gap:1rem;margin-bottom:2rem}
.settings-avatar{width:72px;height:72px;border-radius:20px;background:linear-gradient(135deg,#3b82f6,#1d4ed8);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:#fff;flex-shrink:0}
.settings-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.settings-field label{display:block;font-size:0.78rem;font-weight:700;color:#374151;margin-bottom:0.4rem}
.settings-field input{width:100%;padding:0.7rem 1rem;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.88rem;font-family:'Manrope',sans-serif;color:#0d1f0f;background:#fafafa;outline:none;transition:border-color 0.2s}
.settings-field input:focus{border-color:#3b82f6;background:#fff}
.btn-save{padding:10px 24px;border:none;border-radius:10px;background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:#fff;font-size:0.88rem;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif;margin-top:1.25rem;box-shadow:0 4px 14px rgba(59,130,246,0.3)}
.save-success{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:8px 14px;font-size:0.82rem;color:#16a34a;font-weight:600;margin-top:0.75rem;display:inline-block}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:600;display:flex;align-items:center;justify-content:center;padding:1rem;}
.modal-box{background:#fff;border-radius:20px;width:100%;max-width:500px;padding:1.75rem;box-shadow:0 20px 50px rgba(0,0,0,0.25);animation:modalIn 0.25s ease}
@keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(16px)}to{opacity:1;transform:none}}
.modal-title{font-size:1.1rem;font-weight:800;color:#0d1f0f;margin-bottom:1.25rem;display:flex;align-items:center;justify-content:space-between}
.modal-close{background:none;border:1px solid #e5e7eb;border-radius:50%;width:30px;height:30px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;color:#6b7280}
.modal-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem}
.modal-field label{display:block;font-size:0.75rem;font-weight:700;color:#374151;margin-bottom:0.3rem}
.modal-field input,.modal-field select,.modal-field textarea{width:100%;padding:0.65rem 0.85rem;border:1.5px solid #e5e7eb;border-radius:9px;font-size:0.85rem;font-family:'Manrope',sans-serif;background:#fafafa;outline:none;transition:border-color 0.2s}
.modal-field input:focus,.modal-field select:focus{border-color:#3b82f6}
.modal-actions{display:flex;gap:0.6rem;margin-top:1rem}
.btn-modal-cancel{flex:1;padding:0.8rem;border:1.5px solid #e5e7eb;border-radius:10px;background:#fff;font-size:0.88rem;font-weight:600;cursor:pointer;font-family:'Manrope',sans-serif}
.btn-modal-save{flex:2;padding:0.8rem;border:none;border-radius:10px;background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:#fff;font-size:0.88rem;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif}
.order-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem}
.order-detail-cell{background:#f9fafb;border-radius:10px;padding:0.75rem}
.order-detail-label{font-size:0.7rem;color:#9ca3af;margin-bottom:3px;text-transform:uppercase;letter-spacing:0.05em}
.order-detail-val{font-size:0.88rem;font-weight:700;color:#0d1f0f}
.db-toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#0d1117;color:#60a5fa;padding:0.75rem 1.5rem;border-radius:50px;font-size:0.85rem;font-weight:700;z-index:700;box-shadow:0 8px 24px rgba(0,0,0,0.3);animation:toastIn 0.3s ease;white-space:nowrap}
@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%)}}
.no-results{text-align:center;padding:2.5rem;color:#9ca3af;font-size:0.9rem}
.time-btns{display:flex;gap:0.4rem;flex-wrap:wrap}
.time-btn{padding:6px 12px;border-radius:50px;border:1.5px solid #e5e7eb;background:#fff;font-size:0.75rem;font-weight:600;cursor:pointer;color:#6b7280;font-family:'Manrope',sans-serif;transition:all 0.15s}
.time-btn.active{background:#3b82f6;border-color:#3b82f6;color:#fff}
.export-btn{display:flex;align-items:center;gap:5px;padding:6px 14px;border-radius:50px;border:1.5px solid #e5e7eb;background:#fff;font-size:0.78rem;font-weight:600;cursor:pointer;color:#374151;font-family:'Manrope',sans-serif;transition:all 0.15s}
.export-btn:hover{border-color:#3b82f6;color:#1d4ed8}
@media(max-width:900px){.kpi-grid{grid-template-columns:repeat(2,1fr)}.supplier-stats{grid-template-columns:repeat(3,1fr)}.settings-layout{grid-template-columns:1fr}.settings-form-grid{grid-template-columns:1fr}.modal-form-grid{grid-template-columns:1fr}.order-detail-grid{grid-template-columns:1fr}}
@media(max-width:768px){.sb{transform:translateX(-100%);box-shadow:4px 0 30px rgba(0,0,0,0.2);z-index:300}.sb.mobile-open{transform:translateX(0)}.sb-overlay{display:block}.sb-overlay.hidden{display:none}.sb-close-btn{display:flex!important}.db-main{margin-left:0!important}.tb-hamburger{display:flex}.tb-search{display:none}.db-content{padding:1rem}.topbar{padding:0 1rem}.kpi-grid{grid-template-columns:1fr;gap:0.75rem}.data-table th,.data-table td{padding:0.75rem;font-size:0.78rem}.supplier-stats{grid-template-columns:1fr}.settings-form-grid{grid-template-columns:1fr}}
@media(max-width:480px){.kpi-value{font-size:1.6rem}.order-card{padding:1rem}.action-btns{flex-direction:column;gap:4px}}
`

function BarChart({ data, labels, color, height = 180, yMax }) {
  const W=700,H=height,PL=45,PR=10,PT=10,PB=30
  const cw=W-PL-PR,ch=H-PT-PB
  const hi=yMax??Math.max(...data)
  const bw=(cw/labels.length)*0.5,groupW=cw/labels.length
  const yTicks=[0,hi*.25,hi*.5,hi*.75,hi].map(v=>Math.round(v))
  return(
    <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" style={{height}}>
      {yTicks.map((t,i)=>{const y=PT+(1-t/hi)*ch;return<g key={i}><line x1={PL} y1={y} x2={W-PR} y2={y} stroke="#f3f4f6" strokeWidth="1"/><text x={PL-5} y={y+4} fontSize="10" fill="#9ca3af" textAnchor="end">{t}</text></g>})}
      {labels.map((l,gi)=>{const bh=(data[gi]/hi)*ch,x=PL+gi*groupW+groupW*0.25,y=PT+ch-bh;return<g key={gi}><rect x={x} y={y} width={bw} height={bh} fill={color} rx="4"/><text x={PL+gi*groupW+groupW/2} y={H-5} fontSize="10" fill="#9ca3af" textAnchor="middle">{l}</text></g>})}
    </svg>
  )
}

const INIT_PRODUCTS = [
  { id:1, iconName:'products', name:'AgroSense Pro', cat:'Sensor', price:12900, stock:48, status:'active', sales:124, rating:4.8 },
  { id:2, iconName:'cart', name:'IrriBot Controller', cat:'Irrigation', price:8500, stock:23, status:'active', sales:89, rating:4.6 },
  { id:3, iconName:'analytics', name:'SolarHub Gateway', cat:'Network', price:6200, stock:5, status:'active', sales:67, rating:4.9 },
  { id:4, iconName:'check', name:'CropCam AI', cat:'Camera', price:19900, stock:0, status:'draft', sales:12, rating:4.5 },
  { id:5, iconName:'overview', name:'WeatherNode', cat:'Monitoring', price:9400, stock:31, status:'active', sales:45, rating:4.7 },
]

const INIT_ORDERS = [
  { id:'ORD-2401', farmer:'Customer 1', loc:'Bouira', items:'2× AgroSense Pro, 1× SolarHub Gateway', total:32000, status:'new', date:'Today, 10:24 AM' },
  { id:'ORD-2400', farmer:'Customer 2', loc:'Blida', items:'1× IrriBot Controller, 2× WeatherNode', total:27300, status:'packed', date:'Yesterday, 03:45 PM' },
  { id:'ORD-2399', farmer:'Customer 3', loc:'Tizi Ouzou', items:'3× AgroSense Pro', total:38700, status:'shipped', date:'2 days ago' },
  { id:'ORD-2398', farmer:'Customer 4', loc:'Sétif', items:'1× CropCam AI, 2× WeatherNode', total:38700, status:'new', date:'3 days ago' },
]

const STATUS_CYCLE = { new:'packed', packed:'shipped', shipped:'shipped' }
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun']
const REVENUE_DATA = [310000, 380000, 420000, 450000, 487200, 512000]

const navSectionsConfig = [
  { label: 'Supplier Menu', items: [
    { key: 'overview', iconName: 'overview', label: 'Overview' },
    { key: 'products', iconName: 'products', label: 'My Products' },
    { key: 'orders',   iconName: 'orders',   label: 'Orders' },
  ]},
  { label: 'Manage', items: [
    { key: 'analytics', iconName: 'analytics', label: 'Analytics' },
    { key: 'settings',  iconName: 'settings',  label: 'Settings' },
  ]},
]

const settingsNavConfig = [
  {key:'Profile',iconName:'user'},
  {key:'Store Settings',iconName:'store'},
  {key:'Payments',iconName:'payment'},
  {key:'Notifications',iconName:'bell'},
  {key:'Security',iconName:'shield'},
]

export default function SupplierDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userDropOpen, setUserDropOpen] = useState(false)
  const [now, setNow] = useState(new Date())
  const dropRef = useRef(null)
  const [products, setProducts] = useState(INIT_PRODUCTS)
  const [orders, setOrders] = useState(INIT_ORDERS)
  const [toast, setToast] = useState('')
  const [analyticsTime, setAnalyticsTime] = useState('30 Days')
  const [settingsTab, setSettingsTab] = useState('Profile')
  const [savedSettings, setSavedSettings] = useState(false)
  const [productSearch, setProductSearch] = useState('')
  const [productStatusFilter, setProductStatusFilter] = useState('All')
  const [orderSearch, setOrderSearch] = useState('')
  const [orderStatusFilter, setOrderStatusFilter] = useState('All')
  const [globalSearch, setGlobalSearch] = useState('')
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({ iconName:'products', name:'', cat:'Sensor', price:'', stock:'' })
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [editProduct, setEditProduct] = useState(null)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  useEffect(() => { const id = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(id) }, [])
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setUserDropOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleTabChange = (key) => { setTab(key); if (window.innerWidth <= 768) setSidebarOpen(false) }

  const handleGlobalSearch = (e) => {
    const v = e.target.value; setGlobalSearch(v)
    if (!v) return
    const l = v.toLowerCase()
    if (['product','sensor','camera','irrigat'].some(k => l.includes(k))) setTab('products')
    else if (['order','ord-','farmer'].some(k => l.includes(k))) setTab('orders')
    else if (['analytics','revenue','sales'].some(k => l.includes(k))) setTab('analytics')
  }

  const handleExport = () => {
    const rows = [['Month','Revenue (DZD)'], ...MONTHS.map((m,i) => [m, REVENUE_DATA[i]])]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'supplier-revenue.csv'; a.click()
    showToast('✅ Revenue data exported')
  }

  const advanceOrder = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: STATUS_CYCLE[o.status] || o.status } : o))
    const o = orders.find(x => x.id === orderId)
    showToast(`✅ ${orderId} → ${STATUS_CYCLE[o?.status]?.toUpperCase()}`)
  }
  const cancelOrder = (orderId) => { setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o)); showToast(`❌ ${orderId} cancelled`); setSelectedOrder(null) }
  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) return
    const p = { id: Date.now(), iconName: 'products', name: newProduct.name, cat: newProduct.cat, price: parseInt(newProduct.price)||0, stock: parseInt(newProduct.stock)||0, status: 'draft', sales: 0, rating: 0 }
    setProducts(prev => [...prev, p]); setNewProduct({ iconName:'products', name:'', cat:'Sensor', price:'', stock:'' }); setShowAddProduct(false); showToast(`✅ "${p.name}" listed`)
  }
  const toggleProductStatus = (id) => { setProducts(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'active' ? 'draft' : 'active' } : p)); showToast('Product status updated') }
  const deleteProduct = (id) => { setProducts(prev => prev.filter(p => p.id !== id)); showToast('Product removed') }

  const filteredProducts = useMemo(() => {
    let p = products
    if (productStatusFilter !== 'All') p = p.filter(x => x.status === productStatusFilter.toLowerCase())
    if (productSearch) p = p.filter(x => x.name.toLowerCase().includes(productSearch.toLowerCase()) || x.cat.toLowerCase().includes(productSearch.toLowerCase()))
    return p
  }, [products, productSearch, productStatusFilter])

  const filteredOrders = useMemo(() => {
    let o = orders
    if (orderStatusFilter !== 'All') o = o.filter(x => x.status === orderStatusFilter.toLowerCase())
    if (orderSearch) o = o.filter(x => x.farmer.toLowerCase().includes(orderSearch.toLowerCase()) || x.id.toLowerCase().includes(orderSearch.toLowerCase()) || x.loc.toLowerCase().includes(orderSearch.toLowerCase()))
    return o
  }, [orders, orderSearch, orderStatusFilter])

  const firstName = user?.firstName || 'Supplier'
  const lastName = user?.lastName || ''
  const initials = `${firstName[0]}${lastName[0] || ''}`
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)
  const pendingOrders = orders.filter(o => o.status === 'new').length
  const avgRating = products.filter(p => p.rating > 0).length > 0
    ? (products.filter(p => p.rating > 0).reduce((s, p) => s + p.rating, 0) / products.filter(p => p.rating > 0).length).toFixed(1) : '—'

  const currentPageLabel = navSectionsConfig.flatMap(s => s.items).find(i => i.key === tab)?.label || 'Dashboard'

  const [settingsForm, setSettingsForm] = useState({ businessName: firstName + ' SARL', taxId: '', email: firstName.toLowerCase() + '@supplier.dz', phone: '+213 5XX XXX XXX', address: '', bankAccount: '' })

  return (
    <>
      <style>{S}</style>
      <div className="db">
        <div className={`sb-overlay${sidebarOpen ? '' : ' hidden'}`} onClick={() => setSidebarOpen(false)} />

        <aside className={`sb${sidebarOpen ? ' mobile-open' : ''}`}>
          <div className="sb-header">
            <div className="sb-brand-row">
              <img src={logoo} alt="logo" className="sb-logo-img" />
              <div className="sb-brand-text"><div className="sb-name">Agri<span>Sense</span></div><div className="sb-sub">Supplier Portal</div></div>
            </div>
            <button className="sb-close-btn" onClick={() => setSidebarOpen(false)}><Ic name="close" size={14}/></button>
          </div>
          <div className="sb-system">
            <div className="sb-sys-dot" />
            <div className="sb-sys-info">
              <div className="sb-sys-title">Active Store</div>
              <div className="sb-sys-sub">{products.filter(p => p.status === 'active').length} products live</div>
            </div>
          </div>
          {navSectionsConfig.map(section => (
            <div key={section.label}>
              <div className="sb-section-label">{section.label}</div>
              <div className="sb-nav-group">
                {section.items.map(n => (
                  <button key={n.key} className={`sb-item${tab === n.key ? ' active' : ''}`} onClick={() => handleTabChange(n.key)}>
                    <span className="sb-item-icon"><Ic name={n.iconName} size={16}/></span>
                    <span className="sb-item-label">{n.label}</span>
                    {n.key === 'orders' && pendingOrders > 0 && <span className="sb-badge">{pendingOrders}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="sb-foot">
            <div className="sb-avatar">{initials}</div>
            <div className="sb-user-info"><div className="sb-user-name">{firstName} {lastName}</div><div className="sb-user-role">Supplier</div></div>
            <button className="sb-logout-btn" onClick={() => { logout(); navigate('/') }}><Ic name="logout" size={18}/></button>
          </div>
        </aside>

        <div className="db-main">
          <div className="topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <button className="tb-hamburger" onClick={() => setSidebarOpen(o => !o)}><Ic name="menu" size={20}/></button>
              <div className="tb-breadcrumb">
                <span className="tb-brand">AgriSense DZ</span><span className="tb-sep">›</span><span className="tb-page">{currentPageLabel}</span>
              </div>
            </div>
            <div className="tb-search">
              <Ic name="search" size={14} style={{color:'#9ca3af',flexShrink:0}}/>
              <input placeholder="Search products, orders..." value={globalSearch} onChange={handleGlobalSearch} onKeyDown={e => { if (e.key === 'Escape') setGlobalSearch('') }} />
            </div>
            <div className="tb-actions">
              <span className="tb-time">{timeStr}</span>
              <button className="tb-icon-btn" onClick={() => showToast('✅ Data refreshed')}><Ic name="refresh" size={16}/></button>
              <button className="tb-icon-btn" onClick={() => handleTabChange('orders')}>
                <Ic name="bell" size={16}/>{pendingOrders > 0 && <span className="tb-notif-dot" />}
              </button>
              {tab === 'overview' && <div className="tb-live"><span className="tb-live-dot" />Live · updated now</div>}
              <div style={{ position: 'relative' }} ref={dropRef}>
                <button className="tb-user-btn" onClick={() => setUserDropOpen(o => !o)}>
                  <div className="tb-user-av">{initials}</div>
                  <span className="tb-user-name">{firstName}</span>
                  <Ic name={userDropOpen?'chevronUp':'chevronDown'} size={10} style={{color:'#1d4ed8'}}/>
                </button>
                {userDropOpen && (
                  <div className="user-dropdown">
                    <div className="ud-header"><div className="ud-name">{firstName} {lastName}</div><div className="ud-role">Supplier · {user?.wilaya || 'Algiers'}</div></div>
                    <button className="ud-item" onClick={() => { setTab('settings'); setUserDropOpen(false) }}><Ic name="user" size={15}/>Profile &amp; Settings</button>
                    <button className="ud-item" onClick={() => navigate('/')}><Ic name="home" size={15}/>Back to Home</button>
                    <div className="ud-sep" />
                    <button className="ud-item danger" onClick={() => { logout(); navigate('/') }}><Ic name="logout" size={15}/>Sign out</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="db-content">
            {/* OVERVIEW */}
            {tab === 'overview' && (<>
              <div className="page-header-row">
                <div className="page-header"><h1>{greeting}, {firstName} </h1><p>Manage your products, track orders, and grow your B2B sales.</p></div>
                <div className="live-badge"><span className="live-dot" />Live · updated now</div>
              </div>
              <div className="kpi-grid">
                {[
                  { iconName:'revenue', iconClass:'blue', accent:'blue', val:`${totalRevenue.toLocaleString()}`, label:'Revenue (DZD)', sub:'All confirmed orders', trend:'↗ 12%', dir:'up' },
                  { iconName:'package_kpi', iconClass:'purple', accent:'purple', val:products.filter(p=>p.status==='active').length, label:'Active Products', sub:`${products.filter(p=>p.status==='draft').length} drafts`, trend:'↗', dir:'up' },
                  { iconName:'cart', iconClass:'amber', accent:'amber', val:pendingOrders, label:'Pending Orders', sub:'To be processed', trend:pendingOrders>0?'↗ action needed':'All clear', dir:pendingOrders>0?'up':'neutral' },
                  { iconName:'star', iconClass:'green', accent:'green', val:avgRating, label:'Avg Rating', sub:'From reviews', trend:'Top seller', dir:'up' },
                ].map((k, i) => (
                  <div key={i} className="kpi-card">
                    <div className={`kpi-accent ${k.accent}`} />
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
              <div className="supplier-stats">
                {[
                  {iconName:'fulfill',color:'#dcfce7',iconColor:'#16a34a',val:'98%',label:'Order fulfillment'},
                  {iconName:'clock',color:'#eff6ff',iconColor:'#2563eb',val:'2.4d',label:'Avg delivery'},
                  {iconName:'repeat',color:'#faf5ff',iconColor:'#7c3aed',val:'78%',label:'Return customers'},
                ].map((s,i)=>(
                  <div key={i} className="supplier-stat" onClick={() => handleTabChange(i===0?'orders':'analytics')}>
                    <div className="supplier-stat-icon" style={{background:s.color,color:s.iconColor}}><Ic name={s.iconName} size={20}/></div>
                    <div><div className="supplier-stat-val">{s.val}</div><div className="supplier-stat-label">{s.label}</div></div>
                  </div>
                ))}
              </div>
              <div className="orders-section">
                <div className="orders-head"><h3>Recent Orders</h3><a onClick={() => handleTabChange('orders')}>View all →</a></div>
                {orders.slice(0, 3).map(o => (
                  <div key={o.id} className="order-card" onClick={() => setSelectedOrder(o)}>
                    <div className="order-header"><span className="order-id">{o.id} · {o.date}</span><span className={`order-status ${o.status}`}>{o.status.toUpperCase()}</span></div>
                    <div className="order-farmer">{o.farmer}</div>
                    <div className="order-loc"><Ic name="mapPin" size={11}/> {o.loc}</div>
                    <div className="order-items-text">{o.items}</div>
                    <div className="order-footer">
                      <span className="order-total">{o.total.toLocaleString()} DZD</span>
                      <button className="action-btn" onClick={e => { e.stopPropagation(); advanceOrder(o.id) }}>
                        {o.status === 'new' ? 'Mark Packed →' : o.status === 'packed' ? 'Mark Shipped →' : '✓ Shipped'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="products-section">
                <div className="products-head"><h3>Top Products</h3><a onClick={() => handleTabChange('products')}>Manage all →</a></div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Sales</th><th>Rating</th></tr></thead>
                    <tbody>
                      {products.filter(p => p.status === 'active').slice(0, 3).map(p => (
                        <tr key={p.id}>
                          <td><div className="prod-cell"><div className="prod-icon blue"><Ic name={p.iconName} size={20}/></div><div className="prod-info"><div className="prod-name">{p.name}</div><div className="prod-cat">{p.cat}</div></div></div></td>
                          <td style={{ fontWeight: 700 }}>{p.price.toLocaleString()} DZD</td>
                          <td style={{ color: p.stock===0?'#dc2626':p.stock<10?'#f59e0b':'#16a34a', fontWeight:700 }}>{p.stock===0?'Out of stock':p.stock}</td>
                          <td>{p.sales}</td>
                          <td><div className="rating-stars">{Array(5).fill().map((_,i)=><span key={i}>{i<Math.floor(p.rating)?'★':'☆'}</span>)} {p.rating}</div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>)}

            {/* PRODUCTS TAB */}
            {tab === 'products' && (<>
              <div className="page-header"><h1>My Products</h1><p>Manage your product catalog and inventory</p></div>
              <div className="search-filter-row">
                <div className="search-input-wrap">
                  <Ic name="search" size={15} style={{color:'#9ca3af'}}/>
                  <input placeholder="Search by name or category..." value={productSearch} onChange={e => setProductSearch(e.target.value)} />
                  {productSearch && <button onClick={() => setProductSearch('')} style={{background:'none',border:'none',cursor:'pointer',color:'#9ca3af',display:'flex',alignItems:'center'}}><Ic name="close" size={14}/></button>}
                </div>
                <div className="filter-divider" />
                <div className="filter-btns">
                  {['All','Active','Draft'].map(f => (<button key={f} className={`filter-btn-s${productStatusFilter===f?' active':''}`} onClick={() => setProductStatusFilter(f)}>{f}</button>))}
                </div>
              </div>
              <div className="products-section">
                <div className="products-head">
                  <h3>All Products ({filteredProducts.length})</h3>
                  <button className="btn-primary" onClick={() => setShowAddProduct(true)}><Ic name="plus" size={14}/>List New Product</button>
                </div>
                {filteredProducts.length === 0 ? <div className="no-results">No products match your search</div> :
                  <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                      <thead><tr><th>Product</th><th>Category</th><th>Price (DZD)</th><th>Stock</th><th>Sales</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
                      <tbody>
                        {filteredProducts.map(p => (
                          <tr key={p.id}>
                            <td><div className="prod-cell"><div className={`prod-icon ${p.cat==='Sensor'?'green':p.cat==='Irrigation'?'blue':p.cat==='Camera'?'amber':'purple'}`}><Ic name={p.iconName} size={20}/></div><div className="prod-info"><div className="prod-name">{p.name}</div><div className="prod-cat">{p.cat}</div></div></div></td>
                            <td>{p.cat}</td>
                            <td style={{fontWeight:700}}>{p.price.toLocaleString()}</td>
                            <td style={{color:p.stock===0?'#dc2626':p.stock<10?'#f59e0b':'#16a34a',fontWeight:700}}>{p.stock===0?'⚠ 0':p.stock}</td>
                            <td>{p.sales}</td>
                            <td><div className="rating-stars">{Array(5).fill().map((_,i)=><span key={i}>{i<Math.floor(p.rating)?'★':'☆'}</span>)}{p.rating>0?` ${p.rating}`:' —'}</div></td>
                            <td><span className={`status-pill ${p.status}`} onClick={() => toggleProductStatus(p.id)}>{p.status}</span></td>
                            <td><div className="action-btns">
                              <button className="action-btn" onClick={() => setEditProduct(p)}><Ic name="edit" size={12}/>Edit</button>
                              <button className="action-btn danger" onClick={() => deleteProduct(p.id)}><Ic name="trash" size={12}/>Remove</button>
                            </div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                }
              </div>
            </>)}

            {/* ORDERS TAB */}
            {tab === 'orders' && (<>
              <div className="page-header"><h1>Orders</h1><p>{orders.length} total · {pendingOrders} pending</p></div>
              <div className="search-filter-row">
                <div className="search-input-wrap">
                  <Ic name="search" size={15} style={{color:'#9ca3af'}}/>
                  <input placeholder="Search by farmer, order ID, or location..." value={orderSearch} onChange={e => setOrderSearch(e.target.value)} />
                  {orderSearch && <button onClick={() => setOrderSearch('')} style={{background:'none',border:'none',cursor:'pointer',color:'#9ca3af',display:'flex'}}><Ic name="close" size={14}/></button>}
                </div>
                <div className="filter-divider" />
                <div className="filter-btns">
                  {['All','New','Packed','Shipped','Cancelled'].map(f => (<button key={f} className={`filter-btn-s${orderStatusFilter===f?' active':''}`} onClick={() => setOrderStatusFilter(f)}>{f}</button>))}
                </div>
              </div>
              <div className="orders-section">
                <div className="orders-head"><h3>Orders ({filteredOrders.length})</h3></div>
                {filteredOrders.length === 0 ? <div className="no-results">No orders match your filters</div> :
                  filteredOrders.map(o => (
                    <div key={o.id} className="order-card" onClick={() => setSelectedOrder(o)}>
                      <div className="order-header"><span className="order-id">{o.id} · {o.date}</span><span className={`order-status ${o.status}`}>{o.status.toUpperCase()}</span></div>
                      <div className="order-farmer">{o.farmer}</div>
                      <div className="order-loc"><Ic name="mapPin" size={11}/> {o.loc}</div>
                      <div className="order-items-text">{o.items}</div>
                      <div className="order-footer">
                        <span className="order-total">{o.total.toLocaleString()} DZD</span>
                        <div className="action-btns">
                          {o.status !== 'shipped' && o.status !== 'cancelled' && (
                            <button className="action-btn" onClick={e => { e.stopPropagation(); advanceOrder(o.id) }}>
                              {o.status === 'new' ? 'Mark Packed →' : 'Mark Shipped →'}
                            </button>
                          )}
                          <button className="action-btn" onClick={e => { e.stopPropagation(); setSelectedOrder(o) }}>View Details</button>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </>)}

            {/* ANALYTICS TAB */}
            {tab === 'analytics' && (<>
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'1.5rem',gap:'1rem',flexWrap:'wrap'}}>
                <div><h1 style={{fontSize:'1.5rem',fontWeight:800,color:'#0d1f0f'}}>Analytics</h1><p style={{fontSize:'0.85rem',color:'#6b7280'}}>Track your sales performance and business growth</p></div>
                <div style={{display:'flex',gap:'0.5rem',alignItems:'center',flexWrap:'wrap'}}>
                  <div className="time-btns">{['7 Days','30 Days','3 Months','1 Year'].map(t=>(<button key={t} className={`time-btn${analyticsTime===t?' active':''}`} onClick={()=>setAnalyticsTime(t)}>{t}</button>))}</div>
                  <button className="export-btn" onClick={handleExport}><Ic name="download" size={13}/>Export CSV</button>
                </div>
              </div>
              <div className="kpi-grid">
                {[
                  {iconName:'revenue',iconClass:'blue',accent:'blue',val:`${totalRevenue.toLocaleString()}`,label:'Total Revenue (DZD)',sub:analyticsTime},
                  {iconName:'trending',iconClass:'green',accent:'green',val:'+18%',label:'Growth Rate',sub:'vs last period'},
                  {iconName:'check',iconClass:'amber',accent:'amber',val:orders.filter(o=>o.status==='shipped').length,label:'Orders Completed',sub:'Delivered'},
                  {iconName:'star',iconClass:'purple',accent:'purple',val:avgRating,label:'Avg Product Rating',sub:'From reviews'},
                ].map((k,i)=>(
                  <div key={i} className="kpi-card">
                    <div className={`kpi-accent ${k.accent}`}/>
                    <div className="kpi-top"><div className={`kpi-icon-wrap ${k.iconClass}`}><Ic name={k.iconName} size={20}/></div></div>
                    <div className="kpi-value">{k.val}</div>
                    <div className="kpi-label">{k.label}</div>
                    <div className="kpi-sub">{k.sub}</div>
                  </div>
                ))}
              </div>
              <div className="chart-card">
                <div className="chart-head"><div className="chart-head-left"><h3>Monthly Revenue (DZD)</h3><p>Last 6 months</p></div><Ic name="revenue" size={20} style={{color:'#9ca3af'}}/></div>
                <BarChart data={REVENUE_DATA} labels={MONTHS} color="#3b82f6" height={200} yMax={600000} />
                <div className="chart-legend"><div className="legend-item"><span className="legend-dot" style={{background:'#3b82f6'}}/> Revenue</div></div>
              </div>
              <div className="chart-card">
                <div className="chart-head"><div className="chart-head-left"><h3>Sales by Product</h3><p>Units sold</p></div></div>
                <BarChart data={products.map(p=>p.sales)} labels={products.map(p=>p.name.split(' ')[0])} color="#22c55e" height={180} />
              </div>
              <div className="chart-card">
                <div className="chart-head"><div className="chart-head-left"><h3>Order Status Breakdown</h3></div></div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',padding:'0.5rem 0'}}>
                  {[{s:'new',c:'#3b82f6',l:'New'},{s:'packed',c:'#f59e0b',l:'Packed'},{s:'shipped',c:'#22c55e',l:'Shipped'},{s:'cancelled',c:'#ef4444',l:'Cancelled'}].map(({s,c,l})=>(
                    <div key={s} style={{background:'#f9fafb',borderRadius:12,padding:'1rem',textAlign:'center',borderTop:`3px solid ${c}`}}>
                      <div style={{fontSize:'1.8rem',fontWeight:800,color:c}}>{orders.filter(o=>o.status===s).length}</div>
                      <div style={{fontSize:'0.78rem',color:'#6b7280',marginTop:4}}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>)}

            {/* SETTINGS TAB */}
            {tab === 'settings' && (<>
              <div className="page-header"><h1>Settings</h1><p>Manage your account, store, and preferences</p></div>
              <div className="settings-layout">
                <div className="settings-nav">
                  {settingsNavConfig.map(s => (
                    <button key={s.key} className={`settings-nav-item${settingsTab===s.key?' active':''}`} onClick={() => setSettingsTab(s.key)}>
                      <Ic name={s.iconName} size={15}/> {s.key}
                    </button>
                  ))}
                </div>
                <div className="settings-panel">
                  {settingsTab === 'Profile' && (<>
                    <div className="settings-profile-head">
                      <div className="settings-avatar">{initials}</div>
                      <div><h3 style={{fontSize:'1rem',fontWeight:800,color:'#0d1f0f'}}>{firstName} {lastName}</h3><p style={{fontSize:'0.78rem',color:'#6b7280'}}>Supplier since 2024 · {user?.wilaya||'Algiers'}</p></div>
                    </div>
                    <div className="settings-form-grid">
                      {Object.entries(settingsForm).map(([key,val]) => (
                        <div key={key} className="settings-field">
                          <label>{key.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase())}</label>
                          <input value={val} onChange={e => setSettingsForm(f => ({...f,[key]:e.target.value}))}/>
                        </div>
                      ))}
                    </div>
                    <button className="btn-save" onClick={() => { setSavedSettings(true); setTimeout(()=>setSavedSettings(false),2500); showToast('✅ Settings saved') }}>Save Changes</button>
                    {savedSettings && <div className="save-success">✅ Profile saved successfully!</div>}
                  </>)}
                  {settingsTab !== 'Profile' && (
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

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="modal-overlay" onClick={e => { if (e.target===e.currentTarget) setShowAddProduct(false) }}>
          <div className="modal-box">
            <div className="modal-title">List New Product <button className="modal-close" onClick={() => setShowAddProduct(false)}><Ic name="close" size={14}/></button></div>
            <div className="modal-form-grid">
              <div className="modal-field" style={{gridColumn:'1/-1'}}>
                <label>Product Name *</label>
                <input placeholder="e.g. SoilPro 3000" value={newProduct.name} onChange={e => setNewProduct(p=>({...p,name:e.target.value}))} />
              </div>
              <div className="modal-field">
                <label>Category</label>
                <select value={newProduct.cat} onChange={e => setNewProduct(p=>({...p,cat:e.target.value}))}>
                  {['Sensor','Irrigation','Network','Camera','Monitoring','Software'].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="modal-field"><label>Price (DZD) *</label><input type="number" placeholder="e.g. 9500" value={newProduct.price} onChange={e=>setNewProduct(p=>({...p,price:e.target.value}))}/></div>
              <div className="modal-field"><label>Stock Quantity</label><input type="number" placeholder="e.g. 20" value={newProduct.stock} onChange={e=>setNewProduct(p=>({...p,stock:e.target.value}))}/></div>
            </div>
            <div className="modal-actions">
              <button className="btn-modal-cancel" onClick={() => setShowAddProduct(false)}>Cancel</button>
              <button className="btn-modal-save" onClick={addProduct}>List Product ✓</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="modal-overlay" onClick={e => { if (e.target===e.currentTarget) setEditProduct(null) }}>
          <div className="modal-box">
            <div className="modal-title">Edit Product <button className="modal-close" onClick={() => setEditProduct(null)}><Ic name="close" size={14}/></button></div>
            <div className="modal-form-grid">
              <div className="modal-field" style={{gridColumn:'1/-1'}}><label>Product Name</label><input value={editProduct.name} onChange={e=>setEditProduct(p=>({...p,name:e.target.value}))}/></div>
              <div className="modal-field"><label>Price (DZD)</label><input type="number" value={editProduct.price} onChange={e=>setEditProduct(p=>({...p,price:parseInt(e.target.value)||0}))}/></div>
              <div className="modal-field"><label>Stock</label><input type="number" value={editProduct.stock} onChange={e=>setEditProduct(p=>({...p,stock:parseInt(e.target.value)||0}))}/></div>
            </div>
            <div className="modal-actions">
              <button className="btn-modal-cancel" onClick={() => setEditProduct(null)}>Cancel</button>
              <button className="btn-modal-save" onClick={() => { setProducts(prev=>prev.map(p=>p.id===editProduct.id?editProduct:p)); setEditProduct(null); showToast('✅ Product updated') }}>Save Changes ✓</button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={e => { if (e.target===e.currentTarget) setSelectedOrder(null) }}>
          <div className="modal-box" style={{maxWidth:520}}>
            <div className="modal-title">
              {selectedOrder.id}
              <div style={{display:'flex',gap:8}}>
                <span className={`order-status ${selectedOrder.status}`}>{selectedOrder.status.toUpperCase()}</span>
                <button className="modal-close" onClick={() => setSelectedOrder(null)}><Ic name="close" size={14}/></button>
              </div>
            </div>
            <div className="order-detail-grid">
              {[['Farmer',selectedOrder.farmer],['Wilaya',selectedOrder.loc],['Date',selectedOrder.date],['Total',`${selectedOrder.total.toLocaleString()} DZD`],['Items',selectedOrder.items],['Status',selectedOrder.status.toUpperCase()]].map(([k,v])=>(
                <div key={k} className="order-detail-cell" style={k==='Items'?{gridColumn:'1/-1'}:{}}>
                  <div className="order-detail-label">{k}</div>
                  <div className="order-detail-val">{v}</div>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              {selectedOrder.status!=='shipped'&&selectedOrder.status!=='cancelled'&&(
                <button className="btn-modal-save" onClick={()=>{advanceOrder(selectedOrder.id);setSelectedOrder(o=>o?{...o,status:STATUS_CYCLE[o.status]}:o)}}>
                  {selectedOrder.status==='new'?'Mark as Packed →':'Mark as Shipped →'}
                </button>
              )}
              {selectedOrder.status!=='cancelled'&&selectedOrder.status!=='shipped'&&(
                <button className="btn-modal-cancel" onClick={()=>cancelOrder(selectedOrder.id)} style={{borderColor:'#ef4444',color:'#dc2626'}}>Cancel Order</button>
              )}
              <button className="btn-modal-cancel" onClick={()=>setSelectedOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="db-toast">{toast}</div>}
    </>
  )
}