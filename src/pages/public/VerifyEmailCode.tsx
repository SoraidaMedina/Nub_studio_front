// src/pages/public/VerifyEmailCode.tsx
import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { authService } from "../../services/authService";
import logoImg from "../../assets/images/logo.png";
import "../../styles/login.css";

export default function VerifyEmailCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const [codigo, setCodigo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [isError, setIsError] = useState(false);

  const correo = location.state?.correo || localStorage.getItem('temp_correo_2fa');

  useEffect(() => {
    if (!correo) {
      navigate('/login');
    }
  }, [correo, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCodigo(value);
  };

  const showMessage = (msg: string, error: boolean) => {
    setMensaje(msg);
    setIsError(error);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje("");

    if (codigo.length !== 6) {
      showMessage("El código debe tener 6 dígitos", true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.verifyGmail2FA(correo!, codigo);

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
      localStorage.removeItem('temp_correo_2fa');

      showMessage('Verificación exitosa ✓', false);

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (err: any) {
      console.error('❌ Error en verificación Gmail 2FA:', err);

      if (err.status === 401) {
        showMessage('Código incorrecto. Intenta de nuevo.', true);
      } else if (err.status === 404) {
        showMessage('Código no encontrado o expirado.', true);
      } else {
        showMessage(err.error?.message || 'Error al verificar el código', true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    localStorage.removeItem('temp_correo_2fa');
    navigate('/login');
  };

  return (
    <div className="login-container">
      <div className="login-banner">
        <div className="banner-content">
          <div className="banner-logo">
            <img src={logoImg} alt="NU-B Studio Logo" className="banner-logo-image" />
          </div>
          <h1 className="banner-title">Verificación por Email</h1>
          <p className="banner-subtitle">Revisa tu correo electrónico</p>
          <div className="banner-features">
            <div className="feature-item">
              <div className="feature-icon">
                <Mail size={28} />
              </div>
              <span className="feature-text">Código enviado a tu correo</span>
            </div>
          </div>
        </div>
      </div>

      <div className="login-form-section">
        <div className="login-card">
          <div className="mobile-logo">
            <img src={logoImg} alt="Logo" className="mobile-logo-image" />
          </div>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Mail size={48} style={{ color: '#FF6B35', margin: '0 auto' }} />
          </div>

          <h2 className="login-title">Verifica tu email</h2>
          <p className="login-subtitle">
            Hemos enviado un código de 6 dígitos a<br />
            <strong>{correo}</strong>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="codigo">Código de verificación</label>
              <input
                type="text"
                id="codigo"
                name="codigo"
                value={codigo}
                onChange={handleChange}
                placeholder="000000"
                disabled={isLoading}
                maxLength={6}
                pattern="[0-9]{6}"
                required
                style={{ 
                  fontSize: '24px', 
                  letterSpacing: '8px',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
              />
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
                  Verificando...
                </span>
              ) : (
                <span className="btn-content">
                  <Mail size={20} />
                  Verificar código
                </span>
              )}
            </button>
          </form>

          <div className="divider">
            <span>o</span>
          </div>

          <p className="register-link" style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
            ¿No recibiste el código?{" "}
            <a onClick={() => showMessage('Función de reenvío próximamente', false)} style={{ cursor: 'pointer' }}>
              Reenviar código
            </a>
          </p>

          <div className="forgot-link-container">
            <button onClick={goBack} className="forgot-link" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
              <ArrowLeft size={16} style={{ marginRight: '8px' }} />
              Volver al login
            </button>
          </div>

          <div className="login-footer">
            <p className="copyright">
              © {new Date().getFullYear()} NU-B Studio. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}