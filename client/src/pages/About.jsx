import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import farmerImg from '../assets/farmer.jpg'
import { useEffect, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Manrope', sans-serif; }

  .about-page { background: #b5edb9 ; min-height: 100vh; padding-top: 68px; }

  /* ── HERO ── */
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
  .about-hero-img img { width: 100%; height: 100%; object-fit: cover; }
.about-hero-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
}
  /* ── STATS ── */
  .about-stats {
    background: #fff; padding: 3rem 2.5rem;
    border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;
  }
  .stats-inner {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 2rem; text-align: center;
  }
  .stat-item .num {
    font-size: 2.2rem; font-weight: 800; color: #16a34a;
    letter-spacing: -0.03em;
  }
  .stat-item .label {
    font-size: 0.85rem; color: #6b7280; margin-top: 4px; font-weight: 500;
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

  /* ── MISSION ── */
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
    font-size: 11px; color: #22c55e; flex-shrink: 0; margin-top: 2px;
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
    font-size: 20px; flex-shrink: 0;
  }
  .mission-card h4 { font-size: 0.95rem; font-weight: 700; color: #0d1f0f; margin-bottom: 3px; }
  .mission-card p { font-size: 0.82rem; color: #6b7280; line-height: 1.5; }

  /* ── TEAM ── */
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
    height: 180px; background: linear-gradient(135deg, #bbf7d0, #86efac);
    display: flex; align-items: center; justify-content: center; font-size: 3.5rem;
  }
  .team-info { padding: 1.25rem; }
  .team-info h4 { font-size: 0.95rem; font-weight: 700; color: #0d1f0f; margin-bottom: 3px; }
  .team-info .role { font-size: 0.8rem; color: #22c55e; font-weight: 600; margin-bottom: 0.5rem; }
  .team-info p { font-size: 0.8rem; color: #6b7280; line-height: 1.5; }
`

const team = [
  { emoji: '👩‍💻', name: 'Zouidi Lyna ', role: 'CEO & Co-Founder', bio: 'Agricultural engineer & entrepreneur from Bouira with 5 years in tech.' },
  { emoji: '👩‍🔬', name: '', role: 'CTO', bio: 'Embedded systems expert, built the LoRa sensor stack from scratch.' },
  { emoji: '👨‍🌾', name: '', role: 'Head of Agronomy', bio: 'PhD in soil science from ENSA Alger. Leads our crop intelligence research.' },
  { emoji: '👩‍💼', name: '', role: 'Head of Sales', bio: 'Manages field partnerships across 18 wilayas in northern Algeria.' },
]

export default function About() {

  useEffect(() => {
    // Scroll reveal
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
      <Navbar />

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
          <div className="mission-tex reveal">
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
              { num: '69', label: 'Wilayas Reached' },
              { num: '40%', label: 'Average Water Saving' },
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
            <div className="mission-tex reveal">
            <div className="tag">Our Mission</div>
            <h2>Technology built for Algeria's land</h2>
            <p>We build every device with the specific challenges of Algerian agriculture in mind — extreme heat, water scarcity, remote terrain, and limited infrastructure.</p>
            <p>Our sensors work without WiFi, run on solar power, and connect via LoRa networks we help install ourselves.</p>
           </div>
            <div className="values-list">

              {['Made and assembled in Algeria', 'Priced for small and medium farms', 'Arabic & French language support', 'On-site installation included', 'Local after-sales service'].map(v => (
                <div key={v} className="value-item">
                  <div className="value-check">✓</div>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>
           <div className="mission-tex reveal">
          <div className="mission-cards">
            {[
              { icon: '🌍', title: 'Local First', desc: 'Built, shipped, and supported from within Algeria. No import delays.' },
              { icon: '💡', title: 'Innovative', desc: 'We combine LoRa, AI, and satellite data in one integrated platform.' },
              { icon: '🤝', title: 'Farmer-Centric', desc: 'Every feature is designed with direct input from real Algerian farmers.' },
              { icon: '♻️', title: 'Sustainable', desc: 'Solar-powered hardware helps farms reduce both cost and carbon footprint.' },
            ].map((c, i) => (
              <div key={i} className="mission-card">
                <div className="mission-card-icon">{c.icon}</div>
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
                  <div className="team-avatar">{t.emoji}</div>
                  <div className="team-info">
                    <h4>{t.name}</h4>
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
