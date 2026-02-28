// src/pages/private/admin/EditarArtista.tsx
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Save, Image as ImageIcon, AlertCircle,
  CheckCircle2, Loader2, Palette, Users, Tag,
  DollarSign, Award, Link as LinkIcon, Type,
  FileText, Phone, Mail, Hash, RefreshCw,
  LayoutDashboard, ShoppingBag, BarChart2, Settings, LogOut
} from "lucide-react";
import { authService } from "../../../services/authService";
import { obraService } from "../../../services/obraService";

// ── Design tokens ────────────────────────────────────────────
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

const ESTADOS = [
  { val:"activo",     label:"Activo",     color:C.orange },
  { val:"pendiente",  label:"Pendiente",  color:C.gold   },
  { val:"inactivo",   label:"Inactivo",   color:C.muted  },
  { val:"suspendido", label:"Suspendido", color:C.pink   },
];

// ── Sidebar ──────────────────────────────────────────────────
function Sidebar({ navigate }: { navigate: any }) {
  const active   = "artistas";
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
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
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
          <button onClick={() => { authService.logout(); navigate("/login"); }} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px", borderRadius: 8, border: `1px solid rgba(204,89,173,0.2)`, background: "rgba(204,89,173,0.06)", cursor: "pointer", fontSize: 11.5, color: C.pink, fontWeight: 600, fontFamily: "'Outfit',sans-serif", transition: "background .15s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(204,89,173,0.14)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(204,89,173,0.06)"}
          ><LogOut size={13} strokeWidth={1.8} /> Salir</button>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────
function inputStyle(focused: boolean, disabled: boolean): React.CSSProperties {
  return {
    width: "100%", padding: "11px 14px", boxSizing: "border-box",
    background: focused ? "rgba(204,89,173,0.06)" : C.input,
    border: `1.5px solid ${focused ? C.pink : C.inputBorder}`,
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
      {req && <span style={{ color: C.pink, fontSize: 14, lineHeight: 1 }}>*</span>}
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

// ── Main component ───────────────────────────────────────────
export default function EditarArtista() {
  const navigate    = useNavigate();
  const { id }      = useParams<{ id: string }>();
  const [loading,     setLoading]     = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [mensaje,     setMensaje]     = useState("");
  const [isError,     setIsError]     = useState(false);
  const [focused,     setFocused]     = useState<string | null>(null);
  const [categorias,  setCategorias]  = useState<any[]>([]);

  const [formData, setFormData] = useState({
    nombre_completo:"", nombre_artistico:"", biografia:"",
    foto_perfil:"", correo:"", telefono:"", matricula:"",
    id_categoria_principal:"", porcentaje_comision:15, estado:"pendiente",
  });

  useEffect(() => {
    (async () => {
      try {
        const [cR, artRes] = await Promise.all([
          obraService.getCategorias(),
          fetch(`${API_URL}/api/artistas/${id}`, { headers:{ Authorization:`Bearer ${authService.getToken()}` } })
        ]);
        setCategorias(cR.categorias || []);
        const json = await artRes.json();
        if (json.success && json.data) {
          const a = json.data;
          setFormData({
            nombre_completo:        a.nombre_completo        || "",
            nombre_artistico:       a.nombre_artistico       || "",
            biografia:              a.biografia              || "",
            foto_perfil:            a.foto_perfil            || "",
            correo:                 a.correo                 || "",
            telefono:               a.telefono               || "",
            matricula:              a.matricula              || "",
            id_categoria_principal: a.id_categoria_principal || "",
            porcentaje_comision:    a.porcentaje_comision    || 15,
            estado:                 a.estado                 || "pendiente",
          });
        } else { flash("No se encontró el artista", true); }
      } catch { flash("Error al cargar datos", true); }
      finally { setLoadingData(false); }
    })();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "number") setFormData(p => ({ ...p, [name]: value === "" ? "" : Number(value) } as any));
    else setFormData(p => ({ ...p, [name]: value }));
  };

  const flash = (msg: string, err: boolean) => {
    setMensaje(msg); setIsError(err);
    setTimeout(() => setMensaje(""), 5000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.nombre_completo) return flash("El nombre completo es obligatorio", true);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/artistas/${id}`, {
        method: "PUT",
        headers: { "Content-Type":"application/json", Authorization:`Bearer ${authService.getToken()}` },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Error al actualizar");
      flash("Artista actualizado exitosamente", false);
      setTimeout(() => navigate("/admin/artistas"), 1500);
    } catch (err: any) {
      flash(err.message || "Error al actualizar el artista", true);
    } finally { setLoading(false); }
  };

  const fi = (name: string) => ({
    onFocus: () => setFocused(name),
    onBlur:  () => setFocused(null),
  });

  const initials = formData.nombre_completo
    ? formData.nombre_completo.split(" ").slice(0,2).map((n:string) => n[0]).join("").toUpperCase()
    : "?";

  const categoriaActual = categorias.find(c => String(c.id_categoria) === String(formData.id_categoria_principal));
  const estadoActual    = ESTADOS.find(e => e.val === formData.estado);

  if (loadingData) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", background:C.bg, fontFamily:"'Outfit',sans-serif", gap:12, color:C.muted }}>
      <RefreshCw size={22} style={{ animation:"spin 1s linear infinite" }} color={C.pink} />
      <span>Cargando artista…</span>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, fontFamily:"'Outfit',sans-serif", color:C.text, position:"relative" }}>

      {/* Background orbs */}
      <div style={{ position:"fixed", top:-120, right:-120, width:500, height:500, borderRadius:"50%", background:`radial-gradient(circle, ${C.pink}12, transparent 70%)`, pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"fixed", bottom:-100, left:200, width:500, height:500, borderRadius:"50%", background:`radial-gradient(circle, ${C.purple}10, transparent 70%)`, pointerEvents:"none", zIndex:0 }} />

      <Sidebar navigate={navigate} />

      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, position:"relative", zIndex:1 }}>

        {/* Topbar */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"14px 28px",
          background:"rgba(10,7,20,0.8)",
          borderBottom:`1px solid ${C.border}`,
          backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
          position:"sticky", top:0, zIndex:30,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <button onClick={() => navigate("/admin/artistas")} style={{
              display:"flex", alignItems:"center", gap:6,
              background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`,
              borderRadius:9, padding:"8px 14px",
              cursor:"pointer", color:C.muted, fontSize:13, fontWeight:500,
              fontFamily:"'Outfit',sans-serif", transition:"all .15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor=`${C.pink}50`; (e.currentTarget as HTMLElement).style.color=C.pink; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor=C.border; (e.currentTarget as HTMLElement).style.color=C.muted; }}
            >
              <ArrowLeft size={14} strokeWidth={2} /> Artistas
            </button>
            <div style={{ width:1, height:22, background:C.border }} />
            <div>
              <div style={{ fontSize:17, fontWeight:900, color:C.text, lineHeight:1 }}>Editar Artista</div>
              <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>{formData.nombre_completo || "Cargando…"}</div>
            </div>
          </div>

          <div style={{ display:"flex", gap:10 }}>
            <button onClick={() => navigate("/admin/artistas")} disabled={loading} style={{
              padding:"9px 18px", borderRadius:9, border:`1px solid ${C.border}`,
              background:"transparent", color:C.muted, fontSize:13, fontWeight:600,
              cursor:"pointer", fontFamily:"'Outfit',sans-serif", transition:"all .15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,0.2)"; (e.currentTarget as HTMLElement).style.color=C.text; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor=C.border; (e.currentTarget as HTMLElement).style.color=C.muted; }}
            >Cancelar</button>

            <button form="artista-edit-form" type="submit" disabled={loading} style={{
              display:"flex", alignItems:"center", gap:7,
              padding:"9px 20px", borderRadius:9, border:"none",
              background: loading ? "rgba(204,89,173,0.4)" : `linear-gradient(135deg, ${C.pink}, ${C.purple})`,
              color:"white", fontSize:13, fontWeight:700,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily:"'Outfit',sans-serif",
              boxShadow: loading ? "none" : `0 6px 20px ${C.pink}35`,
              transition:"transform .15s, box-shadow .15s",
            }}
              onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLElement).style.transform="translateY(-1px)"; (e.currentTarget as HTMLElement).style.boxShadow=`0 10px 28px ${C.pink}50`; } }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform="translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow=loading?"none":`0 6px 20px ${C.pink}35`; }}
            >
              {loading
                ? <><Loader2 size={15} style={{ animation:"spin 1s linear infinite" }} /> Guardando…</>
                : <><Save size={15} strokeWidth={2.5} /> Guardar Cambios</>
              }
            </button>
          </div>
        </div>

        {/* Main */}
        <main style={{ flex:1, padding:"28px", overflowY:"auto" }}>

          {/* Alert */}
          {mensaje && (
            <div style={{
              display:"flex", alignItems:"center", gap:10,
              padding:"13px 16px", borderRadius:12, marginBottom:22,
              background: isError ? "rgba(204,89,173,0.12)" : "rgba(74,222,128,0.1)",
              border:`1px solid ${isError ? `${C.pink}40` : "rgba(74,222,128,0.3)"}`,
              color: isError ? C.pink : "#4ADE80",
              fontSize:13, fontWeight:600,
              animation:"msgIn .25s ease",
            }}>
              {isError ? <AlertCircle size={16} strokeWidth={2.5}/> : <CheckCircle2 size={16} strokeWidth={2.5}/>}
              {mensaje}
            </div>
          )}

          <form id="artista-edit-form" onSubmit={handleSubmit}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:16, alignItems:"start" }}>

              {/* ── Left column ── */}
              <div>
                <SectionCard title="Información personal" icon={Type} accent={C.pink}>
                  <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                      <div>
                        <FieldLabel req>Nombre completo</FieldLabel>
                        <input name="nombre_completo" value={formData.nombre_completo} onChange={handleChange}
                          required disabled={loading}
                          style={inputStyle(focused==="nc", loading)} {...fi("nc")} />
                      </div>
                      <div>
                        <FieldLabel>Nombre artístico</FieldLabel>
                        <input name="nombre_artistico" value={formData.nombre_artistico} onChange={handleChange}
                          disabled={loading}
                          style={inputStyle(focused==="na", loading)} {...fi("na")} />
                      </div>
                    </div>
                    <div>
                      <FieldLabel><FileText size={11}/> Biografía</FieldLabel>
                      <textarea name="biografia" value={formData.biografia} onChange={handleChange}
                        rows={4} disabled={loading}
                        style={{ ...inputStyle(focused==="bio", loading), resize:"vertical" as const }} {...fi("bio")} />
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Contacto" icon={Phone} accent={C.blue}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                    <div>
                      <FieldLabel><Mail size={11}/> Correo</FieldLabel>
                      <input type="email" name="correo" value={formData.correo} onChange={handleChange}
                        disabled={loading}
                        style={inputStyle(focused==="correo", loading)} {...fi("correo")} />
                    </div>
                    <div>
                      <FieldLabel><Phone size={11}/> Teléfono</FieldLabel>
                      <input name="telefono" value={formData.telefono} onChange={handleChange}
                        disabled={loading}
                        style={inputStyle(focused==="tel", loading)} {...fi("tel")} />
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Categoría y matrícula" icon={Tag} accent={C.purple}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                    <div>
                      <FieldLabel><Tag size={11}/> Categoría principal</FieldLabel>
                      <select name="id_categoria_principal" value={formData.id_categoria_principal}
                        onChange={handleChange} disabled={loading}
                        style={inputStyle(focused==="cat", loading)} {...fi("cat")}>
                        <option value="">Sin categoría</option>
                        {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
                      </select>
                    </div>
                    <div>
                      <FieldLabel><Hash size={11}/> Matrícula</FieldLabel>
                      <input name="matricula" value={formData.matricula} onChange={handleChange}
                        disabled={loading}
                        style={inputStyle(focused==="mat", loading)} {...fi("mat")} />
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Estado de registro" icon={Award} accent={C.orange}>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
                    {ESTADOS.map(({ val, label, color }) => {
                      const on = formData.estado === val;
                      return (
                        <button key={val} type="button"
                          onClick={() => setFormData(p => ({ ...p, estado: val }))}
                          style={{
                            padding:"10px 8px", borderRadius:10,
                            border:`1.5px solid ${on ? `${color}60` : C.border}`,
                            background: on ? `${color}15` : "rgba(255,255,255,0.02)",
                            color: on ? color : C.muted,
                            fontWeight: on ? 700 : 400, fontSize:12.5,
                            cursor:"pointer", fontFamily:"'Outfit',sans-serif",
                            transition:"all .15s",
                          }}
                          onMouseEnter={e => { if (!on) (e.currentTarget as HTMLElement).style.borderColor=`${color}30`; }}
                          onMouseLeave={e => { if (!on) (e.currentTarget as HTMLElement).style.borderColor=C.border; }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </SectionCard>
              </div>

              {/* ── Right column ── */}
              <div>

                {/* Avatar preview card */}
                <div style={{
                  background: C.surface, border:`1px solid ${C.border}`,
                  borderRadius:18, padding:"22px", marginBottom:16,
                  textAlign:"center", backdropFilter:"blur(20px)",
                  position:"relative", overflow:"hidden",
                }}>
                  {/* Ambient glow */}
                  <div style={{ position:"absolute", top:-30, left:"50%", transform:"translateX(-50%)", width:140, height:140, borderRadius:"50%", background:`radial-gradient(circle, ${C.pink}20, transparent 70%)`, pointerEvents:"none" }} />

                  <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:16, position:"relative" }}>
                    Vista previa
                  </div>

                  {/* Avatar */}
                  <div style={{
                    width:72, height:72, borderRadius:18,
                    background: formData.foto_perfil ? "transparent" : `${C.pink}18`,
                    border:`2px solid ${C.pink}35`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    margin:"0 auto 14px", overflow:"hidden", position:"relative",
                    boxShadow:`0 8px 24px ${C.pink}20`,
                  }}>
                    {formData.foto_perfil
                      ? <img src={formData.foto_perfil} alt="preview" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e => { (e.target as HTMLImageElement).style.display="none"; }} />
                      : <span style={{ fontSize:24, fontWeight:900, color:C.pink }}>{initials}</span>
                    }
                  </div>

                  <div style={{ fontSize:14, fontWeight:800, color:C.text, marginBottom:4 }}>
                    {formData.nombre_completo || <span style={{ color:C.muted, fontWeight:400 }}>Nombre completo</span>}
                  </div>
                  {formData.nombre_artistico && (
                    <div style={{ fontSize:12, color:C.muted, marginBottom:8 }}>✦ {formData.nombre_artistico}</div>
                  )}

                  <div style={{ display:"flex", justifyContent:"center", gap:6, flexWrap:"wrap", marginTop:8 }}>
                    {categoriaActual && (
                      <span style={{ fontSize:11.5, padding:"3px 11px", borderRadius:20, background:`${C.blue}15`, border:`1px solid ${C.blue}25`, color:C.blue, fontWeight:600 }}>
                        {categoriaActual.nombre}
                      </span>
                    )}
                    {estadoActual && (
                      <span style={{ fontSize:11.5, padding:"3px 11px", borderRadius:20, background:`${estadoActual.color}15`, border:`1px solid ${estadoActual.color}25`, color:estadoActual.color, fontWeight:600 }}>
                        {estadoActual.label}
                      </span>
                    )}
                  </div>
                </div>

                <SectionCard title="Foto de perfil" icon={ImageIcon} accent={C.pink}>
                  <FieldLabel><LinkIcon size={11}/> URL de foto</FieldLabel>
                  <input type="url" name="foto_perfil" value={formData.foto_perfil} onChange={handleChange}
                    placeholder="https://…/foto.jpg" disabled={loading}
                    style={inputStyle(focused==="foto", loading)} {...fi("foto")} />
                  <div style={{ fontSize:12, color:C.muted, marginTop:7 }}>Imgur, Cloudinary u otro servicio.</div>
                </SectionCard>

                <SectionCard title="Comisión" icon={DollarSign} accent={C.gold}>
                  <FieldLabel>Porcentaje (%)</FieldLabel>
                  <div style={{ position:"relative" }}>
                    <input type="number" name="porcentaje_comision" value={formData.porcentaje_comision}
                      onChange={handleChange} min="0" max="100" step="1" disabled={loading}
                      style={{ ...inputStyle(focused==="com", loading), paddingRight:34 }} {...fi("com")} />
                    <span style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", fontSize:14, fontWeight:800, color:C.gold, pointerEvents:"none" }}>%</span>
                  </div>
                  <div style={{
                    marginTop:10, padding:"10px 14px", borderRadius:10,
                    background:`${C.gold}10`, border:`1px solid ${C.gold}25`,
                    display:"flex", justifyContent:"space-between",
                    fontSize:12.5, color:C.gold, fontWeight:700,
                  }}>
                    <span>Por venta de $10,000</span>
                    <span>${(10000 * Number(formData.porcentaje_comision) / 100).toLocaleString("es-MX")} MXN</span>
                  </div>
                </SectionCard>

              </div>
            </div>
          </form>
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        @keyframes spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes msgIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
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