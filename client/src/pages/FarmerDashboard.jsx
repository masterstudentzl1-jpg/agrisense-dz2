import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import logoo from '../assets/logoo.png'

// ─── FIREBASE ────────────────────────────────────────────────────────────────
import { db } from '../firebase'
import {
  collection, onSnapshot, doc, updateDoc, addDoc,
  query, orderBy, limit, serverTimestamp, where
} from 'firebase/firestore'

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
  trash:       'M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0',
  signal:      'M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z',
  trendUp:     'M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941',
  save:        'M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z',
  eye:         'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  filter:      'M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z',
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

// ─── DEFAULT DATA (fallback when Firebase not connected) ──────────────────────
const DEFAULT_SENSORS = [
  {id:'s1',name:'Sensor A-01',field:'Field 1',zone:'Zone A',type:'Soil Moisture',status:'active',value:'42%',updated:'10:29 AM',battery:85,lat:36.18,lng:2.90},
  {id:'s2',name:'Sensor A-02',field:'Field 1',zone:'Zone B',type:'Temperature',status:'active',value:'27°C',updated:'10:29 AM',battery:78,lat:36.19,lng:2.91},
  {id:'s3',name:'Sensor B-01',field:'Field 2',zone:'Zone A',type:'Humidity',status:'active',value:'55%',updated:'10:29 AM',battery:90,lat:36.20,lng:2.89},
  {id:'s4',name:'Sensor B-02',field:'Field 2',zone:'Zone B',type:'Weather',status:'active',value:'Cloudy',updated:'10:29 AM',battery:65,lat:36.21,lng:2.92},
  {id:'s5',name:'Sensor C-01',field:'Field 3',zone:'Zone A',type:'Wind Speed',status:'active',value:'12 km/h',updated:'10:29 AM',battery:65,lat:36.17,lng:2.88},
  {id:'s6',name:'Sensor C-02',field:'Field 3',zone:'Zone B',type:'Soil Moisture',status:'inactive',value:'—',updated:'—',battery:12,lat:36.16,lng:2.93},
  {id:'s7',name:'Sensor D-01',field:'Field 4',zone:'Zone A',type:'Temperature',status:'active',value:'29°C',updated:'10:28 AM',battery:72,lat:36.22,lng:2.87},
  {id:'s8',name:'Sensor D-02',field:'Field 4',zone:'Zone B',type:'Humidity',status:'active',value:'61%',updated:'10:28 AM',battery:88,lat:36.23,lng:2.94},
]

const DEFAULT_ALERTS = [
  {id:'a1',type:'crit',icon:'warning',name:'Low Soil Moisture',sub:'Field 2 - Zone A',time:'10:15 AM',read:false,date:'Today'},
  {id:'a2',type:'warn',icon:'temp',name:'High Temperature',sub:'Field 4 - Greenhouse',time:'09:50 AM',read:false,date:'Today'},
  {id:'a3',type:'warn',icon:'wind',name:'High Wind Speed',sub:'Outdoor',time:'09:30 AM',read:true,date:'Today'},
  {id:'a4',type:'info',icon:'check',name:'Irrigation Completed',sub:'Field 1 - Zone B',time:'06:30 PM',read:true,date:'Yesterday'},
  {id:'a5',type:'warn',icon:'sensors',name:'Sensor Offline',sub:'Field 3 - Sensor 2',time:'11:20 AM',read:true,date:'Yesterday'},
  {id:'a6',type:'crit',icon:'warning',name:'Battery Critical',sub:'Sensor C-02',time:'08:00 AM',read:false,date:'Today'},
  {id:'a7',type:'info',icon:'check',name:'System Update Done',sub:'All sensors',time:'07:00 AM',read:true,date:'Yesterday'},
]

const DEFAULT_HISTORY = [
  {id:'h1',action:'Irrigation Started',field:'Field 1 - Zone A',user:'farmer',time:'10:00 AM',date:'Today',type:'irrigation'},
  {id:'h2',action:'Irrigation Completed',field:'Field 1 - Zone A',user:'System',time:'10:30 AM',date:'Today',type:'irrigation'},
  {id:'h3',action:'Alert Triggered',field:'Field 2 - Zone A',user:'System',time:'09:15 AM',date:'Today',type:'alert'},
  {id:'h4',action:'Sensor Offline',field:'Field 3 - Sensor 2',user:'System',time:'09:00 AM',date:'Today',type:'sensor'},
  {id:'h5',action:'Settings Updated',field:'Irrigation Rules',user:'farmer',time:'08:30 AM',date:'Today',type:'settings'},
  {id:'h6',action:'Irrigation Scheduled',field:'Field 2',user:'farmer',time:'07:00 PM',date:'Yesterday',type:'irrigation'},
  {id:'h7',action:'New Sensor Added',field:'Field 4 - Zone B',user:'farmer',time:'03:00 PM',date:'Yesterday',type:'sensor'},
  {id:'h8',action:'Alert Resolved',field:'Field 1 - Zone B',user:'farmer',time:'02:00 PM',date:'Yesterday',type:'alert'},
  {id:'h9',action:'Report Generated',field:'All Fields',user:'farmer',time:'09:00 AM',date:'Yesterday',type:'report'},
]

const DEFAULT_DAYS_7 = ['21 May','22 May','23 May','24 May','25 May','26 May','27 May']
const DEFAULT_ENV_DATA = {
  moisture:  [65,68,62,70,66,72,68],
  temp:      [38,40,42,44,40,36,38],
  humidity:  [55,52,50,48,52,58,55],
  wind:      [18,22,16,20,24,18,14],
}

const DEFAULT_FIELD_MAP_FIELDS = [
  {id:'f1',label:'Field 1',val:55,x:55,y:35,w:145,h:115,color:'#22c55e',area:'2.3 ha',crop:'Wheat'},
  {id:'f2',label:'Field 2',val:28,x:210,y:35,w:105,h:115,color:'#f59e0b',area:'1.1 ha',crop:'Tomatoes'},
  {id:'f3',label:'Field 3',val:43,x:55,y:160,w:125,h:100,color:'#3b82f6',area:'1.8 ha',crop:'Corn'},
  {id:'f4',label:'Field 4',val:63,x:190,y:160,w:125,h:100,color:'#10b981',area:'2.0 ha',crop:'Potatoes'},
]

const MONTHLY_DATA = {
  labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  water:  [120,135,180,210,240,280,320,300,260,200,160,130],
  yield:  [40,42,55,60,70,75,80,78,65,58,48,42],
}

const IRR_ZONES = [
  {id:'z1',name:'Field 1 - Zone A',status:'active',schedule:'06:00 AM',duration:30,moisture:55,auto:true},
  {id:'z2',name:'Field 1 - Zone B',status:'idle',schedule:'06:30 AM',duration:25,moisture:48,auto:true},
  {id:'z3',name:'Field 2 - Zone A',status:'scheduled',schedule:'07:00 AM',duration:40,moisture:28,auto:true},
  {id:'z4',name:'Field 2 - Zone B',status:'idle',schedule:'07:45 AM',duration:20,moisture:35,auto:false},
  {id:'z5',name:'Field 3',status:'idle',schedule:'08:00 AM',duration:35,moisture:43,auto:true},
  {id:'z6',name:'Field 4',status:'active',schedule:'08:30 AM',duration:30,moisture:63,auto:false},
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

// ─── CSS ─────────────────────────────────────────────────────────────────────
const S = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Manrope',sans-serif;overflow-x:hidden}

.db{display:flex;min-height:100vh;background:#f0f4f0;font-family:'Manrope',sans-serif}
.sb{width:220px;background:#1a3a1f;display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:200;transition:transform 0.3s ease;overflow-y:auto;overflow-x:hidden}
.sb-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:199}
.db-main{margin-left:220px;flex:1;display:flex;flex-direction:column;min-height:100vh;transition:margin-left 0.3s}
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
.db-content{flex:1;padding:1.25rem 1.5rem;overflow-y:auto}
.page-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;flex-wrap:wrap;gap:0.75rem}
.page-hdr-left h1{font-size:1.4rem;font-weight:800;color:#1a3a1f}
.page-hdr-left p{font-size:0.82rem;color:#6b9475;margin-top:2px}
.btn-primary{display:inline-flex;align-items:center;gap:6px;padding:0.55rem 1.1rem;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;border:none;border-radius:50px;font-size:0.82rem;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif;box-shadow:0 3px 10px rgba(34,197,94,0.3);transition:all 0.15s}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 5px 14px rgba(34,197,94,0.4)}
.btn-secondary{display:inline-flex;align-items:center;gap:6px;padding:0.55rem 1.1rem;background:#fff;color:#374151;border:1.5px solid #e0e8e0;border-radius:50px;font-size:0.82rem;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif;transition:all 0.15s}
.btn-secondary:hover{border-color:#22c55e;color:#16a34a}

/* ─── DASHBOARD ─── */
.dash-grid{display:grid;grid-template-columns:1fr 300px;gap:1rem;align-items:start}
.dash-left{display:flex;flex-direction:column;gap:1rem}
.dash-right{display:flex;flex-direction:column;gap:1rem;position:sticky;top:70px}
.kpi-row{display:grid;grid-template-columns:repeat(6,1fr);gap:0.75rem;margin-bottom:1rem}
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
.chart-card{background:#fff;border:1px solid #e0e8e0;border-radius:14px;padding:1.25rem}
.chart-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem}
.chart-title{font-size:0.95rem;font-weight:700;color:#1a3a1f}
.chart-legend{display:flex;gap:1rem;flex-wrap:wrap}
.legend-item{display:flex;align-items:center;gap:5px;font-size:0.72rem;color:#6b7280;font-weight:500}
.legend-dot{width:14px;height:3px;border-radius:2px}
.chart-time-sel{padding:5px 12px;border-radius:50px;border:1.5px solid #e0e8e0;background:#fff;font-size:0.75rem;font-weight:600;color:#374151;cursor:pointer;font-family:'Manrope',sans-serif}
.dash-bottom-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem}
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
.sensor-status-card{background:#fff;border:1px solid #e0e8e0;border-radius:14px;padding:1.25rem}
.sensor-status-card h3{font-size:0.88rem;font-weight:700;color:#1a3a1f;margin-bottom:0.9rem}
.ss-big-row{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-bottom:0.9rem}
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
.moist-card{background:#fff;border:1px solid #e0e8e0;border-radius:14px;padding:1.25rem}
.moist-card h3{font-size:0.88rem;font-weight:700;color:#1a3a1f;margin-bottom:0.9rem}
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
.irr-control-panel{background:#fff;border:1px solid #e0e8e0;border-radius:14px;padding:1.25rem}
.irr-control-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem}
.irr-control-hdr h3{font-size:0.88rem;font-weight:700;color:#1a3a1f}
.irr-mode{font-size:0.68rem;color:#6b9475;font-weight:500;margin-bottom:0.75rem}
.toggle-wrap{width:36px;height:20px;border-radius:50px;background:#22c55e;position:relative;cursor:pointer;flex-shrink:0}
.toggle-knob{position:absolute;width:16px;height:16px;border-radius:50%;background:#fff;top:2px;right:2px;transition:all 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.2)}
.irr-rule{display:flex;align-items:flex-start;gap:8px;padding:0.5rem 0;border-bottom:1px solid #f5f8f5}
.irr-rule:last-child{border-bottom:none;padding-bottom:0}
.irr-rule-icon{width:26px;height:26px;border-radius:7px;background:#f0fdf4;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#16a34a}
.irr-rule-text{flex:1;min-width:0}
.irr-rule-title{font-size:0.75rem;font-weight:700;color:#1a3a1f;line-height:1.3}
.irr-rule-sub{font-size:0.68rem;color:#9ca3af}
.btn-edit-rules{width:100%;margin-top:0.75rem;padding:0.55rem;border:1.5px solid #e0e8e0;border-radius:50px;background:#fff;font-size:0.78rem;font-weight:600;cursor:pointer;font-family:'Manrope',sans-serif;color:#374151;display:flex;align-items:center;justify-content:center;gap:5px;transition:all 0.15s}
.btn-edit-rules:hover{border-color:#22c55e;color:#16a34a}
.table-card{background:#fff;border:1px solid #e0e8e0;border-radius:14px;overflow:hidden}
.table-card-hdr{display:flex;align-items:center;justify-content:space-between;padding:1.1rem 1.25rem 0.85rem}
.table-card-hdr h3{font-size:0.88rem;font-weight:700;color:#1a3a1f}
.table-card-hdr a{font-size:0.75rem;color:#22c55e;font-weight:700;cursor:pointer;text-decoration:none}
.data-table{width:100%;border-collapse:collapse}
.data-table th{font-size:0.62rem;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;padding:0.5rem 1.25rem;text-align:left;border-bottom:1px solid #f0f4f0;background:#fafcfa}
.data-table td{padding:0.65rem 1.25rem;font-size:0.82rem;color:#374151;border-bottom:1px solid #f5f8f5}
.data-table tr:last-child td{border-bottom:none}
.data-table tr:hover td{background:#fafcfa}
.status-pill{display:inline-flex;align-items:center;gap:5px;padding:2px 9px;border-radius:50px;font-size:0.68rem;font-weight:700}
.status-pill.active{background:#f0fdf4;color:#16a34a}
.status-pill.inactive{background:#fef2f2;color:#dc2626}
.status-pill.scheduled{background:#fef3c7;color:#d97706}
.status-pill.idle{background:#f5f8f5;color:#6b7280}
.status-pill-dot{width:5px;height:5px;border-radius:50%;background:currentColor}
.battery-indicator{display:flex;align-items:center;gap:6px}
.battery-bar{width:28px;height:10px;border-radius:2px;background:#f0f4f0;overflow:hidden;position:relative}
.battery-fill{height:100%;border-radius:2px;transition:width 0.3s}
.field-map-card{background:#fff;border:1px solid #e0e8e0;border-radius:14px;overflow:hidden}
.field-map-hdr{display:flex;align-items:center;justify-content:space-between;padding:1.1rem 1.25rem 0.85rem}
.field-map-hdr h3{font-size:0.88rem;font-weight:700;color:#1a3a1f}
.field-map-svg-wrap{padding:0 1.25rem 1.25rem}
.activity-card{background:#fff;border:1px solid #e0e8e0;border-radius:14px;padding:1.25rem}
.activity-card-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.9rem}
.activity-card-hdr h3{font-size:0.88rem;font-weight:700;color:#1a3a1f}
.activity-card-hdr a{font-size:0.75rem;color:#22c55e;font-weight:700;cursor:pointer;text-decoration:none}
.activity-item{display:flex;align-items:flex-start;gap:8px;padding:0.5rem 0;border-bottom:1px solid #f5f8f5}
.activity-item:last-child{border-bottom:none;padding-bottom:0}
.activity-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:4px}
.activity-text{flex:1;font-size:0.78rem;color:#374151;line-height:1.4}
.activity-time{font-size:0.68rem;color:#9ca3af;flex-shrink:0}
.dash-bottom-2col{display:grid;grid-template-columns:1fr 1fr;gap:1rem}

/* ─── SENSORS TAB ─── */
.sensors-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem;margin-bottom:1.5rem}
.sensor-card{background:#fff;border:1px solid #e0e8e0;border-radius:14px;padding:1.1rem;transition:box-shadow 0.2s,transform 0.2s;cursor:default}
.sensor-card:hover{box-shadow:0 4px 18px rgba(0,0,0,0.07);transform:translateY(-2px)}
.sc-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.85rem}
.sc-name-row{display:flex;align-items:center;gap:8px}
.sc-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.sc-name{font-size:0.88rem;font-weight:700;color:#1a3a1f}
.sc-field{font-size:0.7rem;color:#6b9475}
.sc-value{font-size:1.5rem;font-weight:800;color:#1a3a1f;margin-bottom:0.2rem}
.sc-type{font-size:0.72rem;color:#6b9475;font-weight:600;margin-bottom:0.75rem}
.sc-footer{display:flex;align-items:center;justify-content:space-between;padding-top:0.65rem;border-top:1px solid #f0f4f0}
.sc-updated{font-size:0.7rem;color:#9ca3af}
.sc-batt{display:flex;align-items:center;gap:5px;font-size:0.7rem;color:#6b7280}
.sensor-filter-row{display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;flex-wrap:wrap}
.filter-btn{padding:5px 14px;border-radius:50px;border:1.5px solid #e0e8e0;background:#fff;font-size:0.78rem;font-weight:600;color:#6b7280;cursor:pointer;font-family:'Manrope',sans-serif;transition:all 0.15s}
.filter-btn.active{border-color:#22c55e;background:#f0fdf4;color:#16a34a}
.firebase-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:50px;font-size:0.72rem;font-weight:700;background:#fff7ed;color:#d97706;border:1px solid #fed7aa}
.firebase-badge.connected{background:#f0fdf4;color:#16a34a;border-color:#bbf7d0}

/* ─── IRRIGATION TAB ─── */
.irr-top-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;margin-bottom:1rem}
.irr-stat{background:#fff;border:1px solid #e0e8e0;border-radius:14px;padding:1rem;text-align:center}
.irr-stat-val{font-size:1.6rem;font-weight:800;color:#1a3a1f}
.irr-stat-label{font-size:0.72rem;color:#6b9475;font-weight:600}
.irr-zones-card{background:#fff;border:1px solid #e0e8e0;border-radius:14px;overflow:hidden;margin-bottom:1rem}
.irr-zones-hdr{display:flex;align-items:center;justify-content:space-between;padding:1.1rem 1.25rem 0.85rem;border-bottom:1px solid #f0f4f0}
.irr-zones-hdr h3{font-size:0.88rem;font-weight:700;color:#1a3a1f}
.irr-zone-row{display:flex;align-items:center;gap:1rem;padding:0.9rem 1.25rem;border-bottom:1px solid #f5f8f5;flex-wrap:wrap}
.irr-zone-row:last-child{border-bottom:none}
.irr-zone-name{font-size:0.85rem;font-weight:700;color:#1a3a1f;flex:1;min-width:120px}
.irr-zone-info{display:flex;align-items:center;gap:1.25rem;flex-wrap:wrap}
.irr-zone-meta{font-size:0.75rem;color:#6b9475;display:flex;align-items:center;gap:4px}
.irr-zone-meta strong{color:#374151}
.irr-zone-actions{display:flex;align-items:center;gap:0.5rem}
.irr-btn-start{padding:5px 14px;border-radius:50px;border:none;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-size:0.75rem;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif}
.irr-btn-stop{padding:5px 14px;border-radius:50px;border:1.5px solid #e0e8e0;background:#fff;color:#ef4444;font-size:0.75rem;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif;border-color:#fecaca}
.irr-moisture-bar{width:80px;height:6px;background:#e0e8e0;border-radius:50px;overflow:hidden}
.irr-moisture-fill{height:100%;border-radius:50px}
.irr-schedule-card{background:#fff;border:1px solid #e0e8e0;border-radius:14px;padding:1.25rem}
.irr-schedule-card h3{font-size:0.88rem;font-weight:700;color:#1a3a1f;margin-bottom:1rem}
.sched-form{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem}
.sched-label{font-size:0.75rem;font-weight:700;color:#374151;margin-bottom:4px}
.sched-input{width:100%;padding:0.55rem 0.9rem;border:1.5px solid #e0e8e0;border-radius:10px;font-size:0.82rem;font-family:'Manrope',sans-serif;color:#374151;outline:none;transition:border-color 0.15s;background:#fff}
.sched-input:focus{border-color:#22c55e}

/* ─── ALERTS TAB ─── */
.alerts-filter-row{display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;flex-wrap:wrap}
.alerts-list{display:flex;flex-direction:column;gap:0.75rem}
.alert-card{background:#fff;border:1px solid #e0e8e0;border-radius:14px;padding:1rem 1.25rem;display:flex;align-items:flex-start;gap:1rem;transition:box-shadow 0.15s}
.alert-card.unread{border-left:3px solid #ef4444}
.alert-card.unread.warn{border-left-color:#f59e0b}
.alert-card.unread.info{border-left-color:#22c55e}
.alert-card:hover{box-shadow:0 3px 14px rgba(0,0,0,0.06)}
.alert-card-icon{width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.alert-card-body{flex:1}
.alert-card-title{font-size:0.9rem;font-weight:700;color:#1a3a1f;margin-bottom:2px}
.alert-card-sub{font-size:0.78rem;color:#6b9475;margin-bottom:6px}
.alert-card-meta{display:flex;align-items:center;gap:1rem;font-size:0.72rem;color:#9ca3af}
.alert-card-actions{display:flex;align-items:center;gap:0.5rem}
.btn-resolve{padding:5px 14px;border-radius:50px;border:1.5px solid #e0e8e0;background:#fff;color:#374151;font-size:0.75rem;font-weight:600;cursor:pointer;font-family:'Manrope',sans-serif;transition:all 0.15s}
.btn-resolve:hover{border-color:#22c55e;color:#16a34a}
.alerts-summary-row{display:grid;grid-template-columns:repeat(4,1fr);gap:0.75rem;margin-bottom:1rem}
.alerts-sum-card{background:#fff;border:1px solid #e0e8e0;border-radius:14px;padding:0.9rem 1rem;display:flex;align-items:center;gap:0.75rem}
.alerts-sum-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.alerts-sum-val{font-size:1.4rem;font-weight:800;color:#1a3a1f}
.alerts-sum-label{font-size:0.7rem;color:#6b9475;font-weight:600}

/* ─── STATISTICS TAB ─── */
.stats-kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.25rem}
.stats-kpi{background:#fff;border:1px solid #e0e8e0;border-radius:14px;padding:1.1rem}
.stats-kpi-val{font-size:1.5rem;font-weight:800;color:#1a3a1f}
.stats-kpi-label{font-size:0.75rem;color:#6b9475;font-weight:600;margin-bottom:4px}
.stats-kpi-trend{font-size:0.72rem;font-weight:700;display:flex;align-items:center;gap:3px;margin-top:4px}
.stats-kpi-trend.up{color:#16a34a}
.stats-kpi-trend.down{color:#ef4444}
.stats-charts-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}
.stats-chart-card{background:#fff;border:1px solid #e0e8e0;border-radius:14px;padding:1.25rem}
.stats-chart-card h3{font-size:0.88rem;font-weight:700;color:#1a3a1f;margin-bottom:0.9rem}
.stats-per-field{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1rem}
.field-stat-card{background:#fff;border:1px solid #e0e8e0;border-radius:14px;padding:1rem}
.field-stat-name{font-size:0.82rem;font-weight:700;color:#1a3a1f;margin-bottom:0.6rem;display:flex;align-items:center;gap:6px}
.field-stat-dot{width:10px;height:10px;border-radius:50%}
.field-stat-row{display:flex;align-items:center;justify-content:space-between;font-size:0.75rem;color:#6b7280;padding:3px 0}
.field-stat-row strong{color:#374151;font-weight:700}

/* ─── FIELD MAP TAB ─── */
.field-map-full{background:#fff;border:1px solid #e0e8e0;border-radius:14px;overflow:hidden;margin-bottom:1rem}
.field-map-full-hdr{display:flex;align-items:center;justify-content:space-between;padding:1.1rem 1.25rem;border-bottom:1px solid #f0f4f0;flex-wrap:wrap;gap:0.5rem}
.field-map-full-hdr h3{font-size:0.88rem;font-weight:700;color:#1a3a1f}
.map-legend{display:flex;gap:1rem;flex-wrap:wrap}
.map-legend-item{display:flex;align-items:center;gap:5px;font-size:0.72rem;color:#6b7280}
.field-detail-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}
.field-detail-card{background:#fff;border:1px solid #e0e8e0;border-radius:14px;padding:1.1rem}
.fdc-name{font-size:0.9rem;font-weight:800;color:#1a3a1f;margin-bottom:0.5rem;display:flex;align-items:center;gap:6px}
.fdc-badge{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.fdc-crop{font-size:0.72rem;color:#6b9475;font-weight:600;margin-bottom:0.75rem}
.fdc-stat-row{display:flex;align-items:center;justify-content:space-between;font-size:0.78rem;color:#6b7280;padding:4px 0;border-bottom:1px solid #f5f8f5}
.fdc-stat-row:last-child{border-bottom:none}
.fdc-stat-row strong{color:#1a3a1f;font-weight:700}
.moisture-gauge{margin:0.75rem 0 0.5rem}
.gauge-label{display:flex;justify-content:space-between;font-size:0.68rem;color:#9ca3af;margin-bottom:4px}
.gauge-bar{height:8px;background:#e0e8e0;border-radius:50px;overflow:hidden}
.gauge-fill{height:100%;border-radius:50px;transition:width 0.5s}

/* ─── HISTORY TAB ─── */
.history-filters{display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;flex-wrap:wrap}
.history-timeline{display:flex;flex-direction:column;gap:0}
.history-date-group{margin-bottom:1rem}
.history-date-label{font-size:0.75rem;font-weight:700;color:#6b9475;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.5rem;padding:0.25rem 0}
.history-item{display:flex;align-items:flex-start;gap:1rem;padding:0.85rem 1.25rem;background:#fff;border:1px solid #e0e8e0;border-radius:12px;margin-bottom:0.5rem;transition:box-shadow 0.15s}
.history-item:hover{box-shadow:0 3px 12px rgba(0,0,0,0.05)}
.hi-icon{width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.hi-icon.irrigation{background:#f0fdf4;color:#16a34a}
.hi-icon.alert{background:#fef2f2;color:#dc2626}
.hi-icon.sensor{background:#eff6ff;color:#2563eb}
.hi-icon.settings{background:#faf5ff;color:#7c3aed}
.hi-icon.report{background:#f5f8f5;color:#6b7280}
.hi-body{flex:1}
.hi-title{font-size:0.85rem;font-weight:700;color:#1a3a1f}
.hi-meta{font-size:0.75rem;color:#6b9475;display:flex;align-items:center;gap:1rem;margin-top:2px;flex-wrap:wrap}
.hi-time{font-size:0.72rem;color:#9ca3af;flex-shrink:0;margin-top:2px}

/* ─── SETTINGS TAB ─── */
.settings-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.settings-card{background:#fff;border:1px solid #e0e8e0;border-radius:14px;padding:1.4rem}
.settings-card h3{font-size:0.92rem;font-weight:800;color:#1a3a1f;margin-bottom:1.1rem;display:flex;align-items:center;gap:8px}
.setting-row{display:flex;align-items:center;justify-content:space-between;padding:0.65rem 0;border-bottom:1px solid #f5f8f5}
.setting-row:last-child{border-bottom:none}
.setting-label{font-size:0.82rem;font-weight:600;color:#374151}
.setting-sub{font-size:0.7rem;color:#9ca3af;margin-top:1px}
.setting-control{flex-shrink:0}
.settings-form-row{margin-bottom:0.85rem}
.settings-input{width:100%;padding:0.6rem 0.9rem;border:1.5px solid #e0e8e0;border-radius:10px;font-size:0.82rem;font-family:'Manrope',sans-serif;color:#374151;outline:none;transition:border-color 0.15s;background:#fff}
.settings-input:focus{border-color:#22c55e}
.settings-select{width:100%;padding:0.6rem 0.9rem;border:1.5px solid #e0e8e0;border-radius:10px;font-size:0.82rem;font-family:'Manrope',sans-serif;color:#374151;outline:none;background:#fff;cursor:pointer}
.firebase-status{display:flex;align-items:center;gap:0.75rem;padding:0.85rem;background:#f5f8f5;border-radius:10px;border:1px solid #e0e8e0;margin-bottom:0.9rem}
.firebase-status-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.firebase-status-dot.online{background:#22c55e}
.firebase-status-dot.offline{background:#ef4444}
.firebase-status-text{font-size:0.82rem;font-weight:700;color:#1a3a1f}
.firebase-status-sub{font-size:0.7rem;color:#9ca3af}
.settings-full{grid-column:1/-1}
.notification-row{display:flex;align-items:center;justify-content:space-between;padding:0.55rem 0}
.notif-label{font-size:0.82rem;font-weight:600;color:#374151}
.notif-sub{font-size:0.7rem;color:#9ca3af}

/* Toast */
.db-toast{position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);background:#1a3a1f;color:#4ade80;padding:0.65rem 1.5rem;border-radius:50px;font-size:0.82rem;font-weight:700;z-index:700;box-shadow:0 8px 24px rgba(0,0,0,0.2);white-space:nowrap;animation:toastIn 0.3s ease}
@keyframes toastIn{from{transform:translateX(-50%) translateY(20px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
.pulse{animation:pulse 2s infinite}
.live-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;animation:pulse 2s infinite;flex-shrink:0}

/* Responsive */
@media(max-width:1200px){
  .kpi-row{grid-template-columns:repeat(3,1fr)}
  .dash-grid{grid-template-columns:1fr}
  .dash-right{position:static;display:grid;grid-template-columns:1fr 1fr;gap:1rem}
  .dash-bottom-row{grid-template-columns:1fr 1fr}
  .stats-charts-grid{grid-template-columns:1fr}
  .settings-grid{grid-template-columns:1fr}
  .settings-full{grid-column:auto}
}
@media(max-width:900px){
  .dash-bottom-row{grid-template-columns:1fr}
  .dash-right{grid-template-columns:1fr}
  .dash-bottom-2col{grid-template-columns:1fr}
  .irr-top-row{grid-template-columns:1fr}
  .stats-kpi-row{grid-template-columns:repeat(2,1fr)}
  .stats-per-field{grid-template-columns:1fr}
  .field-detail-grid{grid-template-columns:1fr 1fr}
  .alerts-summary-row{grid-template-columns:1fr 1fr}
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
  .page-hdr-left h1{font-size:1.15rem}
  .kpi-row{grid-template-columns:repeat(2,1fr);gap:0.5rem}
  .kpi-card{padding:0.75rem}
  .kpi-val{font-size:1.1rem}
  .data-table th,.data-table td{padding:0.5rem 0.75rem;font-size:0.75rem}
  .sensors-grid{grid-template-columns:1fr 1fr}
  .field-detail-grid{grid-template-columns:1fr}
  .alerts-summary-row{grid-template-columns:1fr 1fr}
  .stats-kpi-row{grid-template-columns:1fr 1fr}
  .tb-user-name{display:none}
  .sched-form{grid-template-columns:1fr}
}
@media(max-width:480px){
  .sensors-grid{grid-template-columns:1fr}
  .alerts-summary-row{grid-template-columns:1fr 1fr}
  .irr-top-row{grid-template-columns:1fr}
}
`

// ─── CHART COMPONENTS ─────────────────────────────────────────────────────────
function MultiLineChart({ datasets, labels, height = 190 }) {
  const W=700,H=height,PL=44,PR=14,PT=10,PB=28
  const cw=W-PL-PR,ch=H-PT-PB
  const allVals=datasets.flatMap(d=>d.data)
  const lo=Math.floor(Math.min(...allVals)/10)*10
  const hi=Math.ceil(Math.max(...allVals)/10)*10
  const range=hi-lo||1
  const xs=labels.map((_,i)=>PL+(i/(labels.length-1))*cw)
  const ys=(data)=>data.map(v=>PT+(1-(v-lo)/range)*ch)
  const pathStr=(data)=>xs.map((x,i)=>`${i===0?'M':'L'}${x},${ys(data)[i]}`).join(' ')
  const yTicks=[0,25,50,75,100].map(p=>lo+(p/100)*range)
  return(
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

function BarChart({ fields, height=130 }) {
  const W=320,H=height,PL=10,PR=10,PT=10,PB=28
  const cw=W-PL-PR,ch=H-PT-PB
  const n=fields.length,barW=cw/n*0.5,gap=cw/n
  const colors=['#22c55e','#f59e0b','#3b82f6','#10b981']
  return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height}}>
      {fields.map((f,i)=>{
        const bh=(f.val/100)*ch,x=PL+gap*i+(gap-barW)/2,y=PT+ch-bh
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
  const r=35,cx=size/2,cy=size/2,circ=2*Math.PI*r,dash=circ*(pct/100)
  return(
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e0e8e0" strokeWidth="8"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}/>
    </svg>
  )
}

function LineChart({ data, labels, color='#22c55e', height=120 }) {
  const W=500,H=height,PL=36,PR=10,PT=8,PB=22
  const cw=W-PL-PR,ch=H-PT-PB
  const lo=Math.floor(Math.min(...data)/10)*10
  const hi=Math.ceil(Math.max(...data)/10)*10
  const range=hi-lo||1
  const xs=labels.map((_,i)=>PL+(i/(labels.length-1))*cw)
  const ys=data.map(v=>PT+(1-(v-lo)/range)*ch)
  const path=xs.map((x,i)=>`${i===0?'M':'L'}${x},${ys[i]}`).join(' ')
  const area=`${path} L${xs[xs.length-1]},${PT+ch} L${xs[0]},${PT+ch} Z`
  return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height}}>
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0,25,50,75,100].map((p,i)=>{
        const v=lo+(p/100)*range,y=PT+(1-(v-lo)/range)*ch
        return <g key={i}><line x1={PL} y1={y} x2={W-PR} y2={y} stroke="#f0f4f0" strokeWidth="1"/><text x={PL-4} y={y+3.5} fontSize="8.5" fill="#9ca3af" textAnchor="end">{Math.round(v)}</text></g>
      })}
      {labels.map((l,i)=><text key={i} x={xs[i]} y={H-4} fontSize="8.5" fill="#9ca3af" textAnchor="middle">{l}</text>)}
      <path d={area} fill="url(#lg1)"/>
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {data.map((v,i)=><circle key={i} cx={xs[i]} cy={ys[i]} r="3" fill={color} stroke="#fff" strokeWidth="1.5"/>)}
    </svg>
  )
}

// ─── TOGGLE COMPONENT ────────────────────────────────────────────────────────
function Toggle({ on, onChange }) {
  return (
    <div className="toggle-wrap" style={{background:on?'#22c55e':'#d1d5db'}} onClick={onChange}>
      <div className="toggle-knob" style={{right:on?2:undefined,left:on?undefined:2}}/>
    </div>
  )
}

// ─── HELPER: parse "42%" → 42, "27°C" → 27, "12 km/h" → 12 ─────────────────
const parseVal = (v) => parseFloat(String(v).replace(/[^0-9.]/g, '')) || 0
const avg = (arr) => arr.length
  ? parseFloat((arr.reduce((s, x) => s + parseVal(x.value), 0) / arr.length).toFixed(1))
  : null

// ─── FIREBASE HOOK ────────────────────────────────────────────────────────────
function useFirebaseData() {
  const [sensors,       setSensors]       = useState(DEFAULT_SENSORS)
  const [alerts,        setAlerts]        = useState(DEFAULT_ALERTS)
  const [envData,       setEnvData]       = useState(DEFAULT_ENV_DATA)
  const [envLabels,     setEnvLabels]     = useState(DEFAULT_DAYS_7)
  const [fieldMapData,  setFieldMapData]  = useState(DEFAULT_FIELD_MAP_FIELDS)
  const [activityLog,   setActivityLog]   = useState(DEFAULT_HISTORY)
  const [kpiData,       setKpiData]       = useState(null)
  const [firebaseConnected, setFirebaseConnected] = useState(false)
  const [loading,       setLoading]       = useState(false)

  useEffect(() => {
    setLoading(true)

    // ── 1. sensorData → sensors list + KPI averages ──────────────────────────
    const sensorsRef = collection(db, 'sensorData')
    const unsubSensors = onSnapshot(sensorsRef, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      if (data.length > 0) {
        setSensors(data)
        setFirebaseConnected(true)

        // Compute live KPI averages from active sensors
        const byType = (type) => data.filter(s => s.type === type && s.status === 'active')
        setKpiData({
          moisture:    avg(byType('Soil Moisture')),
          temperature: avg(byType('Temperature')),
          humidity:    avg(byType('Humidity')),
          wind:        avg(byType('Wind Speed')),
        })
      }
      setLoading(false)
    }, (err) => {
      console.error('Sensors error:', err)
      setLoading(false)
    })

    // ── 2. alerts ─────────────────────────────────────────────────────────────
    const alertsRef = collection(db, 'alerts')
    const unsubAlerts = onSnapshot(alertsRef, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      if (data.length > 0) setAlerts(data.slice(0, 20))
    }, (err) => { console.error('Alerts error:', err) })

    // ── 3. environmentalData → line chart (last 7 entries) ───────────────────
    // Required Firestore fields per document:
    //   date: "27 May"  moisture: 68  temperature: 38  humidity: 55  wind: 14
    //   timestamp: serverTimestamp()
    const envRef = query(
      collection(db, 'environmentalData'),
      orderBy('timestamp', 'desc'),
      limit(7)
    )
    const unsubEnv = onSnapshot(envRef, (snap) => {
      const data = snap.docs.map(d => d.data()).reverse() // oldest → newest
      if (data.length > 0) {
        setEnvLabels(data.map(d => d.date || ''))
        setEnvData({
          moisture:    data.map(d => d.moisture    || 0),
          temp:        data.map(d => d.temperature || 0),
          humidity:    data.map(d => d.humidity    || 0),
          wind:        data.map(d => d.wind        || 0),
        })
      }
    }, (err) => { console.error('EnvData error:', err) })

    // ── 4. fields → Field Map + Moisture bars ────────────────────────────────
    // Required Firestore fields per document:
    //   label: "Field 1"  val (moisture%): 55  color: "#22c55e"
    //   crop: "Wheat"  area: "2.3 ha"
    //   x,y,w,h: map SVG position (optional – use defaults if absent)
    const MAP_DEFAULTS = {
      f1:{x:55,y:35,w:145,h:115}, f2:{x:210,y:35,w:105,h:115},
      f3:{x:55,y:160,w:125,h:100}, f4:{x:190,y:160,w:125,h:100},
    }
    const fieldsRef = collection(db, 'fields')
    const unsubFields = onSnapshot(fieldsRef, (snap) => {
      const data = snap.docs.map((d, i) => {
        const raw = { id: d.id, ...d.data() }
        const def = MAP_DEFAULTS[`f${i+1}`] || {x:50,y:50,w:120,h:100}
        return {
          ...def,
          ...raw,
          val: raw.moisture ?? raw.val ?? 50, // support both field names
        }
      })
      if (data.length > 0) setFieldMapData(data)
    }, (err) => { console.error('Fields error:', err) })

    // ── 5. activityLog → Activity Log + History tab ───────────────────────────
    // Required Firestore fields per document:
    //   action: "Irrigation Started"  field: "Field 1 - Zone A"
    //   user: "Mohamed"  type: "irrigation"  time: "10:00 AM"
    //   date: "Today"  createdAt: serverTimestamp()
    const logRef = query(
      collection(db, 'activityLog'),
      orderBy('createdAt', 'desc'),
      limit(20)
    )
    const unsubLog = onSnapshot(logRef, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      if (data.length > 0) setActivityLog(data)
    }, (err) => { console.error('ActivityLog error:', err) })

    return () => {
      unsubSensors()
      unsubAlerts()
      unsubEnv()
      unsubFields()
      unsubLog()
    }
  }, [])

  const resolveAlert = useCallback((alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, read: true } : a))
    // Also update in Firestore
    try {
      updateDoc(doc(db, 'alerts', alertId), { read: true })
    } catch(e) { console.error(e) }
  }, [])

  const addActivityLog = useCallback(async (entry) => {
    try {
      await addDoc(collection(db, 'activityLog'), {
        ...entry,
        createdAt: serverTimestamp()
      })
    } catch(e) { console.error(e) }
  }, [])

  return {
    sensors, alerts, envData, envLabels,
    fieldMapData, activityLog, kpiData,
    firebaseConnected, loading,
    resolveAlert, addActivityLog,
  }
}

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
  const [sensorFilter, setSensorFilter] = useState('All')
  const [alertFilter, setAlertFilter] = useState('All')
  const [historyFilter, setHistoryFilter] = useState('All')
  const [irrZones, setIrrZones] = useState(IRR_ZONES)
  const [settings, setSettings] = useState({
    farmName:'AgriSense DZ',location:'Blida, Algérie',language:'fr',
    moistureAlert:30,tempAlert:40,windAlert:40,
    emailNotif:true,smsNotif:false,pushNotif:true,
    irrigationAutoMode:true,weatherApi:true,
    darkMode:false,dataRefresh:'5',
  })
  const dropRef = useRef(null)

  const {
    sensors, alerts, envData, envLabels,
    fieldMapData, activityLog, kpiData,
    firebaseConnected, loading,
    resolveAlert, addActivityLog,
  } = useFirebaseData()

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(''),2500) }

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setUserDropOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const firstName = user?.firstName || 'farmer'
  const lastName  = user?.lastName  || ''
  const initials  = `${firstName[0]}${lastName[0]||''}`
  const dateStr   = now.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})
  const timeStr   = now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})

  const handleNav = (key) => {
    setTab(key)
    if (window.innerWidth <= 768) setSidebarOpen(false)
  }

  const currentLabel = navSections.flatMap(s=>s.items).find(i=>i.key===tab)?.label || 'Dashboard'
  const unreadAlerts = alerts.filter(a => !a.read).length

  // ── Derived KPI values (Firebase when available, fallback to computed average) ──
  const kpiMoisture    = kpiData?.moisture    != null ? `${kpiData.moisture}%`       : '42%'
  const kpiTemperature = kpiData?.temperature != null ? `${kpiData.temperature}°C`   : '26.7°C'
  const kpiHumidity    = kpiData?.humidity    != null ? `${kpiData.humidity}%`        : '58%'
  const kpiWind        = kpiData?.wind        != null ? `${kpiData.wind} km/h`        : '12 km/h'

  // ── Moisture badge helper ──
  const moistureBadge = (v) => {
    const n = parseFloat(v)
    if (n >= 50) return { label: 'Good',    cls: 'good'    }
    if (n >= 30) return { label: 'Normal',  cls: 'normal'  }
    return             { label: 'Low',     cls: 'warning' }
  }
  const mb = moistureBadge(kpiMoisture)

  const filteredSensors = sensorFilter === 'All' ? sensors : sensors.filter(s =>
    sensorFilter === 'Active'   ? s.status === 'active' :
    sensorFilter === 'Inactive' ? s.status === 'inactive' :
    s.type === sensorFilter
  )

  const filteredAlerts = alertFilter === 'All' ? alerts :
    alertFilter === 'Unread' ? alerts.filter(a => !a.read) :
    alerts.filter(a => a.type === alertFilter.toLowerCase())

  const filteredHistory = historyFilter === 'All' ? activityLog :
    activityLog.filter(h => h.type === historyFilter.toLowerCase())

  // ── Moisture distribution for bar chart from fieldMapData ──
  const moistureBarFields = fieldMapData.map(f => ({ label: f.label, val: f.val ?? f.moisture ?? 0 }))

  // ── Field color based on moisture ──
  const fieldColor = (val) => val > 50 ? '#22c55e' : val > 30 ? '#3b82f6' : '#f59e0b'

  const typeIconMap = { 'Soil Moisture':'moisture','Temperature':'temp','Humidity':'humidity','Weather':'weather','Wind Speed':'wind' }
  const typeBgMap   = { 'Soil Moisture':['#eff6ff','#2563eb'],'Temperature':['#fff7ed','#ea580c'],'Humidity':['#f0fdf4','#16a34a'],'Weather':['#f5f8f5','#6b9475'],'Wind Speed':['#faf5ff','#7c3aed'] }

  return (
    <>
      <style>{S}</style>
      <div className="db">
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
                    {n.key==='alerts' && unreadAlerts>0 && <span className="sb-item-badge">{unreadAlerts}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
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
              <div className="sb-weather-item"><span className="sb-weather-key">Humidity</span><span className="sb-weather-val">{kpiHumidity}</span></div>
              <div className="sb-weather-item"><span className="sb-weather-key">Wind</span><span className="sb-weather-val">{kpiWind}</span></div>
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
          <div className="topbar">
            <div style={{display:'flex',alignItems:'center',gap:'10px',minWidth:0}}>
              <button className="tb-hamburger" onClick={()=>setSidebarOpen(o=>!o)}><Ic name="menu" size={20}/></button>
              <div>
                <div className="tb-title">{currentLabel}</div>
                {tab==='dashboard'&&<div className="tb-subtitle">Welcome back, {firstName}!</div>}
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
                <div className="tb-datetime-item"><Ic name="clock" size={13}/>{dateStr}</div>
                <div className="tb-datetime-item"><Ic name="history" size={13}/>{timeStr}</div>
              </div>
              <button className="tb-icon-btn" onClick={()=>handleNav('alerts')}>
                <Ic name="bell" size={15}/>
                {unreadAlerts>0&&<span className="tb-notif-dot"/>}
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

          <div className="db-content">

            {/* ══════════════════════ DASHBOARD ══════════════════════ */}
            {tab==='dashboard'&&(<>
              {/* ── KPI Cards — live from Firebase sensorData ── */}
              <div className="kpi-row">
                {[
                  {icon:'moisture',iconBg:'#eff6ff',iconColor:'#2563eb',topColor:'#3b82f6',val:kpiMoisture,label:'Avg Soil Moisture',badge:mb.label,badgeClass:mb.cls,trend:null},
                  {icon:'temp',iconBg:'#fff7ed',iconColor:'#ea580c',topColor:'#f97316',val:kpiTemperature,label:'Avg Temperature',badge:'Normal',badgeClass:'normal',trend:null},
                  {icon:'moisture',iconBg:'#eff6ff',iconColor:'#2563eb',topColor:'#06b6d4',val:kpiHumidity,label:'Avg Humidity',badge:'Normal',badgeClass:'normal',trend:null},
                  {icon:'weather',iconBg:'#f5f8f5',iconColor:'#6b9475',topColor:'#22c55e',val:'Partly Cloudy',label:'Weather Status',sub:'Feels like 26°C',badge:null},
                  {icon:'wind',iconBg:'#faf5ff',iconColor:'#7c3aed',topColor:'#8b5cf6',val:kpiWind,label:'Wind Speed',sub:'NW Direction',badge:'Moderate',badgeClass:'warning'},
                  {icon:'auto',iconBg:'#f0fdf4',iconColor:'#16a34a',topColor:'#22c55e',val:'Automated',label:'Irrigation Status',sub:'Next: 11:00 AM',badge:null},
                ].map((k,i)=>(
                  <div key={i} className="kpi-card">
                    <div className="kpi-top-bar" style={{background:k.topColor}}/>
                    <div className="kpi-icon-row">
                      <div className="kpi-icon" style={{background:k.iconBg}}><Ic name={k.icon} size={18} color={k.iconColor}/></div>
                      {firebaseConnected && <div className="live-dot" title="Live"/>}
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

              <div className="dash-grid">
                <div className="dash-left">

                  {/* ── Environmental Trends — live from Firebase environmentalData ── */}
                  <div className="chart-card">
                    <div className="chart-hdr">
                      <div>
                        <div className="chart-title">
                          Environmental Trends{' '}
                          <span style={{fontSize:'0.75rem',color:'#9ca3af',fontWeight:500}}>(Last 7 Days)</span>
                        </div>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:'0.75rem',flexWrap:'wrap'}}>
                        <div className="chart-legend">
                          {[{c:'#3b82f6',l:'Soil Moisture (%)'},{c:'#f97316',l:'Temperature (°C)'},{c:'#06b6d4',l:'Humidity (%)'},{c:'#8b5cf6',l:'Wind (km/h)'}].map(d=>(
                            <div key={d.l} className="legend-item"><div className="legend-dot" style={{background:d.c}}/>{d.l}</div>
                          ))}
                        </div>
                        <select className="chart-time-sel"><option>Last 7 Days</option><option>Last 30 Days</option></select>
                      </div>
                    </div>
                    <MultiLineChart
                      datasets={[
                        {data:envData.moisture, color:'#3b82f6'},
                        {data:envData.temp,     color:'#f97316'},
                        {data:envData.humidity, color:'#06b6d4'},
                        {data:envData.wind,     color:'#8b5cf6'},
                      ]}
                      labels={envLabels}
                      height={195}
                    />
                  </div>

                  <div className="dash-bottom-row">
                    <div className="irr-card">
                      <h3>Irrigation Overview</h3>
                      <div className="irr-donut-wrap">
                        <div className="irr-donut"><DonutChart pct={60} size={90} color="#22c55e"/><div className="irr-donut-pct">60%</div></div>
                        <div className="irr-info">
                          {[['Next Irrigation','11:00 AM'],['Duration','30 min'],['Est. Water','12.5 L']].map(([l,v])=>(
                            <div key={l} className="irr-row"><span className="irr-row-icon"><Ic name="irrigation" size={11}/></span><span className="irr-row-label">{l}</span><span className="irr-row-val" style={{marginLeft:'auto'}}>{v}</span></div>
                          ))}
                        </div>
                      </div>
                      <div className="irr-water"><span className="irr-water-label">Today's Water Usage</span><span className="irr-water-val" style={{color:'#22c55e'}}>24.5 / 40 L</span></div>
                      <div className="irr-water-bar"><div className="irr-water-fill" style={{width:'61%'}}/></div>
                      <button className="btn-irrigate" onClick={()=>{
                        showToast('Irrigation started!')
                        addActivityLog({action:'Irrigation Started',field:'Manual',user:firstName,type:'irrigation',time:new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}),date:'Today'})
                      }}>
                        <Ic name="irrigation" size={13}/>Start Irrigation Now
                      </button>
                    </div>

                    {/* ── Sensor Status — live from Firebase sensorData ── */}
                    <div className="sensor-status-card">
                      <h3>Sensor Status Overview</h3>
                      <div className="ss-big-row">
                        {[
                          {cls:'total',   num:sensors.length,                                       label:'Total'},
                          {cls:'active',  num:sensors.filter(s=>s.status==='active').length,        label:'Active'},
                          {cls:'inactive',num:sensors.filter(s=>s.status==='inactive').length,      label:'Inactive'},
                          {cls:'batt',    num:sensors.filter(s=>s.battery!=null&&s.battery<20).length, label:'Batt. Low'},
                        ].map(s=>(
                          <div key={s.label} className={`ss-big ${s.cls}`}><div className="ss-big-num">{s.num}</div><div className="ss-big-label">{s.label}</div></div>
                        ))}
                      </div>
                      <div className="ss-types-title">Sensor Types</div>
                      {['Soil Moisture','Temperature','Humidity','Weather','Wind Speed'].map(type=>{
                        const total  = sensors.filter(s=>s.type===type).length
                        const active = sensors.filter(s=>s.type===type&&s.status==='active').length
                        const iconName = typeIconMap[type] || 'sensors'
                        return(
                          <div key={type} className="ss-type-row">
                            <span className="ss-type-name"><Ic name={iconName} size={13} color="#6b9475"/>{type}</span>
                            <span className={`ss-type-count${active<total?' warn':''}`}>{active}/{total}</span>
                          </div>
                        )
                      })}
                    </div>

                    {/* ── Moisture Distribution — live from Firebase fields ── */}
                    <div className="moist-card">
                      <h3>Moisture Distribution</h3>
                      <BarChart fields={moistureBarFields} height={130}/>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.35rem',marginTop:'0.75rem'}}>
                        {fieldMapData.map((f,i)=>{
                          const v   = f.val ?? f.moisture ?? 0
                          const col = fieldColor(v)
                          return(
                            <div key={f.id||i} style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'0.72rem',color:'#6b7280'}}>
                              <div style={{width:8,height:8,borderRadius:'50%',background:col,flexShrink:0}}/>
                              {f.label}: <strong style={{color:col}}>{v}%</strong>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* ── Sensor table — live from Firebase sensorData ── */}
                  <div className="table-card">
                    <div className="table-card-hdr"><h3>Sensors Status</h3><a onClick={()=>handleNav('sensors')}>View all sensors →</a></div>
                    <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
                      <table className="data-table" style={{minWidth:520}}>
                        <thead><tr><th>Sensor</th><th>Field / Zone</th><th>Type</th><th>Status</th><th>Last Update</th><th>Battery</th></tr></thead>
                        <tbody>
                          {sensors.slice(0,6).map(s=>(
                            <tr key={s.id}>
                              <td style={{fontWeight:600,color:'#1a3a1f'}}>{s.name}</td>
                              <td style={{color:'#6b9475'}}>{s.field} – {s.zone}</td>
                              <td>{s.type}</td>
                              <td><span className={`status-pill ${s.status}`}><span className="status-pill-dot"/>{s.status.charAt(0).toUpperCase()+s.status.slice(1)}</span></td>
                              <td style={{color:'#9ca3af'}}>{s.updated}</td>
                              <td>{s.battery!=null?(<div className="battery-indicator"><div className="battery-bar"><div className="battery-fill" style={{width:`${s.battery}%`,background:s.battery>50?'#22c55e':s.battery>20?'#f59e0b':'#ef4444'}}/></div><span style={{fontSize:'0.72rem',color:'#6b7280'}}>{s.battery}%</span></div>):(<span style={{color:'#d1d5db'}}>—</span>)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="dash-bottom-2col">
                    {/* ── Field Map — live from Firebase fields ── */}
                    <div className="field-map-card">
                      <div className="field-map-hdr"><h3>Field Map</h3><a onClick={()=>handleNav('fieldmap')}>Full map →</a></div>
                      <div className="field-map-svg-wrap">
                        <svg viewBox="0 0 330 280" style={{width:'100%',borderRadius:10,overflow:'hidden'}}>
                          <rect width="330" height="280" fill="#4a6741" rx="8"/>
                          <defs><pattern id="satbg" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#3d5c35"/><rect x="0" y="0" width="20" height="20" fill="#4a6741" opacity="0.5"/><rect x="20" y="20" width="20" height="20" fill="#405d37" opacity="0.5"/></pattern></defs>
                          <rect width="330" height="280" fill="url(#satbg)" rx="8"/>
                          {fieldMapData.map((f,i)=>{
                            const v   = f.val ?? f.moisture ?? 0
                            const col = f.color || fieldColor(v)
                            return(
                              <g key={f.id||i}>
                                <rect x={f.x} y={f.y} width={f.w} height={f.h} rx="6" fill={col} fillOpacity="0.75" stroke={col} strokeWidth="2"/>
                                <text x={f.x+f.w/2} y={f.y+f.h/2-10} fontSize="13" fontWeight="700" fill="#fff" textAnchor="middle" style={{fontFamily:'Manrope,sans-serif'}}>{f.label}</text>
                                <text x={f.x+f.w/2} y={f.y+f.h/2+8}  fontSize="11" fill="rgba(255,255,255,0.9)" textAnchor="middle" style={{fontFamily:'Manrope,sans-serif'}}>💧 {v}%</text>
                              </g>
                            )
                          })}
                          <text x="165" y="265" fontSize="9" fill="rgba(255,255,255,0.5)" textAnchor="middle">© AgriSense DZ</text>
                        </svg>
                      </div>
                    </div>

                    {/* ── Activity Log — live from Firebase activityLog ── */}
                    <div className="activity-card">
                      <div className="activity-card-hdr"><h3>Activity Log</h3><a onClick={()=>handleNav('history')}>View all →</a></div>
                      {activityLog.slice(0,5).map((a,i)=>(
                        <div key={a.id||i} className="activity-item">
                          <div className="activity-dot" style={{background:a.type==='irrigation'?'#22c55e':a.type==='alert'?'#ef4444':'#3b82f6'}}/>
                          <span className="activity-text">{a.action} — {a.field}</span>
                          <span className="activity-time">{a.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="dash-right">
                  {/* ── Alerts panel — live from Firebase alerts ── */}
                  <div className="alerts-panel">
                    <div className="alerts-panel-hdr"><h3>Alerts</h3><a onClick={()=>handleNav('alerts')}>View all</a></div>
                    {alerts.slice(0,5).map((a,i)=>(
                      <div key={a.id||i} className="alert-item">
                        <div className={`alert-icon-wrap ${a.type}`}><Ic name={a.icon||'warning'} size={14}/></div>
                        <div className="alert-text-block"><div className="alert-name">{a.name}</div><div className="alert-sub">{a.sub}</div></div>
                        <div className="alert-time">{a.time}</div>
                      </div>
                    ))}
                  </div>

                  <div className="irr-control-panel">
                    <div className="irr-control-hdr"><h3>Irrigation Control</h3><Toggle on={irrigationOn} onChange={()=>setIrrigationOn(o=>!o)}/></div>
                    <div className="irr-mode">Automatic Mode</div>
                    <div style={{fontWeight:700,fontSize:'0.75rem',color:'#374151',marginBottom:'0.5rem'}}>Rules</div>
                    {[
                      {icon:'clock',  title:`If Soil Moisture < 30%`,          sub:'Irrigate for 30 minutes'},
                      {icon:'clock',  title:'Active: 06:00 AM – 08:00 PM',     sub:''},
                      {icon:'refresh',title:'Repeat Every Day',                sub:''},
                    ].map((r,i)=>(
                      <div key={i} className="irr-rule">
                        <div className="irr-rule-icon"><Ic name={r.icon} size={13}/></div>
                        <div className="irr-rule-text"><div className="irr-rule-title">{r.title}</div>{r.sub&&<div className="irr-rule-sub">{r.sub}</div>}</div>
                      </div>
                    ))}
                    <button className="btn-edit-rules" onClick={()=>handleNav('irrigation')}><Ic name="edit" size={13}/>Edit Irrigation Rules</button>
                  </div>
                </div>
              </div>
            </>)}

            {/* ══════════════════════ SENSORS ══════════════════════ */}
            {tab==='sensors'&&(<>
              <div className="page-hdr">
                <div className="page-hdr-left">
                  <h1>Sensors</h1>
                  <p>Monitor all IoT sensors across your fields in real-time</p>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'0.75rem',flexWrap:'wrap'}}>
                  <div className={`firebase-badge ${firebaseConnected?'connected':''}`}>
                    <div className="live-dot"/>
                    {firebaseConnected?'Firebase Live':'Demo Mode'}
                  </div>
                  <button className="btn-primary" onClick={()=>showToast('Sensor added!')}><Ic name="plus" size={14}/>Add Sensor</button>
                </div>
              </div>
              <div className="sensor-filter-row">
                {['All','Active','Inactive','Soil Moisture','Temperature','Humidity','Weather','Wind Speed'].map(f=>(
                  <button key={f} className={`filter-btn${sensorFilter===f?' active':''}`} onClick={()=>setSensorFilter(f)}>{f}</button>
                ))}
              </div>
              <div className="sensors-grid">
                {filteredSensors.map(s=>{
                  const [ibg,ic]=typeBgMap[s.type]||['#f5f8f5','#6b7280']
                  return(
                    <div key={s.id} className="sensor-card">
                      <div className="sc-top">
                        <div className="sc-name-row">
                          <div className="sc-icon" style={{background:ibg}}><Ic name={typeIconMap[s.type]||'sensors'} size={17} color={ic}/></div>
                          <div><div className="sc-name">{s.name}</div><div className="sc-field">{s.field} – {s.zone}</div></div>
                        </div>
                        <span className={`status-pill ${s.status}`}><span className="status-pill-dot"/>{s.status.charAt(0).toUpperCase()+s.status.slice(1)}</span>
                      </div>
                      <div className="sc-value">{s.value}</div>
                      <div className="sc-type">{s.type}</div>
                      <div className="sc-footer">
                        <span className="sc-updated">Updated {s.updated}</span>
                        {s.battery!=null&&(
                          <div className="sc-batt">
                            <div className="battery-bar" style={{width:32,height:10}}><div className="battery-fill" style={{width:`${s.battery}%`,background:s.battery>50?'#22c55e':s.battery>20?'#f59e0b':'#ef4444'}}/></div>
                            {s.battery}%
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="table-card">
                <div className="table-card-hdr"><h3>All Sensors — Detailed View</h3><span style={{fontSize:'0.75rem',color:'#9ca3af'}}>{filteredSensors.length} sensors</span></div>
                <div style={{overflowX:'auto'}}>
                  <table className="data-table" style={{minWidth:620}}>
                    <thead><tr><th>Sensor</th><th>Field</th><th>Type</th><th>Value</th><th>Status</th><th>Last Update</th><th>Battery</th><th>Actions</th></tr></thead>
                    <tbody>
                      {filteredSensors.map(s=>(
                        <tr key={s.id}>
                          <td style={{fontWeight:600,color:'#1a3a1f'}}>{s.name}</td>
                          <td style={{color:'#6b9475'}}>{s.field} – {s.zone}</td>
                          <td>{s.type}</td>
                          <td style={{fontWeight:700,color:'#1a3a1f'}}>{s.value}</td>
                          <td><span className={`status-pill ${s.status}`}><span className="status-pill-dot"/>{s.status.charAt(0).toUpperCase()+s.status.slice(1)}</span></td>
                          <td style={{color:'#9ca3af'}}>{s.updated}</td>
                          <td>{s.battery!=null?<span style={{fontSize:'0.78rem',fontWeight:700,color:s.battery>50?'#16a34a':s.battery>20?'#d97706':'#dc2626'}}>{s.battery}%</span>:'—'}</td>
                          <td>
                            <div style={{display:'flex',gap:'0.4rem'}}>
                              <button className="btn-secondary" style={{padding:'3px 10px',fontSize:'0.72rem'}} onClick={()=>showToast(`Viewing ${s.name}`)}><Ic name="eye" size={11}/>View</button>
                              <button className="btn-secondary" style={{padding:'3px 10px',fontSize:'0.72rem'}} onClick={()=>showToast(`Editing ${s.name}`)}><Ic name="edit" size={11}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>)}

            {/* ══════════════════════ IRRIGATION ══════════════════════ */}
            {tab==='irrigation'&&(<>
              <div className="page-hdr">
                <div className="page-hdr-left"><h1>Irrigation</h1><p>Manage irrigation zones, schedules, and water usage</p></div>
                <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                  <button className="btn-secondary" onClick={()=>showToast('Refreshed!')}><Ic name="refresh" size={14}/>Refresh</button>
                  <button className="btn-primary" onClick={()=>{showToast('All irrigation started!');addActivityLog({action:'All Irrigation Started',field:'All Zones',user:firstName,type:'irrigation',time:new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}),date:'Today'})}}><Ic name="irrigation" size={14}/>Start All</button>
                </div>
              </div>
              <div className="irr-top-row">
                <div className="irr-stat"><div className="irr-stat-val" style={{color:'#22c55e'}}>24.5 L</div><div className="irr-stat-label">Today's Water Used</div></div>
                <div className="irr-stat"><div className="irr-stat-val" style={{color:'#3b82f6'}}>{irrZones.filter(z=>z.status==='active').length}</div><div className="irr-stat-label">Active Zones</div></div>
                <div className="irr-stat"><div className="irr-stat-val" style={{color:'#f59e0b'}}>11:00 AM</div><div className="irr-stat-label">Next Scheduled</div></div>
              </div>
              <div className="irr-zones-card">
                <div className="irr-zones-hdr"><h3>Irrigation Zones</h3><div style={{display:'flex',gap:'8px'}}><Toggle on={irrigationOn} onChange={()=>{setIrrigationOn(o=>!o);showToast(irrigationOn?'Auto mode OFF':'Auto mode ON')}}/><span style={{fontSize:'0.78rem',color:'#6b9475',fontWeight:600}}>Auto Mode</span></div></div>
                {irrZones.map(zone=>(
                  <div key={zone.id} className="irr-zone-row">
                    <div>
                      <div className="irr-zone-name">{zone.name}</div>
                      <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginTop:'4px'}}>
                        <div className="irr-moisture-bar"><div className="irr-moisture-fill" style={{width:`${zone.moisture}%`,background:zone.moisture<30?'#f59e0b':zone.moisture<50?'#3b82f6':'#22c55e'}}/></div>
                        <span style={{fontSize:'0.72rem',color:'#6b9475'}}>Moisture: {zone.moisture}%</span>
                      </div>
                    </div>
                    <div className="irr-zone-info">
                      <span className="irr-zone-meta"><Ic name="clock" size={12}/> <strong>{zone.schedule}</strong></span>
                      <span className="irr-zone-meta"><Ic name="irrigation" size={12}/> <strong>{zone.duration} min</strong></span>
                      <span className="irr-zone-meta">Auto: <strong>{zone.auto?'On':'Off'}</strong></span>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                      <span className={`status-pill ${zone.status}`}><span className="status-pill-dot"/>{zone.status.charAt(0).toUpperCase()+zone.status.slice(1)}</span>
                    </div>
                    <div className="irr-zone-actions">
                      {zone.status==='active'
                        ? <button className="irr-btn-stop" onClick={()=>{setIrrZones(z=>z.map(x=>x.id===zone.id?{...x,status:'idle'}:x));showToast(`Stopped ${zone.name}`);addActivityLog({action:'Irrigation Stopped',field:zone.name,user:firstName,type:'irrigation',time:new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}),date:'Today'})}}>Stop</button>
                        : <button className="irr-btn-start" onClick={()=>{setIrrZones(z=>z.map(x=>x.id===zone.id?{...x,status:'active'}:x));showToast(`Started ${zone.name}`);addActivityLog({action:'Irrigation Started',field:zone.name,user:firstName,type:'irrigation',time:new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}),date:'Today'})}}>Start</button>
                      }
                      <button className="btn-secondary" style={{padding:'4px 10px',fontSize:'0.72rem'}} onClick={()=>showToast(`Editing ${zone.name}`)}><Ic name="edit" size={11}/></button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                <div className="irr-schedule-card">
                  <h3>Schedule New Irrigation</h3>
                  <div className="sched-form">
                    <div><div className="sched-label">Zone</div><select className="sched-input">{irrZones.map(z=><option key={z.id}>{z.name}</option>)}</select></div>
                    <div><div className="sched-label">Date</div><input type="date" className="sched-input" defaultValue="2026-05-28"/></div>
                    <div><div className="sched-label">Start Time</div><input type="time" className="sched-input" defaultValue="06:00"/></div>
                    <div><div className="sched-label">Duration (min)</div><input type="number" className="sched-input" defaultValue="30" min="5" max="120"/></div>
                  </div>
                  <button className="btn-primary" style={{marginTop:'1rem',width:'100%',justifyContent:'center'}} onClick={()=>{showToast('Irrigation scheduled!');addActivityLog({action:'Irrigation Scheduled',field:'Selected Zone',user:firstName,type:'irrigation',time:new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}),date:'Today'})}}><Ic name="save" size={14}/>Schedule Irrigation</button>
                </div>
                <div className="irr-schedule-card">
                  <h3>Water Usage — Last 7 Days</h3>
                  <LineChart data={[18,22,25,20,28,24,22]} labels={['Mon','Tue','Wed','Thu','Fri','Sat','Sun']} color="#3b82f6" height={130}/>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.78rem',color:'#6b7280',marginTop:'0.5rem'}}>
                    <span>Total this week: <strong style={{color:'#1a3a1f'}}>159 L</strong></span>
                    <span>Daily avg: <strong style={{color:'#1a3a1f'}}>22.7 L</strong></span>
                  </div>
                </div>
              </div>
            </>)}

            {/* ══════════════════════ ALERTS ══════════════════════ */}
            {tab==='alerts'&&(<>
              <div className="page-hdr">
                <div className="page-hdr-left"><h1>Alerts</h1><p>All system notifications and warnings</p></div>
                <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                  <button className="btn-secondary" onClick={()=>showToast('All alerts marked as read')}><Ic name="check" size={14}/>Mark all read</button>
                  <button className="btn-primary" onClick={()=>showToast('Alert settings saved')}><Ic name="settings" size={14}/>Configure</button>
                </div>
              </div>
              <div className="alerts-summary-row">
                {[
                  {icon:'warning',bg:'#fef2f2',ic:'#dc2626',val:alerts.filter(a=>a.type==='crit').length,   label:'Critical',color:'#dc2626'},
                  {icon:'warning',bg:'#fff7ed',ic:'#ea580c',val:alerts.filter(a=>a.type==='warn').length,   label:'Warnings',color:'#ea580c'},
                  {icon:'info',   bg:'#eff6ff',ic:'#2563eb',val:alerts.filter(a=>a.type==='info').length,   label:'Info',    color:'#2563eb'},
                  {icon:'bell',   bg:'#f0fdf4',ic:'#16a34a',val:alerts.filter(a=>!a.read).length,           label:'Unread',  color:'#16a34a'},
                ].map((s,i)=>(
                  <div key={i} className="alerts-sum-card">
                    <div className="alerts-sum-icon" style={{background:s.bg}}><Ic name={s.icon} size={18} color={s.ic}/></div>
                    <div><div className="alerts-sum-val" style={{color:s.color}}>{s.val}</div><div className="alerts-sum-label">{s.label}</div></div>
                  </div>
                ))}
              </div>
              <div className="alerts-filter-row">
                {['All','Unread','Crit','Warn','Info'].map(f=>(
                  <button key={f} className={`filter-btn${alertFilter===f?' active':''}`} onClick={()=>setAlertFilter(f)}>{f}</button>
                ))}
              </div>
              <div className="alerts-list">
                {filteredAlerts.map(a=>(
                  <div key={a.id} className={`alert-card${!a.read?' unread':''} ${a.type}`}>
                    <div className="alert-card-icon" style={{background:a.type==='crit'?'#fef2f2':a.type==='warn'?'#fff7ed':'#f0fdf4',color:a.type==='crit'?'#dc2626':a.type==='warn'?'#ea580c':'#16a34a'}}><Ic name={a.icon||'warning'} size={18}/></div>
                    <div className="alert-card-body">
                      <div className="alert-card-title">{a.name}</div>
                      <div className="alert-card-sub">{a.sub}</div>
                      <div className="alert-card-meta">
                        <span style={{display:'flex',alignItems:'center',gap:4}}><Ic name="clock" size={11}/>{a.date} · {a.time}</span>
                        {!a.read&&<span style={{background:'#fef2f2',color:'#dc2626',padding:'1px 8px',borderRadius:'50px',fontSize:'0.68rem',fontWeight:700}}>Unread</span>}
                      </div>
                    </div>
                    <div className="alert-card-actions">
                      {!a.read&&<button className="btn-resolve" onClick={()=>resolveAlert(a.id)}>Resolve</button>}
                      <button className="btn-secondary" style={{padding:'4px 10px',fontSize:'0.72rem',color:'#ef4444',borderColor:'#fecaca'}} onClick={()=>showToast('Alert dismissed')}>Dismiss</button>
                    </div>
                  </div>
                ))}
              </div>
            </>)}

            {/* ══════════════════════ STATISTICS ══════════════════════ */}
            {tab==='statistics'&&(<>
              <div className="page-hdr">
                <div className="page-hdr-left"><h1>Statistics</h1><p>Analytics and performance insights for your farm</p></div>
                <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                  <select className="chart-time-sel"><option>Last 30 Days</option><option>Last 7 Days</option><option>Last Year</option></select>
                  <button className="btn-primary" onClick={()=>showToast('Report downloaded!')}><Ic name="download" size={14}/>Export</button>
                </div>
              </div>
              <div className="stats-kpi-row">
                {[
                  {label:'Avg Soil Moisture',    val:kpiMoisture,                                                    trend:'+8%',up:true, color:'#3b82f6'},
                  {label:'Total Water Used',      val:'487 L',                                                        trend:'-12% vs last month',up:false,color:'#22c55e'},
                  {label:'Active Sensors',        val:`${sensors.filter(s=>s.status==='active').length}/${sensors.length}`, trend:'+1 sensor',up:true,color:'#10b981'},
                  {label:'Alerts This Month',     val:String(alerts.length),                                          trend:'-3 vs last month',up:true,color:'#f59e0b'},
                ].map((k,i)=>(
                  <div key={i} className="stats-kpi">
                    <div className="stats-kpi-label">{k.label}</div>
                    <div className="stats-kpi-val" style={{color:k.color}}>{k.val}</div>
                    <div className={`stats-kpi-trend ${k.up?'up':'down'}`}><Ic name={k.up?'arrowUp':'arrowDown'} size={11}/>{k.trend}</div>
                  </div>
                ))}
              </div>
              <div className="stats-charts-grid">
                <div className="stats-chart-card">
                  <h3>Monthly Water Usage (L)</h3>
                  <LineChart data={MONTHLY_DATA.water} labels={MONTHLY_DATA.labels} color="#3b82f6" height={140}/>
                </div>
                <div className="stats-chart-card">
                  <h3>Estimated Yield Trend (%)</h3>
                  <LineChart data={MONTHLY_DATA.yield} labels={MONTHLY_DATA.labels} color="#22c55e" height={140}/>
                </div>
              </div>
              <div style={{marginBottom:'0.75rem',fontWeight:700,fontSize:'0.88rem',color:'#1a3a1f'}}>Field Performance Overview</div>
              <div className="stats-per-field">
                {fieldMapData.map((f,i)=>{
                  const v   = f.val ?? f.moisture ?? 0
                  const col = f.color || fieldColor(v)
                  return(
                    <div key={f.id||i} className="field-stat-card">
                      <div className="field-stat-name"><div className="field-stat-dot" style={{background:col}}/>{f.label} — {f.crop||'—'}</div>
                      {[['Area',f.area||'—'],['Avg Moisture',`${v}%`],['Water Used','120 L'],['Sensors','2 active'],['Last Irrigated','Today, 06:30 AM']].map(([l,val])=>(
                        <div key={l} className="field-stat-row"><span>{l}</span><strong>{val}</strong></div>
                      ))}
                      <div className="moisture-gauge">
                        <div className="gauge-label"><span>Moisture</span><span style={{fontWeight:700,color:v<30?'#f59e0b':'#22c55e'}}>{v}%</span></div>
                        <div className="gauge-bar"><div className="gauge-fill" style={{width:`${v}%`,background:v<30?'#f59e0b':v<50?'#3b82f6':'#22c55e'}}/></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>)}

            {/* ══════════════════════ FIELD MAP ══════════════════════ */}
            {tab==='fieldmap'&&(<>
              <div className="page-hdr">
                <div className="page-hdr-left"><h1>Field Map</h1><p>Visual overview of all your agricultural fields</p></div>
                <div style={{display:'flex',gap:'0.75rem'}}>
                  <button className="btn-secondary" onClick={()=>showToast('Field added!')}><Ic name="plus" size={14}/>Add Field</button>
                  <button className="btn-primary" onClick={()=>showToast('Map exported!')}><Ic name="download" size={14}/>Export</button>
                </div>
              </div>
              <div className="field-map-full">
                <div className="field-map-full-hdr">
                  <h3>Farm Overview Map</h3>
                  <div className="map-legend">
                    {[{c:'#22c55e',l:'Good (>50%)'},{c:'#3b82f6',l:'Normal (30–50%)'},{c:'#f59e0b',l:'Low (<30%)'}].map(l=>(
                      <div key={l.l} className="map-legend-item"><div style={{width:12,height:12,borderRadius:'50%',background:l.c}}/>{l.l}</div>
                    ))}
                  </div>
                </div>
                <div style={{padding:'1.25rem'}}>
                  <svg viewBox="0 0 700 380" style={{width:'100%',borderRadius:12,overflow:'hidden'}}>
                    <rect width="700" height="380" fill="#4a6741" rx="10"/>
                    <defs>
                      <pattern id="satbg2" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#3d5c35"/><rect x="0" y="0" width="20" height="20" fill="#4a6741" opacity="0.5"/><rect x="20" y="20" width="20" height="20" fill="#405d37" opacity="0.5"/></pattern>
                    </defs>
                    <rect width="700" height="380" fill="url(#satbg2)" rx="10"/>
                    <line x1="350" y1="0" x2="350" y2="380" stroke="rgba(255,255,255,0.15)" strokeWidth="6"/>
                    <line x1="0" y1="190" x2="700" y2="190" stroke="rgba(255,255,255,0.15)" strokeWidth="6"/>
                    {/* Full map fields — positions scaled to 700×380 */}
                    {(() => {
                      const fullPos = [
                        {x:50,y:30,w:260,h:145},{x:390,y:30,w:260,h:145},
                        {x:50,y:210,w:200,h:145},{x:390,y:210,w:260,h:145},
                      ]
                      return fieldMapData.map((f,i)=>{
                        const pos = fullPos[i] || {x:50+i*170,y:30,w:260,h:145}
                        const v   = f.val ?? f.moisture ?? 0
                        const col = f.color || fieldColor(v)
                        return(
                          <g key={f.id||i}>
                            <rect x={pos.x} y={pos.y} width={pos.w} height={pos.h} rx="8" fill={col} fillOpacity="0.7" stroke={col} strokeWidth="2"/>
                            <text x={pos.x+pos.w/2} y={pos.y+pos.h/2-22} fontSize="18" fontWeight="800" fill="#fff" textAnchor="middle" style={{fontFamily:'Manrope,sans-serif'}}>{f.label}</text>
                            <text x={pos.x+pos.w/2} y={pos.y+pos.h/2}    fontSize="12" fill="rgba(255,255,255,0.9)" textAnchor="middle" style={{fontFamily:'Manrope,sans-serif'}}>🌱 {f.crop||'—'} · {f.area||'—'}</text>
                            <text x={pos.x+pos.w/2} y={pos.y+pos.h/2+18} fontSize="13" fontWeight="700" fill="#fff" textAnchor="middle" style={{fontFamily:'Manrope,sans-serif'}}>💧 {v}%</text>
                            <circle cx={pos.x+pos.w-18} cy={pos.y+18} r="8" fill={fieldColor(v)}/>
                          </g>
                        )
                      })
                    })()}
                    <text x="350" y="370" fontSize="10" fill="rgba(255,255,255,0.4)" textAnchor="middle">© AgriSense DZ — Field Map</text>
                  </svg>
                </div>
              </div>
              <div className="field-detail-grid">
                {fieldMapData.map((f,i)=>{
                  const v   = f.val ?? f.moisture ?? 0
                  const col = f.color || fieldColor(v)
                  return(
                    <div key={f.id||i} className="field-detail-card">
                      <div className="fdc-name"><div className="fdc-badge" style={{background:col}}/>{f.label}</div>
                      <div className="fdc-crop"> {f.crop||'—'}</div>
                      {[['Area',f.area||'—'],['Sensors','2 active'],['Last Irrigated','Today, 06:30 AM'],['Water This Week','120 L']].map(([l,val])=>(
                        <div key={l} className="fdc-stat-row"><span>{l}</span><strong>{val}</strong></div>
                      ))}
                      <div className="moisture-gauge">
                        <div className="gauge-label"><span style={{fontSize:'0.72rem',color:'#9ca3af'}}>Soil Moisture</span><span style={{fontWeight:700,color:v<30?'#f59e0b':'#22c55e',fontSize:'0.8rem'}}>{v}%</span></div>
                        <div className="gauge-bar"><div className="gauge-fill" style={{width:`${v}%`,background:v<30?'#f59e0b':v<50?'#3b82f6':'#22c55e'}}/></div>
                      </div>
                      <button className="btn-secondary" style={{width:'100%',justifyContent:'center',marginTop:'0.5rem',fontSize:'0.78rem'}} onClick={()=>showToast(`Viewing ${f.label} details`)}><Ic name="eye" size={12}/>View Details</button>
                    </div>
                  )
                })}
              </div>
            </>)}

            {/* ══════════════════════ HISTORY ══════════════════════ */}
            {tab==='history'&&(<>
              <div className="page-hdr">
                <div className="page-hdr-left"><h1>History</h1><p>Full activity log and system events</p></div>
                <div style={{display:'flex',gap:'0.75rem'}}>
                  <button className="btn-secondary" onClick={()=>showToast('Filtered')}><Ic name="filter" size={14}/>Filter</button>
                  <button className="btn-primary" onClick={()=>showToast('Report exported!')}><Ic name="download" size={14}/>Export CSV</button>
                </div>
              </div>
              <div className="history-filters">
                {['All','Irrigation','Alert','Sensor','Settings','Report'].map(f=>(
                  <button key={f} className={`filter-btn${historyFilter===f?' active':''}`} onClick={()=>setHistoryFilter(f)}>{f}</button>
                ))}
              </div>
              <div className="history-timeline">
                {['Today','Yesterday'].map(dateGroup=>{
                  const items = filteredHistory.filter(h=>h.date===dateGroup)
                  if (!items.length) return null
                  return(
                    <div key={dateGroup} className="history-date-group">
                      <div className="history-date-label">{dateGroup}</div>
                      {items.map(h=>(
                        <div key={h.id} className="history-item">
                          <div className={`hi-icon ${h.type}`}><Ic name={h.type==='irrigation'?'irrigation':h.type==='alert'?'warning':h.type==='sensor'?'sensors':h.type==='settings'?'settings':'download'} size={15}/></div>
                          <div className="hi-body">
                            <div className="hi-title">{h.action}</div>
                            <div className="hi-meta">
                              <span style={{display:'flex',alignItems:'center',gap:4}}><Ic name="mapPin" size={11}/>{h.field}</span>
                              <span style={{display:'flex',alignItems:'center',gap:4}}><Ic name="user" size={11}/>{h.user}</span>
                            </div>
                          </div>
                          <div className="hi-time">{h.time}</div>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </>)}

            {/* ══════════════════════ SETTINGS ══════════════════════ */}
            {tab==='settings'&&(<>
              <div className="page-hdr">
                <div className="page-hdr-left"><h1>Settings</h1><p>Configure your AgriSense DZ dashboard</p></div>
                <button className="btn-primary" onClick={()=>showToast('Settings saved!')}><Ic name="save" size={14}/>Save Changes</button>
              </div>
              <div className="settings-grid">
                <div className="settings-card">
                  <h3><Ic name="home" size={16} color="#22c55e"/>Farm Profile</h3>
                  {[['Farm Name','text','farmName','AgriSense DZ'],['Location','text','location','Blida, Algérie'],['Farm Size','text','farmSize','7.2 ha']].map(([l,t,k,ph])=>(
                    <div key={k} className="settings-form-row">
                      <div className="sched-label">{l}</div>
                      <input type={t} className="settings-input" defaultValue={settings[k]||ph} placeholder={ph}/>
                    </div>
                  ))}
                  <div className="settings-form-row">
                    <div className="sched-label">Language</div>
                    <select className="settings-select" defaultValue={settings.language}>
                      <option value="fr">Français</option><option value="ar">العربية</option><option value="en">English</option>
                    </select>
                  </div>
                </div>

                <div className="settings-card">
                  <h3><Ic name="signal" size={16} color="#22c55e"/>Firebase Connection</h3>
                  <div className="firebase-status">
                    <div className={`firebase-status-dot ${firebaseConnected?'online':'offline'}`}/>
                    <div>
                      <div className="firebase-status-text">{firebaseConnected?'Connected to Firebase':'Demo Mode (No Firebase)'}</div>
                      <div className="firebase-status-sub">{firebaseConnected?'Real-time sync active — 5 collections':'Using static demo data'}</div>
                    </div>
                  </div>
                  <div style={{background:'#f5f8f5',borderRadius:10,padding:'0.85rem',fontSize:'0.78rem',color:'#6b7280',lineHeight:1.6,border:'1px solid #e0e8e0',marginBottom:'0.85rem'}}>
                    <strong style={{color:'#1a3a1f',display:'block',marginBottom:'0.35rem'}}>Collections used:</strong>
                    <code style={{background:'#e0e8e0',padding:'1px 5px',borderRadius:4}}>sensorData</code> · KPI cards, sensor table<br/>
                    <code style={{background:'#e0e8e0',padding:'1px 5px',borderRadius:4}}>alerts</code> · Alerts panel, alerts tab<br/>
                    <code style={{background:'#e0e8e0',padding:'1px 5px',borderRadius:4}}>environmentalData</code> · Line chart<br/>
                    <code style={{background:'#e0e8e0',padding:'1px 5px',borderRadius:4}}>fields</code> · Field map, moisture bars<br/>
                    <code style={{background:'#e0e8e0',padding:'1px 5px',borderRadius:4}}>activityLog</code> · Activity log, history tab
                  </div>
                  {[
                    ['sensorData',       firebaseConnected?'✅ Live':'⏳ Waiting'],
                    ['alerts',           firebaseConnected?'✅ Live':'⏳ Waiting'],
                    ['environmentalData','⚠️ Add collection'],
                    ['fields',           '⚠️ Add collection'],
                    ['activityLog',      '⚠️ Add collection'],
                  ].map(([l,s])=>(
                    <div key={l} className="setting-row">
                      <div><div className="setting-label">{l}</div><div className="setting-sub">{s}</div></div>
                    </div>
                  ))}
                </div>

                <div className="settings-card">
                  <h3><Ic name="warning" size={16} color="#f59e0b"/>Alert Thresholds</h3>
                  {[['Min Soil Moisture (%)','number','moistureAlert',30],['Max Temperature (°C)','number','tempAlert',40],['Max Wind Speed (km/h)','number','windAlert',40]].map(([l,t,k,def])=>(
                    <div key={k} className="settings-form-row">
                      <div className="sched-label">{l}</div>
                      <input type={t} className="settings-input" defaultValue={settings[k]||def}/>
                    </div>
                  ))}
                </div>

                <div className="settings-card">
                  <h3><Ic name="bell" size={16} color="#3b82f6"/>Notifications</h3>
                  {[['Email Alerts','emailNotif','Get alerts by email'],['SMS Alerts','smsNotif','Get alerts by SMS'],['Push Notifications','pushNotif','Browser notifications'],['Critical Only','critOnly','Only critical alerts']].map(([l,k,s])=>(
                    <div key={k} className="notification-row">
                      <div><div className="notif-label">{l}</div><div className="notif-sub">{s}</div></div>
                      <Toggle on={settings[k]||false} onChange={()=>setSettings(prev=>({...prev,[k]:!prev[k]}))}/>
                    </div>
                  ))}
                </div>

                <div className="settings-card settings-full">
                  <h3><Ic name="settings" size={16} color="#7c3aed"/>System Preferences</h3>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0.75rem'}}>
                    <div><div className="sched-label">Data Refresh (seconds)</div><select className="settings-select" defaultValue={settings.dataRefresh}><option value="5">5s</option><option value="10">10s</option><option value="30">30s</option><option value="60">60s</option></select></div>
                    <div><div className="sched-label">Temperature Unit</div><select className="settings-select"><option>Celsius (°C)</option><option>Fahrenheit (°F)</option></select></div>
                    <div><div className="sched-label">Date Format</div><select className="settings-select"><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select></div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'1rem',padding:'0.75rem',background:'#fef2f2',borderRadius:10,border:'1px solid #fecaca'}}>
                    <div><div style={{fontWeight:700,fontSize:'0.82rem',color:'#dc2626'}}>Danger Zone</div><div style={{fontSize:'0.72rem',color:'#9ca3af'}}>Irreversible actions — proceed with caution</div></div>
                    <button className="btn-secondary" style={{color:'#ef4444',borderColor:'#fecaca',fontSize:'0.78rem'}} onClick={()=>showToast('All data cleared')}>
                      <Ic name="trash" size={13}/>Clear All Data
                    </button>
                  </div>
                </div>
              </div>
            </>)}

          </div>
        </div>
      </div>
      {toast&&<div className="db-toast">{toast}</div>}
    </>
  )
}