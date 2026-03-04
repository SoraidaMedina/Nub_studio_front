// src/pages/public/VerificarEmail.tsx
// Ruta: /verificar-email?token=xxxxx
// Uso:  Artista registro público → verifica correo → queda pendiente de aprobación admin

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, AlertCircle, Loader, Clock, Mail, ArrowRight, RefreshCw } from "lucide-react";

const C = {
  orange:   "#FF840E",
  pink:     "#CC59AD",
  magenta:  "#CC4EA1",
  purple:   "#8D4CCD",
  blue:     "#79AAF5",
  gold:     "#FFC110",
  green:    "#22C97A",
  cream:    "#FFF8EE",
  creamSub: "#D8CABC",
  creamMut: "rgba(255,232,200,0.38)",
  bg:       "#0C0812",
  bgDeep:   "#070510",
  panel:    "#100D1C",
  card:     "rgba(20,15,34,0.95)",
  border:   "rgba(255,200,150,0.09)",
  borderBr: "rgba(118,78,49,0.24)",
};

const FD = "'Playfair Display', serif";
const FB = "'DM Sans', sans-serif";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function LogoMark({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <defs>
        <linearGradient id="lgLogoVE" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={C.purple} />
          <stop offset="55%"  stopColor={C.magenta} />
          <stop offset="100%" stopColor={C.blue}   />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="19" stroke="url(#lgLogoVE)" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M11 28V12L20 24V12M20 12V28" stroke="url(#lgLogoVE)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 12h5a3 3 0 010 6h-5v0h5a3 3 0 010 6h-5V12z" stroke="url(#lgLogoVE)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="33" cy="8" r="2.5" fill={C.gold} />
    </svg>
  );
}

type Estado = "verificando" | "exito" | "error" | "expirado" | "ya_verificado";

export default function VerificarEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [estado,        setEstado]        = useState<Estado>("verificando");
  const [mensajeError,  setMensajeError]  = useState("");
  const [correoExp,     setCorreoExp]     = useState("");
  const [reenvLoading,  setReenvLoading]  = useState(false);
  const [reenvExito,    setReenvExito]    = useState(false);

  // ── Verificar automáticamente al montar ─────────────────
  useEffect(() => {
    if (!token) { setEstado("error"); setMensajeError("No se encontró el token en el enlace."); return; }

    const verificar = async () => {
      try {
        const res  = await fetch(`${API_URL}/api/auth/verificar-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const json = await res.json();

        if (res.ok) {
          setEstado("exito");
          return;
        }

        if (json.expired) {
          setCorreoExp(json.correo || "");
          setEstado("expirado");
          return;
        }

        // Token ya usado
        if (json.message?.includes("ya fue verificado")) {
          setEstado("ya_verificado");
          return;
        }

        setMensajeError(json.message || "Token inválido");
        setEstado("error");

      } catch {
        setMensajeError("No se pudo conectar con el servidor.");
        setEstado("error");
      }
    };

    verificar();
  }, [token]);

  // ── Reenviar enlace ──────────────────────────────────────
  const handleReenviar = async () => {
    if (!correoExp || reenvLoading || reenvExito) return;
    setReenvLoading(true);
    try {
      await fetch(`${API_URL}/api/auth/reenviar-activacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: correoExp }),
      });
      setReenvExito(true);
    } catch {
      // silencioso — respuesta genérica de todos modos
      setReenvExito(true);
    } finally {
      setReenvLoading(false);
    }
  };

  // ── ESTADO: Verificando ──────────────────────────────────
  if (estado === "verificando") {
    return (
      <Wrapper accent={C.purple}>
        <div style={{ textAlign: "center", animation: "fadeUp .45s ease both" }}>
          <div style={{ width: 68, height: 68, borderRadius: 20, background: `${C.purple}18`, border: `1px solid ${C.purple}35`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px", boxShadow: `0 8px 28px ${C.purple}28` }}>
            <Loader size={30} color={C.purple} strokeWidth={1.8} style={{ animation: "spin 1.1s linear infinite" }} />
          </div>
          <h2 style={{ fontFamily: FD, fontSize: 22, fontWeight: 900, color: C.cream, margin: "0 0 10px" }}>Verificando tu correo</h2>
          <p style={{ color: C.creamSub, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Solo tomará un momento…</p>
        </div>
      </Wrapper>
    );
  }

  // ── ESTADO: Éxito ────────────────────────────────────────
  if (estado === "exito") {
    return (
      <Wrapper accent={C.green}>
        <div style={{ animation: "fadeUp .45s ease both" }}>
          {/* Icono */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 76, height: 76, borderRadius: 22, background: `${C.green}18`, border: `1px solid ${C.green}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: `0 10px 36px ${C.green}30` }}>
              <CheckCircle size={36} color={C.green} strokeWidth={1.8} />
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: 100, background: `${C.green}15`, border: `1px solid ${C.green}35`, marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.green, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: FB }}>Correo verificado ✓</span>
            </div>
            <h1 style={{ fontFamily: FD, fontSize: 26, fontWeight: 900, color: C.cream, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
              ¡Ya casi estás{" "}
              <span style={{ background: `linear-gradient(90deg, ${C.green}, ${C.blue})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>listo!</span>
            </h1>
            <p style={{ color: C.creamSub, fontSize: 14.5, margin: 0, lineHeight: 1.7 }}>
              Tu correo fue verificado correctamente.<br />
              Ahora nuestro equipo revisará tu solicitud.
            </p>
          </div>

          {/* Pasos que siguen */}
          <div style={{ background: "rgba(255,232,200,0.03)", border: `1px solid ${C.borderBr}`, borderRadius: 16, padding: "22px 24px", marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.creamMut, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16, fontFamily: FB }}>¿Qué sigue?</div>
            {[
              { num: "1", color: C.green,  text: "Tu solicitud entra en revisión con nuestro equipo",  done: true   },
              { num: "2", color: C.gold,   text: "Recibirás un correo con la decisión (hasta 48 hrs)",  done: false  },
              { num: "3", color: C.purple, text: "Si eres aprobado, podrás subir obras al catálogo",    done: false  },
            ].map(({ num, color, text, done }) => (
              <div key={num} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: done ? `${color}25` : `${color}12`, border: `1px solid ${done ? color + "55" : color + "25"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, boxShadow: done ? `0 2px 10px ${color}28` : "none", transition: "all .3s" }}>
                  {done
                    ? <CheckCircle size={14} color={color} strokeWidth={2.5} />
                    : <span style={{ fontSize: 11, fontWeight: 900, color, fontFamily: FB }}>{num}</span>
                  }
                </div>
                <span style={{ fontSize: 13.5, color: done ? C.creamSub : C.creamMut, lineHeight: 1.6, fontFamily: FB, paddingTop: 4 }}>{text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate("/login")}
            style={{ width: "100%", padding: "15px", borderRadius: 13, border: "none", background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`, color: "white", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: FB, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 8px 28px ${C.purple}38`, transition: "all .2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 14px 36px ${C.purple}50`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px ${C.purple}38`; }}
          >
            <Mail size={17} strokeWidth={2.5} /> Entendido, estar pendiente <ArrowRight size={15} strokeWidth={2.5} />
          </button>
        </div>
      </Wrapper>
    );
  }

  // ── ESTADO: Expirado ─────────────────────────────────────
  if (estado === "expirado") {
    return (
      <Wrapper accent={C.gold}>
        <div style={{ animation: "fadeUp .45s ease both" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 68, height: 68, borderRadius: 20, background: `${C.gold}18`, border: `1px solid ${C.gold}35`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: `0 8px 28px ${C.gold}28` }}>
              <Clock size={30} color={C.gold} strokeWidth={1.8} />
            </div>
            <h2 style={{ fontFamily: FD, fontSize: 24, fontWeight: 900, color: C.cream, margin: "0 0 10px" }}>Enlace expirado</h2>
            <p style={{ color: C.creamSub, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              Este enlace de verificación ya no es válido.<br />
              Te enviamos uno nuevo al mismo correo.
            </p>
          </div>

          {correoExp && (
            <div style={{ background: "rgba(255,193,16,0.06)", border: `1px solid ${C.gold}30`, borderRadius: 14, padding: "14px 18px", marginBottom: 22, display: "flex", alignItems: "center", gap: 10 }}>
              <Mail size={14} color={C.gold} strokeWidth={1.8} style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 11, color: C.gold, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FB, marginBottom: 3 }}>Tu correo</div>
                <div style={{ fontSize: 14, color: C.cream, fontFamily: FB }}>{correoExp}</div>
              </div>
            </div>
          )}

          {/* Botón reenviar */}
          {!reenvExito ? (
            <button
              onClick={handleReenviar}
              disabled={reenvLoading}
              style={{ width: "100%", padding: "15px", borderRadius: 13, border: "none", background: `linear-gradient(135deg, ${C.gold}, ${C.orange})`, color: "#000", fontWeight: 800, fontSize: 15, cursor: reenvLoading ? "not-allowed" : "pointer", fontFamily: FB, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 8px 28px ${C.gold}38`, transition: "all .2s", opacity: reenvLoading ? 0.7 : 1 }}
              onMouseEnter={e => { if (!reenvLoading) { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 14px 36px ${C.gold}50`; } }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px ${C.gold}38`; }}
            >
              {reenvLoading
                ? <><Loader size={17} strokeWidth={2.5} style={{ animation: "spin 1s linear infinite" }} /> Enviando…</>
                : <><RefreshCw size={17} strokeWidth={2.5} /> Enviar nuevo enlace</>
              }
            </button>
          ) : (
            <div style={{ padding: "16px", borderRadius: 13, background: `${C.green}12`, border: `1px solid ${C.green}35`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 0 }}>
              <CheckCircle size={17} color={C.green} strokeWidth={2} />
              <span style={{ fontSize: 14, color: C.green, fontWeight: 700, fontFamily: FB }}>Enlace enviado. Revisa tu correo.</span>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 18 }}>
            <button onClick={() => navigate("/login")} style={{ background: "none", border: "none", color: C.creamMut, fontSize: 13, cursor: "pointer", fontFamily: FB, fontWeight: 500 }}>
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </Wrapper>
    );
  }

  // ── ESTADO: ya_verificado ────────────────────────────────
  if (estado === "ya_verificado") {
    return (
      <Wrapper accent={C.blue}>
        <div style={{ textAlign: "center", animation: "fadeUp .45s ease both" }}>
          <div style={{ width: 68, height: 68, borderRadius: 20, background: `${C.blue}18`, border: `1px solid ${C.blue}35`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: `0 8px 28px ${C.blue}28` }}>
            <CheckCircle size={30} color={C.blue} strokeWidth={1.8} />
          </div>
          <h2 style={{ fontFamily: FD, fontSize: 22, fontWeight: 900, color: C.cream, margin: "0 0 10px" }}>Correo ya verificado</h2>
          <p style={{ color: C.creamSub, fontSize: 14, lineHeight: 1.7, margin: "0 0 24px" }}>
            Tu cuenta ya fue verificada anteriormente.<br />
            Puedes iniciar sesión cuando seas aprobado.
          </p>
          <button
            onClick={() => navigate("/login")}
            style={{ padding: "13px 32px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`, color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: FB, boxShadow: `0 6px 22px ${C.blue}35` }}
          >
            Ir al inicio de sesión →
          </button>
        </div>
      </Wrapper>
    );
  }

  // ── ESTADO: error genérico ───────────────────────────────
  return (
    <Wrapper accent={C.pink}>
      <div style={{ textAlign: "center", animation: "fadeUp .45s ease both" }}>
        <div style={{ width: 68, height: 68, borderRadius: 20, background: `${C.pink}18`, border: `1px solid ${C.pink}35`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: `0 8px 28px ${C.pink}28` }}>
          <AlertCircle size={30} color={C.pink} strokeWidth={1.8} />
        </div>
        <h2 style={{ fontFamily: FD, fontSize: 22, fontWeight: 900, color: C.cream, margin: "0 0 10px" }}>Enlace inválido</h2>
        <p style={{ color: C.creamSub, fontSize: 14, lineHeight: 1.7, margin: "0 0 24px" }}>
          {mensajeError || "Este enlace no es válido o ya fue utilizado."}<br />
          Solicita uno nuevo a tu administrador.
        </p>
        <button
          onClick={() => navigate("/login")}
          style={{ padding: "13px 32px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${C.pink}, ${C.purple})`, color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: FB, boxShadow: `0 6px 22px ${C.pink}35` }}
        >
          Ir al inicio de sesión →
        </button>
      </div>
    </Wrapper>
  );
}

// ── Wrapper centrado ───────────────────────────────────────────
function Wrapper({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 16px", position: "relative", fontFamily: FB }}>
      <div style={{ position: "fixed", top: -160, right: -80,  width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, ${accent}07, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -100, left: -80, width: 480, height: 480, borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06, transparent 70%)`, pointerEvents: "none" }} />

      {/* Barra de color superior */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.orange}, ${C.gold}, ${C.pink}, ${C.purple}, ${C.blue})`, zIndex: 50 }} />

      {/* Logo */}
      <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 10, zIndex: 10 }}>
        <LogoMark size={30} />
        <span style={{ fontFamily: FD, fontSize: 15, fontWeight: 900, color: C.cream, letterSpacing: "-0.01em" }}>Nu-B Studio</span>
      </div>

      <div style={{ width: "100%", maxWidth: 480, position: "relative", zIndex: 1, marginTop: 20 }}>
        {/* Tarjeta */}
        <div style={{ background: C.card, border: `1px solid ${C.borderBr}`, borderRadius: 22, padding: "36px 32px", backdropFilter: "blur(20px)", boxShadow: `0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px ${accent}12` }}>
          {children}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,200,150,0.12); border-radius: 10px; }
      `}</style>
    </div>
  );
}