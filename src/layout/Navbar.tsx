// src/layout/Navbar.tsx
import { Link } from "react-router-dom";
import { Home, Users, BookOpen, Info, Mail, LogIn } from "lucide-react";
import logoImg from "../assets/images/logo.png";
import "../styles/layout.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo + Nombre */}
      <div className="navbar-brand">
        <img 
          src={logoImg} 
          alt="Altar Studio Logo" 
          className="navbar-logo"
        />
        <span className="logo">ALTAR STUDIO</span>
      </div>

      {/* Links de navegación con iconos */}
      <ul className="nav-links">
        <li>
          <Link to="/">
            <Home size={18} />
            <span>Galería</span>
          </Link>
        </li>
        <li>
          <Link to="/artistas">
            <Users size={18} />
            <span>Artistas</span>
          </Link>
        </li>
        <li>
          <Link to="/blog">
            <BookOpen size={18} />
            <span>Blog</span>
          </Link>
        </li>
        <li>
          <Link to="/sobre-nosotros">
            <Info size={18} />
            <span>Sobre nosotros</span>
          </Link>
        </li>
        <li>
          <Link to="/contacto">
            <Mail size={18} />
            <span>Contacto</span>
          </Link>
        </li>
        <li>
          <Link to="/login">
            <LogIn size={18} />
            <span>Iniciar sesión</span>
          </Link>
        </li>
      </ul>

    </nav>
  );
}