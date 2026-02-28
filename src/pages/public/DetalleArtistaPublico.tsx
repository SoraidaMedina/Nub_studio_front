// src/pages/public/DetalleArtistaPublico.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Palette, Mail, Phone, Award,
  ImageIcon, ChevronRight, RefreshCw, Star,
  MapPin, Sparkles
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const C = {
  orange:"#FF840E", blue:"#79AAF5", pink:"#CC59AD",
  purple:"#8D4CCD", gold:"#FFC110",
  text:"#1C1F26", muted:"#9CA3AF",
  bg:"#F8F6F2", surface:"#FFFFFF", border:"#E8EAF0",
};
const AVATAR_COLORS = [C.orange, C.pink, C.purple, C.blue, C.gold];

const ESTADO_OBRA: Record<string,{label:string;color:string}> = {
  publicada:{ label:"Disponible", color:C.orange },
  pendiente:{ label:"Próximamente", color:C.gold  },
  agotada:  { label:"Agotada",     color:C.muted  },
};

export default function DetalleArtistaPublico() {
  const navigate       = useNavigate();
  const { id }         = useParams<{ id: string }>();
  const [artista, setArtista] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0,0);
    (async () => {
      setLoading(true);
      try {
        const res  = await fetch(`${API_URL}/api/artistas/${id}`);
        const json = await res.json();
        if (json.success) setArtista(json.data);
      } catch { }
      finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh", gap:12, color:C.muted, fontFamily:"'Outfit',sans-serif" }}>
      <RefreshCw size={22} style={{ animation:"spin 1s linear infinite" }} /> Cargando…
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!artista) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh", gap:16, fontFamily:"'Outfit',sans-serif", color:C.muted }}>
      <div style={{ fontSize:18, fontWeight:700, color:C.text }}>Artista no encontrado</div>
      <button onClick={() => navigate("/artistas")} style={{ padding:"10px 24px", borderRadius:10, background:C.pink, color:"white", border:"none", fontWeight:700, cursor:"pointer", fontFamily:"'Outfit',sans-serif" }}>
        Ver artistas
      </button>
    </div>
  );

  const color    = AVATAR_COLORS[artista.id_artista % AVATAR_COLORS.length];
  const initials = artista.nombre_completo?.split(" ").slice(0,2).map((n:string)=>n[0]).join("").toUpperCase() || "?";
  const obras    = artista.obras?.filter((o:any) => o.estado === "publicada") || [];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Outfit',sans-serif" }}>

      {/* breadcrumb */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"12px 0" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", display:"flex", alignItems:"center", gap:8, fontSize:13, color:C.muted }}>
          <button onClick={() => navigate("/")} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, fontFamily:"'Outfit',sans-serif", fontSize:13 }}>Inicio</button>
          <ChevronRight size={13} strokeWidth={1.8} />
          <button onClick={() => navigate("/artistas")} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, fontFamily:"'Outfit',sans-serif", fontSize:13 }}>Artistas</button>
          <ChevronRight size={13} strokeWidth={1.8} />
          <span style={{ color:C.text, fontWeight:600 }}>{artista.nombre_artistico || artista.nombre_completo}</span>
        </div>
      </div>

      {/* hero del artista */}
      <div style={{ background:`linear-gradient(135deg, #1C1F26 0%, #2d1b4e 60%, #1a1230 100%)`, padding:"48px 0 0", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-80, right:-80, width:320, height:320, borderRadius:"50%", background:`${color}08` }} />
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", position:"relative" }}>
          <button onClick={() => navigate("/artistas")} style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:8, padding:"7px 14px", cursor:"pointer", color:"rgba(255,255,255,0.7)", fontSize:13, fontWeight:500, fontFamily:"'Outfit',sans-serif", marginBottom:28 }}>
            <ArrowLeft size={14} strokeWidth={2} /> Artistas
          </button>

          <div style={{ display:"flex", alignItems:"flex-end", gap:28, paddingBottom:32, flexWrap:"wrap" }} className="artista-hero-row">
            {/* avatar */}
            <div style={{ width:100, height:100, borderRadius:24, border:`4px solid ${color}`, overflow:"hidden", background:`${color}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:`0 8px 32px ${color}40` }}>
              {artista.foto_perfil
                ? <img src={artista.foto_perfil} alt={artista.nombre_completo} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                : <span style={{ fontSize:36, fontWeight:900, color }}>{initials}</span>
              }
            </div>

            {/* info */}
            <div style={{ flex:1, minWidth:200 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <Sparkles size={14} color={C.gold} strokeWidth={2} />
                <span style={{ fontSize:12, fontWeight:700, color:C.gold, letterSpacing:"1px", textTransform:"uppercase" }}>Artista certificado</span>
              </div>
              <h1 style={{ fontSize:32, fontWeight:900, color:"white", margin:"0 0 4px", lineHeight:1.1 }}>{artista.nombre_completo}</h1>
              {artista.nombre_artistico && (
                <div style={{ fontSize:16, color, fontWeight:600, marginBottom:10 }}>✦ {artista.nombre_artistico}</div>
              )}
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {artista.categoria_nombre && (
                  <span style={{ fontSize:12.5, padding:"4px 12px", borderRadius:20, background:`${color}20`, color, fontWeight:700, border:`1px solid ${color}30` }}>{artista.categoria_nombre}</span>
                )}
                {artista.matricula && (
                  <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12.5, padding:"4px 12px", borderRadius:20, background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.7)", fontWeight:600 }}>
                    <Award size={11} strokeWidth={2} /> Matrícula certificada
                  </span>
                )}
              </div>
            </div>

            {/* stats */}
            <div style={{ display:"flex", gap:0, background:"rgba(255,255,255,0.05)", borderRadius:14, border:"1px solid rgba(255,255,255,0.08)", overflow:"hidden", flexShrink:0 }}>
              {[
                { label:"Obras",    value:artista.total_obras || 0,    color:C.orange },
                { label:"Públicas", value:obras.length,                color:C.gold   },
              ].map(({ label, value, color:c }, i) => (
                <div key={label} style={{ padding:"16px 24px", textAlign:"center", borderRight: i===0 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                  <div style={{ fontSize:24, fontWeight:900, color:c }}>{value}</div>
                  <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.5px", marginTop:3 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* contenido */}
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:24, alignItems:"start" }} className="artista-content-grid">

          {/* columna izquierda */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {/* biografía */}
            {artista.biografia && (
              <div style={{ background:C.surface, borderRadius:14, border:`1px solid ${C.border}`, padding:"20px" }}>
                <div style={{ fontSize:12, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:12 }}>Acerca del artista</div>
                <p style={{ fontSize:14, color:C.text, lineHeight:1.8, margin:0 }}>{artista.biografia}</p>
              </div>
            )}

            {/* contacto */}
            <div style={{ background:C.surface, borderRadius:14, border:`1px solid ${C.border}`, padding:"20px" }}>
              <div style={{ fontSize:12, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:14 }}>Contacto</div>
              {[
                { icon:Mail,    value:artista.correo,   label:"Correo"   },
                { icon:Phone,   value:artista.telefono, label:"Teléfono" },
                { icon:MapPin,  value:"Hidalgo, México",label:"Ubicación"},
              ].map(({ icon:Icon, value, label }) => (
                value && (
                  <div key={label} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                    <div style={{ width:30, height:30, borderRadius:8, background:`${C.pink}10`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Icon size={13} color={C.pink} strokeWidth={2} />
                    </div>
                    <div>
                      <div style={{ fontSize:10.5, color:C.muted, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.5px" }}>{label}</div>
                      <div style={{ fontSize:13, color:C.text }}>{value}</div>
                    </div>
                  </div>
                )
              ))}
              <button style={{ width:"100%", marginTop:8, padding:"11px", borderRadius:10, background:`linear-gradient(135deg,${C.pink},${C.purple})`, border:"none", color:"white", fontWeight:700, fontSize:13.5, cursor:"pointer", fontFamily:"'Outfit',sans-serif", boxShadow:`0 4px 16px ${C.pink}30` }}
                onClick={() => navigate("/contacto")}>
                <Mail size={14} style={{ verticalAlign:"middle", marginRight:6 }} strokeWidth={2.5} />
                Contactar artista
              </button>
            </div>
          </div>

          {/* columna derecha — obras */}
          <div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:28, height:28, borderRadius:7, background:`${C.orange}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Palette size={14} color={C.orange} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize:16, fontWeight:800, color:C.text }}>Obras disponibles</span>
                <span style={{ fontSize:12, padding:"2px 9px", borderRadius:20, background:`${C.orange}12`, color:C.orange, fontWeight:700 }}>{obras.length}</span>
              </div>
              {obras.length > 0 && (
                <button onClick={() => navigate(`/catalogo?artista=${artista.id_artista}`)}
                  style={{ fontSize:13, color:C.orange, background:"transparent", border:"none", cursor:"pointer", fontWeight:600, display:"flex", alignItems:"center", gap:4, fontFamily:"'Outfit',sans-serif" }}>
                  Ver en catálogo <ChevronRight size={13} strokeWidth={2.5} />
                </button>
              )}
            </div>

            {obras.length === 0 ? (
              <div style={{ background:C.surface, borderRadius:14, border:`1px solid ${C.border}`, padding:"60px 20px", textAlign:"center", color:C.muted }}>
                <ImageIcon size={40} strokeWidth={1.2} style={{ opacity:.2, marginBottom:12 }} />
                <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:6 }}>Sin obras publicadas aún</div>
                <div style={{ fontSize:13 }}>Este artista pronto tendrá obras disponibles</div>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:16 }}>
                {artista.obras?.map((obra:any) => {
                  const est = ESTADO_OBRA[obra.estado] || ESTADO_OBRA.pendiente;
                  return (
                    <div key={obra.id_obra}
                      onClick={() => obra.slug && navigate(`/obras/${obra.slug}`)}
                      style={{ background:C.surface, borderRadius:14, border:`1px solid ${C.border}`, overflow:"hidden", cursor: obra.slug ? "pointer" : "default", transition:"all .2s" }}
                      onMouseEnter={e => { if(obra.slug){const el=e.currentTarget as HTMLElement;el.style.transform="translateY(-3px)";el.style.boxShadow="0 8px 24px rgba(0,0,0,0.08)";el.style.borderColor=C.orange;} }}
                      onMouseLeave={e => { const el=e.currentTarget as HTMLElement;el.style.transform="none";el.style.boxShadow="none";el.style.borderColor=C.border; }}
                    >
                      <div style={{ height:140, background:`${C.blue}08`, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                        {obra.imagen_principal
                          ? <img src={obra.imagen_principal} alt={obra.titulo} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                          : <ImageIcon size={28} color={C.blue} strokeWidth={1.2} style={{ opacity:.3 }} />
                        }
                        <div style={{ position:"absolute", top:8, right:8 }}>
                          <span style={{ fontSize:11, padding:"3px 8px", borderRadius:20, background:`${est.color}dd`, color:"white", fontWeight:700 }}>{est.label}</span>
                        </div>
                      </div>
                      <div style={{ padding:"12px" }}>
                        <div style={{ fontSize:13.5, fontWeight:700, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:4 }}>{obra.titulo}</div>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                          <span style={{ fontSize:12, color:C.muted }}>{obra.categoria_nombre}</span>
                          {obra.precio_base && (
                            <span style={{ fontSize:13, fontWeight:800, color:C.orange }}>${Number(obra.precio_base).toLocaleString("es-MX")}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @media (max-width: 768px) {
          .artista-hero-row { flex-direction: column !important; align-items: flex-start !important; }
          .artista-content-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}