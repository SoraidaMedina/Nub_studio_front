// src/pages/public/Login.tsx
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Mail, Lock, Eye, EyeOff, LogIn, Loader2, 
  AlertCircle, CheckCircle2, Palette, Camera, 
  Frame, Shield, FileText
} from "lucide-react";
import { authService } from "../../services/authService";
import logoImg from "../../assets/images/logo.png";
import "../../styles/login.css";

interface LoginError {
  status?: number;
  error?: {
    blocked?: boolean;
    minutesRemaining?: number;
    minutesBlocked?: number;
    unlockTime?: string;
    attemptsRemaining?: number;
    totalAttempts?: number;
    message?: string;
    requiresVerification?: boolean;
  };
}

export default function Login() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    correo: "",
    contrasena: ""
  });
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

    if (!formData.correo || !formData.contrasena) {
      showMessage("Por favor completa todos los campos", true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login(formData.correo, formData.contrasena);
      
      console.log('✅ Respuesta del servidor:', response);

      // Manejo de cuenta bloqueada
      if (response.blocked) {
        console.log('🔒 Cuenta bloqueada');
        
        if (response.minutesRemaining) {
          const minutos = response.minutesRemaining;
          const plural = minutos > 1 ? 's' : '';
          showMessage(
            `🔒 Cuenta bloqueada por seguridad. Intenta de nuevo en ${minutos} minuto${plural}.`,
            true
          );
        } else if (response.minutesBlocked) {
          const minutos = response.minutesBlocked;
          showMessage(
            `🔒 Cuenta bloqueada por ${minutos} minutos debido a múltiples intentos fallidos.`,
            true
          );
        } else {
          showMessage(response.message || 'Cuenta bloqueada', true);
        }
        setIsLoading(false);
        return;
      }

      // Manejo de cuenta pendiente de verificación
      if (response.requiresVerification) {
        showMessage('Cuenta pendiente de verificación. Revisa tu correo 📧', true);
        setIsLoading(false);
        return;
      }

      // Manejo de 2FA
      if (response.requires2FA) {
        showMessage('Credenciales correctas. Verificando 2FA...', false);
        localStorage.setItem('temp_correo_2fa', response.correo || formData.correo);

        setTimeout(() => {
          if (response.metodo_2fa === 'TOTP') {
            navigate('/two-factor-verify', {
              state: { correo: response.correo || formData.correo, metodo_2fa: 'TOTP' }
            });
          } else if (response.metodo_2fa === 'GMAIL') {
            navigate('/verify-email-code', {
              state: { correo: response.correo || formData.correo, metodo_2fa: 'GMAIL' }
            });
          } else {
            showMessage('Método 2FA desconocido.', true);
          }
        }, 1500);
        setIsLoading(false);
        return;
      }

      // Login exitoso sin 2FA
      const token = response.access_token || response.token;
      if (token) {
        localStorage.setItem('access_token', token);
        localStorage.setItem('token', token);
      }

      if (response.usuario) {
        localStorage.setItem('userEmail', response.usuario.correo);
        localStorage.setItem('userName', response.usuario.nombre);
        localStorage.setItem('userId', response.usuario.id.toString());
      }
      
      localStorage.setItem('isLoggedIn', 'true');

      showMessage('Inicio de sesión exitoso ✓', false);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (err) {
      const error = err as LoginError;
      console.error('❌ Error en login:', error);
      
      // Error de conexión
      if (error.status === 0) {
        showMessage(
          error.error?.message || 'No se pudo conectar con el servidor',
          true
        );
        setIsLoading(false);
        return;
      }

      // Cuenta bloqueada (403)
      if (error.status === 403 && error.error?.blocked) {
        const minutos = error.error.minutesRemaining || error.error.minutesBlocked || 5;
        const plural = minutos > 1 ? 's' : '';
        
        if (error.error.unlockTime) {
          showMessage(
            `🔒 Cuenta bloqueada. Intenta en ${minutos} minuto${plural} (${error.error.unlockTime}).`,
            true
          );
        } else {
          showMessage(
            `🔒 Cuenta bloqueada. Intenta en ${minutos} minuto${plural}.`,
            true
          );
        }
      } 
      // Contraseña incorrecta (401)
      else if (error.status === 401 && error.error?.attemptsRemaining !== undefined) {
        const intentosRestantes = error.error.attemptsRemaining;
        
        if (intentosRestantes === 0) {
          showMessage(
            '🔒 Has excedido el límite de intentos. Tu cuenta será bloqueada.',
            true
          );
        } else if (intentosRestantes === 1) {
          showMessage(
            `❌ Contraseña incorrecta. ⚠️ Te queda ${intentosRestantes} intento antes del bloqueo.`,
            true
          );
        } else {
          showMessage(
            `❌ Contraseña incorrecta. Te quedan ${intentosRestantes} intentos.`,
            true
          );
        }
      }
      // Usuario no encontrado (404)
      else if (error.status === 404) {
        showMessage('Usuario no encontrado', true);
      }
      // Otros errores
      else {
        const errorMsg = error.error?.message || 'Error al iniciar sesión';
        showMessage(errorMsg, true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      {/* Banner Lateral */}
      <div className="login-banner">
        <div className="banner-content">
          <div className="banner-logo">
            <img src={logoImg} alt="Altar Studio Logo" className="banner-logo-image" />
          </div>
          <h1 className="banner-title">Descubre el Arte de la Huasteca</h1>
          <p className="banner-subtitle">Arte auténtico de nuestra región</p>
          <p className="banner-art-types">Fotografías • Esculturas • Pinturas</p>
          <div className="banner-features">
            <div className="feature-item">
              <div className="feature-icon">
                <Palette size={28} />
              </div>
              <span className="feature-text">Galería de artistas locales</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Camera size={28} />
              </div>
              <span className="feature-text">Obras originales y editables</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <Frame size={28} />
              </div>
              <span className="feature-text">Entrega con marco personalizado</span>
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
      <div className="login-form-section">
        <div className="login-card">
          <div className="mobile-logo">
            <img src={logoImg} alt="Logo" className="mobile-logo-image" />
          </div>

          <h2 className="login-title">Iniciar Sesión</h2>
          <p className="login-subtitle">Ingresa tus credenciales para continuar</p>

          <form onSubmit={handleSubmit}>
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
            </div>

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

            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? (
                <span className="loading-spinner">
                  <Loader2 size={20} className="spinner-icon" />
                  Cargando...
                </span>
              ) : (
                <span className="btn-content">
                  <LogIn size={20} />
                  Iniciar sesión
                </span>
              )}
            </button>
          </form>

          <div className="forgot-link-container">
            <Link to="/forgot-password" className="forgot-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div className="divider">
            <span>o</span>
          </div>

          <p className="register-link">
            ¿No tienes cuenta?{" "}
            <a onClick={goToRegister}>Crear una cuenta</a>
          </p>

          <div className="login-footer">
            <p className="footer-disclaimer">
              Al iniciar sesión, confirmas que has leído y aceptado nuestros
            </p>
            <div className="footer-links">
              <a onClick={openTerminos} className="footer-link">
                <FileText size={14} className="link-icon" />
                Términos y Condiciones
              </a>
              <span className="separator">•</span>
              <a onClick={openPrivacidad} className="footer-link">
                <Shield size={14} className="link-icon" />
                Política de Privacidad
              </a>
            </div>
            <p className="copyright">
              © {currentYear} Altar Studio. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}