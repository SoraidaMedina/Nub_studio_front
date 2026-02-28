// src/pages/public/DetalleObra.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Eye, Award, Frame, Calendar, Ruler,
  User, Tag, ChevronRight, RefreshCw, ImageIcon,
  ShoppingBag, Heart, Share2, Star, CheckCircle
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const C = {
  orange:"#FF840E", blue:"#79AAF5", pink:"#CC59AD",
  purple:"#8D4CCD", gold:"#FFC110",
  text:"#1C1F26", muted:"#9CA3AF",
  bg:"#F8F6F2", surface:"#FFFFFF", border:"#E8EAF0",
};

export default function DetalleObra() {
  const navigate       = useNavigate();
  const { slug }       = useParams<{ slug: string }>();
  const [obra,    setObra]    = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [tamañoSel, setTamañoSel] = useState<any>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      setLoading(true);
      try {
        const res  = await fetch(`${API_URL}/api/obras/slug/${slug}`);
        const json = await res.json();
        if (json.success) {
          setObra(json.data);
          if (json.data.tamaños?.length > 0) setTamañoSel(json.data.tamaños[0]);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, [slug]);

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh", gap:12, color:C.muted, fontFamily:"'Outfit',sans-serif" }}>
      <RefreshCw size={22} style={{ animation:"spin 1s linear infinite" }} />
      Cargando obra…
      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

        @media (max-width: 768px) {
          .detalle-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .detalle-grid > div:last-child {
            position: static !important;
          }
          .relacionadas-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .detalles-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .relacionadas-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );

  if (!obra) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh", gap:16, fontFamily:"'Outfit',sans-serif", color:C.muted }}>
      <ImageIcon size={48} strokeWidth={1} style={{ opacity:.2 }} />
      <div style={{ fontSize:18, fontWeight:700, color:C.text }}>Obra no encontrada</div>
      <button onClick={() => navigate("/catalogo")} style={{ padding:"10px 24px", borderRadius:10, background:C.orange, color:"white", border:"none", fontWeight:700, cursor:"pointer", fontFamily:"'Outfit',sans-serif" }}>
        Ver catálogo
      </button>
    </div>
  );

  const precio = tamañoSel?.precio_base || obra.precio_base;

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Outfit',sans-serif" }}>

      {/* breadcrumb */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"12px 0" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", display:"flex", alignItems:"center", gap:8, fontSize:13, color:C.muted }}>
          <button onClick={() => navigate("/")} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, fontFamily:"'Outfit',sans-serif", fontSize:13 }}>Inicio</button>
          <ChevronRight size={13} strokeWidth={1.8} />
          <button onClick={() => navigate("/catalogo")} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, fontFamily:"'Outfit',sans-serif", fontSize:13 }}>Catálogo</button>
          <ChevronRight size={13} strokeWidth={1.8} />
          <button onClick={() => navigate(`/catalogo?categoria=${obra.id_categoria}`)} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, fontFamily:"'Outfit',sans-serif", fontSize:13 }}>{obra.categoria_nombre}</button>
          <ChevronRight size={13} strokeWidth={1.8} />
          <span style={{ color:C.text, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:200 }}>{obra.titulo}</span>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 24px" }}>
        <div className="detalle-grid" style={{ display:"grid", gridTemplateColumns:"1fr 420px", gap:40, alignItems:"start" }}>

          {/* ── izquierda: imagen ── */}
          <div>
            {/* imagen principal */}
            <div style={{ borderRadius:20, overflow:"hidden", background:`${C.blue}08`, border:`1px solid ${C.border}`, aspectRatio:"4/3", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16, position:"relative" }}>
              {obra.imagen_principal && !imgError ? (
                <img src={obra.imagen_principal} alt={obra.titulo}
                  style={{ width:"100%", height:"100%", objectFit:"contain", maxHeight:500 }}
                  onError={() => setImgError(true)}
                />
              ) : (
                <ImageIcon size={64} color={C.blue} strokeWidth={1} style={{ opacity:.2 }} />
              )}
              {/* acciones flotantes */}
              <div style={{ position:"absolute", top:16, right:16, display:"flex", flexDirection:"column", gap:8 }}>
                <button onClick={() => setLiked(!liked)} style={{ width:40, height:40, borderRadius:10, background:"white", border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.1)" }}>
                  <Heart size={16} color={liked ? C.pink : C.muted} fill={liked ? C.pink : "none"} strokeWidth={2} />
                </button>
                <button onClick={() => navigator.share?.({ title:obra.titulo, url:window.location.href })} style={{ width:40, height:40, borderRadius:10, background:"white", border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.1)" }}>
                  <Share2 size={16} color={C.muted} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* imágenes adicionales */}
            {obra.imagenes?.length > 0 && (
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {obra.imagenes.map((img: any) => (
                  <div key={img.id_imagen} style={{ width:80, height:80, borderRadius:10, overflow:"hidden", border:`2px solid ${C.border}`, cursor:"pointer" }}>
                    <img src={img.url_imagen} alt={obra.titulo} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  </div>
                ))}
              </div>
            )}

            {/* descripción */}
            <div style={{ background:C.surface, borderRadius:16, border:`1px solid ${C.border}`, padding:"24px", marginTop:20 }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:12 }}>Sobre esta obra</div>
              <p style={{ fontSize:15, color:C.text, lineHeight:1.8, margin:0 }}>{obra.descripcion || "Sin descripción disponible."}</p>
            </div>

            {/* detalles técnicos */}
            <div style={{ background:C.surface, borderRadius:16, border:`1px solid ${C.border}`, padding:"24px", marginTop:16 }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:16 }}>Detalles técnicos</div>
              <div className="detalles-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                {[
                  { icon:Tag,      label:"Categoría",   value:obra.categoria_nombre              },
                  { icon:Calendar, label:"Año",          value:obra.anio_creacion || "—"         },
                  { icon:Ruler,    label:"Dimensiones",  value: obra.dimensiones_alto && obra.dimensiones_ancho ? `${obra.dimensiones_alto} × ${obra.dimensiones_ancho} cm` : "—" },
                  { icon:Frame,    label:"Marco",        value:obra.permite_marco ? "Disponible" : "No disponible" },
                  { icon:Award,    label:"Certificado",  value:obra.con_certificado ? "Incluido" : "No incluido"  },
                  { icon:Eye,      label:"Vistas",       value:String(obra.vistas || 0)          },
                ].map(({ icon:Icon, label, value }) => (
                  <div key={label} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                    <div style={{ width:28, height:28, borderRadius:7, background:`${C.blue}10`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                      <Icon size={13} color={C.blue} strokeWidth={2} />
                    </div>
                    <div>
                      <div style={{ fontSize:11, color:C.muted, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600 }}>{label}</div>
                      <div style={{ fontSize:13.5, color:C.text, fontWeight:500, marginTop:2 }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* etiquetas */}
              {obra.etiquetas?.length > 0 && (
                <div style={{ marginTop:16, paddingTop:16, borderTop:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:11, color:C.muted, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600, marginBottom:8 }}>Etiquetas</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {obra.etiquetas.map((e: any) => (
                      <span key={e.id_etiqueta} style={{ fontSize:12, padding:"4px 12px", borderRadius:20, background:`${C.purple}10`, color:C.purple, fontWeight:600 }}>
                        {e.nombre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── derecha: compra ── */}
          <div style={{ position:"sticky", top:100 }}>

            {/* header */}
            <div style={{ marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <span style={{ fontSize:12, padding:"3px 10px", borderRadius:20, background:`${C.orange}12`, color:C.orange, fontWeight:700 }}>{obra.categoria_nombre}</span>
                {obra.con_certificado && (
                  <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, padding:"3px 10px", borderRadius:20, background:`${C.gold}12`, color:C.gold, fontWeight:700 }}>
                    <Award size={11} strokeWidth={2.5} /> Certificado
                  </span>
                )}
              </div>
              <h1 style={{ fontSize:26, fontWeight:900, color:C.text, margin:"0 0 8px", lineHeight:1.2 }}>{obra.titulo}</h1>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:`${C.pink}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <User size={13} color={C.pink} strokeWidth={2} />
                </div>
                <button onClick={() => navigate(`/artistas/${obra.id_artista}`)} style={{ fontSize:13.5, color:C.pink, fontWeight:600, background:"none", border:"none", cursor:"pointer", fontFamily:"'Outfit',sans-serif" }}>
                  {obra.artista_alias || obra.artista_nombre}
                </button>
              </div>
            </div>

            {/* precio */}
            <div style={{ background:`linear-gradient(135deg, ${C.orange}08, ${C.gold}05)`, borderRadius:14, border:`1px solid ${C.orange}20`, padding:"20px", marginBottom:16 }}>
              <div style={{ fontSize:11, color:C.muted, textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:6 }}>
                {tamañoSel ? `Precio para ${tamañoSel.tamaño_nombre}` : "Precio base"}
              </div>
              <div style={{ fontSize:34, fontWeight:900, color:C.orange, letterSpacing:"-1px", lineHeight:1 }}>
                ${Number(precio || 0).toLocaleString("es-MX")}
                <span style={{ fontSize:14, fontWeight:500, color:C.muted }}> MXN</span>
              </div>
              {obra.tamaños?.length > 0 && (
                <div style={{ fontSize:12, color:C.muted, marginTop:6 }}>IVA incluido · Envío a calcular</div>
              )}
            </div>

            {/* tamaños */}
            {obra.tamaños?.length > 0 && (
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:12, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:10 }}>Tamaño disponible</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {obra.tamaños.map((t: any) => (
                    <button key={t.id_obra_tamaño} onClick={() => setTamañoSel(t)}
                      style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px", borderRadius:10, border:`1.5px solid ${tamañoSel?.id_obra_tamaño===t.id_obra_tamaño ? C.orange : C.border}`, background: tamañoSel?.id_obra_tamaño===t.id_obra_tamaño ? `${C.orange}06` : C.surface, cursor:"pointer", fontFamily:"'Outfit',sans-serif", transition:"all .15s" }}>
                      <div style={{ textAlign:"left" }}>
                        <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{t.tamaño_nombre}</div>
                        {t.ancho_cm && <div style={{ fontSize:11.5, color:C.muted, marginTop:2 }}>{t.ancho_cm} × {t.alto_cm} cm</div>}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:14, fontWeight:800, color:C.orange }}>${Number(t.precio_base).toLocaleString("es-MX")}</span>
                        {tamañoSel?.id_obra_tamaño===t.id_obra_tamaño && <CheckCircle size={16} color={C.orange} strokeWidth={2.5} />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
              <button style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, padding:"14px", borderRadius:12, background:`linear-gradient(135deg,${C.orange},${C.gold})`, border:"none", color:"white", fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"'Outfit',sans-serif", boxShadow:`0 6px 20px ${C.orange}40`, transition:"transform .15s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform="scale(1.02)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform="scale(1)"}
              >
                <ShoppingBag size={18} strokeWidth={2.5} /> Adquirir esta obra
              </button>
              <button style={{ padding:"12px", borderRadius:12, border:`1.5px solid ${C.border}`, background:C.surface, color:C.text, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"'Outfit',sans-serif" }}>
                Solicitar más información
              </button>
            </div>

            {/* garantías */}
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { icon:Award,    color:C.gold,   text:"Certificado de autenticidad incluido" },
                { icon:CheckCircle, color:C.blue,text:"Obra verificada por Nu-B Studio"      },
                { icon:Star,     color:C.orange, text:"Artista certificado y reconocido"     },
              ].map(({ icon:Icon, color, text }) => (
                <div key={text} style={{ display:"flex", alignItems:"center", gap:10, fontSize:13, color:C.muted }}>
                  <Icon size={15} color={color} strokeWidth={2} />
                  {text}
                </div>
              ))}
            </div>

            {/* artista mini card */}
            {obra.artista_nombre && (
              <div style={{ background:C.surface, borderRadius:14, border:`1px solid ${C.border}`, padding:"16px", marginTop:20 }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.7px", marginBottom:12 }}>Sobre el artista</div>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:44, height:44, borderRadius:12, background: obra.artista_foto ? "transparent" : `${C.pink}18`, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {obra.artista_foto
                      ? <img src={obra.artista_foto} alt={obra.artista_nombre} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                      : <span style={{ fontSize:16, fontWeight:800, color:C.pink }}>{obra.artista_nombre?.[0]?.toUpperCase()}</span>
                    }
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{obra.artista_alias || obra.artista_nombre}</div>
                    {obra.artista_biografia && <div style={{ fontSize:12, color:C.muted, marginTop:3, overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{obra.artista_biografia}</div>}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* obras relacionadas */}
        {obra.obras_relacionadas?.length > 0 && (
          <div style={{ marginTop:48 }}>
            <div style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:20 }}>También te puede interesar</div>
            <div className="relacionadas-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
              {obra.obras_relacionadas.map((rel: any) => (
                <div key={rel.id_obra} onClick={() => navigate(`/obras/${rel.slug}`)}
                  style={{ background:C.surface, borderRadius:14, border:`1px solid ${C.border}`, overflow:"hidden", cursor:"pointer", transition:"all .2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform="translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform="none"; (e.currentTarget as HTMLElement).style.boxShadow="none"; }}
                >
                  <div style={{ height:140, background:`${C.blue}08`, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {rel.imagen_principal
                      ? <img src={rel.imagen_principal} alt={rel.titulo} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                      : <ImageIcon size={28} color={C.blue} strokeWidth={1.2} style={{ opacity:.3 }} />
                    }
                  </div>
                  <div style={{ padding:"12px" }}>
                    <div style={{ fontSize:13.5, fontWeight:700, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{rel.titulo}</div>
                    <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>{rel.artista_alias}</div>
                    {rel.precio_minimo && (
                      <div style={{ fontSize:14, fontWeight:800, color:C.orange, marginTop:6 }}>
                        ${Number(rel.precio_minimo).toLocaleString("es-MX")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

        @media (max-width: 768px) {
          .detalle-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .detalle-grid > div:last-child {
            position: static !important;
          }
          .relacionadas-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .detalles-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .relacionadas-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}