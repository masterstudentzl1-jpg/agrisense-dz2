import { useState, useEffect } from 'react'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Manrope', sans-serif; }

  .sol-hero {
    position: relative; min-height: 400px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 9rem 2rem 4rem; overflow: hidden;
  }
  .sol-hero-bg {
    position: absolute; inset: 0;
    background-image: url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1800&q=80');
    background-size: cover; background-position: center;
    filter: brightness(0.45) saturate(1.2);
  }
  .sol-hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(160deg, rgba(0,60,20,0.7) 0%, rgba(5,100,40,0.5) 100%);
  }
  .sol-hero-content { position: relative; z-index: 2; }
  .sol-hero .tag {
    font-size: 0.75rem; font-weight: 800; letter-spacing: 0.14em;
    color: #4ade80; text-transform: uppercase; margin-bottom: 1rem;
  }
  .sol-hero h1 {
    font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 800;
    color: #fff; letter-spacing: -0.02em; margin-bottom: 1.25rem;
  }
  .sol-hero p {
    font-size: 1.05rem; color: #d1fae5; max-width: 580px;
    margin: 0 auto; line-height: 1.7;
  }

/*reveal animation*/
  .reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.visible {
  opacity: 1;
  transform: none;
}


  .tab-bar {
    position: sticky; top: 68px; z-index: 100;
    background: #fff; border-bottom: 2px solid #e5e7eb;
    display: flex; gap: 0; overflow-x: auto;
    padding: 0 2.5rem;
  }
  .tab-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 1rem 1.5rem; font-size: 0.9rem; font-weight: 600;
    color: #6b7280; border: none; background: transparent; cursor: pointer;
    border-bottom: 3px solid transparent; margin-bottom: -2px;
    white-space: nowrap; font-family: 'Manrope', sans-serif;
    transition: color 0.2s, border-color 0.2s;
  }
  .tab-btn:hover { color: #16a34a; }
  .tab-btn.active { color: #16a34a; border-bottom-color: #22c55e; }
  .tab-btn .tab-icon { font-size: 16px; }

  .sol-main { max-width: 1200px; margin: 0 auto; padding: 4rem 2rem 5rem; }

  .sol-intro {
    display: flex; align-items: center; gap: 3rem;
    margin-bottom: 4rem; flex-wrap: wrap;
  }
  .sol-intro-text { flex: 1; min-width: 280px; }
  .sol-intro-text .cat-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: #f0fdf4; color: #16a34a;
    border: 1px solid #bbf7d0; font-size: 0.8rem; font-weight: 700;
    padding: 0.4rem 1rem; border-radius: 50px; margin-bottom: 1rem;
  }
  .sol-intro-text h2 {
    font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800;
    color: #0d1f0f; margin-bottom: 0.75rem; letter-spacing: -0.02em;
  }
  .sol-intro-text p { font-size: 0.95rem; color: #4b5563; line-height: 1.8; }
  .sol-intro-img {
    flex: 1; min-width: 280px; height: 280px; border-radius: 20px;
    overflow: hidden; background: #e8f5e9;
  }
  .sol-intro-img img { width: 100%; height: 100%; object-fit: cover; }

  .sol-features-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.25rem; margin-top: 1rem;
  }
  .sol-feature {
    background: #f9fafb; border: 1px solid #e5e7eb;
    border-radius: 16px; padding: 1.5rem;
    transition: border-color 0.2s, transform 0.2s;
  }
  .sol-feature:hover { border-color: #22c55e; transform: translateY(-3px); }
  .sol-feature-icon {
    width: 44px; height: 44px; background: #f0fdf4;
    border-radius: 12px; display: flex; align-items: center; justify-content: center;
    font-size: 20px; margin-bottom: 1rem;
  }
  .sol-feature h4 { font-size: 0.95rem; font-weight: 700; color: #0d1f0f; margin-bottom: 0.4rem; }
  .sol-feature p { font-size: 0.83rem; color: #6b7280; line-height: 1.6; }
`

const tabs = [
  { label: 'Cereals & Grains', icon: '🌾' },
  { label: 'Orchards & Arboriculture', icon: '🌳' },
  { label: 'Irrigated Vegetables', icon: '🥦' },
  { label: 'Greenhouses', icon: '🏗️' },
]

const solutions = {
  'Cereals & Grains': {
    badge: '🌾 Cereals & Grains',
    title: 'Maximize Yield Across the Hauts Plateaux',
    desc: 'Our IoT sensors are optimized for large-scale cereal and grain cultivation in the semi-arid regions of Algeria. Get real-time soil analytics, weather forecasts, and precision irrigation scheduling tailored for wheat, barley, and corn.',
    img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    features: [
      { icon: '🌡️', title: 'Soil Temperature Mapping', desc: 'Monitor field-wide temperature gradients to optimize planting windows and germination rates.' },
      { icon: '💧', title: 'Precision Irrigation', desc: 'Cut water usage by 40% with zone-based smart irrigation triggered by real sensor readings.' },
      { icon: '📊', title: 'Yield Prediction', desc: 'AI models trained on Algerian grain data forecast your harvest up to 6 weeks in advance.' },
      { icon: '🛰️', title: 'Satellite Integration', desc: 'NDVI satellite data overlaid with ground sensors for complete field health visibility.' },
    ],
  },
  'Orchards & Arboriculture': {
    badge: '🌳 Orchards',
    title: 'Smart Monitoring for Olive & Fruit Trees',
    desc: 'From olive groves in Tizi Ouzou to citrus orchards in Mitidja, our sensors track tree health, canopy humidity, and root zone moisture to maximize fruit quality and reduce disease risk.',
    img: 'https://images.unsplash.com/photo-1609763951640-c0d7bd98b257?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG9saXZlJTIwdHJlZXN8ZW58MHx8MHx8fDA%3D',
    features: [
      { icon: '🌿', title: 'Canopy Microclimate', desc: 'Sensors measure temperature and humidity inside the tree canopy for precise disease prevention.' },
      { icon: '🪲', title: 'Pest Early Warning', desc: 'CropCam AI detects common olive fly and aphid infestations before they spread.' },
      { icon: '💦', title: 'Root Zone Sensors', desc: 'Deep soil probes track moisture at root level for efficient drip irrigation scheduling.' },
      { icon: '📅', title: 'Harvest Planning', desc: 'Track fruit maturity indicators and plan harvest windows to peak quality.' },
    ],
  },
  'Irrigated Vegetables': {
    badge: '🥦 Vegetables',
    title: 'Data-Driven Vegetable Farming',
    desc: 'Intensive vegetable production demands precision. Our multi-zone sensor networks monitor each plot individually — tracking soil EC, moisture, and microclimate for tomatoes, peppers, potatoes, and more.',
    img: 'https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?w=800&q=80',
    features: [
      { icon: '⚗️', title: 'Soil EC Monitoring', desc: 'Track electrical conductivity to optimize fertilizer application and prevent salt buildup.' },
      { icon: '🌱', title: 'Multi-Zone Control', desc: 'Manage up to 32 independent irrigation zones from a single dashboard.' },
      { icon: '🧪', title: 'Fertigation Automation', desc: 'Automated fertilizer injection based on real-time plant nutrient demand.' },
      { icon: '📱', title: 'Mobile Alerts', desc: 'Instant alerts on your phone if any sensor goes out of optimal range.' },
    ],
  },
  'Greenhouses': {
    badge: '🏗️ Greenhouses',
    title: 'Full Climate Control for Greenhouses',
    desc: 'Turn your greenhouse into a perfectly controlled environment. AgriSense integrates with ventilation, heating, shading, and irrigation systems to maintain ideal growing conditions automatically.',
    img: 'https://about.oceanstatejoblot.com/wp-content/uploads/2024/02/SF_HowDoGreenhousesWork_Hero.webp',
    features: [
      { icon: '🌬️', title: 'Climate Automation', desc: 'Automatically open vents, run fans, or activate heaters based on real-time readings.' },
      { icon: '☀️', title: 'Light Management', desc: 'PAR sensors track photosynthetically active radiation and control shade systems.' },
      { icon: '💨', title: 'CO₂ Monitoring', desc: 'Maintain optimal CO₂ levels to maximize photosynthesis and growth rates.' },
      { icon: '📈', title: 'Growth Analytics', desc: 'Track plant growth KPIs over time and compare seasonal performance.' },
    ],
  },
}

export default function Solutions() {
  const [activeTab, setActiveTab] = useState('Cereals & Grains')
  const sol = solutions[activeTab]

    useEffect(() => {
      const els = document.querySelectorAll(".reveal")
  
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible")
          }
        })
      }, { threshold: 0.12 })
  
      els.forEach((el) => obs.observe(el))
  
      return () => obs.disconnect()
    }, [])

  return (
    <>
      <style>{styles}</style>
      

      {/* Hero */}
      <section className="sol-hero">
        <div className="sol-hero-bg" />
        <div className="sol-hero-overlay" />
        <div className="sol-hero-content">
          <div className="section-header reveal">
          <div className="tag">Solutions</div>
          <h1>Built for Every Algerian Farm</h1>
          <p>Whether you cultivate wheat in the Hauts Plateaux, date palms in Biskra, or manage a greenhouse in Bouira — AgriSense has a tailored solution for you.</p>
        </div>
        </div>
      </section>

      {/* Tab Bar */}
      <div className="tab-bar">
        {tabs.map(t => (
          <button
            key={t.label}
            className={`tab-btn ${activeTab === t.label ? 'active' : ''}`}
            onClick={() => setActiveTab(t.label)}
          >
            <span className="tab-icon">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="sol-main">
        <div className="sol-intro">
          <div className="sol-intro-text">
            <div className="cat-badge">{sol.badge}</div>
            <h2>{sol.title}</h2>
            <p>{sol.desc}</p>
          </div>
          <div className="sol-intro-img">
            <img src={sol.img} alt={activeTab} />
          </div>
        </div>

        <div className="sol-features-grid">
          {sol.features.map((f, i) => (
            <div key={i} className="sol-feature">
              <div className="sol-feature-icon">{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

   
    </>
  )
}
