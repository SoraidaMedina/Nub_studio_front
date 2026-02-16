// src/pages/public/Home.tsx - VERSIÓN PREMIUM VIBRANTE
import FeaturedWorks from "../../components/FeaturedWorks";
import { ArrowRight, Star, Award, Sparkles, TrendingUp } from "lucide-react";
import "../../styles/home.css";

// Importar imágenes desde assets
import heroMain from "../../assets/images/hero.jpg";
import obraImg1 from "../../assets/images/artesanas.webp";
import obraImg2 from "../../assets/images/OLLA.png";

export default function Home() {
  return (
    <>
      {/* Hero Section - Premium Vibrante */}
      <section className="hero hero-premium">
        {/* Efectos de fondo animados */}
        <div className="hero-background-effects">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>

        <div className="hero-split-left">
          <div className="hero-content-wrapper">
            <div className="hero-badge-premium">
              <Sparkles size={16} />
              <span>Galería de Arte Certificada #1 en Hidalgo</span>
            </div>
            
            <h1 className="hero-title-premium">
              El <span className="gradient-text">Arte Huasteco</span>
              <br />
              que{" "}
              <span className="highlight-box">transforma</span>{" "}
              espacios
            </h1>
            
            <p className="hero-description-premium">
              Conecta con la tradición vibrante y el talento extraordinario 
              de artistas locales. Cada obra es una inversión cultural única 
              que eleva tu hogar u oficina.
            </p>

            <div className="hero-value-props">
              <div className="value-prop">
                <div className="prop-icon">
                  <Star size={20} />
                </div>
                <div className="prop-content">
                  <h4>100% Auténtico</h4>
                  <p>Certificado de originalidad</p>
                </div>
              </div>
              <div className="value-prop">
                <div className="prop-icon">
                  <Award size={20} />
                </div>
                <div className="prop-content">
                  <h4>Artistas Elite</h4>
                  <p>Selección curada</p>
                </div>
              </div>
              <div className="value-prop">
                <div className="prop-icon">
                  <TrendingUp size={20} />
                </div>
                <div className="prop-content">
                  <h4>Valor en Alza</h4>
                  <p>Inversión cultural</p>
                </div>
              </div>
            </div>
            
            <div className="hero-cta-group">
              <button className="hero-btn-premium">
                Explorar Colección Premium
                <ArrowRight size={20} strokeWidth={2.5} />
              </button>
              <div className="trust-indicator">
                <div className="trust-stars">
                  <Star size={14} fill="#FFD700" color="#FFD700" />
                  <Star size={14} fill="#FFD700" color="#FFD700" />
                  <Star size={14} fill="#FFD700" color="#FFD700" />
                  <Star size={14} fill="#FFD700" color="#FFD700" />
                  <Star size={14} fill="#FFD700" color="#FFD700" />
                </div>
                <span>5.0 • 1,247 valoraciones</span>
              </div>
            </div>

            <div className="hero-stats-premium">
              <div className="stat-premium">
                <span className="stat-number-premium">500+</span>
                <span className="stat-label-premium">Obras Premium</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-premium">
                <span className="stat-number-premium">50+</span>
                <span className="stat-label-premium">Artistas Elite</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-premium">
                <span className="stat-number-premium">98%</span>
                <span className="stat-label-premium">Satisfacción</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-split-right">
          <div className="hero-visual-premium">
            {/* Imagen principal con marco premium */}
            <div className="visual-main-premium">
              <div className="premium-frame"></div>
              <img src={heroMain} alt="Arte Huasteco Premium" />
              <div className="visual-badge-top">
                <Sparkles size={14} />
                <span>Obra Destacada</span>
              </div>
              <div className="visual-badge-bottom">
                <span className="price-tag">Desde $2,500 MXN</span>
              </div>
            </div>
            
            {/* Imágenes flotantes con efecto 3D */}
            <div className="visual-float-premium visual-float-1">
              <div className="float-glow"></div>
              <img src={obraImg1} alt="Artesanía Premium" />
            </div>
            <div className="visual-float-premium visual-float-2">
              <div className="float-glow"></div>
              <img src={obraImg2} alt="Colección Exclusiva" />
            </div>

            {/* Elementos decorativos vibrantes */}
            <div className="vibrant-shape shape-1"></div>
            <div className="vibrant-shape shape-2"></div>
            <div className="vibrant-shape shape-3"></div>
          </div>
        </div>
      </section>

      <FeaturedWorks />
    </>
  );
}