import { useState, useEffect } from 'react'
import { db } from '../firebase'
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc
} from 'firebase/firestore'

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icons = {
  logo:     ['M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'],
  lock:     ['M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z'],
  product:  ['M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z'],
  order:    ['M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z'],
  users:    ['M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z'],
  messages: ['M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z'],
  plus:     'M12 4.5v15m7.5-7.5h-15',
  edit:     ['M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'],
  trash:    ['M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'],
  close:    'M6 18L18 6M6 6l12 12',
  check:    'M4.5 12.75l6 6 9-13.5',
  logout:   ['M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9'],
  eye:      ['M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z', 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'],
  payment:  ['M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z'],
  search:   'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z',
}

const Ic = ({ name, size = 18, style = {} }) => {
  const d = Icons[name]
  if (!d) return null
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  )
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .adm-root { font-family: 'Manrope', sans-serif; min-height: 100vh; background: #f3f4f6; }

  /* ── LOGIN ── */
  .adm-login {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #052e16 0%, #14532d 60%, #166534 100%);
    padding: 2rem;
  }
  .adm-login-card {
    background: #fff; border-radius: 24px; padding: 3rem 2.5rem;
    width: 100%; max-width: 420px;
    box-shadow: 0 32px 80px rgba(0,0,0,0.4);
  }
  .adm-login-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 2rem; }
  .adm-login-logo-icon { width: 44px; height: 44px; background: linear-gradient(135deg,#22c55e,#16a34a); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #fff; }
  .adm-login-logo-text { font-size: 1.1rem; font-weight: 800; color: #0d1f0f; }
  .adm-login-logo-text span { color: #22c55e; }
  .adm-login-badge { display: inline-block; background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a; font-size: 0.72rem; font-weight: 700; padding: 4px 12px; border-radius: 50px; margin-bottom: 1.5rem; }
  .adm-login-card h2 { font-size: 1.6rem; font-weight: 800; color: #0d1f0f; margin-bottom: 0.35rem; }
  .adm-login-card p { font-size: 0.88rem; color: #6b7280; margin-bottom: 2rem; }
  .adm-field { margin-bottom: 1rem; }
  .adm-field label { display: block; font-size: 0.8rem; font-weight: 700; color: #374151; margin-bottom: 0.4rem; }
  .adm-field input, .adm-field select, .adm-field textarea {
    width: 100%; padding: 0.78rem 1rem; border: 1.5px solid #e5e7eb; border-radius: 12px;
    font-size: 0.9rem; font-family: 'Manrope', sans-serif; color: #0d1f0f;
    background: #f9fafb; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  .adm-field input:focus, .adm-field select:focus, .adm-field textarea:focus {
    border-color: #22c55e; background: #fff; box-shadow: 0 0 0 3px rgba(34,197,94,0.12);
  }
  .adm-field textarea { resize: vertical; min-height: 90px; }
  .adm-btn-primary {
    width: 100%; padding: 0.88rem; border: none; border-radius: 12px;
    background: linear-gradient(135deg, #22c55e, #16a34a); color: #fff;
    font-size: 0.95rem; font-weight: 700; font-family: 'Manrope', sans-serif;
    cursor: pointer; box-shadow: 0 6px 20px rgba(34,197,94,0.35);
    transition: transform 0.2s, box-shadow 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .adm-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(34,197,94,0.45); }
  .adm-error { background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 0.7rem 1rem; font-size: 0.83rem; color: #dc2626; margin-bottom: 1rem; }

  /* ── LAYOUT ── */
  .adm-layout { display: flex; min-height: 100vh; }

  /* ── SIDEBAR ── */
  .adm-sidebar {
    width: 240px; background: #0d1f0f; flex-shrink: 0;
    display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0;
    z-index: 100;
  }
  .adm-sidebar-top { padding: 1.5rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .adm-sidebar-logo { display: flex; align-items: center; gap: 10px; }
  .adm-sidebar-logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg,#22c55e,#16a34a); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
  .adm-sidebar-logo-text { font-size: 0.95rem; font-weight: 800; color: #fff; }
  .adm-sidebar-logo-text span { color: #4ade80; }
  .adm-sidebar-badge { font-size: 0.62rem; font-weight: 700; color: #4ade80; background: rgba(74,222,128,0.12); border: 1px solid rgba(74,222,128,0.2); padding: 2px 8px; border-radius: 50px; margin-top: 6px; display: inline-block; }
  .adm-nav { flex: 1; padding: 1rem 0.75rem; display: flex; flex-direction: column; gap: 4px; }
  .adm-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 0.75rem 1rem; border-radius: 10px; cursor: pointer;
    font-size: 0.88rem; font-weight: 600; color: #86efac;
    transition: all 0.15s; border: none; background: none; font-family: 'Manrope', sans-serif;
    width: 100%; text-align: left;
  }
  .adm-nav-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
  .adm-nav-item.active { background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.2); }
  .adm-nav-badge { margin-left: auto; background: #22c55e; color: #fff; font-size: 0.62rem; font-weight: 800; padding: 2px 7px; border-radius: 50px; }
  .adm-sidebar-bottom { padding: 1rem 0.75rem; border-top: 1px solid rgba(255,255,255,0.08); }
  .adm-logout-btn {
    display: flex; align-items: center; gap: 10px; width: 100%;
    padding: 0.75rem 1rem; border-radius: 10px; border: none; background: none;
    color: #fca5a5; font-size: 0.88rem; font-weight: 600; cursor: pointer;
    font-family: 'Manrope', sans-serif; transition: background 0.15s;
  }
  .adm-logout-btn:hover { background: rgba(239,68,68,0.1); }

  /* ── MAIN ── */
  .adm-main { margin-left: 240px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
  .adm-topbar {
    background: #fff; border-bottom: 1px solid #e5e7eb;
    padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }
  .adm-topbar-title { font-size: 1.1rem; font-weight: 800; color: #0d1f0f; }
  .adm-topbar-sub { font-size: 0.78rem; color: #9ca3af; margin-top: 1px; }
  .adm-topbar-right { display: flex; align-items: center; gap: 0.75rem; }
  .adm-admin-pill { background: #f0fdf4; border: 1px solid #bbf7d0; color: #16a34a; font-size: 0.78rem; font-weight: 700; padding: 5px 14px; border-radius: 50px; }

  /* ── CONTENT ── */
  .adm-content { padding: 2rem; flex: 1; }

  /* ── STATS ── */
  .adm-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
  .adm-stat-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 1.25rem 1.5rem; }
  .adm-stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
  .adm-stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
  .adm-stat-label { font-size: 0.78rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.06em; }
  .adm-stat-num { font-size: 1.8rem; font-weight: 800; color: #0d1f0f; line-height: 1; }
  .adm-stat-sub { font-size: 0.75rem; color: #9ca3af; margin-top: 3px; }

  /* ── SECTION ── */
  .adm-section { background: #fff; border: 1px solid #e5e7eb; border-radius: 20px; overflow: hidden; }
  .adm-section-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; }
  .adm-section-header h3 { font-size: 1rem; font-weight: 800; color: #0d1f0f; display: flex; align-items: center; gap: 8px; }
  .adm-section-header p { font-size: 0.78rem; color: #9ca3af; margin-top: 2px; }

  /* ── TABLE ── */
  .adm-table-wrap { overflow-x: auto; }
  .adm-table { width: 100%; border-collapse: collapse; }
  .adm-table th { padding: 0.75rem 1.25rem; font-size: 0.72rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.06em; text-align: left; background: #f9fafb; border-bottom: 1px solid #f3f4f6; }
  .adm-table td { padding: 1rem 1.25rem; font-size: 0.88rem; color: #374151; border-bottom: 1px solid #f9fafb; vertical-align: middle; }
  .adm-table tr:last-child td { border-bottom: none; }
  .adm-table tr:hover td { background: #fafafa; }
  .adm-table .bold { font-weight: 700; color: #0d1f0f; }
  .adm-table .green { color: #16a34a; font-weight: 700; }

  /* ── BADGES ── */
  .adm-pill { display: inline-flex; align-items: center; gap: 4px; font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 50px; }
  .adm-pill.green  { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
  .adm-pill.blue   { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
  .adm-pill.yellow { background: #fefce8; color: #ca8a04; border: 1px solid #fde68a; }
  .adm-pill.red    { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .adm-pill.purple { background: #faf5ff; color: #7c3aed; border: 1px solid #e9d5ff; }
  .adm-pill.gray   { background: #f9fafb; color: #6b7280; border: 1px solid #e5e7eb; }

  /* ── BUTTONS ── */
  .adm-btn { display: inline-flex; align-items: center; gap: 6px; padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; font-family: 'Manrope', sans-serif; border: none; transition: all 0.15s; }
  .adm-btn.primary { background: linear-gradient(135deg,#22c55e,#16a34a); color: #fff; box-shadow: 0 4px 12px rgba(34,197,94,0.25); }
  .adm-btn.primary:hover { transform: translateY(-1px); }
  .adm-btn.danger  { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .adm-btn.danger:hover { background: #fee2e2; }
  .adm-btn.ghost   { background: #f9fafb; color: #374151; border: 1px solid #e5e7eb; }
  .adm-btn.ghost:hover { background: #f3f4f6; }
  .adm-btn.small   { padding: 0.35rem 0.75rem; font-size: 0.75rem; }

  /* ── SEARCH ── */
  .adm-search-wrap { position: relative; }
  .adm-search-wrap input { padding: 0.6rem 1rem 0.6rem 2.4rem; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 0.85rem; font-family: 'Manrope', sans-serif; background: #f9fafb; outline: none; width: 220px; transition: border-color 0.2s; }
  .adm-search-wrap input:focus { border-color: #22c55e; background: #fff; }
  .adm-search-icon { position: absolute; left: 8px; top: 50%; transform: translateY(-50%); color: #9ca3af; }

  /* ── MODAL ── */
  .adm-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
  .adm-modal { background: #fff; border-radius: 20px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 60px rgba(0,0,0,0.3); }
  .adm-modal-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; }
  .adm-modal-header h3 { font-size: 1rem; font-weight: 800; color: #0d1f0f; }
  .adm-modal-close { width: 30px; height: 30px; border-radius: 50%; border: 1px solid #e5e7eb; background: #f9fafb; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #6b7280; }
  .adm-modal-body { padding: 1.5rem; }
  .adm-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .adm-modal-footer { padding: 1rem 1.5rem; border-top: 1px solid #f3f4f6; display: flex; gap: 0.75rem; justify-content: flex-end; }

  /* ── PRODUCT IMG ── */
  .adm-prod-img { width: 44px; height: 44px; border-radius: 10px; object-fit: cover; border: 1px solid #e5e7eb; }
  .adm-prod-img-placeholder { width: 44px; height: 44px; border-radius: 10px; background: #f0fdf4; display: flex; align-items: center; justify-content: center; color: #22c55e; border: 1px solid #bbf7d0; }

  /* ── MESSAGE CARD ── */
  .adm-msg-card { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f3f4f6; }
  .adm-msg-card:last-child { border-bottom: none; }
  .adm-msg-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 0.5rem; }
  .adm-msg-name { font-size: 0.92rem; font-weight: 700; color: #0d1f0f; }
  .adm-msg-email { font-size: 0.78rem; color: #6b7280; }
  .adm-msg-body { font-size: 0.85rem; color: #374151; line-height: 1.6; background: #f9fafb; border-radius: 10px; padding: 0.75rem 1rem; margin-top: 0.5rem; }

  /* ── SELECT STATUS ── */
  .adm-status-select { padding: 0.35rem 0.75rem; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 0.78rem; font-weight: 700; font-family: 'Manrope', sans-serif; color: #374151; background: #f9fafb; cursor: pointer; outline: none; }
  .adm-status-select:focus { border-color: #22c55e; }

  /* ── EMPTY ── */
  .adm-empty { text-align: center; padding: 3rem; color: #9ca3af; font-size: 0.9rem; }

  /* ── TOAST ── */
  .adm-toast { position: fixed; bottom: 2rem; right: 2rem; background: #0d1f0f; color: #4ade80; padding: 0.75rem 1.5rem; border-radius: 12px; font-size: 0.85rem; font-weight: 700; z-index: 999; box-shadow: 0 8px 24px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 8px; animation: toastIn 0.3s ease; }
  @keyframes toastIn { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: none; } }

  @media (max-width: 1024px) { .adm-stats { grid-template-columns: 1fr 1fr; } }
`

const ADMIN_PASSWORD = '2026'

const CATEGORIES = ['Sensors', 'Irrigation', 'Monitoring', 'Software']
const BADGES = ['bestseller', 'new', 'premium', 'sale']
const BADGE_LABELS = { bestseller: 'Best Seller', new: 'New', premium: 'Premium', sale: 'Sale' }
const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'delivered', 'cancelled']
const PAYMENT_STATUSES = ['pending', 'confirmed', 'rejected']

const statusColor = s => ({ pending:'yellow', confirmed:'green', processing:'blue', delivered:'green', cancelled:'red', rejected:'red' }[s] || 'gray')
const roleColor   = r => ({ farmer:'green', supplier:'blue', technician:'purple' }[r] || 'gray')

// ─── PRODUCT MODAL ───────────────────────────────────────────────────────────
function ProductModal({ product, onClose, onSave }) {
  const empty = { name:'', category:'Sensors', desc:'', price:'', badge:'new', badgeLabel:'New', bg:'' }
  const [form, setForm] = useState(product || empty)
  const [saving, setSaving] = useState(false)

  const handle = e => {
    const val = e.target.name === 'badge' ? e.target.value : e.target.value
    const update = { ...form, [e.target.name]: val }
    if (e.target.name === 'badge') update.badgeLabel = BADGE_LABELS[val] || val
    setForm(update)
  }

  const save = async () => {
    if (!form.name || !form.price) return
    setSaving(true)
    await onSave({ ...form, price: Number(form.price) })
    setSaving(false)
    onClose()
  }

  return (
    <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="adm-modal">
        <div className="adm-modal-header">
          <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button className="adm-modal-close" onClick={onClose}><Ic name="close" size={14}/></button>
        </div>
        <div className="adm-modal-body">
          <div className="adm-form-row" style={{marginBottom:'0.75rem'}}>
            <div className="adm-field" style={{margin:0}}>
              <label>Product Name *</label>
              <input name="name" placeholder="e.g. AgroSense Pro" value={form.name} onChange={handle} />
            </div>
            <div className="adm-field" style={{margin:0}}>
              <label>Price (DZD) *</label>
              <input name="price" type="number" placeholder="e.g. 12900" value={form.price} onChange={handle} />
            </div>
          </div>
          <div className="adm-form-row" style={{marginBottom:'0.75rem'}}>
            <div className="adm-field" style={{margin:0}}>
              <label>Category</label>
              <select name="category" value={form.category} onChange={handle}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="adm-field" style={{margin:0}}>
              <label>Badge</label>
              <select name="badge" value={form.badge} onChange={handle}>
                {BADGES.map(b => <option key={b} value={b}>{BADGE_LABELS[b]}</option>)}
              </select>
            </div>
          </div>
          <div className="adm-field">
            <label>Description</label>
            <textarea name="desc" placeholder="Product description..." value={form.desc} onChange={handle} />
          </div>
          <div className="adm-field">
            <label>Image URL</label>
            <input name="bg" placeholder="https://..." value={form.bg} onChange={handle} />
          </div>
          {form.bg && (
            <img src={form.bg} alt="preview" style={{width:'100%',height:'140px',objectFit:'cover',borderRadius:'12px',marginTop:'0.5rem',border:'1px solid #e5e7eb'}} onError={e => e.target.style.display='none'} />
          )}
        </div>
        <div className="adm-modal-footer">
          <button className="adm-btn ghost" onClick={onClose}>Cancel</button>
          <button className="adm-btn primary" onClick={save} disabled={saving}>
            <Ic name="check" size={14}/> {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── PRODUCTS TAB ─────────────────────────────────────────────────────────────
function ProductsTab({ toast }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'add' | product object
  const [search, setSearch] = useState('')

  const fetch = async () => {
    setLoading(true)
    const snap = await getDocs(collection(db, 'products'))
    setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    setLoading(false)
  }
  useEffect(() => { fetch() }, [])

  const save = async (data) => {
    if (data.id) {
      const { id, ...rest } = data
      await updateDoc(doc(db, 'products', id), rest)
      toast('Product updated ✓')
    } else {
      await addDoc(collection(db, 'products'), data)
      toast('Product added ✓')
    }
    fetch()
  }

  const remove = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    await deleteDoc(doc(db, 'products', id))
    toast('Product deleted')
    fetch()
  }

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="adm-section">
        <div className="adm-section-header">
          <div>
            <h3><Ic name="product" size={16}/> Products ({products.length})</h3>
            <p>Manage your IoT device catalog</p>
          </div>
          <div style={{display:'flex',gap:'0.75rem',alignItems:'center'}}>
            <div className="adm-search-wrap">
              <span className="adm-search-icon"><Ic name="search" size={14}/></span>
              <input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="adm-btn primary" onClick={() => setModal('add')}>
              <Ic name="plus" size={14}/> Add Product
            </button>
          </div>
        </div>
        <div className="adm-table-wrap">
          {loading ? (
            <div className="adm-empty">Loading products...</div>
          ) : filtered.length === 0 ? (
            <div className="adm-empty">No products found.</div>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Badge</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                        {p.bg
                          ? <img className="adm-prod-img" src={p.bg} alt={p.name} onError={e => e.target.style.display='none'} />
                          : <div className="adm-prod-img-placeholder"><Ic name="product" size={18}/></div>
                        }
                        <div>
                          <div className="bold">{p.name}</div>
                          <div style={{fontSize:'0.75rem',color:'#9ca3af',maxWidth:'200px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.desc}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="adm-pill blue">{p.category}</span></td>
                    <td className="green">{Number(p.price).toLocaleString()} DZD</td>
                    <td><span className="adm-pill yellow">{p.badgeLabel || p.badge}</span></td>
                    <td>
                      <div style={{display:'flex',gap:'6px'}}>
                        <button className="adm-btn ghost small" onClick={() => setModal(p)}><Ic name="edit" size={13}/> Edit</button>
                        <button className="adm-btn danger small" onClick={() => remove(p.id, p.name)}><Ic name="trash" size={13}/> Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {modal && (
        <ProductModal
          product={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={save}
        />
      )}
    </>
  )
}

// ─── ORDERS TAB ──────────────────────────────────────────────────────────────
function OrdersTab({ toast }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetch = async () => {
    setLoading(true)
    const snap = await getDocs(collection(db, 'orders'))
    setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    setLoading(false)
  }
  useEffect(() => { fetch() }, [])

  const updateStatus = async (id, field, value) => {
    await updateDoc(doc(db, 'orders', id), { [field]: value })
    setOrders(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o))
    toast('Order updated ✓')
  }

  const filtered = orders.filter(o =>
    o.userId?.toLowerCase().includes(search.toLowerCase()) ||
    o.orderRef?.toLowerCase().includes(search.toLowerCase()) ||
    o.firstName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="adm-section">
      <div className="adm-section-header">
        <div>
          <h3><Ic name="order" size={16}/> Orders ({orders.length})</h3>
          <p>View and manage customer orders & payments</p>
        </div>
        <div className="adm-search-wrap">
          <span className="adm-search-icon"><Ic name="search" size={14}/></span>
          <input placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="adm-table-wrap">
        {loading ? (
          <div className="adm-empty">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="adm-empty">No orders yet. Orders will appear here when customers checkout.</div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Customer</th>
                <th>Wilaya</th>
                <th>Total</th>
                <th>Payment Method</th>
                <th>Payment Status</th>
                <th>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td className="bold" style={{fontFamily:'monospace',fontSize:'0.8rem'}}>{o.orderRef || o.id.slice(0,8)}</td>
                  <td>
                    <div className="bold">{o.firstName} {o.lastName}</div>
                    <div style={{fontSize:'0.75rem',color:'#9ca3af'}}>{o.phone}</div>
                  </td>
                  <td>{o.wilaya || '—'}</td>
                  <td className="green">{Number(o.totalPrice || 0).toLocaleString()} DZD</td>
                  <td>
                    <span className="adm-pill gray">{o.paymentMethod || 'Cash'}</span>
                  </td>
                  <td>
                    <select className="adm-status-select" value={o.paymentStatus || 'pending'}
                      onChange={e => updateStatus(o.id, 'paymentStatus', e.target.value)}>
                      {PAYMENT_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                  <td>
                    <select className="adm-status-select" value={o.status || 'pending'}
                      onChange={e => updateStatus(o.id, 'status', e.target.value)}>
                      {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ─── USERS TAB ───────────────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, 'users'))
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }
    fetch()
  }, [])

  const filtered = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="adm-section">
      <div className="adm-section-header">
        <div>
          <h3><Ic name="users" size={16}/> Users ({users.length})</h3>
          <p>Registered farmers, suppliers and technicians</p>
        </div>
        <div className="adm-search-wrap">
          <span className="adm-search-icon"><Ic name="search" size={14}/></span>
          <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="adm-table-wrap">
        {loading ? (
          <div className="adm-empty">Loading users...</div>
        ) : filtered.length === 0 ? (
          <div className="adm-empty">No users yet.</div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Wilaya</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td className="bold">{u.firstName} {u.lastName}</td>
                  <td style={{color:'#6b7280'}}>{u.email}</td>
                  <td><span className={`adm-pill ${roleColor(u.role)}`}>{u.role}</span></td>
                  <td>{u.wilaya || '—'}</td>
                  <td style={{fontSize:'0.78rem',color:'#9ca3af'}}>
                    {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString('fr-DZ') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
// ─── MESSAGES TAB ─────────────────────────────────────────────────────────────
function MessagesTab() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, 'contacts'))
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      setMessages(data)
      setLoading(false)
    }
    fetch()
  }, [])

  const typeColor = t => ({ 'Sales Inquiry':'green', 'Technical Support':'blue', 'Partnership':'purple', 'General Question':'gray' }[t] || 'gray')

  return (
    <div className="adm-section">
      <div className="adm-section-header">
        <div>
          <h3><Ic name="messages" size={16}/> Contact Messages ({messages.length})</h3>
          <p>Form submissions from your website</p>
        </div>
      </div>
      {loading ? (
        <div className="adm-empty">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="adm-empty">No messages yet.</div>
      ) : (
        messages.map(m => (
          <div key={m.id} className="adm-msg-card">
            <div className="adm-msg-top">
              <div>
                <div className="adm-msg-name">{m.firstName} {m.lastName}</div>
                <div className="adm-msg-email">{m.email} {m.phone && `· ${m.phone}`} {m.wilaya && `· ${m.wilaya}`}</div>
              </div>
              <div style={{display:'flex',gap:'6px',alignItems:'center',flexShrink:0}}>
                {m.type && <span className={`adm-pill ${typeColor(m.type)}`}>{m.type}</span>}
                <span style={{fontSize:'0.72rem',color:'#9ca3af'}}>
                  {m.createdAt?.toDate ? m.createdAt.toDate().toLocaleDateString('fr-DZ') : ''}
                </span>
              </div>
            </div>
            <div className="adm-msg-body">{m.message}</div>
          </div>
        ))
      )}
    </div>
  )
}

// ─── MAIN ADMIN PANEL ────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [tab, setTab] = useState('products')
  const [toast, setToast] = useState('')
  const [counts, setCounts] = useState({ products:0, orders:0, users:0, messages:0 })

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  useEffect(() => {
    if (!authed) return
    const fetchCounts = async () => {
      const [p, o, u, m] = await Promise.all([
        getDocs(collection(db, 'products')),
        getDocs(collection(db, 'orders')),
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'contacts')),
      ])
      setCounts({ products: p.size, orders: o.size, users: u.size, messages: m.size })
    }
    fetchCounts()
  }, [authed])

  const login = () => {
    if (password === ADMIN_PASSWORD) { setAuthed(true); setError('') }
    else setError('Incorrect password. Try again.')
  }

  if (!authed) return (
    <>
      <style>{styles}</style>
      <div className="adm-login">
        <div className="adm-login-card">
          <div className="adm-login-logo">
            <div className="adm-login-logo-icon"><Ic name="logo" size={20}/></div>
            <div className="adm-login-logo-text">Agri<span>Sense</span> DZ</div>
          </div>
          <span className="adm-login-badge">Admin Panel</span>
          <h2>Welcome back</h2>
          <p>Sign in to manage your AgriSense platform</p>
          {error && <div className="adm-error">{error}</div>}
          <div className="adm-field">
            <label>Admin Password</label>
            <input type="password" placeholder="Enter password..." value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()} />
          </div>
          <button className="adm-btn-primary" onClick={login}>
            <Ic name="lock" size={15}/> Sign In
          </button>
        </div>
      </div>
    </>
  )

  const navItems = [
    { key:'products', icon:'product',  label:'Products',  count: counts.products },
    { key:'orders',   icon:'order',    label:'Orders',    count: counts.orders },
    { key:'users',    icon:'users',    label:'Users',     count: counts.users },
    { key:'messages', icon:'messages', label:'Messages',  count: counts.messages },
  ]

  const tabTitles = {
    products: { title: 'Products', sub: 'Manage your IoT device catalog' },
    orders:   { title: 'Orders & Payments', sub: 'Track and update customer orders' },
    users:    { title: 'Users', sub: 'View registered farmers, suppliers and technicians' },
    messages: { title: 'Contact Messages', sub: 'Form submissions from your website' },
  }

  return (
    <>
      <style>{styles}</style>
      <div className="adm-root">
        <div className="adm-layout">

          {/* Sidebar */}
          <aside className="adm-sidebar">
            <div className="adm-sidebar-top">
              <div className="adm-sidebar-logo">
                <div className="adm-sidebar-logo-icon"><Ic name="logo" size={18}/></div>
                <div className="adm-sidebar-logo-text">Agri<span>Sense</span> DZ</div>
              </div>
              <div className="adm-sidebar-badge">Admin Panel</div>
            </div>
            <nav className="adm-nav">
              {navItems.map(item => (
                <button key={item.key} className={`adm-nav-item ${tab === item.key ? 'active' : ''}`} onClick={() => setTab(item.key)}>
                  <Ic name={item.icon} size={16}/>
                  {item.label}
                  {item.count > 0 && <span className="adm-nav-badge">{item.count}</span>}
                </button>
              ))}
            </nav>
            <div className="adm-sidebar-bottom">
              <button className="adm-logout-btn" onClick={() => setAuthed(false)}>
                <Ic name="logout" size={16}/> Sign Out
              </button>
            </div>
          </aside>

          {/* Main */}
          <main className="adm-main">
            <div className="adm-topbar">
              <div>
                <div className="adm-topbar-title">{tabTitles[tab].title}</div>
                <div className="adm-topbar-sub">{tabTitles[tab].sub}</div>
              </div>
              <div className="adm-topbar-right">
                <span className="adm-admin-pill">Admin</span>
              </div>
            </div>

            <div className="adm-content">
              {/* Stats */}
              <div className="adm-stats">
                {[
                  { label:'Products',  num: counts.products, icon:'product',  bg:'#f0fdf4', color:'#16a34a', sub:'In catalog' },
                  { label:'Orders',    num: counts.orders,   icon:'order',    bg:'#eff6ff', color:'#2563eb', sub:'Total orders' },
                  { label:'Users',     num: counts.users,    icon:'users',    bg:'#faf5ff', color:'#7c3aed', sub:'Registered' },
                  { label:'Messages',  num: counts.messages, icon:'messages', bg:'#fefce8', color:'#ca8a04', sub:'Contact forms' },
                ].map(s => (
                  <div key={s.label} className="adm-stat-card">
                    <div className="adm-stat-top">
                      <div className="adm-stat-label">{s.label}</div>
                      <div className="adm-stat-icon" style={{background:s.bg,color:s.color}}><Ic name={s.icon} size={18}/></div>
                    </div>
                    <div className="adm-stat-num">{s.num}</div>
                    <div className="adm-stat-sub">{s.sub}</div>
                  </div>
                ))}
              </div>

              {tab === 'products' && <ProductsTab toast={showToast} />}
              {tab === 'orders'   && <OrdersTab   toast={showToast} />}
              {tab === 'users'    && <UsersTab />}
              {tab === 'messages' && <MessagesTab />}
            </div>
          </main>
        </div>
      </div>
      {toast && <div className="adm-toast"><Ic name="check" size={15}/> {toast}</div>}
    </>
  )
}