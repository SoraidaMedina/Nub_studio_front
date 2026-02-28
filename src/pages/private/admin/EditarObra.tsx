// src/pages/private/admin/EditarObra.tsx
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Save, Image as ImageIcon, AlertCircle,
  CheckCircle2, Loader2, Palette, Users, Tag,
  Ruler, DollarSign, Frame, Award, Calendar,
  Link as LinkIcon, Type, FileText,
  LayoutDashboard, ShoppingBag, BarChart2, Settings, LogOut
} from "lucide-react";
import { authService } from "../../../services/authService";
import { obraService } from "../../../services/obraService";

// ── Design tokens ─────────────────────────────────────────────
const C = {
  orange:  "#FF840E",
  pink:    "#CC59AD",
  purple:  "#8D4CCD",
  gold:    "#FFC110",
  blue:    "#79AAF5",
  bg:      "#0f0c1a",
  surface: "rgba(18,12,32,0.9)",
  border:  "rgba(255,255,255,0.08)",
  text:    "#ffffff",
  muted:   "rgba(255,255,255,0.45)",
  sidebar: "rgba(10,7,20,0.97)",
  input:   "rgba(255,255,255,0.05)",
  inputBorder: "rgba(255,255,255,0.1)",
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const NAV = [
  { id:"dashboard", label:"Dashboard", icon:LayoutDashboard, color:C.orange, path:"/admin"          },
  { id:"obras",     label:"Obras",     icon:Palette,         color:C.blue,   path:"/admin/obras"    },
  { id:"artistas",  label:"Artistas",  icon:Users,           color:C.pink,   path:"/admin/artistas" },
  { id:"ventas",    label:"Ventas",    icon:ShoppingBag,     color:C.purple, path:"/admin"          },
  { id:"reportes",  label:"Reportes",  icon:BarChart2,       color:C.muted,  path:"/admin"          },
];

const ESTADOS_OPTS = [
  { val:"pendiente", label:"Pendiente", color:C.gold   },
  { val:"publicada", label:"Publicada", color:C.orange },
  { val:"rechazada", label:"Rechazada", color:C.pink   },
  { val:"agotada",   label:"Agotada",   color:C.muted  },
];

interface Categoria { id_categoria: number; nombre: string; }
interface Tecnica    { id_tecnica:   number; nombre: string; }
interface Artista    { id_artista:   number; nombre_completo: string; nombre_artistico?: string; }

// ── Sidebar ───────────────────────────────────────────────────
function Sidebar({ navigate }: { navigate: any }) {
  const active   = "obras";
  const userName = authService.getUserName?.() || "A";

  return (
    <div style={{
      width: 220, minHeight: "100vh",
      background: C.sidebar,
      borderRight: `1px solid ${C.border}`,
      backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
      display: "flex", flexDirection: "column",
      position: "sticky", top: 0, height: "100vh", flexShrink: 0, zIndex: 40,
    }}>
      <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${C.border}` }}>
        <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: `linear-gradient(135deg, ${C.orange}, ${C.pink})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 14px ${C.orange}40` }}>
            <Palette size={18} color="white" strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.text, lineHeight: 1 }}>Altar Studio</div>
            <div style={{ fontSize: 10.5, color: C.muted, marginTop: 2, letterSpacing: "0.04em" }}>Panel Admin</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px 10px" }}>Navegación</div>
        {NAV.map(({ id, label, icon: Icon, color, path }) => {
          const on = active === id;
          return (
            <button key={id} onClick={() => navigate(path)} style={{
              width: "100%", border: "none", cursor: "pointer",
              background: on ? `${color}15` : "transparent",
              borderRadius: 10, padding: "10px 12px",
              display: "flex", alignItems: "center", gap: 10,
              transition: "all .15s", position: "relative",
              fontFamily: "'Outfit', sans-serif",
            }}
              onMouseEnter={e => { if (!on) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { if (!on) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              {on && <div style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: 3, borderRadius: "0 3px 3px 0", background: `linear-gradient(180deg, ${color}, ${color}80)` }} />}
              <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: on ? `${color}20` : "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={16} color={on ? color : "rgba(255,255,255,0.35)"} strokeWidth={on ? 2.2 : 1.8} />
              </div>
              <span style={{ fontSize: 13.5, fontWeight: on ? 700 : 500, color: on ? C.text : "rgba(255,255,255,0.45)" }}>{label}</span>
              {on && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: color }} />}
            </button>
          );
        })}
      </div>

      <div style={{ padding: "12px 10px 20px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: `linear-gradient(135deg, ${C.pink}, ${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "white" }}>
            {userName?.[0]?.toUpperCase() || "A"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</div>
            <div style={{ fontSize: 11, color: C.muted }}>Administrador</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, padding: "8px 12px 0" }}>
          <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px", borderRadius: 8, border: `1px solid ${C.border}`, background: "rgba(255,255,255,0.03)", cursor: "pointer", fontSize: 11.5, color: C.muted, fontWeight: 600, fontFamily: "'Outfit',sans-serif", transition: "all .15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"; (e.currentTarget as HTMLElement).style.color = C.text; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.muted; }}
          ><Settings size={13} strokeWidth={1.8} /> Config</button>
          <button onClick={() => { authService.logout(); navigate("/login"); }} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px", borderRadius: 8, border: `1px solid rgba(204,89,173,0.2)`, background: "rgba(204,89,173,0.06)", cursor: "pointer", fontSize: 11.5, color: C.pink, fontWeight: 600, fontFamily: "'Outfit',sans-serif", transition: "all .15s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(204,89,173,0.14)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(204,89,173,0.06)"}
          ><LogOut size={13} strokeWidth={1.8} /> Salir</button>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────
function inputStyle(focused: boolean, disabled: boolean): React.CSSProperties {
  return {
    width: "100%", padding: "11px 14px", boxSizing: "border-box",
    background: focused ? "rgba(255,132,14,0.06)" : C.input,
    border: `1.5px solid ${focused ? C.orange : C.inputBorder}`,
    borderRadius: 10, fontSize: 13.5, color: C.text, outline: "none",
    transition: "border-color .15s, background .15s",
    fontFamily: "'Outfit', sans-serif",
    opacity: disabled ? 0.5 : 1,
  };
}

function FieldLabel({ children, req }: { children: React.ReactNode; req?: boolean }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 8, display: "flex", alignItems: "center", gap: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>
      {children}
      {req && <span style={{ color: C.orange, fontSize: 14, lineHeight: 1 }}>*</span>}
    </div>
  );
}

function SectionCard({ title, icon: Icon, accent, children }: { title: string; icon: any; accent: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 18, overflow: "hidden", marginBottom: 16,
      backdropFilter: "blur(20px)", position: "relative",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `${accent}18`, border: `1px solid ${accent}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={14} color={accent} strokeWidth={2.2} />
        </div>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: C.text }}>{title}</span>
        <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${accent}20, transparent)` }} />
      </div>
      <div style={{ padding: "20px" }}>{children}</div>
    </div>
  );
}

function Toggle({ label, name, checked, onChange, disabled, icon: Icon, accent }: any) {
  return (
    <label style={{
      display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10,
      cursor: disabled ? "not-allowed" : "pointer",
      border: `1.5px solid ${checked ? `${accent}50` : C.border}`,
      background: checked ? `${accent}10` : "rgba(255,255,255,0.02)",
      transition: "all .15s", userSelect: "none",
    }}>
      <div style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, border: `2px solid ${checked ? accent : "rgba(255,255,255,0.2)"}`, background: checked ? accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}>
        {checked && <CheckCircle2 size={11} color="white" strokeWidth={3} />}
      </div>
      <input type="checkbox" name={name} checked={checked} onChange={onChange} disabled={disabled} style={{ display: "none" }} />
      <Icon size={14} color={checked ? accent : C.muted} strokeWidth={2} />
      <span style={{ fontSize: 13, fontWeight: checked ? 600 : 400, color: checked ? C.text : C.muted }}>{label}</span>
    </label>
  );
}

// ── Main component ────────────────────────────────────────────
export default function EditarObra() {
  const navigate      = useNavigate();
  const { id }        = useParams<{ id: string }>();

  const [loading,     setLoading]     = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [mensaje,     setMensaje]     = useState("");
  const [isError,     setIsError]     = useState(false);
  const [focused,     setFocused]     = useState<string | null>(null);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tecnicas,   setTecnicas]   = useState<Tecnica[]>([]);
  const [artistas,   setArtistas]   = useState<Artista[]>([]);

  const [formData, setFormData] = useState({
    titulo: "", descripcion: "", id_categoria: 0, id_tecnica: 0,
    id_artista: 0, precio_base: 0, anio_creacion: new Date().getFullYear(),
    dimensiones_alto: "", dimensiones_ancho: "", dimensiones_profundidad: "",
    permite_marco: true, con_certificado: false, imagen_principal: "", estado: "pendiente",
  });

  useEffect(() => {
    (async () => {
      try {
        const [cR, tR, aR] = await Promise.all([
          obraService.getCategorias(),
          obraService.getTecnicas(),
          obraService.getArtistas(),
        ]);
        setCategorias(cR.categorias || []);
        setTecnicas(tR.tecnicas || []);
        setArtistas(aR.artistas || []);

        const res  = await fetch(`${API_URL}/api/obras/${id}`, {
          headers: { Authorization: `Bearer ${authService.getToken()}` },
        });
        const json = await res.json();
        if (json.success && json.data) {
          const o = json.data;
          setFormData({
            titulo:                  o.titulo || "",
            descripcion:             o.descripcion || "",
            id_categoria:            o.id_categoria || 0,
            id_tecnica:              o.id_tecnica || 0,
            id_artista:              o.id_artista || 0,
            precio_base:             o.precio_base || 0,
            anio_creacion:           o.anio_creacion || new Date().getFullYear(),
            dimensiones_alto:        o.dimensiones_alto || "",
            dimensiones_ancho:       o.dimensiones_ancho || "",
            dimensiones_profundidad: o.dimensiones_profundidad || "",
            permite_marco:           o.permite_marco ?? true,
            con_certificado:         o.con_certificado ?? false,
            imagen_principal:        o.imagen_principal || "",
            estado:                  o.estado || "pendiente",
          });
        } else {
          flash("No se encontró la obra", true);
        }
      } catch { flash("Error al cargar los datos", true); }
      finally { setLoadingData(false); }
    })();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") setFormData(p => ({ ...p, [name]: (e.target as HTMLInputElement).checked }));
    else if (type === "number") setFormData(p => ({ ...p, [name]: value === "" ? "" : Number(value) } as any));
    else setFormData(p => ({ ...p, [name]: value }));
  };

  const flash = (msg: string, err: boolean) => {
    setMensaje(msg); setIsError(err);
    setTimeout(() => setMensaje(""), 5000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.titulo || !formData.descripcion) return flash("Completa título y descripción", true);
    if (!formData.id_categoria) return flash("Selecciona una categoría", true);
    if (!formData.id_artista)   return flash("Selecciona un artista", true);
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/obras/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authService.getToken()}` },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Error al actualizar");
      flash("¡Obra actualizada exitosamente!", false);
      setTimeout(() => navigate("/admin/obras"), 1500);
    } catch (err: any) {
      flash(err.message || "Error al actualizar la obra", true);
    } finally { setLoading(false); }
  };

  const fi = (name: string) => ({
    onFocus: () => setFocused(name),
    onBlur:  () => setFocused(null),
  });

  const currentArtist = artistas.find(a => a.id_artista === Number(formData.id_artista));
  const currentCat    = categorias.find(c => c.id_categoria === Number(formData.id_categoria));
  const currentEstado = ESTADOS_OPTS.find(e => e.val === formData.estado);

  // ── Loading screen ────────────────────────────────────────
  if (loadingData) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: C.bg, fontFamily: "'Outfit',sans-serif", gap: 12, color: C.muted }}>
      <Loader2 size={22} style={{ animation: "spin 1s linear infinite", color: C.orange }} />
      <span style={{ fontSize: 14 }}>Cargando obra…</span>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Outfit',sans-serif", color: C.text, position: "relative" }}>

      {/* Background orbs */}
      <div style={{ position: "fixed", top: -120, right: -120, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${C.pink}12, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -100, left: 200, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}10, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "40%", right: "25%", width: 350, height: 350, borderRadius: "50%", background: `radial-gradient(circle, ${C.orange}06, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

      <Sidebar navigate={navigate} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative", zIndex: 1 }}>

        {/* Topbar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 28px",
          background: "rgba(10,7,20,0.8)",
          borderBottom: `1px solid ${C.border}`,
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          position: "sticky", top: 0, zIndex: 30,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => navigate("/admin/obras")}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 9, padding: "8px 14px", cursor: "pointer", color: C.muted, fontSize: 13, fontWeight: 500, fontFamily: "'Outfit',sans-serif", transition: "all .15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${C.orange}50`; (e.currentTarget as HTMLElement).style.color = C.orange; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.muted; }}
            >
              <ArrowLeft size={14} strokeWidth={2} /> Obras
            </button>
            <div style={{ width: 1, height: 22, background: C.border }} />
            <div>
              <div style={{ fontSize: 17, fontWeight: 900, color: C.text, lineHeight: 1 }}>Editar Obra</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>
                ID <span style={{ color: C.orange, fontWeight: 700 }}>#{id}</span>
                {currentEstado && (
                  <span style={{ marginLeft: 10, padding: "2px 9px", borderRadius: 20, background: `${currentEstado.color}18`, border: `1px solid ${currentEstado.color}30`, color: currentEstado.color, fontSize: 11, fontWeight: 700 }}>
                    {currentEstado.label}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={() => navigate("/admin/obras")} disabled={loading}
              style={{ padding: "9px 18px", borderRadius: 9, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit',sans-serif", transition: "all .15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)"; (e.currentTarget as HTMLElement).style.color = C.text; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.muted; }}
            >
              Cancelar
            </button>
            <button form="editar-form" type="submit" disabled={loading}
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 20px", borderRadius: 9, border: "none", background: loading ? "rgba(255,132,14,0.4)" : `linear-gradient(135deg, ${C.orange}, ${C.pink})`, color: "white", fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Outfit',sans-serif", boxShadow: loading ? "none" : `0 6px 20px ${C.orange}35`, transition: "transform .15s, box-shadow .15s" }}
              onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 10px 28px ${C.orange}50`; } }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = loading ? "none" : `0 6px 20px ${C.orange}35`; }}
            >
              {loading
                ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Guardando…</>
                : <><Save size={15} strokeWidth={2.5} /> Guardar Cambios</>
              }
            </button>
          </div>
        </div>

        {/* Main */}
        <main style={{ flex: 1, padding: "28px", overflowY: "auto" }}>

          {/* Alert */}
          {mensaje && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 16px", borderRadius: 12, marginBottom: 22, background: isError ? "rgba(204,89,173,0.12)" : "rgba(74,222,128,0.1)", border: `1px solid ${isError ? `${C.pink}40` : "rgba(74,222,128,0.3)"}`, color: isError ? C.pink : "#4ADE80", fontSize: 13, fontWeight: 600, animation: "msgIn .25s ease" }}>
              {isError ? <AlertCircle size={16} strokeWidth={2.5} /> : <CheckCircle2 size={16} strokeWidth={2.5} />}
              {mensaje}
            </div>
          )}

          <form id="editar-form" onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, alignItems: "start" }}>

              {/* ── Left ── */}
              <div>
                <SectionCard title="Información básica" icon={Type} accent={C.orange}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <FieldLabel req>Título de la obra</FieldLabel>
                      <input name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Ej: Amanecer en la Huasteca" required disabled={loading} style={inputStyle(focused === "titulo", loading)} {...fi("titulo")} />
                    </div>
                    <div>
                      <FieldLabel req><FileText size={11} /> Descripción</FieldLabel>
                      <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Describe la obra…" rows={4} required disabled={loading} style={{ ...inputStyle(focused === "desc", loading), resize: "vertical" as const }} {...fi("desc")} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <div>
                        <FieldLabel req><Tag size={11} /> Categoría</FieldLabel>
                        <select name="id_categoria" value={formData.id_categoria} onChange={handleChange} required disabled={loading} style={inputStyle(focused === "cat", loading)} {...fi("cat")}>
                          <option value="0">Seleccionar…</option>
                          {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
                        </select>
                      </div>
                      <div>
                        <FieldLabel><Palette size={11} /> Técnica</FieldLabel>
                        <select name="id_tecnica" value={formData.id_tecnica || ""} onChange={handleChange} disabled={loading} style={inputStyle(focused === "tec", loading)} {...fi("tec")}>
                          <option value="">Sin técnica</option>
                          {tecnicas.map(t => <option key={t.id_tecnica} value={t.id_tecnica}>{t.nombre}</option>)}
                        </select>
                      </div>
                      <div>
                        <FieldLabel req><Users size={11} /> Artista</FieldLabel>
                        <select name="id_artista" value={formData.id_artista} onChange={handleChange} required disabled={loading} style={inputStyle(focused === "art", loading)} {...fi("art")}>
                          <option value="0">Seleccionar…</option>
                          {artistas.map(a => <option key={a.id_artista} value={a.id_artista}>{a.nombre_artistico || a.nombre_completo}</option>)}
                        </select>
                      </div>
                      <div>
                        <FieldLabel><Calendar size={11} /> Año de creación</FieldLabel>
                        <input type="number" name="anio_creacion" value={formData.anio_creacion || ""} onChange={handleChange} min="1900" max={new Date().getFullYear()} disabled={loading} style={inputStyle(focused === "anio", loading)} {...fi("anio")} />
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Dimensiones (cm)" icon={Ruler} accent={C.blue}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                    {[
                      { name: "dimensiones_alto",        label: "Alto",        ph: "50" },
                      { name: "dimensiones_ancho",       label: "Ancho",       ph: "70" },
                      { name: "dimensiones_profundidad", label: "Profundidad", ph: "5"  },
                    ].map(({ name, label, ph }) => (
                      <div key={name}>
                        <FieldLabel>{label}</FieldLabel>
                        <input type="number" name={name} value={(formData as any)[name] || ""} onChange={handleChange} placeholder={ph} step="0.01" min="0" disabled={loading} style={inputStyle(focused === name, loading)} {...fi(name)} />
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Opciones adicionales" icon={Award} accent={C.purple}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Toggle label="Permite marco personalizado" name="permite_marco" checked={formData.permite_marco} onChange={handleChange} disabled={loading} icon={Frame} accent={C.purple} />
                    <Toggle label="Incluye certificado de autenticidad" name="con_certificado" checked={formData.con_certificado} onChange={handleChange} disabled={loading} icon={Award} accent={C.gold} />
                  </div>
                </SectionCard>

                {/* Estado de publicación */}
                <SectionCard title="Estado de publicación" icon={CheckCircle2} accent={C.orange}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                    {ESTADOS_OPTS.map(({ val, label, color }) => {
                      const active = formData.estado === val;
                      return (
                        <button key={val} type="button"
                          onClick={() => setFormData(p => ({ ...p, estado: val }))}
                          style={{
                            padding: "11px 8px", borderRadius: 10,
                            border: `1.5px solid ${active ? `${color}60` : C.border}`,
                            background: active ? `${color}18` : "rgba(255,255,255,0.02)",
                            color: active ? color : C.muted,
                            fontWeight: active ? 700 : 400, fontSize: 12.5,
                            cursor: "pointer", fontFamily: "'Outfit',sans-serif",
                            transition: "all .15s",
                            boxShadow: active ? `0 4px 14px ${color}20` : "none",
                          }}
                          onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.borderColor = `${color}35`; (e.currentTarget as HTMLElement).style.color = color; } }}
                          onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.muted; } }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </SectionCard>
              </div>

              {/* ── Right ── */}
              <div>
                {/* Precio */}
                <SectionCard title="Precio" icon={DollarSign} accent={C.gold}>
                  <FieldLabel req>Precio base (MXN)</FieldLabel>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 14, fontWeight: 800, color: C.gold, pointerEvents: "none" }}>$</span>
                    <input type="number" name="precio_base" value={formData.precio_base || ""} onChange={handleChange} placeholder="2,500" step="0.01" min="0" disabled={loading} style={{ ...inputStyle(focused === "precio", loading), paddingLeft: 30 }} {...fi("precio")} />
                  </div>
                  {Number(formData.precio_base) > 0 && (
                    <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 10, background: `${C.gold}12`, border: `1px solid ${C.gold}25`, display: "flex", justifyContent: "space-between", fontSize: 13, color: C.gold, fontWeight: 700 }}>
                      <span>Total estimado</span>
                      <span>${Number(formData.precio_base).toLocaleString("es-MX")} MXN</span>
                    </div>
                  )}
                </SectionCard>

                {/* Imagen */}
                <SectionCard title="Imagen principal" icon={ImageIcon} accent={C.pink}>
                  <FieldLabel><LinkIcon size={11} /> URL de imagen</FieldLabel>
                  <input type="url" name="imagen_principal" value={formData.imagen_principal || ""} onChange={handleChange} placeholder="https://…/imagen.jpg" disabled={loading} style={inputStyle(focused === "img", loading)} {...fi("img")} />
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 7, marginBottom: 14 }}>Imgur, Cloudinary u otro servicio.</div>
                  <div style={{ borderRadius: 12, overflow: "hidden", border: `1.5px dashed ${formData.imagen_principal ? `${C.pink}60` : C.border}`, height: 180, background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color .2s" }}>
                    {formData.imagen_principal ? (
                      <img src={formData.imagen_principal} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    ) : (
                      <div style={{ textAlign: "center", color: C.muted }}>
                        <ImageIcon size={30} strokeWidth={1.2} style={{ marginBottom: 8, opacity: 0.3 }} />
                        <div style={{ fontSize: 12 }}>Vista previa</div>
                      </div>
                    )}
                  </div>
                </SectionCard>

                {/* Resumen */}
                <div style={{ background: C.surface, borderRadius: 18, border: `1px solid ${C.border}`, padding: "20px", backdropFilter: "blur(20px)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", bottom: -30, right: -30, width: 100, height: 100, borderRadius: "50%", background: `radial-gradient(circle, ${C.orange}12, transparent 70%)`, pointerEvents: "none" }} />
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Resumen</div>
                  {[
                    { label: "Título",    val: formData.titulo || "—",   color: undefined },
                    { label: "Artista",   val: currentArtist?.nombre_artistico || currentArtist?.nombre_completo || "—", color: undefined },
                    { label: "Categoría", val: currentCat?.nombre || "—", color: undefined },
                    { label: "Precio",    val: formData.precio_base ? `$${Number(formData.precio_base).toLocaleString("es-MX")}` : "—", color: undefined },
                    { label: "Estado",    val: currentEstado?.label || "—", color: currentEstado?.color },
                  ].map(({ label, val, color }, i, arr) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, borderBottom: i < arr.length - 1 ? `1px solid rgba(255,255,255,0.05)` : "none", paddingBottom: 10, marginBottom: 10 }}>
                      <span style={{ color: C.muted }}>{label}</span>
                      <span style={{ fontWeight: 600, color: color || C.text, maxWidth: 160, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </form>
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        @keyframes spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes msgIn  { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
        select option { background: #1a1030; color: #ffffff; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}