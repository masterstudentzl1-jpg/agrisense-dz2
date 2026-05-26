import { useState, useEffect } from 'react'
import hp from '../assets/hp.jpg'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'

// ─── SVG ICON SYSTEM ─────────────────────────────────────────────────────────
const Icons = {
  cart:        ['M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'],
  close:       'M6 18L18 6M6 6l12 12',
  trash:       ['M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'],
  check:       'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  checkSimple: 'M4.5 12.75l6 6 9-13.5',
  plus:        'M12 4.5v15m7.5-7.5h-15',
  minus:       'M19.5 12h-15',
  arrow:       'M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3',
  arrowBack:   'M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18',
  chevronRight:'M8.25 4.5l7.5 7.5-7.5 7.5',
  lock:        ['M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z'],
  mapPin:      ['M15 10.5a3 3 0 11-6 0 3 3 0 016 0z', 'M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z'],
  phone:       'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z',
  mail:        ['M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75'],
  truck:       ['M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12'],
  gift:        ['M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z'],
  party:       'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z',
  bank:        ['M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z'],
  card:        ['M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z'],
  copy:        ['M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75'],
  shield:      'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
}

const Ic = ({ name, size = 16, style = {}, strokeWidth = 1.5 }) => {
  const d = Icons[name]
  if (!d) return null
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  )
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Manrope', sans-serif; }

  .products-hero {
    position: relative; padding: 140px 20px 80px; color: white; text-align: center;
    background-size: cover; background-position: center;
  }
  .products-hero::before {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(160deg, rgba(0,60,20,0.7) 0%, rgba(5,100,40,0.5) 100%);
    z-index: 1;
  }
  .products-hero * { position: relative; z-index: 1; }
  .products-hero .tag { font-size: 0.75rem; font-weight: 800; letter-spacing: 0.12em; color: #33f078; text-transform: uppercase; margin-bottom: 1rem; }
  .products-hero h1 { font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 800; color: #fff; letter-spacing: -0.03em; margin-bottom: 1rem; }
  .products-hero p { font-size: 1.05rem; color: #d1fae5; max-width: 560px; margin: 0 auto; line-height: 1.7; }

  .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .reveal.visible { opacity: 1; transform: none; }

  .filter-bar {
    position: sticky; top: 68px; z-index: 100;
    background: #fff; border-bottom: 2px solid #e5e7eb;
    display: flex; align-items: center; justify-content: space-between;
    gap: 1rem; padding: 0 2rem;
  }
  .filter-left { display: flex; align-items: center; gap: 0; overflow-x: auto; flex: 1; scrollbar-width: none; }
  .filter-left::-webkit-scrollbar { display: none; }
  .filter-btn {
    display: flex; align-items: center; justify-content: center;
    padding: 1rem 1.35rem; white-space: nowrap;
    border: none; border-bottom: 3px solid transparent; background: transparent;
    font-size: 0.9rem; font-weight: 700; color: #6b7280; cursor: pointer;
    transition: 0.2s ease; font-family: 'Manrope', sans-serif;
  }
  .filter-btn:hover { color: #16a34a; }
  .filter-btn.active { color: #16a34a; border-bottom-color: #22c55e; }
  .basket-btn-wrap {
    flex-shrink: 0; display: flex; align-items: center; gap: 8px;
    background: #f0fdf4; border: 1.5px solid #bbf7d0;
    border-radius: 50px; padding: 0.55rem 1.25rem;
    font-size: 0.88rem; font-weight: 700; color: #16a34a;
    cursor: pointer; font-family: 'Manrope', sans-serif; transition: background 0.2s;
  }
  .basket-btn-wrap:hover { background: #dcfce7; }
  .basket-count { background: #22c55e; color: #fff; font-size: 0.65rem; font-weight: 800; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

  /* BASKET DRAWER */
  .basket-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 500; }
  .basket-drawer {
    position: fixed; top: 0; right: 0; bottom: 0; width: 420px;
    background: #fff; z-index: 501; display: flex; flex-direction: column;
    box-shadow: -8px 0 40px rgba(0,0,0,0.15);
  }
  .basket-header {
    padding: 1.25rem 1.5rem; border-bottom: 1px solid #e5e7eb;
    display: flex; align-items: center; justify-content: space-between;
  }
  .basket-header h3 { font-size: 1.05rem; font-weight: 800; color: #0d1f0f; display: flex; align-items: center; gap: 8px; }
  .basket-close { width: 32px; height: 32px; border-radius: 50%; border: 1px solid #e5e7eb; background: #f9fafb; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #6b7280; transition: background 0.15s; }
  .basket-close:hover { background: #fef2f2; color: #ef4444; }
  .basket-items { flex: 1; overflow-y: auto; padding: 1rem 1.5rem; }
  .basket-empty { text-align: center; padding: 3rem 1rem; color: #9ca3af; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
  .basket-empty p { font-size: 0.9rem; }
  .basket-item { display: flex; gap: 12px; padding: 0.9rem 0; border-bottom: 1px solid #f3f4f6; align-items: center; }
  .basket-item-img { width: 60px; height: 60px; border-radius: 12px; overflow: hidden; flex-shrink: 0; background: #f0fdf4; }
  .basket-item-img img { width: 100%; height: 100%; object-fit: cover; }
  .basket-item-info { flex: 1; min-width: 0; }
  .basket-item-name { font-size: 0.88rem; font-weight: 700; color: #0d1f0f; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .basket-item-price { font-size: 0.82rem; color: #16a34a; font-weight: 700; }
  .basket-item-qty { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .qty-btn { width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid #e5e7eb; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #374151; transition: all 0.15s; }
  .qty-btn:hover { border-color: #22c55e; color: #22c55e; }
  .qty-num { font-size: 0.9rem; font-weight: 800; color: #0d1f0f; min-width: 22px; text-align: center; }
  .remove-btn { background: none; border: none; cursor: pointer; color: #d1d5db; padding: 4px; transition: color 0.15s; display: flex; align-items: center; }
  .remove-btn:hover { color: #ef4444; }

  .basket-summary { padding: 1rem 1.5rem; background: #f9fafb; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; }
  .basket-summary-row { display: flex; justify-content: space-between; font-size: 0.82rem; color: #6b7280; margin-bottom: 0.4rem; }
  .basket-summary-row.total { font-size: 1.05rem; font-weight: 800; color: #0d1f0f; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid #e5e7eb; margin-bottom: 0; }

  .basket-footer { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
  .btn-checkout {
    width: 100%; padding: 0.95rem; border: none; border-radius: 12px;
    background: linear-gradient(135deg, #22c55e, #16a34a); color: #fff;
    font-size: 0.95rem; font-weight: 700; cursor: pointer; font-family: 'Manrope', sans-serif;
    box-shadow: 0 6px 20px rgba(34,197,94,0.35); transition: transform 0.2s, box-shadow 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-checkout:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(34,197,94,0.45); }
  .btn-clear { width: 100%; padding: 0.75rem; border: 1.5px solid #e5e7eb; border-radius: 12px; background: #fff; color: #6b7280; font-size: 0.85rem; font-weight: 600; cursor: pointer; font-family: 'Manrope', sans-serif; transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 6px; }
  .btn-clear:hover { border-color: #ef4444; color: #ef4444; }

  /* CHECKOUT MODAL */
  .checkout-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 600; display: flex; align-items: center; justify-content: center; padding: 1rem; }
  .checkout-modal {
    background: #fff; border-radius: 24px; width: 100%; max-width: 680px;
    max-height: 92vh; overflow-y: auto;
    box-shadow: 0 24px 60px rgba(0,0,0,0.3);
    animation: modalIn 0.3s ease;
  }
  @keyframes modalIn { from { opacity:0; transform: scale(0.95) translateY(20px); } to { opacity:1; transform: none; } }
  .checkout-header {
    padding: 1.5rem 1.75rem; border-bottom: 1px solid #e5e7eb;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; background: #fff; z-index: 10; border-radius: 24px 24px 0 0;
  }
  .checkout-header h2 { font-size: 1.2rem; font-weight: 800; color: #0d1f0f; display: flex; align-items: center; gap: 8px; }
  .checkout-close { width: 34px; height: 34px; border-radius: 50%; border: 1px solid #e5e7eb; background: #f9fafb; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #6b7280; transition: background 0.15s; }
  .checkout-close:hover { background: #fef2f2; color: #ef4444; }
  .checkout-body { padding: 1.75rem; }

  /* Steps */
  .checkout-steps { display: flex; gap: 0; margin-bottom: 2rem; }
  .checkout-step { display: flex; align-items: center; gap: 8px; flex: 1; }
  .step-num { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; flex-shrink: 0; }
  .step-num.active { background: #22c55e; color: #fff; }
  .step-num.done { background: #dcfce7; color: #16a34a; }
  .step-num.pending { background: #f3f4f6; color: #9ca3af; }
  .step-label { font-size: 0.78rem; font-weight: 700; }
  .step-label.active { color: #16a34a; }
  .step-label.done { color: #16a34a; }
  .step-label.pending { color: #9ca3af; }
  .step-line { flex: 1; height: 2px; margin: 0 8px; }
  .step-line.done { background: #22c55e; }
  .step-line.pending { background: #e5e7eb; }

  /* Order summary */
  .checkout-order-items { margin-bottom: 1.5rem; }
  .checkout-order-items h3 { font-size: 0.88rem; font-weight: 700; color: #374151; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; }
  .co-item { display: flex; align-items: center; gap: 12px; padding: 0.75rem 0; border-bottom: 1px solid #f3f4f6; }
  .co-item:last-child { border-bottom: none; }
  .co-img { width: 48px; height: 48px; border-radius: 10px; overflow: hidden; flex-shrink: 0; }
  .co-img img { width: 100%; height: 100%; object-fit: cover; }
  .co-name { flex: 1; font-size: 0.88rem; font-weight: 700; color: #0d1f0f; }
  .co-qty { font-size: 0.78rem; color: #9ca3af; margin-top: 1px; }
  .co-price { font-size: 0.9rem; font-weight: 800; color: #16a34a; }

  /* Form */
  .checkout-section-title { font-size: 0.88rem; font-weight: 800; color: #374151; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; gap: 8px; }
  .checkout-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem; }
  .checkout-form-grid.full { grid-template-columns: 1fr; }
  .co-field { display: flex; flex-direction: column; gap: 0.3rem; }
  .co-field label { font-size: 0.75rem; font-weight: 700; color: #374151; }
  .co-field input, .co-field select, .co-field textarea {
    padding: 0.7rem 0.9rem; border: 1.5px solid #e5e7eb; border-radius: 10px;
    font-size: 0.88rem; font-family: 'Manrope', sans-serif; color: #0d1f0f;
    background: #fafafa; outline: none; transition: border-color 0.2s; width: 100%;
  }
  .co-field input:focus, .co-field select:focus, .co-field textarea:focus { border-color: #22c55e; background: #fff; }
  .co-field textarea { resize: vertical; min-height: 80px; }

  /* Payment */
  .payment-options { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.25rem; }
  .payment-opt {
    display: flex; align-items: flex-start; gap: 12px;
    border: 2px solid #e5e7eb; border-radius: 14px; padding: 1rem;
    cursor: pointer; transition: all 0.15s;
  }
  .payment-opt.selected { border-color: #22c55e; background: #f0fdf4; }
  .payment-opt-radio { width: 18px; height: 18px; border-radius: 50%; border: 2px solid #d1d5db; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
  .payment-opt.selected .payment-opt-radio { border-color: #22c55e; }
  .payment-opt-dot { width: 9px; height: 9px; border-radius: 50%; background: #22c55e; }
  .payment-opt-icon { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0; }
  .payment-opt-content { flex: 1; }
  .payment-opt-label { font-size: 0.9rem; font-weight: 700; color: #0d1f0f; }
  .payment-opt-sub { font-size: 0.72rem; color: #9ca3af; margin-top: 2px; }
  .payment-opt-badge { display: inline-block; font-size: 0.65rem; font-weight: 800; padding: 2px 8px; border-radius: 50px; margin-top: 4px; }
  .badge-algerie-poste { background: #fef3c7; color: #d97706; }
  .badge-cib { background: #eff6ff; color: #1d4ed8; }
  .badge-cash { background: #f0fdf4; color: #16a34a; }

  /* Algérie Poste */
  .ap-panel { background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 14px; padding: 1.25rem; margin-bottom: 1.25rem; }
  .ap-panel-title { font-size: 0.88rem; font-weight: 800; color: #92400e; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px; }
  .ap-steps { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem; }
  .ap-step { display: flex; gap: 12px; align-items: flex-start; }
  .ap-step-num { width: 24px; height: 24px; border-radius: 50%; background: #f59e0b; color: #fff; font-size: 0.72rem; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
  .ap-step-text { font-size: 0.82rem; color: #78350f; line-height: 1.5; }
  .ap-step-text strong { color: #92400e; }
  .ap-transfer-info { background: #fff; border: 1px solid #fcd34d; border-radius: 10px; padding: 1rem; }
  .ap-info-row { display: flex; justify-content: space-between; align-items: center; padding: 0.35rem 0; border-bottom: 1px solid #fef3c7; font-size: 0.82rem; }
  .ap-info-row:last-child { border-bottom: none; }
  .ap-info-label { color: #92400e; font-weight: 600; }
  .ap-info-val { font-weight: 800; color: #78350f; font-family: monospace; }
  .ap-copy-btn { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 6px; padding: 3px 8px; font-size: 0.68rem; font-weight: 700; color: #92400e; cursor: pointer; font-family: 'Manrope', sans-serif; transition: background 0.15s; display: flex; align-items: center; gap: 4px; }
  .ap-copy-btn:hover { background: #fde68a; }

  /* CIB */
  .cib-panel { background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 14px; padding: 1.25rem; margin-bottom: 1.25rem; }
  .cib-panel-title { font-size: 0.88rem; font-weight: 800; color: #1e40af; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 8px; }
  .cib-logos { display: flex; gap: 0.75rem; margin-bottom: 0.75rem; flex-wrap: wrap; }
  .cib-logo-tag { background: #fff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 6px 12px; font-size: 0.78rem; font-weight: 700; color: #1d4ed8; }
  .cib-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; }
  .cib-field { display: flex; flex-direction: column; gap: 0.25rem; }
  .cib-field label { font-size: 0.7rem; font-weight: 700; color: #374151; }
  .cib-field input { padding: 0.65rem 0.85rem; border: 1.5px solid #bfdbfe; border-radius: 8px; font-size: 0.85rem; font-family: 'Manrope', sans-serif; background: #fff; outline: none; width: 100%; }
  .cib-field input:focus { border-color: #3b82f6; }
  .cib-secure { font-size: 0.72rem; color: #6b7280; display: flex; align-items: center; gap: 6px; margin-top: 0.5rem; }

  /* Bank */
  .bank-panel { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; padding: 1.25rem; margin-bottom: 1.25rem; font-size: 0.82rem; color: #374151; line-height: 1.7; }

  /* Totals */
  .checkout-totals { background: #f9fafb; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1.25rem; }
  .ct-row { display: flex; justify-content: space-between; font-size: 0.85rem; color: #6b7280; margin-bottom: 0.4rem; }
  .ct-row.total { font-size: 1.05rem; font-weight: 800; color: #0d1f0f; border-top: 1px solid #e5e7eb; padding-top: 0.5rem; margin-top: 0.25rem; margin-bottom: 0; }
  .ct-row.total span:last-child { color: #16a34a; }

  /* Success */
  .checkout-success { text-align: center; padding: 2rem 1rem; }
  .success-icon { display: flex; justify-content: center; margin-bottom: 1rem; color: #22c55e; }
  .checkout-success h3 { font-size: 1.4rem; font-weight: 800; color: #0d1f0f; margin-bottom: 0.5rem; }
  .checkout-success p { font-size: 0.9rem; color: #6b7280; margin-bottom: 0.25rem; }
  .order-ref { display: inline-block; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 6px 14px; font-size: 0.82rem; font-weight: 700; color: #16a34a; margin: 1rem 0; }

  .checkout-nav { display: flex; gap: 0.75rem; }
  .btn-back { flex: 0; padding: 0.85rem 1.5rem; border: 1.5px solid #e5e7eb; border-radius: 12px; background: #fff; color: #374151; font-size: 0.9rem; font-weight: 700; cursor: pointer; font-family: 'Manrope', sans-serif; white-space: nowrap; display: flex; align-items: center; gap: 6px; }
  .btn-next { flex: 1; padding: 0.85rem; border: none; border-radius: 12px; background: linear-gradient(135deg,#22c55e,#16a34a); color: #fff; font-size: 0.9rem; font-weight: 700; cursor: pointer; font-family: 'Manrope', sans-serif; box-shadow: 0 6px 20px rgba(34,197,94,0.3); transition: transform 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .btn-next:hover { transform: translateY(-1px); }
  .btn-next:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* Products */
  .products-main { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem 5rem; }
  .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
  .product-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 20px; overflow: hidden; transition: box-shadow 0.3s, transform 0.3s; }
  .product-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.1); transform: translateY(-4px); }
  .card-img { height: 200px; position: relative; overflow: hidden; }
  .card-img img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
  .card-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.35), transparent); }
  .badge-row { position: absolute; bottom: 10px; left: 12px; right: 12px; display: flex; justify-content: space-between; align-items: center; }
  .badge { font-size: 0.72rem; font-weight: 800; padding: 4px 12px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.06em; }
  .badge.bestseller { background: #22c55e; color: #fff; }
  .badge.new { background: #06b6d4; color: #fff; }
  .badge.premium { background: #7c3aed; color: #fff; }
  .badge.sale { background: #f59e0b; color: #fff; }
  .badge.cat { background: rgba(0,0,0,0.55); color: #fff; backdrop-filter: blur(4px); }
  .card-body { padding: 1.25rem 1.25rem 1.5rem; }
  .card-category { font-size: 0.72rem; font-weight: 700; color: #22c55e; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.35rem; }
  .card-body h3 { font-size: 1.05rem; font-weight: 700; color: #0d1f0f; margin-bottom: 0.4rem; }
  .card-body p { font-size: 0.85rem; color: #6b7280; line-height: 1.6; margin-bottom: 1rem; }
  .card-footer { display: flex; align-items: center; justify-content: space-between; }
  .card-price { font-size: 1.1rem; font-weight: 800; color: #16a34a; }
  .card-price span { font-size: 0.78rem; font-weight: 500; color: #9ca3af; }
  .btn-add { display: flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #22c55e, #16a34a); color: #fff; padding: 0.5rem 1.1rem; border-radius: 50px; font-size: 0.82rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Manrope', sans-serif; box-shadow: 0 4px 12px rgba(34,197,94,0.3); transition: transform 0.2s; }
  .btn-add:hover { transform: translateY(-1px); }

  /* Toast */
  .toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); background: #0d1f0f; color: #4ade80; padding: 0.75rem 1.5rem; border-radius: 50px; font-size: 0.85rem; font-weight: 700; z-index: 700; box-shadow: 0 8px 24px rgba(0,0,0,0.3); animation: toastIn 0.3s ease; white-space: nowrap; display: flex; align-items: center; gap: 8px; }
  @keyframes toastIn { from { opacity:0; transform: translateX(-50%) translateY(20px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }

  @media (max-width: 768px) {
    .basket-drawer { width: 100%; }
    .checkout-modal { border-radius: 20px; }
    .checkout-form-grid { grid-template-columns: 1fr; }
    .cib-form-grid { grid-template-columns: 1fr; }
    .products-grid { grid-template-columns: 1fr; }
    .filter-bar { padding: 0 1rem; }
    .checkout-nav { flex-direction: column; }
    .btn-back { order: 2; }
  }
`

const WILAYAS = ['Alger','Oran','Constantine','Annaba','Blida','Sétif','Biskra','Tizi Ouzou','Batna','Béjaïa','Médéa','Bouira','Tlemcen','Other']
const categories = ['All', 'Sensors', 'Irrigation', 'Monitoring', 'Software']


const DELIVERY_FEE = 500
const STEPS = ['Order Review', 'Delivery Info', 'Payment', 'Confirmation']

function CIBForm({ data, onChange, errors }) {
  const fmt = (val, type) => {
    if (type === 'card') return val.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
    if (type === 'expiry') return val.replace(/\D/g,'').slice(0,4).replace(/(\d{2})(\d)/,'$1/$2')
    if (type === 'cvv') return val.replace(/\D/g,'').slice(0,3)
    return val
  }
  return (
    <div className="cib-panel">
      <div className="cib-panel-title"><Ic name="card" size={16} /> Card Details</div>
      <div className="cib-logos">
        <span className="cib-logo-tag">🇩🇿 CIB</span>
        <span className="cib-logo-tag">EDAHABIA</span>
        <span className="cib-logo-tag">Visa Algeria</span>
      </div>
      <div className="cib-form-grid" style={{marginBottom:'0.6rem'}}>
        <div className="cib-field" style={{gridColumn:'1/-1'}}>
          <label>Cardholder Name</label>
          <input placeholder="Name on card" value={data.name} onChange={e => onChange('name', e.target.value)} style={errors.name ? {borderColor:'#ef4444'} : {}} />
          {errors.name && <span style={{fontSize:'0.7rem',color:'#ef4444'}}>Required</span>}
        </div>
        <div className="cib-field" style={{gridColumn:'1/-1'}}>
          <label>Card Number</label>
          <input placeholder="0000 0000 0000 0000" value={fmt(data.card,'card')} onChange={e => onChange('card', e.target.value.replace(/\s/g,''))} style={errors.card ? {borderColor:'#ef4444'} : {}} maxLength={19} />
          {errors.card && <span style={{fontSize:'0.7rem',color:'#ef4444'}}>Enter valid card number</span>}
        </div>
        <div className="cib-field">
          <label>Expiry Date</label>
          <input placeholder="MM/YY" value={fmt(data.expiry,'expiry')} onChange={e => onChange('expiry', e.target.value.replace('/',''))} style={errors.expiry ? {borderColor:'#ef4444'} : {}} maxLength={5} />
          {errors.expiry && <span style={{fontSize:'0.7rem',color:'#ef4444'}}>Required</span>}
        </div>
        <div className="cib-field">
          <label>CVV</label>
          <input placeholder="•••" type="password" value={fmt(data.cvv,'cvv')} onChange={e => onChange('cvv', e.target.value)} style={errors.cvv ? {borderColor:'#ef4444'} : {}} maxLength={3} />
          {errors.cvv && <span style={{fontSize:'0.7rem',color:'#ef4444'}}>Required</span>}
        </div>
      </div>
      <div className="cib-secure"><Ic name="shield" size={13} /> Your payment is secured by 128-bit SSL encryption</div>
    </div>
  )
}

function AlgeriePostePanel({ orderRef, total }) {
  const [copied, setCopied] = useState('')
  const ccpNum = '00799999002361050919'
  const copyToClipboard = (val, key) => {
    navigator.clipboard.writeText(val).catch(() => {})
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }
  return (
    <div className="ap-panel">
      <div className="ap-panel-title"><Ic name="bank" size={16} /> Algérie Poste — CCP Transfer Instructions</div>
      <div className="ap-steps">
        {[
          `Go to your nearest Algérie Poste office or use the **Barid'E-Pay app** / **Barid Connect website**`,
          `Select **"Virement CCP"** (CCP Transfer) and enter AgriSense DZ's account number below`,
          `Transfer exactly **${total.toLocaleString()} DZD** and use your **order reference #${orderRef}** as the transfer note/motif`,
          `Send a photo of your receipt to **orders@agrisensedz.dz** — your order will ship within 1 business day`,
        ].map((text, i) => (
          <div key={i} className="ap-step">
            <div className="ap-step-num">{i + 1}</div>
            <div className="ap-step-text" dangerouslySetInnerHTML={{__html: text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}} />
          </div>
        ))}
      </div>
      <div className="ap-transfer-info">
        {[
          ['Account Name', 'AgriSense DZ SARL', null],
          ['CCP Number', ccpNum, 'ccp'],
          ['Clé CCP', '80', null],
          ['Amount', `${total.toLocaleString()} DZD`, 'amt'],
          ['Order Reference', orderRef, 'ref'],
        ].map(([label, val, key]) => (
          <div key={label} className="ap-info-row">
            <span className="ap-info-label">{label}</span>
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <span className="ap-info-val">{val}</span>
              {key && (
                <button className="ap-copy-btn" onClick={() => copyToClipboard(val, key)}>
                  <Ic name="copy" size={11} /> {copied === key ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CheckoutModal({ cart, onClose, onSuccess }) {
  const [step, setStep] = useState(0)
  const [payment, setPayment] = useState('algerie_poste')
  const [form, setForm] = useState({ firstName:'', lastName:'', phone:'', email:'', wilaya:'', address:'', notes:'' })
  const [cibData, setCibData] = useState({ name:'', card:'', expiry:'', cvv:'' })
  const [errors, setErrors] = useState({})
  const [cibErrors, setCibErrors] = useState({})
  const [orderRef] = useState('AGR-' + Math.random().toString(36).slice(2, 10).toUpperCase())

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const total = subtotal + DELIVERY_FEE

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleCib = (field, val) => setCibData(d => ({ ...d, [field]: val }))

  const validateDelivery = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = true
    if (!form.lastName.trim()) e.lastName = true
    if (!form.phone.trim()) e.phone = true
    if (!form.wilaya) e.wilaya = true
    if (!form.address.trim()) e.address = true
    setErrors(e); return Object.keys(e).length === 0
  }
  const validateCib = () => {
    const e = {}
    if (!cibData.name.trim()) e.name = true
    if (cibData.card.replace(/\s/g,'').length < 16) e.card = true
    if (!cibData.expiry) e.expiry = true
    if (cibData.cvv.length < 3) e.cvv = true
    setCibErrors(e); return Object.keys(e).length === 0
  }
  const next = () => {
    if (step === 1 && !validateDelivery()) return
    if (step === 2 && payment === 'cib' && !validateCib()) return
    if (step === 2) { setStep(3); onSuccess && onSuccess() }
    else setStep(s => s + 1)
  }

  const paymentOpts = [
    { key:'algerie_poste', iconName:'bank',  iconBg:'#fffbeb', iconColor:'#d97706', label:"Algérie Poste — CCP / Barid'E-Pay", sub:"Transfer via CCP account or Barid'E-Pay app", badge:'badge-algerie-poste', badgeText:'Most popular in Algeria' },
    { key:'cib',           iconName:'card',  iconBg:'#eff6ff', iconColor:'#2563eb', label:'CIB / EDAHABIA Card',                sub:'Algerian debit card — online payment',       badge:'badge-cib',           badgeText:'Secured payment' },
    { key:'cash',          iconName:'truck', iconBg:'#f0fdf4', iconColor:'#16a34a', label:'Cash on Delivery',                  sub:'Pay in cash when your order arrives',         badge:'badge-cash',          badgeText:'No account needed' },
    { key:'bank',          iconName:'bank',  iconBg:'#f9fafb', iconColor:'#374151', label:'Bank Transfer (BNA / CPA / BEA)',   sub:'Direct bank-to-bank transfer',                badge:null,                  badgeText:null },
  ]

  const paymentLabel = () => ({ algerie_poste:'Algérie Poste / CCP', cib:'CIB / EDAHABIA Card', cash:'Cash on Delivery', bank:'Bank Transfer' }[payment])

  return (
    <div className="checkout-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="checkout-modal">
        <div className="checkout-header">
          <h2><Ic name="cart" size={20} /> Checkout</h2>
          <button className="checkout-close" onClick={onClose}><Ic name="close" size={16} /></button>
        </div>
        <div className="checkout-body">
          {/* Steps */}
          <div className="checkout-steps">
            {STEPS.map((s, i) => (
              <div key={i} className="checkout-step" style={{ flex: i < STEPS.length-1 ? '1' : 'none' }}>
                <div className={`step-num ${i < step ? 'done' : i === step ? 'active' : 'pending'}`}>
                  {i < step ? <Ic name="checkSimple" size={12} strokeWidth={2.5} /> : i + 1}
                </div>
                <span className={`step-label ${i < step ? 'done' : i === step ? 'active' : 'pending'}`}>{s}</span>
                {i < STEPS.length - 1 && <div className={`step-line ${i < step ? 'done' : 'pending'}`} style={{flex:1}}/>}
              </div>
            ))}
          </div>

          {/* STEP 0 — Order Review */}
          {step === 0 && (<>
            <div className="checkout-order-items">
              <h3>Your Order ({cart.length} item{cart.length !== 1 ? 's' : ''})</h3>
              {cart.map(item => (
                <div key={item.id} className="co-item">
                  <div className="co-img"><img src={item.bg} alt={item.name}/></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div className="co-name">{item.name}</div>
                    <div className="co-qty">Qty: {item.qty}</div>
                  </div>
                  <div className="co-price">{(item.price * item.qty).toLocaleString()} DZD</div>
                </div>
              ))}
            </div>
            <div className="checkout-totals">
              <div className="ct-row"><span>Subtotal</span><span>{subtotal.toLocaleString()} DZD</span></div>
              <div className="ct-row"><span>Delivery fee</span><span>{DELIVERY_FEE.toLocaleString()} DZD</span></div>
              <div className="ct-row total"><span>Total</span><span>{total.toLocaleString()} DZD</span></div>
            </div>
            <div className="checkout-nav">
              <button className="btn-back" onClick={onClose}><Ic name="arrowBack" size={14}/> Back to Cart</button>
              <button className="btn-next" onClick={next}>Continue <Ic name="arrow" size={14}/></button>
            </div>
          </>)}

          {/* STEP 1 — Delivery Info */}
          {step === 1 && (<>
            <div className="checkout-section-title"><Ic name="truck" size={15}/> Delivery Information</div>
            <div className="checkout-form-grid">
              <div className="co-field"><label>First Name *</label><input name="firstName" placeholder="First name" value={form.firstName} onChange={handle} style={errors.firstName?{borderColor:'#ef4444'}:{}}/>{errors.firstName && <span style={{fontSize:'0.7rem',color:'#ef4444'}}>Required</span>}</div>
              <div className="co-field"><label>Last Name *</label><input name="lastName" placeholder="Last name" value={form.lastName} onChange={handle} style={errors.lastName?{borderColor:'#ef4444'}:{}}/>{errors.lastName && <span style={{fontSize:'0.7rem',color:'#ef4444'}}>Required</span>}</div>
            </div>
            <div className="checkout-form-grid">
              <div className="co-field"><label>Phone Number *</label><input name="phone" placeholder="+213 XXX XXX XXX" value={form.phone} onChange={handle} style={errors.phone?{borderColor:'#ef4444'}:{}}/>{errors.phone && <span style={{fontSize:'0.7rem',color:'#ef4444'}}>Required</span>}</div>
              <div className="co-field"><label>Email (optional)</label><input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle}/></div>
            </div>
            <div className="checkout-form-grid full">
              <div className="co-field"><label>Wilaya *</label><select name="wilaya" value={form.wilaya} onChange={handle} style={errors.wilaya?{borderColor:'#ef4444'}:{}}><option value="">Select your wilaya</option>{WILAYAS.map(w => <option key={w}>{w}</option>)}</select>{errors.wilaya && <span style={{fontSize:'0.7rem',color:'#ef4444'}}>Required</span>}</div>
            </div>
            <div className="checkout-form-grid full">
              <div className="co-field"><label>Delivery Address *</label><input name="address" placeholder="Street, building, commune..." value={form.address} onChange={handle} style={errors.address?{borderColor:'#ef4444'}:{}}/>{errors.address && <span style={{fontSize:'0.7rem',color:'#ef4444'}}>Required</span>}</div>
            </div>
            <div className="checkout-form-grid full" style={{marginBottom:'1.25rem'}}>
              <div className="co-field"><label>Notes for delivery (optional)</label><textarea name="notes" placeholder="Any special instructions..." value={form.notes} onChange={handle}/></div>
            </div>
            <div className="checkout-nav">
              <button className="btn-back" onClick={() => setStep(0)}><Ic name="arrowBack" size={14}/> Back</button>
              <button className="btn-next" onClick={next}>Continue <Ic name="arrow" size={14}/></button>
            </div>
          </>)}

          {/* STEP 2 — Payment */}
          {step === 2 && (<>
            <div className="checkout-section-title"><Ic name="card" size={15}/> Payment Method</div>
            <div className="payment-options">
              {paymentOpts.map(opt => (
                <div key={opt.key} className={`payment-opt ${payment === opt.key ? 'selected' : ''}`} onClick={() => setPayment(opt.key)}>
                  <div className="payment-opt-radio">{payment === opt.key && <div className="payment-opt-dot"/>}</div>
                  <div className="payment-opt-icon" style={{background:opt.iconBg,color:opt.iconColor}}>
                    <Ic name={opt.iconName} size={18}/>
                  </div>
                  <div className="payment-opt-content">
                    <div className="payment-opt-label">{opt.label}</div>
                    <div className="payment-opt-sub">{opt.sub}</div>
                    {opt.badge && <span className={`payment-opt-badge ${opt.badge}`}>{opt.badgeText}</span>}
                  </div>
                </div>
              ))}
            </div>
            {payment === 'algerie_poste' && <AlgeriePostePanel orderRef={orderRef} total={total} />}
            {payment === 'cib' && <CIBForm data={cibData} onChange={handleCib} errors={cibErrors} />}
            {payment === 'bank' && (
              <div className="bank-panel">
                <strong style={{color:'#16a34a'}}>Bank Transfer Details:</strong><br/>
                Bank: BNA — Banque Nationale d'Algérie<br/>
                Account: 00200 20002 000022222 22<br/>
                Reference: <strong>{orderRef}</strong><br/>
                <span style={{fontSize:'0.78rem',color:'#6b7280'}}>Orders processed after payment confirmation (1–2 business days)</span>
              </div>
            )}
            <div className="checkout-totals">
              <div className="ct-row"><span>Subtotal</span><span>{subtotal.toLocaleString()} DZD</span></div>
              <div className="ct-row"><span>Delivery</span><span>{DELIVERY_FEE.toLocaleString()} DZD</span></div>
              <div className="ct-row total"><span>Total to pay</span><span>{total.toLocaleString()} DZD</span></div>
            </div>
            <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:'10px',padding:'0.75rem 1rem',marginBottom:'1.25rem',fontSize:'0.78rem',color:'#92400e',display:'flex',flexDirection:'column',gap:'4px'}}>
              <span style={{display:'flex',alignItems:'center',gap:6}}><Ic name="mapPin" size={12}/> Delivering to: <strong>{form.address}, {form.wilaya}</strong></span>
              <span style={{display:'flex',alignItems:'center',gap:6}}><Ic name="phone" size={12}/> Contact: <strong>{form.phone}</strong></span>
            </div>
            <div className="checkout-nav">
              <button className="btn-back" onClick={() => setStep(1)}><Ic name="arrowBack" size={14}/> Back</button>
              <button className="btn-next" onClick={next}>
                {payment === 'algerie_poste' ? <><Ic name="checkSimple" size={14} strokeWidth={2.5}/> Confirm & Get Payment Info</> :
                 payment === 'cib' ? <><Ic name="lock" size={14}/> Pay Now</> :
                 <><Ic name="checkSimple" size={14} strokeWidth={2.5}/> Place Order</>}
              </button>
            </div>
          </>)}

          {/* STEP 3 — Confirmation */}
          {step === 3 && (
            <div className="checkout-success">
              <div className="success-icon"><Ic name="party" size={64} /></div>
              <h3>Order Placed Successfully!</h3>
              <p>Thank you for your order, <strong>{form.firstName}</strong>!</p>
              <div className="order-ref">Order #{orderRef}</div>
              {payment === 'algerie_poste' && (
                <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:'14px',padding:'1rem',margin:'1rem 0',textAlign:'left'}}>
                  <p style={{fontSize:'0.85rem',fontWeight:700,color:'#92400e',marginBottom:'0.5rem',display:'flex',alignItems:'center',gap:6}}><Ic name="clock_kpi" size={14}/> Next step — Complete your CCP payment:</p>
                  <p style={{fontSize:'0.82rem',color:'#78350f',lineHeight:1.6}}>
                    Please transfer <strong>{total.toLocaleString()} DZD</strong> to CCP <strong>00799-01234567890 (Clé 23)</strong> with reference <strong>#{orderRef}</strong>.<br/>
                    Send your receipt to <strong>orders@agrisensedz.dz</strong> to confirm.
                  </p>
                </div>
              )}
              {payment === 'cib' && (
                <p style={{fontSize:'0.82rem',color:'#6b7280',margin:'0.5rem 0',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                  <Ic name="card" size={14}/> Payment processed · Confirmation sent to {form.email || form.phone}
                </p>
              )}
              <p style={{fontSize:'0.82rem',color:'#9ca3af',marginTop:'0.5rem',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                <Ic name="mapPin" size={13}/> Delivering to <strong>{form.wilaya}</strong> · {paymentLabel()}
              </p>
              <p style={{fontSize:'0.82rem',color:'#9ca3af',marginTop:'0.25rem',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
                <Ic name="truck" size={13}/> Estimated delivery: <strong>3–5 business days</strong>
              </p>
              <div style={{marginTop:'2rem',display:'flex',gap:'0.75rem',justifyContent:'center',flexWrap:'wrap'}}>
                <button className="btn-next" style={{maxWidth:'200px'}} onClick={onClose}>Continue Shopping</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Products() {
  const [active, setActive] = useState('All')
const [cart, setCart] = useState([])
const [products, setProducts] = useState([])
const [loadingProducts, setLoadingProducts] = useState(true)

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'products'))
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setProducts(data)
    } catch (err) {
      console.error('Error loading products:', err)
    } finally {
      setLoadingProducts(false)
    }
  }
  fetchProducts()
}, [])
  const [basketOpen, setBasketOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [toast, setToast] = useState('')

  const filtered = active === 'All' ? products : products.filter(p => p.category === active)
  const totalItems = cart.reduce((s, i) => s + i.qty, 0)
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0)

  const addToCart = (p) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id)
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...p, qty: 1 }]
    })
    setToast(`${p.name} added to cart`)
    setTimeout(() => setToast(''), 2000)
  }
  const changeQty = (id, delta) => setCart(prev => prev.map(i => i.id === id ? {...i, qty: i.qty + delta} : i).filter(i => i.qty > 0))
  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id))
  const handleOrderSuccess = () => setCart([])

  useEffect(() => {
  if (loadingProducts) return
  const timer = setTimeout(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.12 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, 100)
  return () => clearTimeout(timer)
}, [loadingProducts])

  return (
    <>
      <style>{styles}</style>

      <section className="products-hero" style={{ backgroundImage: `url(${hp})` }}>
        <div className="section-header reveal">
          <div className="tag">Our Products</div>
          <h1>Smart IoT Solutions</h1>
          <p>Professional-grade agricultural IoT devices designed and supported locally in Algeria. Built to last, priced to scale.</p>
        </div>
      </section>

      <div className="filter-bar">
        <div className="filter-left">
          {categories.map(cat => (
            <button key={cat} className={`filter-btn ${active === cat ? 'active' : ''}`} onClick={() => setActive(cat)}>{cat}</button>
          ))}
        </div>
        <button className="basket-btn-wrap" onClick={() => setBasketOpen(true)}>
          <Ic name="cart" size={16} /> Cart
          {totalItems > 0 && <span className="basket-count">{totalItems}</span>}
        </button>
      </div>

      <div className="products-main">
        <div className="products-grid">
          {loadingProducts ? (
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Loading products...</p>
          ) : filtered.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>No products found. Add products in Firebase Console.</p>
          ) : filtered.map((p, i) => (
            <div key={p.id} className="product-card reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="card-img">
                <img src={p.bg} alt={p.name} />
                <div className="card-img-overlay" />
                <div className="badge-row">
                  <span className={`badge ${p.badge}`}>{p.badgeLabel}</span>
                  <span className="badge cat">{p.category}</span>
                </div>
              </div>
              <div className="card-body">
                <div className="card-category">{p.category}</div>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <div className="card-footer">
                  <div className="card-price">{p.price.toLocaleString()} DZD <span>/ unit</span></div>
                  <button className="btn-add" onClick={() => addToCart(p)}>
                    <Ic name="plus" size={13} strokeWidth={2.5} /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Drawer */}
      {basketOpen && (<>
        <div className="basket-overlay" onClick={() => setBasketOpen(false)} />
        <div className="basket-drawer">
          <div className="basket-header">
            <h3><Ic name="cart" size={18} /> Your Cart <span style={{fontSize:'0.82rem',fontWeight:500,color:'#9ca3af'}}>({totalItems} item{totalItems !== 1 ? 's' : ''})</span></h3>
            <button className="basket-close" onClick={() => setBasketOpen(false)}><Ic name="close" size={16} /></button>
          </div>
          <div className="basket-items">
            {cart.length === 0 ? (
              <div className="basket-empty">
                <Ic name="cart" size={48} style={{opacity:0.3}} />
                <p>Your cart is empty</p>
              </div>
            ) : cart.map(item => (
              <div key={item.id} className="basket-item">
                <div className="basket-item-img"><img src={item.bg} alt={item.name}/></div>
                <div className="basket-item-info">
                  <div className="basket-item-name">{item.name}</div>
                  <div className="basket-item-price">{(item.price * item.qty).toLocaleString()} DZD</div>
                </div>
                <div className="basket-item-qty">
                  <button className="qty-btn" onClick={() => changeQty(item.id, -1)}><Ic name="minus" size={12} strokeWidth={2.5}/></button>
                  <span className="qty-num">{item.qty}</span>
                  <button className="qty-btn" onClick={() => changeQty(item.id, +1)}><Ic name="plus" size={12} strokeWidth={2.5}/></button>
                  <button className="remove-btn" onClick={() => removeItem(item.id)}><Ic name="trash" size={16}/></button>
                </div>
              </div>
            ))}
          </div>
          {cart.length > 0 && (<>
            <div className="basket-summary">
              <div className="basket-summary-row"><span>Subtotal</span><span>{totalPrice.toLocaleString()} DZD</span></div>
              <div className="basket-summary-row"><span>Delivery</span><span>500 DZD</span></div>
              <div className="basket-summary-row total"><span>Total</span><span>{(totalPrice + 500).toLocaleString()} DZD</span></div>
            </div>
            <div className="basket-footer">
              <button className="btn-checkout" onClick={() => { setBasketOpen(false); setCheckoutOpen(true) }}>
                Proceed to Checkout <Ic name="arrow" size={15}/>
              </button>
              <button className="btn-clear" onClick={() => setCart([])}>
                <Ic name="trash" size={14}/> Clear Cart
              </button>
            </div>
          </>)}
        </div>
      </>)}

      {checkoutOpen && <CheckoutModal cart={cart} onClose={() => setCheckoutOpen(false)} onSuccess={handleOrderSuccess} />}

      {toast && (
        <div className="toast">
          <Ic name="check" size={16} /> {toast}
        </div>
      )}
    </>
  )
}