import { useEffect } from 'react'

// ─── SVG ICON SYSTEM ─────────────────────────────────────────────────────────
const Icons = {
  // Value check
  check: 'M4.5 12.75l6 6 9-13.5',
  // Mission cards
  globe:    'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.029 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.029-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3 12c0 .778.099 1.533.284 2.253',
  lightbulb:'M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18',
  handshake:['M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'],
  leaf:     'M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.716.607 5.18 1.64',
  // Team roles
  code:     ['M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5'],
  flask:    ['M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5'],
  sprout:   'M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M1 12h1m20 0h1M4.22 19.778l.707-.707M18.364 5.636l.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z',
  briefcase:'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z',
  // Socials (used in footer reference)
  mapPin:   ['M15 10.5a3 3 0 11-6 0 3 3 0 016 0z', 'M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z'],
}

const Ic = ({ name, size = 20, style = {}, strokeWidth = 1.5 }) => {
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
  .about-page { background: #b5edb9; min-height: 100vh; padding-top: 68px; }

  /* HERO */
  .about-hero {
    background: linear-gradient(160deg, #afe6b4 0%, #f0fdf4 100%);
    padding: 5rem 2.5rem 4rem;
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center; gap: 4rem; flex-wrap: wrap;
  }
  .about-hero-text { flex: 1; min-width: 280px; }
  .about-hero-text .tag {
    font-size: 0.72rem; font-weight: 800; letter-spacing: 0.12em;
    color: #16a34a; text-transform: uppercase; margin-bottom: 1rem;
  }
  .about-hero-text h1 {
    font-size: clamp(2rem, 4vw, 3rem); font-weight: 800;
    color: #0d1f0f; letter-spacing: -0.03em; line-height: 1.15;
    margin-bottom: 1.25rem;
  }
  .about-hero-text p {
    font-size: 0.97rem; color: #374151; line-height: 1.8; margin-bottom: 1rem;
  }
  .about-hero-img {
    flex: 1; min-width: 300px; height: 380px;
    border-radius: 24px; overflow: hidden;
  }
  .about-hero-img img {
    width: 100%; height: 100%; object-fit: cover; border-radius: 20px;
  }

  /* STATS */
  .about-stats {
    background: #fff; padding: 3rem 2.5rem;
    border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;
  }
  .stats-inner {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 2rem; text-align: center;
  }
  .stat-item .num { font-size: 2.2rem; font-weight: 800; color: #16a34a; letter-spacing: -0.03em; }
  .stat-item .label { font-size: 0.85rem; color: #6b7280; margin-top: 4px; font-weight: 500; }

  /* Reveal */
  .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .reveal.visible { opacity: 1; transform: none; }

  /* MISSION */
  .about-mission {
    max-width: 1200px; margin: 0 auto; padding: 5rem 2.5rem;
    display: flex; gap: 4rem; align-items: center; flex-wrap: wrap;
  }
  .mission-text { flex: 1; min-width: 280px; }
  .mission-text .tag {
    font-size: 0.72rem; font-weight: 800; letter-spacing: 0.12em;
    color: #16a34a; text-transform: uppercase; margin-bottom: 1rem;
  }
  .mission-text h2 {
    font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800;
    color: #0d1f0f; margin-bottom: 1rem; letter-spacing: -0.02em;
  }
  .mission-text p { font-size: 0.95rem; color: #4b5563; line-height: 1.8; margin-bottom: 1rem; }
  .values-list { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.5rem; }
  .value-item { display: flex; align-items: flex-start; gap: 12px; }
  .value-check {
    width: 22px; height: 22px; border-radius: 50%;
    background: #f0fdf4; border: 2px solid #22c55e;
    display: flex; align-items: center; justify-content: center;
    color: #22c55e; flex-shrink: 0; margin-top: 2px;
  }
  .value-item span { font-size: 0.9rem; color: #374151; font-weight: 500; }
  .mission-cards { flex: 1; min-width: 280px; display: flex; flex-direction: column; gap: 1rem; }
  .mission-card {
    background: #fff; border: 1px solid #e5e7eb; border-radius: 16px;
    padding: 1.25rem 1.5rem; display: flex; gap: 14px; align-items: flex-start;
    transition: border-color 0.2s, transform 0.2s;
  }
  .mission-card:hover { border-color: #22c55e; transform: translateX(4px); }
  .mission-card-icon {
    width: 42px; height: 42px; border-radius: 12px;
    background: #f0fdf4; display: flex; align-items: center; justify-content: center;
    color: #16a34a; flex-shrink: 0;
  }
  .mission-card h4 { font-size: 0.95rem; font-weight: 700; color: #0d1f0f; margin-bottom: 3px; }
  .mission-card p { font-size: 0.82rem; color: #6b7280; line-height: 1.5; }

  /* TEAM */
  .about-team {
    background: #fff; padding: 5rem 2.5rem;
    border-top: 1px solid #e5e7eb;
  }
  .team-inner { max-width: 1200px; margin: 0 auto; }
  .section-header { text-align: center; margin-bottom: 3rem; }
  .section-header .tag {
    font-size: 0.72rem; font-weight: 800; letter-spacing: 0.12em;
    color: #16a34a; text-transform: uppercase; margin-bottom: 0.75rem;
  }
  .section-header h2 {
    font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800;
    color: #0d1f0f; letter-spacing: -0.02em;
  }
  .team-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
  }
  .team-card {
    background: #f9fafb; border: 1px solid #e5e7eb;
    border-radius: 20px; overflow: hidden; text-align: center;
    transition: box-shadow 0.3s, transform 0.3s;
  }
  .team-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.08); transform: translateY(-4px); }
  .team-avatar {
    height: 160px; background: linear-gradient(135deg, #dcfce7, #bbf7d0);
    display: flex; align-items: center; justify-content: center;
  }
  .team-avatar-icon {
    width: 80px; height: 80px; border-radius: 50%;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    color: #16a34a;
    box-shadow: 0 10px 25px rgba(34,197,94,0.15), inset 0 1px 1px rgba(255,255,255,0.8);
    transition: all 0.3s ease;
  }
  .team-card:hover .team-avatar-icon {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 18px 35px rgba(34,197,94,0.22);
  }
  .team-info { padding: 1.25rem; }
  .team-info h4 { font-size: 0.95rem; font-weight: 700; color: #0d1f0f; margin-bottom: 3px; }
  .team-info .role { font-size: 0.8rem; color: #22c55e; font-weight: 600; margin-bottom: 0.5rem; }
  .team-info p { font-size: 0.8rem; color: #6b7280; line-height: 1.5; }
`

const team = [
  { iconName: 'briefcase', name: 'Zouidi Lyna', role: 'CEO & Co-Founder', bio: 'Agricultural engineer & entrepreneur from Bouira with 5 years in tech.' },
  { iconName: 'code',      name: '',           role: 'CTO',              bio: 'Embedded systems expert, built the LoRa sensor stack from scratch.' },
  { iconName: 'flask',     name: '',           role: 'Head of Agronomy', bio: 'PhD in soil science from ENSA Alger. Leads our crop intelligence research.' },
  { iconName: 'briefcase', name: '',           role: 'Head of Sales',    bio: 'Manages field partnerships across 18 wilayas in northern Algeria.' },
]

const missionCards = [
  { iconName: 'globe',      title: 'Local First',      desc: 'Built, shipped, and supported from within Algeria. No import delays.' },
  { iconName: 'lightbulb',  title: 'Innovative',       desc: 'We combine LoRa, AI, and satellite data in one integrated platform.' },
  { iconName: 'handshake',  title: 'Farmer-Centric',   desc: 'Every feature is designed with direct input from real Algerian farmers.' },
  { iconName: 'leaf',       title: 'Sustainable',      desc: 'Solar-powered hardware helps farms reduce both cost and carbon footprint.' },
]

const values = [
  'Made and assembled in Algeria',
  'Priced for small and medium farms',
  'Arabic & French language support',
  'On-site installation included',
  'Local after-sales service',
]

export default function About() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.12 })
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <style>{styles}</style>
      <div className="about-page">

        {/* Hero */}
        <div className="about-hero">
          <div className="about-hero-text">
            <div className="section-header reveal">
              <div className="tag">About Us</div>
              <h1>Algerian Innovation for Algerian Farmers</h1>
              <p>AgriSense DZ was born in 2026 from a simple belief: Algerian farmers deserve world-class technology, built by people who understand their land, their challenges, and their culture.</p>
              <p>We are a team of engineers, agronomists, and data scientists based in Bouira — committed to make smart agriculture accessible, affordable, and impactful across every wilaya.</p>
            </div>
          </div>
          <div className="reveal">
            <div className="about-hero-img">
              <img
                src="https://img.freepik.com/free-photo/portrait-male-farmer-holding-freshly-harvested-strawberry-fruit-field_342744-470.jpg?semt=ais_rp_50_assets&w=740&q=80"
                alt="Algerian farmer in field"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="about-stats">
          <div className="stats-inner">
            {[
              { num: '2026', label: 'Founded in Bouira' },
              { num: '500+', label: 'Farms Connected' },
              { num: '69',   label: 'Wilayas Reached' },
              { num: '40%',  label: 'Average Water Saving' },
              { num: '24/7', label: 'Live Monitoring' },
            ].map(s => (
              <div key={s.num} className="stat-item">
                <div className="num">{s.num}</div>
                <div className="label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div className="about-mission">
          <div className="mission-text">
            <div className="reveal">
              <div className="tag">Our Mission</div>
              <h2>Technology built for Algeria's land</h2>
              <p>We build every device with the specific challenges of Algerian agriculture in mind — extreme heat, water scarcity, remote terrain, and limited infrastructure.</p>
              <p>Our sensors work without WiFi, run on solar power, and connect via LoRa networks we help install ourselves.</p>
            </div>
            <div className="values-list">
              {values.map(v => (
                <div key={v} className="value-item">
                  <div className="value-check">
                    <Ic name="check" size={12} strokeWidth={2.5} />
                  </div>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal">
            <div className="mission-cards">
              {missionCards.map((c, i) => (
                <div key={i} className="mission-card">
                  <div className="mission-card-icon">
                    <Ic name={c.iconName} size={20} />
                  </div>
                  <div>
                    <h4>{c.title}</h4>
                    <p>{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="about-team">
          <div className="team-inner">
            <div className="section-header">
              <div className="tag">Our Team</div>
              <h2>The people behind AgriSense DZ</h2>
            </div>
            <div className="team-grid">
              {team.map((t, i) => (
                <div key={i} className="team-card">
                  <div className="team-avatar">
                    <div className="team-avatar-icon">
                      <Ic name={t.iconName} size={36} />
                    </div>
                  </div>
                  <div className="team-info">
                    <h4>{t.name || 'Team Member'}</h4>
                    <div className="role">{t.role}</div>
                    <p>{t.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}