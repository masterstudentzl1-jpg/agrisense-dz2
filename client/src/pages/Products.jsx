import { useState, useEffect } from 'react'


const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Manrope', sans-serif; }

  .products-hero {
    position: relative; padding: 140px 20px 80px; color: white; text-align: center;
    background-image: url('https://png.pngtree.com/thumb_back/fh260/background/20240725/pngtree-the-concept-of-new-farming-or-smart-farming-agricultural-technology-image_15917909.jpg');
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
  position: sticky;
  top: 68px;
  z-index: 100;
  background: #fff;
  border-bottom: 2px solid #e5e7eb;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  padding: 0 2rem;
}
 /* left side tabs */
.filter-left {
  display: flex;
  align-items: center;
  gap: 0;
  overflow-x: auto;
  flex: 1;

  scrollbar-width: none;
}
  .filter-left::-webkit-scrollbar {
  display: none;
}
 /* tab buttons */
.filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 1rem 1.35rem;
  white-space: nowrap;

  border: none;
  border-bottom: 3px solid transparent;
  background: transparent;

  font-size: 0.9rem;
  font-weight: 700;
  color: #6b7280;
  cursor: pointer;

  transition: 0.2s ease;
  font-family: 'Manrope', sans-serif;
}
  .filter-btn:hover {
  color: #16a34a;
}
.filter-btn.active {
  color: #16a34a;
  border-bottom-color: #22c55e;
}

/* basket button */
.basket-btn {
  flex-shrink: 0;
  margin-left: 1rem;
}
  .basket-btn:hover { background: #dcfce7; }
  .basket-count {
    background: #22c55e; color: #fff; font-size: 0.65rem; font-weight: 800;
    width: 18px; height: 18px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }

  /* ── BASKET DRAWER ── */
  .basket-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.4);
    z-index: 500; backdrop-filter: blur(2px);
  }
  .basket-drawer {
    position: fixed; top: 0; right: 0; bottom: 0; width: 380px;
    background: #fff; z-index: 501; display: flex; flex-direction: column;
    box-shadow: -8px 0 40px rgba(0,0,0,0.15);
  }
  .basket-header {
    padding: 1.25rem 1.5rem; border-bottom: 1px solid #e5e7eb;
    display: flex; align-items: center; justify-content: space-between;
  }
  .basket-header h3 { font-size: 1.1rem; font-weight: 800; color: #0d1f0f; }
  .basket-close {
    width: 32px; height: 32px; border-radius: 50%; border: 1px solid #e5e7eb;
    background: #f9fafb; cursor: pointer; font-size: 16px;
    display: flex; align-items: center; justify-content: center; font-family: inherit;
  }
  .basket-items { flex: 1; overflow-y: auto; padding: 1rem 1.5rem; }
  .basket-empty { text-align: center; padding: 3rem 1rem; color: #9ca3af; }
  .basket-empty div { font-size: 3rem; margin-bottom: 0.75rem; }
  .basket-item { display: flex; gap: 12px; padding: 0.9rem 0; border-bottom: 1px solid #f3f4f6; align-items: center; }
  .basket-item-img { width: 56px; height: 56px; border-radius: 10px; overflow: hidden; flex-shrink: 0; background: #f0fdf4; }
  .basket-item-img img { width: 100%; height: 100%; object-fit: cover; }
  .basket-item-info { flex: 1; }
  .basket-item-name { font-size: 0.88rem; font-weight: 700; color: #0d1f0f; margin-bottom: 2px; }
  .basket-item-price { font-size: 0.82rem; color: #16a34a; font-weight: 700; }
  .basket-item-qty { display: flex; align-items: center; gap: 8px; }
  .qty-btn {
    width: 26px; height: 26px; border-radius: 50%; border: 1.5px solid #e5e7eb;
    background: #fff; cursor: pointer; font-size: 14px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; color: #374151;
  }
  .qty-btn:hover { border-color: #22c55e; color: #22c55e; }
  .qty-num { font-size: 0.88rem; font-weight: 700; color: #0d1f0f; min-width: 20px; text-align: center; }
  .remove-btn { background: none; border: none; cursor: pointer; color: #9ca3af; font-size: 16px; padding: 4px; }
  .remove-btn:hover { color: #ef4444; }
  .basket-footer { padding: 1.25rem 1.5rem; border-top: 1px solid #e5e7eb; }
  .basket-total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .basket-total-label { font-size: 0.88rem; color: #6b7280; font-weight: 500; }
  .basket-total-val { font-size: 1.2rem; font-weight: 800; color: #0d1f0f; }
  .btn-checkout {
    width: 100%; padding: 0.9rem; border: none; border-radius: 12px;
    background: linear-gradient(135deg, #22c55e, #16a34a); color: #fff;
    font-size: 0.95rem; font-weight: 700; cursor: pointer; font-family: 'Manrope', sans-serif;
    box-shadow: 0 6px 20px rgba(34,197,94,0.35); transition: transform 0.2s;
  }
  .btn-checkout:hover { transform: translateY(-1px); }
  .btn-clear { width: 100%; padding: 0.65rem; border: 1.5px solid #e5e7eb; border-radius: 12px; background: #fff; color: #6b7280; font-size: 0.82rem; font-weight: 600; cursor: pointer; margin-top: 0.5rem; font-family: 'Manrope', sans-serif; }
  .btn-clear:hover { border-color: #ef4444; color: #ef4444; }

  /* toast */
  .toast {
    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
    background: #0d1f0f; color: #4ade80; padding: 0.75rem 1.5rem;
    border-radius: 50px; font-size: 0.85rem; font-weight: 700;
    z-index: 600; box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    animation: toastIn 0.3s ease;
  }
  @keyframes toastIn { from { opacity:0; transform: translateX(-50%) translateY(20px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }

  .products-main { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem 5rem; }
  .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
  .product-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 20px; overflow: hidden; transition: box-shadow 0.3s, transform 0.3s; cursor: pointer; }
  .product-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.1); transform: translateY(-4px); }
  .card-img { height: 200px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
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
  .btn-add {
    background: linear-gradient(135deg, #22c55e, #16a34a); color: #fff;
    padding: 0.5rem 1.1rem; border-radius: 50px; font-size: 0.82rem; font-weight: 700;
    border: none; cursor: pointer; font-family: 'Manrope', sans-serif;
    box-shadow: 0 4px 12px rgba(34,197,94,0.3); transition: transform 0.2s, box-shadow 0.2s;
  }
  .btn-add:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(34,197,94,0.4); }

  @media (max-width: 768px) {
  .basket-drawer {
    width: 100%;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .filter-bar {
    padding: 0 1rem;
    gap: 0.75rem;
  }

  .filter-btn {
    padding: 0.95rem 1rem;
    font-size: 0.85rem;
  }

  .basket-btn {
    padding: 0.55rem 1rem;
    font-size: 0.82rem;
  }
}
`

const categories = ['All', 'Sensors', 'Irrigation', 'Monitoring', 'Software']

const products = [
  { id:1, name: 'AgroSense Pro', category: 'Sensors', desc: 'All-in-one soil moisture, temperature & pH sensor with LoRa connectivity.', price: 12900, badge: 'bestseller', badgeLabel: 'Best Seller', bg: 'https://www.makerfabs.com/media/catalog/product/cache/5082619e83af502b1cf28572733576a0/a/g/agrosense_soil_monitor_lorawan_humiditytemperaturephec_-1.jpg' },
  { id:2, name: 'IrriBot Controller', category: 'Irrigation', desc: 'Smart irrigation valve controller with auto-scheduling and remote control.', price: 8500, badge: 'new', badgeLabel: 'New', bg: 'https://www.solarirrigations.com/uploads/4G-Smart-Irrigation-Controller-02-4.jpg' },
  { id:3, name: 'CropCam AI', category: 'Monitoring', desc: 'Computer vision camera for real-time crop disease and pest detection.', price: 19900, badge: 'premium', badgeLabel: 'Premium', bg: 'https://cdn.prod.website-files.com/665dad178b155b8948cea817/68c13f2f7f4dd84cd10f4f54_real-time-photos.webp' },
  { id:4, name: 'SolarHub Gateway', category: 'Sensors', desc: 'Solar-powered LoRa gateway covering up to 10km. No electricity needed.', price: 6200, badge: 'sale', badgeLabel: 'Sale', bg: 'https://ecdn6-nc.globalso.com/upload/p/911/image_product/2024-03/66062c2e3649e84279.jpg' },
  { id:5, name: 'WeatherNode', category: 'Monitoring', desc: 'Compact weather station measuring wind, rain, UV and atmospheric pressure.', price: 9400, badge: 'new', badgeLabel: 'New', bg: 'https://images-na.ssl-images-amazon.com/images/I/71Mk5iJGjFL._AC_UL900_SR900,600_.jpg' },
  { id:6, name: 'Dashboard Pro', category: 'Software', desc: 'Full web & mobile dashboard with AI insights, alerts and data export.', price: 4900, badge: 'premium', badgeLabel: 'Premium', bg: 'https://media.finebi.com/strapi/mobile_dashboard_172861a5c4.jpg' },
]

export default function Products() {
  const [active, setActive] = useState('All')
  const [cart, setCart] = useState([])          // { id, name, price, bg, qty }
  const [basketOpen, setBasketOpen] = useState(false)
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
    setCart(prev => prev
      .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
      .filter(i => i.qty > 0)
    )
  }

  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id))

  useEffect(() => {
    const els = document.querySelectorAll(".reveal")
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible") })
    }, { threshold: 0.12 })
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <style>{styles}</style>
      

      {/* Hero */}
      <section className="products-hero">
        <div className="section-header reveal">
          <div className="tag">Our Products</div>
          <h1>Smart IoT Solutions</h1>
          <p>Professional-grade agricultural IoT devices designed and supported locally in Algeria. Built to last, priced to scale.</p>
        </div>
      </section>

      {/* Filter Bar + Basket Button */}
      <div className="filter-bar">
        <div className="filter-left">
          {categories.map(cat => (
            <button key={cat} className={`filter-btn ${active === cat ? 'active' : ''}`} onClick={() => setActive(cat)}>{cat}</button>
          ))}
        </div>

        {/* ✅ TASK 3: Basket button */}
        <button className="basket-btn" onClick={() => setBasketOpen(true)}>
          🛒 Cart
          {totalItems > 0 && <span className="basket-count">{totalItems}</span>}
        </button>
      </div>

      {/* Products Grid */}
      <div className="products-main">
        <div className="products-grid">
          {filtered.map((p, i) => (
            <div key={p.id} className="product-card" style={{ transitionDelay: `${i * 0.08}s` }}>
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
                  {/* ✅ TASK 3: Add to Cart button */}
                  <button className="btn-add" onClick={() => addToCart(p)}>+ Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ TASK 3: Basket Drawer */}
      {basketOpen && (
        <>
          <div className="basket-overlay" onClick={() => setBasketOpen(false)} />
          <div className="basket-drawer">
            <div className="basket-header">
              <h3>🛒 Your Cart ({totalItems} items)</h3>
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
                  <div className="basket-item-img">
                    <img src={item.bg} alt={item.name} />
                  </div>
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
              <div className="basket-footer">
                <div className="basket-total-row">
                  <span className="basket-total-label">Total</span>
                  <span className="basket-total-val">{totalPrice.toLocaleString()} DZD</span>
                </div>
                <button className="btn-checkout">Proceed to Checkout →</button>
                <button className="btn-clear" onClick={() => setCart([])}>Clear Cart</button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Toast notification */}
      {toast && <div className="toast">{toast}</div>}

      
    </>
  )
}