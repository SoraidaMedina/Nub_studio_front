// src/pages/private/Dashboard.tsx - VERSIÓN WEB PREMIUM
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  LogOut, 
  User, 
  ShoppingBag, 
  Heart, 
  Settings,
  Palette,
  TrendingUp,
  Sparkles,
  Eye,
  Star,
  ChevronRight,
  Award,
  Clock,
  Camera
} from "lucide-react";
import { authService } from "../../services/authService";
import "../../styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const name = authService.getUserName();
    const email = authService.getUserEmail();
    
    setUserName(name || 'Usuario');
    setUserEmail(email || '');
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-modern">
      {/* Header Floating */}
      <header className="dashboard-header-modern">
        <div className="header-left-modern">
          <div className="logo-modern" onClick={() => navigate('/')}>
            <Palette size={28} />
            <span>NU-B STUDIO</span>
          </div>
        </div>

        <div className="header-right-modern">
          <button className="explore-btn" onClick={() => navigate('/')}>
            <Sparkles size={18} />
            <span>Explorar Galería</span>
          </button>
          
          <div className="user-menu-modern">
            <div className="user-avatar-modern">
              <User size={20} />
            </div>
            <div className="user-info-modern">
              <span className="user-name-modern">{userName}</span>
              <span className="user-role-modern">Coleccionista</span>
            </div>
          </div>

          <button onClick={handleLogout} className="logout-btn-modern">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content-modern">
        {/* Hero Section */}
        <section className="hero-dashboard">
          <div className="hero-glow hero-glow-1"></div>
          <div className="hero-glow hero-glow-2"></div>
          
          <div className="hero-content-dash">
            <div className="welcome-badge">
              <Sparkles size={16} />
              <span>Tu colección personal</span>
            </div>
            
            <h1 className="hero-title-dash">
              Hola, <span className="gradient-text-dash">{userName}</span>
            </h1>
            
            <p className="hero-subtitle-dash">
              Descubre, colecciona y vive el arte de la Huasteca
            </p>

            <div className="hero-stats-modern">
              <div className="stat-modern">
                <div className="stat-icon-modern stat-orange">
                  <ShoppingBag size={20} />
                </div>
                <div className="stat-data">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Obras adquiridas</span>
                </div>
              </div>

              <div className="stat-modern">
                <div className="stat-icon-modern stat-pink">
                  <Heart size={20} />
                </div>
                <div className="stat-data">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Favoritos</span>
                </div>
              </div>

              <div className="stat-modern">
                <div className="stat-icon-modern stat-purple">
                  <Award size={20} />
                </div>
                <div className="stat-data">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Puntos VIP</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-visual-dash">
            <div className="floating-card card-1">
              <img src="https://picsum.photos/300/400?random=1" alt="Arte" />
              <div className="card-overlay">
                <span className="card-badge">Popular</span>
              </div>
            </div>
            <div className="floating-card card-2">
              <img src="https://picsum.photos/300/400?random=2" alt="Arte" />
              <div className="card-overlay">
                <span className="card-badge">Nuevo</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions-section">
          <h2 className="section-title-modern">
            <Sparkles size={24} />
            Accesos Rápidos
          </h2>

          <div className="actions-grid">
            <button className="action-card action-primary">
              <div className="action-icon">
                <Camera size={32} />
              </div>
              <h3>Explorar Obras</h3>
              <p>Descubre nuevas piezas únicas</p>
              <ChevronRight size={20} className="action-arrow" />
            </button>

            <button className="action-card action-secondary" onClick={() => navigate('/')}>
              <div className="action-icon">
                <Heart size={32} />
              </div>
              <h3>Mis Favoritos</h3>
              <p>Obras que te encantan</p>
              <ChevronRight size={20} className="action-arrow" />
            </button>

            <button className="action-card action-tertiary">
              <div className="action-icon">
                <ShoppingBag size={32} />
              </div>
              <h3>Mis Pedidos</h3>
              <p>Rastrea tus compras</p>
              <ChevronRight size={20} className="action-arrow" />
            </button>

            <button className="action-card action-quaternary">
              <div className="action-icon">
                <User size={32} />
              </div>
              <h3>Mi Perfil</h3>
              <p>Configurar cuenta</p>
              <ChevronRight size={20} className="action-arrow" />
            </button>
          </div>
        </section>

        {/* Recomendaciones */}
        <section className="recommendations-section">
          <div className="section-header-modern">
            <div>
              <h2 className="section-title-modern">
                <Star size={24} fill="#FFD700" color="#FFD700" />
                Recomendado para ti
              </h2>
              <p className="section-subtitle-modern">
                Obras seleccionadas según tus preferencias
              </p>
            </div>
            <button className="view-all-btn">
              Ver todas
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="recommendations-grid">
            {[1, 2, 3].map((item) => (
              <div key={item} className="artwork-card-modern">
                <div className="artwork-image-container">
                  <img 
                    src={`https://picsum.photos/400/500?random=${item + 10}`} 
                    alt={`Obra ${item}`}
                    className="artwork-image"
                  />
                  <button className="favorite-btn-card">
                    <Heart size={20} />
                  </button>
                  <div className="artwork-overlay">
                    <button className="quick-view-btn">
                      <Eye size={18} />
                      Vista Rápida
                    </button>
                  </div>
                </div>
                
                <div className="artwork-info">
                  <span className="artwork-category">Fotografía</span>
                  <h3 className="artwork-title">Amanecer Huasteco {item}</h3>
                  <div className="artwork-artist">
                    <div className="artist-avatar">
                      <User size={16} />
                    </div>
                    <span>Juan Pérez</span>
                  </div>
                  <div className="artwork-footer">
                    <span className="artwork-price">$2,566 MXN</span>
                    <button className="add-to-cart-btn">
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Activity Feed */}
        <section className="activity-section-modern">
          <h2 className="section-title-modern">
            <Clock size={24} />
            Actividad Reciente
          </h2>

          <div className="empty-state-modern">
            <div className="empty-icon">
              <Palette size={64} />
            </div>
            <h3>Tu viaje artístico comienza aquí</h3>
            <p>
              Aún no has realizado ninguna actividad. 
              <br />
              Explora nuestra galería y encuentra la obra perfecta para ti.
            </p>
            <button className="cta-btn-modern" onClick={() => navigate('/')}>
              <Sparkles size={20} />
              Explorar Galería
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}