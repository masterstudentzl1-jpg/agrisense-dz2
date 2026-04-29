import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Thermometer, Droplets, Wifi, Brain, BatteryCharging, BarChart } from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Manrope', sans-serif; background: #0a0a0a; color: #fff; overflow-x: hidden; }

  /* ── HERO ── */
  .hero {
    position: relative; min-height: 100vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 6rem 2rem 4rem; overflow: hidden;
  }
  .hero-bg {
    position: absolute; inset: 0;
    background-image: url('https://plus.unsplash.com/premium_photo-1661811677567-6f14477aa1fa?q=80&w=876&auto=format&fit=crop');
    background-size: cover; background-position: center;
    filter: brightness(0.45) saturate(1.2); z-index: 0;
  }
  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(160deg, rgba(10,40,20,0.85), rgba(22,101,52,0.7), rgba(10,40,20,0.6));
    z-index: 1;
  }
  .hero-content { position: relative; z-index: 2; max-width: 860px; }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(167,135,135,0.08); border: 1px solid rgba(74,222,128,0.35);
    color: #4ade80; font-size: 0.82rem; font-weight: 600;
    padding: 0.4rem 1rem; border-radius: 50px; margin-bottom: 2rem;
    letter-spacing: 0.03em; animation: fadeUp 0.6s ease both;
  }
  .badge-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #4ade80; box-shadow: 0 0 8px #4ade80;
    animation: pulse 2s ease infinite;
  }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  .hero-title {
    font-size: clamp(2.8rem, 6vw, 5rem); font-weight: 800;
    line-height: 1.1; letter-spacing: -0.03em; color: #fff;
    margin-bottom: 1.5rem; animation: fadeUp 0.7s 0.1s ease both;
  }
  .hero-title .accent { color: #4ade80; display: block; }
  .hero-sub {
    font-size: clamp(1rem, 2vw, 1.15rem); color: #d1d5db; line-height: 1.7;
    max-width: 620px; margin: 0 auto 2.5rem; font-weight: 400;
    animation: fadeUp 0.7s 0.2s ease both;
  }
  .hero-actions {
    display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
    animation: fadeUp 0.7s 0.3s ease both;
  }
  .btn-primary {
    background: linear-gradient(135deg, #22c55e, #16a34a); color: #fff;
    padding: 0.85rem 2rem; border-radius: 50px; font-size: 0.95rem; font-weight: 600;
    text-decoration: none; border: none; cursor: pointer;
    box-shadow: 0 8px 28px rgba(34,197,94,0.4); transition: transform 0.2s, box-shadow 0.2s;
    display: inline-block;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(34,197,94,0.5); }
  .btn-outline {
    background: rgba(255,255,255,0.08); color: #fff; padding: 0.85rem 2rem;
    border-radius: 50px; font-size: 0.95rem; font-weight: 600; text-decoration: none;
    border: 1px solid rgba(255,255,255,0.2); cursor: pointer;
    transition: background 0.2s, transform 0.2s; backdrop-filter: blur(4px);
    display: inline-block;
  }
  .btn-outline:hover { background: rgba(255,255,255,0.14); transform: translateY(-2px); }

  /* ── STATS ── */
  .stats-strip {
    position: relative; z-index: 2; display: flex; justify-content: center;
    gap: 3rem; margin-top: 4rem; animation: fadeUp 0.7s 0.4s ease both; flex-wrap: wrap;
  }
  .stat { text-align: center; }
  .stat-num { font-size: 1.8rem; font-weight: 800; color: #4ade80; letter-spacing: -0.02em; }
  .stat-label { font-size: 0.78rem; color: #9ca3af; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; margin-top: 2px; }
  .stat-divider { width: 1px; background: rgba(186,215,201,0.4); align-self: stretch; }

  /* ── FEATURES ── */
  .features-section { background: #ccf0d6; padding: 6rem 2rem; }
  .section-header { text-align: center; margin-bottom: 3.5rem; }
  .section-tag {
    display: inline-block; background: rgba(34,197,94,0.12); color: #16a34a;
    border: 1px solid rgba(74,222,128,0.25); font-size: 0.75rem; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase; padding: 0.35rem 1rem;
    border-radius: 50px; margin-bottom: 1rem;
  }
  .section-title { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800; letter-spacing: -0.02em; color: #191616; line-height: 1.2; }
  .section-title span { color: #16a34a; }
  .section-sub { color: #36393f; font-size: 1rem; margin-top: 0.75rem; max-width: 500px; margin-left: auto; margin-right: auto; line-height: 1.6; }
  .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; max-width: 1100px; margin: 0 auto; }
  .feature-card { background: rgb(183,225,175); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 2rem; transition: border-color 0.3s, transform 0.3s; cursor: default; }
  .feature-card:hover { border-color: rgba(79,126,79,0.3); transform: translateY(-4px); }
  .feature-icon-wrap { width: 48px; height: 48px; background: rgba(34,197,94,0.12); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem; color: #22c55e; }
  .feature-card h3 { font-size: 1.05rem; font-weight: 700; color: #161414; margin-bottom: 0.5rem; }
  .feature-card p { font-size: 0.88rem; color: #575a62; line-height: 1.6; }

  /* ── PRODUCTS PREVIEW ── */
  .products-section { background: #c3e6bb; padding: 6rem 2rem; }
  .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.25rem; max-width: 1100px; margin: 0 auto; }
  .product-card { background: rgb(255,255,255); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; overflow: hidden; transition: border-color 0.3s, transform 0.3s; }
  .product-card:hover { border-color: rgba(74,222,128,0.3); transform: translateY(-4px); }
  .product-img { height: 160px; display: flex; align-items: center; justify-content: center; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .product-img img { width: 100%; height: 100%; object-fit: cover; }
  .product-img span { font-size: 3rem; }
  .product-body { padding: 1.25rem; }
  .product-tag { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #16a34a; margin-bottom: 0.4rem; }
  .product-body h3 { font-size: 1rem; font-weight: 700; color: #0d1f0f; margin-bottom: 0.4rem; }
  .product-body p { font-size: 0.82rem; color: #6b7280; margin-bottom: 1rem; line-height: 1.5; }
  .product-footer { display: flex; align-items: center; justify-content: space-between; }
  .product-price { font-size: 1rem; font-weight: 800; color: #16a34a; }
  .btn-sm { background: rgba(34,197,94,0.15); color: #16a34a; border: 1px solid rgba(74,222,128,0.3); padding: 0.4rem 0.9rem; border-radius: 50px; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
  .btn-sm:hover { background: rgba(34,197,94,0.25); }

  /* ── VIEW MORE BUTTON ── */
  .view-more-wrap { text-align: center; margin-top: 3rem; }
  .btn-view-more {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, #22c55e, #16a34a); color: #fff;
    padding: 0.9rem 2.5rem; border-radius: 50px; font-size: 0.95rem; font-weight: 700;
    text-decoration: none; border: none; cursor: pointer;
    box-shadow: 0 8px 28px rgba(34,197,94,0.35); transition: transform 0.2s, box-shadow 0.2s;
  }
  .btn-view-more:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(34,197,94,0.5); }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .reveal.visible { opacity: 1; transform: none; }

  /* ── MOBILE RESPONSIVE ── */
  @media (max-width: 768px) {
    .hero { padding: 5rem 1.25rem 3rem; }
    .stats-strip { gap: 1.5rem; }
    .stat-divider { display: none; }
    .features-section, .products-section { padding: 4rem 1.25rem; }
    .hero-actions { flex-direction: column; align-items: center; }
    .btn-primary, .btn-outline { width: 100%; max-width: 300px; text-align: center; }
  }
`;

const features = [
  { icon: Thermometer, title: "Real-Time Soil Monitoring", desc: "Track moisture, temperature, and pH levels with millimeter precision across your entire field." },
  { icon: Droplets, title: "Smart Irrigation Control", desc: "Automated watering schedules that adapt to real sensor data — save up to 40% water." },
  { icon: Wifi, title: "LoRa & 4G Connectivity", desc: "Sensors work in remote Algerian terrain with long-range LoRa or 4G — no WiFi needed." },
  { icon: Brain, title: "AI Crop Predictions", desc: "Machine learning models trained on Algerian crops to forecast yield and detect disease early." },
  { icon: BatteryCharging, title: "Solar-Powered Hardware", desc: "All devices run on solar energy — zero electricity cost, built for the Algerian sun." },
  { icon: BarChart, title: "Live Dashboard", desc: "Web and mobile dashboard with charts, alerts, and historical data for every sensor." },
];

const products = [
  { icon: "https://www.makerfabs.com/media/catalog/product/cache/5082619e83af502b1cf28572733576a0/a/g/agrosense_soil_monitor_lorawan_humiditytemperaturephec_-1.jpg", tag: "Sensor", name: "AgroSense Pro", desc: "All-in-one soil & climate sensor with LoRa", price: "12,900 DZD" },
  { icon: "https://www.solarirrigations.com/uploads/4G-Smart-Irrigation-Controller-02-4.jpg", tag: "Irrigation", name: "IrriBot Controller", desc: "Smart irrigation valve with auto-scheduling", price: "8,500 DZD" },
  { icon: "https://cdn.prod.website-files.com/665dad178b155b8948cea817/68c13f2f7f4dd84cd10f4f54_real-time-photos.webp", tag: "Camera", name: "CropCam AI", desc: "Computer vision for crop health analysis", price: "19,900 DZD" },
  { icon: "https://ecdn6-nc.globalso.com/upload/p/911/image_product/2024-03/66062c2e3649e84279.jpg", tag: "Network", name: "SolarHub Gateway", desc: "Solar LoRa gateway — covers up to 10km", price: "6,200 DZD" },
];

export default function AgriSenseDZ() {

  
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.12 });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);



  return (
    <>
      <style>{styles}</style>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Smart Agriculture Revolution in Algeria
          </div>
          <h1 className="hero-title">
            Grow Smarter with IoT
            <span className="accent">Technology</span>
          </h1>
          <p className="hero-sub">
            AgriSense DZ delivers cutting-edge IoT sensors and smart monitoring systems to
            Algerian farmers — helping you track crops, save water, and maximize yields in real time.
          </p>
          <div className="hero-actions">
            {/* ✅ TASK 1: "Shop Devices" links to /products */}
            <Link to="/products" className="btn-primary">Shop Devices</Link>
            {/* ✅ TASK 1: "View Live Demo" links to /dashboard */}
            <Link to="/dashboard" className="btn-outline">View Live Demo →</Link>
          </div>
        </div>

        <div className="stats-strip">
          {[
            { num: "500+", label: "Farms Connected" },
            { num: "69", label: "Wilayas Covered" },
            { num: "40%", label: "Water Saved" },
            { num: "24/7", label: "Live Monitoring" },
          ].map((s, i) => (
            <>
              {i > 0 && <div key={`d${i}`} className="stat-divider" />}
              <div key={s.num} className="stat">
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <div className="section-header reveal">
          <div className="section-tag">Why AgriSense DZ</div>
          <h2 className="section-title">Everything your farm <span>needs</span></h2>
          <p className="section-sub">Purpose-built for Algerian agriculture — from the Sahara to the Tell Atlas.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="feature-icon-wrap"><f.icon size={22} /></div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUCTS PREVIEW ── */}
      <section className="products-section">
        <div className="section-header reveal">
          <div className="section-tag">Our Hardware</div>
          <h2 className="section-title">IoT Devices <span>made for Algeria</span></h2>
          <p className="section-sub">Designed, assembled, and supported locally — in Algerian Dinar.</p>
        </div>
        <div className="products-grid">
          {products.map((p, i) => (
            <div key={i} className="product-card reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="product-img">
                {p.icon.startsWith("http") ? <img src={p.icon} alt={p.name} /> : <span>{p.icon}</span>}
              </div>
              <div className="product-body">
                <div className="product-tag">{p.tag}</div>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <div className="product-footer">
                  <span className="product-price">{p.price}</span>
                  {/* ✅ TASK 2: "Add to Cart" button on home preview */}
                  
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ TASK 2: "View More Products" button */}
        <div className="view-more-wrap reveal">
          <Link to="/products" className="btn-view-more">
            View All Products →
          </Link>
        </div>
      </section>
    </>
  );
}
