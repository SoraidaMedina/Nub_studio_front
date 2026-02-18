// src/pages/private/admin/AdminDashboard.tsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  LogOut, 
  User, 
  Palette,
  Users,
  Package,
  TrendingUp,
  ShoppingBag,
  Settings,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { authService } from "../../../services/authService";
import "../../../styles/admin-dashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Verificar que sea admin
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // TODO: Verificar que el rol sea 'admin'
    const name = authService.getUserName();
    setUserName(name || 'Admin');
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <div className="admin-logo" onClick={() => navigate('/')}>
            <Palette size={28} />
            <span>NU-B ADMIN</span>
          </div>
        </div>

        <div className="header-right">
          <button className="view-site-btn" onClick={() => navigate('/')}>
            <Eye size={18} />
            <span>Ver Sitio</span>
          </button>
          
          <div className="user-menu-admin">
            <div className="user-avatar-admin">
              <User size={20} />
            </div>
            <span className="user-name-admin">{userName}</span>
          </div>

          <button onClick={handleLogout} className="logout-btn-admin">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <nav className="admin-nav">
          <a href="#" className="admin-nav-item active">
            <Package size={20} />
            <span>Dashboard</span>
          </a>
          <a href="#" className="admin-nav-item" onClick={(e) => { e.preventDefault(); navigate('/admin/obras'); }}>
            <Palette size={20} />
            <span>Obras</span>
          </a>
          <a href="#" className="admin-nav-item">
            <Users size={20} />
            <span>Artistas</span>
          </a>
          <a href="#" className="admin-nav-item">
            <ShoppingBag size={20} />
            <span>Ventas</span>
          </a>
          <a href="#" className="admin-nav-item">
            <Settings size={20} />
            <span>Configuración</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-content">
          {/* Page Header */}
          <div className="page-header-admin">
            <div>
              <h1>Panel de Administración</h1>
              <p>Gestiona tu galería de arte</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid-admin">
            <div className="stat-card-admin stat-primary">
              <div className="stat-icon-admin">
                <Palette size={28} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Obras</span>
                <span className="stat-value">0</span>
                <span className="stat-change positive">+0 esta semana</span>
              </div>
            </div>

            <div className="stat-card-admin stat-success">
              <div className="stat-icon-admin">
                <CheckCircle size={28} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Publicadas</span>
                <span className="stat-value">0</span>
                <span className="stat-change">Activas en galería</span>
              </div>
            </div>

            <div className="stat-card-admin stat-warning">
              <div className="stat-icon-admin">
                <Clock size={28} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Pendientes</span>
                <span className="stat-value">0</span>
                <span className="stat-change">Esperando aprobación</span>
              </div>
            </div>

            <div className="stat-card-admin stat-info">
              <div className="stat-icon-admin">
                <TrendingUp size={28} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Ventas Totales</span>
                <span className="stat-value">$0</span>
                <span className="stat-change positive">+$0 este mes</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-admin">
            <h2>Acciones Rápidas</h2>
            
            <div className="actions-grid-admin">
              <button 
                className="action-btn-admin action-primary"
                onClick={() => navigate('/admin/obras/crear')}
              >
                <div className="action-icon-wrap">
                  <Plus size={24} />
                </div>
                <h3>Nueva Obra</h3>
                <p>Agregar obra a la galería</p>
              </button>

              <button 
                className="action-btn-admin action-secondary"
                onClick={() => navigate('/admin/obras')}
              >
                <div className="action-icon-wrap">
                  <Eye size={24} />
                </div>
                <h3>Ver Obras</h3>
                <p>Gestionar catálogo</p>
              </button>

              <button className="action-btn-admin action-tertiary">
                <div className="action-icon-wrap">
                  <Users size={24} />
                </div>
                <h3>Artistas</h3>
                <p>Gestionar artistas</p>
              </button>

              <button className="action-btn-admin action-quaternary">
                <div className="action-icon-wrap">
                  <ShoppingBag size={24} />
                </div>
                <h3>Ventas</h3>
                <p>Ver pedidos</p>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="recent-activity-admin">
            <h2>Actividad Reciente</h2>
            
            <div className="activity-list">
              <div className="empty-state-admin">
                <AlertCircle size={48} />
                <h3>No hay actividad reciente</h3>
                <p>Las acciones realizadas aparecerán aquí</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}