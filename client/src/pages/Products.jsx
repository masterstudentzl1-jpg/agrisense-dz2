import { useState, useEffect } from 'react'
import hp from '../assets/hp.jpg'

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

  /* ── BASKET DRAWER ── */
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
  .basket-close { width: 32px; height: 32px; border-radius: 50%; border: 1px solid #e5e7eb; background: #f9fafb; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; font-family: inherit; transition: background 0.15s; }
  .basket-close:hover { background: #fef2f2; color: #ef4444; }
  .basket-items { flex: 1; overflow-y: auto; padding: 1rem 1.5rem; }
  .basket-empty { text-align: center; padding: 3rem 1rem; color: #9ca3af; }
  .basket-empty div { font-size: 3rem; margin-bottom: 0.75rem; }
  .basket-empty p { font-size: 0.9rem; }
  .basket-item { display: flex; gap: 12px; padding: 0.9rem 0; border-bottom: 1px solid #f3f4f6; align-items: center; }
  .basket-item-img { width: 60px; height: 60px; border-radius: 12px; overflow: hidden; flex-shrink: 0; background: #f0fdf4; }
  .basket-item-img img { width: 100%; height: 100%; object-fit: cover; }
  .basket-item-info { flex: 1; min-width: 0; }
  .basket-item-name { font-size: 0.88rem; font-weight: 700; color: #0d1f0f; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .basket-item-price { font-size: 0.82rem; color: #16a34a; font-weight: 700; }
  .basket-item-qty { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .qty-btn { width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid #e5e7eb; background: #fff; cursor: pointer; font-size: 15px; font-weight: 700; display: flex; align-items: center; justify-content: center; color: #374151; transition: all 0.15s; }
  .qty-btn:hover { border-color: #22c55e; color: #22c55e; }
  .qty-num { font-size: 0.9rem; font-weight: 800; color: #0d1f0f; min-width: 22px; text-align: center; }
  .remove-btn { background: none; border: none; cursor: pointer; color: #d1d5db; font-size: 16px; padding: 4px; transition: color 0.15s; }
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
  .btn-clear { width: 100%; padding: 0.75rem; border: 1.5px solid #e5e7eb; border-radius: 12px; background: #fff; color: #6b7280; font-size: 0.85rem; font-weight: 600; cursor: pointer; font-family: 'Manrope', sans-serif; transition: all 0.15s; }
  .btn-clear:hover { border-color: #ef4444; color: #ef4444; }

  /* ── CHECKOUT MODAL ── */
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
    display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: #fff; z-index: 10; border-radius: 24px 24px 0 0;
  }
  .checkout-header h2 { font-size: 1.2rem; font-weight: 800; color: #0d1f0f; }
  .checkout-close { width: 34px; height: 34px; border-radius: 50%; border: 1px solid #e5e7eb; background: #f9fafb; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
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
  .checkout-section-title { font-size: 0.88rem; font-weight: 800; color: #374151; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #f3f4f6; }
  .checkout-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1.25rem; }
  .checkout-form-grid.full { grid-template-columns: 1fr; }
  .co-field { display: flex; flex-direction: column; gap: 0.3rem; }
  .co-field label { font-size: 0.75rem; font-weight: 700; color: #374151; }
  .co-field input, .co-field select, .co-field textarea {
    padding: 0.7rem 0.9rem; border: 1.5px solid #e5e7eb; border-radius: 10px;
    font-size: 0.88rem; font-family: 'Manrope', sans-serif; color: #0d1f0f;
    background: #fafafa; outline: none; transition: border-color 0.2s;
    width: 100%;
  }
  .co-field input:focus, .co-field select:focus, .co-field textarea:focus { border-color: #22c55e; background: #fff; }
  .co-field textarea { resize: vertical; min-height: 80px; }

  /* Payment options */
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
  .payment-opt-icon { font-size: 24px; flex-shrink: 0; }
  .payment-opt-content { flex: 1; }
  .payment-opt-label { font-size: 0.9rem; font-weight: 700; color: #0d1f0f; }
  .payment-opt-sub { font-size: 0.72rem; color: #9ca3af; margin-top: 2px; }
  .payment-opt-badge { display: inline-block; font-size: 0.65rem; font-weight: 800; padding: 2px 8px; border-radius: 50px; margin-top: 4px; }
  .badge-algerie-poste { background: #fef3c7; color: #d97706; }
  .badge-cib { background: #eff6ff; color: #1d4ed8; }
  .badge-cash { background: #f0fdf4; color: #16a34a; }

  /* Algérie Poste payment detail panel */
  .ap-panel {
    background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 14px;
    padding: 1.25rem; margin-bottom: 1.25rem;
  }
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
  .ap-copy-btn { background: #fef3c7; border: 1px solid #fcd34d; border-radius: 6px; padding: 3px 8px; font-size: 0.68rem; font-weight: 700; color: #92400e; cursor: pointer; font-family: 'Manrope', sans-serif; transition: background 0.15s; }
  .ap-copy-btn:hover { background: #fde68a; }

  /* CIB panel */
  .cib-panel {
    background: #eff6ff; border: 1.5px solid #bfdbfe; border-radius: 14px;
    padding: 1.25rem; margin-bottom: 1.25rem;
  }
  .cib-panel-title { font-size: 0.88rem; font-weight: 800; color: #1e40af; margin-bottom: 0.75rem; }
  .cib-logos { display: flex; gap: 0.75rem; margin-bottom: 0.75rem; flex-wrap: wrap; }
  .cib-logo-tag { background: #fff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 6px 12px; font-size: 0.78rem; font-weight: 700; color: #1d4ed8; }
  .cib-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; }
  .cib-field { display: flex; flex-direction: column; gap: 0.25rem; }
  .cib-field label { font-size: 0.7rem; font-weight: 700; color: #374151; }
  .cib-field input { padding: 0.65rem 0.85rem; border: 1.5px solid #bfdbfe; border-radius: 8px; font-size: 0.85rem; font-family: 'Manrope', sans-serif; background: #fff; outline: none; width: 100%; }
  .cib-field input:focus { border-color: #3b82f6; }
  .cib-secure { font-size: 0.72rem; color: #6b7280; display: flex; align-items: center; gap: 5px; margin-top: 0.5rem; }

  /* Bank transfer */
  .bank-panel { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; padding: 1.25rem; margin-bottom: 1.25rem; font-size: 0.82rem; color: #374151; line-height: 1.7; }

  /* Totals */
  .checkout-totals { background: #f9fafb; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1.25rem; }
  .ct-row { display: flex; justify-content: space-between; font-size: 0.85rem; color: #6b7280; margin-bottom: 0.4rem; }
  .ct-row.total { font-size: 1.05rem; font-weight: 800; color: #0d1f0f; border-top: 1px solid #e5e7eb; padding-top: 0.5rem; margin-top: 0.25rem; margin-bottom: 0; }
  .ct-row.total span:last-child { color: #16a34a; }

  /* Success */
  .checkout-success { text-align: center; padding: 2rem 1rem; }
  .success-icon { font-size: 4rem; margin-bottom: 1rem; }
  .checkout-success h3 { font-size: 1.4rem; font-weight: 800; color: #0d1f0f; margin-bottom: 0.5rem; }
  .checkout-success p { font-size: 0.9rem; color: #6b7280; margin-bottom: 0.25rem; }
  .order-ref { display: inline-block; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 6px 14px; font-size: 0.82rem; font-weight: 700; color: #16a34a; margin: 1rem 0; }

  .checkout-nav { display: flex; gap: 0.75rem; }
  .btn-back { flex: 0; padding: 0.85rem 1.5rem; border: 1.5px solid #e5e7eb; border-radius: 12px; background: #fff; color: #374151; font-size: 0.9rem; font-weight: 700; cursor: pointer; font-family: 'Manrope', sans-serif; white-space: nowrap; }
  .btn-next { flex: 1; padding: 0.85rem; border: none; border-radius: 12px; background: linear-gradient(135deg,#22c55e,#16a34a); color: #fff; font-size: 0.9rem; font-weight: 700; cursor: pointer; font-family: 'Manrope', sans-serif; box-shadow: 0 6px 20px rgba(34,197,94,0.3); transition: transform 0.2s; }
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
  .btn-add { background: linear-gradient(135deg, #22c55e, #16a34a); color: #fff; padding: 0.5rem 1.1rem; border-radius: 50px; font-size: 0.82rem; font-weight: 700; border: none; cursor: pointer; font-family: 'Manrope', sans-serif; box-shadow: 0 4px 12px rgba(34,197,94,0.3); transition: transform 0.2s; }
  .btn-add:hover { transform: translateY(-1px); }

  /* Toast */
  .toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); background: #0d1f0f; color: #4ade80; padding: 0.75rem 1.5rem; border-radius: 50px; font-size: 0.85rem; font-weight: 700; z-index: 700; box-shadow: 0 8px 24px rgba(0,0,0,0.3); animation: toastIn 0.3s ease; white-space: nowrap; }
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
const products = [
  { id:1, name:'AgroSense Pro', category:'Sensors', desc:'All-in-one soil moisture, temperature & pH sensor with LoRa connectivity.', price:12900, badge:'bestseller', badgeLabel:'Best Seller', bg:'https://www.makerfabs.com/media/catalog/product/cache/5082619e83af502b1cf28572733576a0/a/g/agrosense_soil_monitor_lorawan_humiditytemperaturephec_-1.jpg' },
  { id:2, name:'IrriBot Controller', category:'Irrigation', desc:'Smart irrigation valve controller with auto-scheduling and remote control.', price:8500, badge:'new', badgeLabel:'New', bg:'https://www.solarirrigations.com/uploads/4G-Smart-Irrigation-Controller-02-4.jpg' },
  { id:3, name:'CropCam AI', category:'Monitoring', desc:'Computer vision camera for real-time crop disease and pest detection.', price:19900, badge:'premium', badgeLabel:'Premium', bg:'https://cdn.prod.website-files.com/665dad178b155b8948cea817/68c13f2f7f4dd84cd10f4f54_real-time-photos.webp' },
  { id:4, name:'SolarHub Gateway', category:'Sensors', desc:'Solar-powered LoRa gateway covering up to 10km. No electricity needed.', price:6200, badge:'sale', badgeLabel:'Sale', bg:'https://ecdn6-nc.globalso.com/upload/p/911/image_product/2024-03/66062c2e3649e84279.jpg' },
  { id:5, name:'WeatherNode', category:'Monitoring', desc:'Compact weather station measuring wind, rain, UV and atmospheric pressure.', price:9400, badge:'new', badgeLabel:'New', bg:'https://images-na.ssl-images-amazon.com/images/I/71Mk5iJGjFL._AC_UL900_SR900,600_.jpg' },
  { id:6, name:'Dashboard Pro', category:'Software', desc:'Full web & mobile dashboard with AI insights, alerts and data export.', price:4900, badge:'premium', badgeLabel:'Premium', bg:'https://media.finebi.com/strapi/mobile_dashboard_172861a5c4.jpg' },
]

const DELIVERY_FEE = 500
const STEPS = ['Order Review', 'Delivery Info', 'Payment', 'Confirmation']

// ── CIB Card Form ──────────────────────────────────────────────────────────
function CIBForm({ data, onChange, errors }) {
  const fmt = (val, type) => {
    if (type === 'card') return val.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
    if (type === 'expiry') return val.replace(/\D/g,'').slice(0,4).replace(/(\d{2})(\d)/,'$1/$2')
    if (type === 'cvv') return val.replace(/\D/g,'').slice(0,3)
    return val
  }
  return (
    <div className="cib-panel">
      <div className="cib-panel-title">💳 Card Details</div>
      <div className="cib-logos">
        <span className="cib-logo-tag">🇩🇿 CIB</span>
        <span className="cib-logo-tag">💳 EDAHABIA</span>
        <span className="cib-logo-tag">🏦 Visa Algeria</span>
      </div>
      <div className="cib-form-grid" style={{marginBottom:'0.6rem'}}>
        <div className="cib-field" style={{gridColumn:'1/-1'}}>
          <label>Cardholder Name</label>
          <input placeholder="name" value={data.name} onChange={e => onChange('name', e.target.value)}
            style={errors.name ? {borderColor:'#ef4444'} : {}} />
          {errors.name && <span style={{fontSize:'0.7rem',color:'#ef4444'}}>Required</span>}
        </div>
        <div className="cib-field" style={{gridColumn:'1/-1'}}>
          <label>Card Number</label>
          <input placeholder="0000 0000 0000 0000" value={fmt(data.card,'card')}
            onChange={e => onChange('card', e.target.value.replace(/\s/g,''))}
            style={errors.card ? {borderColor:'#ef4444'} : {}} maxLength={19} />
          {errors.card && <span style={{fontSize:'0.7rem',color:'#ef4444'}}>Enter valid card number</span>}
        </div>
        <div className="cib-field">
          <label>Expiry Date</label>
          <input placeholder="MM/YY" value={fmt(data.expiry,'expiry')}
            onChange={e => onChange('expiry', e.target.value.replace('/',''))}
            style={errors.expiry ? {borderColor:'#ef4444'} : {}} maxLength={5} />
          {errors.expiry && <span style={{fontSize:'0.7rem',color:'#ef4444'}}>Required</span>}
        </div>
        <div className="cib-field">
          <label>CVV</label>
          <input placeholder="•••" type="password" value={fmt(data.cvv,'cvv')}
            onChange={e => onChange('cvv', e.target.value)}
            style={errors.cvv ? {borderColor:'#ef4444'} : {}} maxLength={3} />
          {errors.cvv && <span style={{fontSize:'0.7rem',color:'#ef4444'}}>Required</span>}
        </div>
      </div>
      <div className="cib-secure">🔒 Your payment is secured by 128-bit SSL encryption</div>
    </div>
  )
}

// ── Algérie Poste Panel ────────────────────────────────────────────────────
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
      <div className="ap-panel-title"> Algérie Poste — CCP Transfer Instructions</div>
      <div className="ap-steps">
        <div className="ap-step">
          <div className="ap-step-num">1</div>
          <div className="ap-step-text">Go to your nearest <strong>Algérie Poste</strong> office or use the <strong>Barid'E-Pay app</strong> / <strong>Barid Connect website</strong></div>
        </div>
        <div className="ap-step">
          <div className="ap-step-num">2</div>
          <div className="ap-step-text">Select <strong>"Virement CCP"</strong> (CCP Transfer) and enter AgriSense DZ's account number below</div>
        </div>
        <div className="ap-step">
          <div className="ap-step-num">3</div>
          <div className="ap-step-text">Transfer exactly <strong>{total.toLocaleString()} DZD</strong> and use your <strong>order reference #{orderRef}</strong> as the transfer note/motif</div>
        </div>
        <div className="ap-step">
          <div className="ap-step-num">4</div>
          <div className="ap-step-text">Send a photo of your receipt to <strong>orders@agrisensedz.dz</strong> — your order will ship within 1 business day of payment confirmation</div>
        </div>
      </div>
      <div className="ap-transfer-info">
        <div className="ap-info-row">
          <span className="ap-info-label">Account Name</span>
          <span className="ap-info-val">AgriSense DZ SARL</span>
        </div>
        <div className="ap-info-row">
          <span className="ap-info-label">CCP Number</span>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <span className="ap-info-val">{ccpNum}</span>
            <button className="ap-copy-btn" onClick={() => copyToClipboard(ccpNum,'ccp')}>
              {copied === 'ccp' ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
        <div className="ap-info-row">
          <span className="ap-info-label">Clé CCP</span>
          <span className="ap-info-val">80</span>
        </div>
        <div className="ap-info-row">
          <span className="ap-info-label">Amount</span>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <span className="ap-info-val" style={{color:'#d97706'}}>{total.toLocaleString()} DZD</span>
            <button className="ap-copy-btn" onClick={() => copyToClipboard(total.toString(),'amt')}>
              {copied === 'amt' ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
        <div className="ap-info-row">
          <span className="ap-info-label">Order Reference</span>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <span className="ap-info-val">{orderRef}</span>
            <button className="ap-copy-btn" onClick={() => copyToClipboard(orderRef,'ref')}>
              {copied === 'ref' ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Checkout Modal ─────────────────────────────────────────────────────────
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
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateCib = () => {
    const e = {}
    if (!cibData.name.trim()) e.name = true
    if (cibData.card.replace(/\s/g,'').length < 16) e.card = true
    if (!cibData.expiry) e.expiry = true
    if (cibData.cvv.length < 3) e.cvv = true
    setCibErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (step === 1 && !validateDelivery()) return
    if (step === 2 && payment === 'cib' && !validateCib()) return
    if (step === 2) { setStep(3); onSuccess && onSuccess() }
    else setStep(s => s + 1)
  }

  const paymentOpts = [
    {
      key: 'algerie_poste',
      icon: '🟡',
      label: "Algérie Poste — CCP / Barid 'E-Pay",
      sub: 'Transfer via CCP account or Barid\'E-Pay app',
      badge: 'badge-algerie-poste',
      badgeText: '🇩🇿 Most popular in Algeria'
    },
    {
      key: 'cib',
      icon: '💳',
      label: 'CIB / EDAHABIA Card',
      sub: 'Algerian debit card — online payment',
      badge: 'badge-cib',
      badgeText: '🔒 Secured payment'
    },
    {
      key: 'cash',
      icon: '💵',
      label: 'Cash on Delivery',
      sub: 'Pay in cash when your order arrives',
      badge: 'badge-cash',
      badgeText: '✓ No account needed'
    },
    {
      key: 'bank',
      icon: '🏦',
      label: 'Bank Transfer (BNA / CPA / BEA)',
      sub: 'Direct bank-to-bank transfer',
      badge: null,
      badgeText: null
    },
  ]

  const paymentLabel = () => {
    if (payment === 'algerie_poste') return 'Algérie Poste / CCP'
    if (payment === 'cib') return 'CIB / EDAHABIA Card'
    if (payment === 'cash') return 'Cash on Delivery'
    return 'Bank Transfer'
  }

  return (
    <div className="checkout-overlay" onClick={e => { if(e.target === e.currentTarget) onClose() }}>
      <div className="checkout-modal">
        <div className="checkout-header">
          <h2>🛒 Checkout</h2>
          <button className="checkout-close" onClick={onClose}>✕</button>
        </div>

        <div className="checkout-body">
          {/* Steps indicator */}
          <div className="checkout-steps">
            {STEPS.map((s, i) => (
              <div key={i} className="checkout-step" style={{ flex: i < STEPS.length-1 ? '1' : 'none' }}>
                <div className={`step-num ${i < step ? 'done' : i === step ? 'active' : 'pending'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`step-label ${i < step ? 'done' : i === step ? 'active' : 'pending'}`}>{s}</span>
                {i < STEPS.length - 1 && <div className={`step-line ${i < step ? 'done' : 'pending'}`} style={{flex:1}}/>}
              </div>
            ))}
          </div>

          {/* STEP 0 — Order Review */}
          {step === 0 && (
            <>
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
                <button className="btn-back" onClick={onClose}>← Back to Cart</button>
                <button className="btn-next" onClick={next}>Continue → Delivery Info</button>
              </div>
            </>
          )}

          {/* STEP 1 — Delivery Info */}
          {step === 1 && (
            <>
              <div className="checkout-section-title">📦 Delivery Information</div>
              <div className="checkout-form-grid">
                <div className="co-field">
                  <label>First Name *</label>
                  <input name="firstName" placeholder="first name" value={form.firstName} onChange={handle} style={errors.firstName?{borderColor:'#ef4444'}:{}}/>
                  {errors.firstName && <span style={{fontSize:'0.7rem',color:'#ef4444'}}>Required</span>}
                </div>
                <div className="co-field">
                  <label>Last Name *</label>
                  <input name="lastName" placeholder="last name" value={form.lastName} onChange={handle} style={errors.lastName?{borderColor:'#ef4444'}:{}}/>
                  {errors.lastName && <span style={{fontSize:'0.7rem',color:'#ef4444'}}>Required</span>}
                </div>
              </div>
              <div className="checkout-form-grid">
                <div className="co-field">
                  <label>Phone Number *</label>
                  <input name="phone" placeholder="+213 XXX XXX XXX" value={form.phone} onChange={handle} style={errors.phone?{borderColor:'#ef4444'}:{}}/>
                  {errors.phone && <span style={{fontSize:'0.7rem',color:'#ef4444'}}>Required</span>}
                </div>
                <div className="co-field">
                  <label>Email (optional)</label>
                  <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle}/>
                </div>
              </div>
              <div className="checkout-form-grid full">
                <div className="co-field">
                  <label>Wilaya *</label>
                  <select name="wilaya" value={form.wilaya} onChange={handle} style={errors.wilaya?{borderColor:'#ef4444'}:{}}>
                    <option value="">Select your wilaya</option>
                    {WILAYAS.map(w => <option key={w}>{w}</option>)}
                  </select>
                  {errors.wilaya && <span style={{fontSize:'0.7rem',color:'#ef4444'}}>Required</span>}
                </div>
              </div>
              <div className="checkout-form-grid full">
                <div className="co-field">
                  <label>Delivery Address *</label>
                  <input name="address" placeholder="Street, building, commune..." value={form.address} onChange={handle} style={errors.address?{borderColor:'#ef4444'}:{}}/>
                  {errors.address && <span style={{fontSize:'0.7rem',color:'#ef4444'}}>Required</span>}
                </div>
              </div>
              <div className="checkout-form-grid full" style={{marginBottom:'1.25rem'}}>
                <div className="co-field">
                  <label>Notes for delivery (optional)</label>
                  <textarea name="notes" placeholder="Any special instructions..." value={form.notes} onChange={handle}/>
                </div>
              </div>
              <div className="checkout-nav">
                <button className="btn-back" onClick={() => setStep(0)}>← Back</button>
                <button className="btn-next" onClick={next}>Continue → Payment</button>
              </div>
            </>
          )}

          {/* STEP 2 — Payment */}
          {step === 2 && (
            <>
              <div className="checkout-section-title">💳 Payment Method</div>
              <div className="payment-options">
                {paymentOpts.map(opt => (
                  <div key={opt.key} className={`payment-opt ${payment === opt.key ? 'selected' : ''}`} onClick={() => setPayment(opt.key)}>
                    <div className="payment-opt-radio">
                      {payment === opt.key && <div className="payment-opt-dot"/>}
                    </div>
                    <span className="payment-opt-icon">{opt.icon}</span>
                    <div className="payment-opt-content">
                      <div className="payment-opt-label">{opt.label}</div>
                      <div className="payment-opt-sub">{opt.sub}</div>
                      {opt.badge && <span className={`payment-opt-badge ${opt.badge}`}>{opt.badgeText}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Algérie Poste details */}
              {payment === 'algerie_poste' && (
                <AlgeriePostePanel orderRef={orderRef} total={total} />
              )}

              {/* CIB card form */}
              {payment === 'cib' && (
                <CIBForm data={cibData} onChange={handleCib} errors={cibErrors} />
              )}

              {/* Bank transfer */}
              {payment === 'bank' && (
                <div className="bank-panel">
                  <strong style={{color:'#16a34a'}}>Bank Transfer Details:</strong><br/>
                  Bank: BNA — Banque Nationale d'Algérie<br/>
                  Account: 00200 20002 000022222 22<br/>
                  Reference: <strong>{orderRef}</strong><br/>
                  <span style={{fontSize:'0.78rem',color:'#6b7280'}}>Orders are processed after payment confirmation (1–2 business days)</span>
                </div>
              )}

              <div className="checkout-totals">
                <div className="ct-row"><span>Subtotal</span><span>{subtotal.toLocaleString()} DZD</span></div>
                <div className="ct-row"><span>Delivery</span><span>{DELIVERY_FEE.toLocaleString()} DZD</span></div>
                <div className="ct-row total"><span>Total to pay</span><span>{total.toLocaleString()} DZD</span></div>
              </div>

              <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:'10px',padding:'0.75rem 1rem',marginBottom:'1.25rem',fontSize:'0.78rem',color:'#92400e'}}>
                📍 Delivering to: <strong>{form.address}, {form.wilaya}</strong><br/>
                📞 Contact: <strong>{form.phone}</strong>
              </div>

              <div className="checkout-nav">
                <button className="btn-back" onClick={() => setStep(1)}>← Back</button>
                <button className="btn-next" onClick={next}>
                  {payment === 'algerie_poste' ? '✅ Confirm & Get Payment Info' :
                   payment === 'cib' ? '🔒 Pay Now' : '✅ Place Order'}
                </button>
              </div>
            </>
          )}

          {/* STEP 3 — Confirmation */}
          {step === 3 && (
            <div className="checkout-success">
              <div className="success-icon">🎉</div>
              <h3>Order Placed Successfully!</h3>
              <p>Thank you for your order, <strong>{form.firstName}</strong>!</p>
              <div className="order-ref">Order #{orderRef}</div>

              {payment === 'algerie_poste' && (
                <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:'14px',padding:'1rem',margin:'1rem 0',textAlign:'left'}}>
                  <p style={{fontSize:'0.85rem',fontWeight:700,color:'#92400e',marginBottom:'0.5rem'}}>⏳ Next step — Complete your CCP payment:</p>
                  <p style={{fontSize:'0.82rem',color:'#78350f',lineHeight:1.6}}>
                    Please transfer <strong>{total.toLocaleString()} DZD</strong> to CCP <strong>00799-01234567890 (Clé 23)</strong> with reference <strong>#{orderRef}</strong>.<br/>
                    Send your receipt to <strong>orders@agrisensedz.dz</strong> to confirm your order.
                  </p>
                </div>
              )}
              {payment === 'cib' && (
                <p style={{fontSize:'0.82rem',color:'#6b7280',margin:'0.5rem 0'}}>💳 Payment processed · Confirmation sent to {form.email || form.phone}</p>
              )}

              <p style={{fontSize:'0.82rem',color:'#9ca3af',marginTop:'0.5rem'}}>
                Delivery to <strong>{form.wilaya}</strong> · Payment: {paymentLabel()}
              </p>
              <p style={{fontSize:'0.82rem',color:'#9ca3af',marginTop:'0.25rem'}}>Estimated delivery: <strong>3–5 business days</strong></p>
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

// ── Main Products Page ──────────────────────────────────────────────────────
export default function Products() {
  const [active, setActive] = useState('All')
  const [cart, setCart] = useState([])
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
    setToast(`✅ ${p.name} added to cart`)
    setTimeout(() => setToast(''), 2000)
  }

  const changeQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? {...i, qty: i.qty + delta} : i).filter(i => i.qty > 0))
  }

  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id))

  const handleOrderSuccess = () => { setCart([]) }

  useEffect(() => {
    const els = document.querySelectorAll(".reveal")
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible") })
    }, { threshold: 0.12 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <style>{styles}</style>
    

      <section
  className="products-hero"
  style={{ backgroundImage: `url(${hp})` }}
>
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
          🛒 Cart
          {totalItems > 0 && <span className="basket-count">{totalItems}</span>}
        </button>
      </div>

      <div className="products-main">
        <div className="products-grid">
          {filtered.map((p, i) => (
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
                  <button className="btn-add" onClick={() => addToCart(p)}>+ Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Drawer */}
      {basketOpen && (
        <>
          <div className="basket-overlay" onClick={() => setBasketOpen(false)} />
          <div className="basket-drawer">
            <div className="basket-header">
              <h3>🛒 Your Cart <span style={{fontSize:'0.82rem',fontWeight:500,color:'#9ca3af'}}>({totalItems} item{totalItems !== 1 ? 's' : ''})</span></h3>
              <button className="basket-close" onClick={() => setBasketOpen(false)}>✕</button>
            </div>

            <div className="basket-items">
              {cart.length === 0 ? (
                <div className="basket-empty">
                  <div>🛒</div>
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
                    <button className="qty-btn" onClick={() => changeQty(item.id, -1)}>−</button>
                    <span className="qty-num">{item.qty}</span>
                    <button className="qty-btn" onClick={() => changeQty(item.id, +1)}>+</button>
                    <button className="remove-btn" onClick={() => removeItem(item.id)}>🗑</button>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <>
                <div className="basket-summary">
                  <div className="basket-summary-row"><span>Subtotal</span><span>{totalPrice.toLocaleString()} DZD</span></div>
                  <div className="basket-summary-row"><span>Delivery</span><span>500 DZD</span></div>
                  <div className="basket-summary-row total"><span>Total</span><span>{(totalPrice + 500).toLocaleString()} DZD</span></div>
                </div>
                <div className="basket-footer">
                  <button className="btn-checkout" onClick={() => { setBasketOpen(false); setCheckoutOpen(true) }}>
                    Proceed to Checkout →
                  </button>
                  <button className="btn-clear" onClick={() => setCart([])}>Clear Cart</button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {checkoutOpen && (
        <CheckoutModal
          cart={cart}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={handleOrderSuccess}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
      
    </>
  )
}