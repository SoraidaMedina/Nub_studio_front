// src/layout/Navbar.tsx
import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home, Users, BookOpen, Info, Mail, LogIn, Menu, X,
  User, ShoppingBag, Heart, Settings, LogOut, ChevronDown
} from "lucide-react";
import logoImg from "../assets/images/logo.png";
import "../styles/layout.css";
import { authService } from "../services/authService";

const LINKS = [
  { to: "/",               icon: Home,     label: "Galería"        },
  { to: "/artistas",       icon: Users,    label: "Artistas"       },
  { to: "/blog",           icon: BookOpen, label: "Blog"           },
  { to: "/sobre-nosotros", icon: Info,     label: "Sobre nosotros" },
  { to: "/contacto",       icon: Mail,     label: "Contacto"       },
];

const C = { orange: "#FF840E", pink: "#CC59AD" };

export default function Navbar() {
  const [open, setOpen]           = useState(false);
  const [dropOpen, setDropOpen]   = useState(false);
  const location                  = useLocation();
  const navigate                  = useNavigate();
  const dropRef                   = useRef<HTMLDivElement>(null);

  const isLoggedIn = authService.isAuthenticated();
  const userName   = authService.getUserName() || "Mi cuenta";
  const userEmail  = authService.getUserEmail() || "";
  const userRol    = localStorage.getItem("userRol") || "cliente";

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setDropOpen(false);
    setOpen(false);
    navigate("/");
    // Forzar re-render
    window.location.reload();
  };

  // Iniciales del usuario para el avatar
  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <div className="navbar-brand">
          <img src={logoImg} alt="Nu-B Studio Logo" className="navbar-logo" />
          <span className="logo">NU-B STUDIO</span>
        </div>

        {/* Links desktop */}
        <ul className="nav-links nav-links-desktop">
          {LINKS.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <Link to={to} className={location.pathname === to ? "active" : ""}>
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            </li>
          ))}

          {/* ── Usuario NO logueado ── */}
          {!isLoggedIn && (
            <li>
              <Link to="/login" className="nav-login-btn">
                <LogIn size={18} />
                <span>Iniciar sesión</span>
              </Link>
            </li>
          )}

          {/* ── Usuario logueado: dropdown ── */}
          {isLoggedIn && (
            <li style={{ position: "relative" }} ref={dropRef}>
              <button
                onClick={() => setDropOpen(p => !p)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "rgba(255,132,14,0.12)",
                  border: "1.5px solid rgba(255,132,14,0.3)",
                  borderRadius: 100, padding: "7px 14px 7px 8px",
                  cursor: "pointer", color: "white",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 14, fontWeight: 600,
                  transition: "all .2s",
                }}
              >
                {/* Avatar con iniciales */}
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C.orange}, ${C.pink})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, color: "white", flexShrink: 0,
                }}>
                  {initials}
                </div>
                <span style={{ maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {userName.split(" ")[0]}
                </span>
                <ChevronDown size={14} style={{ transition: "transform .2s", transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
              </button>

              {/* Dropdown */}
              {dropOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 10px)", right: 0,
                  width: 220, borderRadius: 14,
                  background: "rgba(15,12,26,0.97)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
                  zIndex: 1000, overflow: "hidden",
                }}>
                  {/* Header del dropdown */}
                  <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{userName}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{userEmail}</div>
                    {userRol === "admin" && (
                      <span style={{ fontSize: 10, background: `linear-gradient(135deg, ${C.orange}, ${C.pink})`, color: "white", padding: "2px 8px", borderRadius: 20, fontWeight: 700, marginTop: 4, display: "inline-block" }}>
                        ADMIN
                      </span>
                    )}
                  </div>

                  {/* Opciones */}
                  <div style={{ padding: "6px 0" }}>
                    {userRol === "admin" && (
                      <DropItem icon={<Settings size={15} />} label="Panel Admin" onClick={() => { navigate("/admin"); setDropOpen(false); }} color={C.orange} />
                    )}
                    <DropItem icon={<User size={15} />} label="Mi perfil" onClick={() => { navigate("/mi-cuenta"); setDropOpen(false); }} />
                    <DropItem icon={<ShoppingBag size={15} />} label="Mis pedidos" onClick={() => { navigate("/mi-cuenta/pedidos"); setDropOpen(false); }} />
                    <DropItem icon={<Heart size={15} />} label="Mis favoritos" onClick={() => { navigate("/mi-cuenta/favoritos"); setDropOpen(false); }} />
                    <DropItem icon={<Settings size={15} />} label="Configuración" onClick={() => { navigate("/mi-cuenta/seguridad"); setDropOpen(false); }} />
                  </div>

                  {/* Cerrar sesión */}
                  <div style={{ padding: "6px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                    <DropItem icon={<LogOut size={15} />} label="Cerrar sesión" onClick={handleLogout} color="#f87171" />
                  </div>
                </div>
              )}
            </li>
          )}
        </ul>

        {/* Botón hamburguesa */}
        <button className="navbar-hamburger" onClick={() => setOpen(!open)} aria-label="Menú">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Menú móvil */}
      {open && (
        <div className="mobile-menu-overlay" onClick={() => setOpen(false)}>
          <div className="mobile-menu" onClick={e => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <img src={logoImg} alt="Nu-B Studio" className="navbar-logo" />
              <span className="logo" style={{ fontSize: 16 }}>NU-B STUDIO</span>
              <button onClick={() => setOpen(false)} className="mobile-menu-close"><X size={22} /></button>
            </div>

            {/* Info usuario en mobile */}
            {isLoggedIn && (
              <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${C.orange}, ${C.pink})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "white", flexShrink: 0 }}>
                  {initials}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "white" }}>{userName}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{userEmail}</div>
                </div>
              </div>
            )}

            <ul className="mobile-menu-links">
              {LINKS.map(({ to, icon: Icon, label }) => (
                <li key={to}>
                  <Link to={to} className={location.pathname === to ? "active" : ""} onClick={() => setOpen(false)}>
                    <Icon size={20} /><span>{label}</span>
                  </Link>
                </li>
              ))}

              {isLoggedIn ? (
                <>
                  <li style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 8, paddingTop: 8 }}>
                    <Link to="/mi-cuenta" onClick={() => setOpen(false)}><User size={20} /><span>Mi perfil</span></Link>
                  </li>
                  <li>
                    <Link to="/mi-cuenta/pedidos" onClick={() => setOpen(false)}><ShoppingBag size={20} /><span>Mis pedidos</span></Link>
                  </li>
                  <li>
                    <Link to="/mi-cuenta/favoritos" onClick={() => setOpen(false)}><Heart size={20} /><span>Mis favoritos</span></Link>
                  </li>
                  {userRol === "admin" && (
                    <li>
                      <Link to="/admin" onClick={() => setOpen(false)}><Settings size={20} /><span>Panel Admin</span></Link>
                    </li>
                  )}
                  <li style={{ marginTop: 8 }}>
                    <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 24px", width: "100%", background: "none", border: "none", cursor: "pointer", color: "#f87171", fontSize: 15, fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>
                      <LogOut size={20} /><span>Cerrar sesión</span>
                    </button>
                  </li>
                </>
              ) : (
                <li style={{ marginTop: 8 }}>
                  <Link to="/login" className="mobile-login-btn" onClick={() => setOpen(false)}>
                    <LogIn size={20} /><span>Iniciar sesión</span>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      <style>{`
        .navbar-hamburger {
          display: none; background: transparent; border: none;
          cursor: pointer; padding: 6px; color: white;
          border-radius: 8px; transition: background .15s;
        }
        .navbar-hamburger:hover { background: rgba(255,255,255,0.1); }
        .mobile-menu-overlay {
          display: none; position: fixed; inset: 0;
          background: rgba(0,0,0,0.5); z-index: 999; backdrop-filter: blur(4px);
        }
        .mobile-menu {
          position: absolute; top: 0; right: 0;
          width: 280px; height: 100%; background: #1C1F26;
          display: flex; flex-direction: column;
          box-shadow: -4px 0 24px rgba(0,0,0,0.3);
        }
        .mobile-menu-header {
          display: flex; align-items: center; gap: 10px;
          padding: 20px 20px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .mobile-menu-close {
          margin-left: auto; background: transparent; border: none;
          cursor: pointer; color: rgba(255,255,255,0.5); padding: 4px;
        }
        .mobile-menu-links { list-style: none; margin: 0; padding: 12px 0; flex: 1; overflow-y: auto; }
        .mobile-menu-links li a {
          display: flex; align-items: center; gap: 14px;
          padding: 14px 24px; color: rgba(255,255,255,0.7);
          text-decoration: none; font-size: 15px; font-weight: 500;
          transition: all .15s; font-family: 'Outfit', sans-serif;
        }
        .mobile-menu-links li a:hover, .mobile-menu-links li a.active {
          color: #FF840E; background: rgba(255,132,14,0.08);
        }
        .mobile-login-btn {
          display: flex !important; align-items: center; gap: 14px;
          padding: 14px 24px !important; margin: 8px 16px 0 !important;
          background: #FF840E !important; color: white !important;
          border-radius: 10px; font-weight: 700 !important; font-size: 15px;
        }
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .navbar-hamburger  { display: flex !important; }
          .mobile-menu-overlay { display: block !important; }
        }
      `}</style>
    </>
  );
}

// Componente helper para items del dropdown
function DropItem({ icon, label, onClick, color = "rgba(255,255,255,0.75)" }: {
  icon: React.ReactNode; label: string; onClick: () => void; color?: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        width: "100%", padding: "9px 16px", background: hovered ? "rgba(255,255,255,0.05)" : "none",
        border: "none", cursor: "pointer", color,
        fontSize: 13, fontWeight: 500, fontFamily: "'Outfit', sans-serif",
        transition: "background .15s", textAlign: "left",
      }}
    >
      {icon}{label}
    </button>
  );
}