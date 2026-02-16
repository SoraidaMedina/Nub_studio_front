// src/pages/public/Contact.tsx
import { 
  Mail, Phone, MapPin, Clock, Send, Star, Users, 
  Sparkles, User, MessageSquare, CheckCircle,
  TrendingUp, Shield, Palette
} from "lucide-react";
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import "../../styles/contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: ""
  });

  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    setEnviado(true);
    
    setTimeout(() => {
      setEnviado(false);
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        asunto: "",
        mensaje: ""
      });
    }, 3000);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contact-page">
      {/* Círculos de fondo animados */}
      <div className="background-circles">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      {/* Header profesional */}
      <section className="contact-header">
        <div className="header-sparkle">
          <Sparkles size={20} />
        </div>
        <div className="header-badge">
          <Star size={16} />
          <span>Galería Certificada #1 en Hidalgo</span>
          <Star size={16} />
        </div>
        <h1>
          <span className="gradient-text">Conecta</span> con el{" "}
          <span className="gradient-text-alt">Arte Huasteco</span>
        </h1>
        <p className="header-subtitle">
          Transforma tus espacios con obras auténticas de artistas locales
        </p>
        
        {/* Stats badges profesionales */}
        <div className="stats-badges">
          <div className="stat-badge stat-badge-1">
            <div className="stat-icon">
              <Shield size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-number">100%</span>
              <span className="stat-label">Auténtico</span>
            </div>
          </div>
          <div className="stat-badge stat-badge-2">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-number">50+</span>
              <span className="stat-label">Artistas</span>
            </div>
          </div>
          <div className="stat-badge stat-badge-3">
            <div className="stat-icon">
              <Palette size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Obras</span>
            </div>
          </div>
        </div>
      </section>

      <div className="contact-container">
        {/* Sidebar con tarjetas flotantes */}
        <div className="contact-sidebar">
          <div className="info-cards-stack">
            <div className="info-card-modern card-location">
              <div className="card-bg-pattern"></div>
              <div className="info-icon-modern">
                <MapPin size={28} />
              </div>
              <div className="info-content-modern">
                <h3>Ubicación</h3>
                <p>Universidad Tecnológica</p>
                <p>Huasteca Hidalguense</p>
              </div>
              <div className="card-shine"></div>
            </div>

            <div className="info-card-modern card-phone">
              <div className="card-bg-pattern"></div>
              <div className="info-icon-modern">
                <Phone size={28} />
              </div>
              <div className="info-content-modern">
                <h3>Llámanos</h3>
                <p>+52 771 234 5678</p>
                <p className="small-text">Respuesta en minutos</p>
              </div>
              <div className="card-shine"></div>
            </div>

            <div className="info-card-modern card-email">
              <div className="card-bg-pattern"></div>
              <div className="info-icon-modern">
                <Mail size={28} />
              </div>
              <div className="info-content-modern">
                <h3>Escríbenos</h3>
                <p>contacto@altarstudio.com</p>
                <p className="small-text">Te respondemos hoy</p>
              </div>
              <div className="card-shine"></div>
            </div>

            <div className="info-card-modern card-hours">
              <div className="card-bg-pattern"></div>
              <div className="info-icon-modern">
                <Clock size={28} />
              </div>
              <div className="info-content-modern">
                <h3>Horario</h3>
                <p>Lun - Vie: 9AM - 6PM</p>
                <p className="small-text">Sábado: 10AM - 2PM</p>
              </div>
              <div className="card-shine"></div>
            </div>
          </div>

          {/* Banner llamativo */}
          <div className="cta-banner">
            <div className="cta-glow"></div>
            <TrendingUp size={32} className="cta-icon" />
            <div className="cta-content">
              <h4>¿Eres artista?</h4>
              <p>Únete a nuestra galería certificada y alcanza nuevos clientes</p>
              <button className="cta-button">
                Aplica ahora
                <Star size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Formulario ultra moderno */}
        <div className="contact-form-wrapper-modern">
          <div className="form-glow-effect"></div>
          <div className="form-decoration-top"></div>
          
          <div className="form-header-modern">
            <div className="form-icon-badge">
              <Send size={24} />
            </div>
            <h2>Envíanos un mensaje</h2>
            <p>Te responderemos en menos de 24 horas</p>
          </div>

          {enviado && (
            <div className="success-message-modern">
              <div className="success-animation">
                <div className="success-checkmark">
                  <CheckCircle size={24} />
                </div>
              </div>
              <div className="success-content-modern">
                <h4>Mensaje enviado con éxito</h4>
                <p>Nos pondremos en contacto contigo pronto</p>
              </div>
              <div className="success-confetti"></div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form-modern">
            <div className="form-group-modern">
              <label htmlFor="nombre">
                <User size={16} />
                Nombre completo <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Tu nombre completo"
                  className="input-modern"
                />
                <div className="input-highlight"></div>
              </div>
            </div>

            <div className="form-group-modern">
              <label htmlFor="email">
                <Mail size={16} />
                Email <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="tu@email.com"
                  className="input-modern"
                />
                <div className="input-highlight"></div>
              </div>
            </div>

            <div className="form-group-modern">
              <label htmlFor="telefono">
                <Phone size={16} />
                Teléfono
              </label>
              <div className="input-wrapper">
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+52 771 234 5678"
                  className="input-modern"
                />
                <div className="input-highlight"></div>
              </div>
            </div>

            <div className="form-group-modern">
              <label htmlFor="asunto">
                <Sparkles size={16} />
                Asunto <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <select
                  id="asunto"
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  required
                  className="input-modern select-modern"
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="compra">Compra de obra</option>
                  <option value="informacion">Información general</option>
                  <option value="artista">Ser artista en Altar Studio</option>
                  <option value="colaboracion">Colaboración empresarial</option>
                  <option value="otro">Otro tema</option>
                </select>
                <div className="select-icon">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="input-highlight"></div>
              </div>
            </div>

            <div className="form-group-modern form-group-full">
              <label htmlFor="mensaje">
                <MessageSquare size={16} />
                Tu mensaje <span className="required-star">*</span>
              </label>
              <div className="input-wrapper">
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Cuéntanos cómo podemos ayudarte a encontrar la obra perfecta..."
                  className="input-modern"
                />
                <div className="input-highlight"></div>
              </div>
            </div>

            <button type="submit" className="btn-submit-modern">
              <span className="btn-content">
                <Send size={20} />
                Enviar mensaje
              </span>
              <div className="btn-bg-gradient"></div>
              <div className="btn-shine"></div>
            </button>
          </form>
        </div>
      </div>

      {/* Mapa ultra moderno con animaciones */}
      <section className="contact-map-modern">
        <div className="map-header-modern">
          <div className="map-title-icon">
            <MapPin size={32} />
          </div>
          <h2>Visítanos en Persona</h2>
          <p>Descubre nuestra galería en el corazón de la Huasteca</p>
        </div>

        <div className="map-wrapper-modern">
          <div className="map-container-modern">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3722.8974536185797!2d-98.38544492494915!3d21.099338180562694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d72d6af3e1e5e7%3A0x9d8e5f5e5e5e5e5e!2sUniversidad%20Tecnol%C3%B3gica%20de%20la%20Huasteca%20Hidalguense!5e0!3m2!1ses-419!2smx!4v1234567890123!5m2!1ses-419!2smx"
              width="100%"
              height="550"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de ubicación"
            />
          </div>
          
          <div className="map-overlay-modern">
            <div className="map-pin-pulse">
              <div className="pulse-ring"></div>
              <div className="pulse-ring pulse-ring-delay"></div>
              <div className="map-pin-icon">
                <MapPin size={40} />
              </div>
            </div>
            
            <div className="map-info-card">
              <div className="map-card-glow"></div>
              <div className="map-card-header">
                <h3>Altar Studio</h3>
                <div className="verified-badge">
                  <CheckCircle size={14} />
                  Verificado
                </div>
              </div>
              <p className="map-address">
                <MapPin size={16} />
                Universidad Tecnológica de la Huasteca Hidalguense
              </p>
              <p className="map-location">Huejutla de Reyes, Hidalgo</p>
              <div className="map-stats">
                <div className="map-stat">
                  <Clock size={16} />
                  <span>Abierto ahora</span>
                </div>
                <div className="map-stat">
                  <Star size={16} />
                  <span>5.0</span>
                </div>
              </div>
              <a 
                href="https://www.google.com/maps/search/Universidad+Tecnol%C3%B3gica+de+la+Huasteca+Hidalguense"
                target="_blank"
                rel="noopener noreferrer"
                className="map-cta-button"
              >
                <MapPin size={18} />
                Cómo llegar
                <div className="button-arrow">→</div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}