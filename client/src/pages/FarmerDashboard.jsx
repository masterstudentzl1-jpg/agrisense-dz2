import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import logoo from '../assets/logoo.png'

// ─── Shared styles ────────────────────────────────────────────────────────────
const S = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Manrope',sans-serif}

/* ── layout ── */
.db{display:flex;min-height:100vh;background:#f4f5f7;font-family:'Manrope',sans-serif}

/* ── sidebar ── */
.sb{width:300px;background:#0d2818;display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:50;overflow:hidden}
.sb-head{padding:1.25rem 1.25rem 0}
.sb-brand{display:flex;align-items:center;gap:10px;margin-bottom:1.25rem}
.sb-brand-icon{width:40px;height:40px;background:linear-gradient(135deg,#22c55e,#16a34a);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.sb-brand-name{font-size:1.05rem;font-weight:800;color:#fff}
.sb-brand-sub{font-size:0.68rem;color:#4ade80;font-weight:600}
.sb-weather{background:rgba(34,197,94,0.15);border:1px solid rgba(74,222,128,0.2);border-radius:12px;padding:0.75rem 1rem;display:flex;align-items:center;gap:10px;margin-bottom:1.5rem}
.sb-weather-icon{font-size:18px}
.sb-weather-info{font-size:0.78rem;font-weight:700;color:#4ade80}
.sb-weather-info small{display:block;font-size:0.68rem;color:#86efac;font-weight:400}
.sb-section{font-size:0.62rem;font-weight:700;color:#4a7c5a;text-transform:uppercase;letter-spacing:0.12em;padding:0 1.25rem;margin-bottom:0.4rem}
.sb-nav{display:flex;flex-direction:column;gap:2px;padding:0 0.75rem;margin-bottom:1rem}
.sb-item{display:flex;align-items:center;gap:10px;padding:0.65rem 0.75rem;border-radius:10px;cursor:pointer;border:none;background:none;width:100%;text-align:left;transition:all 0.15s;position:relative}
.sb-item:hover{background:rgba(255,255,255,0.06)}
.sb-item.active{background:rgba(34,197,94,0.18)}
.sb-item-icon{font-size:16px;width:20px;text-align:center;flex-shrink:0}
.sb-item-label{font-size:0.88rem;font-weight:600;color:#9dc9ad}
.sb-item.active .sb-item-label{color:#4ade80}
.sb-item:hover .sb-item-label{color:#d1fae5}
.sb-badge{margin-left:auto;background:#ef4444;color:#fff;font-size:0.65rem;font-weight:800;padding:2px 7px;border-radius:50px;min-width:20px;text-align:center}
.sb-foot{margin-top:auto;border-top:1px solid rgba(255,255,255,0.07);padding:1rem 1.25rem;display:flex;align-items:center;justify-content:space-between}
.sb-user{display:flex;align-items:center;gap:10px}
.sb-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#22c55e,#16a34a);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;flex-shrink:0}
.sb-user-name{font-size:0.85rem;font-weight:700;color:#fff}
.sb-user-loc{font-size:0.68rem;color:#86efac}
.sb-logout{background:none;border:none;cursor:pointer;font-size:16px;color:#6b9e7a;transition:color 0.2s;padding:4px}
.sb-logout:hover{color:#ef4444}

/* ── main ── */
.db-main{margin-left:300px;flex:1;display:flex;flex-direction:column;min-height:100vh}

/* ── topbar ── */
.topbar{height:64px;background:#fff;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;position:sticky;top:0;z-index:40}
.topbar-left h2{font-size:1.1rem;font-weight:800;color:#0d1f0f}
.topbar-left p{font-size:0.75rem;color:#9ca3af;margin-top:1px}
.topbar-right{display:flex;align-items:center;gap:0.75rem}
.tb-btn{width:36px;height:36px;border-radius:50%;border:1px solid #e5e7eb;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:15px;position:relative;transition:background 0.15s}
.tb-btn:hover{background:#f9fafb}
.tb-notif-dot{position:absolute;top:6px;right:6px;width:7px;height:7px;border-radius:50%;background:#ef4444;border:1.5px solid #fff}
.tb-live{display:flex;align-items:center;gap:6px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:50px;padding:5px 12px;font-size:0.75rem;font-weight:700;color:#16a34a}
.tb-live-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;animation:pulse 2s ease infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
.tb-user-pill{display:flex;align-items:center;gap:8px;cursor:pointer;padding:4px 10px 4px 4px;border-radius:50px;border:1px solid #e5e7eb;transition:background 0.15s}
.tb-user-pill:hover{background:#f9fafb}
.tb-user-av{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#22c55e,#16a34a);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff}
.tb-user-name{font-size:0.82rem;font-weight:700;color:#0d1f0f}

/* ── content area ── */
.db-content{flex:1;padding:1.75rem 2rem;overflow-y:auto}

/* ── section headers ── */
.page-title{font-size:1.5rem;font-weight:800;color:#0d1f0f;margin-bottom:0.25rem}
.page-sub{font-size:0.85rem;color:#6b7280;margin-bottom:1.75rem}

/* ── KPI cards ── */
.kpi-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-bottom:1.5rem}
.kpi-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.5rem;transition:box-shadow 0.2s}
.kpi-card:hover{box-shadow:0 4px 20px rgba(0,0,0,0.07)}
.kpi-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem}
.kpi-icon-wrap{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:20px}
.kpi-icon-wrap.blue{background:#eff6ff}
.kpi-icon-wrap.green{background:#f0fdf4}
.kpi-icon-wrap.amber{background:#fffbeb}
.kpi-icon-wrap.red{background:#fef2f2}
.kpi-trend{font-size:0.75rem;font-weight:700;display:flex;align-items:center;gap:3px}
.kpi-trend.up{color:#16a34a}
.kpi-trend.down{color:#ef4444}
.kpi-value{font-size:2rem;font-weight:800;color:#0d1f0f;line-height:1;margin-bottom:0.3rem}
.kpi-label{font-size:0.82rem;font-weight:600;color:#374151;margin-bottom:2px}
.kpi-sub{font-size:0.72rem;color:#9ca3af}

/* ── chart cards ── */
.chart-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.5rem;margin-bottom:1.25rem}
.chart-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1.25rem}
.chart-head-left h3{font-size:1rem;font-weight:700;color:#0d1f0f}
.chart-head-left p{font-size:0.75rem;color:#9ca3af;margin-top:2px}
.chart-icon{font-size:20px}
.chart-legend{display:flex;gap:1.25rem;justify-content:center;margin-top:0.75rem;flex-wrap:wrap}
.legend-item{display:flex;align-items:center;gap:5px;font-size:0.75rem;color:#6b7280;font-weight:500}
.legend-dot{width:8px;height:8px;border-radius:50%}

/* ── SVG charts ── */
.chart-svg{width:100%;overflow:visible}

/* ── alerts ── */
.alerts-section{margin-bottom:1.25rem}
.alerts-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem}
.alerts-header h3{font-size:1rem;font-weight:700;color:#0d1f0f}
.alerts-header a{font-size:0.82rem;color:#22c55e;font-weight:700;text-decoration:none;cursor:pointer}
.alert-item{border-radius:14px;padding:1rem 1.25rem;margin-bottom:0.6rem;display:flex;align-items:flex-start;gap:12px;border:1px solid transparent}
.alert-item.critical{background:#fef2f2;border-color:#fecaca}
.alert-item.warning{background:#fffbeb;border-color:#fde68a}
.alert-item.info{background:#f0fdf4;border-color:#bbf7d0}
.alert-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0}
.alert-item.critical .alert-icon{background:#fee2e2}
.alert-item.warning .alert-icon{background:#fef3c7}
.alert-item.info .alert-icon{background:#dcfce7}
.alert-text{flex:1}
.alert-title{font-size:0.88rem;font-weight:700;color:#0d1f0f;margin-bottom:2px}
.alert-item.critical .alert-title{color:#dc2626}
.alert-item.warning .alert-title{color:#d97706}
.alert-item.info .alert-title{color:#16a34a}
.alert-desc{font-size:0.78rem;color:#6b7280;line-height:1.5;margin-bottom:4px}
.alert-meta{font-size:0.7rem;color:#9ca3af;display:flex;gap:10px}
.alert-expand{padding:0.75rem 1.25rem;border-radius:0 0 12px 12px;margin-top:-0.6rem;margin-bottom:0.6rem}
.alert-expand.warning{background:#fffbeb;border:1px solid #fde68a;border-top:none}
.alert-expand-text{font-size:0.82rem;color:#d97706;margin-bottom:0.75rem;font-weight:500}
.alert-expand-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1rem}
.aeg-label{font-size:0.65rem;color:#9ca3af;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:2px}
.aeg-val{font-size:0.82rem;font-weight:700;color:#d97706}
.alert-actions{display:flex;gap:0.5rem}
.btn-take-action{padding:8px 18px;border-radius:50px;border:none;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-size:0.82rem;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif}
.btn-dismiss{padding:8px 18px;border-radius:50px;border:1.5px solid #d1d5db;background:#fff;color:#374151;font-size:0.82rem;font-weight:600;cursor:pointer;font-family:'Manrope',sans-serif}

/* ── sensors list ── */
.sensors-section{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.5rem;margin-bottom:1.25rem}
.sensors-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem}
.sensors-head h3{font-size:1rem;font-weight:700;color:#0d1f0f}
.sensors-head a{font-size:0.82rem;color:#22c55e;font-weight:700;text-decoration:none;cursor:pointer}
.sensor-row{display:flex;align-items:center;padding:0.7rem 0;border-bottom:1px solid #f3f4f6}
.sensor-row:last-child{border-bottom:none}
.sensor-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;margin-right:12px}
.sensor-dot.online{background:#22c55e;box-shadow:0 0 6px rgba(34,197,94,0.5)}
.sensor-dot.warning{background:#f59e0b}
.sensor-dot.offline{background:#9ca3af}
.sensor-info{flex:1}
.sensor-name{font-size:0.88rem;font-weight:700;color:#0d1f0f}
.sensor-loc{font-size:0.72rem;color:#9ca3af;display:flex;align-items:center;gap:3px;margin-top:1px}
.sensor-val{font-size:0.95rem;font-weight:800;color:#374151}

/* ── My Fields ── */
.fields-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.5rem}
.fstat{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:1.25rem 1.5rem}
.fstat-val{font-size:1.6rem;font-weight:800;margin-bottom:2px}
.fstat-val.green{color:#16a34a}
.fstat-val.blue{color:#2563eb}
.fstat-val.purple{color:#7c3aed}
.fstat-label{font-size:0.78rem;color:#9ca3af;font-weight:500}
.fields-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem}
.field-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden}
.field-card-accent{height:4px}
.field-card-accent.green{background:#22c55e}
.field-card-accent.blue{background:#3b82f6}
.field-card-accent.red{background:#ef4444}
.field-card-accent.amber{background:#f59e0b}
.field-card-body{padding:1.25rem}
.field-card-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:0.5rem}
.field-card-title{display:flex;align-items:center;gap:8px}
.field-card-icon{font-size:22px}
.field-name{font-size:1rem;font-weight:700;color:#0d1f0f}
.field-loc{font-size:0.72rem;color:#9ca3af;display:flex;align-items:center;gap:3px;margin-top:1px}
.field-more{background:none;border:none;cursor:pointer;color:#9ca3af;font-size:18px;padding:0}
.field-tags{display:flex;gap:0.5rem;margin-bottom:1rem;flex-wrap:wrap}
.field-tag{font-size:0.72rem;font-weight:700;padding:3px 10px;border-radius:50px;border:1.5px solid}
.field-tag.healthy{background:#f0fdf4;color:#16a34a;border-color:#bbf7d0}
.field-tag.needs-water{background:#eff6ff;color:#2563eb;border-color:#bfdbfe}
.field-tag.at-risk{background:#fef2f2;color:#dc2626;border-color:#fecaca}
.field-tag.crop{background:#f9fafb;color:#374151;border-color:#e5e7eb}
.field-readings{display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin-bottom:1rem}
.field-reading{background:#f9fafb;border-radius:10px;padding:0.6rem;text-align:center}
.field-reading-icon{font-size:14px;margin-bottom:2px}
.field-reading-val{font-size:0.92rem;font-weight:800}
.field-reading-val.blue{color:#2563eb}
.field-reading-val.amber{color:#d97706}
.field-reading-val.green{color:#16a34a}
.field-reading-key{font-size:0.65rem;color:#9ca3af;margin-top:1px}
.field-health-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.4rem}
.field-health-label{font-size:0.75rem;color:#6b7280;display:flex;align-items:center;gap:4px;font-weight:500}
.field-health-pct{font-size:0.82rem;font-weight:800;color:#374151}
.field-bar{height:6px;background:#f3f4f6;border-radius:50px;overflow:hidden}
.field-bar-fill{height:100%;border-radius:50px;transition:width 0.5s ease}
.field-meta{font-size:0.72rem;color:#9ca3af;margin-top:0.6rem}
.btn-add-field{display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:50px;border:none;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-size:0.82rem;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif;box-shadow:0 4px 12px rgba(34,197,94,0.3)}

/* ── Sensors page ── */
.sensors-status-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.25rem}
.status-card{border-radius:14px;padding:1.25rem 1.5rem;display:flex;align-items:center;gap:12px}
.status-card.online-card{background:#f0fdf4;border:1px solid #bbf7d0}
.status-card.warning-card{background:#fffbeb;border:1px solid #fde68a}
.status-card.offline-card{background:#f9fafb;border:1px solid #e5e7eb}
.status-card-icon{font-size:22px}
.status-card-num{font-size:1.8rem;font-weight:800}
.status-card.online-card .status-card-num{color:#16a34a}
.status-card.warning-card .status-card-num{color:#d97706}
.status-card.offline-card .status-card-num{color:#6b7280}
.status-card-label{font-size:0.78rem;font-weight:600;color:#6b7280}
.search-filter-row{display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:0.75rem 1rem}
.search-input-wrap{flex:1;display:flex;align-items:center;gap:8px}
.search-input-wrap input{border:none;outline:none;font-size:0.88rem;font-family:'Manrope',sans-serif;color:#374151;background:none;width:100%}
.search-input-wrap input::placeholder{color:#9ca3af}
.filter-divider{width:1px;height:24px;background:#e5e7eb}
.filter-btns{display:flex;gap:0.5rem}
.filter-btn{padding:5px 12px;border-radius:50px;border:1.5px solid #e5e7eb;background:#fff;font-size:0.78rem;font-weight:600;cursor:pointer;color:#6b7280;font-family:'Manrope',sans-serif;transition:all 0.15s}
.filter-btn.active{background:#22c55e;border-color:#22c55e;color:#fff}
.type-filter-row{display:flex;gap:0.5rem;margin-bottom:1.25rem;flex-wrap:wrap}
.type-btn{padding:6px 14px;border-radius:50px;border:1.5px solid #e5e7eb;background:#fff;font-size:0.78rem;font-weight:600;cursor:pointer;color:#374151;font-family:'Manrope',sans-serif;transition:all 0.15s}
.type-btn.active{border-color:#22c55e;color:#22c55e;background:#f0fdf4}
.sensors-cards-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem}
.sensor-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.25rem}
.sensor-card-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:0.75rem}
.sensor-card-icon{width:44px;height:44px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:20px}
.sensor-card-icon.blue{background:#eff6ff}
.sensor-card-icon.amber{background:#fffbeb}
.sensor-card-icon.teal{background:#f0fdfa}
.sensor-card-icon.purple{background:#faf5ff}
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
.sensor-card-foot{display:flex;align-items:center;justify-content:space-between;margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid #f3f4f6}
.sensor-foot-item{display:flex;align-items:center;gap:4px;font-size:0.72rem;color:#6b7280}

/* ── Analytics ── */
.analytics-time-row{display:flex;align-items:center;gap:0.5rem}
.time-btn{padding:6px 14px;border-radius:50px;border:1.5px solid #e5e7eb;background:#fff;font-size:0.78rem;font-weight:600;cursor:pointer;color:#6b7280;font-family:'Manrope',sans-serif;transition:all 0.15s}
.time-btn.active{background:#22c55e;border-color:#22c55e;color:#fff}
.export-btn{padding:6px 14px;border-radius:50px;border:1.5px solid #e5e7eb;background:#fff;font-size:0.78rem;font-weight:600;cursor:pointer;color:#374151;font-family:'Manrope',sans-serif;display:flex;align-items:center;gap:5px}
.analytics-kpi-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-bottom:1.25rem}
.a-kpi{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:1.25rem 1.5rem}
.a-kpi-head{display:flex;align-items:center;gap:8px;margin-bottom:0.75rem}
.a-kpi-icon{font-size:18px}
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

/* ── Alerts page ── */
.alert-tab-row{display:flex;gap:0.5rem;margin-bottom:1.25rem;flex-wrap:wrap}
.alert-tab{padding:6px 14px;border-radius:50px;border:1.5px solid #e5e7eb;background:#fff;font-size:0.78rem;font-weight:700;cursor:pointer;color:#374151;font-family:'Manrope',sans-serif;display:flex;align-items:center;gap:5px;transition:all 0.15s}
.alert-tab.active{background:#22c55e;border-color:#22c55e;color:#fff}
.alert-tab-count{font-size:0.7rem;font-weight:800}

.topbar-icon-img{width:40px;height:40px;object-fit:contain}


/* ── Settings ── */
.settings-layout{display:grid;grid-template-columns:200px 1fr;gap:1.5rem}
.settings-nav{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:0.75rem;height:fit-content}
.settings-nav-item{display:flex;align-items:center;gap:8px;padding:0.65rem 0.75rem;border-radius:10px;cursor:pointer;font-size:0.85rem;font-weight:600;color:#6b7280;transition:all 0.15s;border:none;background:none;width:100%;text-align:left}
.settings-nav-item:hover{background:#f9fafb;color:#0d1f0f}
.settings-nav-item.active{background:#f0fdf4;color:#16a34a}
.settings-panel{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.75rem}
.settings-profile-head{display:flex;align-items:center;gap:1rem;margin-bottom:2rem}
.settings-avatar{width:72px;height:72px;border-radius:20px;background:linear-gradient(135deg,#22c55e,#16a34a);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:#fff}
.settings-avatar-info h3{font-size:1rem;font-weight:800;color:#0d1f0f}
.settings-avatar-info p{font-size:0.78rem;color:#6b7280}
.settings-avatar-info a{font-size:0.78rem;color:#22c55e;font-weight:700;text-decoration:none;cursor:pointer}
.settings-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.settings-field label{display:block;font-size:0.78rem;font-weight:700;color:#374151;margin-bottom:0.4rem}
.settings-field input,.settings-field select{width:100%;padding:0.7rem 1rem;border:1.5px solid #e5e7eb;border-radius:10px;font-size:0.88rem;font-family:'Manrope',sans-serif;color:#0d1f0f;background:#fafafa;outline:none;transition:border-color 0.2s}
.settings-field input:focus,.settings-field select:focus{border-color:#22c55e;background:#fff}
.btn-save{padding:10px 24px;border:none;border-radius:10px;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-size:0.88rem;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif;margin-top:1.25rem;box-shadow:0 4px 14px rgba(34,197,94,0.3)}
.save-success{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:8px 14px;font-size:0.82rem;color:#16a34a;font-weight:600;margin-top:0.75rem;display:inline-block}
`

// ─── SVG Line Chart ──────────────────────────────────────────────────────────
function LineChart({ datasets, labels, height = 160, yMin, yMax }) {
  const W = 700, H = height, PL = 40, PR = 10, PT = 10, PB = 30
  const cw = W - PL - PR, ch = H - PT - PB
  const lo = yMin ?? Math.min(...datasets.flatMap(d => d.data))
  const hi = yMax ?? Math.max(...datasets.flatMap(d => d.data))
  const range = hi - lo || 1
  const xs = labels.map((_, i) => PL + (i / (labels.length - 1)) * cw)
  const ys = (data) => data.map(v => PT + (1 - (v - lo) / range) * ch)
  const path = (data) => xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys(data)[i]}`).join(' ')
  const area = (data) => {
    const y = ys(data)
    return `${xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${y[i]}`).join(' ')} L${xs[xs.length-1]},${PT+ch} L${xs[0]},${PT+ch} Z`
  }
  const yTicks = [lo, lo + range*0.25, lo + range*0.5, lo + range*0.75, hi].map(v => Math.round(v))
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" style={{height}}>
      <defs>
        {datasets.map((d, i) => (
          <linearGradient key={i} id={`lg${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={d.color} stopOpacity="0.15"/>
            <stop offset="100%" stopColor={d.color} stopOpacity="0"/>
          </linearGradient>
        ))}
      </defs>
      {yTicks.map((t, i) => {
        const y = PT + (1 - (t - lo) / range) * ch
        return <g key={i}>
          <line x1={PL} y1={y} x2={W-PR} y2={y} stroke="#f3f4f6" strokeWidth="1"/>
          <text x={PL-5} y={y+4} fontSize="10" fill="#9ca3af" textAnchor="end">{t}</text>
        </g>
      })}
      {labels.map((l, i) => (
        <text key={i} x={xs[i]} y={H-5} fontSize="10" fill="#9ca3af" textAnchor="middle">{l}</text>
      ))}
      {datasets.map((d, i) => (
        <g key={i}>
          <path d={area(d.data)} fill={`url(#lg${i})`}/>
          <path d={path(d.data)} fill="none" stroke={d.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={d.dashed ? '6,4' : undefined}/>
          {d.data.map((v, j) => j % 2 === 0 && <circle key={j} cx={xs[j]} cy={ys(d.data)[j]} r="3.5" fill={d.color}/>)}
        </g>
      ))}
    </svg>
  )
}

// ─── Bar Chart ───────────────────────────────────────────────────────────────
function BarChart({ groups, labels, colors, height = 200, yMax }) {
  const W = 700, H = height, PL = 45, PR = 10, PT = 10, PB = 30
  const cw = W - PL - PR, ch = H - PT - PB
  const hi = yMax ?? Math.max(...groups.flat())
  const bw = (cw / labels.length) * 0.6 / groups[0].length
  const gap = bw * 0.2
  const groupW = cw / labels.length
  const yTicks = [0, hi*0.25, hi*0.5, hi*0.75, hi].map(v => Math.round(v))
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" style={{height}}>
      {yTicks.map((t, i) => {
        const y = PT + (1 - t/hi) * ch
        return <g key={i}>
          <line x1={PL} y1={y} x2={W-PR} y2={y} stroke="#f3f4f6" strokeWidth="1"/>
          <text x={PL-5} y={y+4} fontSize="10" fill="#9ca3af" textAnchor="end">{t}</text>
        </g>
      })}
      {labels.map((l, gi) => {
        const gx = PL + gi * groupW + groupW * 0.2
        return <g key={gi}>
          {groups.map((series, si) => {
            const bh = (series[gi] / hi) * ch
            const x = gx + si*(bw+gap)
            const y = PT + ch - bh
            return <rect key={si} x={x} y={y} width={bw} height={bh} fill={colors[si]} rx="4"/>
          })}
          <text x={PL + gi*groupW + groupW/2} y={H-5} fontSize="10" fill="#9ca3af" textAnchor="middle">{l}</text>
        </g>
      })}
    </svg>
  )
}

// ─── Radar Chart ─────────────────────────────────────────────────────────────
function RadarChart({ datasets, labels }) {
  const cx = 200, cy = 200, R = 140, N = labels.length
  const angle = (i) => (i / N) * 2 * Math.PI - Math.PI / 2
  const pt = (i, r) => [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))]
  const poly = (vals) => vals.map((v, i) => pt(i, (v / 100) * R).join(',')).join(' ')
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0]
  return (
    <svg viewBox="0 0 400 400" style={{width:'100%',maxWidth:360,margin:'0 auto',display:'block'}}>
      {rings.map((r, i) => <polygon key={i} points={labels.map((_, j) => pt(j, r*R).join(',')).join(' ')} fill="none" stroke="#e5e7eb" strokeWidth="1"/>)}
      {labels.map((_, i) => { const [x2,y2] = pt(i, R); return <line key={i} x1={cx} y1={cy} x2={x2} y2={y2} stroke="#e5e7eb" strokeWidth="1"/> })}
      {datasets.map((d, di) => (
        <polygon key={di} points={poly(d.data)} fill={d.color} fillOpacity="0.15" stroke={d.color} strokeWidth="2"/>
      ))}
      {labels.map((l, i) => {
        const [x, y] = pt(i, R + 20)
        return <text key={i} x={x} y={y} fontSize="11" fill="#6b7280" textAnchor="middle" dominantBaseline="middle">{l}</text>
      })}
    </svg>
  )
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const HOURS = ['06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun']

const moistureData = {
  blida:  [45,44,43,42,41,43,44],
  setif:  [38,37,36,34,35,37,38],
  tiaret: [50,51,49,48,50,52,51],
}
const tempData    = [20,22,26,29,31,28,25,22]
const humData     = [78,74,68,62,58,60,64,68]
const yieldData   = { cereals:[800,880,920,1100,1500,1200], orchards:[350,400,450,650,900,700], greenhouse:[200,250,350,450,550,500] }
const logData     = [{d:'Mon',m:45,t:28,h:64,r:0},{d:'Tue',m:42,t:30,h:60,r:0},{d:'Wed',m:38,t:33,h:55,r:0},{d:'Thu',m:35,t:31,h:58,r:2.4},{d:'Fri',m:40,t:29,h:62,r:0},{d:'Sat',m:44,t:27,h:67,r:0.8},{d:'Sun',m:42,t:28,h:65,r:0}]
const rainfallData = [0,0,0,2.4,0,0.8,0]

const ALERTS_DATA = [
  { id:1, type:'critical', icon:'💧', title:'Critical: Soil Moisture Too Low', desc:'Soil moisture has dropped to 18% — well below the minimum threshold of 30%. Immediate irrigation required to prevent crop damage.', loc:'Sétif · Field Beta', time:'12 min ago', sensor:'S006 – Thermo Node T07', location:'Field Theta · Biskra', ts:'Today, 08:50 AM' },
  { id:2, type:'warning', icon:'🌡️', title:'High Temperature Alert', desc:'Temperature sensor T-07 is reading 38.5°C, exceeding the safe threshold of 36°C. Monitor crops for heat stress.', loc:'Biskra · Field Theta', time:'45 min ago', sensor:'S006 – Thermo Node T07', location:'Field Theta · Biskra', ts:'Today, 08:50 AM' },
  { id:3, type:'warning', icon:'🔋', title:'Sensor S-12 battery below 20% — Tiaret', desc:'Sensor battery is critically low and may disconnect soon.', loc:'Tiaret', time:'1 hr ago' },
  { id:4, type:'info', icon:'✅', title:'Irrigation cycle completed — Field Alpha, Blida', desc:'Scheduled irrigation ran successfully. Field moisture up to 45%.', loc:'Blida · Field Alpha', time:'2 hrs ago' },
]

const SENSORS_DATA = [
  { id:'S001', name:'Soil Probe A1', type:'Moisture', val:'42%', loc:'bouira', status:'online', icon:'💧', iconClass:'blue', valColor:'blue', battery:87, signal:95 },
  { id:'S002', name:'Thermo Node B3', type:'Temperature', val:'31.4°C', loc:'blida', status:'online', icon:'🌡️', iconClass:'amber', valColor:'amber', battery:62, signal:88 },
  { id:'S003', name:'Hygro Sensor C2', type:'Humidity', val:'68%', loc:'tizi', status:'warning', icon:'💨', iconClass:'teal', valColor:'teal', battery:21, signal:70 },
  { id:'S004', name:'Rain Gauge D1', type:'Rainfall', val:'0 mm', loc:'Biskra', status:'online', icon:'🌧️', iconClass:'purple', valColor:'blue', battery:95, signal:91 },
]

const FIELDS_DATA = [
  { name:'Field Alpha', loc:'Bouira', accent:'green', status:'healthy', crop:'Wheat', moisture:{v:'42%',c:'blue'}, temp:{v:'28°C',c:'amber'}, sensors:{v:'5',c:'green'}, health:72, area:'24 ha · F01' },
  { name:'Field Beta', loc:'Blida', accent:'blue', status:'needs-water', crop:'Barley', moisture:{v:'30%',c:'blue'}, temp:{v:'31°C',c:'amber'}, sensors:{v:'4',c:'green'}, health:55, area:'18 ha · F02' },
  { name:'Field Gamma', loc:'tizi', accent:'red', status:'at-risk', crop:'Dates', moisture:{v:'18%',c:'blue'}, temp:{v:'38°C',c:'amber'}, sensors:{v:'3',c:'green'}, health:32, area:'12 ha · F03' },
  { name:'Field Delta', loc:'Biskra', accent:'amber', status:'healthy', crop:'Olive', moisture:{v:'55%',c:'blue'}, temp:{v:'24°C',c:'amber'}, sensors:{v:'6',c:'green'}, health:88, area:'30 ha · F04' },
]

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function FarmerDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [now, setNow] = useState(new Date())
  const [alertFilter, setAlertFilter] = useState('All')
  const [expandedAlert, setExpandedAlert] = useState(2)
  const [sensorFilter, setSensorFilter] = useState('All')
  const [sensorType, setSensorType] = useState('All Types')
  const [analyticsTime, setAnalyticsTime] = useState('7 Days')
  const [settingsTab, setSettingsTab] = useState('Profile')
  const [savedSettings, setSavedSettings] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(id)
  }, [])

  const firstName = user?.firstName || "farmer"
  const lastName  = user?.lastName  || "far"
  const initials  = `${firstName[0]}${lastName[0]}`
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const dateStr = now.toLocaleDateString('en-GB', { weekday:'short', month:'short', day:'numeric' }) + ' · ' + now.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' })

  const navItems = [
    { key:'overview', icon:'⊞', label:'Overview' },
    { key:'fields',   icon:'⬡', label:'My Fields' },
    { key:'sensors',  icon:'⌬', label:'Sensors' },
    { key:'analytics',icon:'◫', label:'Analytics' },
    { key:'alerts',   icon:'🔔', label:'Alerts', badge:3 },
    { key:'settings', icon:'⚙', label:'Settings' },
  ]

  const alertTabs = ['All','Critical','Warning','Info','Resolved']
  const alertCounts = { All:7, Critical:2, Warning:1, Info:2, Resolved:2 }
  const filteredAlerts = alertFilter === 'All' ? ALERTS_DATA : ALERTS_DATA.filter(a => a.type === alertFilter.toLowerCase())

  return (
    <>
      <style>{S}</style>
      <div className="db">

        {/* ── SIDEBAR ──────────────────────────────────────────────────── */}
        <aside className="sb">
          <div className="sb-head">
            <div className="sb-brand">
              <img src={logoo} alt="logo" className="topbar-icon-img" />
              <div>
                <div className="sb-brand-name">AgriSense</div>
                <div className="sb-brand-sub">DZ Dashboard</div>
              </div>
            </div>
            <div className="sb-weather">
              <span className="sb-weather-icon">☀️</span>
              <div className="sb-weather-info">
                Bouira Region
                <small>24°C · Sunny · 68% Hum.</small>
              </div>
            </div>
          </div>

          <div className="sb-section">Main Menu</div>
          <div className="sb-nav">
            {navItems.map(n => (
              <button key={n.key} className={`sb-item ${tab === n.key ? 'active' : ''}`} onClick={() => setTab(n.key)}>
                <span className="sb-item-icon">{n.icon}</span>
                <span className="sb-item-label">{n.label}</span>
                {n.badge && <span className="sb-badge">{n.badge}</span>}
              </button>
            ))}
          </div>

{/* ── Back to Home ── */}
<div style={{ padding: '0 0.75rem', marginBottom: '0.5rem' }}>
  <button
    onClick={() => navigate('/')}
    style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      width: '100%', padding: '0.65rem 0.75rem',
      borderRadius: '10px', border: 'none', background: 'none',
      cursor: 'pointer', textAlign: 'left',
      color: '#9dc9ad', fontSize: '0.88rem', fontWeight: 600,
      transition: 'background 0.15s',
      fontFamily: 'Manrope, sans-serif',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
    onMouseLeave={e => e.currentTarget.style.background = 'none'}
  >
    <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>🏠</span>
    Back to Home
  </button>
</div>




          <div className="sb-foot">
            <div className="sb-user">
              <div className="sb-avatar">{initials}</div>
              <div>
                <div className="sb-user-name">{firstName} {lastName}</div>
                <div className="sb-user-loc">{user?.wilaya || 'Bouira'}, Wilaya 10</div>
              </div>
            </div>
            <button className="sb-logout" title="Logout" onClick={() => { logout(); navigate('/') }}>⇥</button>
          </div>
        </aside>

        {/* ── MAIN ─────────────────────────────────────────────────────── */}
        <div className="db-main">

          {/* Topbar */}
          <div className="topbar">
            <div className="topbar-left">
              <h2>{navItems.find(n => n.key === tab)?.label}</h2>
              <p>{dateStr}</p>
            </div>
            <div className="topbar-right">
              <button className="tb-btn">↻</button>
              <button className="tb-btn" style={{position:'relative'}}>
                🔔
                <span className="tb-notif-dot"/>
              </button>
              {tab === 'overview' && (
                <div className="tb-live">
                  <span className="tb-live-dot"/>
                  Live · Updated just now
                </div>
              )}
              <div className="tb-user-pill">
                <div className="tb-user-av">{initials}</div>
                <span className="tb-user-name">{firstName}</span>
                <span style={{fontSize:'12px',color:'#9ca3af'}}>▾</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="db-content">

            {/* ══ OVERVIEW ══════════════════════════════════════════════ */}
            {tab === 'overview' && (<>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem'}}>
                <div>
                  <h1 className="page-title">{greeting}, {firstName} 👋</h1>
                  <p className="page-sub" style={{marginBottom:0}}>Here's what's happening on your farm today.</p>
                </div>
              </div>

              {/* KPI cards */}
              <div className="kpi-grid">
                {[
                  { icon:'📡', iconClass:'blue', val:'24', label:'Active Sensors', sub:'22 online · 2 offline', trend:'+8%', dir:'up' },
                  { icon:'💧', iconClass:'blue', val:'43%', label:'Avg. Soil Moisture', sub:'Optimal range 35–60%', trend:'-3%', dir:'down' },
                  { icon:'🌡️', iconClass:'amber', val:'31.4°C', label:'Avg. Temperature', sub:'Across all field nodes', trend:'+2%', dir:'up' },
                  { icon:'⚠️', iconClass:'red', val:'3', label:'Active Alerts', sub:'1 critical · 2 warnings', trend:'-1%', dir:'down' },
                ].map((k,i) => (
                  <div key={i} className="kpi-card">
                    <div className="kpi-top">
                      <div className={`kpi-icon-wrap ${k.iconClass}`}>{k.icon}</div>
                      <span className={`kpi-trend ${k.dir}`}>{k.dir==='up'?'↗':'↘'} {k.trend}</span>
                    </div>
                    <div className="kpi-value">{k.val}</div>
                    <div className="kpi-label">{k.label}</div>
                    <div className="kpi-sub">{k.sub}</div>
                  </div>
                ))}
              </div>

              {/* Soil Moisture chart */}
              <div className="chart-card">
                <div className="chart-head">
                  <div className="chart-head-left">
                    <h3>Soil Moisture — 7 Days</h3>
                    <p>By field region (%)</p>
                  </div>
                  <span className="chart-icon">💧</span>
                </div>
                <LineChart
                  datasets={[
                    { data:moistureData.blida,  color:'#16a34a', label:'Blida'  },
                    { data:moistureData.setif,  color:'#06b6d4', label:'Sétif'  },
                    { data:moistureData.tiaret, color:'#8b5cf6', label:'Tiaret' },
                  ]}
                  labels={DAYS} height={180} yMin={20} yMax={65}
                />
                <div className="chart-legend">
                  {[{c:'#16a34a',l:'Blida'},{c:'#06b6d4',l:'Sétif'},{c:'#8b5cf6',l:'Tiaret'}].map(d=>(
                    <div key={d.l} className="legend-item"><span className="legend-dot" style={{background:d.c}}/>{d.l}</div>
                  ))}
                </div>
              </div>

              {/* Temp & Humidity chart */}
              <div className="chart-card">
                <div className="chart-head">
                  <div className="chart-head-left"><h3>Temp &amp; Humidity</h3><p>Today · Bouira field (°C / %)</p></div>
                  <span className="chart-icon">🌡️</span>
                </div>
                <LineChart
                  datasets={[
                    { data:tempData, color:'#f59e0b', label:'Temp' },
                    { data:humData,  color:'#06b6d4', label:'Hum', dashed:true },
                  ]}
                  labels={HOURS} height={160} yMin={0} yMax={85}
                />
                <div className="chart-legend">
                  {[{c:'#f59e0b',l:'Temp (°C)'},{c:'#06b6d4',l:'Hum. (%)'}].map(d=>(
                    <div key={d.l} className="legend-item"><span className="legend-dot" style={{background:d.c}}/>{d.l}</div>
                  ))}
                </div>
              </div>

              {/* Yield Trend */}
              <div className="chart-card">
                <div className="chart-head">
                  <div className="chart-head-left"><h3>Yield Trend (kg/ha)</h3><p>By crop type · 2026</p></div>
                  <span className="chart-icon">↗</span>
                </div>
                <BarChart
                  groups={[yieldData.cereals, yieldData.orchards, yieldData.greenhouse]}
                  labels={MONTHS} colors={['#16a34a','#4ade80','#86efac']} height={200} yMax={1600}
                />
                <div className="chart-legend">
                  {[{c:'#16a34a',l:'Cereals'},{c:'#4ade80',l:'Orchards'},{c:'#86efac',l:'Greenhouse'}].map(d=>(
                    <div key={d.l} className="legend-item"><span className="legend-dot" style={{background:d.c}}/>{d.l}</div>
                  ))}
                </div>
              </div>

              {/* Recent Alerts */}
              <div className="alerts-section">
                <div className="alerts-header">
                  <h3>Recent Alerts</h3>
                  <a onClick={() => setTab('alerts')}>View all →</a>
                </div>
                {ALERTS_DATA.slice(0,3).map(a => (
                  <div key={a.id}>
                    <div className={`alert-item ${a.type}`} onClick={() => setExpandedAlert(expandedAlert === a.id ? null : a.id)} style={{cursor:'pointer'}}>
                      <div className="alert-icon">{a.icon}</div>
                      <div className="alert-text">
                        <div className="alert-title">{a.title}</div>
                        <div className="alert-meta"><span>📍 {a.loc}</span><span>🕐 {a.time}</span></div>
                      </div>
                    </div>
                    {expandedAlert === a.id && a.type === 'warning' && (
                      <div className={`alert-expand ${a.type}`}>
                        <p className="alert-expand-text">{a.desc}</p>
                        <div className="alert-expand-grid">
                          <div><div className="aeg-label">Sensor</div><div className="aeg-val">{a.sensor}</div></div>
                          <div><div className="aeg-label">Location</div><div className="aeg-val">{a.location}</div></div>
                          <div><div className="aeg-label">Timestamp</div><div className="aeg-val">{a.ts}</div></div>
                        </div>
                        <div className="alert-actions">
                          <button className="btn-take-action">Take Action</button>
                          <button className="btn-dismiss">Dismiss</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Sensors list */}
              <div className="sensors-section">
                <div className="sensors-head"><h3>Sensors</h3><a onClick={() => setTab('sensors')}>All →</a></div>
                {SENSORS_DATA.map(s => (
                  <div key={s.id} className="sensor-row">
                    <span className={`sensor-dot ${s.status}`}/>
                    <div className="sensor-info">
                      <div className="sensor-name">{s.name}</div>
                      <div className="sensor-loc">📍 {s.loc}</div>
                    </div>
                    <span className="sensor-val">{s.val}</span>
                  </div>
                ))}
              </div>
            </>)}

            {/* ══ MY FIELDS ═════════════════════════════════════════════ */}
            {tab === 'fields' && (<>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
                <div>
                  <h1 className="page-title">My Fields</h1>
                  <p className="page-sub" style={{marginBottom:0}}>6 fields · 124 ha total</p>
                </div>
                <button className="btn-add-field">+ Add Field</button>
              </div>
              <div className="fields-stats">
                <div className="fstat"><div className="fstat-val green">124 ha</div><div className="fstat-label">Total Area</div></div>
                <div className="fstat"><div className="fstat-val blue">25</div><div className="fstat-label">Active Sensors</div></div>
                <div className="fstat"><div className="fstat-val purple">67%</div><div className="fstat-label">Avg. Health</div></div>
              </div>
              <div className="fields-grid">
                {FIELDS_DATA.map((f,i) => (
                  <div key={i} className="field-card">
                    <div className={`field-card-accent ${f.accent}`}/>
                    <div className="field-card-body">
                      <div className="field-card-head">
                        <div className="field-card-title">
                          <span className="field-card-icon">🌾</span>
                          <div>
                            <div className="field-name">{f.name}</div>
                            <div className="field-loc">📍 {f.loc}</div>
                          </div>
                        </div>
                        <button className="field-more">…</button>
                      </div>
                      <div className="field-tags">
                        <span className={`field-tag ${f.status}`}>{f.status === 'healthy' ? '● Healthy' : f.status === 'needs-water' ? '● Needs Water' : '● At Risk'}</span>
                        <span className="field-tag crop">{f.crop}</span>
                      </div>
                      <div className="field-readings">
                        <div className="field-reading">
                          <div className="field-reading-icon">💧</div>
                          <div className={`field-reading-val ${f.moisture.c}`}>{f.moisture.v}</div>
                          <div className="field-reading-key">Moisture</div>
                        </div>
                        <div className="field-reading">
                          <div className="field-reading-icon">🌡️</div>
                          <div className={`field-reading-val ${f.temp.c}`}>{f.temp.v}</div>
                          <div className="field-reading-key">Temp.</div>
                        </div>
                        <div className="field-reading">
                          <div className="field-reading-icon">📡</div>
                          <div className={`field-reading-val ${f.sensors.c}`}>{f.sensors.v}</div>
                          <div className="field-reading-key">Sensors</div>
                        </div>
                      </div>
                      <div className="field-health-row">
                        <span className="field-health-label">↗ Field Health</span>
                        <span className="field-health-pct">{f.health}%</span>
                      </div>
                      <div className="field-bar">
                        <div className="field-bar-fill" style={{width:`${f.health}%`, background: f.health > 70 ? '#22c55e' : f.health > 50 ? '#3b82f6' : '#ef4444'}}/>
                      </div>
                      <div className="field-meta">{f.area}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>)}

            {/* ══ SENSORS ═══════════════════════════════════════════════ */}
            {tab === 'sensors' && (<>
              <h1 className="page-title">Sensors</h1>
              <p className="page-sub">12 sensors across 10 wilayas</p>
              <div className="sensors-status-grid">
                <div className="status-card online-card"><span className="status-card-icon">✅</span><div><div className="status-card-num">8</div><div className="status-card-label">Online</div></div></div>
                <div className="status-card warning-card"><span className="status-card-icon">⚠️</span><div><div className="status-card-num">3</div><div className="status-card-label">Warning</div></div></div>
                <div className="status-card offline-card"><span className="status-card-icon">📵</span><div><div className="status-card-num">1</div><div className="status-card-label">Offline</div></div></div>
              </div>
              <div className="search-filter-row">
                <div className="search-input-wrap">
                  <span style={{fontSize:15,color:'#9ca3af'}}>🔍</span>
                  <input placeholder="Search by name, wilaya, or field..."/>
                </div>
                <div className="filter-divider"/>
                <div className="filter-btns">
                  {['All','Online','Warning','Offline'].map(f => (
                    <button key={f} className={`filter-btn ${sensorFilter===f?'active':''}`} onClick={()=>setSensorFilter(f)}>{f}</button>
                  ))}
                </div>
              </div>
              <div className="type-filter-row">
                {['All Types','Moisture','Temperature','Humidity','Rainfall','Wind'].map(t => (
                  <button key={t} className={`type-btn ${sensorType===t?'active':''}`} onClick={()=>setSensorType(t)}>{t}</button>
                ))}
              </div>
              <div className="sensors-cards-grid">
                {SENSORS_DATA.map(s => (
                  <div key={s.id} className="sensor-card">
                    <div className="sensor-card-head">
                      <div className={`sensor-card-icon ${s.iconClass}`}>{s.icon}</div>
                      <div className={`sensor-status-badge ${s.status}`}><span className="sensor-status-dot"/>{s.status.charAt(0).toUpperCase()+s.status.slice(1)}</div>
                    </div>
                    <div className="sensor-card-name">{s.name}</div>
                    <div className="sensor-card-id">{s.id}</div>
                    <div className="sensor-card-val">{s.val}</div>
                    <div className={`sensor-card-type ${s.valColor}`}>{s.type}</div>
                    <div className="sensor-card-foot">
                      <div className="sensor-foot-item">📍 {s.loc}</div>
                      <div className="sensor-foot-item">🔋 {s.battery}%</div>
                      <div className="sensor-foot-item">📶 {s.signal}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </>)}

            {/* ══ ANALYTICS ════════════════════════════════════════════ */}
            {tab === 'analytics' && (<>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1.5rem'}}>
                <div>
                  <h1 className="page-title">Analytics</h1>
                  <p className="page-sub" style={{marginBottom:0}}>Deep insights across all your fields and sensors</p>
                </div>
                <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
                  {['24 Hours','7 Days','30 Days','3 Months'].map(t=>(
                    <button key={t} className={`time-btn ${analyticsTime===t?'active':''}`} onClick={()=>setAnalyticsTime(t)}>{t}</button>
                  ))}
                  <button className="export-btn">⬇ Export</button>
                </div>
              </div>

              <div className="analytics-kpi-grid">
                {[
                  { icon:'💧', name:'Avg. Soil Moisture', val:'41%', change:'-4% vs last period', pos:false },
                  { icon:'🌡️', name:'Peak Temperature', val:'35.2°C', change:'+2.1°C vs last period', pos:false },
                  { icon:'↗', name:'Yield Improvement', val:'+18%', change:'vs same period 2024', pos:true },
                  { icon:'🌧️', name:'Total Rainfall', val:'12.4 mm', change:'-8 mm vs last period', pos:false },
                ].map((k,i) => (
                  <div key={i} className="a-kpi">
                    <div className="a-kpi-head"><span className="a-kpi-icon">{k.icon}</span><span className="a-kpi-name">{k.name}</span></div>
                    <div className="a-kpi-val">{k.val}</div>
                    <div className={`a-kpi-change ${k.pos?'pos':'neg'}`}>{k.change}</div>
                  </div>
                ))}
              </div>

              {/* Soil Moisture chart */}
              <div className="chart-card">
                <div className="chart-head"><div className="chart-head-left"><h3>Soil Moisture</h3><p>By region (%)</p></div><span className="chart-icon">💧</span></div>
                <LineChart datasets={[{data:moistureData.blida,color:'#16a34a'},{data:moistureData.setif,color:'#06b6d4'},{data:moistureData.tiaret,color:'#8b5cf6'}]} labels={DAYS} height={160} yMin={20} yMax={65}/>
                <div className="chart-legend">
                  {[{c:'#16a34a',l:'Blida'},{c:'#06b6d4',l:'Sétif'},{c:'#8b5cf6',l:'Tiaret'}].map(d=>(
                    <div key={d.l} className="legend-item"><span className="legend-dot" style={{background:d.c}}/>{d.l}</div>
                  ))}
                </div>
              </div>

              {/* Rainfall */}
              <div className="chart-card">
                <div className="chart-head"><div className="chart-head-left"><h3>Rainfall (mm)</h3><p>Precipitation events · 7 Days</p></div><span className="chart-icon">🌧️</span></div>
                <BarChart groups={[rainfallData]} labels={DAYS} colors={['#8b5cf6']} height={180} yMax={3}/>
              </div>

              {/* Radar */}
              <div className="chart-card">
                <div className="chart-head"><div className="chart-head-left"><h3>Field Health Score</h3><p>By region (0–100)</p></div></div>
                <RadarChart
                  datasets={[
                    { data:[72,80,65,70,75,68], color:'#16a34a', label:'Bouira'  },
                    { data:[60,55,70,65,60,55], color:'#06b6d4', label:'Blida'  },
                    { data:[50,60,55,50,58,52], color:'#f59e0b', label:'Tizi Ouzou' },
                    { data:[45,50,48,52,44,46], color:'#8b5cf6', label:'Biskra' },
                  ]}
                  labels={['Moisture','Temp Ctrl','Humidity','Yield','Sensor Up.','Irrigation']}
                />
                <div className="chart-legend" style={{marginTop:'1rem'}}>
                  {[{c:'#16a34a',l:'Bouira'},{c:'#06b6d4',l:'Blida'},{c:'#f59e0b',l:'Tizi Ouzou'},{c:'#8b5cf6',l:'Biskra'}].map(d=>(
                    <div key={d.l} className="legend-item"><span className="legend-dot" style={{background:d.c}}/>{d.l}</div>
                  ))}
                </div>
              </div>

              {/* Data Log */}
              <div className="chart-card">
                <div className="chart-head">
                  <div className="chart-head-left"><h3>📅 Data Log — 7 Days</h3></div>
                  <span style={{fontSize:'0.78rem',color:'#9ca3af'}}>7 records</span>
                </div>
                <table className="data-table" style={{width:'100%'}}>
                  <thead>
                    <tr>
                      <th>TIME</th><th>MOISTURE (%)</th><th>TEMP (°C)</th><th>HUMIDITY (%)</th><th style={{textAlign:'right'}}>RAINFALL (MM)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logData.map(r => (
                      <tr key={r.d}>
                        <td>{r.d}</td>
                        <td className="td-moisture">{r.m}</td>
                        <td className="td-temp">{r.t}</td>
                        <td>{r.h}</td>
                        <td style={{textAlign:'right'}} className={r.r > 0 ? 'td-rain' : 'td-zero'}>{r.r > 0 ? r.r : 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>)}

            {/* ══ ALERTS ════════════════════════════════════════════════ */}
            {tab === 'alerts' && (<>
              <h1 className="page-title">Alerts</h1>
              <p className="page-sub" style={{marginBottom:'1rem'}}></p>
              <div className="alert-tab-row">
                {alertTabs.map(t => (
                  <button key={t} className={`alert-tab ${alertFilter===t?'active':''}`} onClick={()=>setAlertFilter(t)}>
                    {t} <span className="alert-tab-count">{alertCounts[t]}</span>
                  </button>
                ))}
              </div>
              {(alertFilter === 'All' ? ALERTS_DATA : ALERTS_DATA.filter(a => a.type === alertFilter.toLowerCase())).map(a => (
                <div key={a.id}>
                  <div className={`alert-item ${a.type}`} style={{cursor:'pointer'}} onClick={()=>setExpandedAlert(expandedAlert===a.id?null:a.id)}>
                    <div className="alert-icon">{a.icon}</div>
                    <div className="alert-text">
                      <div className="alert-title">{a.title}</div>
                      <div className="alert-desc">{a.desc}</div>
                      <div className="alert-meta"><span>📍 {a.loc}</span><span>🕐 {a.time}</span></div>
                    </div>
                    <span style={{fontSize:'0.75rem',fontWeight:700,padding:'3px 10px',borderRadius:'50px',background: a.type==='critical'?'#fee2e2':a.type==='warning'?'#fef3c7':'#dcfce7',color:a.type==='critical'?'#dc2626':a.type==='warning'?'#d97706':'#16a34a',flexShrink:0}}>
                      ● {a.type.charAt(0).toUpperCase()+a.type.slice(1)}
                    </span>
                  </div>
                  {expandedAlert === a.id && a.sensor && (
                    <div className={`alert-expand ${a.type}`}>
                      <p className="alert-expand-text">{a.desc}</p>
                      <div className="alert-expand-grid">
                        <div><div className="aeg-label">Sensor</div><div className="aeg-val">{a.sensor}</div></div>
                        <div><div className="aeg-label">Location</div><div className="aeg-val">{a.location}</div></div>
                        <div><div className="aeg-label">Timestamp</div><div className="aeg-val">{a.ts}</div></div>
                      </div>
                      <div className="alert-actions">
                        <button className="btn-take-action">Take Action</button>
                        <button className="btn-dismiss">Dismiss</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>)}

            {/* ══ SETTINGS ══════════════════════════════════════════════ */}
            {tab === 'settings' && (<>
              <h1 className="page-title">Settings</h1>
              <p className="page-sub">Manage your account, notifications, and preferences</p>
              <div className="settings-layout">
                <div className="settings-nav">
                  {['Profile','Notifications','Security','Devices & App','Preferences'].map(s=>(
                    <button key={s} className={`settings-nav-item ${settingsTab===s?'active':''}`} onClick={()=>setSettingsTab(s)}>
                      {s==='Profile'?'👤':s==='Notifications'?'🔔':s==='Security'?'🛡':s==='Devices & App'?'📱':'🌐'} {s}
                    </button>
                  ))}
                </div>
                <div className="settings-panel">
                  {settingsTab === 'Profile' && (<>
                    <div className="settings-profile-head">
                      <div className="settings-avatar">{initials}</div>
                      <div className="settings-avatar-info">
                        <h3>{firstName} {lastName}</h3>
                        <p>Farmer · 10 – Bouira</p>
                        <a>Change photo</a>
                      </div>
                    </div>
                    <div className="settings-form-grid">
                      {[
                        {label:'Full Name',val:`${firstName} ${lastName}`},
                        {label:'Email Address',val:`${firstName.toLowerCase()}.${lastName.toLowerCase()}@farm.dz`},
                        {label:'Phone Number',val:'+213 555 123 456'},
                        {label:'Farm Name',val:'Ferme Benali'},
                        {label:'Farm Size (ha)',val:'80'},
                        {label:'Wilaya',val:'10 – Bouia'},
                      ].map(f=>(
                        <div key={f.label} className="settings-field">
                          <label>{f.label}</label>
                          <input defaultValue={f.val}/>
                        </div>
                      ))}
                    </div>
                    <button className="btn-save" onClick={()=>{setSavedSettings(true);setTimeout(()=>setSavedSettings(false),2500)}}>Save Changes</button>
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

          </div>{/* db-content */}
        </div>{/* db-main */}
      </div>{/* db */}
    </>
  )
}