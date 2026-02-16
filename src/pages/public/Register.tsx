// src/pages/public/Register.tsx
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Mail, Lock, Eye, EyeOff, UserPlus, Loader2, 
  AlertCircle, CheckCircle2, Palette, Camera, 
  Frame, User, Shield, FileText, Check
} from "lucide-react";
import { authService } from "../../services/authService";
import logoImg from "../../assets/images/logo.png";
import "../../styles/register.css";

interface PasswordRequirement {
  text: string;
  met: boolean;
}

interface RegisterError {
  status?: number;
  error?: {
    message?: string;
    errors?: string[];
  };
}

export default function Register() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: ""
  });

  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [isError, setIsError] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [aceptoTerminos, setAceptoTerminos] = useState(false);

  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirement[]>([
    { text: 'Mínimo 8 caracteres', met: false },
    { text: 'Una letra mayúscula', met: false },
    { text: 'Una letra minúscula', met: false },
    { text: 'Un número', met: false },
    { text: 'Un carácter especial (@$!%*?&#)', met: false }
  ]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'contrasena') {
      validatePassword(value);
    }
  };

  const validatePassword = (password: string) => {
    setPasswordTouched(true);
    
    const newRequirements = [
      { text: 'Mínimo 8 caracteres', met: password.length >= 8 },
      { text: 'Una letra mayúscula', met: /[A-Z]/.test(password) },
      { text: 'Una letra minúscula', met: /[a-z]/.test(password) },
      { text: 'Un número', met: /[0-9]/.test(password) },
      { text: 'Un carácter especial (@$!%*?&#)', met: /[@$!%*?&#]/.test(password) }
    ];
    
    setPasswordRequirements(newRequirements);
  };

  const isPasswordValid = (): boolean => {
    return passwordRequirements.every(req => req.met);
  };

  const getPasswordStrength = (): string => {
    const metCount = passwordRequirements.filter(req => req.met).length;
    
    if (metCount === 0) return 'none';
    if (metCount <= 2) return 'weak';
    if (metCount <= 3) return 'medium';
    if (metCount <= 4) return 'good';
    return 'strong';
  };

  const getPasswordStrengthText = (): string => {
    const strength = getPasswordStrength();
    const texts: { [key: string]: string } = {
      none: '',
      weak: 'Débil',
      medium: 'Media',
      good: 'Buena',
      strong: 'Fuerte'
    };
    return texts[strength] || '';
  };

  const toggleMostrarContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  const showMessage = (msg: string, error: boolean) => {
    setMensaje(msg);
    setIsError(error);
  };

  const openTerminos = () => {
    console.log("Abrir términos y condiciones");
  };

  const openPrivacidad = () => {
    console.log("Abrir política de privacidad");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje("");

    // Validar aceptación de términos
    if (!aceptoTerminos) {
      showMessage('Debes aceptar los Términos y Condiciones para continuar', true);
      return;
    }

    // Validaciones básicas
    if (!formData.nombre || !formData.correo || !formData.contrasena) {
      showMessage('Todos los campos son obligatorios', true);
      return;
    }

    // Validar nombre
    if (formData.nombre.length < 2) {
      showMessage('El nombre debe tener al menos 2 caracteres', true);
      return;
    }

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre)) {
      showMessage('El nombre solo puede contener letras y espacios', true);
      return;
    }

    // Validar email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.correo)) {
      showMessage('El formato del correo no es válido', true);
      return;
    }

    // Validar contraseña
    if (!isPasswordValid()) {
      showMessage('La contraseña no cumple con todos los requisitos', true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register(
        formData.nombre,
        formData.correo,
        formData.contrasena
      );

      console.log('✅ Registro exitoso:', response);

      showMessage('Registro exitoso. Redirigiendo al login...', false);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      const error = err as RegisterError;
      console.error('❌ Error en registro:', error);

      if (error.status === 400) {
        if (error.error?.errors && Array.isArray(error.error.errors)) {
          showMessage(error.error.errors.join(', '), true);
        } else {
          showMessage(error.error?.message || 'El correo ya está registrado', true);
        }
      } else if (error.status === 0) {
        showMessage('No se pudo conectar con el servidor', true);
      } else {
        showMessage(error.error?.message || 'Error en registro', true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="register-container">
      {/* Banner Lateral */}
      <div className="register-banner">
        <div className="banner-content">
          <div className="banner-logo">
            <img src={logoImg} alt="Altar Studio Logo" className="banner-logo-image" />
          </div>
          <h1 className="banner-title">Únete a Nuestra Galería</h1>
          <p className="banner-subtitle">Comienza a explorar y coleccionar arte de la Huasteca</p>
          <p className="banner-art-types">Tu viaje artístico empieza aquí</p>
          <div className="banner-features">
            <div className="feature-item">
              <div className="feature-icon">
                <Palette size={28} />
              </div>
              <span className="feature-text">Acceso a artistas exclusivos</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Camera size={28} />
              </div>
              <span className="feature-text">Compra obras auténticas</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Frame size={28} />
              </div>
              <span className="feature-text">Personaliza tus favoritos</span>
            </div>
          </div>
          <div className="banner-decoration">
            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
            <div className="decoration-circle circle-3"></div>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="register-form-section">
        <div className="register-card">
          <div className="mobile-logo">
            <img src={logoImg} alt="Logo" className="mobile-logo-image" />
          </div>

          <h2 className="register-title">Crear Cuenta</h2>
          <p className="register-subtitle">Únete a nuestra plataforma</p>

          <form onSubmit={handleSubmit}>
            {/* Nombre */}
            <div className="form-group">
              <label htmlFor="nombre">
                <User size={18} className="label-icon" />
                Nombre completo
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez"
                disabled={isLoading}
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="correo">
                <Mail size={18} className="label-icon" />
                Correo electrónico
              </label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                placeholder="tu@email.com"
                disabled={isLoading}
                required
              />
            </div>

            {/* Contraseña */}
            <div className="form-group">
              <label htmlFor="contrasena">
                <Lock size={18} className="label-icon" />
                Contraseña
              </label>
              <div className="password-input-container">
                <input
                  type={mostrarContrasena ? "text" : "password"}
                  id="contrasena"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  onFocus={() => setShowPasswordRequirements(true)}
                  onBlur={() => !formData.contrasena && setShowPasswordRequirements(false)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={toggleMostrarContrasena}
                  disabled={isLoading}
                  aria-label="Mostrar/Ocultar contraseña"
                >
                  {mostrarContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Barra de fortaleza */}
              {passwordTouched && formData.contrasena.length > 0 && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div className={`strength-fill strength-${getPasswordStrength()}`}></div>
                  </div>
                  <span className={`strength-text strength-${getPasswordStrength()}`}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
              )}

              {/* Requisitos */}
              {showPasswordRequirements && (
                <div className="password-requirements">
                  <p className="requirements-title">La contraseña debe tener:</p>
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className={`requirement ${req.met ? 'met' : ''}`}>
                      <span className="req-icon">
                        {req.met ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                      </span>
                      <span className="req-text">{req.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Mensajes */}
            {mensaje && isError && (
              <div className="error-message">
                <AlertCircle size={20} className="message-icon" />
                {mensaje}
              </div>
            )}

            {mensaje && !isError && (
              <div className="success-message">
                <CheckCircle2 size={20} className="message-icon" />
                {mensaje}
              </div>
            )}

            {/* Términos y condiciones */}
            <div className="terms-checkbox-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={aceptoTerminos}
                  onChange={(e) => setAceptoTerminos(e.target.checked)}
                  disabled={isLoading}
                  required
                />
                <span className="checkmark">
                  {aceptoTerminos && <Check size={14} />}
                </span>
                <span className="checkbox-label">
                  Acepto los{" "}
                  <a onClick={openTerminos} className="terms-link">
                    Términos y Condiciones
                  </a>
                  {" "}y la{" "}
                  <a onClick={openPrivacidad} className="terms-link">
                    Política de Privacidad
                  </a>
                </span>
              </label>
            </div>

            {/* Botón */}
            <button 
              type="submit" 
              className="btn-register" 
              disabled={isLoading || !aceptoTerminos}
            >
              {isLoading ? (
                <span className="loading-spinner">
                  <Loader2 size={20} className="spinner-icon" />
                  Registrando...
                </span>
              ) : (
                <span className="btn-content">
                  <UserPlus size={20} />
                  {aceptoTerminos ? 'Crear cuenta' : 'Acepta los términos para continuar'}
                </span>
              )}
            </button>
          </form>

          <div className="divider">
            <span>o</span>
          </div>

          <div className="register-footer">
            <p className="login-link">
              ¿Ya tienes cuenta?{" "}
              <a onClick={goToLogin}>Inicia sesión</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}