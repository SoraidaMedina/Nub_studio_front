// src/pages/public/Home.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FeaturedWorks from "../../components/FeaturedWorks";
import LoginModal from "../../components/LoginModal";
import {
  ArrowRight, Star, Award, Sparkles, TrendingUp,
  Palette, Camera, Frame, Gem, MapPin, ShieldCheck
} from "lucide-react";

import heroMain from "../../assets/images/hero.jpg";
import obraImg1 from "../../assets/images/artesanas.webp";
import obraImg2 from "../../assets/images/OLLA.png";

const C = {
  orange: "#FF840E", pink: "#CC59AD", purple: "#8D4CCD",
  gold: "#FFC110", bg: "#0f0c1a",
  text: "#ffffff", muted: "rgba(255,255,255,0.55)",
};

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const CATEGORIAS = [
  { icon: <Palette size={28} />, label: "Pintura",    count: "120+ obras", color: C.orange, slug: "pintura" },
  { icon: <Camera size={28} />,  label: "Fotografía", count: "85+ obras",  color: C.pink,   slug: "fotografia" },
  { icon: <Frame size={28} />,   label: "Escultura",  count: "60+ obras",  color: C.purple, slug: "escultura" },
  { icon: <Gem size={28} />,     label: "Artesanía",  count: "200+ obras", color: C.gold,   slug: "artesania" },
];

export default function Home() {
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const categoriesSection = useInView();
  const featuredSection = useInView(0.1);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const openLogin = () => setLoginOpen(true);
  const closeLogin = () => setLoginOpen(false);

  return (
    // ── Wrapper que hace zoom-out cuando el modal está abierto ──
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: "'Outfit', sans-serif",
        overflowX: "hidden",
        // Zoom-out suave al abrir el modal
        transform: loginOpen ? "scale(0.96)" : "scale(1)",
        filter: loginOpen ? "brightness(0.5)" : "brightness(1)",
        transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), filter 0.35s ease",
        transformOrigin: "center center",
      }}
    >
      {/* ── Modal de Login (fuera del wrapper para no verse afectado) ── */}
      <LoginModal isOpen={loginOpen} onClose={closeLogin} />

      {/* ── HERO ── */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>

        <div style={{ position: "absolute", top: -150, left: -150, width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${C.pink}18, transparent 65%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}15, transparent 65%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", left: "40%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${C.orange}08, transparent 65%)`, pointerEvents: "none" }} />

        <div style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: "100px 48px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

          {/* Columna izquierda */}
          <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(32px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "7px 16px", borderRadius: 100, marginBottom: 28,
              background: `linear-gradient(135deg, ${C.orange}18, ${C.pink}12)`,
              border: `1px solid ${C.orange}35`,
              fontSize: 13, fontWeight: 600, color: C.orange,
              opacity: heroVisible ? 1 : 0,
              transition: "opacity 0.6s ease 0.1s",
            }}>
              <Sparkles size={14} /> Galería Certificada #1 en Hidalgo
            </div>

            <h1 style={{
              fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 900,
              color: C.text, lineHeight: 1.08, margin: "0 0 20px",
              opacity: heroVisible ? 1 : 0,
              transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
              transform: heroVisible ? "translateY(0)" : "translateY(20px)",
            }}>
              El{" "}
              <span style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.pink})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Arte Huasteco
              </span>
              <br />que{" "}
              <span style={{ position: "relative", display: "inline-block" }}>
                transforma
                <span style={{ position: "absolute", bottom: -4, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.orange}, ${C.pink})`, borderRadius: 2 }} />
              </span>
              {" "}espacios
            </h1>

            <p style={{
              fontSize: 16, color: C.muted, lineHeight: 1.75,
              margin: "0 0 36px", maxWidth: 480,
              opacity: heroVisible ? 1 : 0,
              transition: "opacity 0.7s ease 0.3s",
            }}>
              Conecta con la tradición vibrante y el talento extraordinario de artistas locales. Cada obra es una inversión cultural única que eleva tu hogar u oficina.
            </p>

            <div style={{ display: "flex", gap: 20, marginBottom: 36, opacity: heroVisible ? 1 : 0, transition: "opacity 0.7s ease 0.4s" }}>
              {[
                { icon: <Star size={18} />,      title: "100% Auténtico", desc: "Certificado oficial",  color: C.gold   },
                { icon: <Award size={18} />,     title: "Artistas Elite", desc: "Selección curada",     color: C.orange },
                { icon: <TrendingUp size={18} />, title: "Valor en Alza", desc: "Inversión cultural",   color: C.pink   },
              ].map(({ icon, title, desc, color }) => (
                <div key={title} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>{icon}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{title}</div>
                    <div style={{ fontSize: 11.5, color: C.muted }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", opacity: heroVisible ? 1 : 0, transition: "opacity 0.7s ease 0.5s" }}>
              <button
                onClick={() => navigate("/catalogo")}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 14, background: `linear-gradient(135deg, ${C.orange}, ${C.pink})`, border: "none", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif", boxShadow: `0 10px 30px ${C.orange}40`, transition: "transform .2s, box-shadow .2s" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = `0 16px 40px ${C.orange}50`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.boxShadow = `0 10px 30px ${C.orange}40`; }}
              >
                Explorar Colección <ArrowRight size={18} strokeWidth={2.5} />
              </button>

              {/* ← Este botón dispara el zoom-out + modal */}
              <button
                onClick={openLogin}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 14, background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "background .2s, border-color .2s" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.1)"; el.style.borderColor = "rgba(255,255,255,0.2)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.06)"; el.style.borderColor = "rgba(255,255,255,0.12)"; }}
              >
                Iniciar sesión
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 24, opacity: heroVisible ? 1 : 0, transition: "opacity 0.7s ease 0.6s" }}>
              <div style={{ display: "flex", gap: 3 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={C.gold} color={C.gold} />)}
              </div>
              <span style={{ fontSize: 13, color: C.muted }}>5.0 · 1,247 valoraciones verificadas</span>
            </div>
          </div>

          {/* Columna derecha — imágenes */}
          <div style={{ position: "relative", height: 580, opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateX(0)" : "translateX(40px)", transition: "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 320, height: 380, borderRadius: 24, overflow: "hidden", border: "2px solid rgba(255,255,255,0.1)", boxShadow: `0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px ${C.orange}20` }}>
              <img src={heroMain} alt="Arte Huasteco" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", top: 16, left: 16, display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 100, background: "rgba(15,12,26,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)", fontSize: 12, fontWeight: 600, color: C.text }}>
                <Sparkles size={12} color={C.gold} /> Obra Destacada
              </div>
              <div style={{ position: "absolute", bottom: 16, left: 16, right: 16, padding: "8px 14px", borderRadius: 10, background: "rgba(15,12,26,0.9)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 13, fontWeight: 700, color: C.text }}>
                Desde $2,500 MXN
              </div>
            </div>
            <div style={{ position: "absolute", top: 30, left: -10, width: 150, height: 170, borderRadius: 18, overflow: "hidden", border: "2px solid rgba(255,255,255,0.08)", boxShadow: `0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px ${C.pink}15`, animation: "floatA 6s ease-in-out infinite" }}>
              <img src={obraImg1} alt="Artesanía" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ position: "absolute", bottom: 20, right: -20, width: 160, height: 185, borderRadius: 18, overflow: "hidden", border: "2px solid rgba(255,255,255,0.08)", boxShadow: `0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px ${C.purple}20`, animation: "floatB 7s ease-in-out infinite" }}>
              <img src={obraImg2} alt="Colección" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ position: "absolute", top: 80, right: 30, width: 60, height: 60, borderRadius: "50%", background: `${C.orange}20`, border: `1px solid ${C.orange}40`, animation: "pulse 3s ease-in-out infinite" }} />
            <div style={{ position: "absolute", bottom: 100, left: 20, width: 40, height: 40, borderRadius: "50%", background: `${C.pink}20`, border: `1px solid ${C.pink}40`, animation: "pulse 4s ease-in-out infinite 1s" }} />
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(15,12,26,0.8)", backdropFilter: "blur(20px)", opacity: heroVisible ? 1 : 0, transition: "opacity 0.8s ease 0.7s" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 48px", display: "flex", justifyContent: "center", gap: 80 }}>
            {[{ num: "500+", label: "Obras Premium" }, { num: "50+", label: "Artistas Elite" }, { num: "98%", label: "Satisfacción" }, { num: "5 años", label: "De experiencia" }].map(({ num, label }, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 900, background: `linear-gradient(135deg, ${C.orange}, ${C.pink})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{num}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORÍAS ── */}
      <section ref={categoriesSection.ref} style={{ padding: "100px 48px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56, opacity: categoriesSection.inView ? 1 : 0, transform: categoriesSection.inView ? "translateY(0)" : "translateY(24px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, background: `${C.purple}18`, border: `1px solid ${C.purple}35`, fontSize: 12, fontWeight: 600, color: C.purple, marginBottom: 16 }}>
            <MapPin size={12} /> Huasteca Hidalguense
          </div>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 900, color: C.text, margin: "0 0 12px" }}>
            Explora por{" "}
            <span style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.pink})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>categoría</span>
          </h2>
          <p style={{ fontSize: 15, color: C.muted, margin: 0 }}>Cada disciplina cuenta una historia diferente</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {CATEGORIAS.map(({ icon, label, count, color, slug }, i) => (
            <div key={slug} onClick={() => navigate(`/catalogo?categoria=${slug}`)}
              style={{ padding: "36px 24px", borderRadius: 20, cursor: "pointer", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", textAlign: "center", opacity: categoriesSection.inView ? 1 : 0, transform: categoriesSection.inView ? "translateY(0)" : "translateY(32px)", transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s, background .2s, border-color .2s` }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${color}10`; el.style.borderColor = `${color}35`; el.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.03)"; el.style.borderColor = "rgba(255,255,255,0.07)"; el.style.transform = "translateY(0)"; }}
            >
              <div style={{ width: 64, height: 64, borderRadius: 18, background: `${color}18`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color }}>{icon}</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: C.text, marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 13, color: C.muted }}>{count}</div>
              <ArrowRight size={16} color={color} style={{ marginTop: 14, opacity: 0.6 }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── OBRAS DESTACADAS ── */}
      <div ref={featuredSection.ref} style={{ opacity: featuredSection.inView ? 1 : 0, transform: featuredSection.inView ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
        <FeaturedWorks />
      </div>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: "100px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, ${C.pink}10, transparent 65%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 640, margin: "0 auto", position: "relative" }}>
          <ShieldCheck size={40} color={C.orange} style={{ marginBottom: 20 }} />
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 900, color: C.text, margin: "0 0 16px" }}>
            Arte auténtico,{" "}
            <span style={{ background: `linear-gradient(135deg, ${C.orange}, ${C.pink})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>garantizado</span>
          </h2>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.75, marginBottom: 36 }}>
            Cada obra viene con certificado de autenticidad y soporte completo de nuestro equipo. Invierte con confianza en el arte de la Huasteca.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/catalogo")}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 14, background: `linear-gradient(135deg, ${C.orange}, ${C.pink})`, border: "none", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif", boxShadow: `0 10px 30px ${C.orange}40`, transition: "transform .2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              Ver catálogo completo <ArrowRight size={18} />
            </button>
            <button onClick={openLogin}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 14, background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "background .2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.09)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
            >
              Crear cuenta gratis
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        @keyframes floatA { 0%,100%{transform:translateY(0px) rotate(-2deg)} 50%{transform:translateY(-14px) rotate(-1deg)} }
        @keyframes floatB { 0%,100%{transform:translateY(0px) rotate(2deg)} 50%{transform:translateY(-10px) rotate(1deg)} }
        @keyframes pulse  { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.15);opacity:1} }
        @media (max-width: 900px) {
          section > div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          section > div[style*="repeat(4, 1fr)"] { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 600px) {
          section > div[style*="repeat(4, 1fr)"], section > div[style*="repeat(2, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}